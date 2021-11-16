<!--本页为研究生院管理员的初审界面，研究生院管理员可在该页面将院系秘书复审通过的导师信息进行审核-->
<template>
  <div class="app-container">
    <!-- 搜索部分 -->
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
        <!-- <el-col :span="6">
          <el-form-item label="学科名称" prop="subjectName">
            <el-select
              v-model="queryParams.subjectName"
              placeholder="请选择学科"
              clearable
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="dict in subjectNameOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

        </el-col> -->
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
          <el-row>
            <el-col :span="6" :offset="6">
              <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-button icon="el-icon-refresh" size="small" @click="resetQuery(queryParams)">重置</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>

    <!-- 操作按钮 -->
    <div style="margin: 10px 0; border-bottom: 1px solid #DCDFE6; padding-bottom: 10px">
      <el-button type="success" plain icon="el-icon-success" size="small" :disabled="single" @click="passFun(3)">符合条件
      </el-button>
      <el-button type="danger" plain icon="el-icon-error" size="small" :disabled="multiple" @click="passFun(4)">不符合条件
      </el-button>
      <el-button type="warning" plain icon="el-icon-success" size="small" :disabled="multiple" @click="passFun(1)">送审社科处
      </el-button>
      <el-button type="warning" plain icon="el-icon-success" size="small" :disabled="multiple" @click="passFun(2)">送审科研处
      </el-button>
      <el-button type="danger" plain icon="el-icon-edit" size="small" :disabled="multiple" @click="passFun(5)">驳回至院系
      </el-button>
    </div>

    <!-- 数据部分 -->
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
          <!-- todo 此处修改为自己的状态码，dynamic -->
          <!-- 符合条件 -->
          <el-tag v-if="scope.row.status === 388" type="success">{{ scope.row.inspectDescribe }}</el-tag>
          <!-- 不符合条件 -->
          <el-tag v-else-if="scope.row.status === 399" type="danger"> {{ scope.row.inspectDescribe }}</el-tag>
          <!-- 初审待定 -->
          <el-tag v-else-if="scope.row.status === 17" type="warning"> {{ scope.row.inspectDescribe }}</el-tag>
          <!-- 科研处通过 -->
          <el-tag v-else-if="scope.row.status === 64" type="success"> {{ scope.row.inspectDescribe }}</el-tag>
          <!-- 社科处通过 -->
          <el-tag v-else-if="scope.row.status === 63" type="success"> {{ scope.row.inspectDescribe }}</el-tag>
          <!-- 科研处不通过 -->
          <el-tag v-else-if="scope.row.status === 53" type="danger"> {{ scope.row.inspectDescribe }}</el-tag>
          <!-- 社科处不通过 -->
          <el-tag v-else-if="scope.row.status === 42" type="danger"> {{ scope.row.inspectDescribe }}</el-tag>
          <!-- 驳回至院系 -->
          <el-tag v-else-if="scope.row.status === 37" type="danger"> {{ scope.row.inspectDescribe }}</el-tag>
          <p v-else>{{ scope.row.inspectDescribe }}</p>
        </template>
      </el-table-column>
      <el-table-column label="详情" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toDetails(scope.row.applyId, scope.row.applyTypeId, scope.row.tutorId)">查 看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" width="160px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="commitFun(scope.row)">添加备注</el-button>
          <el-button type="text" size="small" @click="findFun(scope.row)">查看备注</el-button>

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
    <el-row>
      <!-- <el-col :span="2">
        <el-button
          plain
          icon="el-icon-download"
          size="small"
          @click="exportFun()"
        >导出excel
        </el-button>
      </el-col> -->
      <el-col :span="2" :offset="22">
        <el-button
          type="success"
          plain
          size="small"
          icon="el-icon-success"
          @click="submitFun()"
        >提交
        </el-button>
      </el-col>
    </el-row>
    <!-- 备注弹框 -->
    <el-dialog title="备注" :visible.sync="dialogVisible" width="20%">
      <span>请添加提交给操作的备注信息(可以为空)</span>
      <el-input v-model="commitYjsyCs" type="textarea" autocomplete="off" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submitCommit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getInit, search } from '@/api/departmentSecretary/secretaryFirst'
