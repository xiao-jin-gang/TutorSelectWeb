<template>
  <div>
    <!-- 第 1 页基本信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h2>基本信息</h2>
      </div>
      <el-form
        ref="formFirst"
        v-loading="loadingFirst"
        :model="formFirst"
        label-width="100px"
        label-position="right"
        element-loading-text="获取中..."
      >
        <Row type="flex" justify="center" align="top" class="code-row-bg">
          <Col :span="16">
            <Row>
              <Col :span="12">
                <el-form-item label="姓名">
                  <el-input v-model="formFirst.name" disabled />
                </el-form-item>
              </Col>
              <Col :span="12">
                <el-form-item label="性别">
                  <span style="color: #606266;">{{ formFirst.gender }}</span>
                </el-form-item>
              </Col>
              <Col :span="12">
                <el-form-item label="所在单位">
                  <el-input v-model="formFirst.organizationName" disabled />
                </el-form-item>
              </Col>
              <Col :span="12">
                <el-form-item label="出生日期">
                  <el-input v-model="formFirst.birthday" disabled />
                </el-form-item>
              </Col>
              <Col :span="12">
                <el-form-item label="工号">
                  <el-input v-model="formFirst.tutorId" :disabled="true" />
                </el-form-item>
              </Col>
              <Col :span="12">
                <el-form-item label="证件号码">
                  <el-input v-model="formFirst.identity" disabled />
                </el-form-item>
              </Col>
              <Col :span="12">
                <el-form-item label="联系电话" :rules="{required: true}">
                  <el-input v-model="formFirst.phone" />
                </el-form-item>
              </Col>
              <Col :span="12">
                <el-form-item label="电子邮箱" :rules="{required: true}">
                  <el-input v-model="formFirst.email" />
                </el-form-item>
              </Col>
              <!--              <el-divider style="margin: 0 !important; height: 5px;"></el-divider>-->
              <Col :span="12">
                <el-form-item label="职称">
                  <el-input v-model="formFirst.title" disabled />
                </el-form-item>
              </Col>
              <Col :span="12">
                <el-form-item label="评定时间" style="margin-bottom: 5px" :rules="{required: true}">
                  <el-date-picker
                    v-model="formFirst.evaluateTime"
                    type="month"
                    style="width: 100%"
                    placeholder="职称评定时间"
                    format="yyyy-MM"
                    value-format="yyyy-MM"
                  />
                </el-form-item>
              </Col>
              <!--              <el-divider></el-divider>-->
            </Row>
          </Col>
          <Col span="8">
            <el-form-item>
              <el-image
                style="width: 150px; height: 210px"
                :src="formFirst.image"
                fit="fit"
              >
                <div slot="placeholder" class="image-slot"><i class="el-icon-picture-outline" /></div>
              </el-image>
            </el-form-item>
          </Col>
          <Col :span="8">
            <el-form-item label="最后学位">
              <el-input v-model="formFirst.finalDegree" disabled />
            </el-form-item>
          </Col>
          <Col :span="8">
            <el-form-item label="授予单位" :rules="{required: true}">
              <el-input v-model="formFirst.awardDepartment" placeholder="最后学位授予单位" />
            </el-form-item>
          </Col>
          <Col :span="8">
            <el-form-item label="授予时间" :rules="{required: true}">
              <el-date-picker
                v-model="formFirst.awardTime"
                type="month"
                style="width: 100%"
                placeholder="最后学位授予时间"
                format="yyyy-MM"
                value-format="yyyy-MM"
              />
            </el-form-item>
          </Col>
        </Row>
        <Row>
          <Col :offset="7">
            <el-form-item style="margin-top: 20px">
              <el-button type="primary" @click="onSubmitFirstPage">保存此部分，填写下一项</el-button>
            </el-form-item>
          </Col>
        </Row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getFirstPage, submitFirstPage } from '@/api/tutor/inspect'
import { getNoFirstPage, submitNoFirstPage } from '@/api/tutor/noInspect'
import { getApplyId } from '@/api/tutor/mainboard'

