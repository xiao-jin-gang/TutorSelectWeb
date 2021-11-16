<template>
  <div class="app-container"  style="margin-top:8%;">
    <el-row>
      <el-col :span="6" :offset="2" >
        <div class="grid-content bg-purple">
          <span class="demonstration" style="font-size:16px;">设置系统提交申请的时间范围 </span>
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

export default {
  data() {
    return {
      time: ''
    }
  },
  created() {
    this.getTime()
  },
  methods: {
    async save() {
      // 设置院系id,0代表超级管理员设置的系统时间，
      const orgId = 0
      if (this.time === '') {
        return this.$message('请选择设置的开始时间与结束时间')
      }
      const { code: res } = await this.$http.get(
        '/admin/system-time/save/' + this.time + '/' + orgId
      )
      if (res == '20000') {
        return this.$message.success('时间更新成功')
      } else if (res == '20002') {
        return this.$message.success('时间设置成功')
      } else {
        return this.$message.error('时间修改失败')
      }
    },
    async getTime() {
      // 设置院系id,0代表超级管理员设置的系统时间，
      const orgId = 0
      const { data: res } = await this.$http.get(
        '/admin/system-time/get/' + orgId
      )
      console.info(res)
      this.time = []
      this.time.push(res[0])
      this.time.push(res[1])
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
