<template>
  <div v-loading="loading" class="main" element-loading-text="请稍等...">
    <el-row>
      <el-col :span="8" :offset="8">
        <el-steps :active="active" finish-status="success">
          <el-step title="基本信息" />
          <el-step title="研究信息" />
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
                <!-- 申请信息 -->
                <el-col :span="24">
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-form-item label="申请学科" :rules="{required: true}">
                        <el-select
                          v-model="formSecond.applySubject"
                          style="width: 100%"
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
                          v-model="formSecond.appliedSubjectUnit"
                          style="width: 100%"
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
                          style="width: 100%"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in childNodes"
                            :key="item.code"
                            :label="
                              item.code + ' ' + item.degreeAuthorizationPoint
                            "
                            :value="
                              item.code + ' ' + item.degreeAuthorizationPoint
                            "
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="硕士招生学科">
                        <el-input v-model="formSecond.masterDirectorSubject" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="硕导上岗时间">
                        <el-date-picker
                          v-model="formSecond.masterDirectorTime"
                          format="yyyy-MM"
                          value-format="yyyy-MM"
                          type="month"
                          style="width: 100%"
                          placeholder="选择时间"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <!-- 研究信息 -->
                <el-col :span="24">
                  <el-form-item label="主要研究方向的内容及其意义（500字以内）">
                    <el-input
                      v-model="formSecond.researchDirections"
                      type="textarea"
                      maxlength="500"
                      show-word-limit
                      :autosize="{ minRows: 6 }"
                    />
                  </el-form-item>
                </el-col>
                <!-- 免审信息 -->
                <el-col :span="24">
                  <el-form-item label="免审条件（300字以内）">
                    <el-upload
                      ref="upload"
                      class="upload-demo"
                      name="material"
                      :action="getUrl(7)"
                      :file-list="fileList"
                      :on-success="uploadSuccessFunc"
                      :on-error="uploadErrorFunc"
                      :before-upload="checkFileType"
                      :before-remove="beforeRemove"
                      :on-remove="removeFile"
                      :on-exceed="oversizeFile"
                      :limit="1"
                      accept=".zip , .rar"
                    >
                      <el-button
                        slot="trigger"
                        size="small"
                        type="primary"
                        style="margin-bottom: 10px"
                      >上传免审资料</el-button>
                      &nbsp;&nbsp;&nbsp; 上传资料仅支持.rar/.zip文件
                    </el-upload>
                    <el-input
                      v-model="formSecond.exemptionConditions"
                      type="textarea"
                      maxlength="300"
                      show-word-limit
                      placeholder="免审条件填写"
                      :autosize="{ minRows: 6 }"
                    />
                  </el-form-item>
                </el-col>
                <!-- 科研项目（近五年） -->
                <el-col :span="24">
                  <el-card class="box-card" shadow="always">
                    <div slot="header" class="clearfix">
                      <span style="font-size: 18px">科研项目（近五年）</span>
                      <el-button
                        class="addButton"
                        style="float: right"
                        type="primary"
                        plain
                        @click="dialogSecond1 = true"
                      >添加</el-button>
                    </div>
                    <el-table
                      :data="formSecond.researchProjects"
                      border
                      style="width: 100%"
                    >
                      <el-table-column type="index" label="序号" width="50" />
                      <el-table-column prop="projectName" label="项目名称" />
                      <el-table-column prop="approvalNumber" label="批准号" />
                      <el-table-column
                        prop="projectChargeName"
                        label="负责人姓名"
                        min-width="100px"
                      />
                      <el-table-column prop="projectStartTime" label="开始日期" />
                      <el-table-column prop="projectEndTime" label="结束日期" />
                      <el-table-column prop="projectCategory" label="项目分类" />
                      <el-table-column prop="projectTotalPrice" min-width="110px" label="总经费(万元)"/>
                      <el-table-column prop="projectLevel" label="项目级别" />
                      <el-table-column label="操作" align="center" width="180">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            type="info"
                            plain
                            @click="editResearchProject(scope.$index,scope.row)"
                          >编 辑</el-button>
                          <el-button
                            size="mini"
                            type="danger"
                            plain
                            @click="delResearchProject(scope.$index)"
                          >删 除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-card>
                </el-col>
                <br>
                <!-- 科研教学情况（近五年） -->
                <el-col :span="24">
                  <el-card class="box-card" shadow="always">
                    <div slot="header" class="clearfix">
                      <span style="font-size: 18px">科研教学奖励（近五年）</span>
                      <el-button
                        style="float: right"
                        class="addButton"
                        type="primary"
                        plain
                        @click="dialogSecond2 = true"
                      >添加</el-button>
                    </div>
                    <el-table
                      :data="formSecond.teachingAwards"
                      border
                      style="width: 100%"
                    >
                      <el-table-column type="index" label="序号" width="50px" />
                      <el-table-column prop="awardsName" label="奖励名称" />
                      <el-table-column prop="awardsRank" label="排名" />
                      <el-table-column prop="awardsUnit" label="颁奖单位" />
                      <el-table-column prop="awardsLevel" label="获奖级别" />
                      <el-table-column prop="awardsTime" label="获奖日期" />
                      <el-table-column
                        prop="awardsAuthorName"
                        label="获奖人姓名"
                      />
                      <el-table-column label="操作" align="center" width="180">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            type="info"
                            plain
                            @click="editTeachingAward(scope.$index,scope.row)"
                          >编 辑</el-button>
                          <el-button
                            size="mini"
                            type="danger"
                            plain
                            @click="delTeachingAward(scope.$index)"
                          >删 除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-card>
                </el-col>
              </el-row>
              <el-row>
                <el-col :offset="8">
                  <el-form-item style="margin-top: 20px">
                    <el-button
                      type="primary"
                      @click="onSubmitSecondPage"
                    >填写完成，提交申请</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </transition>
      </el-col>
    </el-row>
    <!-- 第二页弹框内容 -->
    <!-- 添加科研项目 -->
    <el-dialog :title="isEdit ? '编辑科研项目' : '添加科研项目'" width="40%" :visible.sync="dialogSecond1">
      <el-form :model="researchProject">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称">
              <el-input v-model="researchProject.projectName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批准号">
              <el-input v-model="researchProject.approvalNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人姓名">
              <el-input v-model="researchProject.projectChargeName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始日期">
              <el-date-picker
                v-model="researchProject.projectStartTime"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期">
              <el-date-picker
                v-model="researchProject.projectEndTime"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目分类">
              <el-input
                v-model="researchProject.projectCategory"
                placeholder="国家自然科学基金等"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总经费（万元）">
              <el-input v-model="researchProject.projectTotalPrice" type="number" :percesion="2" :step="1" placeholder="0.00" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目级别">
              <el-select
                v-model="researchProject.projectLevel"
                style="width: 100%"
                placeholder="请选择"
              >
                <el-option label="国家级" value="国家级" />
                <el-option label="省部级" value="省部级" />
                <el-option label="厅局级" value="厅局级" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSecond1 = false">取 消</el-button>
        <el-button type="primary" @click="addResearchProject">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加科研教学奖励 -->
    <el-dialog :title="isEdit ? '编辑科研教学奖励' : '添加科研教学奖励'" width="40%" :visible.sync="dialogSecond2">
      <el-form :model="teachingAward">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="奖励名称">
              <el-input v-model="teachingAward.awardsName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排名">
              <el-input v-model="teachingAward.awardsRank" type="number" placeholder="请输入数字" :step="1" :min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颁奖单位">
              <el-input v-model="teachingAward.awardsUnit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖日期">
              <el-date-picker
                v-model="teachingAward.awardsTime"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖人姓名">
              <el-input v-model="teachingAward.awardsAuthorName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖级别">
              <el-select
                v-model="teachingAward.awardsLevel"
                style="width: 100%"
                placeholder="请选择"
              >
                <el-option label="国家级" value="国家级" />
                <el-option label="省部级" value="省部级" />
                <el-option label="厅局级" value="厅局级" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSecond2 = false">取 消</el-button>
        <el-button type="primary" @click="addTeachingAward">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { doctorPrimaryDiscipline } from '@/utils/data'

