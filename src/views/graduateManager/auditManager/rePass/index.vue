<!--本页为科研处社科处材料审核通过的记录页面，研究生院管理员可在该页面将审核通过的材料提交给研究生院主管-->
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
          <el-form-item label="学科属性" prop="subjectType">
            <el-select
              v-model="queryParams.subjectType"
              placeholder="请选择学科属性"
              clearable
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="dict in subjectTypeOptions"
                :key="dict.code"
                :label="dict.label"
                :value="dict.code"
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
              style="width:100%"
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
        <el-col :span="6" :offset="6">
          <el-col :span="6" :offset="6">
            <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-button icon="el-icon-refresh" size="small" @click="resetQuery(queryParams)">重置</el-button>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <!-- 操作按钮 -->
    <div style="margin: 10px 0; border-bottom: 1px solid #DCDFE6; padding-bottom: 10px">
      <el-button
        type="success"
        plain
        icon="el-icon-success"
        size="small"
        :disabled="single"
        @click="passFun(34)"
      >提交至研究生院主管
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
    <!-- 审批通过的确认弹框 -->
    <el-dialog title="提示" :visible.sync="dialogVisiblePass" width="20%">
      <span>确认提交给研究生院主管吗？</span>
      <span slot="footer" type="textarea" class="dialog-footer">
        <el-button @click="dialogVisiblePass = false">取 消</el-button>
        <el-button type="primary" @click="rePassFun()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { toDetails } from '@/utils/function'
import { getInit, search } from '@/api/departmentSecretary/secretaryFirst'
import { departmentList } from '@/utils/data'

export default {
  data() {
    return {
      applyStatuss: [], // 审核状态码数组 id
      // 遮罩层
      loading: true,
      // 备注弹框显示
      dialogVisible: false,
      // 通过确认框
      dialogVisiblePass: false,
      // 显示搜索条件
      showSearch: true,
      currentPage: 1,
      // 分页总条数
      total: 0,
      // 用户表格数据
      tutorList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
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
      choose: 0,
      commit: ''
    }
  },
  created() {
    // 院系秘书复审通过的状态即研究生院管理员初审状态
    this.queryParams.applyStatus = '63-64'
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
        if (this.queryParams.applyStatus === '63-64') {
          this.queryParams.applyStatuss = ['63', '64'] // 申请状态码
        }
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
      const applyStatuss = ['63', '64']
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
          'commit_1': this.commit || '研究生院返回修改'
        }
        updateStatus[i] = json
      }
      const { code: res } = await this.$http.post(
        '/admin/update-status/update', updateStatus
      )
      if (res.code === 20000) {
        this.$message.success('操作成功!')
      }
      this.getList()
      this.commit = undefined
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
          'codeId': '63-64',
          'inspectDescribe': '全部审核通过'
        },
        {
          'codeId': 63,
          'inspectDescribe': '社科处审核通过'
        },
        {
          'codeId': 64,
          'inspectDescribe': '科研处审核通过'
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
      this.handleQuery()
    },
    // 通过
    passFun(num) {
      this.$confirm('确认提交给研究生院领导吗？')
        .then((res) => {
          this.upDateStatus(34)
        })
        .catch(() => {
          console.log('cancel')
        })
      this.choose = num
    },
    // 审核通过确认弹框确认按钮
    rePassFun() {
      // eslint-disable-next-line eqeqeq
      this.dialogVisiblePass = false
    },
    // 弹框取消按钮
    cancel() {
      this.dialogVisible = false
      this.commit = undefined
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.applyId)
      if (selection.length > 0) {
        this.single = false
        this.multiple = false
      } else {
        this.single = true
        this.multiple = true
      }
    },
    // 当前页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSecretaryInit()
    }

  }
}
</script>
