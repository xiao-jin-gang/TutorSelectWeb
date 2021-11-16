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
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="search"
            >搜索</el-button
          >
        </el-col>
        <el-col :span="2">
          <el-button
            icon="el-icon-refresh"
            size="small"
            @click="resetQuery(queryParams)"
            >重置</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <!-- 数据部分 -->
    <el-table v-loading="loading" :data="tutorList">
      <el-table-column label="工号" align="center" prop="tutorId" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column
        label="所在单位（院系）"
        align="center"
        prop="organizationName"
      />
      <el-table-column
        label="申请学科或类别代码"
        align="center"
        prop="applySubject"
      />
      <el-table-column label="申请类别" align="center" prop="applyName" />
      <el-table-column label="职称" align="center" prop="title" />
      <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 11" type="success">{{
            scope.row.inspectDescribe
          }}</el-tag>
          <el-tag v-else-if="scope.row.status === 12" type="danger">
            {{ scope.row.inspectDescribe }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="详情" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="toDetails(scope.row.applyId, scope.row.applyTypeId, scope.row.tutorId)"
            >查 看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="commitFun(scope.row)"
            >添加备注</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页框 -->
    <el-row type="flex" justify="center">
      <el-pagination
        style="margin: 10px 0"
        :current-page="pageNumber"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="totalData"
        @size-change="handleSizeChange"
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
          :loading="exportLoading"
          @click="exportFun()"
          >导出excel
        </el-button>
      </el-col>
    </el-row>
    <p style="margin: 10px 0">
      注意：导出上表所有审核状态为<span style="color: #f56c6c">同意上分会</span
      >的记录
    </p>

    <!-- 备注弹框 -->
    <el-dialog
      title="院系提交分会备注(可以为空)"
      :visible.sync="dialogVisible"
      width="20%"
    >
      <el-input type="textarea" v-model="returnCommit" autocomplete="off" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="returnFun()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getApplyType,
  updateStatusSfh,
  getInit,
  search,
} from "@/api/departmentSecretary/secretaryFirst";
import { toDetails } from "@/utils/function";
import Cookies from "js-cookie";
import { exportSFH } from "@/api/departmentSecretary/exportExcel";
export default {
  data() {
    return {
      //备注内容
      returnCommit: "",
      //备注弹框显示
      dialogVisible: false,
      //通过确认框
      dialogVisiblePass: false,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 分页总条数
      totalData: 0,
      // 待院系秘书初审列表
      secretaryInitList: [],
      //所有申请类别列表
      applyTypeList: [],
      //选定的列表
      multipleSelection: [],
      //当前操作的行
      currentSelection: [],
      // 备注列表
      commitArrays: [],
      // 页码
      pageNumber: 1,
      // 查询参数
      queryParams: {
        userId: "", // 工号
        userName: "", // 姓名
        organization: "", // 院系id 30130 50030
        organizationName: "", // 院系名称
        applyType: "", // 申请类别id
        subjectName: "", // 学科名称id
        applyStatus: "", // 审核状态 id
        applyStatuss: [], // 审核状态码数组 id
        subjectType: "", // 学科属性，文科，理科，交叉
      },
      statusOptions: [
        {
          value: 11,
          label: "同意上分会",
        },
        {
          value: 12,
          label: "不同意分会",
        },
      ],
      // 查询参数
      queryParamCopy: {},
      updataList: [],
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
    getSecretaryInit: function () {
      this.loading = true;
      const applyStatuss = ["11","12"]; // 同意上分会  不同意上分会
      const organizationId = this.getOrganizationId();
      getInit(organizationId, applyStatuss, this.pageNumber).then((res) => {
        this.tutorList = res.data.data;
        this.totalData = res.data.total;
        this.loading = false;
      });
      //清空搜索框，调用重置按钮函数
      this.resetQuery()
    },

    // 详情页
    toDetails: function (applyId, applyTypeId, tutorId) {
      toDetails(this, applyId, applyTypeId, tutorId);
    },

    // 查询数据
    search: function () {
      this.pageNumber = 1;
      if (
        this.queryParams.userId === "" &&
        this.queryParams.applyStatus === "" &&
        this.queryParams.userName === "" &&
        this.queryParams.organization === "" &&
        this.queryParams.applyType === "" &&
        this.queryParams.subjectName === "" &&
        this.queryParams.subjectType === ""
      ) {
        this.getSecretaryInit();
      } else {
        if (this.queryParams.applyStatus === "") {
          this.queryParams.applyStatuss = ["11","12"]; // 申请状态码
        }
        this.queryParams.organization = this.getOrganizationId();
        search(this.queryParams, this.pageNumber)
          .then((res) => {
            this.tutorList = res.data.data;
            this.totalData = res.data.total;
            this.loading = false;
          })
          .catch((error) => {
            throw error;
          });
      }
    },

    // 清空选择申请状态
    changeApplyStatus: function () {
      this.queryParams.applyStatuss = [];
    },

    // 导出excel或数据的筛选,不选择条件，审核状态为请选择（默认）时的数据
    dataOption(func) {
      this.loading = true;
      const defaultStatus = ["11"];
      this.queryParams.organization = this.getOrganizationId();
      this.queryParams.organizationName = this.getOrganizationName();
      if (
        this.queryParams.applyStatus == null ||
        this.queryParams.applyStatus === ""
      ) {
        this.queryParamCopy = JSON.parse(JSON.stringify(this.queryParams));
        this.queryParamCopy.applyStatuss = defaultStatus;
        func(this.queryParamCopy);
      } else {
        func(this.queryParams);
      }
    },

    // excel导出
    exportFun() {
      this.dataOption(this.exportExcel);
    },
    // 导出excel实现
    exportExcel(queryParams) {
      const date = new Date();
      const year = date.getFullYear(); // 获取当前年份
      exportSFH(queryParams).then((res) => {
        const blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download =
          "西北大学" +
          year +
          "年" +
          this.getOrganizationName() +
          "学位评定分委员会推荐汇总表.xlsx"; // excel名称
        link.href = url;
        link.click();
      });
      this.loading = false;
    },

    // 初始化申请的所有类别（下拉框）
    async getApplyTypeList() {
      getApplyType().then((res) => {
        this.applyTypeList = res.data;
      });
    },
    // 重置按钮
    resetQuery() {
      this.queryParams.userId = ""; // 工号
      this.queryParams.userName = ""; // 姓名
      this.queryParams.applyType = ""; // 申请类别id
      this.queryParams.applyStatus = ""; // 审核状态码id
      this.queryParams.applyStatuss = []; // 申请类别列表
      // this.pageNumber = 1;
    },

    // 点击备注按钮，添加备注
    commitFun(row) {
      this.commitArrays.length = 0;
      this.dialogVisible = true;
      this.returnCommit = row.commitYxSfh; // 回显数据
      const obj = { id_1: 0, status_1: 0, commit_1: "" };
      obj.id_1 = row.applyId;
      obj.status_1 = row.status;
      obj.commit_1 = row.commitYxSfh;
      this.commitArrays.push(obj);
    },
    // 备注弹框的确定按钮
    returnFun() {
      this.commitArrays[0].commit_1 = this.returnCommit;
      this.updateStatusFun(this.commitArrays, false);
      this.dialogVisible = false;
    },
    // 更新状态
    updateStatusFun(updateList, isInit) {
      updateStatusSfh(updateList).then((res) => {
        if (res.code === 20000) {
          this.$message.success("操作成功!");
        }
        if (isInit) {
          // 走四个按钮＋提交，刷新页面
          this.getSecretaryInit();
        } else {
          // 走备注，不刷新页面，
          // 更新tutorList中的commit
          this.updateTutorListDataCommit(this.commitArrays[0].id_1);
        }
      });
    },
    // 更新tutorList和updateList中的commit
    updateTutorListDataCommit(currentId) {
      for (let i = 0; i < this.tutorList.length; i++) {
        if (currentId === this.tutorList[i].applyId) {
          this.tutorList[i].commitYxSfh = this.returnCommit;
          break;
        }
      }
    },
    //弹框取消按钮
    cancel() {
      this.dialogVisible = false;
      this.returnCommit = null;
    },

    //每页显示条数
    handleSizeChange(val) {},
    //当前页数
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getSecretaryInit();
    },
  },
};
</script>
