<template>
  <div>
    <el-form :model="ruleForm"
             ref="pushType"
             :rules='rules'
             label-width="100px">
      <el-form-item label="推送类型"
                    prop="type">
        <!--推送类型  -->
        <el-radio-group v-model="ruleForm.pushType">
          <el-radio :label="item.key"
                    v-for="(item,index) in obj.pushType"
                    :key='index'>{{item.value}}</el-radio>
        </el-radio-group>
        <!-- 推送类型 end -->

        <!-- 定时推送 -->
        <el-row class='border box-padding'
                v-show='ruleForm.pushType === "1"'>
          <el-col :span='6'>
            <el-form-item prop="pushData.timingDate"
                          label="日期">
              <el-date-picker type="date"
                              :picker-options="pickerOptions"
                              placeholder="选择日期"
                              v-model="ruleForm.pushData.timingDate"
                              style="width: 160px;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='6'>
            <el-form-item prop="pushData.timing"
                          label="时间">
              <el-time-picker placeholder="选择时间"
                              :disabled='timeDisabled'
                              :picker-options="timeOptions"
                              type="time"
                              v-model='ruleForm.pushData.timing'
                              style="width: 120px;"></el-time-picker>
            </el-form-item>
          </el-col>

        </el-row>
        <!-- 定时推送 end-->

        <!-- 规则推送 -->
        <el-row class='border box-padding'
                v-show='ruleForm.pushType === "2"'>
          <el-form-item label=""
                        style='margin-left: 50px;'
                        prop="pushData.regularWeek">
            <el-radio-group v-model='ruleForm.pushData.regularWeek'>
              <el-radio :label="item.key"
                        v-for='(item,index) in obj.regularWeek'
                        :key='index'>{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="pushData.regularTime"
                        label="时间">
            <el-time-picker placeholder="选择时间"
                            type="time"
                            v-model='ruleForm.pushData.regularTime'
                            style="width: 120px;"></el-time-picker>
          </el-form-item>
        </el-row>
        <!-- 规则推送end -->

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
const obj = {
  pushType: [
    { key: '0', value: '立即推送' },
    { key: '1', value: '定时推送' },
    { key: '2', value: '规律推送' }
  ],

  regularWeek: [
    { key: '*', value: '每天' },
    { key: 'MON', value: '每周一' },
    { key: 'TUE', value: '每周二' },
    { key: 'WED', value: '每周三' },
    { key: 'THU', value: '每周四' },
    { key: 'FRI', value: '每周五' },
    { key: 'SAT', value: '每周六' },
    { key: 'SUN', value: '每周日' }
  ]
}

export default {
  props: ['ruleForm'],
  data () {
    return {
      obj,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < (Date.now() - 86400000)
        }
      },
      timeOptions: {
        selectableRange: '00:00:00 - 23:59:59'
      },
      rules: {
        'pushData.regularTime': [{ required: false, message: '请选择时间', trigger: 'change' }],
        'pushData.timingDate': [{ required: false, validator: this.validatePass, trigger: 'change' }],
        'pushData.timing': [{ required: false, message: '请选择时间', trigger: 'change' }]
      },
      timeDisabled: true
    }
  },
  methods: {
    getRef () {
      return this.$refs.pushType
    },
    validatePass (rule, value, callback) {
      if (!this.rules['pushData.timingDate'][0].required) return callback()
      if (!value) {
        return callback(new Error('请选择日期'))
      }
      // 解决当日期选择当天时，选择时间不能小于当前时间
      if (!this.ruleForm.pushData.timingDate) return callback()
      const selectDate = moment(this.ruleForm.pushData.timingDate).format('YYYY:MM:DD')
      const currentDate = moment().format('YYYY:MM:DD')
      const addOneHour = moment().add(1, 'hours').format('HH')
      // 当天时间点为23点时，只能选择23。59.59
      const selectTime = addOneHour === '23' ? '23:59:59' : `${addOneHour}:00:00`
      this.timeOptions.selectableRange = currentDate === selectDate ? `${selectTime} - 23:59:59` : '00:00:00 - 23:59:59'
      callback()
    }
  },
  watch: {
    'ruleForm.pushType': {
      handler: function (newVal, oldVal) {
        this.$refs.pushType.resetFields()
        const { rules } = this
        const setPushTypeRule = (pushType) => {
          if (pushType === '0') return
          const pushTypeKey = pushType === '1'
          const ruleKeys = ['pushData.regularTime', 'pushData.timingDate', 'pushData.timing']
          ruleKeys.forEach((key, index) => {
            if (index === 0) {
              rules[key][0].required = !pushTypeKey
            } else {
              rules[key][0].required = pushTypeKey
            }
          })
        }
        setPushTypeRule(newVal)
      }
    },
    'ruleForm.pushData.timingDate' (newV, oldVal) {
      this.timeDisabled = !newV
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
