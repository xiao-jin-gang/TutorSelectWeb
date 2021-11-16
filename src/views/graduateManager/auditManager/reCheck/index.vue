<!--研究生院管理员的复审界面，研究生院管理员可在该页面查看研究生院主管的审核状态，若研究生院主管审核后，会在该页面显示-->
<template>
  <div class="app-container">
    <el-form ref="queryForm" label-width="70px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="工号">
            <el-input
              v-model="queryParams.userId"
              placeholder="请输入工号"
              clearable
              size="small"
              style="width: 100%"
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
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请类别" prop="applyType">
            <el-select
              v-model="queryParams.applyType"
              placeholder="请选择申请类别"
              clearable
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="dict in applyTypeOptions"
                :key="dict.applyTypeId"
                :label="dict.applyName"
                :value="dict.applyTypeId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-col :span="6" :offset="6">
            <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-button icon="el-icon-refresh" size="small" @click="resetQuery(queryParams)">重置</el-button>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <el-table v-loading="loading" :data="tutorList" @selection-change="handleSelectionChange">
      <el-table-column label="工号" align="center" prop="tutorId" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="所在单位（院系）" align="center" prop="organizationName" />
      <el-table-column label="申请学科或类别代码" align="center" prop="applySubject" />
      <el-table-column label="申请类别" align="center" prop="applyName" />
      <el-table-column label="职称" align="center" prop="title" />
      <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 15 || scope.row.status === 16 || scope.row.status === 17 || scope.row.status === 18" type="info">
            {{ scope.row.inspectDescribe }}
          </el-tag>
          <el-tag v-else type="warning">
            {{ scope.row.inspectDescribe }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="详情" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toDetails(scope.row.applyId, scope.row.applyTypeId, scope.row.tutorId)">查 看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="commitFun(scope.row)">添加备注</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页框 -->
    <el-row type="flex" justify="center">
      <el-pagination
        style="margin: 5px 0"
        :current-page="queryParams.pageNum"
        :page-size="queryParams.pageSize"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </el-row>
    <!-- 导出提交按钮 -->
    <el-row>
      <el-col :span="2">
        <el-button
          plain
          icon="el-icon-download"
          size="small"
          @click="exportFun()"
        >导出excel
        </el-button>
      </el-col>
    </el-row>
    <p style="margin: 10px 0; ">注意：导出上表中<span style="margin: 10px 0; color: #F56C6C">同意上校会</span>的所有数据</p>
    <!-- 提交校会的备注弹框 -->
    <el-dialog title="备注" :visible.sync="dialogVisible" width="20%">
      <span>请添加需要提交给校会的备注信息(可以为空)</span>
      <el-input v-model="commit" type="textarea" autocomplete="off" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submitCommit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

// eslint-disable-next-line no-unused-vars
import { exportQualification } from '@/api/departmentSecretary/exportExcel'
import { toDetails } from '@/utils/function'
import { getInit, search } from '@/api/departmentSecretary/secretaryFirst'

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      currentPage: 1,
      // 是否为单选
      single: false,
      // 是否为多选
      multiple: false,
      // 显示搜索条件
      showSearch: true,
      // 分页总条数
      total: 0,
      // 用户表格数据
      tutorList: [],
      // 备注弹框显示
      dialogVisible: false,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 申请类别选项
      applyTypeOptions: [],
      // 院系选项
      organizationOptions: [],
      // 学科名称选项
      subjectNameOptions: [],
      // 审核状态选项
      applyStatusOptions: [],
      // 学科属性选项
      subjectTypeOptions: [
        {
          code: 1,
          label: '文科'
        },
        {
          code: 2,
          label: '理科'
        },
        {
          code: 3,
          label: '交叉学科'
        }
      ],
      // 表单参数
      form: {
        status: 1
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: '', // 工号
        userName: '', // 姓名
        organization: '', // 院系id
        applyType: '', // 申请类别id
        subjectName: '', // 学科名称id
        applyStatus: '', // 审核状态码id
        applyStatuss: [], // 审核状态码数组 id

        subjectType: '' // 学科属性，文科，理科，交叉
      },
      commit: ''

    }
  },
  created() {
    // 研究生院管理员的复审界面，研究生院管理员可在该页面查看研究生院主管的审核状态，若研究生院主管审核后，会在该页面显示
    this.getList()
    this.getApplyType()
    // this.getOrginization()
    this.getApplyStatus()
  },
  methods: {
    // 详情页
    toDetails: function(applyId, applyTypeId, tutorId) {
      toDetails(this, applyId, applyTypeId, tutorId)
    },
    // 查询数据
    search: function() {
      if (this.queryParams.applyStatus === '' &&
        this.queryParams.userName === '' &&
        this.queryParams.organization === '' &&
        this.queryParams.applyType === '' &&
        // this.queryParams.subjectName === '' &&
        this.queryParams.subjectType === '' &&
        this.queryParams.userId === ''
      ) {
        this.getList()
      } else {
        if (this.queryParams.applyStatus === '') {
          this.queryParams.applyStatuss = ['61', '62'] // 申请状态码
        }
        this.queryParams.pageNum = 1
        search(this.queryParams, 1).then(res => {
          this.tutorList = res.data.data
          this.total = res.data.total
          this.loading = false
        }).catch(error => {
          throw error
        })
      }
    },
    /** 查询用户列表 */
    async getList() {
      this.loading = true
      const applyStatuss = ['61', '62']
      this.queryParams.pageNum = this.currentPage || 1
      getInit(0, applyStatuss, this.queryParams.pageNum).then((res) => {
        this.tutorList = res.data.data
        this.total = res.data.total
        this.loading = false
      })
    },
    async upDateStatus(code) {
      const updateStatus = []
      for (var i = 0; i < this.ids.length; i++) {
        var json = {
          'id_1': this.ids[i],
          'status_1': code,
          'commit_1': ''
        }
        updateStatus[i] = json
      }
      const { code: res } = await this.$http.post(
        '/admin/update-status/update', updateStatus
      )
      if (res === 20000) {
        this.$message.success('操作成功!')
      }
      this.getList()
    },
    async getApplyType() {
      const { data: res } = await this.$http.get(
        '/admin/apply-type/getApplyType'
      )
      this.applyTypeOptions = res
    },
    async getApplyStatus() {
      this.applyStatusOptions = [
        {
          'codeId': 14,
          'inspectDescribe': '待初审'
        },
        {
          'codeId': 34,
          'inspectDescribe': '符合条件'
        },
        {
          'codeId': 35,
          'inspectDescribe': '不符合条件'
        },
        {
          'codeId': 32,
          'inspectDescribe': '需修改'
        },
        {
          'codeId': 300,
          'inspectDescribe': '送至社科处'
        },
        {
          'codeId': 31,
          'inspectDescribe': '送至科研处'
        }
      ]
    },
    async getOrginization() {
      const { data: res } = await this.$http.get(
        '/admin/organization/getAll'
      )
      // eslint-disable-next-line eqeqeq
      this.organizationOptions = res
      console.info(this.organizationOptions)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.userId = '' // 工号
      this.queryParams.userName = '' // 姓名
      this.queryParams.applyType = '' // 申请类别id
      this.queryParams.applyStatus = '' // 审核状态码id
      this.queryParams.applyStatuss = [] // 申请类别列表
      this.queryParams.subjectType = '' // 学科属性
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.applyId)
    },
    // 当前页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    exportFun() {
      const date = new Date()
      const year = date.getFullYear() // 获取当前年份
      this.loading = true
      this.queryParams.applyStatus = 61 // 同意上校会通过
      this.queryParams.applyStatuss = ['61']
      this.queryParams.userId = ''
      exportQualification(this.queryParams).then((res) => {
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download =
          '西北大学' +
          year +
          '年' +
          '上岗资格审核汇总表.xlsx' // excel名称
        link.href = url
        link.click()
      })
      this.loading = false
    },

    // 点击备注按钮，添加备注
    commitFun(row) {
      this.dialogVisible = true
      this.commit = row.commitYjsySfh
      this.row = row
    },
    async submitCommit() {
      this.row.commitYjsySfh = this.commit
      const { code: res } = await this.$http.post(
        '/admin/update-status/updateCommitByGraduate', this.row
      )
      this.row = {}
      this.dialogVisible = false
      console.info(res)
      if (res === 20000) {
        this.$message.success('操作成功!')
      }
    }
  }
}
</script>
