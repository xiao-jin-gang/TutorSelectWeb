<!--
 * @Author: Rex Joush
 * @Date: 2021-08-13 22:14:18
 * @LastEditors: Rex Joush
 * @LastEditTime: 2021-09-14 19:25:56
-->
## 修改记录
* 2021.08.08 **Rex Joush**
    * 格式化代码快捷键 `Shift + Alt + F`

* 2021.08.08 **Rex Joush**
    * 新建项目，配置基础环境

* 2021.08.13 **Rex Joush**
    * 添加全局样式自定义文件，位置 `src/styles/styles.scss`
    * 添加样式框架 `View UI`
    * 拉取新版本时需要安装依赖 `npm i`

* 2021.08.17 **Rex Joush**
    * 添加全局数据文件，位置 `src/utils/data.js`
    * 包含各个院系和专业和代码信息

* 2021.08.24 **wsl**
    * 管理员页面初始化数据，添加了对应的备注字段，可以获取到相应的值，即 prop="commit"

* 2021.09.14 **Rex Joush**
  * 完成详情页面的展示
  * 使用实例
    ```javascript
    /**
    * 前往申请的详情页
    * @param that 当前页面的 this 对象，需要用到 vue router，所以需要传 this
    * @param applyId 申请的 id 值
    * @param applyTypeId 申请的类型 id 值
    * @param tutorId 教师工号
    */
    import { toDetails } from '@/utils/funcation'
    method: {
      click: function(applyId, applyTypeId, tutorId) {
        toDetails(this, applyId, applyTypeId, tutorId)
      }
    }
    ```
