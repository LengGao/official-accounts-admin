<template>
  <div>
    <el-form :model="ruleForm"
             ref="messageType"
             :rules='rules'
             label-width="100px">
      <el-form-item label="消息类型"
                    prop="messageType">
        <!--消息类型  -->
        <el-radio-group v-model="ruleForm.messageType">
          <el-radio label="TEMPLATE_MESSAGE">消息模版</el-radio>
        </el-radio-group>
        <!-- 消息类型 end -->

        <!-- 模版消息 -->
        <el-row class='border box-padding'
                v-show='ruleForm.messageType === "TEMPLATE_MESSAGE"'>

          <el-form-item prop="messageData.templateId"
                        style='margin-bottom: 20px;'
                        label="模版ID">
            <span>{{ruleForm.messageData.templateId}}</span>
            <el-button type="primary"
                       round
                       size='mini'
                       @click='$refs.tmpIdChoose.show()'>选择</el-button>
          </el-form-item>

          <!-- 模版消息model -->
          <tmp-id-choose ref='tmpIdChoose'
                         @selectMsgItem='selectMsgItem'
                         :ruleForm='ruleForm' />
          <!-- 模版消息model end -->

          <el-form-item prop="tmp_title"
                        label="标题">
            <el-col>
              {{msgItem.title || '尚未选择模版'}}
            </el-col>

          </el-form-item>

          <div v-for='(item,index) in msgDataKeyVal'
               :key='index'>
            <el-form-item v-if='item.key === "first"'
                          :prop="'messageData.data[0]'"
                          class='mb10'
                          label="详细内容">
              <!-- :rules="{required: true, message: '详细内容不能为空', trigger: 'change'}" -->
              <div class="row">
                <div class="editor el-input__inner"
                     :id='item.key'
                     contenteditable="true">
                </div>
              </div>
            </el-form-item>
            <el-row>
              <el-col style='margin-left: 100px;'
                      :span='12'>
                <el-form-item v-if='index > 0 '
                              prop="tmp_details"
                              class='mb10'
                              :label="item.value">
                  <div class="row">
                    <div class="editor el-input__inner"
                         :id='item.key'
                         contenteditable="true">
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

          </div>

          <el-form-item label="
                          插入字段">
            <el-button type="primary"
                       @click='insertField(item)'
                       plain
                       size="mini"
                       v-for="(item,index) in insertData"
                       :key='index'
                       round>{{item.label}}</el-button>
          </el-form-item>

          <!-- <el-button @click='sendMsgData'>发送</el-button> -->

          <!-- 跳转 -->
          <el-form-item label="跳转">
            <el-radio-group v-model="ruleForm.msgJump"
                            style="width: 80%;">

              <!-- <el-row type="flex"
                      class='mb20'
                      align='middle'
                      v-for='(item,index) in jump'
                      :key='index'>
                <el-col :span='1'>
                  <el-radio :label="item.label">&nbsp;</el-radio>
                </el-col>
                <el-col :span='23'>
                  <el-form-item :label="item.labelTitle"
                                label-width="120px"
                                :prop='item.prop'>
                    <el-input placeholder="请输入内容"
                              v-model='item.model'
                              :disabled='item.disabled'></el-input>
                  </el-form-item>
                </el-col>
              </el-row> -->

              <!-- {label:'url', labelTitle:'网页链接',prop:'messageData.url',disabled:this.!isMiniPgm,model:this.ruleForm.messageData.url},
              {label:'miniprogram',labelTitle:'小程序AppID',prop:'messageData.miniProgram.appId',disabled:this.isMiniPgm,model:this.ruleForm.messageData.miniProgram.appId},
              {label:null,labelTitle:'小程序页面地址',prop:'messageData.miniProgram.pagePath',disabled:this.isMiniPgm,model:this.ruleForm.messageData.miniProgram.pagePath}, -->

              <el-row type="flex"
                      class='mb20'
                      align='middle'>
                <el-col :span='1'>
                  <el-radio label="url">&nbsp;</el-radio>
                </el-col>
                <el-col :span='23'>
                  <el-form-item label="网页链接"
                                label-width="120px"
                                prop='messageData.url'>
                    <el-input placeholder="请输入内容"
                              v-model='ruleForm.messageData.url'
                              :disabled='!isMiniPgm'></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row type="flex"
                      align='middle'
                      class='mb20'>
                <el-col :span='1'>
                  <el-radio label='miniprogram'>&nbsp;</el-radio>
                </el-col>
                <el-col :span='23'>
                  <el-form-item label="小程序AppID"
                                label-width="120px"
                                prop='messageData.miniProgram.appId'>
                    <el-input placeholder="请输入内容"
                              :disabled='isMiniPgm'
                              v-model="ruleForm.messageData.miniProgram.appId"></el-input>
                  </el-form-item>

                </el-col>
              </el-row>

              <el-row type="flex"
                      align='middle'>
                <el-col :span='1'>
                </el-col>
                <el-col :span='23'>
                  <el-form-item label="小程序页面地址"
                                label-width="120px"
                                prop='messageData.miniProgram.pagePath'>
                    <el-input placeholder="请输入内容"
                              :disabled='isMiniPgm'
                              v-model="ruleForm.messageData.miniProgram.pagePath"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
          <!-- 跳转 end-->

        </el-row>
        <!-- 模版消息 end-->

      </el-form-item>
    </el-form>
  </div>
