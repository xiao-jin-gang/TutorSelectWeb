<template>
  <div v-loading="loading" class="main" element-loading-text="提交中...">
    <el-row>
      <el-col :span="8" :offset="8">
        <el-steps :active="active" finish-status="success">
          <el-step title="基本信息" />
          <el-step title="研究信息" />
          <el-step title="学术信息" />
          <el-step title="教学信息" />
        </el-steps>
      </el-col>
    </el-row>
    <br>
    <!-- 第一页内容 -->
    <el-row v-if="formVisible.first">
      <el-col :span="18" :offset="3">
        <transition name="el-fade-in-linear">
          <First :apply-id="applyId" :apply-type="applyType" :apply-condition="applyCondition" @func="getFormSecond" @load="loading = true" />
        </transition>
      </el-col>
    </el-row>
    <!-- 第二页研究信息 -->
    <el-row>
      <el-col :span="18" :offset="3">
        <transition name="el-fade-in-linear">
          <el-card v-if="formVisible.second" class="box-card">
            <div slot="header" class="clearfix">
              <h2>研究信息</h2>
            </div>
            <el-form
              v-if="formVisible.second"
              ref="formSecond"
              :model="formSecond"
              label-width="100px"
              label-position="top"
            >
              <el-row>
                <el-col :span="24">
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-form-item label="申请学科" :rules="{required: true}">
                        <el-select
                          v-model="formSecond.applySubject"
                          style="width: 100%;"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in applySubjects"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="申请学科负责单位：">
                        <el-select
                          v-model="formSecond.doctoralMasterApplicationSubjectUnit"
                          style="width: 100%;"
                          placeholder="请选择"
                          @change="setChildNode"
                        >
                          <el-option
                            v-for="item in doctorPrimaryDiscipline"
                            :key="item.department"
                            :label="item.department"
                            :value="item"
                            style="color: #606266; font-weight: normal"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="一级学科代码及名称">
                        <el-select
                          v-model="formSecond.doctoralMasterSubjectCodeName"
                          style="width: 100%;"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in childNodes"
                            :key="item.code"
                            :label="item.code + ' ' + item.degreeAuthorizationPoint"
                            :value="item.code + ' ' + item.degreeAuthorizationPoint"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="博导在岗学科">
                        <el-select
                          v-model="formSecond.doctoralTutorOnDuty"
                          style="width: 100%;"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in doctorFirstDiscipline"
                            :key="item.code"
                            :label="item.code + ' ' + item.degreeAuthorizationPoint"
                            :value="item.code + ' ' + item.degreeAuthorizationPoint"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="上岗时间">
                        <el-date-picker
                          v-model="formSecond.doctoralStartTime"
                          format="yyyy-MM"
                          value-format="yyyy-MM"
                          type="month"
                          style="width: 100%"
                          placeholder="选择时间"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-divider content-position="left"><b><span style="color: red;">*</span> 仅外单位调入填写</b></el-divider>
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-form-item label="原单位名称">
                        <el-input v-model="formSecond.sourceUnitName" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="调入时间">
                        <el-date-picker
                          v-model="formSecond.transferInTime"
                          format="yyyy-MM"
                          value-format="yyyy-MM"
                          type="month"
                          style="width: 100%"
                          placeholder="选择时间"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-divider />
                </el-col>
                <el-col :span="24">
                  <el-form-item label="主要研究方向的内容及其意义（500字以内）">
                    <el-input
                      v-model="formSecond.major"
                      type="textarea"
                      maxlength="500"
                      show-word-limit
                      :autosize="{ minRows: 6 }"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="何时参加何种学术团体、任何种职务，有何社会兼职"
                  >
                    <el-button
                      type="primary"
                      class="addButton"
                      plain
                      @click="dialogSecond1 = true"
                    >添加
                    </el-button>
                    <el-table
                      :data="formSecond.groupsOrPartTimeJobs"
                      border
                      style="width: 100%"
                    >
                      <el-table-column type="index" width="50" label="序号" />
                      <el-table-column
                        prop="time"
                        label="参加时间"
                        width="180"
                      />
                      <el-table-column
                        prop="groups"
                        label="学术团体或兼职"
                        width="200"
                      />
                      <el-table-column prop="job" label="所任职务" />
                      <el-table-column align="center" width="150" label="操作">
                        <template slot-scope="scope">
                          <el-button
                            type="info"
                            size="mini"
                            plain
                            @click="editGroupsOrPartTimeJob(scope.$index)"
                          >编 辑</el-button>
                          <el-button
                            type="danger"
                            size="mini"
                            plain
                            @click="delGroupsOrPartTimeJob(scope.$index)"
                          >删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item
                    v-model="formSecond.expertTitles"
                    label="获何专家称号及时间"
                  >
                    <el-button
                      type="primary"
                      class="addButton"
                      plain
                      @click="dialogSecond2 = true"
                    >添加
                    </el-button>
                    <el-table
                      :data="formSecond.expertTitles"
                      border
                      style="width: 100%"
                    >
                      <el-table-column type="index" width="50" label="序号" />
                      <el-table-column
                        label="获得时间"
                        prop="time"
                        width="180"
                      />
                      <el-table-column label="称号名称" prop="title" />
                      <el-table-column align="center" width="150" label="操作">
                        <template slot-scope="scope">
                          <el-button
                            type="info"
                            size="mini"
                            plain
                            @click="editExpertTitle(scope.$index)"
                          >编 辑</el-button>
                          <el-button
                            type="danger"
                            size="mini"
                            plain
                            @click="delExpertTitle(scope.$index)"
                          >删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :offset="8">
                  <el-form-item style="margin-top: 20px">
                    <el-button type="primary" @click="onSubmitSecondPage">保存此部分，填写下一项
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </transition>
      </el-col>
    </el-row>
    <!-- 第 3 页学术信息 -->
    <el-row v-if="formVisible.third">
      <el-col :span="18" :offset="3">
        <transition name="el-fade-in-linear">
          <Third :apply-id="applyId" :loading="loading" :apply-condition="applyCondition" :form-third="formThird" @func="getFormFourth" @load="loading = true" />
        </transition>
      </el-col>
    </el-row>

    <!-- 第 4 页教学信息 -->
    <el-row v-if="formVisible.fourth">
      <el-col :span="18" :offset="3">
        <transition name="el-fade-in-linear">
          <Fourth :apply-id="applyId" :apply-type="applyType" :apply-condition="applyCondition" :form-fourth="formFourth" :tutor-name="tutorName" @load="loading = true" />
        </transition>
      </el-col>
    </el-row>

    <!-- 第4页内容 结束-->

    <!-- 第二页弹框内容 -->
    <!-- 学术团体框 -->
    <el-dialog :title="isEdit ? '修改学术团体或职务': '添加学术团体或职务'" :visible.sync="dialogSecond1" @closed="cancelFunc(1)">
      <el-form ref="groupsOrPartTimeJobForm" :model="groupsOrPartTimeJob">
        <el-form-item label="参加学术团体、或职务或社会兼职的时间">
          <el-date-picker
            v-model="groupsOrPartTimeJob.time"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            style="width: 100%"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="学术团体、或职务，或兼职名称">
          <el-input v-model="groupsOrPartTimeJob.groups" />
        </el-form-item>
        <el-form-item label="所任职务">
          <el-input v-model="groupsOrPartTimeJob.job" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!isEdit" @click="cancelFunc(1)">取 消</el-button>
        <el-button type="primary" @click="addGroupsOrPartTimeJob">确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 专家称号框 -->
    <el-dialog :title="isEdit ? '修改专家称号': '添加专家称号'" :visible.sync="dialogSecond2" @closed="cancelFunc(2)">
      <el-form :model="expertTitle">
        <el-form-item label="获得专家称号时间">
          <el-date-picker
            v-model="expertTitle.time"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            style="width: 100%"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="称号名称">
          <el-input v-model="expertTitle.title" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!isEdit" @click="cancelFunc(2)">取 消</el-button>
        <el-button type="primary" @click="addExpertTitle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { doctorFirstDiscipline, doctorPrimaryDiscipline } from '@/utils/data'
