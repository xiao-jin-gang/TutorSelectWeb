<!--
 * @Description: your project
 * @version: 1.0
 * @Author: Anna
 * @Date: 2021-09-05 15:42:59
 * @LastEditors: Anna
 * @LastEditTime: 2021-09-06 15:16:00
-->
<template>
  <div id="app-container">
      <!-- 1. 教师基本信息表 -->
      <p class="info_title">基本信息</p>
      <el-table
        :data="teacherList"
        style="width: 90%; margin: 20px auto"
        border
      >
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column label="工号" align="center" prop="zgh" />
        <el-table-column label="姓名" align="center" prop="xm" />
        <el-table-column
          label="出生日期"
          align="center"
          prop="csrq"
        />
        <el-table-column
          label="身份证号"
          align="center"
          prop="sfzjh"
        />
        <el-table-column
          label="手机号"
          align="center"
          prop="sjh"
        />
        <el-table-column
          label="单位"
          align="center"
          prop="mc">
        </el-table-column>
        <el-table-column
          label="职称"
          align="center"
          prop="zcmc">
        </el-table-column>
        <el-table-column
          label="最高学位"
          align="center"
          prop="zgxw">
        </el-table-column>
      </el-table>

      <!-- 2. 科研教学奖励表 (!!!!!!!!!不需要修改)-->
      <p class="info_title">科研教学奖励</p>
      <el-table
        :data="awardList"
        style="width: 90%; margin: 20px auto"
        border
      >
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column label="名称" align="center" prop="awardsName" />
        <el-table-column label="排名" align="center" prop="awardsRank" />
        <el-table-column
          label="颁奖单位"
          align="center"
          prop="awardsUnit"
        />
        <el-table-column
          label="获奖级别"
          align="center"
          prop="awardsLevel"
        />
        <el-table-column
          label="获奖等级"
          align="center"
          prop="awardsClass"
        />
        <el-table-column
          label="获奖时间"
          align="center"
          prop="awardsTime"
        />
        <el-table-column
          label="证明材料"
          align="center"
          prop="awardsProveMaterials">
          <template slot-scope="scope">
            <el-button @click="handleDetail(scope.row)" type="text" size="small">
              下载文件
            </el-button>
          </template>
        </el-table-column>
      </el-table>


      <!-- 3. 指导学生情况 -->
      <p class="info_title">指导学生情况</p>
      <el-table
        :data="studentList"
        style="width: 90%; margin: 20px auto"
        border
      >
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column label="姓名" align="center" prop="studentName" />
        <el-table-column label="类型" align="center" prop="studentType" />
        <el-table-column
          label="入学时间"
          align="center"
          prop="studentEntryTime"
        />
        <el-table-column
          label="论文题目"
          align="center"
          prop="degreePaperTitle"
        />
        <el-table-column
          label="是否获得学位"
          align="center"
          prop="isGainDegree"
        />
        <el-table-column
          label="指导类型"
          align="center"
          prop="directType">
        </el-table-column>
        <el-table-column label="教师姓名" align="center" prop="tutorName" />
        <el-table-column label="毕业时间" align="center" prop="graduateTime" />
      </el-table>

  </div>
</template>

<script>

import {searchTeachers} from "@/api/scienceDepartment/teacherInfo/teacher"
import {searchAwards} from "@/api/scienceDepartment/teachingAwards/awards"
import {searchStudents} from "@/api/scienceDepartment/guidingStudent/student"

export default {
  data() {
    return {
      id: "",
      applyId: "",
      teacherList: [], //教师基本信息
      awardList: [],//科研教学奖励
      studentList: [],//指导学生情况

      // 1. 教师基本信息表
      teacherQueryParams:{
        ZGH: "",//工号
        XM: "",//姓名
        CSRQ: "",//出生日期
        SFZJH: "",//身份证号
        SJH: "",//手机号
        MC: "",//单位
        ZCMC: "",//职称
        ZGXW: "",//最高学位
      },
      // 2. 科研教学奖励表单查询参数
      awardQueryParams:{
        awardsName: "",//奖励名称
        awardsRank: "",//排名
        awardsUnit: "",//颁奖单位
        awardsLevel: "",//获奖级别
        awardsClass: "",//获奖等级
        awardsTime: "",//获奖日期
        awardsProveMaterials: "",//证明材料
        col1: "",//成果认定（通过、驳回）
        col2: "",//备注
      },
      // 3. 指导学生情况
      studentQueryParams:{
        studentName: "",//姓名
        studentType: "",//类型
        studentEntryTime: "",//入学时间
        degreePaperTitle: "",//论文题目
        isGainDegree: "",//是否获得学位
        directType: "",//指导类型
        tutorName: "",//教师姓名
        graduateTime: "",//毕业时间
      },

    }
  },
  created() {
    this.getTeacherList()
    this.getAwardList()
    this.getStudentList()
  },
  methods: {
    // 1.查询教师基本信息
    getTeacherList() {
      this.id = this.$route.query.tutorId
      this.applyId = this.$route.query.applyId
      searchTeachers(this.id).then((res)=>{
        this.teacherList = res.data
      })
    },
    // 2.查询科研教学奖励
    getAwardList() {
      searchAwards(this.id, this.applyId).then(res => {
        this.awardList = res.data
      })
    },
    // 3.查询指导学生情况
    getStudentList() {
      searchStudents(this.id, this.applyId).then(res => {
        this.studentList = res.data
      })
    }
  },
}
</script>

<style>
  .btnClass{
    margin: 20px auto;
  }

  .info_title{
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
    /* margin-bottom: 5px; */
    text-align: center;
  }

</style>
