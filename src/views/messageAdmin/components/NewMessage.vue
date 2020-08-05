<template>
  <div>
    <!-- 推送公号 -->
    <el-form :model="ruleForm"
             :rules="rules"
             ref="ruleForm"
             label-width="100px"
             class="demo-ruleForm">

      <el-form-item label="推送公号"
                    prop="clientId">
        <el-select v-model="ruleForm.clientId"
                   placeholder="请选择推送公众号">
          <el-option :label="item.name"
                     :value="item.id"
                     v-for="(item,index) in usableClient"
                     :key='index'></el-option>
        </el-select>
      </el-form-item>
      <!-- 推送公号 -->

      <!-- 推送任务 -->
      <el-form-item label="推送任务"
                    prop="name">
        <el-col :span="6">
          <el-input v-model="ruleForm.name"
                    maxlength="6"></el-input>
        </el-col>
        <el-col :span="17"
                :offset='1'
                class='flex-s-c'>
          <span>(请备注任务名称，不对外显示，仅作为归档）</span>
        </el-col>
      </el-form-item>
      <!-- 推送任务 end -->

      <!-- 推送类型 -->
      <push-type :ruleForm='ruleForm'
                 ref="pushType" />
      <!-- 推送类型 end -->

      <!-- 推送对象 -->
      <target-type :ruleForm='ruleForm'
                   ref="targetType" />
      <!-- 推送对象 end-->

      <!-- 消息类型 -->
      <message-type :ruleForm='ruleForm'
                    ref="messageType" />
      <!-- 消息类型 end-->

      <!-- 预览推送 -->
      <el-form-item label="预览推送">
        <el-button type="primary"
                   size="mini"
                   @click='preQrCode'
                   round>我要预览</el-button>
      </el-form-item>
      <!-- 预览推送 end -->

      <el-form-item>
        <el-button type="primary"
                   :loading="submitLoading"
                   @click="submit">提交发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import PushType from './PushType'
import MessageType from './MessageType'
import TargetType from './TargetType'
import { usableClient, timerCreate, msgCache } from '@/api'
import { Cron } from '@/utils'
import qs from 'qs'
import { msgSuccess } from '@/utils/common.js'
import QRCode from 'qrcode'

export default {
  components: {
    MessageType,
    PushType,
    TargetType
  },
  data () {
    return {
      usableClient: [], // 公众号数据
      ruleForm: {
        clientId: '', // 公众号Id
        name: '', // 推送任务
        pushType: '0', // 推送类型
        pushData: { // 推送数据
          regularWeek: '*', // 规则推送周几
          regularTime: '', // 规则推送时间
          timingDate: '', // 定时日期
          timing: '' // 定时时间},
        },
        targetType: 'PUSH_STUDENT', // 推送对象
        messageType: 'TEMPLATE_MESSAGE', // 消息类型
        msgJump: 'url',
        targetData: { // 推送对象
          regionIds: [], // 区域
          campusIds: [], // 归属校区
          gradeValues: [] // 年级

        },
        messageData: {
          templateId: '', // 选择模版id
          data: [], // 模版数据
          url: '', // 跳转url
          miniProgram: {
            appId: '',
            pagePath: ''
          } } // 消息数据,
      },
      cacheRuleForm: {},
      rules: {
        name: [
          { required: true, message: '请输入推送任务名称', trigger: 'blur' }
          // { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        clientId: [{ required: true, message: '请选择公众号', trigger: 'change' }]
      },
      formRefs: [], // 校验表单实例,
      submitLoading: false
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.getRefs()
  },
  methods: {
    init () {
      this.cacheRuleForm = JSON.parse(JSON.stringify(this.ruleForm))
      this.getUsableClient()
    },
    // 获取公众号数据
    async getUsableClient () {
      const res = await usableClient()
      this.usableClient = res
      this.ruleForm.clientId = this.usableClient[0].id
    },
    // 获取所有校验表单ref
    getRefs () {
      const keys = ['messageType', 'pushType', 'targetType']
      this.formRefs = keys.map(key => this.$refs[key].getRef())
      this.formRefs.push(this.$refs.ruleForm)
    },
    // 表单提交
    submitForm () {
      const validateRefsArr = this.formRefs.map(item => item.validate())
      console.log('1111', validateRefsArr)
      return Promise.all(validateRefsArr).then(res => {
        return this.submitSuccess(res)
      }).catch(err => {
        console.log('promiseAllerr', err)
      })
    },
    // 转换服务端格式并发送
    submitSuccess (res) {
      // 获取消息模版数据
      this.ruleForm.messageData.data = this.$refs.messageType.sendMsgData()
      // 去掉冗余字段
      const SUBMIT_KEY = ['name', 'cron', 'clientId', 'messageData', 'messageType', 'pushType', 'targetType']
      const params = {}
      SUBMIT_KEY.forEach(key => { params[key] = this.ruleForm[key] })
      // 获取cron时间表达式结果
      this.getCron(params)
      // 格式化市区，校区，年级格式
      this.formatTargetData(params)
      return params
    },
    submit () {
      this.submitForm().then(params => {
        if (!params) return
        this.submitLoading = true
        timerCreate(params).then(res => {
          msgSuccess('发布成功')
          this.submitLoading = false
          this.resetForm()
        }).catch(err => {
          console.log(err)
          this.submitLoading = false
        })
      })
    },
    // 二维码预览
    preQrCode () {
      this.submitForm().then(({ clientId, messageData }) => {
        msgCache({ clientId, messageData }).then(res => {
          const qrcodeUrl = `${window.location.protocol}//${window.location.host}/apis/wxsns/push/pre-send?${qs.stringify({ dataCacheKey: res })}`
          QRCode.toDataURL(qrcodeUrl)
            .then(url => {
              this.$alert(` <img src="${url}" alt="" style='margin: 0 auto;display: inherit;'>`, '扫描预览', {
                dangerouslyUseHTMLString: true
              })
            })
            .catch(err => {
              console.error(err)
            })
        })
      })
    },
    // 重置校验
    resetForm () {
      this.formRefs.forEach(item => item.resetFields())
      this.ruleForm = JSON.parse(JSON.stringify(this.cacheRuleForm))
      this.init()
    },
    // 获取cron时间表达式结果
    getCron (params) {
      const { pushData: { regularWeek, regularTime, timingDate, timing }, pushType } = this.ruleForm
      const cronObj = {
        '1': () => new Cron().getDate(timingDate).getTime(timing).format(),
        '2': () => new Cron().getWeekDay(regularWeek).getTime(regularTime).format()
      }
      const cron = cronObj[pushType] && cronObj[pushType]()
      params.cron = cron || ''
    },
    // 格式化市区，校区，年级格式 转为字符串拼接
    formatTargetData (params) {
      params.targetData = {}
      const { targetData } = this.ruleForm
      Object.keys(targetData).forEach(key => {
        if (targetData[key].length === 0) return
        if (key === 'regionIds') {
          if (targetData[key].length === 1) {
            params.targetData[key] = String(targetData[key][0][2])
            return
          }
          params.targetData[key] = targetData[key].reduce((x, y) => {
            return typeof (x) === 'string' ? x + ',' + y[2] : x[2] + ',' + y[2]
          })
        } else {
          params.targetData[key] = targetData[key].join(',')
        }
      })
    }
  },
  watch: {
    // 选择不同推送公众号时重置页面
    'ruleForm.clientId' (newV, oldV) {
      this.formRefs.forEach((item, index) => {
        if (index !== 3) {
          item.resetFields()
        }
      })
      Object.keys(this.cacheRuleForm).forEach(key => {
        if (key === 'clientId') return
        this.ruleForm[key] = this.cacheRuleForm[key]
      })
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
