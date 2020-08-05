<template>
  <div>

    <el-form-item label="推送对象"
                  prop="targetType">
      <!--推送对象  -->
      <el-radio-group v-model="ruleForm.targetType">
        <el-radio :label="item.key"
                  v-for="(item,index) in obj.targetType"
                  :key='index'>{{item.value}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 推送对象 end -->

    <el-form :model="ruleForm"
             ref="targetType"
             :rules='rules'
             label-width="100px">

      <!-- 指定学生/资源属性 -->
      <el-form-item label="">
        <el-row class='border box-padding'
                v-show='targetTypeStatus'>
          <el-row style='margin-bottom: 30px;'>
            <el-col>
              <el-form-item prop="targetData.regionIds"
                            label="行政市区">
                <div class="block">
                  <el-cascader :options="gradeOptions"
                               v-model="ruleForm.targetData.regionIds"
                               :props="props"
                               @change='handleRegionChange'
                               collapse-tags
                               clearable></el-cascader>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 校区 -->
          <el-row style='margin-bottom: 30px;'>
            <el-form-item prop="targetData.campusIds"
                          :label="schoolLabel">
              <el-select v-model="ruleForm.targetData.campusIds"
                         style='width: 320px;'
                         multiple
                         placeholder="请选择">
                <el-option v-for="item in schoolOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <!-- 校区 end -->

          <el-row style='margin-bottom: 30px;'>
            <el-form-item prop="targetData.gradeValues"
                          label="学生年级">
              <el-checkbox :indeterminate="isIndeterminate"
                           v-model="checkAll"
                           @change="handleCheckAllChange">全选</el-checkbox>

              <el-checkbox-group v-model="ruleForm.targetData.gradeValues"
                                 @change="handleCheckedGradesChange">
                <el-checkbox v-for="(grade, index) in grades"
                             :label="grade.value"
                             :key="index">{{grade.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>

        </el-row>
        <!-- 指定学生/资源属性 end-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { types, region, allCampus, getAllRegion } from '@/api'
const obj = {
  targetType: [
  ]
}
export default {

  props: ['ruleForm'],
  data () {
    return {
      obj,
      gradeOptions: [{
        value: {
          'id': 440000,
          'name': '广东省',
          'parentId': 100000,
          'levelType': 1
        },
        label: '广东省'
      }],
      schoolOptions: [],
      props: {
        multiple: true,
        lazy: false,
        async lazyLoad (node, resolve) { // 动态加载级联区域数据
          const { level, value: { id, levelType } } = node
          const res = await region({ levelType: levelType + 1, parentId: id })
          const nodes = res.map(item => ({
            value: item,
            label: item.name,
            leaf: level >= 2
          }))
          // 通过调用resolve将子节点数据返回，通知组件数据加载完成
          resolve(nodes)
        }
      },
      checkAll: false, // 年级是否全部选择
      grades: [], // 年级数据
      checkedGrades: [], // 已选择年级
      checkAllGrades: [], // 缓存选择全部年级
      isIndeterminate: true,
      rules: {
        'targetData.regionIds': [{ type: 'array', required: true, message: '请选择行政市区', trigger: 'change' }],
        'targetData.campusIds': [{ type: 'array', required: true, message: '请选择归属校区', trigger: 'change' }],
        'targetData.gradeValues': [{ type: 'array', required: true, message: '请选择年级', trigger: 'change' }]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getTargetType()
    },
    // 获取推送对象
    async getTargetType () {
      this.obj.targetType = []
      const res = await types({ types: 'PUSH_TARGET' })
      res.forEach((item, index) => {
        const obj = { key: item.value, value: item.label }
        this.obj.targetType.push(obj)
      })
      this.ruleForm.targetType = this.obj.targetType[0].key
      this.initTargetFroms()
    },
    // 初始化推送对象表单数据
    initTargetFroms () {
      this.getAllRegion()
      this.allCampus()
      this.getGrade()
    },
    /**
     * 获取全部地区
     */
    async getAllRegion () {
      try {
        const res = await getAllRegion({ parentId: '440000' })
        this.formatRegionData(res)
        this.gradeOptions = [res]
      } catch (err) {
        console.error(err)
      }
    },
    /**
     * 递归格式化数据
     * @param{object} data
     */
    formatRegionData (val) {
      val.value = val.id
      val.label = val.name
      if (val.regionVOS && val.regionVOS.length !== 0) {
        val.children = []
        val.regionVOS.forEach(item => {
          val.children.push({
            value: item.id,
            label: item.name,
            children: item.regionVOS
          })
          this.formatRegionData(item)
        })
      }
    },
    // 获取所有校区
    async allCampus () {
      const res = await allCampus()
      this.schoolOptions = res.map(({ id, name }, index) => {
        return {
          value: id,
          label: name
        }
      })
    },
    // 获取学生年级
    async getGrade () {
      const res = await types({ types: 'STUDENT_GRADE' })
      this.grades = res
      this.grades.forEach(item => {
        this.checkAllGrades.push(item.value)
      })
    },
    casChange (e) {
      console.log(e)
    },
    handleRegionChange (values) {
      this.ruleForm.targetData.regionIds = values
    },
    handleCheckAllChange (val) {
      this.ruleForm.targetData.gradeValues = val ? this.checkAllGrades : []
      this.isIndeterminate = false
    },
    handleCheckedGradesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.checkAllGrades.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkAllGrades.length
    },
    getRef () {
      return this.$refs.targetType
    }
  },
  computed: {
    // 推送类型非公众号全部粉丝
    targetTypeStatus () {
      return this.ruleForm.targetType !== 'PUSH_ALL_WX_USER'
    },
    // 设置归属校区/学籍校区
    schoolLabel () {
      const { targetType } = this.ruleForm
      const rescouseKey = obj.targetType[0] && obj.targetType[0].key
      const schoolKey = obj.targetType[1] && obj.targetType[1].key
      if (targetType === rescouseKey) {
        return '归属校区'
      } else if (targetType === schoolKey) {
        return '学籍校区'
      } else {
        return ''
      }
    }
  },
  watch: {
    // 类型切换清空对象默认值
    'ruleForm.targetType': {
      handler: function (newV, oldV) {
        if (newV === 'PUSH_ALL_WX_USER') {
          this.$refs.targetType.resetFields()
          Object.keys(this.rules).forEach(key => {
            this.rules[key][0].required = false
          })
        } else {
          this.$refs.targetType.resetFields()
          Object.keys(this.rules).forEach(key => {
            this.rules[key][0].required = true
          })
          this.isIndeterminate = true
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
