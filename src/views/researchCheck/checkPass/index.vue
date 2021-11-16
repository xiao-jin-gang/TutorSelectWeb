<!--
 * @Description: your project
 * @version: 1.0
 * @Author: Anna
 * @Date: 2021-08-19 18:31:23
 * @LastEditors: Anna
 * @LastEditTime: 2021-10-29 20:55:40
-->
<template>
  <div class="app-container">
    <!-- 搜索部分 -->
    <el-form v-show="showSearch" ref="queryForm" label-width="70px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="工号">
            <el-input
              v-model="queryParams.userId"
              placeholder="请输入工号"
              clearable
              size="small"
              style="width: 100%"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="姓名">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入姓名"
              clearable
              size="small"
              style="width: 100%"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="负责院系" prop="organization">
            <el-select
              v-model="queryParams.organization"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="item in organizationList"
                :key="item.departmentId"
                :label="item.organizationName"
                :value="item.departmentId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 搜索、重置按钮 -->
        <el-col :span="2" :offset="2">
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchQuery()">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery(queryParams)">重置</el-button>
        </el-col>
      </el-row>

    </el-form>
    <br>

    <!-- 数据部分 -->
    <el-table ref="singleTable" :data="tutorList" highlight-current-row :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
      <el-table-column label="序号" type="index" width="50" fixed />
      <el-table-column label="工号" align="center" prop="tutorId" width="100" fixed />
      <el-table-column label="姓名" align="center" prop="name" width="100" fixed />
      <el-table-column label="所在单位（院系）" align="center" prop="organizationName" width="150" fixed />
      <el-table-column label="申请类别" align="center" prop="applyName" />
      <el-table-column label="职称" align="center" prop="title" width="100" />
      <!-- 数据库中查询最后学位字段 -->
      <el-table-column label="最后学位" align="center" prop="finalDegree" />
      <el-table-column label="审核状态" align="center" width="130">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 53 || scope.row.status === 64" type="info">
            {{ scope.row.inspectDescribe }}
          </el-tag>
          <el-tag v-else type="warning">
            科研处待审核
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="备注" align="center" prop="commitSocial">
      </el-table-column>
    </el-table>

    <!-- 分页框 -->
    <el-row type="flex" justify="center">
      <el-pagination
        style="margin: 10px 0"
        :current-page="queryParams.pageNum"
        :page-size="queryParams.pageSize"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </el-row>

    <!-- 审批通过的确认弹框 -->
    <el-dialog title="提示" :visible.sync="dialogVisiblePass" width="30%">
      <span>确认提交吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePass = false">取 消</el-button>
        <el-button type="primary" @click="rePassFun()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 驳回时的备注弹框 -->
    <el-dialog title="备注" :visible.sync="dialogVisible" width="30%">
      <span>请输入驳回理由(可以为空)</span>
      <el-input v-model="returnCommit" autocomplete="off" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="returnFun()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getInit, // 初始化数据
  search,
  updateSocial // 更新操作
} from '@/api/departmentSecretary/secretaryFirst'

// 负责院系
import { departmentList } from '@/utils/data'

