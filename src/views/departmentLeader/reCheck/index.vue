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
          <el-form-item label="申请类别">
            <el-select
              v-model="queryParams.applyType"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="item in applyTypeList"
                :key="item.applyTypeId"
                :label="item.applyName"
                :value="item.applyTypeId"
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
      <el-row :gutter="20">
        <el-col :span="2" :offset="20">
          <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery(queryParams)">重置</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 操作按钮 -->
    <div style="margin: 10px 0; border-bottom: 1px solid #DCDFE6; padding-bottom: 10px">
      <el-button type="success" plain icon="el-icon-success" size="small" :disabled="single" @click="passFun()">同意上分会
      </el-button>
      <el-button type="danger" plain icon="el-icon-error" size="small" :disabled="multiple" @click="unPassFun()">不同意上分会
      </el-button>
    </div>

    <!-- 数据部分 -->
    <el-table v-loading="loading" :data="tutorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection"  align="center" />
      <el-table-column label="工号" align="center" prop="tutorId"/>
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="所在单位（院系）" align="center" prop="organizationName"  />
      <el-table-column label="申请学科或类别代码" align="center" prop="applySubject" />
      <el-table-column label="申请类别" align="center" prop="applyName" />
      <el-table-column label="职称" align="center" prop="title" />
      <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 19 " type="success">
            {{ scope.row.inspectDescribe }}
          </el-tag>
          <el-tag v-else-if="scope.row.status === 20 " type="danger">
            {{ scope.row.inspectDescribe }}
          </el-tag>
          <p v-else>{{ scope.row.inspectDescribe }}</p>
        </template>
      </el-table-column>
      <el-table-column label="详情" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toDetails(scope.row.applyId, scope.row.applyTypeId, scope.row.tutorId)">查 看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="commit"/>
    </el-table>

     <!-- 分页框 -->
    <el-row type="flex" justify="center">
      <el-pagination
        style="margin: 10px 0"
        :current-page="queryParams.pageNum"
        :page-size="queryParams.pageSize"
        layout="total, prev, pager, next"
        :total="totalData"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
    <!-- 导出提交按钮 -->
    <el-row>
      <el-col :span="2" :offset="22">
        <el-button
          type="success"
          plain
          size="small"
          icon="el-icon-success"
          :loading="exportLoading"
          @click="submitFun()"
        >提交
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  getApplyType,
  updateStatus,
  getInit,
  search
} from '@/api/departmentSecretary/secretaryFirst'
import { toDetails } from '@/utils/function'
import Cookies from "js-cookie";
export default {
  data() {
    return {
     // 备注内容
      returnCommit: '',
      // 备注弹框显示
      dialogVisible: false,
      // 通过确认框
      dialogVisiblePass: false,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 分页总条数
      totalData: 0,
      // 所有申请类别列表
      applyTypeList: [],
      // 选定的列表
      multipleSelection: [],
      // 备注列表
      commitArrays: [],

      // 页码
      pageNumber: 1,
      // 查询参数
      queryParams: {
        userId: '', // 工号
        userName: '', // 姓名
        organization: "", // 院系id 30130 50030
        organizationName: "", // 院系名称
        applyType: '', // 申请类别id
        subjectName: '', // 学科名称id
        applyStatus: '', // 审核状态 id
        applyStatuss: [], // 审核状态码数组 id
        subjectType: '' // 学科属性，文科，理科，交叉
      },
      //和秘书初审有关的审核状态
      statusOptions: [
        {
          value: 11,
          label: "初审符合条件",
        },
        {
          value: 12,
          label: "初审不符合条件",
        },
        {
          value: 13,
          label: "初审待定",
        },
        {
          value: 19,
          label: "同意上分会",
        },
        {
          value: 20,
          label: "不同意上分会",
        },
      ],
      //审核后需要下发的List数据
      updateList: [],
      tutorList: [],
    };
  },
  created() {
    this.getSecretaryInit(); //初始化待初审的数据
    this.getApplyTypeList(); //初始化申请的所有类别（下拉框）
  },
  methods: {
    //获取cookie中的院系zjz
    getOrganizationId: function () {
      if (Cookies.get("organizationId") !== null) {
        return Cookies.get("organizationId");
      } else {
        console.log("error-organizationId is null");
      }
    },
    getOrganizationName: function () {
      if (Cookies.get("organizationName") !== null) {
        return Cookies.get("organizationName");
      } else {
        console.log("error-organizationName is null");
      }
    },
   // 查询院系秘书待初审的数据
    getSecretaryInit: function() {
      this.loading = true
      const organizationId = this.getOrganizationId(); // 院系
      const applyStatuss = ['11', '12', '13', '19', '20'] // 申请状态码

      getInit(organizationId, applyStatuss, this.pageNumber).then((res) => {
        this.tutorList = res.data.data
        this.totalData = res.data.total
        this.loading = false
      })
    },

    // 详情页
    toDetails: function(applyId, applyTypeId, tutorId) {
      toDetails(this, applyId, applyTypeId, tutorId)
    },

    // 查询数据
    search: function() {
      this.pageNumber = 1;
      if (this.queryParams.applyStatus === '' &&
          this.queryParams.userName === '' &&
          this.queryParams.organization === '' &&
          this.queryParams.applyType === '' &&
          this.queryParams.subjectName === '' &&
          this.queryParams.subjectType === ''
      ) {
        this.getSecretaryInit()
      } else {
        if (this.queryParams.applyStatus === '') {
          this.queryParams.applyStatuss = ['11', '12', '13', '19', '20'] // 申请状态码
        }
        this.queryParams.organization = this.getOrganizationId();
        search(this.queryParams, this.pageNumber).then(res => {
          this.tutorList = res.data.data
          this.totalData = res.data.total
          this.loading = false
        }).catch(error => {
          throw error
        })
      }
    },
     // 初始化申请的所有类别（下拉框）
    async getApplyTypeList() {
      getApplyType().then((res) => {
        this.applyTypeList = res.data
      })
    },

    // 清空选择申请状态
    changeApplyStatus: function() {
      this.queryParams.applyStatuss = []
    },
     // 重置按钮
    resetQuery() {
      this.queryParams.userId = '' // 工号
      this.queryParams.userName = '' // 姓名
      this.queryParams.applyType = '' // 申请类别id
      this.queryParams.applyStatus = '' // 审核状态码id
      this.queryParams.applyStatuss = [] // 申请类别列表
      this.pageNumber = 1;
    },
    //同意上分会
    passFun() {
      this.check(19);
    },
    //不同意上分会
    unPassFun() {
      this.check(20);
    },
   // 更新操作
    check(status) {
      if (status === 'submit') {
        // 如果status是submit，则执行提交按钮
        for (let index = 0; index < this.updateList.length; index++) {
          this.updateList[index].status_1 = this.updateList[index].status_1 + 2 // +2是因为数据库绑定状态的原因，勿动
        }
      } else {
        for (let index = 0; index < this.updateList.length; index++) {
          this.updateList[index].status_1 = status
        }
      }
      this.updateStatusFun(this.updateList, true)
    },
    // 更新状态
    updateStatusFun(updateList, isInit) {
      updateStatus(updateList).then((res) => {
        if (res.code === 20000) {
          this.$message.success('操作成功!')
        }
        if (isInit) {
          // 走四个按钮＋提交，刷新页面
          this.getSecretaryInit()
        } else {
          // 走备注，不刷新页面，
          // 更新tutorList中的commit
          this.updateTutorListDataCommit(this.commitArrays[0].id_1)
        }
      })
    },
      // 提交按鈕
    submitFun() {
      this.$confirm('确认提交吗？').then((res) => {
        let flag = true
        for (let index = 0; index < this.updateList.length; index++) {
          if (this.updateList[index].status_1 === 11 || this.updateList[index].status_1 === 12 || this.updateList[index].status_1 === 13) {
            flag = false
          }
        }
         //判断若没有勾选数据，提示
          if (this.updateList.length === 0) {
            this.$message.warning("未选择数据，请先进行选择！");
          } else {
            if (flag) {
              this.check("submit");
              this.getSecretaryInit();
            } else {
              this.$message.warning("有待审核的数据，请先进行审核！");
            }
          }
      }).catch(() => {
        console.log('cancel')
      })
    },

    //当前选中
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.single = false;
        this.multiple = false;
      } else {
        this.single = true;
        this.multiple = true;
      }
      this.multipleSelection = val;
      this.updateObiect(this.multipleSelection);
    },
    //封装更新数据
    updateObiect(originArray) {
      //每次选择都要将之前的清空
      this.updateList = [];

      // 将需要审核后下发的数据对应起来
      for (let index = 0; index < originArray.length; index++) {
        // let obj = {id_1:0, number_1: "", applyId_1: 0, status_1: 0, commit_1: "" };
        let obj = { id_1: 0, status_1: 0, commit_1: "" };
        obj.id_1 = originArray[index].applyId;
        obj.status_1 = originArray[index].status;
        obj.commit_1 = originArray[index].commit;
        this.updateList.push(obj);
      }
    },

    //每页显示条数
    handleSizeChange(val) {},
    //当前页数
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getSecretaryInit();
    },
  },
};
</script>
