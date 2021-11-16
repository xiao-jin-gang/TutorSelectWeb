<!--
 * @Description: your project
 * @version: 1.0
 * @Author: Anna
 * @Date: 2021-09-01 09:56:35
 * @LastEditors: Anna
 * @LastEditTime: 2021-10-19 11:32:27
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
          <el-form-item label="申请类别" prop="applyType">
            <el-select
              v-model="queryParams.applyType"
              placeholder="请选择申请类别"
              clearable
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="dict in applyTypeList"
                :key="dict.applyTypeId"
                :label="dict.applyName"
                :value="dict.applyTypeId"
              />
            </el-select>
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
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6">
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
        </el-col>
        <el-col :span="6">
          <el-form-item label="审核状态">
            <el-select
              v-model="queryParams.applyStatus"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 100%"
              @change="changeApplyStatus"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 搜索、重置按钮 -->
      <el-row :gutter="20">
        <el-col :span="2" :offset="20">
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchQuery()">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery(queryParams)">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 操作按钮 -->
    <div style="margin: 10px 0; border-bottom: 1px solid #DCDFE6; padding-bottom: 10px">
      <el-button v-if="searchFlag === true" type="success" plain icon="el-icon-success" size="small" @click="passFun()">同意上校会
      </el-button>
      <el-button v-if="searchFlag === true" type="danger" plain icon="el-icon-error" size="small" :disabled="multiple" @click="unPassFun()">不同意上校会
      </el-button>
      <el-button v-if="searchFlag === true" type="info" plain icon="el-icon-top" size="small" :disabled="multiple" @click="rejectFun()">驳回
      </el-button>
    </div>

    <!-- 数据部分 -->
    <el-table :data="tutorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" type="index" width="50" fixed />
      <el-table-column label="工号" align="center" prop="tutorId" width="100" fixed />
      <el-table-column label="姓名" align="center" prop="name" width="100" fixed />
      <el-table-column label="所在单位（院系）" align="center" prop="organizationName" width="150" fixed />
      <!-- 表格中的 prop 都和后端传的tutorList数据库一一对应 -->
      <el-table-column label="申请一级学科代码" align="center" prop="doctoralMasterSubjectCode" />
      <el-table-column label="申请一级学科名称" align="center" prop="doctoralMasterSubjectName" />
      <el-table-column label="申请类别" align="center" prop="applyName" />
      <el-table-column label="职称" align="center" prop="title" width="100" />
      <!-- 数据库中查询最后学位字段 -->
      <el-table-column label="最后学位" align="center" prop="finalDegree" />
      <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 65 || scope.row.status === 61" type="success">
            同意上校会
          </el-tag>
          <el-tag v-else-if="scope.row.status === 66 || scope.row.status === 62" type="danger">
            不同意上校会
          </el-tag>
          <el-tag v-else-if="scope.row.status === 29 || scope.row.status === 25" type="info">
            驳回
          </el-tag>
          <p v-else>{{ scope.row.inspectDescribe }}</p>
        </template>
      </el-table-column>
      <el-table-column label="详情" align="center" prop="mr">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="commit" width="150" />
    </el-table>

    <!-- 分页框 -->
    <el-row type="flex" justify="center">
      <el-pagination
        style="margin: 10px 0"
        :current-page="queryParams.pageNum"
        :page-size="queryParams.pageSize"
        layout="total, prev, pager, next"
        :total="totalData"
        @current-change="handleCurrentChange"
      />
    </el-row>

    <!-- 提交按钮 -->
    <el-col :span="2" :offset="22">
      <el-button
        v-if="searchFlag"
        type="success"
        plain
        size="small"
        icon="el-icon-success"
        @click="submitFun()"
      >提交
      </el-button>
    </el-col>

    <!-- 备注弹框 -->
    <el-dialog title="初审备注(可以为空)" :visible.sync="dialogVisible" width="20%">
      <el-input type="textarea" v-model="returnCommit" autocomplete="off" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="returnFun()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 审批通过的确认弹框 -->
    <!-- <el-dialog title="提示" :visible.sync="dialogVisiblePass" width="30%">
      <span>确认提交吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePass = false">取 消</el-button>
        <el-button type="primary" @click="rePassFun()">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- 不同意时的备注弹框 -->
    <!-- <el-dialog title="备注" :visible.sync="dialogVisible" width="30%">
      <span>请输入驳回理由(可以为空)</span>
      <el-input v-model="returnCommit" autocomplete="off" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="returnFun()">确定</el-button>
      </span>
    </el-dialog> -->
    <!-- 驳回时的备注弹框 -->
    <!-- <el-dialog title="备注" :visible.sync="dialogVisibleRej" width="30%">
      <span>请输入驳回理由(可以为空)</span>
      <el-input v-model="returnCommit" autocomplete="off" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel2()">取消</el-button>
        <el-button type="primary" @click="rejFun()">确定</el-button>
      </span>
    </el-dialog> -->


  </div>
