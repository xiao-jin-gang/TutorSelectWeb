<template>
  <div class="app-container" style="margin-top:5%;">
    <el-row>
      <el-col :span="16" :offset="2">
        <span style="font-size: 16px; margin-bottom: 20px">提示：当前系统时间范围为 <strong>{{ systemBegin }}</strong> 至 <strong>{{ systemEnd }} </strong></span>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col :span="6" :offset="2">
        <div class="grid-content bg-purple">
          <span class="demonstration" style="font-size:16px;">设置导师提交申请的时间范围 </span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <div class="block">
            <el-date-picker
              v-model="time"
              type="daterange"
              value-format="yyyy-MM-dd"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-button type="primary" plain @click="save()">保存设置</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { getEndTime, getStartTime } from '@/utils/function'

export default {
  data() {
    return {
      time: '',
      systemBegin: '',
      systemEnd: '',
      systemTime: [] // 研究生院设置时间
    }
  },
  created() {
    // this.init()
    this.getTime()
  },
  methods: {
    // 获取cookie中的院系zjz
    getOrganizationId: function() {
      if (Cookies.get('organizationId') !== null) {
        return Cookies.get('organizationId')
      } else {
        console.log('error-organizationId is null')
      }
    },
    getOrganizationName: function() {
      if (Cookies.get('organizationName') !== null) {
        return Cookies.get('organizationName')
      } else {
        console.log('error-organizationName is null')
      }
    },
    async init() {
      // 下发设置导师申请时间前，判断是否在系统时间内
      const systemOrg = 0
      const { data: resSystem } = await this.$http.get(
        '/admin/system-time/get/' + systemOrg
      )
      // 系统时间
      this.beginSystem = getStartTime(resSystem[0]) // 北京时间八点
      this.endSystem = getEndTime(resSystem[1])
    },

    save() {
      if (this.time === '') {
        this.$message('请选择设置的开始时间与结束时间')
        return
      }
      const orgId = this.getOrganizationId()

      const begin = this.systemTime[0]
      const end = this.systemTime[1]
      if (begin > this.time[0] || end < this.time[1]) {
        this.$message.warning('设置的时间不在系统时间范围内,请重新设置！')
      } else {
        this.$http.get('/admin/system-time/save/' + this.time + '/' + orgId)
          .then(res => {
            if (res.code === 20000) {
              this.$message.success('时间更新成功！')
            } else if (res.code === 20002) {
              this.$message.success('时间设置成功！')
            } else {
              this.$message.error('时间修改失败！')
            }
          })
      }

      // this.$http.get('/admin/system-time/get/0').then(res => {
      //   console.log('res', res)
      //   const begin = res.data[0]
      //   const end = res.data[1]
      //   console.log('aaa', this.time[0], this.time[1], begin, end)
      //   if (begin > this.time[0] || end < this.time[1]) {
      //     this.$message.error('设置的时间不在系统时间范围内！')
      //   } else {
      //     this.$http.get('/admin/system-time/save/' + this.time + '/' + orgId)
      //       .then(res => {
      //         if (res.code === 20000) {
      //           this.$message.success('时间更新成功！')
      //         } else if (res.code === 20002) {
      //           this.$message.success('时间设置成功！')
      //         } else {
      //           this.$message.error('时间修改失败！')
      //         }
      //       })
      //   }
      // })
    },
    // 获取本院系的时间
    getTime() {
      // 设置院系id
      const orgId = this.getOrganizationId()
      this.$http.get('/admin/system-time/get/' + orgId)
        .then(res => {
          this.time = []
          if (res.data === '' || res.data === null) {
            this.$message.warning('请先设置本院导师申请的时间范围！')
          }
          else {
            this.time.push(res.data[0])
            this.time.push(res.data[1])
          }
        })

      // 获取系统时间
      this.$http.get('/admin/system-time/get/0')
        .then(res => {
          this.systemTime = res.data
          this.systemBegin = res.data[0]
          this.systemEnd = res.data[1]
        })
    }
  }
}

</script>
<style>
.bg-purple {
  background: #ffffff;
}

.bg-purple-light {
  background: #ffffff;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
