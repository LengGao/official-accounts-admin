<template>
  <div>
    <!-- 新增用户弹窗 -->
    <el-dialog title="新增用户"
               :visible.sync="userVisible"
               width="600px"
               :before-close="resetList"
               :modal="true"
               :modal-append-to-body="false">
      <el-form ref="ruleForm"
               :model="ruleForm"
               :rules="rule"
               label-position="left"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="登录账号"
                      prop="username">
          <el-input type="text"
                    v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="登录密码"
                      prop="password">
          <el-input type="text"
                    v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="所属角色"
                      prop="sysRoleIds">
          <el-select placeholder="请选择性别"
                     v-model="ruleForm.sysRoleIds">
            <el-option v-for="item in sysRoleItems"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门"
                      prop="department">
          <el-input type="text"
                    v-model="ruleForm.department"></el-input>
        </el-form-item>
        <el-form-item label="管理人"
                      prop="manager">
          <el-input type="text"
                    v-model="ruleForm.manager"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetList('ruleForm')">取 消</el-button>
          <el-button type="primary"
                     @click="compile('ruleForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

import { saveUser, totalRole } from '@/api'
export default {
  data () {
    // 登录账号校验
    var validatorUsername = (rule, value, callback) => {
      let flag = String(value).match(/^[A-Za-z0-9]+$/g)
      setTimeout(() => {
        if (flag == null) {
          callback(new Error('请输入英文或数字值'))
        } else {
          if (value > 20) {
            callback(new Error('长度最多不能超过20个字符'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    // 20汉字长度校验
    var validatorDataLength = (rule, value, callback) => {
      setTimeout(() => {
        var intLength = 0
        for (var i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) < 0 || value.charCodeAt(i) > 255) {
            intLength = intLength + 2
          } else {
            intLength = intLength + 1
          }
        }
        if (intLength > 40) {
          return callback(new Error('长度最多为20个汉字'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      // 表单项
      ruleForm: {
        department: '',
        id: 0,
        manager: '',
        password: '',
        sysRoleIds: '',
        username: ''
      },
      // select选项
      sysRoleItems: '',
      // 校验规则
      rule: {
        username: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { validator: validatorUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码不能少于6位' }
        ],
        sysRoleIds: [
          { required: true, message: '请输入所属角色', trigger: 'change' }
        ],
        department: [
          { required: true, message: '请输入所属部门', trigger: 'blur' },
          { validator: validatorDataLength, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请输入管理人', trigger: 'blur' },
          { validator: validatorDataLength, trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    userVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 取消操作
    resetList (formName) {
      this.$emit('update:userVisible', false)
      this.$refs[formName].resetFields()
    },
    // 确定操作
    compile (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          return this.submit()
        } else {
          return false
        }
      })
    },
    // 提交表单
    submit () {
      let me = this
      let data = {
        username: this.ruleForm.username,
        password: this.ruleForm.password,
        sysRoleIds: this.ruleForm.sysRoleIds,
        department: this.ruleForm.department,
        manager: this.ruleForm.manager
      }
      saveUser(data)
        .then(result => {
          me.$emit('update:userVisible', false)
          me.$emit('updateTable')
          me.resetList('ruleForm')
        })
        .catch(err => {
          console.log('新增错误', err)
          me.$emit('update:userVisible', false)
        })
    },
    // select
    getSysRoleItems () {
      let me = this
      totalRole({ pageNum: 1, pageSize: 20 }).then(result => {
        me.sysRoleItems = result.rows
      })
    }
  },
  watch: {
    userVisible () {
      if (this.userVisible) {
        this.getSysRoleItems()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

/**
未完善部分
角色修改的权限数据未能获取,未能测试新增角色
角色菜单权限和工号权限未做校验
 */