export default {
  data() {
    return {
      searchFlag: false,
      // 驳回时备注的内容
      returnCommit: '',
      // 驳回弹框默认不显示
      dialogVisible: false,
      // 通过确认框
      dialogVisiblePass: false,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 分页总条数
      total: 0,
      // 待科研处初审列表
      researchInitList: [],
      // 所有负责院系列表
      organizationList: departmentList,
      // 选定的列表
      multipleSelection: [],
      // 查询参数
      queryParams: {
        pageNum: 1, // 当前页
        pageSize: 10, // 每页最大条数
        userId: '', // 工号
        userName: '', // 姓名
        organization: '', // 院系id
        applyType: '', // 申请类别id
        subjectName: '', // 学科名称id
        applyStatus: '', // 审核状态码id
        applyStatuss: [], // 审核状态码数组 id
        subjectTpe: '' // 学科属性，文科、理科、交叉
      },
      // 当前页
      // currentPage: 1,
      // 科研处审核状态
      statusOptions: [
        {
          value: 64, // 理科科研处审核通过
          label: '科研处审核通过'
        }
      ],
      // 审核后需要下发的List数据
      updataList: [],
      tutorList: []
    }
  },
  created() {
    this.getResearchCheckInit() // 初始化待初审的数据
    this.searchFlag = true
  },
  methods: {
    // 高亮当前行
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    // 高亮表格
    tableRowClassName() {
      // 详情页返回时让该行高亮
      this.applyId = this.$route.query.applyId
      if (this.applyId !== undefined) {
        this.tutorList.forEach((row) => {
          if (row.applyId === this.applyId) {
            this.setCurrent(row)
          }
        })
      } else {
        console.log('无状态')
      }
    },
    // 查看详情
    handleDetail(row) {
      const tutorId = row.tutorId
      const applyId = row.applyId
      const name = row.name
      // console.log(row);
      this.$router.push({
        path: '/research/researchDetail',
        query: { tutorId: tutorId, applyId: applyId, name: name }
      })
    },

    // 查询科研处待初审的数据
    // 通过状态码查询
    getResearchCheckInit() {
      this.queryParams.applyStatus = 64
      getInit(0, this.queryParams.applyStatus, this.queryParams.pageNum).then((res) => {
        this.tutorList = res.data.data
        this.total = res.data.total
      })
    },

    // 搜索按钮
    searchQuery() {
      if (this.queryParams.applyStatus === '' &&
          this.queryParams.userName === '' &&
          this.queryParams.organization === '' &&
          this.queryParams.applyType === '' &&
          this.queryParams.subjectName === '' &&
          this.queryParams.subjectType === ''
      ) {
        this.getResearchCheckInit()
      } else {
        if (this.queryParams.applyStatus === '') {
          this.queryParams.applyStatuss = ['64'] // 申请状态码
        }
        search(this.queryParams, 1).then((res) => {
          this.tutorList = res.data.data
          this.total = res.data.total
        }).catch(error => {
          throw error
        })
      }
    },

    // 重置按钮
    resetQuery() {
      this.queryParams.userId = ''
      this.queryParams.userName = ''
      this.queryParams.organization = ''
      this.queryParams.applyStatus = 64
      this.queryParams.applyStatuss = [] // 申请类别列表
    },
    // 初审通过
    passFun() {
      this.dialogVisiblePass = true
    },
    // 审核通过确认弹框确认按钮
    rePassFun() {
      this.check(64)
      this.dialogVisiblePass = false
      window.location.reload() // 重新加载页面
    },
    // 初审不通过
    unPassFun() {
      // 驳回之前判断是否只选择了一条
      if (this.multipleSelection.length > 1) {
        this.$message.warning('注意:只能选择一条数据审核！')
      } else {
        this.dialogVisible = true
      }
    },
    // 弹框确定按钮驳回操作
    returnFun() {
      // 备注
      this.updataList[0].commit_1 = this.returnCommit
      this.check(53)
      this.dialogVisible = false
      this.returnCommit = null
      window.location.reload() // 重新加载页面
    },

    // 弹框取消按钮
    cancel() {
      this.dialogVisible = false
      this.returnCommit = null
    },

    // 更新操作
    check(status) {
      for (let index = 0; index < this.updataList.length; index++) {
        this.updataList[index].status_1 = status
      }
      updateSocial(this.updataList).then((res) => {
        if (res.code === 20000) {
          this.$message.success('审核成功')
        }
        this.updataList.length = 0
        this.resetQuery()
        this.getSecretaryInit()
      })
    },

    // 当前选中
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.multiple = false
      } else {
        this.multiple = true
      }
      this.multipleSelection = val
      // 每次选择都要将之前的清空
      this.updataList = []
      // 将需要审核后下发的数据对应起来
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const obj = { id_1: 0, status_1: 0, commit_1: '' }
        obj.id_1 = this.multipleSelection[index].applyId
        obj.status_1 = this.multipleSelection[index].status
        obj.commit_1 = ''
        this.updataList.push(obj)
      }
    },

    // 当前页数
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getResearchCheckInit()
    }
  }
}
</script>
