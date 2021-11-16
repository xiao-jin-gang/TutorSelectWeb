<template>
  <div v-loading="loading" element-loading-text="获取中..." class="main">
    <el-card class="box-card" style="width: 90%; position: relative; left: 5%">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span="12">
            <h2>申请详情信息</h2>
          </el-col>
          <el-col :span="12">
            <el-button v-if="applyStatus !== 6" style="float: right; margin-left: 10px;" type="primary" @click="exportPdfBtn">导出 PDF</el-button>
            <div v-else>
              <el-button style="float: right; margin-left: 10px;" type="success" @click="submitApply">提交申请</el-button>
              <el-button style="float: right;" type="warning" @click="editApply">修改信息</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 非免审 -->
      <div v-if="applyTypeId !== 3 && applyTypeId !== 6 && applyTypeId !== 9">
        <!-- 第一页基础信息 -->
        <el-row>
          <el-col :span="18">
            <el-descriptions class="margin-top" :column="2" border label-class-name="description-item">
              <el-descriptions-item>
                <template slot="label">姓名</template>{{ details.firstPage.name }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">性别</template>{{ details.firstPage.gender }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">工号</template>{{ details.firstPage.tutorId }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">出生日期</template>{{ details.firstPage.birthday }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">所在单位</template>{{ details.firstPage.organizationName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">证件号</template>{{ details.firstPage.identity }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">联系电话</template>{{ details.firstPage.phone }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">电子邮箱</template>{{ details.firstPage.email }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">最后学位</template>{{ details.firstPage.finalDegree }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">授予单位及时间</template>{{ details.firstPage.awardingUnitTime }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">{{ applyTypeId >= 7 ? '现任专业技术职务' : '职称' }}</template>{{ details.firstPage.title }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">评定时间</template>{{ details.firstPage.evaluateTime }}
              </el-descriptions-item>
              <!-- 首次博导 -->
              <el-descriptions-item v-if="applyTypeId === 1">
                <template slot="label">任硕导时间</template>{{ details.secondPage.firstDoctoralFirstTimeTutor }}
              </el-descriptions-item>
              <el-descriptions-item v-if="applyTypeId === 1">
                <template slot="label">任硕导一级学科</template>{{ details.secondPage.firstDoctoralFirstDiscipline }}
              </el-descriptions-item>
              <!-- 博导增岗 -->
              <el-descriptions-item v-if="applyTypeId === 2">
                <template slot="label">博导在岗学科</template>{{ details.secondPage.doctoralTutorOnDuty }}
              </el-descriptions-item>
              <el-descriptions-item v-if="applyTypeId === 2">
                <template slot="label">上岗时间</template>{{ details.secondPage.doctoralStartTime }}
              </el-descriptions-item>
              <!-- 学硕增岗 -->
              <el-descriptions-item v-if="applyTypeId === 5">
                <template slot="label">硕导在岗学科</template>{{ details.secondPage.masterDegreeIncreaseTutorOnDuty }}
              </el-descriptions-item>
              <el-descriptions-item v-if="applyTypeId === 5">
                <template slot="label">上岗时间</template>{{ details.secondPage.masterDegreeIncreaseTutorStartTime }}
              </el-descriptions-item>
              <!-- 专硕增岗 -->
              <el-descriptions-item v-if="applyTypeId === 8">
                <template slot="label">硕导在岗类别</template>{{ details.secondPage.professionalMasterOnDuty }}
              </el-descriptions-item>
              <el-descriptions-item v-if="applyTypeId === 8">
                <template slot="label">上岗时间</template>{{ details.secondPage.professionalMasterStartTime }}
              </el-descriptions-item>
              <!-- 外单位调入填写，三个增岗 -->
              <el-descriptions-item v-if="(applyTypeId === 2 || applyTypeId === 5 || applyTypeId === 8) && details.secondPage.sourceUnitName !== null">
                <template slot="label">仅外单位调入填写</template><b>原单位名称:</b> {{ details.secondPage.sourceUnitName }}  <b> 调入时间: </b>{{ details.secondPage.transferInTime }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-image
            style="width: 150px; height: 210px; position: relative; left: 5%; margin-top: 2%;"
            :src="details.firstPage.image"
            fit="fit"
          />
        </el-row>
        <!-- 第二页信息 -->
        <el-row>
          <!-- 研究信息 -->
          <el-col :span="24">
            <el-descriptions class="margin-top" :column="1" border label-class-name="description-item-second">
              <!-- 主要研究方向 -->
              <el-descriptions-item>
                <template slot="label">
                  主要研究方向 <br>的内容及其意义
                </template>
                {{ details.secondPage.major }}
              </el-descriptions-item>
              <!-- 何时参加何种团体 -->
              <el-descriptions-item>
                <template slot="label">
                  何时参加种学术<br>团体、任何种职务<br>有何社会兼职
                </template>
                <p v-for="(item, index) in details.secondPage.groupsOrPartTimeJobs" :key="index">
                  {{ item.time }} {{ item.groups }} {{ item.job }}
                </p><br>
              </el-descriptions-item>
              <!-- 获得专家称号 -->
              <el-descriptions-item>
                <template slot="label">
                  获何专家称号 <br>及时间
                </template>
                <p v-for="(item, index) in details.secondPage.expertTitles" :key="index">
                  {{ item.time }} {{ item.title }}
                </p><br>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <!-- 申请信息 -->
          <el-col :span="24">
            <el-descriptions class="margin-top" :column="1" border label-class-name="description-item-second">
              <el-descriptions-item content-class-name="clear-padding">
                <template slot="label">
                  {{ applyTypeId >= 7 ? '申请类别' : '申请学科' }}
                </template>
                <!-- 学硕，博导 -->
                <el-descriptions v-if="applyTypeId < 7" class="margin-top" :column="1" border label-class-name="description-item-apply">
                  <el-descriptions-item>
                    <template slot="label">申请学科负责单位: </template>{{ details.secondPage.doctoralMasterApplicationSubjectUnit }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">一级学科代码: </template>{{ details.secondPage.doctoralMasterSubjectCode }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">一级学科名称: </template>{{ details.secondPage.doctoralMasterSubjectName }}
                  </el-descriptions-item>
                </el-descriptions>
                <!-- 专硕 -->
                <el-descriptions v-else class="margin-top" :column="2" border label-class-name="description-item-apply">
                  <el-descriptions-item :span="2">
                    <template slot="label">申请类别负责单位: </template>{{ details.secondPage.professionalApplicationSubjectUnit }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">类别代码: </template>{{ details.secondPage.professionalApplicationSubjectCode }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">类别名称: </template>{{ details.secondPage.professionalApplicationSubjectName }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">领域代码: </template>{{ details.secondPage.professionalFieldCode }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">领域名称: </template>{{ details.secondPage.professionalFieldName }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row><br>
        <!-- 第三页信息 -->
        <el-row>
          <!-- 近五年科研成果汇总 -->
          <el-col :span="24">
            <el-divider content-position="center"><h3>近五年科研成果汇总</h3></el-divider>
            <div class="summary-parent">
              <p>
                1.以第一作者或通讯作者在核心及以上期刊发表与本学科相关的学术论文共
                <span class="summary"> {{ details.thirdPage.summary.firstAuthorPaper }} </span>篇，
                其中权威<span class="summary"> {{ details.thirdPage.summary.authorityAmount }} </span>篇，
                EI<span class="summary"> {{ details.thirdPage.summary.eiAmount }} </span>篇，
                CSCD<span class="summary"> {{ details.thirdPage.summary.cscdAmount }} </span>篇，
                A&HCI<span class="summary"> {{ details.thirdPage.summary.ahciAmount }} </span>篇，
                CSSCI<span class="summary"> {{ details.thirdPage.summary.cssciAmount }} </span>篇，
                CPCI<span class="summary"> {{ details.thirdPage.summary.cpciAmount }} </span>篇。
              </p>
              <p>
                2.主持在研科研项目共<span class="summary"> {{ details.thirdPage.summary.directProject }} </span>项，
                其中国家级<span class="summary"> {{ details.thirdPage.summary.projectNationalLevel }} </span>项，
                省部级<span class="summary"> {{ details.thirdPage.summary.projectProvinceLevel }} </span>项； 在研项目中累计到款科研经费
                <span class="summary"> {{ details.thirdPage.summary.accumulatedFunds }} </span>
                万元， 其中横向项目到款经费
                <span class="summary"> {{ details.thirdPage.summary.horizontalProject }} </span>万元。
              </p>
              <p>
                3.出版本专业领域内研究生教材或学术著作（译著）
                <span class="summary"> {{ details.thirdPage.summary.publishWorks }} </span>
                部， 每部本人完成
                <span class="summary"> {{ details.thirdPage.summary.publishWorksWords }} </span>
                万字。
              </p>
              <p>
                4.科研教学获奖共
                <span class="summary"> {{ details.thirdPage.summary.scientificAwards }} </span>
                项， 其中国家级
                <span class="summary"> {{ details.thirdPage.summary.awardsNationalLevel }} </span>
                项， 省部级
                <span class="summary"> {{ details.thirdPage.summary.awardsProvinceLevel }} </span>
                项。
              </p>
              <p>
                5.以第一发明人授权职务发明专利
                <span class="summary"> {{ details.thirdPage.summary.inventionPatentAmount }} </span>
                项， 实用新型专利
                <span class="summary"> {{ details.thirdPage.summary.newUtilityPatent }} </span>
                项。
              </p>
            </div>
          </el-col>
          <!-- 近五年代表性科研成果 -->
          <el-col :span="24">
            <el-divider content-position="center"><h3>近五年代表性科研成果</h3></el-divider>
            <!-- 学术论文 -->
            <el-descriptions direction="vertical" :colon="false" :column="1" border content-class-name="clear-padding">
              <el-descriptions-item>
                <template slot="label"><b>学术论文</b></template>
                <el-table :data="details.thirdPage.academicPapers" style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="50" />
                  <el-table-column align="center" prop="paperName" label="论文名称" />
                  <el-table-column align="center" prop="paperPublicationTime" label="发表时间" />
                  <el-table-column align="center" prop="firstAuthorName" label="第一作者" />
                  <el-table-column align="center" prop="communicationAuthorName" label="通讯作者" />
                  <el-table-column align="center" prop="journalName" label="期刊名称" />
                  <el-table-column align="center" prop="journalCategory" label="期刊类别" />
                  <el-table-column align="center" prop="sciPart" label="分区" />
                  <el-table-column align="center" prop="journalLevel" label="期刊等级" />
                  <el-table-column align="center" prop="impactFactors" label="影响因子" />
                  <el-table-column align="center" label="证明资料" width="90">
                    <template slot-scope="scope">
                      <a target="_blank" :href="scope.row.paperProveMaterials">
                        <el-button size="mini" type="primary" plain>查 看</el-button>
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
              </el-descriptions-item>
            </el-descriptions><br>
            <!-- 科研项目 -->
            <el-descriptions direction="vertical" :colon="false" :column="1" border content-class-name="clear-padding">
              <el-descriptions-item>
                <template slot="label"><b>科研项目</b></template>
                <el-table :data="details.thirdPage.researchProjects" style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="50" />
                  <el-table-column align="center" prop="projectName" label="项目名称" />
                  <el-table-column align="center" prop="approvalNumber" label="批准号" />
                  <el-table-column align="center" prop="projectChargeName" label="负责人姓名" width="100" />
                  <el-table-column align="center" prop="projectStartTime" label="开始日期" />
                  <el-table-column align="center" prop="projectEndTime" label="结束日期" />
                  <el-table-column align="center" prop="projectCategory" label="项目分类" />
                  <el-table-column align="center" prop="projectTotalPrice" label="总经费（万元）" width="120" />
                  <el-table-column align="center" prop="projectLevel" label="项目级别" />
                  <el-table-column align="center" label="证明资料" width="90">
                    <template slot-scope="scope">
                      <a target="_blank" :href="scope.row.projectProveMaterials">
                        <el-button size="mini" type="primary" plain>查 看</el-button>
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
              </el-descriptions-item>
            </el-descriptions><br>
            <!-- 教材或学术著作 -->
            <el-descriptions direction="vertical" :colon="false" :column="1" border content-class-name="clear-padding">
              <el-descriptions-item>
                <template slot="label"><b>教材或学术著作</b></template>
                <el-table :data="details.thirdPage.academicWorks" style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="50px" />
                  <el-table-column align="center" prop="worksName" label="著作名称" />
                  <el-table-column align="center" prop="worksNumber" label="著作编号" />
                  <el-table-column align="center" prop="worksPublicationTime" label="出版日期" />
                  <el-table-column align="center" prop="worksPublicationUnit" label="出版单位" />
                  <el-table-column align="center" prop="totalWords" label="完成字数（万字）" />
                  <el-table-column align="center" prop="authorName" label="作者姓名" />
                  <el-table-column align="center" label="证明资料" width="90">
                    <template slot-scope="scope">
                      <a target="_blank" :href="scope.row.worksProveMaterials">
                        <el-button size="mini" type="primary" plain>查 看</el-button>
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
              </el-descriptions-item>
            </el-descriptions><br>
            <!-- 科研教学奖励 -->
            <el-descriptions direction="vertical" :colon="false" :column="1" border content-class-name="clear-padding">
              <el-descriptions-item>
                <template slot="label"><b>科研教学奖励</b></template>
                <el-table :data="details.thirdPage.teachingAwards" style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="50px" />
                  <el-table-column align="center" prop="awardsName" label="奖励名称" />
                  <el-table-column align="center" prop="awardsRank" label="排名" />
                  <el-table-column align="center" prop="awardsUnit" label="颁奖单位" />
                  <el-table-column align="center" prop="awardsLevel" label="获奖级别" />
                  <el-table-column align="center" prop="awardsTime" label="获奖日期" />
                  <el-table-column align="center" prop="awardsAuthorName" label="获奖人姓名" />
                  <el-table-column align="center" label="证明资料" width="90">
                    <template slot-scope="scope">
                      <a target="_blank" :href="scope.row.awardsProveMaterials">
                        <el-button size="mini" type="primary" plain>查 看</el-button>
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
              </el-descriptions-item>
            </el-descriptions><br>
            <!-- 发明专利 -->
            <el-descriptions direction="vertical" :colon="false" :column="1" border content-class-name="clear-padding">
              <el-descriptions-item>
                <template slot="label"><b>发明专利</b></template>
                <el-table :data="details.thirdPage.inventionPatents" style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="50px" />
                  <el-table-column align="center" prop="patentName" label="专利名称" />
                  <el-table-column align="center" prop="patentAuthorName" label="第一作者" />
                  <el-table-column align="center" prop="patentGrantTime" label="专利授权日期" />
                  <el-table-column align="center" prop="patentGrantNumber" label="专利授权号" />
                  <el-table-column align="center" prop="patentType" label="专利类型" />
                  <el-table-column align="center" label="证明资料" width="90">
                    <template slot-scope="scope">
                      <a target="_blank" :href="scope.row.patentProveMaterials">
                        <el-button size="mini" type="primary" plain>查 看</el-button>
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
              </el-descriptions-item>
            </el-descriptions><br>
          </el-col>
          <!-- 教学信息 -->
          <el-col :span="24">
            <el-divider content-position="center"><h3>教学信息</h3></el-divider>
            <!-- 研究生课程教学情况 -->
            <div>
              <el-descriptions direction="vertical" :colon="false" :column="1" border content-class-name="clear-padding">
                <el-descriptions-item>
                  <template slot="label"><b>研究生课程教学情况</b></template>
                  <el-table :data="details.fourthPage.courseTeachings" style="width: 100%">
                    <el-table-column align="center" type="index" label="序号" width="50px" />
                    <el-table-column align="center" prop="courseName" label="课程名称" />
                    <el-table-column align="center" prop="courseTime" label="课程时间" width="150" />
                    <el-table-column align="center" prop="courseDuration" label="授课总课时" width="150" />
                    <el-table-column align="center" prop="courseObject" label="授课对象" width="180" />
                  </el-table>
                </el-descriptions-item>
              </el-descriptions><br>
            </div>
            <!-- 指导博士生情况, 博导增岗 -->
            <div v-if="applyTypeId === 2">
              <el-descriptions direction="vertical" :colon="false" :column="1" border content-class-name="clear-padding">
                <el-descriptions-item>
                  <template slot="label"><b>指导博士生情况</b></template>
                  <el-table :data="details.fourthPage.doctorStudents" style="width: 100%">
                    <el-table-column align="center" type="index" label="序号" width="50px" />
                    <el-table-column align="center" prop="studentName" label="学生姓名" width="150" />
                    <el-table-column align="center" prop="degreePaperTitle" label="硕士学位论文题目" />
                    <el-table-column align="center" prop="studentEntryTime" label="学生入学时间" width="150" />
                    <el-table-column align="center" prop="isGainDegree" label="是否获得学位" width="150" />
                  </el-table>
                </el-descriptions-item>
              </el-descriptions><br>
            </div>
            <!-- 协助指导博士生情况, 首次博导 -->
            <div v-if="applyTypeId === 1">
              <el-descriptions direction="vertical" :colon="false" :column="1" border content-class-name="clear-padding">
                <el-descriptions-item>
                  <template slot="label"><b>协助指导博士生情况</b></template>
                  <el-table :data="details.fourthPage.assistDoctorStudents" style="width: 100%">
                    <el-table-column align="center" type="index" label="序号" width="50px" />
                    <el-table-column align="center" prop="studentName" label="学生姓名" width="150" />
                    <el-table-column align="center" prop="degreePaperTitle" label="硕士学位论文题目" />
                    <el-table-column align="center" prop="studentEntryTime" label="学生入学时间" width="150" />
                    <el-table-column align="center" prop="isGainDegree" label="是否获得学位" width="150" />
                  </el-table>
                </el-descriptions-item>
              </el-descriptions><br>
            </div>
            <!-- 指导硕士生情况, 首次博导 博导增岗 学硕增岗 专硕增岗 -->
            <div v-if="applyTypeId === 1 || applyTypeId === 2 || applyTypeId === 5 || applyTypeId === 8">
              <el-descriptions direction="vertical" :colon="false" :column="1" border content-class-name="clear-padding">
                <el-descriptions-item>
                  <template slot="label"><b>指导硕士生情况</b></template>
                  <el-table :data="details.fourthPage.masterStudents" style="width: 100%">
                    <el-table-column align="center" type="index" label="序号" width="50px" />
                    <el-table-column align="center" prop="studentName" label="学生姓名" width="150" />
                    <el-table-column align="center" prop="degreePaperTitle" label="硕士学位论文题目" />
                    <el-table-column align="center" prop="studentEntryTime" label="学生入学时间" width="150" />
                    <el-table-column align="center" prop="isGainDegree" label="是否获得学位" width="150" />
                  </el-table>
                </el-descriptions-item>
              </el-descriptions><br>
            </div>
            <!-- 协助指导硕士生情况, 首次学硕 首次专硕 -->
            <div v-if="applyTypeId === 4 || applyTypeId === 7">
              <el-descriptions direction="vertical" :colon="false" :column="1" border content-class-name="clear-padding">
                <el-descriptions-item>
                  <template slot="label"><b>协助指导硕士生情况</b></template>
                  <el-table :data="details.fourthPage.assistMasterStudents" style="width: 100%">
                    <el-table-column align="center" type="index" label="序号" width="50px" />
                    <el-table-column align="center" prop="studentName" label="学生姓名" width="120" />
                    <el-table-column align="center" prop="degreePaperTitle" label="硕士学位论文题目" />
                    <el-table-column align="center" prop="studentEntryTime" label="学生入学时间" width="120" />
                    <el-table-column align="center" prop="isGainDegree" label="是否获得学位" width="120" />
                  </el-table>
                </el-descriptions-item>
              </el-descriptions><br>
            </div>
            <!-- 指导本科生毕业情况, 首次学硕 首次专硕 -->
            <div v-if="applyTypeId === 4 || applyTypeId === 7">
              <el-descriptions direction="vertical" :colon="false" :column="1" border content-class-name="clear-padding">
                <el-descriptions-item>
                  <template slot="label"><b>指导本科生毕业情况</b></template>
                  <el-table :data="details.fourthPage.undergraduateStudents" style="width: 100%">
                    <el-table-column align="center" type="index" label="序号" width="50px" />
                    <el-table-column align="center" prop="studentName" label="学生姓名" width="180" />
                    <el-table-column align="center" prop="degreePaperTitle" label="学位论文题目" />
                    <el-table-column align="center" prop="graduateTime" label="毕业时间" width="180" />
                  </el-table>
                </el-descriptions-item>
              </el-descriptions><br>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 免审 -->
      <div v-else>
        <!-- 第一页基础信息 -->
        <el-row>
          <el-col :span="18">
            <el-descriptions class="margin-top" :column="2" border label-class-name="description-item">
              <el-descriptions-item>
                <template slot="label">姓名</template>{{ details.noFirstPage.name }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">性别</template>{{ details.noFirstPage.gender }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">工号</template>{{ details.noFirstPage.tutorId }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">出生日期</template>{{ details.noFirstPage.birthday }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">所在单位</template>{{ details.noFirstPage.organizationName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">证件号</template>{{ details.noFirstPage.identity }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">联系电话</template>{{ details.noFirstPage.phone }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">电子邮箱</template>{{ details.noFirstPage.email }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">最后学位</template>{{ details.noFirstPage.finalDegree }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">授予单位及时间</template>{{ details.noFirstPage.awardingUnitTime }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">职称</template>{{ details.noFirstPage.title }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">评定时间</template>{{ details.noFirstPage.evaluateTime }}
              </el-descriptions-item>
              <!-- 博导免审 -->
              <el-descriptions-item v-if="applyTypeId === 3">
                <template slot="label">硕导上岗时间</template>{{ details.noSecondPage.masterDirectorTime }}
              </el-descriptions-item>
              <el-descriptions-item v-if="applyTypeId === 3">
                <template slot="label">硕士招生学科</template>{{ details.noSecondPage.masterDirectorSubject }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-image
            style="width: 150px; height: 210px; position: relative; left: 5%; margin-top: 2%;"
            :src="details.noFirstPage.image"
            fit="fit"
          />
        </el-row>
        <!-- 第二页信息 -->
        <el-row>
          <el-col :span="24">
            <!-- 主要研究方向, 免审条件 -->
            <el-descriptions class="margin-top" :column="1" border label-class-name="description-item-second">
              <!-- 主要研究方向 -->
              <el-descriptions-item>
                <template slot="label">
                  主要研究方向
                </template>
                {{ details.noSecondPage.researchDirections }}
              </el-descriptions-item>
              <!-- 免审条件 -->
              <el-descriptions-item>
                <template slot="label">
                  免审条件 <br>
                  <a v-if="details.noSecondPage.exemptionConditionsMaterials !== null" target="_blank" :href="details.noSecondPage.exemptionConditionsMaterials" style="margin-top: 10px">
                    <el-button size="mini" type="text" style="text-decoration: underline;">查看材料</el-button>
                  </a>
                </template>
                {{ details.noSecondPage.exemptionConditions }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="24">
            <!-- 申请信息 -->
            <el-descriptions class="margin-top" :column="1" border label-class-name="description-item-second">
              <el-descriptions-item content-class-name="clear-padding">
                <template slot="label">
                  {{ applyTypeId >= 7 ? '申请类别' : '申请学科' }}
                </template>
                <!-- 学硕，博导免审 -->
                <el-descriptions v-if="applyTypeId === 3 || applyTypeId === 6" class="margin-top" :column="1" border label-class-name="description-item-second">
                  <el-descriptions-item>
                    <template slot="label">申请学科负责单位: </template>{{ details.noSecondPage.appliedSubjectUnit }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">一级学科代码: </template>{{ details.noSecondPage.appliedSubjectCode }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">一级学科名称: </template>{{ details.noSecondPage.appliedSubjectName }}
                  </el-descriptions-item>
                </el-descriptions>
                <!-- 专硕免审 -->
                <el-descriptions v-else class="margin-top" :column="2" border label-class-name="description-item-apply">
                  <el-descriptions-item :span="2">
                    <template slot="label">申请类别负责单位: </template>{{ details.noSecondPage.professionalApplicationSubjectUnit }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">类别代码: </template>{{ details.noSecondPage.professionalApplicationSubjectCode }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">类别名称: </template>{{ details.noSecondPage.professionalApplicationSubjectName }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">领域代码: </template>{{ details.noSecondPage.professionalFieldCode }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">领域名称: </template>{{ details.noSecondPage.professionalFieldName }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-descriptions-item>
            </el-descriptions>
            <el-divider content-position="center"><h3>科研教学情况</h3></el-divider>
            <!-- 科研项目 -->
            <el-descriptions direction="vertical" :colon="false" :column="1" border content-class-name="clear-padding">
              <el-descriptions-item>
                <template slot="label"><b>科研项目</b></template>
                <el-table :data="details.noSecondPage.researchProjects" style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="50" />
                  <el-table-column align="center" prop="projectName" label="项目名称" />
                  <el-table-column align="center" prop="approvalNumber" label="批准号" />
                  <el-table-column align="center" prop="projectChargeName" label="负责人姓名" width="100" />
                  <el-table-column align="center" prop="projectStartTime" label="开始日期" />
                  <el-table-column align="center" prop="projectEndTime" label="结束日期" />
                  <el-table-column align="center" prop="projectCategory" label="项目分类" />
                  <el-table-column align="center" prop="projectTotalPrice" label="总经费（万元）" width="120" />
                  <el-table-column align="center" prop="projectLevel" label="项目级别" />
                  <el-table-column align="center" label="证明资料" width="90">
                    <template slot-scope="scope">
                      <a target="_blank" :href="scope.row.projectProveMaterials">
                        <el-button size="mini" type="primary" plain>查 看</el-button>
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
              </el-descriptions-item>
            </el-descriptions><br>
            <!-- 教学情况 -->
            <el-descriptions direction="vertical" :colon="false" :column="1" border content-class-name="clear-padding">
              <el-descriptions-item>
                <template slot="label"><b>教学奖励</b></template>
                <el-table :data="details.noSecondPage.teachingAwards" style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="50px" />
                  <el-table-column align="center" prop="awardsName" label="奖励名称" />
                  <el-table-column align="center" prop="awardsRank" label="排名" />
                  <el-table-column align="center" prop="awardsUnit" label="颁奖单位" />
                  <el-table-column align="center" prop="awardsLevel" label="获奖级别" />
                  <el-table-column align="center" prop="awardsTime" label="获奖日期" />
                  <el-table-column align="center" prop="awardsAuthorName" label="获奖人姓名" />
                  <el-table-column align="center" label="证明资料" width="90">
                    <template slot-scope="scope">
                      <a target="_blank" :href="scope.row.awardsProveMaterials">
                        <el-button size="mini" type="primary" plain>查 看</el-button>
                      </a>
                    </template>
                  </el-table-column>
                </el-table>
              </el-descriptions-item>
            </el-descriptions><br>

          </el-col>
        </el-row><br>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getApplyDetails, exportPdf, changeStatus } from '@/api/tutor/myApply'

export default {
  name: 'Index',
  data() {
    return {
      loading: false,
      applyId: this.$route.params.applyId * 1,
      applyTypeId: this.$route.params.applyTypeId * 1,
      applyStatus: this.$route.params.applyStatus * 1,
      details: {},
      pdfHttpPath: ''
    }
  },
  created() {
    this.getApplyDetails()
    this.loading = true
  },
  methods: {
    // 导出pdf
    exportPdfBtn: function() {
      exportPdf(this.applyId, this.applyTypeId).then(res => {
        if (res.data.code === 1201) {
          // pdf下载
          this.pdfHttpPath = res.data.pdfPath
          window.open(this.pdfHttpPath)
          this.$message.success('导出成功!')
        } else {
          this.$message.error('导出失败!')
        }
      })
    },

    // 提交申请
    submitApply: function() {
      this.$alert('请务必点击查看，确认信息填写正确后再提交，提交后不可修改！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeStatus(this.applyId, 2).then(res => {
          if (res.code === 1201) {
            this.$message.error(res.data.message())
          } else {
            this.$message.success('提交成功！')
            this.applyStatus = 10
          }
        })
      }).catch(() => {
        console.log('cancel')
      })
    },

    // 修改申请信息
    editApply: async function() {
      let url = '/tutorApply/'
      switch (this.applyTypeId) {
        case 1:
          url += `firstApplyDoctor/1`
          await changeStatus(this.applyId, 1)
          break
        case 2: url += `addApplyDoctor/2`; break
        case 3: url += `noInspectApplyDoctor/3`; break
        case 4:
          url += `firstApplyMaster/4`
          await changeStatus(this.applyId, 1)
          break
        case 5: url += `addApplyMaster/5`; break
        case 6: url += `noInspectApplyMaster/6`; break
        case 7: url += `firstApplyProfessional/7`; break
        case 8: url += `addApplyProfessional/8`; break
        case 9: url += `noInspectApplyProfessional/9`; break
      }
      // console.log(`${url}/101/${value.applyId}`)
      this.$router.push(`${url}/101/${this.applyId}`)
    },

    // 获取所有信息
    getApplyDetails: function() {
      getApplyDetails(this.applyId, this.applyTypeId === 3 || this.applyTypeId === 6 || this.applyTypeId === 9 ? 0 : 1, this.$route.params.tutorId).then(res => {
        if (this.applyTypeId !== 3 && this.applyTypeId !== 6 && this.applyTypeId !== 9) {
          const students = res.data.fourthPage.guidingStudents
          switch (this.applyTypeId) {
            case 1: // 首次博导, 协助指导博士生 指导硕士生
              res.data.fourthPage.assistDoctorStudents = students.filter(item => item.studentType === '博士')
              res.data.fourthPage.masterStudents = students.filter(item => item.studentType === '硕士')
              break
            case 2: // 博导增岗, 指导博士生 指导硕士生
              res.data.fourthPage.doctorStudents = students.filter(item => item.studentType === '博士')
              res.data.fourthPage.masterStudents = students.filter(item => item.studentType === '硕士')
              break
            case 3: // 博导免审
              break
            case 4: // 首次学硕, 协助指导硕士生 指导本科生
              res.data.fourthPage.assistMasterStudents = students.filter(item => item.studentType === '硕士')
              res.data.fourthPage.undergraduateStudents = students.filter(item => item.studentType === '本科')
              break
            case 5: // 学硕增岗, 指导硕士生
              res.data.fourthPage.masterStudents = students
              break
            case 6: // 学硕免审
              break
            case 7: // 首次专硕, 协助指导硕士生 指导本科生
              res.data.fourthPage.assistMasterStudents = students.filter(item => item.studentType === '硕士')
              res.data.fourthPage.undergraduateStudents = students.filter(item => item.studentType === '本科')
              break
            case 8: // 专硕增岗, 指导硕士生
              res.data.fourthPage.masterStudents = students
              break
            case 9: // 专硕免审
              break
          }
        }
        this.details = res.data
        this.loading = false
      }).catch(error => {
        throw error
      })
    }
  }
}
</script>

<style>
.text {
  font-size: 14px;
}
.box-card {
  margin-bottom: 50px;
}
.photo {
  width: 150px;
}
.description-item {
  width: 18%;
  text-align: center !important;
}
/* 第二页的申请描述 */
.description-item-second {
  width: 13.5%;
  text-align: center !important;
}
.clear-padding {
  padding: 0 !important;
}
/* 申请信息的描述 */
.description-item-apply {
  width: 18%;
}
.summary-parent {
  font-size: 18px;
  border: 1px solid #EBEEF5;
  color: #909399;
  padding: 10px 12px;
  margin: 10px 0;
}
.summary {
  font-weight: bold;
  font-size: 20px;
  color: #303133;
}
</style>
