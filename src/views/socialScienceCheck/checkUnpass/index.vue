<!--
 * @Description: your project
 * @version: 1.0
 * @Author: Anna
 * @Date: 2021-08-19 18:31:32
 * @LastEditors: Anna
 * @LastEditTime: 2021-10-29 20:54:18
-->
<template>
  <div class="app-container">
    <!-- 搜索部分 -->
    <el-form ref="queryForm" label-width="68px">
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
    <el-table ref="singleTable" :data="tutorList" >
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
          <el-tag v-if="scope.row.status === 42" type="danger">
            {{ scope.row.inspectDescribe }}
          </el-tag>
          <el-tag v-else type="info">
            {{ scope.row.inspectDescribe }}
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
        :page-size="10"
        layout="total, prev, pager, next"
        :total="totalData"
        @current-change="handleCurrentChange"
      />
    </el-row>

  </div>
</template>

<script>
import {
  getInit, // 初始化
  search, // 搜索
} from '@/api/departmentSecretary/secretaryFirst'

import { departmentList } from '@/utils/data'

export default {
  data() {
    return {
      // 分页总条数
      totalData: 0,
      // 待社科处初审列表
      socialInitList: [],
      // 所有负责院系列表
      organizationList: departmentList,
      // 所有申请类别列表
      applyTypeList: [],
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
          value: 42, // 文科社科处审核不通过
          label: '社科处审核不通过'
        }
      ],
      tutorList: []
    }
  },
  created() {
    this.getSocialCheckInit() // 初始化待初审的数据
  },
  methods: {
    // 查询社科处待初审的数据
    // 通过状态码查询
    getSocialCheckInit() {
      this.queryParams.applyStatus = 42
      getInit(0, this.queryParams.applyStatus, this.queryParams.pageNum).then((res) => {
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
      this.queryParams.applyStatuss = [] // 申请类别列表
      this.queryParams.applyStatus = 42
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