</template>
<script>

import TmpIdChoose from './TmpIdChoose.vue'
import { types } from '@/api'

export default {
  name: 'XrEditor',
  components: {
    TmpIdChoose
  },
  props: ['ruleForm'],
  data () {
    return {
      html: '',
      msgItem: {}, // 已选择模版数据
      insertData: [], // 插入字段
      msgDataKeyVal: [],
      rules: {
        'messageData.templateId': [{ required: true, message: '请选择模版ID', trigger: 'change' }],
        'messageData.data': [{ type: 'array', required: true, message: '请输入内容', trigger: 'change' }],
        'messageData.url': [{ required: true, message: '请输入网页链接', trigger: 'change' }],
        'messageData.miniProgram.appId': [{ required: false, message: '小程序AppId', trigger: 'change' }],
        'messageData.miniProgram.pagePath': [{ required: false, message: '请输入小程序页面地址', trigger: 'change' }]
      },
      isMiniPgm: true,
      jump: [
        { label: 'url', labelTitle: '网页链接', prop: 'messageData.url', disabled: !this.isMiniPgm, model: this.ruleForm.messageData.url },
        { label: 'miniprogram', labelTitle: '小程序AppID', prop: 'messageData.miniProgram.appId', disabled: this.isMiniPgm, model: this.ruleForm.messageData.miniProgram.appId },
        { label: null, labelTitle: '小程序页面地址', prop: 'messageData.miniProgram.pagePath', disabled: this.isMiniPgm, model: this.ruleForm.messageData.miniProgram.pagePath }
      ]
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    init () {
      this.getInsertData()
    },
    getRef () {
      return this.$refs.messageType
    },
    // 插入数据
    async getInsertData () {
      const res = await types({ types: 'INSERT_DATA' })
      this.insertData = res
    },
    // 选中模版返回模版数据
    selectMsgItem (v) {
      // 重置
      if (!v) {
        this.msgDataKeyVal = []
        this.msgItem = {}
        return
      }
      this.msgDataKeyVal = []
      // 切割空格成数组
      const arr = v.content.split(/[\n]+/)
      // 转换成key value 格式
      const keyValArr = arr.map(item => {
        return {
          key: item.match(/{{(.*?).DATA}}/) ? item.match(/{{(.*?).DATA}}/)[1] : '',
          value: item.match(/([\s\S]+)(：)/) ? item.match(/([\s\S]+)(：)/)[1] : ''
        }
      })
      this.msgItem = v
      this.msgDataKeyVal = []
      this.$nextTick(() => {
        // this.msgDataKeyVal = keyValArr
        this.initRichText(keyValArr)
      })
    },
    // 插入字段
    insertField (v) {
      this.insertHtmlAtCaret(v)
    },
    getTmpId (clientId) { },
    sendMsgData () {
      const msgData = []
      this.msgDataKeyVal.forEach(item => {
        let str = document.getElementById(item.key).innerHTML
        const reg = new RegExp(/<input.*?data="(.*?)".*?>/g)
        str = str.replace(reg, '$1')
        msgData.push({ name: item.key, value: str })
      })
      return msgData
    },
    initRichText (keyValArr) {
      this.msgDataKeyVal = keyValArr
      this.$nextTick(() => {
        // 监听点击光标位置
        const els = document.getElementsByClassName('editor')
        Array.prototype.forEach.call(els, item => {
          item.onclick = () => {
            // 获取选定对象
            this.selection = getSelection()
          }
        })
      })
    },
    insertHtmlAtCaret (v) {
      const html = `<input class="tag" data="${v.value}" value='${v.label}' disabled/>`
      let sel, range
      // IE9 and non-IE
      sel = this.selection
      if (sel.getRangeAt && sel.rangeCount && (sel.anchorNode.parentNode.className === 'editor el-input__inner' || sel.anchorNode.className === 'editor el-input__inner')) {
        range = sel.getRangeAt(0)
        range.deleteContents()
        // Range.createContextualFragment() would be useful here but is
        // non-standard and not supported in all browsers (IE9, for one)
        const el = document.createElement('div')
        el.innerHTML = html
        const frag = document.createDocumentFragment(); var node; var lastNode
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node)
        }
        range.insertNode(frag)
        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange()
          range.setStartAfter(lastNode)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }
    }
  },
  watch: {
    // 校验跳转 网页链接/小程序
    'ruleForm.msgJump': {
      handler (newVal, oldVal) {
        // this.$refs.messageType.resetFields()
        const rulesRequiredStatus = newVal === 'url'
        this.rules['messageData.url'][0].required = rulesRequiredStatus
        this.rules['messageData.miniProgram.appId'][0].required = !rulesRequiredStatus
        this.rules['messageData.miniProgram.pagePath'][0].required = !rulesRequiredStatus
        this.isMiniPgm = rulesRequiredStatus
        const { messageData } = this.ruleForm
        messageData.url = ''
        messageData.miniProgram = {
          appId: '',
          pagePath: ''
        } // 消息数据,
      },
      deep: true
    },
    // 切换公号，清除模版列表
    'ruleForm.messageData.templateId' (newVal, oldVal) {
      if (!newVal) {
        this.selectMsgItem()
      }
    }
  }
}
</script>

<style scope>
.tag {
  width: 80px;
  color: #409eff;
  text-align: center;
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
  border-radius: 30px;
}

.editor {
  height: auto !important;
}

</style>