export default {
  props: {
    applyId: Number,
    applyType: Number,
    applyCondition: Number
  },

  data() {
    return {
      loadingFirst: false, // 加载状态
      condition: 0, // 申请状态
      formFirst: {
        tutorId: '', // 教师工号
        name: '', // 姓名
        gender: '', // 性别
        image: '',
        organizationName: '', // 所在单位
        birthday: '', // 出生年月
        identity: '', // 证件号码
        phone: '', // 联系电话
        email: '', // 电子邮箱
        title: '', // 职称
        evaluateTime: '', // 评定时间
        finalDegree: '', // 最后学位
        awardDepartment: '', // 授予单位
        awardTime: '' // 授予时间
      }
    }
  },

  async created() {
    // 拉取首页基本信息
    this.loadingFirst = true
    const res = await getApplyId(this.applyType)
    if (res.data !== -1) {
      this.applyId = res.data
      this.applyCondition = 101
    }
    this.getFirstPage()
  },
  methods: {
    // 拉取基本信息
    getFirstPage: function() {
      if (this.applyType === 3 || this.applyType === 6 || this.applyType === 9) {
        getNoFirstPage(this.applyId).then((res) => {
          this.formFirst = res.data
          // 未申请过
          if (this.applyCondition === 102) {
            console.log('nofirst', res)
            this.formFirst.image =
              'data:image/png;base64,' + this.formFirst.blobImage
          }
          this.loadingFirst = false
        })
      } else {
        getFirstPage(this.applyId).then((res) => {
          if (res.data.code === 1201) {
            this.$message.error(res.data.message)
            this.$router.push('/tutorApply/tutorMainBoard')
            return
          }
          this.formFirst = res.data

          // 未申请过
          if (this.applyCondition === 102) {
            this.formFirst.image = 'data:image/png;base64,' + this.formFirst.blobImage
          }
          this.loadingFirst = false
        })
      }
    },

    // 完成第 1 页基本信息的填写
    onSubmitFirstPage: function() {
      if (this.formFirst.phone === null || this.formFirst.phone === '') {
        this.$message.warning('请填写联系电话')
        return
      }
      // 正则电话号验证
      if (!this.formFirst.phone.match(/\d{0,4}[-]\d{7,8}/) && !(/\d{11}/.test(this.formFirst.phone) && this.formFirst.phone.length === 11)) {
        this.$message.warning('请填正确的联系电话')
        return
      }
      if (this.formFirst.email === null || this.formFirst.email === '') {
        this.$message.warning('请填写电子邮箱')
        return
      }
      // 正则邮箱验证
      if (!/^\s*\w+(?:[.]?[\w-]+)*@\w+(?:[-.][a-zA-Z0-9]+)*\.[a-zA-Z]+\s*$/.test(this.formFirst.email)) {
        this.$message.warning('请填正确的电子邮箱')
        return
      }
      if (this.formFirst.evaluateTime === null || this.formFirst.evaluateTime === '') {
        this.$message.warning('请填写职称评定时间')
        return
      }
      if (this.formFirst.awardDepartment === null || this.formFirst.awardDepartment === '') {
        this.$message.warning('请填写最后学位授予单位')
        return
      }
      if (this.formFirst.awardTime === null || this.formFirst.awardTime === '') {
        this.$message.warning('请填写最后学位授予时间')
        return
      }
      this.$confirm('提交填写?')
        // 提交保存第 1 页
        .then(() => {
          // console.log(this.formFirst.email)
          this.$emit('load', true)
          // 免审
          if (this.applyType === 3 || this.applyType === 6 || this.applyType === 9) {
            submitNoFirstPage(this.formFirst, this.applyId, this.applyType, this.applyCondition)
              .then((res) => {
                if (res.data.code === 1201) {
                  this.$message.error(res.data.message)
                  return
                }
                this.loading = false
                this.$message.success('保存成功!')
                this.$emit('func', res.data, this.formFirst.name, this.applyCondition)
              })
          } else {
            this.condition = this.applyCondition
            submitFirstPage(this.formFirst, this.applyId, this.applyType, this.applyCondition)
              .then(res => {
                if (res.data.code === 1201) {
                  this.$message.error(res.data.message)
                  return
                }
                this.loading = false
                this.$message.success('保存成功!')
                this.$emit('func', res.data, this.formFirst.name, this.condition)
              })
          }
        })
        .catch(() => {
          console.log('cancel')
        })
    }
  }
}
</script>

<style scoped>
.el-divider {
  margin: 10px !important;
  width: 95%;
  color: #DCDFE6;
  position: relative;
  left: 5%;
}
</style>