import { NoDeleteFile } from '@/api/tutor/mainboard'

import { submitSecondPage } from '@/api/tutor/noInspect'
import { baseUrl } from '@/api/url'
import First from '@/views/tutorMainBoard/First'

export default {
  components: { First },
  data() {
    return {
      fileList: [],
      // 第一页loading
      firstLoading: true,
      // 提交的加载状态
      loading: false,
      // 博士学科代码
      doctorPrimaryDiscipline: doctorPrimaryDiscipline,
      // 步骤条
      active: 0,
      // 编辑或添加
      isEdit: false,
      editIndex: -1,
      // 页数的隐藏和展示
      formVisible: {
        first: true,
        second: false
      },
      // 第二页弹框
      dialogSecond1: false, // 科研项目
      dialogSecond2: false,
      applyCondition: 0, // 申请的状态  修改还是未申请

      /** 第一页 */
      // 第 1 页表单
      applyId: 0, // 回传apply中id主键值
      applyType: 0,
      formFirst: {},
      // ===========================================================第 2 页表单===================================
      childNodes: [], // 院系的子专业信息
      currentDepartment: '', // 院系信息

      // 申请类型
      applySubjects: [
        { label: '文史', value: 1 },
        { label: '理工', value: 2 },
        { label: '交叉学科', value: 3 }
      ],

      formSecond: {
        applySubject: '', // 申请学科
        researchProjects: [],
        teachingAwards: []
      },

      // 科研项目
      researchProject: {
        projectName: '',
        approvalNumber: '',
        projectStartTime: '',
        projectEndTime: '',
        projectTotalPrice: '',
        projectLevel: '',
        projectCategory: '',
        projectChargeName: ''
      },
      // 教学情况
      teachingAward: {
        awardsName: '',
        awardsRank: '',
        awardsUnit: '',
        awardsTime: '',
        awardsAuthorName: '',
        awardsLevel: ''
      }
    }
  },
  created() {
    this.applyId = this.$route.params.applyId * 1
    this.applyCondition = this.$route.params.applyCondition * 1
    this.applyType = this.$route.params.applyType * 1
    // this.GetTutorInfoByClient()
  },
  methods: {
    getUrl(type) {
      return `${baseUrl}/user/upload/${type}`
    },
    /* ====================================第二页============================ */
    getFormSecond: function(data, tutorName, applyCondition) {
      this.applyId = data.applyId
      this.formSecond = data
      this.applyCondition = applyCondition
      if (data.applySubject !== null) {
        this.formSecond.applySubject = data.applySubject * 1
      } else {
        this.formSecond.applySubject = null
      }
      this.tutorName = tutorName // 设置导师姓名，第四页用到
      if (data.applySubject !== null) {
        this.formSecond.applySubject = data.applySubject * 1
      } else {
        this.formSecond.applySubject = ''
      }
      if(this.formSecond.exemptionConditionsMaterials !== "" && this.formSecond.exemptionConditionsMaterials !== null){
        let obj = new Object()
        obj.url = this.formSecond.exemptionConditionsMaterials
        obj.name = this.formSecond.exemptionConditionsMaterials.substring(obj.url.lastIndexOf('/')+1,this.formSecond.exemptionConditionsMaterials.length)
        this.fileList.push(obj);
      }
      this.formVisible.first = false // 关闭第 1 页
      this.formVisible.second = true // 打开第 2 页
      this.loading = false
      this.active = 1
    },
    //文件超出限制
    oversizeFile: function(files,fileList){
      this.$message.warning('上传文件超出限制!')
      return
    },
    // 上传成功
    uploadSuccessFunc: function(response, file, fileList) {
      let obj = new Object()
      obj.url = response.data.path
      obj.name = obj.url.substring(obj.url.lastIndexOf('/')+1,obj.url.length)
      this.fileList.push(obj)
      this.formSecond.exemptionConditionsMaterials = response.data.path
      this.$message.success("文件上传成功！")
    },
    // 上传镜像失败
    uploadErrorFunc: function(err, file, fileList) {
      this.$message.error("文件上传失败！")
    },
    // 检查上传的文件类型 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    checkFileType: function(file) {
      if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) {
        return true
      } else {
        this.$message.error('请上传 zip/rar 文件')
        return false
      }
    },
    // 文件移除之前
    beforeRemove: function() {
       let flag = this.$confirm('确定要移除选取的文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose(action, instance, done){
            if (action == 'confirm'){
              instance.$refs['confirm'].$el.onclick = function(e){
                e = e|| window.event
                if(e.detail != 0 ){ //鼠标事件为1
                  done()
                  return true
                }
              }
            }else
            {
              done()  //关闭弹窗
              return false
            }
          }
        })
        return flag
    },
    // 移除文件的钩子
    removeFile: function() {
       NoDeleteFile(this.formSecond.exemptionConditionsMaterials,this.applyId).then((res)=>{
        if(res.data.code === 1200){
          this.$message.success("文件删除成功！")
          this.formSecond.exemptionConditionsMaterials = ''
          this.fileList = []
        }
        else{
            this.$message.error("文件删除失败！")
        }
      })

    },
    // 第 2 页 添科研项目情况 弹框
    addResearchProject: function() {
      if (this.isEdit) {
        // 修改
        this.formSecond.researchProjects[this.editIndex] = this.researchProject
        this.editIndex = -1
        this.isEdit = false
      } else {
        // 添加
        this.formSecond.researchProjects.push(this.researchProject)
      }
      this.dialogSecond1 = false
      // 科研项目
      this.researchProject = {
        projectName: '',
        approvalNumber: '',
        projectStartTime: '',
        projectEndTime: '',
        projectTotalPrice: '',
        projectLevel: '',
        projectCategory: '',
        projectChargeName: ''
      }
    },
    // 编辑科研项目
    editResearchProject: function(index, row) {
      this.isEdit = true
      this.editIndex = index
      // 打开
      this.dialogSecond1 = true
      // 将数据回显
      this.researchProject = this.formSecond.researchProjects[index]
    },
    // 删除某项科研项目情况
    delResearchProject: function(index) {
      this.formSecond.researchProjects.splice(index, 1)
    },
    // 第 2 页添加科研教学奖励
    addTeachingAward: function() {
      if (this.isEdit) {
        // 编辑
        this.formSecond.teachingAwards[this.editIndex] = this.teachingAward
        this.editIndex = -1
        this.isEdit = false
      } else {
        this.formSecond.teachingAwards.push(this.teachingAward)
      }

      this.teachingAward = {
        awardsName: '',
        awardsRank: '',
        awardsUnit: '',
        awardsTime: '',
        awardsAuthorName: '',
        awardsLevel: ''
      }
      this.dialogSecond2 = false
    },
    // 编辑科研教学奖励
    editTeachingAward: function(index, row) {
      this.isEdit = true
      this.editIndex = index
      this.teachingAward = this.formSecond.teachingAwards[index]
      this.dialogSecond2 = true
    },
    // 删除某项科研教学奖励
    delTeachingAward: function(index) {
      this.formSecond.teachingAwards.splice(index, 1)
    },
    // 设置选择院系的子专业
    setChildNode: function(value) {
      // 将子列表的选择置空
      this.formSecond.doctoralMasterSubjectCodeName = ''
      // 将当前选择加入 form 提交中
      this.formSecond.appliedSubjectUnit = value.department
      // 设置子项目为当前院系的专业
      this.childNodes = value.professional
    },
    //* *********************************************** 完成第二页基本信息的填写 表单提交按钮********************************************
    onSubmitSecondPage: function() {
      if (this.formSecond.applySubject === '' || this.formSecond.applySubject === null) {
        this.$message.warning('请填写申请学科信息')
        return
      }
      this.$confirm('提交填写?')
        // 提交保存第二页
        .then(() => {
          this.loading = true
          submitSecondPage(this.formSecond, this.applyId).then((res) => {
            if (res.data.code === 1201) {
              this.$message.error(res.data.message)
            }
            this.$alert('填写成功，请前往我的申请页面查看填写信息，并提交至院系审核', {
              showClose: false
            }).then(() => {
              this.$message.success('填写成功')
              this.$router.push('/myApply')
            })
          })
        })
        .catch(() => {
          console.log('cancel')
        })
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
