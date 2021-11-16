<!--
 * @Description: your project
 * @version: 1.0
 * @Author: Anna
 * @Date: 2021-08-19 18:31:32
 * @LastEditors: Anna
 * @LastEditTime: 2021-10-29 20:53:30
-->
<template>
  <div class="app-container">
    <!-- 搜索部分 -->
    <el-form v-show="showSearch" ref="queryForm" label-width="68px">
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

    <!-- 操作按钮 -->
    <div style="margin: 10px 0; border-bottom: 1px solid #DCDFE6; padding-bottom: 10px">
      <el-button type="success" plain icon="el-icon-success" size="small" @click="passFun()">通过
      </el-button>
      <el-button type="danger" plain icon="el-icon-error" size="small" :disabled="multiple" @click="unPassFun()">驳回
      </el-button>
    </div>

    <!-- 数据部分 -->
    <el-table ref="singleTable" :data="tutorList" highlight-current-row :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" type="index" width="50" fixed />
      <el-table-column label="工号" align="center" prop="tutorId" width="100" fixed />
      <el-table-column label="姓名" align="center" prop="name" width="100" fixed />
      <el-table-column label="所在单位（院系）" align="center" prop="organizationName" width="150" fixed />
      <el-table-column label="申请类别" align="center" prop="applyName" />
      <el-table-column label="职称" align="center" prop="title" width="100" />
      <!-- 数据库中查询最后学位字段 -->
      <el-table-column label="最后学位" align="center" prop="finalDegree" />
      <el-table-column label="审核状态" align="center" prop="inspectDescribe">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 301" type="success">
            {{ scope.row.inspectDescribe }}
          </el-tag>
          <el-tag v-else-if="scope.row.status === 302" type="danger">
            {{ scope.row.inspectDescribe }}
          </el-tag>
          <el-tag v-else type="warning">
            社科处待审核
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="commitSocial">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="commitFun(scope.row)">添加备注</el-button>
        </template>
      </el-table-column>
      <el-table-column label="详情" align="center" prop="mr">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleDetail(scope.row)">查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页框 -->
    <el-row type="flex" justify="center">
      <el-pagination
        style="margin: 10px 0"
        :current-page="queryParams.pageNum"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="totalData"
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
    <!-- 添加备注弹框 -->
    <el-dialog title="备注" :visible.sync="dialogVisible" width="30%">
      <span>请输入驳回理由(可以为空)</span>
      <el-input type="textarea" :autosize="{minRows: 6}" v-model="returnCommit" autocomplete="off" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="returnFun()">确定</el-button>
      </span>
    </el-dialog>
    <!-- 驳回的弹框 -->
    <el-dialog title="备注" :visible.sync="dialogUnVisible" width="30%">
      <span>确认驳回吗？</span>
      <!-- <el-input v-model="returnCommit" autocomplete="off" /> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="returnUnFun()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getInit, // 初始化
  search, // 搜索
  updateSocial // 更新操作
} from '@/api/departmentSecretary/secretaryFirst'

import { departmentList } from '@/utils/data'

export default {
  data() {
    return {
      // 添加备注的内容
      returnCommit: '',
      //备注的弹框
      dialogVisible: false,
      // 驳回弹框默认不显示
      dialogUnVisible: false,
      // 通过确认框
      dialogVisiblePass: false,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 分页总条数
      totalData: 0,
      // 材料最终审核结果
      csDes: '',
      // 待社科处初审列表
      socialInitList: [],
      // 所有负责院系列表
      organizationList: departmentList,
      // 所有申请类别列表
      applyTypeList: [],
      // 选定的列表
      multipleSelection: [],
      // 申请id
      applyId: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: '', // 工号
        userName: '', // 姓名
        organization: '', // 院系id
        applyType: '', // 申请类别id
        commitSocial: '', // 备注
        subjectName: '', // 学科名称id
        applyStatus: '', // 审核状态码id
        applyStatuss: [], // 审核状态码数组 id
        subjectTpe: '' // 学科属性，文科、理科、交叉
      },
      // 当前页
      currentPage: 1,
      // 科研处审核状态
      statuOptions: [
        {
          value: 30,
          label: '社科处待审核'
        }
      ],
      // 审核后需要下发的List数据
      updataList: [],
      tutorList: [],
      hightList: []
    }
  },
  created() {
    this.getSocialCheckInit() // 初始化待初审的数据
  },
  methods: {
    // 点击备注按钮，添加备注
    commitFun(row) {
      this.updataList.length = 0;
      this.dialogVisible = true;
      this.returnCommit = row.commitSocial; // 回显数据
      const obj = { id_1: 0, status_1: 0, commit_1: "" };
      obj.id_1 = row.applyId;
      obj.status_1 = row.status;
      obj.commit_1 = row.commitSocial;
      this.updataList.push(obj);
    },
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
      this.$router.push({
        path: '/social/socialDetail',
        query: { tutorId: tutorId, applyId: applyId, name: name }
      })
    },

    // 查询社科处待初审的数据
    // 通过状态码查询
    getSocialCheckInit() {
      this.queryParams.applyStatuss = [30, 301, 302]
      getInit(0, this.queryParams.applyStatuss, this.queryParams.pageNum).then((res) => {
        this.tutorList = res.data.data
        this.totalData = res.data.total
      })
    },

    // 搜索按钮
    searchQuery() {
      search(this.queryParams, 1).then((res) => {
        this.tutorList = res.data.data
        this.totalData = res.data.total
      })
    },

    // 重置按钮
    resetQuery() {
      this.queryParams.userId = ''
      this.queryParams.userName = ''
      this.queryParams.organization = ''
      this.queryParams.applyStatuss = [30, 301, 302] // 申请类别列表
    },
    // 初审通过
    passFun() {
      this.dialogVisiblePass = true
    },
    // 审核通过确认弹框按钮
    rePassFun() {
      this.check(63)
      // console.log("000000",this.updataList)
      this.dialogVisiblePass = false
      // window.location.reload() // 重新加载页面
    },

    // 初审不通过
    unPassFun() {
      // 驳回之前判断是否只选择了一条
      if (this.multipleSelection.length > 1) {
        this.$message.warning('注意:只能选择一条数据审核！')
      } else {
        this.dialogUnVisible = true
      }
    },

    // 备注确定按钮操作
    returnFun() {
      // 添加备注
      this.updataList[0].commit_1 = this.returnCommit;
      this.check(30)
      this.dialogVisible = false
    },

    //弹框确定按钮驳回操作
    returnUnFun() {
      // 备注
      // this.updataList[0].commit_1 = this.returnCommit
      this.check(42)
      this.dialogUnVisible = false
      // this.returnCommit = null
      // window.location.reload() // 重新加载页面
    },

    // 弹框取消按钮
    cancel() {
      this.dialogUnVisible = false
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
        this.getSocialCheckInit()
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
        // 记得传applyId,很重要！！！！！！！
        obj.id_1 = this.multipleSelection[index].applyId
        obj.status_1 = this.multipleSelection[index].status
        obj.commit_1 = ''
        this.updataList.push(obj)
      }
    },

    // 每页显示条数
    handleSizeChange(val) {
    },
    // 当前页数
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getSocialCheckInit()
    }
  }
}
</script>
