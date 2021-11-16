<template>
  <div>
    <!-- 第 3 页学术信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h2>学术信息</h2>
      </div>
      <el-form
        ref="formThird"
        :model="formThird"
        label-width="150px"
        label-position="top"
      >
        <!-- 学术论文(近五年) -->
        <el-card class="box-card" shadow="always" v-loading = "load1">
          <div slot="header" class="clearfix">
            <span style="font-size: 18px">学术论文（近五年）（最多填写 6 篇）</span>
            <el-button
              class="addButton"
              style="float: right; margin-left: 15px"
              type="primary"
              plain
              @click="addFunc(1)"
            >添加社科类论文</el-button>
            <el-button
              class="addButton"
              style="float: right"
              type="primary"
              plain
              @click="addFunc(2)"
            >添加理工类论文</el-button>
          </div>

          <el-table :data="formThird.academicPapers" border style="width: 100%">
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="paperName" label="论文名称" />
            <el-table-column prop="paperPublicationTime" label="发表时间" />
            <el-table-column prop="firstAuthorName" label="第一作者" />
            <el-table-column prop="communicationAuthorName" label="通讯作者" />
            <el-table-column prop="journalName" label="期刊名称" />
            <el-table-column prop="journalCategory" label="期刊类别" />
            <el-table-column prop="sciPart" label="分区" />
            <el-table-column prop="journalLevel" label="期刊等级" />
            <el-table-column prop="impactFactors" label="影响因子" />
            <el-table-column label="证明资料" width="90" align="center">
              <template slot-scope="scope">
                <a target="_blank" :href="scope.row.paperProveMaterials">
                  <el-button size="mini" type="primary" plain>查 看</el-button>
                </a>
              </template>
            </el-table-column>
            <el-table-column align="center" width="150" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  plain
                  type="info"
                  @click="editFunc(scope.$index, scope.row, 1)"
                >编 辑</el-button>
                <el-button
                  size="mini"
                  plain
                  type="danger"
                  @click="deleteFunc(scope.$index, scope.row, 1)"
                >删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <el-row type="flex" justify="center">
            <el-col :span="4"><el-button @click="saveLearning(1)" type="primary">保存学术论文</el-button></el-col>
          </el-row>
        </el-card>
        <br>
        <!-- 科研项目（近五年） -->
        <el-card class="box-card" shadow="always"  v-loading = "load3">
          <div slot="header" class="clearfix">
            <span style="font-size: 18px">科研项目（近五年）（最多填写 5 个）</span>
            <el-button
              class="addButton"
              style="float: right"
              type="primary"
              plain
              @click="addFunc(3)"
            >添加科研项目</el-button>
          </div>

          <el-table
            :data="formThird.researchProjects"
            border
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="50" />
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
            <el-table-column label="证明资料" width="90" align="center">
              <template slot-scope="scope">
                <a target="_blank" :href="scope.row.projectProveMaterials">
                  <el-button size="mini" type="primary" plain>查 看</el-button>
                </a>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="info"
                  plain
                  @click="editFunc(scope.$index, scope.row, 3)"
                >编 辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  @click="deleteFunc(scope.$index, scope.row, 3)"
                >删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <el-row type="flex" justify="center">
            <el-col :span="4"><el-button @click="saveLearning(3)" type="primary">保存科研项目</el-button></el-col>
          </el-row>
        </el-card>
        <br>
        <!-- 教材或学术著作（近五年） -->
        <el-card class="box-card" shadow="always"  v-loading = "load4">
          <div slot="header" class="clearfix">
            <span style="font-size: 18px">教材或学术著作（近五年）（最多填写 2 个）</span>
            <el-button
              style="float: right"
              class="addButton"
              type="primary"
              plain
              @click="addFunc(4)"
            >添加教材或学术著作
            </el-button>
          </div>
          <el-table :data="formThird.academicWorks" border style="width: 100%">
            <el-table-column type="index" label="序号" width="50px" />
            <el-table-column prop="worksName" label="著作名称" />
            <el-table-column prop="worksNumber" label="著作编号" />
            <el-table-column prop="worksPublicationTime" label="出版日期" />
            <el-table-column prop="worksPublicationUnit" label="出版单位" />
            <el-table-column prop="totalWords" label="完成字数（万字）" />
            <el-table-column prop="authorName" label="作者姓名" />
            <el-table-column label="证明资料" width="90" align="center">
              <template slot-scope="scope">
                <a target="_blank" :href="scope.row.worksProveMaterials">
                  <el-button size="mini" type="primary" plain>查 看</el-button>
                </a>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  plain
                  type="info"
                  @click="editFunc(scope.$index, scope.row, 4)"
                >编 辑</el-button>
                <el-button
                  size="mini"
                  plain
                  type="danger"
                  @click="deleteFunc(scope.$index, scope.row, 4)"
                >删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <el-row type="flex" justify="center">
            <el-col :span="4"><el-button @click="saveLearning(4)" type="primary">保存学术著作</el-button></el-col>
          </el-row>
        </el-card>
        <br>
        <!-- 科研教学奖励（近五年） -->
        <el-card class="box-card" shadow="always"  v-loading = "load5">
          <div slot="header" class="clearfix">
            <span style="font-size: 18px">科研教学奖励（近五年）（最多填写 2 个）</span>
            <el-button
              class="addButton"
              style="float: right"
              type="primary"
              plain
              @click="addFunc(5)"
            >添加科研教学奖励</el-button>
          </div>

          <el-table :data="formThird.teachingAwards" border style="width: 100%">
            <el-table-column type="index" label="序号" width="50px" />
            <el-table-column prop="awardsName" label="奖励名称" />
            <el-table-column prop="awardsRank" label="排名" />
            <el-table-column prop="awardsUnit" label="颁奖单位" />
            <el-table-column prop="awardsLevel" label="获奖级别" />
            <el-table-column prop="awardsTime" label="获奖日期" />
            <el-table-column prop="awardsAuthorName" label="获奖人姓名" />
            <el-table-column label="证明资料" width="90" align="center">
              <template slot-scope="scope">
                <a target="_blank" :href="scope.row.awardsProveMaterials">
                  <el-button size="mini" type="primary" plain>查 看</el-button>
                </a>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  plain
                  type="info"
                  @click="editFunc(scope.$index, scope.row, 5)"
                >编 辑</el-button>
                <el-button
                  size="mini"
                  plain
                  type="danger"
                  @click="deleteFunc(scope.$index, scope.row, 5)"
                >删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <el-row type="flex" justify="center">
            <el-col :span="4"><el-button @click="saveLearning(5)" type="primary">保存教学奖励</el-button></el-col>
          </el-row>

        </el-card>
        <br>
        <!-- 发明专利（近五年） -->
        <el-card class="box-card" shadow="always"  v-loading = "load6">
          <div slot="header" class="clearfix">
            <span style="font-size: 18px">发明专利（近五年）（最多填写 2 个）</span>
            <el-button
              class="addButton"
              style="float: right"
              type="primary"
              plain
              @click="addFunc(6)"
            >添加发明专利</el-button>
          </div>

          <el-table
            :data="formThird.inventionPatents"
            border
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="50px" />
            <el-table-column prop="patentName" label="专利名称" />
            <el-table-column prop="patentAuthorName" label="第一作者" />
            <el-table-column prop="patentGrantTime" label="专利授权日期" />
            <el-table-column prop="patentGrantNumber" label="专利授权号" />
            <el-table-column prop="patentType" label="专利类型" />
            <el-table-column label="证明资料" width="90" align="center">
              <template slot-scope="scope">
                <a target="_blank" :href="scope.row.patentProveMaterials">
                  <el-button size="mini" type="primary" plain>查 看</el-button>
                </a>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  plain
                  type="info"
                  @click="editFunc(scope.$index, scope.row, 6)"
                >编 辑</el-button>
                <el-button
                  size="mini"
                  plain
                  type="danger"
                  @click="deleteFunc(scope.$index, scope.row, 6)"
                >删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <el-row type="flex" justify="center">
            <el-col :span="4"><el-button @click="saveLearning(6)" type="primary">保存发明专利</el-button></el-col>
          </el-row>

        </el-card>
        <br>
        <!-- 科研汇总 -->
        <el-card class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span style="font-size: 18px">科研成果汇总</span>
            <el-button
              style="float: right"
              type="primary"
              plain
              @click="getSummary"
            >汇总生成
            </el-button>
          </div>
          <div>
            <p>
              1.以第一作者或通讯作者在核心及以上期刊发表与本学科相关的学术论文共
              <span class="summary"> {{ formThird.summary.firstAuthorPaper }} </span>篇，
              其中权威<span class="summary"> {{ formThird.summary.authorityAmount }} </span>篇，
              EI<span class="summary"> {{ formThird.summary.eiAmount }} </span>篇，
              CSCD<span class="summary"> {{ formThird.summary.cscdAmount }} </span>篇，
              A&HCI<span class="summary"> {{ formThird.summary.ahciAmount }} </span>篇，
              CSSCI<span class="summary"> {{ formThird.summary.cssciAmount }} </span>篇，
              CPCI<span class="summary"> {{ formThird.summary.cpciAmount }} </span>篇。
            </p>
            <br>
            <p>
              2.主持在研科研项目共<span class="summary"> {{ formThird.summary.directProject }} </span>项，
              其中国家级<span class="summary"> {{ formThird.summary.projectNationalLevel }} </span>项，
              省部级<span class="summary"> {{ formThird.summary.projectProvinceLevel }} </span>项；
              在研项目中累计到款科研经费<span class="summary"> {{ formThird.summary.accumulatedFunds }} </span>万元，
              其中横向项目到款经费<span class="summary"> {{ formThird.summary.horizontalProject }} </span>万元。
            </p>
            <br>
            <p>
              3.出版本专业领域内研究生教材或学术著作（译著）
              <span class="summary"> {{ formThird.summary.publishWorks }} </span>部，
              每部本人完成<span class="summary"> {{ formThird.summary.publishWorksWords }} </span>万字。
            </p>
            <br>
            <p>
              4.科研教学获奖共
              <span class="summary"> {{ formThird.summary.scientificAwards }} </span>项，
              其中国家级<span class="summary"> {{ formThird.summary.awardsNationalLevel }} </span>项，
              省部级<span class="summary"> {{ formThird.summary.awardsProvinceLevel }} </span>项。
            </p>
            <br>
            <p>
              5.以第一发明人授权职务发明专利<span class="summary"> {{ formThird.summary.inventionPatentAmount }} </span>项，
              实用新型专利<span class="summary"> {{ formThird.summary.newUtilityPatent }} </span>项。
            </p>
            <br>
          </div>
        </el-card>
        <el-row>
          <el-col :offset="9">
            <el-form-item style="margin-top: 20px">
              <el-button
                type="primary"
                @click="onSubmitThirdPage"
              >保存此部分，填写下一项
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 添加社科类论文 -->
    <el-dialog
      :title="isEdit ? '修改社科类论文' : '添加社科类论文'"
      width="40%"
      :visible.sync="dialogThird1"
      :show-close="false"
      @closed="cancelFunc(1)"
    >
      <el-form :model="academicPaper">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="论文名称">
              <el-input v-model="academicPaper.paperName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="第一作者">
              <el-input v-model="academicPaper.firstAuthorName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期刊名称">
              <el-input v-model="academicPaper.journalName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发表时间">
              <el-date-picker
                v-model="academicPaper.paperPublicationTime"
                style="width: 100%"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期刊等级">
              <el-select
                v-model="academicPaper.journalLevel"
                style="width: 100%"
                placeholder="请选择"
              >
                <el-option label="SSCI" value="SSCI" />
                <el-option label="CSSCI" value="CSSCI" />
                <el-option label="A&HCI" value="A&HCI" />
                <el-option label="CPCI" value="CPCI" />
                <el-option label="顶级期刊（A类）" value="顶级期刊(A类)" />
                <el-option label="权威期刊（B类）" value="权威期刊(B类)" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="证明材料">
              <el-upload
                ref="upload"
                class="upload-demo"
                name="material"
                :action="getUrl(1)"
                :on-success="uploadSuccessFunc"
                :on-error="uploadErrorFunc"
                :before-upload="checkFileType"
                :on-remove="removeFile"
                :file-list="fileList"
                :on-exceed="oversizeFile"
                :limit="1"
                accept=".zip, .rar"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  证明材料包括论文封面、目录和正文。若上传多个文件，请上传
                  zip/rar文件，且不超过 50MB
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!isEdit" @click="cancelFunc(1)">取 消</el-button>
        <el-button type="primary" @click="addFile(1)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加理工类论文 -->
    <el-dialog
      :title="isEdit ? '修改理工类论文' : '添加理工类论文'"
      width="40%"
      :visible.sync="dialogThird2"
      :show-close="false"
      @closed="cancelFunc(2)"
    >
      <el-form :model="academicPaper">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="论文名称">
              <el-input v-model="academicPaper.paperName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发表时间">
              <el-date-picker
                v-model="academicPaper.paperPublicationTime"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="第一作者">
              <el-input v-model="academicPaper.firstAuthorName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通讯作者">
              <el-input v-model="academicPaper.communicationAuthorName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="期刊类别">
              <el-select
                v-model="academicPaper.journalCategory"
                style="width: 100%"
                placeholder="请选择"
              >
                <el-option label="SCIE" value="SCIE" />
                <el-option label="EI" value="EI" />
                <el-option label="CSCD" value="CSCD" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="academicPaper.journalCategory === 'SCIE'"
              label="分区"
            >
              <el-select
                v-model="academicPaper.sciPart"
                style="width: 100%"
                placeholder="请选择"
              >
                <el-option label="一区" value="一区" />
                <el-option label="二区" value="二区" />
                <el-option label="三区" value="三区" />
                <el-option label="四区" value="四区" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="期刊名称">
              <el-input v-model="academicPaper.journalName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="影响因子">
              <el-input v-model="academicPaper.impactFactors" type="number" :percesion="2" :step="0.01" placeholder="0.00" :min="0.00" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="证明材料">
              <el-upload
                ref="upload"
                class="upload-demo"
                name="material"
                :action="getUrl(2)"
                :on-success="uploadSuccessFunc"
                :on-error="uploadErrorFunc"
                :before-upload="checkFileType"
                :on-remove="removeFile"
                :on-exceed="oversizeFile"
                :file-list="fileList"
                :limit="1"
                accept=".zip, .rar"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  证明材料包括论文封面、目录和正文。若上传多个文件，请上传
                  zip/rar文件，且不超过 50MB
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!isEdit" @click="cancelFunc(2)">取 消</el-button>
        <el-button type="primary" @click="addFile(2)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加科研项目 -->
    <el-dialog
      :title="isEdit ? '修改科研项目' : '添加科研项目'"
      width="40%"
      :show-close="false"
      :visible.sync="dialogThird3"
      @closed="cancelFunc(3)"
    >
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
              <el-input v-model="researchProject.projectTotalPrice" type="number" :percesion="2" :step="1" placeholder="0.00" :min="0.00" />
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
                <el-option label="横向项目" value="横向项目" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="证明材料">
              <el-upload
                ref="upload"
                class="upload-demo"
                name="material"
                :action="getUrl(3)"
                :on-success="uploadSuccessFunc"
                :on-error="uploadErrorFunc"
                :before-upload="checkFileType"
                :on-remove="removeFile"
                :file-list="fileList"
                :on-exceed="oversizeFile"
                :limit="1"
                accept=".zip, .rar"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  证明材料包括项目立项书。若上传多个文件，请上传
                  zip/rar文件，且不超过 50MB
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!isEdit" @click="cancelFunc(3)">取 消</el-button>
        <el-button type="primary" @click="addFile(3)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加教材或学术著作 -->
    <el-dialog
      :title="isEdit ? '修改教材或学术著作' : '添加教材或学术著作'"
      width="40%"
      :show-close="false"
      :visible.sync="dialogThird4"
      @closed="cancelFunc(4)"
    >
      <el-form :model="academicWork">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="著作名称">
              <el-input v-model="academicWork.worksName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="著作编号">
              <el-input v-model="academicWork.worksNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版日期">
              <el-date-picker
                v-model="academicWork.worksPublicationTime"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版单位">
              <el-input v-model="academicWork.worksPublicationUnit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成字数（万字）">
              <el-input v-model="academicWork.totalWords" type="number" :percesion="2" :step="0.1" placeholder="0.00" :min="0.00" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者姓名">
              <el-input v-model="academicWork.authorName" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="证明材料">
              <el-upload
                ref="upload"
                class="upload-demo"
                name="material"
                :action="getUrl(4)"
                :on-success="uploadSuccessFunc"
                :on-error="uploadErrorFunc"
                :before-upload="checkFileType"
                :on-remove="removeFile"
                :file-list="fileList"
                :on-exceed="oversizeFile"
                :limit="1"
                accept=".zip, .rar"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  证明材料包括著作封面、前言、目录和版权页。若上传多个文件，请上传
                  zip/rar文件，且不超过 50MB
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!isEdit" @click="cancelFunc(4)">取 消</el-button>
        <el-button type="primary" @click="addFile(4)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加科研教学奖励 -->
    <el-dialog
      :title="isEdit ? '修改科研教学奖励' : '添加科研教学奖励'"
      width="40%"
      :show-close="false"
      :visible.sync="dialogThird5"
      @closed="cancelFunc(5)"
    >
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
          <el-col :span="24">
            <el-form-item label="证明材料">
              <el-upload
                ref="upload"
                class="upload-demo"
                name="material"
                :action="getUrl(5)"
                :on-success="uploadSuccessFunc"
                :on-error="uploadErrorFunc"
                :on-remove="removeFile"
                :before-upload="checkFileType"
                :file-list="fileList"
                :on-exceed="oversizeFile"
                :limit="1"
                accept=".zip, .rar"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  证明材料包括获奖证书扫描件。若上传多个文件，请上传
                  zip/rar文件，且不超过 50MB
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!isEdit" @click="cancelFunc(5)">取 消</el-button>
        <el-button type="primary" @click="addFile(5)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加发明专利 -->
    <el-dialog
      :title="isEdit ? '修改发明专利' : '添加发明专利'"
      width="40%"
      :show-close="false"
      :visible.sync="dialogThird6"
      @closed="cancelFunc(6)"
    >
      <el-form :model="inventionPatent">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="专利名称">
              <el-input v-model="inventionPatent.patentName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="第一作者">
              <el-input v-model="inventionPatent.patentAuthorName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专利授权日期">
              <el-date-picker
                v-model="inventionPatent.patentGrantTime"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专利授权号">
              <el-input v-model="inventionPatent.patentGrantNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专利类型">
              <el-select
                v-model="inventionPatent.patentType"
                style="width: 100%"
                placeholder="请选择"
              >
                <el-option label="实用新型专利" value="实用新型专利" />
                <el-option label="发明专利" value="发明专利" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="证明材料">
              <el-upload
                ref="upload"
                class="upload-demo"
                name="material"
                :action="getUrl(6)"
                :on-success="uploadSuccessFunc"
                :on-error="uploadErrorFunc"
                :before-upload="checkFileType"
                :on-remove="removeFile"
                :on-exceed="oversizeFile"
                :file-list="fileList"
                :limit="1"
                accept=".zip, .rar"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  请上传相关证明材料。若上传多个文件，请上传
                  zip/rar文件，且不超过 50MB
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!isEdit" @click="cancelFunc(6)">取 消</el-button>
        <el-button type="primary" @click="addFile(6)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { submitThirdPage, deleteFile, saveThirdLearning } from '@/api/tutor/inspect'
