<!--
 * @Description: your project
 * @version: 1.0
 * @Author: Anna
 * @Date: 2021-08-25 12:01:41
 * @LastEditors: Anna
 * @LastEditTime: 2021-10-29 21:16:40
-->
<template>
  <div id="app-container">
    <br>
    <el-row type="flex" justify="center">
      <el-col :span="21">
        <el-card class="box-card">
          <el-descriptions
            class="margin-top"
            title="教师信息"
            :column="4"
            border
          >
            <el-descriptions-item>
              <template slot="label"> 工号 </template>
              {{ tutorId }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 姓名 </template>
              {{ name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 院系 </template>
              {{ organizationName }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <br>
    <!-- 1.学术论文 -->
    <el-row type="flex" justify="center">
      <el-col :span="21">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>学术论文</span>
          </div>
          <el-table
            :data="paperList"
            style="width: 100%; margin: 20px auto"
            border
          >
            <el-table-column label="序号" type="index" width="50" />
            <el-table-column prop="paperName" label="论文名称" />
            <el-table-column prop="paperPublicationTime" label="发表时间" />
            <el-table-column prop="firstAuthorName" label="第一作者" />
            <el-table-column prop="communicationAuthorName" label="通讯作者" />
            <el-table-column prop="journalName" label="期刊名称" />
            <el-table-column prop="journalCategory" label="期刊类别" />
            <el-table-column prop="sciPart" label="分区" />
            <el-table-column prop="journalLevel" label="期刊等级" />
            <el-table-column prop="impactFactors" label="影响因子" />
            <el-table-column label="证明材料" align="center">
              <template slot-scope="scope">
                <a :href="scope.row.paperProveMaterials">下载文件</a>
              </template>
            </el-table-column>
            <el-table-column label="成果认定" align="center">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.col1 === null || scope.row.col1 === ''"
                  type="info"
                >
                  待审核
                </el-tag>
                <el-tag v-else-if="scope.row.col1 === '通过'" type="success">
                  通过
                </el-tag>
                <el-tag v-else type="danger"> 不通过 </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="col2" />
            <el-table-column
              label="操作"
              align="center"
              width="160"
              class-name="small-padding fixed-width"
            >
              <template v-if="scope.row.tutorId !== 1" slot-scope="scope">
                <el-button
                  type="success"
                  icon="el-icon-success"
                  size="mini"
                  plain
                  @click="checkIn(scope.row.paperId, scope.$index, 1)"
                >通过
                </el-button>
                <el-button
                  type="danger"
                  plain
                  icon="el-icon-error"
                  size="mini"
                  @click="
                    checkOut(scope.row.paperId, scope.$index, 1, scope.row.col2)
                  "
                >驳回
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <br>

    <!-- 2.科研项目表 -->
    <el-row type="flex" justify="center">
      <el-col :span="21">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>科研项目</span>
          </div>
          <el-table
            :data="projectList"
            style="width: 100%; margin: 20px auto"
            border
          >
            <el-table-column label="序号" type="index" width="50" />
            <el-table-column prop="projectName" label="项目名称" />
            <el-table-column prop="approvalNumber" label="批准号" />
            <el-table-column
              prop="projectChargeName"
              label="负责人姓名"
              width="100"
            />
            <el-table-column prop="projectStartTime" label="开始日期" />
            <el-table-column prop="projectEndTime" label="结束日期" />
            <el-table-column prop="projectCategory" label="项目分类" />
            <el-table-column
              prop="projectTotalPrice"
              label="总经费（万元）"
              width="120"
            />
            <el-table-column prop="projectLevel" label="项目级别" />
            <el-table-column
              label="证明材料"
              align="center"
              prop="projectProveMaterials"
            >
              <template slot-scope="scope">
                <a :href="scope.row.projectProveMaterials">下载文件</a>
              </template>
            </el-table-column>
            <el-table-column label="成果认定" align="center">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.col1 === null || scope.row.col1 === ''"
                  type="info"
                >
                  待审核
                </el-tag>
                <el-tag v-else-if="scope.row.col1 === '通过'" type="success">
                  通过
                </el-tag>
                <el-tag v-else type="danger"> 不通过 </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="col2" />
            <el-table-column
              label="操作"
              align="center"
              width="160"
              class-name="small-padding fixed-width"
            >
              <template v-if="scope.row.tutorId !== 1" slot-scope="scope">
                <el-button
                  type="success"
                  icon="el-icon-success"
                  size="mini"
                  plain
                  @click="checkIn(scope.row.projectId, scope.$index, 2)"
                >通过
                </el-button>
                <el-button
                  type="danger"
                  plain
                  icon="el-icon-error"
                  size="mini"
                  @click="
                    checkOut(
                      scope.row.projectId,
                      scope.$index,
                      2,
                      scope.row.col2
                    )
                  "
                >驳回
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <br>

    <!-- 3.教材或学术著作表 -->
    <el-row type="flex" justify="center">
      <el-col :span="21">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>教材或学术著作</span>
          </div>
          <el-table
            :data="workList"
            style="width: 100%; margin: 20px auto"
            border
          >
            <el-table-column label="序号" type="index" width="50" />
            <el-table-column prop="worksName" label="著作名称" />
            <el-table-column prop="worksNumber" label="著作编号" />
            <el-table-column prop="worksPublicationTime" label="出版日期" />
            <el-table-column prop="worksPublicationUnit" label="出版单位" />
            <el-table-column prop="totalWords" label="完成字数（万字）" />
            <el-table-column prop="authorName" label="作者姓名" />
            <el-table-column
              label="证明材料"
              align="center"
              prop="worksProveMaterials"
            >
              <template slot-scope="scope">
                <a :href="scope.row.worksProveMaterials">下载文件</a>
              </template>
            </el-table-column>
            <el-table-column label="成果认定" align="center">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.col1 === null || scope.row.col1 === ''"
                  type="info"
                >
                  待审核
                </el-tag>
                <el-tag v-else-if="scope.row.col1 === '通过'" type="success">
                  通过
                </el-tag>
                <el-tag v-else type="danger"> 不通过 </el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column label="审批结果" align="center" prop="mr" /> -->
            <el-table-column label="备注" align="center" prop="col2" />
            <el-table-column
              label="操作"
              align="center"
              width="160"
              class-name="small-padding fixed-width"
            >
              <template v-if="scope.row.tutorId !== 1" slot-scope="scope">
                <el-button
                  type="success"
                  icon="el-icon-success"
                  size="mini"
                  plain
                  @click="checkIn(scope.row.worksId, scope.$index, 3)"
                >通过
                </el-button>
                <el-button
                  type="danger"
                  plain
                  icon="el-icon-error"
                  size="mini"
                  @click="
                    checkOut(scope.row.worksId, scope.$index, 3, scope.row.col2)
                  "
                >驳回
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <br>

    <!-- 4.科研教学奖励表 -->
    <el-row type="flex" justify="center">
      <el-col :span="21">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>科研教学奖励</span>
          </div>
          <el-table
            :data="awardList"
            style="width: 100%; margin: 20px auto"
            border
          >
            <el-table-column label="序号" type="index" width="50" />
            <el-table-column prop="awardsName" label="奖励名称" />
            <el-table-column prop="awardsRank" label="排名" />
            <el-table-column prop="awardsUnit" label="颁奖单位" />
            <el-table-column prop="awardsLevel" label="获奖级别" />
            <el-table-column prop="awardsTime" label="获奖日期" />
            <el-table-column prop="awardsAuthorName" label="获奖人姓名" />
            <el-table-column
              label="证明材料"
              align="center"
              prop="awardsProveMaterials"
            >
              <template slot-scope="scope">
                <a :href="scope.row.awardsProveMaterials">下载文件</a>
              </template>
            </el-table-column>
            <el-table-column label="成果认定" align="center">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.col1 === null || scope.row.col1 === ''"
                  type="info"
                >
                  待审核
                </el-tag>
                <el-tag v-else-if="scope.row.col1 === '通过'" type="success">
                  通过
                </el-tag>
                <el-tag v-else type="danger"> 不通过 </el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column label="审批结果" align="center" prop="mr" /> -->
            <el-table-column label="备注" align="center" prop="col2" />
            <el-table-column
              label="操作"
              align="center"
              width="160"
              class-name="small-padding fixed-width"
            >
              <template v-if="scope.row.tutorId !== 1" slot-scope="scope">
                <el-button
                  type="success"
                  icon="el-icon-success"
                  size="mini"
                  plain
                  @click="checkIn(scope.row.awardsId, scope.$index, 4)"
                >通过
                </el-button>
                <el-button
                  type="danger"
                  plain
                  icon="el-icon-error"
                  size="mini"
                  @click="
                    checkOut(
                      scope.row.awardsId,
                      scope.$index,
                      4,
                      scope.row.col2
                    )
                  "
                >驳回
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <br>

    <!-- 5.发明专利 -->
    <el-row type="flex" justify="center">
      <el-col :span="21">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>发明专利</span>
          </div>
          <el-table
            :data="patentList"
            style="width: 100%; margin: 20px auto"
            border
          >
            <el-table-column label="序号" type="index" width="50" />
            <el-table-column prop="patentName" label="专利名称" />
            <el-table-column prop="patentAuthorName" label="第一作者" />
            <el-table-column prop="patentGrantTime" label="专利授权日期" />
            <el-table-column prop="patentGrantNumber" label="专利授权号" />
            <el-table-column prop="patentType" label="专利类型" />
            <el-table-column label="证明材料" align="center">
              <template slot-scope="scope">
                <a :href="scope.row.patentProveMaterials">下载文件</a>
              </template>
            </el-table-column>
            <el-table-column label="成果认定" align="center">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.col1 === null || scope.row.col1 === ''"
                  type="info"
                >
                  待审核
                </el-tag>
                <el-tag v-else-if="scope.row.col1 === '通过'" type="success">
                  通过
                </el-tag>
                <el-tag v-else type="danger"> 不通过 </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="col2" />
            <el-table-column
              label="操作"
              align="center"
              width="160"
              class-name="small-padding fixed-width"
            >
              <template v-if="scope.row.tutorId !== 1" slot-scope="scope">
                <el-button
                  type="success"
                  icon="el-icon-success"
                  size="mini"
                  plain
                  @click="checkIn(scope.row.patentId, scope.$index, 5)"
                >通过
                </el-button>
                <el-button
                  type="danger"
                  plain
                  icon="el-icon-error"
                  size="mini"
                  @click="
                    checkOut(
                      scope.row.patentId,
                      scope.$index,
                      5,
                      scope.row.col2
                    )
                  "
                >驳回
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <br>

    <br>
    <el-row type="flex" justify="end">
      <el-col :span="4" :offset="21">
        <el-button type="primary" @click="submitPass">确认提交</el-button>
      </el-col>
    </el-row>
    <br><br>

    <!-- 驳回时的备注弹框 -->
    <el-dialog title="备注" :visible.sync="dialogVisible" width="30%">
      <el-form label-width="80px">
        <el-form-item label="请输入驳回理由(可以为空)">
          <el-input
            v-model="reject.col2"
            type="textarea"
            :autosize="{ minRows: 6 }"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rejectConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { init, check, commitMaterial } from '@/api/scienceDepartment/index'

export default {
  props: {
    science: Number
  },
  data() {
    return {
      reject: {
        id: '', // 驳回的材料 id
        index: -1, // 索引
        col2: '', // 驳回备注
        type: -1 // 驳回类型
      },

      rejectList: [], // 不通过列表
      applyId: '',
      tutorId: '',
      name: '',
      organizationName: '',
      dialogVisible: false, // 备注弹框显示

      paperList: [], // 学术论文
      projectList: [], // 科研项目
      workList: [], // 教材或学术著作
      awardList: [], // 科研教学奖励
      patentList: [] // 发明专利
    }
  },
  created() {
    this.tutorId = this.$route.query.tutorId
    this.applyId = this.$route.query.applyId
    this.init()
  },
  methods: {
    // 获取所有数据
    init() {
      init(this.tutorId, this.applyId).then((res) => {
        this.paperList = res.data.paperList
        this.projectList = res.data.projectList
        this.workList = res.data.workList
        this.awardList = res.data.awardList
        this.patentList = res.data.patentList
        this.name = res.data.name
        this.tutorId = res.data.tutorId
        this.organizationName = res.data.organizationName
      })
    },

    /**
     * 审批通过方法
     */
    checkIn(id, index, type) {
      check(id, type, 1, {}).then((res) => {
        if (res.code === 20000) {
          switch (type) {
            case 1:
              this.paperList[index].col1 = '通过'
              this.paperList[index].col2 = ''
              break
            case 2:
              this.projectList[index].col1 = '通过'
              this.projectList[index].col2 = ''
              break
            case 3:
              this.workList[index].col1 = '通过'
              this.workList[index].col2 = ''
              break
            case 4:
              this.awardList[index].col1 = '通过'
              this.awardList[index].col2 = ''
              break
            case 5:
              this.patentList[index].col1 = '通过'
              this.patentList[index].col2 = ''
              break
          }
          this.$message.success('审核成功！')
        } else {
          this.$message.error('网络出现问题，请稍后再试！')
        }
      })
    },

    // 审批驳回
    checkOut(id, index, type, col2) {
      this.reject.id = id
      this.reject.index = index
      this.reject.type = type
      this.reject.col2 = col2
      this.dialogVisible = true
    },

    // 审批驳回提交
    rejectConfirm() {
      check(this.reject.id, this.reject.type, 2, {
        col2: this.reject.col2
      }).then((res) => {
        const index = this.reject.index
        if (res.code === 20000) {
          switch (this.reject.type) {
            case 1:
              this.paperList[index].col1 = '不通过'
              this.paperList[index].col2 = this.reject.col2
              break
            case 2:
              this.projectList[index].col1 = '不通过'
              this.projectList[index].col2 = this.reject.col2
              break
            case 3:
              this.workList[index].col1 = '不通过'
              this.workList[index].col2 = this.reject.col2
              break
            case 4:
              this.awardList[index].col1 = '不通过'
              this.awardList[index].col2 = this.reject.col2
              break
            case 5:
              this.patentList[index].col1 = '不通过'
              this.patentList[index].col2 = this.reject.col2
              break
          }
          this.$message.success('审核成功！')
          this.reject.col2 = ''
          this.dialogVisible = false
        } else {
          this.$message.error('网络出现问题，请稍后再试！')
        }
      })
    },

    // 提交审核弹框
    submitPass() {
      this.$confirm('确认提交?', '提示')
        .then(() => {
          // 计算通过信息
          if (!this.calculationCheck()) {
            this.rejectList = []
            this.$message.warning('材料审核未完成！')
            return
          }
          let commitSocial = ''
          let type = 1
          // 审核不通过
          if (this.rejectList.length !== 0) {
            // 获取拒绝的拼接备注
            commitSocial = this.getCommitSocial()
            type = 2
          }
          commitMaterial(
            this.applyId,
            { commitSocial: commitSocial },
            type,
            this.science
          ).then((res) => {
            if (res.code === 20000) {
              this.$message.success('材料审核完成')
              this.rejectList = []
              this.goBack()
            }
          })
        })
        .catch(() => {
          console.log('cancel')
        })
    },

    // 计算审核情况
    calculationCheck() {
      let isCheckOk = true
      // 论文
      this.paperList.forEach((item) => {
        if (item.col1 === '' || item.col1 === null || item.col1 === '待审核') {
          isCheckOk = false
          return false
        } else if (item.col1 === '不通过') {
          this.addRejectItem(1, item.paperName, item.col2)
        }
      })
      if (!isCheckOk) {
        return false
      }

      // 项目
      this.projectList.forEach((item) => {
        if (item.col1 === '' || item.col1 === null || item.col1 === '待审核') {
          isCheckOk = false
          return false
        } else if (item.col1 === '不通过') {
          this.addRejectItem(2, item.projectName, item.col2)
        }
      })
      if (!isCheckOk) {
        return false
      }

      // 教材或学术著作
      this.workList.forEach((item) => {
        if (item.col1 === '' || item.col1 === null || item.col1 === '待审核') {
          isCheckOk = false
          return false
        } else if (item.col1 === '不通过') {
          this.addRejectItem(3, item.worksName, item.col2)
        }
      })
      if (!isCheckOk) {
        return false
      }

      // 科研教学奖励
      this.awardList.forEach((item) => {
        if (item.col1 === '' || item.col1 === null || item.col1 === '待审核') {
          isCheckOk = false
          return false
        } else if (item.col1 === '不通过') {
          this.addRejectItem(4, item.awardsName, item.col2)
        }
      })
      if (!isCheckOk) {
        return false
      }

      // 发明专利
      this.patentList.forEach((item) => {
        if (item.col1 === '' || item.col1 === null || item.col1 === '待审核') {
          isCheckOk = false
          return false
        } else if (item.col1 === '不通过') {
          this.addRejectItem(5, item.patentName, item.col2)
        }
      })
      return isCheckOk;
    },

    // 获取拒绝拼接字段
    getCommitSocial() {
      let commitSocial = ''
      const paper = this.rejectList.filter((item) => item.type === 1)
      if (paper.length !== 0) {
        commitSocial += '学术论文：\n'
        paper.forEach((item, index) => {
          commitSocial += `论文${index + 1}: ${item.name}, 驳回原因: ${
            item.col2
          } \n`
        })
      }
      const project = this.rejectList.filter((item) => item.type === 2)
      if (project.length !== 0) {
        commitSocial += '\n科研项目：\n'
        project.forEach((item, index) => {
          commitSocial += `项目${index + 1}: ${item.name}, 驳回原因: ${
            item.col2
          } \n`
        })
      }
      const work = this.rejectList.filter((item) => item.type === 3)
      if (work.length !== 0) {
        commitSocial += '\n教材或学术著作\n'
        work.forEach((item, index) => {
          commitSocial += `著作${index + 1}: ${item.name}, 驳回原因: ${
            item.col2
          } \n`
        })
      }
      const award = this.rejectList.filter((item) => item.type === 4)
      if (award.length !== 0) {
        commitSocial += '\n科研教学奖励\n'
        award.forEach((item, index) => {
          commitSocial += `奖励${index + 1}: ${item.name}, 驳回原因: ${
            item.col2
          } \n`
        })
      }
      const patent = this.rejectList.filter((item) => item.type === 5)
      if (patent.length !== 0) {
        commitSocial += '\n发明专利\n'
        patent.forEach((item, index) => {
          commitSocial += `专利${index + 1}: ${item.name}, 驳回原因: ${
            item.col2
          } \n`
        })
      }
      return commitSocial
    },

    // 添加拒绝项目列表
    addRejectItem(type, name, col2) {
      const rejectItem = {
        type: Number,
        name: String,
        col2: String
      }
      rejectItem.type = type
      rejectItem.name = name
      rejectItem.col2 = col2
      this.rejectList.push(rejectItem)
    },

    // 返回
    goBack() {
      let path = ''
      if (this.science === 1) {
        path = '/social/socialScienceCheck'
      } else {
        path = '/research/researchCheck'
      }
      this.$router.push({
        path: path,
        query: { applyId: this.applyId }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
a {
  text-decoration: underline;
  color: #409eff;
}
</style>