</template>

<script>
import { toDetails } from '@/utils/function'
import {
  getApplyType, // 查询数据
  getInit,
  search,
  updateStatus// 更新操作
} from '@/api/departmentSecretary/secretaryFirst'

import { departmentList } from '@/utils/data'

export default {
  data() {
    return {
      searchFlag: false,
      // 驳回时备注的内容
      returnCommit: '',
      // 不同意弹框默认不显示
      dialogVisible: false,
      // 驳回弹框
      dialogVisibleRej: false,
      // 通过确认框
      dialogVisiblePass: false,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 分页总条数
      totalData: 0,
      // 待社科处初审列表
      socialInitList: [],
      // 所有负责院系列表
      organizationList: departmentList,
      // 选定的列表
      multipleSelection: [],
      // 备注列表
      commitArrays: [],
      // 申请类别选项
      applyTypeList: [],
      // 学科名称选项
      subjectNameOptions: [],
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
        subjectTpe: '' // 学科属性，文科、理科、交叉
      },
      // 当前页
      currentPage: 1,
      // 研究生院领导审核状态
      statusOptions: [
        {
          value: 34,
          label: '待审核'
        },
        {
          value: 38, // 研究生院管理员点击符合条件
          label: '符合条件'
        },
        {
          value: 39, // 研究生院管理员点击不符合条件
          label: '不符合条件'
        },
        {
          value: 61, // 研究生院领导审核通过,同意上校会
          label: '同意上校会'
        },
        {
          value: 62, // 研究生院领导审核不通过，不同意上校会
          label: '不同意上校会'
        },
        {
          value: 25, // 研究生院领导审核不通过，驳回
          label: '驳回'
        }
      ],
      // 审核后需要下发的List数据
      updateList: [],
      tutorList: [],
      //提交按钮是否禁用
      disable: false,
    }
  },
  created() {
    this.getSocialCheckInit() // 初始化待初审的数据
    this.getApplyTypeList()// 初始化申请的所有类别
    this.searchFlag = true // 初始化负责院系
  },
  methods: {
    // 查看详情
    handleDetail(row) {
      // const tutorId = row.tutorId
      const applyId = row.applyId
      const applyTypeId = row.applyTypeId
      const tutorId = row.tutorId
      toDetails(this, applyId, applyTypeId, tutorId)
      // this.$router.push({ path: '/graduate/graduateDetail', query: { applyId: applyId, tutorId: tutorId}})
    },

    // 初始化申请类别
    async getApplyTypeList() {
      getApplyType().then(res => {
        this.applyTypeList = res.data
      })
    },

    // 查询研究生院管理员待初审的数据
    // 通过状态码查询
    getSocialCheckInit: function() {
      // 34 社科处科研处审核通过返回给研究生院管理后，研究生院管理员复审通过  38 符合条件 39 不符合条件 （dynamic添加）
      // this.queryParams.applyStatuss = ['34', '38', '39']
      const applyStatuss = ["34", "38", "39", "65", "66", "29"]; // 申请状态码
      // this.queryParams.applyStatus = 34
      getInit(0, applyStatuss, this.queryParams.pageNum).then(res => {
        this.tutorList = res.data.data
        this.totalData = res.data.total
      })
    },

    // 搜索按钮
    searchQuery() {
      if (
        this.queryParams.applyStatus === "" &&
        this.queryParams.userName === "" &&
        this.queryParams.organization === "" &&
        this.queryParams.applyType === "" &&
        this.queryParams.subjectName === "" &&
        this.queryParams.subjectType === ""
      ) {
        this.getSocialCheckInit();
      } else {
        if (this.queryParams.applyStatus === "") {
          this.queryParams.applyStatuss = ["34", "38", "39","65", "66", "29"]; // 申请状态码
        }
        search(this.queryParams, 1).then(res => {
          this.searchFlag = this.queryParams.applyStatus === 34 ||
                            this.queryParams.applyStatus === 38 ||
                            this.queryParams.applyStatus === 39 ||
                            this.queryParams.applyStatus === ''
          this.tutorList = res.data.data
          this.totalData = res.data.total
        })
      }
    },

    // 清空选择申请状态!!!!!!!很重要  fouze 搜索清空后失效
    changeApplyStatus: function () {
      this.queryParams.applyStatuss = [];
    },

    // 重置按钮
    resetQuery() {
      this.queryParams.userId = ''
      this.queryParams.userName = ''
      this.queryParams.organization = ''
      this.queryParams.applyStatus = ''
    },
    // 初审通过
    passFun() {
      this.check(65)
    },
    // 初审不通过
    unPassFun() {
      this.check(66)
    },
    //驳回操作
    rejectFun() {
      this.check(29)
    },
    // 点击备注按钮，添加备注
    // commitFun(row) {
    //   this.commitArrays.length = 0;
    //   this.dialogVisible = true;
    //   this.returnCommit = row.commit; // 回显数据
    //   const obj = { id_1: 0, status_1: 0, commit_1: "" };
    //   obj.id_1 = row.applyId;
    //   obj.status_1 = row.status;
    //   obj.commit_1 = row.commit;
    //   this.commitArrays.push(obj);
    // },

    // 备注弹框的确定按钮
    returnFun() {
      this.commitArrays[0].commit_1 = this.returnCommit;
      this.updateStatusFun(this.commitArrays, false);
      this.dialogVisible = false
    },
    // 更新tutorList和updateList中的commit
    updateTutorListDataCommit(currentId) {
      for (let i = 0; i < this.tutorList.length; i++) {
        if (currentId === this.tutorList[i].applyId) {
          this.tutorList[i].commit = this.returnCommit;
          break;
        }
      }
      for (let i = 0; i < this.updateList.length; i++) {
        if (currentId === this.updateList[i].id_1) {
          this.updateList[i].commit_1 = this.returnCommit;
          break;
        }
      }
    },
    // 弹框取消按钮
    cancel() {
      this.dialogVisible = false
      this.returnCommit = null
    },

    // 弹框确定按钮驳回操作
    // rejFun() {
    //   // 添加备注
    //   this.updateList[0].commit_1 = this.returnCommit
    //   this.check(25)
    //   this.dialogVisibleRej = false
    //   this.returnCommit = null
    //   window.location.reload()// 重新加载页面
    // },

    // 弹框取消按钮
    // cancel2() {
    //   this.dialogVisibleRej = false
    //   this.returnCommit = null
    // },

    // 更新操作
    check(status) {
      if (status === "submit") {
        // 如果status是submit，则执行提交按钮
        for (let index = 0; index < this.updateList.length; index++) {
          this.updateList[index].status_1 = this.updateList[index].status_1 - 4; // -4是因为数据库绑定状态的原因，勿动
        }
      } else {
        for (let index = 0; index < this.updateList.length; index++) {
          this.updateList[index].status_1 = status;
        }
      }
      this.updateStatusFun(this.updateList, true);
    },
    // 更新状态
    updateStatusFun(updateList, isInit) {
      updateStatus(updateList).then((res) => {
        if (res.code === 20000) {
          this.$message.success("操作成功!");
        }
        if (isInit) {
          // 走四个按钮＋提交，刷新页面
          this.getSocialCheckInit();
        } else {
          // 走备注，不刷新页面，
          // 更新tutorList中的commit
          this.updateTutorListDataCommit(this.commitArrays[0].id_1);
        }
      });
    },
    // 提交按鈕
    submitFun() {
      this.$confirm("确认提交吗？")
        .then((res) => {
          let flag = true;
          for (let index = 0; index < this.updateList.length; index++) {
            if (this.updateList[index].status_1 === 34 || this.updateList[index].status_1 === 38 || this.updateList[index].status_1 === 39) {
              flag = false;
            }
          }
          //判断若没有勾选数据，提示
          if (this.updateList.length === 0) {
            this.$message.warning("未选择数据，请先进行选择！");
          } else {
            if (flag) {
              this.check("submit");
              this.getSocialCheckInit();
            } else {
              this.$message.warning("有待审核的数据，请先进行审核！");
            }
          }
          this.dialogVisiblePass = false;
        })
        .catch(() => {
          console.log("cancel");
        });
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
      this.updateList = []
      // 将需要审核后下发的数据对应起来
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const obj = { id_1: 0, status_1: 0, commit_1: '' }
        obj.id_1 = this.multipleSelection[index].applyId
        obj.status_1 = this.multipleSelection[index].status
        obj.commit_1 = ''
        this.updateList.push(obj)
      }
    },

    // 每页显示条数
    handleSizeChange(val) {},
    // 当前页数
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getSocialCheckInit()
    },

  }

}
</script>
