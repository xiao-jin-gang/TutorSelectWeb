<!--此处为所有需要驳回给院系秘书的操作页面-->
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
          <el-form-item label="负责院系" prop="organization">
            <el-select
              v-model="queryParams.organization"
              placeholder="请选择院系"
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
        <el-col :span="6">
          <el-form-item label="审核状态" prop="applyStatus">
            <el-select
              v-model="queryParams.applyStatus"
              placeholder="请选择审核状态"
              clearable
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="dict in applyStatusOptions"
                :key="dict.codeId"
                :label="dict.inspectDescribe"
                :value="dict.codeId"
              />
            </el-select>
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
      </el-row>
      <el-row :gutter="20">
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
        <!--        <el-col :span="6">-->
        <!--          <el-form-item label="学科名称" prop="subjectName">-->
        <!--            <el-select-->
        <!--              v-model="queryParams.subjectName"-->
        <!--              placeholder="请选择学科"-->
        <!--              clearable-->
        <!--              size="small"-->
        <!--              style="width: 240px"-->
        <!--            >-->
        <!--              <el-option-->
        <!--                v-for="dict in subjectNameOptions"-->
        <!--                :key="dict.dictValue"-->
        <!--                :label="dict.dictLabel"-->
        <!--                :value="dict.dictValue"-->
        <!--              />-->
        <!--            </el-select>-->
        <!--          </el-form-item>-->

        <!--        </el-col>-->
        <el-col :span="6" :offset="12">
          <el-col :span="6" :offset="6">
            <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-button icon="el-icon-refresh" size="small" @click="resetQuery(queryParams)">重置</el-button>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin: 10px 0; border-bottom: 1px solid #DCDFE6; padding-bottom: 10px">
      <el-button
        type="danger"
        plain
        icon="el-icon-error"
        size="small"
        @click="upDateStatus(10)"
      >驳回至研究生秘书
      </el-button>

    </div>
    <el-table v-loading="loading" :data="tutorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
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
      <!-- <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="commitFun(scope.row)">添加备注</el-button>
        </template>
      </el-table-column> -->
    </el-table>
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
  </div>
</template>

<script>
import { departmentList } from '@/utils/data'

import { getInit, search } from '@/api/departmentSecretary/secretaryFirst'
import { toDetails } from '@/utils/function'

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 是否为单选
      single: false,
      currentPage: 1,
      // 是否为多选
      multiple: false,
      // 显示搜索条件
      showSearch: true,
      // 分页总条数
      total: 0,
      // 用户表格数据
      tutorList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 页码
      pageNumber: 1,
      // 日期范围
      dateRange: [],
      // 申请类别选项
      applyTypeOptions: [],
      // 所有负责院系列表
      organizationList: departmentList,
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
      }
    }
  },
  created() {
    // 研究生院管理员标记为待修改，需要驳回给秘书的数据
    this.getList()
    this.getApplyType()
    this.getOrginization()
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
        this.queryParams.subjectName === '' &&
        this.queryParams.subjectType === '' &&
        this.queryParams.userId === ''
      ) {
        this.getList()
      } else {
        if (this.queryParams.applyStatus === '') {
          this.queryParams.applyStatuss = [36, 42, 53] // 申请状态码
        }
        this.queryParams.pageNum = 1
        search(this.queryParams, this.queryParams.pageNum).then(res => {
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
      const applyStatuss = ['36', '42', '53']
      this.queryParams.pageNum = this.currentPage || 1
      getInit(0, applyStatuss, this.queryParams.pageNum).then((res) => {
        this.tutorList = res.data.data
        this.totalData = res.data.total
        this.loading = false
      })
    },
    async upDateStatus(code) {
      const updateStatus = []
      for (var i = 0; i < this.ids.length; i++) {
        var json = {
          'id_1': this.ids[i],
          'status_1': code
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
          'codeId': '',
          'inspectDescribe': '全部待驳回'
        },
        {
          'codeId': 36,
          'inspectDescribe': '需修改'
        },
        {
          'codeId': 42,
          'inspectDescribe': '社科处不通过'
        },
        {
          'codeId': 53,
          'inspectDescribe': '科研处不通过'
        }
      ]
    },
    async getOrginization() {
      const { data: res } = await this.$http.get(
        '/admin/organization/getAll'
      )
      this.organizationOptions = res
    },
    async getSubject() {
      // const { data: res } = await this.$http.get(
      //   '/apply-type/getAll'
      // )
      // if(res.code != 1000) return this.$message("获取类别失败")
      // this.applyTypeOptions = res.data
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        userId: '',
        deptId: '',
        userName: '',
        status: '0',
        remark: '',
        postIds: [],
        roleIds: []
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.userId = null // 工号
      this.queryParams.userName = null // 姓名
      this.queryParams.applyType = null // 申请类别id
      this.queryParams.applyStatus = null // 审核状态码id
      this.queryParams.applyStatuss = [] // 申请类别列表
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.applyId)
    },
    // 表格行的颜根据状态不同变化
    tableRowClassName({ row, rowIndex }) {
      if (row.inspectDescribe == '社科处审核不通过') {
        return 'warning-row'
      } else if (row.inspectDescribe == '科研处审核不通过') {
        return 'success-row'
      }
      return ''
    },
    // 当前页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    }
  }

}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