import { baseUrl } from '@/api/url'
export default {
  name: 'Index',
  props: {
    applyId: Number,
    formThird: Object,
    loading: Boolean,
    applyCondition: Number
  },
  data() {
    return {
      load1: false,
      load3: false,
      load4: false,
      load5: false,
      load6: false,


      //添加,编辑，删除 false不能提交
      addFlag: true,
      editFlag: true,
      delFlag: true,

      flag1: true,
      flag3: true,
      flag4: true,
      flag5: true,
      flag6: true,

      // 文件列表
      fileList: [],

      // 申请状态
      applyType: this.$route.params.applyType * 1,

      isEdit: false, // 是否为编辑选项
      editIndex: -1, // 编辑项目的索引

      isSummary: false, // 是否已经点击汇总按钮

      dialogThird1: false, // 社科学术论文添加按钮
      dialogThird2: false, // 理工学术论文添加按钮
      dialogThird3: false, // 科研项目添加按钮
      dialogThird4: false, // 教材或学术著作添加按钮
      dialogThird5: false, // 科研教学奖励添加按钮
      dialogThird6: false, // 发明专利添加按钮

      academicPaper: {
        // 学术论文
        paperId: '', // 论文 id
        paperName: '', // 论文名称
        paperPublicationTime: '', // 发表时间
        journalName: '', // 期刊名称
        journalLevel: '', // 期刊等级
        journalCategory: '', // 期刊类别
        sciPart: '', // sci 分区
        impactFactors: '', // 影响因子
        firstAuthorName: '', // 第一作者
        communicationAuthorName: '', // 通讯作者
        paperSubject: '', // 论文分科，文，理，交叉学科按文科算
        paperProveMaterials: '', // 论文证明材料
      },

      // 科研项目
      researchProject: {
        projectId: '', // 项目 id
        projectName: '', // 项目名称
        projectNumber: '', // 项目编号
        approvalNumber: '', // 批准号
        projectChargeName: '', // 负责人姓名
        projectStartTime: '', // 开始日期
        projectEndTime: '', // 结束日期
        projectCategory: '', // 项目分类
        projectTotalPrice: '', // 总经费
        projectLevel: '', // 项目级别，国家级，省部级，厅局级
        projectProveMaterials: '', // 证明材料，图片，pdf等
      },

      // 教材或学术著作
      academicWork: {
        worksId: '', // 著作 id
        worksName: '', // 著作名称
        worksNumber: '', // 著作编号
        worksPublicationTime: '', // 出版日期
        worksPublicationUnit: '', // 出版单位
        totalWords: '', // 完成字数
        authorName: '', // 作者姓名
        worksProveMaterials: '', // 证明材料，图片，pdf等
      },

      // 科研教学奖励
      teachingAward: {
        awardsId: '', // 奖励 id
        awardsName: '', // 奖励名称
        awardsRank: '', // 排名
        awardsUnit: '', // 颁奖单位
        awardsLevel: '', // 获奖级别
        awardsTime: '', // 获奖日期
        awardsAuthorName: '', // 获奖人姓名
        awardsProveMaterials: '', // 证明材料，图片，pdf等
      },

      // 发明专利
      inventionPatent: {
        patentId: '', // 专利 id
        patentName: '', // 专利名称
        patentAuthorName: '', // 第一作者
        patentGrantTime: '', // 专利授权日期
        patentGrantNumber: '', // 专利授权号
        patentType: '', // 专利类型
        patentProveMaterials: '', // 证明材料，图片，pdf等
      }
    }
  },
  methods: {
    getUrl(type) {
      return `${baseUrl}/user/upload/${type}`
    },
    /* =========================  第 3 页  ================================= */
    //保存每一项
    saveLearning: function(learningType){
      this.$confirm('保存此项?')
        .then(() => {
          // this.$emit('load', true)
          // this.load = true
          switch(learningType){
            case 1:
            case 2:
             this.flag1 = true
             this.load1 = true
              break
            case 3:
             this.flag3 = true
             this.load3 = true
             break
            case 4:
             this.flag4 = true
             this.load4 = true
             break
            case 5:
             this.flag5 = true
             this.load5 = true
             break
            case 6:
             this.flag6 = true
             this.load6 = true
             break
          }
          saveThirdLearning(
            this.formThird,
            this.applyId,
            this.applyCondition,
            learningType
          ).then((res) => {
            if (res.data.code === 1201) {
              this.$message.error(res.data.message)
              return
            }
            else if(res.data.code ===1200 ){
              this.$message.success('保存成功!')
            }
            // this.load = false
            switch(learningType){
            case 1:
            case 2:
             this.formThird.academicPapers = res.data.data.academicPapers
             this.load1 = false
            break
            case 3:
              this.formThird.researchProjects = res.data.data.researchProjects
             this.load3 = false
             break
            case 4:
              this.formThird.academicWorks = res.data.data.academicWorks
             this.load4 = false
             break
            case 5:
              this.formThird.teachingAwards = res.data.data.teachingAwards
             this.load5 = false
             break
            case 6:
              this.formThird.inventionPatents = res.data.data.inventionPatents
             this.load6 = false
             break
          }
          })
        })
        .catch(() => {
          console.log('cancel')
        })

    },

    // 完成第 3 页学术信息的填写
    onSubmitThirdPage: function() {
      if(!this.flag1){
        this.$message.info("请保存学术论文后再提交！")
        return
      }
      else if(!this.flag3){
        this.$message.info("请保存科研项目后再提交！")
        return
      }
      else if(!this.flag4){
        this.$message.info("请保存教材或学术著作后再提交！")
        return
      }
      else if(!this.flag5){
        this.$message.info("请保存科研教学奖励后再提交！")
        return
      }
      else if(!this.flag6){
        this.$message.info("请保存发明专利后再提交！")
        return
      }
      else if (!this.isSummary) {
        this.$message.info('请生成汇总信息后再提交')
        return
      }
      this.$confirm('提交填写?')
        // 提交保存第 3 页
        .then(() => {
          this.$emit('load', true)
          submitThirdPage(
            this.formThird.summary,
            this.applyId,
            this.applyCondition,
          ).then((res) => {
            this.$message.success('保存成功!')
            this.$emit('func', res.data)
          })
        })
        .catch(() => {
          console.log('cancel')
        })
    },

    /**
     * 各项内容的添加函数
     * @param type 添加的类型
     *        1, 社科论文
     *        2, 理工论文
     *        3, 科研项目
     *        4, 教材或学术著作
     *        5, 科研或教学奖励
     *        6, 发明专利
     * */
    addFunc: function(type) {
      // 添加或修改就将汇总信息变为 false
      this.isSummary = false
      this.addFlag = false  //添加按钮不能提交
      switch (type) {
        case 1:
          this.flag1 = false
          this.dialogThird1 = true
          break
        case 2:
          this.flag1 = false
          this.dialogThird2 = true
          break
        case 3:
          this.flag3 = false
          this.dialogThird3 = true
          break
        case 4:
          this.flag4 = false
          this.dialogThird4 = true
          break
        case 5:
          this.flag5 = false
          this.dialogThird5 = true
          break
        case 6:
          this.flag6 = false
          this.dialogThird6 = true
          break
      }
    },

    /**
     * 各项内容的删除函数
     * @param index 删除的索引
     * @param scope
     * @param type 删除的类型
     *        1, 论文
     *        2, 科研项目
     *        3, 教材或学术著作
     *        4, 科研或教学奖励
     *        5, 发明专利
     * */
    deleteFunc: function(index, scope, type) {
      // 删除信息就将汇总信息变为 false，需再次生成
      this.isSummary = false
      const deleteItem = {
        deleteId: '', // 删除的项 id
        deletePath: '', // 删除的路径
        deleteType: '' // 删除的项类型，论文，项目等
      }
      switch (type) {
        case 1:
          this.flag1 = false
          deleteItem.deleteId = this.applyCondition === '102' ? -1 : scope.paperId
          deleteItem.deleteType = 1
          // 删除文件
          this.delFile(scope.paperProveMaterials)
          // 删除记录
          this.formThird.academicPapers.splice(index, 1)
          break
        case 3:
          this.flag3 = false
          deleteItem.deleteId = this.applyCondition === '102' ? -1 : scope.projectId
          deleteItem.deleteType = 3
          // 删除文件
          this.delFile(scope.projectProveMaterials)
          // 删除记录
          this.formThird.researchProjects.splice(index, 1)
          break
        case 4:
          this.flag4 = false
          deleteItem.deleteId =
            this.applyCondition === '102' ? -1 : scope.worksId
          deleteItem.deleteType = 4
          // 删除文件
          this.delFile(scope.worksProveMaterials)
          // 删除记录
          this.formThird.academicWorks.splice(index, 1)
          break
        case 5:
          this.flag5 = false
          deleteItem.deleteId =
            this.applyCondition === '102' ? -1 : scope.awardsId
          deleteItem.deleteType = 5
          // 删除文件
          this.delFile(scope.awardsProveMaterials)
          // 删除记录
          this.formThird.teachingAwards.splice(index, 1)
          break

        case 6:
          this.flag6 = false
          deleteItem.deleteId = this.applyCondition === '102' ? -1 : scope.patentId
          deleteItem.deleteType = 6
          // 删除文件
          this.delFile(scope.patentProveMaterials)
          // 删除记录
          this.formThird.inventionPatents.splice(index, 1)
          break
      }
      this.formThird.deleteItems.push(deleteItem)
    },

    editFunc: function(index, scope, type) {
      let obj
      // 添加或修改就将汇总信息变为 false
      this.isSummary = false
      // 标记修改
      this.isEdit = true
      // 记录索引
      this.editIndex = index
      switch (type) {
        case 1:
          this.flag1 = false
          this.academicPaper = this.formThird.academicPapers[index]
          if (this.fileList.length === 0) { // 展示文件名
            obj = {}
            obj.url = this.formThird.academicPapers[index].paperProveMaterials // 获取路径
            obj.name = obj.url.substring(obj.url.lastIndexOf('/')+1,obj.length) // 获取文件名称
            this.fileList.push(obj)
          }
          if (scope.journalLevel !== '') {
            // 社科
            this.dialogThird1 = true
          } else {
            // 理工
            this.dialogThird2 = true
          }
          break
        case 3:
          this.flag3 = false
          this.researchProject = this.formThird.researchProjects[index]
          if (this.fileList.length === 0) {
            obj = {}
            obj.url = this.formThird.researchProjects[index].projectProveMaterials // 获取路径
            obj.name = obj.url.substring(obj.url.lastIndexOf('/')+1,obj.length) // 获取文件名称
            this.fileList.push(obj)
          }
          this.dialogThird3 = true
          break
        case 4:
          this.flag4 = false
          this.academicWork = this.formThird.academicWorks[index]
          if (this.fileList.length === 0) {
            obj = {}
            obj.url = this.formThird.academicWorks[index].worksProveMaterials // 获取路径
            obj.name = obj.url.substring(obj.url.lastIndexOf('/')+1,obj.length) // 获取文件名称
            this.fileList.push(obj)
          }
          this.dialogThird4 = true
          break
        case 5:
          this.flag5 = false
          this.teachingAward = this.formThird.teachingAwards[index]
          if (this.fileList.length === 0) {
            let obj = new Object()
            obj.url = this.formThird.teachingAwards[index].awardsProveMaterials // 获取路径
            obj.name = obj.url.substring(obj.url.lastIndexOf('/')+1,obj.length) // 获取文件名称
            this.fileList.push(obj)
          }
          this.dialogThird5 = true
          break
        case 6:
          this.flag6 = false
          this.inventionPatent = this.formThird.inventionPatents[index]
          if (this.fileList.length === 0) {
            obj = {}
            obj.url = this.formThird.inventionPatents[index].patentProveMaterials // 获取路径
            obj.name = obj.url.substring(obj.url.lastIndexOf('/')+1,obj.length) // 获取文件名称
            this.fileList.push(obj)
          }
          this.dialogThird6 = true
          break
      }
    },

    // 取消框
    cancelFunc: function(type) {
      // 学术团体
      switch (type) {
        case 1:
          this.academicPaper = {
            // 学术论文
            paperId: '', // 论文 id
            paperName: '', // 论文名称
            paperPublicationTime: '', // 发表时间
            journalName: '', // 期刊名称
            journalLevel: '', // 期刊等级
            journalCategory: '', // 期刊类别
            sciPart: '', // sci 分区
            impactFactors: '', // 影响因子
            firstAuthorName: '', // 第一作者
            communicationAuthorName: '', // 通讯作者
            paperSubject: '', // 论文分科，文，理，交叉学科按文科算
            paperProveMaterials: '', // 论文证明材料
          }
          this.dialogThird1 = false
          break
        case 2:
          this.academicPaper = {
            // 学术论文
            paperId: '', // 论文 id
            paperName: '', // 论文名称
            paperPublicationTime: '', // 发表时间
            journalName: '', // 期刊名称
            journalLevel: '', // 期刊等级
            journalCategory: '', // 期刊类别
            sciPart: '', // sci 分区
            impactFactors: '', // 影响因子
            firstAuthorName: '', // 第一作者
            communicationAuthorName: '', // 通讯作者
            paperSubject: '', // 论文分科，文，理，交叉学科按文科算
            paperProveMaterials: '', // 论文证明材料
          }
          this.dialogThird2 = false
          break
        case 3:
          this.researchProject = {
            projectId: '', // 项目 id
            projectName: '', // 项目名称
            projectNumber: '', // 项目编号
            approvalNumber: '', // 批准号
            projectChargeName: '', // 负责人姓名
            projectStartTime: '', // 开始日期
            projectEndTime: '', // 结束日期
            projectCategory: '', // 项目分类
            projectTotalPrice: '', // 总经费
            projectLevel: '', // 项目级别，国家级，省部级，厅局级
            projectProveMaterials: '', // 证明材料，图片，pdf等
          }
          this.dialogThird3 = false
          break
        case 4:
          this.academicWork = {
            worksId: '', // 著作 id
            worksName: '', // 著作名称
            worksNumber: '', // 著作编号
            worksPublicationTime: '', // 出版日期
            worksPublicationUnit: '', // 出版单位
            totalWords: '', // 完成字数
            authorName: '', // 作者姓名
            worksProveMaterials: '', // 证明材料，图片，pdf等
          }
          this.dialogThird4 = false
          break

        case 5:
          this.teachingAward = {
            awardsId: '', // 奖励 id
            awardsName: '', // 奖励名称
            awardsRank: '', // 排名
            awardsUnit: '', // 颁奖单位
            awardsLevel: '', // 获奖级别
            awardsTime: '', // 获奖日期
            awardsAuthorName: '', // 获奖人姓名
            awardsProveMaterials: '', // 证明材料，图片，pdf等
          }
          this.dialogThird5 = false
          break
        case 6:
          this.inventionPatent = {
            patentId: '', // 专利 id
            patentName: '', // 专利名称
            patentAuthorName: '', // 第一作者
            patentGrantTime: '', // 专利授权日期
            patentGrantNumber: '', // 专利授权号
            patentType: '', // 专利类型
            patentProveMaterials: '', // 证明材料，图片，pdf等
          }
          this.dialogThird6 = false
      }
      this.fileList = []
      this.isEdit = false
      this.editIndex = -1
    },

    // 删除文件 参数 文件的路径
    delFile(filePath) {
      const path = encodeURI(filePath)
      deleteFile(path)
        .then((res) => {
          if (res.data.code === 1201) {
            this.$message.error('删除失败！')
          } else {
            this.$message.success('删除成功！')
          }
        })
        .catch(() => {
          console.log('cancel')
        })
    },

    // 汇总生成
    getSummary: function() {
      if(!this.flag1){
        this.$message.info("请保存学术论文后再进行汇总生成！")
        return
      }
      else if(!this.flag3){
        this.$message.info("请保存科研项目后再进行汇总生成！")
        return
      }
      else if(!this.flag4){
        this.$message.info("请保存教材或学术著作后再进行汇总生成！")
        return
      }
      else if(!this.flag5){
        this.$message.info("请保存科研教学奖励后再进行汇总生成！")
        return
      }
      else if(!this.flag6){
        this.$message.info("请保存发明专利后再进行汇总生成！")
        return
      }
      this.isSummary = true
      // 论文部分
      this.formThird.summary.firstAuthorPaper = this.formThird.academicPapers.length
      this.formThird.summary.authorityAmount =
        this.formThird.academicPapers.filter(
          (item) =>
            item.journalLevel === '顶级期刊(A类)' ||
            item.journalLevel === '权威期刊(B类)' ||
            item.journalLevel === 'SSCI' ||
            item.journalCategory === 'SCIE'
        ).length
      this.formThird.summary.eiAmount = this.formThird.academicPapers.filter(
        (item) => item.journalCategory === 'EI'
      ).length
      // this.formThird.summary.ssciAmount = this.formThird.academicPapers.filter(
      //   (item) => item.journalLevel === 'SSCI'
      // ).length
      this.formThird.summary.ahciAmount = this.formThird.academicPapers.filter(
        (item) => item.journalLevel === 'A&HCI'
      ).length
      this.formThird.summary.cssciAmount = this.formThird.academicPapers.filter(
        (item) => item.journalLevel === 'CSSCI'
      ).length
      this.formThird.summary.cscdAmount = this.formThird.academicPapers.filter(
        (item) => item.journalCategory === 'CSCD'
      ).length
      this.formThird.summary.cpciAmount = this.formThird.academicPapers.filter(
        (item) => item.journalLevel === 'CPCI'
      ).length

      // 科研项目部分
      this.formThird.summary.directProject =
        this.formThird.researchProjects.length
      this.formThird.summary.projectNationalLevel =
        this.formThird.researchProjects.filter(
          (item) => item.projectLevel === '国家级'
        ).length
      this.formThird.summary.projectProvinceLevel =
        this.formThird.researchProjects.filter(
          (item) => item.projectLevel === '省部级'
        ).length
      this.formThird.summary.accumulatedFunds =
        this.formThird.researchProjects.reduce(
          (total, item) => total + item.projectTotalPrice * 1,
          0
        )
      this.formThird.summary.horizontalProject = this.formThird.researchProjects
        .filter((item) => item.projectLevel === '横向项目')
        .reduce((total, item) => total + item.projectTotalPrice * 1, 0)

      // 著作
      this.formThird.summary.publishWorks = this.formThird.academicWorks.length
      this.formThird.summary.publishWorksWords =
        this.formThird.academicWorks.reduce(
          (total, item) => total + item.totalWords * 1,
          0
        )

      // 获奖
      this.formThird.summary.scientificAwards =
        this.formThird.teachingAwards.length
      this.formThird.summary.awardsNationalLevel =
        this.formThird.teachingAwards.filter(
          (item) => item.awardsLevel === '国家级'
        ).length
      this.formThird.summary.awardsProvinceLevel =
        this.formThird.teachingAwards.filter(
          (item) => item.awardsLevel === '省部级'
        ).length

      // 专利
      this.formThird.summary.inventionPatentAmount =
        this.formThird.inventionPatents.length
      this.formThird.summary.newUtilityPatent =
        this.formThird.inventionPatents.filter(
          (item) => item.patentType === '实用新型专利'
        ).length
    },

    /* ======= 上传文件 ======= */

    // 检查上传的文件类型
    checkFileType: function(file) {
      if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) {
        return true
      } else {
        this.$message.error('请上传 zip/rar 文件')
        return false
      }
    },
    // 文件超出限制
    oversizeFile: function() {
      this.$message.warning('上传文件超出限制!')
      return
    },
    // 各项内容的提交文件上传 确定按钮
    addFile: function(type) {
      switch (type) {
        case 1: // 社科
          if (this.fileList.length === 1) {
            if (this.isEdit) {
              // 编辑
              this.formThird.academicPapers[this.editIndex] = this.academicPaper
              this.editIndex = -1
              this.isEdit = false
            } else {
              this.formThird.academicPapers.push(this.academicPaper) // 加入列表
            }
            this.dialogThird1 = false
          } else {
            this.$message.info('请先上传文件')
            return
          }
          // 置空论文
          this.academicPaper = {
            paperName: '',
            paperPublicationTime: '',
            journalName: '',
            journalLevel: '',
            journalCategory: '',
            sciPart: '',
            impactFactors: '',
            firstAuthorName: '',
            communicationAuthorName: '',
            paperSubject: '',
            paperProveMaterials: '',
          }
          break
        case 2: // 理工
          if (this.fileList.length === 1) {
            if (this.isEdit) {
            // 编辑
              this.formThird.academicPapers[this.editIndex] = this.academicPaper
              this.editIndex = -1
              this.isEdit = false
            } else {
            // 添加
              this.formThird.academicPapers.push(this.academicPaper) // 加入列表
            }
            this.dialogThird2 = false
          } else {
            this.$message.info('请先上传文件')
            return
          }
          // 置空论文
          this.academicPaper = {
            paperName: '',
            paperPublicationTime: '',
            journalName: '',
            journalLevel: '',
            journalCategory: '',
            sciPart: '',
            impactFactors: '',
            firstAuthorName: '',
            communicationAuthorName: '',
            paperSubject: '',
            paperProveMaterials: '',
          }

          break
        case 3:
          if (this.fileList.length === 1) {
            if (this.isEdit) {
              this.formThird.researchProjects[this.editIndex] = this.researchProject // 修改
              this.isEdit = false
              this.editIndex = -1
            } else {
              this.formThird.researchProjects.push(this.researchProject) // 加入列表
            }
            this.dialogThird3 = false
          } else {
            this.$message.info('请先上传文件')
            return
          }

          // 置空科研项目
          this.researchProject = {
            projectId: '',
            projectName: '',
            projectNumber: '',
            approvalNumber: '',
            projectChargeName: '',
            projectStartTime: '',
            projectEndTime: '',
            projectCategory: '',
            projectTotalPrice: '',
            projectLevel: '',
            projectProveMaterials: '',
          }

          break
        case 4:
          // console.log("url4",this.fileList[0].url)
          if (this.fileList.length === 1) {
            if (this.isEdit) {
              this.formThird.academicWorks[this.editIndex] = this.academicWork // 修改
              this.isEdit = false
              this.editIndex = -1
            } else {
              this.formThird.academicWorks.push(this.academicWork) // 加入列表
            }
            this.dialogThird4 = false
          } else {
            this.$message.info('请先上传文件')
            return
          }

          this.academicWork = {
            worksId: '',
            worksName: '',
            worksNumber: '',
            worksPublicationTime: '',
            worksPublicationUnit: '',
            totalWords: '',
            authorName: '',
            worksProveMaterials: '',
          }

          break
        case 5:
          if (this.fileList.length === 1) {
            if (this.isEdit) {
              this.formThird.teachingAwards[this.editIndex] = this.teachingAward // 修改
              this.isEdit = false
              this.editIndex = -1
            } else {
              this.formThird.teachingAwards.push(this.teachingAward) // 加入列表
            }
            this.dialogThird5 = false
          } else {
            this.$message.info('请先上传文件')
            return
          }

          // 置空科研或教学奖励
          this.teachingAward = {
            awardsId: '',
            awardsName: '',
            awardsRank: '',
            awardsUnit: '',
            awardsLevel: '',
            awardsTime: '',
            awardsAuthorName: '',
            awardsProveMaterials: '',
          }

          break
        case 6:
          if (this.fileList.length === 1) {
            if (this.isEdit) {
              this.formThird.inventionPatents[this.editIndex] = this.inventionPatent // 修改
              this.isEdit = false
              this.editIndex = -1
            } else {
              this.formThird.inventionPatents.push(this.inventionPatent) // 加入列表
            }
            this.dialogThird6 = false
          } else {
            this.$message.info('请先上传文件')
            return
          }
          //
          this.inventionPatent = {
            patentId: '',
            patentName: '',
            patentAuthorName: '',
            patentGrantTime: '',
            patentGrantNumber: '',
            patentType: '',
            patentProveMaterials: '',
          }
          break
      }
      this.fileList = []
    },

    // 上传成功
    uploadSuccessFunc: function(response, file, fileList) {
      // 记录到 用于删除
      var obj = new Object()
      obj.url = response.data.path
      obj.name = obj.url.substring(obj.url.lastIndexOf('/')+1,obj.url.length)
      this.fileList.push(obj)
      switch (response.data.fileType) {
        // 论文
        case 1:
        case 2:
          this.academicPaper.paperProveMaterials = response.data.path // 论文的存储地址
          break
        case 3:
          this.researchProject.projectProveMaterials = response.data.path // 科研项目的存储地址
          break
        case 4:
          this.academicWork.worksProveMaterials = response.data.path // 教材或学术著作的存储地址
          break
        case 5:
          this.teachingAward.awardsProveMaterials = response.data.path
          break
        case 6:
          this.inventionPatent.patentProveMaterials = response.data.path
          break
      }
    },
    // 移除文件
    removeFile(file, fileList) {
      if (this.fileList[0].url !== null) {
        this.delFile(this.fileList[0].url)
        this.fileList = []
      }
    },
    // 上传失败
    uploadErrorFunc: function(err, file, fileList) {
      this.$message.error("上传失败！")
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}

.summary {
  font-weight: bold;
  color: #f56c6c;
}
</style>
