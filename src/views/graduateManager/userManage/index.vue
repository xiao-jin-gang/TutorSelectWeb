<template>
  <div class="app-container">

    <!-- 搜索部分 -->
    <el-form ref="queryForm" label-width="70px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 100%"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工号" prop="tutorId">
            <el-input
              v-model="queryParams.tutorId"
              placeholder="请输入用户工号"
              clearable
              size="small"
              style="width: 100%"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="角色" prop="roleName">
            <el-select
              v-model="queryParams.roleId"
              placeholder="用户角色"
              clearable
              size="small"
              style="width: 100%"
            >
<!--              <el-option label="导师" value="1" />-->
              <el-option label="院系秘书" value="2" />
              <el-option label="研究生院管理员" value="4" />
<!--              <el-option label="研究生院学硕管理员" value="5" />-->
              <el-option label="社科处管理员" value="6" />
              <el-option label="科研处管理员" value="7" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-col :span="6" :offset="6">
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="20">
      <!--用户表格部分-->
      <el-col>
        <el-row :gutter="10" class="mb8">
          <el-col :span="2">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="userList">
          <!--          <el-table-column type="selection" align="center" />-->
          <el-table-column type="index" align="center" width="60" />
          <el-table-column label="学工号" align="center" prop="tutorId" />
          <el-table-column label="姓名" align="center" prop="name" />
          <el-table-column label="院系" align="center" prop="organizationName" />
          <el-table-column label="用户角色" align="center" prop="roleName" />
          <el-table-column label="创建时间" align="center" prop="createTime" />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding"
          >
            <template v-if="scope.row.userId !== 1" slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row.tutorId)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center">
          <el-pagination
            v-show="total > 0"
            style="margin: 5px 0"
            :current-page="queryParams.pageNum"
            :page-size="queryParams.pageSize"
            layout="total, prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-col>
    </el-row>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="!isEdit? '添加用户' : '编辑用户'" :visible.sync="open">
      <el-form ref="form" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学工号">
              <el-autocomplete
                v-model="tutorId"
                class="inline-input"
                :fetch-suggestions="querySearch"
                placeholder="请输入学工号"
                :trigger-on-focus="false"
                style="width: 100%"
                :disabled="isEdit"
                @select="handleSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户姓名" style="width: 100%" prop="name">
              <p v-text="name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="roleId" filterable placeholder="请选择" style="width: 100%">
<!--                <el-option label="导师" value="1" />-->
                <el-option label="院系秘书" value="2" />
                <el-option label="研究生院管理员" value="4" />
<!--                <el-option label="研究生院学硕管理员" value="5" />-->
                <el-option label="社科处管理员" value="6" />
                <el-option label="科研处管理员" value="7" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构">
              <p v-text="organizationName" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="commitSystemUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  getQueryTutorId,
  getSystemUsers,
  getSystemUserByTutorId,
  addSystemUser,
  editSystemUser, deleteSystemUser
} from '@/api/graduateManager/systemUser'

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 是否为单选
      single: false,
      // 分页总条数
      total: 0,
      // 用户表格数据
      userList: [],
      // 弹出编辑层
      isEdit: false,
      // 是否显示弹出层
      open: false,
      currentPage: 1,
      // 状态数据字典
      statusOptions: [
        {
          dictLabel: '启用',
          dictValue: 0
        },
        {
          dictLabel: '禁用',
          dictValue: 1
        }
      ],
      // 院系选项
      organizationOptions: [],
      // 表单参数
      tutorId: '',
      name: '',
      organizationName: '',
      roleId: '',

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tutorId: '',
        name: '',
        roleId: ''
      },
      user: null
    }
  },
  created() {
    this.getList()
    // this.getRole()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      this.queryParams.pageNum = this.currentPage || 1
      getSystemUsers(this.queryParams).then(res => {
        this.userList = res.data.users
        this.total = res.data.total
        this.loading = false
      }).catch(error => {
        throw error
      })
    },

    /* 添加用户，输入工号查询 */
    querySearch(queryString, cb) {
      this.name = ''
      this.organizationName = ''
      getQueryTutorId(queryString).then(res => {
        const results = []
        res.data.forEach(item => {
          results.push({ 'value': item })
        })
        cb(results)
      })
      // const restaurants = this.restaurants
      // const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // // 调用 callback 返回建议列表的数据
    },
    /* 选定用户，填写信息 */
    handleSelect(item) {
      getSystemUserByTutorId(item.value).then(res => {
        this.organizationName = res.data.organizationName
        this.name = res.data.name
        this.user = res.data
      }).catch(error => {
        throw error
      })
    },

    /* 添加用户的提交按钮 */
    commitSystemUser() {
      // 编辑用户
      if (this.isEdit) {
        editSystemUser(this.tutorId, this.roleId).then(res => {
          if (res.code === 20000) {
            this.open = false
            this.$message.success('修改成功')
            this.tutorId = ''
            this.name = ''
            this.organizationName = ''
            this.roleId = ''
            this.getList()
          }
        })
      } else {
        // 添加用户
        if (this.user !== null && this.roleId !== '') {
          addSystemUser(this.user, this.roleId).then(res => {
            if (res.code === 20001) {
              this.$message.warning('此用户已经存在，若需修改权限，请在页面中修改')
            } else {
              this.$message.success('添加成功！')
            }
            this.open = false
            this.tutorId = ''
            this.name = ''
            this.organizationName = ''
            this.roleId = ''
            this.user = null
            this.getList()
          }).catch(error => {
            throw error
          })
        } else {
          this.$message.error('请填写信息')
        }
      }
    },

    // 用户状态修改
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        status: '0',
        remark: undefined,
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
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        tutorId: '',
        name: '',
        roleId: ''
      }
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.isEdit = false
    },
    /** 修改按钮操作 */
    handleEdit(row) {
      this.isEdit = true
      this.open = true
      this.tutorId = row.tutorId
      this.name = row.name
      this.roleId = row.roleId + ''
      this.organizationName = row.organizationName
    },

    /** 删除按钮操作 */
    handleDelete(tutorId) {
      this.$confirm('是否确认删除？删除不可撤销，请谨慎操作"！', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSystemUser(tutorId).then(res => {
          if (res.code === 20000) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      })
    },
    // 当前页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    }
  }
}
</script>
