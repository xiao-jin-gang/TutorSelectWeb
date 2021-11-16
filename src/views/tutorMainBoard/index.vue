<!--
 * @Author: Rex Joush
 * @Date: 2021-08-13 15:16:36
 * @LastEditors: Rex Joush
 * @LastEditTime: 2021-08-18 21:40:48
-->
<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">
          <span class="divider-title">申请类别选择</span>
        </el-divider>
      </el-col>
    </el-row>

    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <span style="font-size: 18px">申请博士生导师</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="7" :offset="3">
          <div>
            <el-button :disabled="isOk" class="grid-content" type="primary" @click="checkApply(1)">博士导师首次申请</el-button>
          </div>
        </el-col>
        <el-col :span="7">
          <div>
            <el-button :disabled="isOk" class="grid-content" type="primary" @click="checkApply(2)">博士导师增列岗位</el-button>
          </div>
        </el-col>
        <el-col :span="7">
          <div>
            <el-button :disabled="isOk" class="grid-content" type="primary" @click="checkApply(3)">博士导师免审申请</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <span style="font-size: 18px">申请硕士生导师（学术学位）</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="7" :offset="3">
          <div>
            <el-button :disabled="isOk" class="grid-content" type="primary" @click="checkApply(4)">学硕导师首次申请</el-button>
          </div>
        </el-col>
        <el-col :span="7">
          <div>
            <el-button :disabled="isOk" class="grid-content" type="primary" @click="checkApply(5)">学硕导师增列岗位</el-button>
          </div>
        </el-col>
        <el-col :span="7">
          <div>
            <el-button :disabled="isOk" class="grid-content" type="primary" @click="checkApply(6)">学硕导师免审申请</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <span style="font-size: 18px">申请硕士生导师（专业学位）</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="7" :offset="3">
          <div>
            <el-button :disabled="isOk" class="grid-content" type="primary" @click="checkApply(7)">专硕导师首次申请</el-button>
          </div>
        </el-col>
        <el-col :span="7">
          <div>
            <el-button :disabled="isOk" class="grid-content" type="primary" @click="checkApply(8)">专硕导师增列岗位</el-button>
          </div>
        </el-col>
        <el-col :span="7">
          <div>
            <el-button :disabled="isOk" class="grid-content" type="primary" @click="checkApply(9)">专硕导师免审申请</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>

import { checkApply, getOrganizationTime } from '@/api/tutor/mainboard'
import { getEndTime, getOrganizationId, getStartTime } from '@/utils/function'

export default {
  data() {
    return {
      isOk: true // 时间控制
    }
  },
  created() {
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
            this.$alert('当前时间不在系统时间范围内，无法申请', '注意')
          } else {
            this.isOk = false
          }
        }).catch(error => {
          throw error
        })
    },

    /*
      101：已经申请过此岗位，但信息未填写完成
      100：已经申请过此岗位，且信息已提交完成
      102：未申请过此岗位
    */

    // 检测申请状态函数
    checkApply: function(type) {
      checkApply(type).then((res) => {
        let url = ''
        switch (type) {
          case 1:
            url += `firstApplyDoctor/1`
            break
          case 2:
            url += `addApplyDoctor/2`
            break
          case 3:
            url += `noInspectApplyDoctor/3`
            break
          case 4:
            url += `firstApplyMaster/4`
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
            url += `noInspectApplyProfessional/9`
        }

        // 查询出来的状态为 0，老师可以进去修改
        if (res.data.applyCondition === 101) {
          url += `/101/${res.data.applyId}`
          this.$router.push(url)
        } else if (res.data.applyCondition === 102) {
          // 没有申请过此岗位
          url += `/102/${res.data.applyId}`
          this.$router.push(url)
        } else {
          // 已交过该申请，首次仅允许一次，非首次允许继续填写
          if (type === 1 || type === 4 || type === 7) {
            this.$confirm('您已提交过此类申请，此类申请仅允许提交一次，请前往我的申请中查看！', '提示').then(
              () => {
                this.$router.push('/myApply') // 去我的申请页面
              }
            ).catch(() => {
              console.log('cancel')
            })
          } else {
            this.$confirm('您已提交过此类申请，是否继续填写新的此类申请？', '提示')
              .then(() => {
                url += `/102/${res.data.applyId}`
                this.$router.push(url)
              }
              ).catch(() => {
                console.log('cancel')
              })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin: 20px;
}

.el-row {
  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

/*
  申请类别选择
*/
.bg-purple-dark {
  background: #99a9bf;
  font-size: 30px;
  line-height: 50px;
  height: 50px;
  margin-bottom: 30px;
}

/* button按钮 */
.grid-content {
  border-radius: 4px;
  min-height: 80px;
  height: 60px;
  // background-color: #304156;
}

/*
  el-card 卡片
*/
.box-card {
  margin-bottom: 20px;
}
</style>