import { submitSecondPage } from '@/api/tutor/inspect'
import First from '../First'
import Third from '../Third'
import Fourth from '../Fourth'

export default {
  components: { First, Third, Fourth },
  data() {
    return {
      // 提交的加载状态
      loading: false,
      // 博士学科代码
      doctorPrimaryDiscipline: doctorPrimaryDiscipline,
      // 博士一级学科
      doctorFirstDiscipline: doctorFirstDiscipline,
      // 此次申请的id，在第一页提交时传回
      applyId: 0,
      // 当前申请的类型
      applyType: 0,
      // 当前的申请状态
      applyCondition: 0,
      // 步骤条
      active: 0,
      // 页数的隐藏和展示
      formVisible: {
        first: true,
        second: false,
        third: false,
        fourth: false
      },
      /** 第一页 */
      // 第 1 页表单
      tutorName: '', // 教师姓名, 第 4 页用到
      // ===========================================================第 2 页表单===================================
      isEdit: false, // 是否为编辑选项
      editIndex: -1, // 编辑项目的索引
      childNodes: [], // 院系的子专业信息
      dialogSecond1: false, // 学术团体或职务的显示框
      dialogSecond2: false, // 专家称号的显示框
      // 申请类型
      applySubjects: [
        { label: '文史', value: 1 },
        { label: '理工', value: 2 },
        { label: '交叉学科', value: 3 }
      ],

      formSecond: {
        // =========博士增岗 非免审============
        doctoralTutorOnDuty: '',
        doctoralStartTime: '',
        // 外单位调入填写
        sourceUnitName: '',
        transferInTime: '',

        applySubject: '', // 申请学科
        doctoralMasterApplicationSubjectUnit: '', // 申请学科负责单位
        doctoralMasterSubjectCodeName: '', // 一级学科代码 + " " + 名称
        major: '', // 主要研究方向的内容及其意义
        groupsOrPartTimeJobs: [], // 何时参加何种学术团体、任何种职务，有何社会兼职列表
        expertTitles: [] // 获何专家称号及时间列表
      },
      groupsOrPartTimeJob: {
        time: '',
        groups: '',
        job: ''
      },
      expertTitle: {
        time: '',
        title: ''
      },
      /** 第三页表单 */
      formThird: {},

      /* =========================  第 4 页  ================================= */
      // 第四页提交信息
      formFourth: {}

    }
  },
  created() {
    this.applyCondition = this.$route.params.applyCondition * 1
    this.applyId = this.$route.params.applyId * 1
    this.applyType = this.$route.params.applyType * 1
  },
  methods: {
    /* ============================================= 第一页 =====================================*/

    // ******************************************************第一页 *****************************************
    /* ====================================第二页============================ */
    getFormSecond: function(data, tutorName, applyCondition) {
      this.applyId = data.applyId
      this.tutorName = tutorName // 设置导师姓名，第四页用到
      this.applyCondition = applyCondition
      if (data.applySubject !== null) {
        this.formSecond.applySubject = data.applySubject * 1
      } else {
        this.formSecond.applySubject = ''
      }
      this.formSecond.doctoralMasterApplicationSubjectUnit = data.doctoralMasterApplicationSubjectUnit
      this.formSecond.doctoralMasterSubjectCodeName = data.doctoralMasterSubjectCodeName
      this.formSecond.doctoralTutorOnDuty = data.doctoralTutorOnDuty
      this.formSecond.doctoralStartTime = data.doctoralStartTime
      this.formSecond.sourceUnitName = data.sourceUnitName
      this.formSecond.transferInTime = data.transferInTime
      this.formSecond.major = data.major
      this.formSecond.groupsOrPartTimeJobs = data.groupsOrPartTimeJobs
      this.formSecond.expertTitles = data.expertTitles
      this.formVisible.first = false // 关闭第 1 页
      this.formVisible.second = true // 打开第 2 页
      this.loading = false
      this.active = 1
    },
    // 第 2 页添加学术团体项 弹框
    addGroupsOrPartTimeJob: function() {
      if (this.isEdit) {
        this.formSecond.groupsOrPartTimeJobs[this.editIndex] = this.groupsOrPartTimeJob
        this.isEdit = false
        this.editIndex = -1
      } else {
        this.formSecond.groupsOrPartTimeJobs.push(this.groupsOrPartTimeJob)
      }
      this.groupsOrPartTimeJob = {
        time: '',
        groups: '',
        job: ''
      }
      this.dialogSecond1 = false
    },
    // 删除某项学术团体项
    delGroupsOrPartTimeJob: function(index) {
      this.formSecond.groupsOrPartTimeJobs.splice(index, 1)
    },
    // 编辑学术团体
    editGroupsOrPartTimeJob: function(index) {
      this.groupsOrPartTimeJob = this.formSecond.groupsOrPartTimeJobs[index]
      // 打开添加框
      this.dialogSecond1 = true
      // 标记修改
      this.isEdit = true
      // 记录索引
      this.editIndex = index
    },
    // 添加某项专家称号 弹框
    addExpertTitle: function() {
      // 修改
      if (this.isEdit) {
        this.formSecond.expertTitles[this.editIndex] = this.expertTitle
        this.isEdit = false
        this.editIndex = -1
      } else {
        this.formSecond.expertTitles.push(this.expertTitle)
      }
      this.expertTitle = {
        time: '',
        title: ''
      }
      this.dialogSecond2 = false
    },
    // 删除某项专家称号
    delExpertTitle: function(index) {
      this.formSecond.expertTitles.splice(index, 1)
    },
    // 修改某项专家称号
    editExpertTitle: function(index) {
      this.expertTitle = this.formSecond.expertTitles[index]
      // 打开添加框
      this.dialogSecond2 = true
      // 标记修改
      this.isEdit = true
      // 记录索引
      this.editIndex = index
    },
    // 取消框
    cancelFunc: function(type) {
      // 学术团体
      if (type === 1) {
        this.groupsOrPartTimeJob = {
          time: '',
          groups: '',
          job: ''
        }
        this.dialogSecond1 = false
      } else {
        // 专家称号
        this.expertTitle = {
          time: '',
          title: ''
        }
        this.dialogSecond2 = false
      }
      this.isEdit = false
      this.editIndex = -1
    },

    // 设置选择院系的子专业
    setChildNode: function(value) {
      // 将子列表的选择置空
      this.formSecond.doctoralMasterSubjectCodeName = ''
      // 将当前选择加入 form 提交中
      this.formSecond.doctoralMasterApplicationSubjectUnit = value.department
      // 设置子项目为当前院系的专业
      this.childNodes = value.professional
    },
    // ************************************************ 完成第二页基本信息的填写 表单提交按钮********************************************
    onSubmitSecondPage: function() {
      if (this.formSecond.applySubject === '' || this.formSecond.applySubject === null) {
        this.$message.warning('请填写申请学科信息')
        return
      }
      this.$confirm('提交填写?')
        // 提交保存第二页
        .then(() => {
          this.loading = true
          submitSecondPage(this.formSecond, 2, this.applyId, this.applyCondition).then(
            (res) => {
              if (res.data.code === 1201) {
                this.$message.error(res.data.message)
                return
              }
              this.formThird = res.data
              // 更新成功
              this.$message.success('保存成功!')
              this.formVisible.second = false // 关闭第二项
              this.loading = false
              // 将第三页信息传入到
              this.formVisible.third = true // 打开第三项
              this.active = 2
            }
          )
        })
        .catch(() => {
          console.log('cancel')
        })
    },

    /* =========================  第 4 页  ================================= */
    // 获取第三页传来的初始化信息 this.$emit
    getFormFourth: function(data) {
      this.formFourth = data
      this.formVisible.third = false // 关闭第 3 页
      this.loading = false
      this.formVisible.fourth = true // 打开第 4 页
      this.active = 3
    }
  }
}
</script>

<style>
/**导航栏 */
.navigation_bar {
  background: #99a9bf;
  font-size: 30px;
  line-height: 50px;
  height: 50px;
  margin-bottom: 30px;
}

.bg-purple {
  background: #99a9bf;
}

/**控制内容及意义一下的label宽度 */
.my-label {
  width: 230px;
}

/**申请学科的label宽度 */
.my-applysubject {
  width: 230px;
}

p {
  font-size: 20px;
}

.summary {
  font-weight: bold;
  color: #f56c6c;
}
</style>