import { toDetails } from '@/utils/function'

// 负责院系
import { departmentList } from '@/utils/data'

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 备注弹框显示
      dialogVisible: false,
      // 通过确认框
      dialogVisiblePass: false,
      // 提交确认框
      dialogVisibleSubmit: false,
      currentPage: 1,
      // 分页总条数
      total: 0,

      // 所有负责院系列表
      organizationList: departmentList,
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
      choose: 0,
      commitYjsyCs: '',
      row: {},
      currentSelection: []
    }
  },
  created() {
    // 院系秘书复审通过的状态即研究生院管理员初审状态
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
      this.queryParams.pageNum = 1
      if (this.queryParams.applyStatus === '' &&
        this.queryParams.userId === '' &&
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
          this.queryParams.applyStatuss = ['25', '388', '399', '42', '53', '63', '64'] // 申请状态码
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
    getList: async function() {
      if ((this.queryParams.applyStatus === '' &&
        this.queryParams.userName === '' &&
        this.queryParams.organization === '' &&
        this.queryParams.applyType === '' &&
        this.queryParams.subjectName === '' &&
        this.queryParams.subjectType === '' &&
        this.queryParams.userId === '')) {
        const applyStatuss = ['25', '388', '399', '42', '53', '63', '64'] // 申请状态码
        this.loading = true
        this.queryParams.pageNum = this.currentPage || 1
        getInit(0, applyStatuss, this.queryParams.pageNum).then((res) => {
          this.tutorList = res.data.data
          this.total = res.data.total
          this.loading = false
        })
      } else {
        this.queryParams.pageNum = this.currentPage || 1
        search(this.queryParams, this.queryParams.pageNum).then(res => {
          this.tutorList = res.data.data
          this.total = res.data.total
          this.loading = false
        }).catch(error => {
          throw error
        })
      }
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
      this.commitYjsyCs = ''
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
          'codeId': 25,
          'inspectDescribe': '待初审'
        },
        {
          'codeId': 37,
          'inspectDescribe': '驳回至院系'
        },
        {
          'codeId': 388,
          'inspectDescribe': '符合条件'
        },
        {
          'codeId': 399,
          'inspectDescribe': '不符合条件'
        },
        {
          'codeId': 30,
          'inspectDescribe': '送至社科处'
        },
        {
          'codeId': 31,
          'inspectDescribe': '送至科研处'
        },
        {
          'codeId': 63,
          'inspectDescribe': '社科处审核通过'
        },
        {
          'codeId': 64,
          'inspectDescribe': '科研处审核通过'
        },
        {
          'codeId': 42,
          'inspectDescribe': '社科处审核不通过'
        },
        {
          'codeId': 53,
          'inspectDescribe': '科研处审核不通过'
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
      // this.applyTypeOptions = res
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
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.userId = '' // 工号
      this.queryParams.userName = '' // 姓名
      this.queryParams.applyType = '' // 申请类别id
      this.queryParams.applyStatus = '' // 审核状态码id
      this.queryParams.applyStatuss = [] // 申请类别列表
      this.queryParams.organization = '' // 院系
      this.queryParams.subjectType = '' // 学科属性
      // this.handleQuery()
    },
    // 初审通过
    passFun(num) {
      if (num === 1) {
        // 送审社科处
        this.$confirm('确认送审社科处吗？')
          .then((res) => {
            this.upDateStatus(30)
          })
          .catch(() => {
            console.log('cancel')
          })
      }
      if (num === 2) {
        // 送审社科处
        this.$confirm('确认送审科研处吗？')
          .then((res) => {
            this.upDateStatus(31)
          })
          .catch(() => {
            console.log('cancel')
          })
      }
      if (num === 3) {
        // 符合条件 中间状态 变更记录状态为符合条件点击提交按钮后统一提交给研究院主管
        this.$confirm('确认修改为符合条件吗？')
          .then((res) => {
            this.upDateStatus(388)
          })
          .catch(() => {
            console.log('cancel')
          })
      }
      if (num === 4) {
        // 不符合条件 中间状态 变更记录状态为不符合条件 点击提交按钮后统一提交给研究院主管
        this.$confirm('确认修改为不符合条件吗？')
          .then((res) => {
            this.upDateStatus(399)
          })
          .catch(() => {
            console.log('cancel')
          })
      }
      if (num === 5) {
        // 需修改，驳回给院系秘书
        this.$confirm('确认驳回给院系秘书吗？')
          .then((res) => {
            this.upDateStatus(37)
          })
          .catch(() => {
            console.log('cancel')
          })
      }
    },
    async submitCommit() {
      this.row.commitYjsyCs = this.commitYjsyCs
      const { code: res } = await this.$http.post(
        '/admin/update-status/updateCommitByGraduate', this.row
      )
      if (res === 20000) {
        this.$message.success('操作成功!')
      }
      this.row = {}
      this.dialogVisible = false
    },
    // 审核通过确认弹框确认按钮
    rePassFun(num) {
      if (num === 1) {
        if (this.choose === 1) {
          // 送审社科处
          this.$confirm('确认送审社科处吗？')
            .then((res) => {
              this.upDateStatus(30)
            })
            .catch(() => {
              console.log('cancel')
            })
        }
        if (this.choose === 2) {
        // 送审社科处
          this.$confirm('确认送审科研处吗？')
            .then((res) => {
              this.upDateStatus(31)
            })
            .catch(() => {
              console.log('cancel')
            })
        }
        if (this.choose === 3) {
          // 符合条件 中间状态 变更记录状态为符合条件点击提交按钮后统一提交给同意上校会
          this.$confirm('确认修改为符合条件吗？')
            .then((res) => {
              this.upDateStatus(388)
            })
            .catch(() => {
              console.log('cancel')
            })
        }
        if (this.choose === 4) {
          // 不符合条件 中间状态 变更记录状态为不符合条件 点击提交按钮后统一变为同意上校会
          this.$confirm('确认修改为不符合条件吗？')
            .then((res) => {
              this.upDateStatus(399)
            })
            .catch(() => {
              console.log('cancel')
            })
        }
        if (this.choose === 5) {
          // 需修改，送至驳回页面
          this.$confirm('确认驳回给院系秘书吗？')
            .then((res) => {
              this.upDateStatus(10)
            })
            .catch(() => {
              console.log('cancel')
            })
        }
      } else {
        // 点击了提交按钮的确认，将符合条件以及不符合条件的一起提交给研究生院主管
        // this.submitUpdate()
      }
      this.dialogVisiblePass = false
    },
    // 研究生院管理员提交按钮，一次修改两个状态 将符合条件以及不符合条件的一起提交给研究生院主管，将需修改的推送到驳回页面
    async submitUpdate() {
      // eslint-disable-next-line no-unused-vars
      const { code: res } = await this.$http.post(
        '/admin/update-status/submitUpdate'
      )
      if (res === 20000) {
        this.$message.success('操作成功!')
      }
      // this.dialogVisibleSubmit = false
      this.getList()
    },
    // 初审不通过
    unPassFun() {
      // 驳回之前判断是否只选择了一条
      if (this.ids.length > 1) {
        this.$message.warning('注意:只能选择一条数据审核！')
      } else {
        this.dialogVisible = true
      }
    },
    // 弹框确定按钮驳回操作
    returnFun() {
      // 带上备注
      this.upDateStatus(36)
      this.dialogVisible = false
    },
    // 弹框取消按钮
    cancel() {
      this.dialogVisible = false
      this.commitYjsyCs = ''
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
      this.getList()
    },
    // 点击备注按钮，添加备注
    commitFun(row) {
      this.dialogVisible = true
      this.commitYjsyCs = row.commitYjsyCs
      this.row = row
    },
    // 点击查看备注按钮，查看来自社科处或者科研处审核后的备注
    findFun(row) {
      this.$alert('' + row.commitSocial, '社科处/科研处备注', {
        confirmButtonText: '确定',
        callback: action => {
        }
      })
    },
    // 提交按钮的方法
    submitFun() {
      // this.dialogVisibleSubmit = true
      this.$confirm('确认同意所有符合条件的信息上校会吗？')
        .then((res) => {
          this.submitUpdate()
        })
        .catch(() => {
          console.log('cancel')
        })
    }

  }
}
</script>
