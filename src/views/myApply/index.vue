<!--
 * @Author: Rex Joush
 * @Date: 2021-09-03 15:03:39
 * @LastEditors: Rex Joush
 * @LastEditTime: 2021-09-03 15:13:20
-->
<template>
  <div class="main">
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">
          <span class="divider-title">我的申请</span>
        </el-divider>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="applyList" stripe style="width: 100%;" element-loading-text="获取中...">
      <el-table-column align="center" type="index" width="50" label="序号" />
      <el-table-column align="center" prop="applyName" label="申请类别" />
      <el-table-column align="center" prop="applyDepartment" label="申请负责单位" />
      <el-table-column align="center" prop="applySubject" label="申请学科" />
      <el-table-column align="center" prop="statusDisplay" label="当前状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="warning">
            需继续填写，未完成
          </el-tag>
          <el-tag v-else-if="scope.row.status === 6" type="success">
            已填写完成，待提交
          </el-tag>
          <el-tag v-else-if="scope.row.status === 14" type="danger">
            被院系驳回，待修改
          </el-tag>
          <el-tag v-else type="info">
            已提交审核，请等待
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注信息" width="130">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 14"
            size="mini"
            type="danger"
            plain
            @click="watchCommit(scope.row)"
          >查看修改意见
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status !== 14 && scope.row.status !== 0"
            size="mini"
            type="primary"
            plain
            @click="toApplyDetails(scope.row)"
          >查 看
          </el-button>
          <el-button
            v-if="scope.row.status === 14"
            :disabled="isOk"
            size="mini"
            type="danger"
            plain
            @click="editApply(scope.row)"
          >修 改
          </el-button>
          <el-button
            v-else-if="scope.row.status === 0"
            :disabled="isOk"
            size="mini"
            type="warning"
            plain
            @click="editApply(scope.row)"
          >
            填 写
          </el-button>
          <el-button
            v-else-if="scope.row.status === 6"
            :disabled="isOk"
            size="mini"
            type="success"
            plain
            @click="submitApply(scope.row)"
          >
            提交
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 备注信息 -->
    <el-dialog
      title="修改意见"
      :visible.sync="dialogVisible"
      width="40%"
      :show-close="false"
      center
    >
      <el-descriptions :column="1" border class="margin-top" label-class-name="commit">
        <el-descriptions-item label="院系意见"><span style="white-space: pre-wrap;"> {{ commit }} </span></el-descriptions-item>
        <el-descriptions-item label="研究生院意见"><span style="white-space: pre-wrap;"> {{ commitGraduate }} </span></el-descriptions-item>
        <el-descriptions-item label="社科处意见"><span style="white-space: pre-wrap;"> {{ commitSocial }} </span></el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { changeStatus, getApplyList } from '@/api/tutor/myApply'

import { getEndTime, getOrganizationId, getStartTime, toDetails } from '@/utils/function'
import { getOrganizationTime } from '@/api/tutor/mainboard'

export default {
  name: 'Index',
  data() {
    return {
      dialogVisible: false, // 备注框
      isOk: true, // 时间控制
      loading: false, // 申请的加载态
      applyList: [], // 我的申请列表

      // 修改意见
      commit: '',
      commitSocial: '',
      commitGraduate: ''
    }
  },
  created() {
    this.getApplyList()
    this.loading = true
    this.getOrganizationTime()
  },
  methods: {

    // 获取当前院系的时间，是否在时间有效期内
    getOrganizationTime: function() {
      const organizationId = getOrganizationId()
      getOrganizationTime(organizationId)
        .then((res) => {
          const currentDate = new Date() // 获取当前时间;
          const begin = getStartTime(res.data.startTime) // 北京时间八点
          const end = getEndTime(res.data.endTime)
          if (currentDate > end || currentDate < begin) {
            // 若当前时间不在系统的设置时间范围内，则提交按钮不可以操作
            // 提交按钮置灰
            this.isOk = true
            this.$alert('当前时间不在系统时间范围内，无法进行修改、填写或提交', '注意')
          } else {
            this.isOk = false
          }
        }).catch(error => {
          throw error
        })
    },

    // 获取我的申请
    getApplyList: function() {
      getApplyList()
        .then(res => {
          this.applyList = res.data
          this.loading = false
        })
        .catch(error => {
          throw error
        })
    },

    // 提交申请的信息
    submitApply: function(value) {
      this.$alert('请务必点击查看，确认信息填写正确后再提交，提交后不可修改！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeStatus(value.applyId, 2).then(res => {
          if (res.code === 1201) {
            this.$message.error(res.data.message())
          } else {
            this.$message.success('提交成功！')
            this.getApplyList()
          }
        })
      }).catch(() => {
        console.log('cancel')
      })
    },

    // 修改信息
    editApply: async function(value) {
      let url = 'tutorApply/'
      switch (value.applyTypeId) {
        case 1:
          url += `firstApplyDoctor/1`
          await changeStatus(value.applyId, 1)
          break
        case 2:
          url += `addApplyDoctor/2`
          break
        case 3:
          url += `noInspectApplyDoctor/3`
          break
        case 4:
          url += `firstApplyMaster/4`
          await changeStatus(value.applyId, 1)
          break
        case 5:
          url += `addApplyMaster/5`
          break
        case 6:
          url += `noInspectApplyMaster/6`
          break
        case 7:
          url += `firstApplyProfessional/7`
          break
        case 8:
          url += `addApplyProfessional/8`
          break
        case 9:
          url += 'noInspectApplyProfessional/9'
      }
      // console.log(`${url}/101/${value.applyId}`)
      this.$router.push(`${url}/101/${value.applyId}`)
    },

    // 查看修改意见
    watchCommit(value) {
      this.dialogVisible = true
      this.commit = value.commit
      this.commitSocial = value.commitSocial
      this.commitGraduate = value.commitGraduate
    },

    // 查看申请信息
    toApplyDetails: function(apply) {
      toDetails(this, apply.applyId, apply.applyTypeId, apply.tutorId, apply.status)
    }
  }

}
</script>
<style>
.commit {
  width: 20%;
  text-align: center !important;
}
</style>
