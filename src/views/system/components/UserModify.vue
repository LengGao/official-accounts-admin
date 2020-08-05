<template>
  <div>
    <!--弹窗-->
    <div v-if="status !== 0 && status !== -1">
      <el-dialog title="修改用户"
                 :visible.sync="visibleUserModify"
                 width="600px"
                 :before-close="resetList"
                 :modal="true"
                 :modal-append-to-body="false">
        <el-form :model="ruleForm"
                 :rules="rule"
                 label-position="left"
                 ref="ruleForm"
                 label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="登录账号">
            <el-input type="text"
                      disabled
                      v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-input type="text"
                      placeholder="*******"
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
    <div v-else>
      <el-dialog title="该用户已被禁用"
                 :visible.sync="visibleUserModify"
                 width="600px"
                 :before-close="resetList"
                 :modal="true"
                 :modal-append-to-body="false"
                 center>
        <el-button type="primary"
                   slot="footer"
                   @click="resetList('formItem')">确定</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { modifyUser, totalUser, totalRole } from '@/api'
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
      }, 500)
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
      }, 500)
    }
    return {
      ruleForm: {
        department: '',
        id: 0,
        manager: '',
        password: '',
        sysRoleIds: '',
        username: ''
      },
      sysRoleItems: '',
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
    visibleUserModify: {
      type: Boolean,
      default: false
    },
    username: String,
    status: Number
  },
  methods: {
    // 取消操作
    resetList (formName) {
      this.$emit('update:visibleUserModify', false)
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
    submit () {
      let me = this
      let data = this.ruleForm
      delete data.status
      modifyUser(data)
        .then(result => {
          me.$emit('update:visibleUserModify', false)
          me.$emit('updateTable')
        })
        .catch(err => {
          console.log('新增错误', err)
          me.$emit('update:visibleUserModify', false)
        })
    },
    // select
    getSysRoleItems () {
      let me = this
      totalRole({ pageNum: 1, pageSize: 20 }).then(result => {
        me.sysRoleItems = result.rows
      })
    },
    // 获取需要修改操作的用户信息
    getData () {
      totalUser({ username: this.username }).then(result => {
        totalRole({ roleName: result.rows[0].roleName }).then(respone => {
          if (result.rows[0].status !== 0) {
            let data = {
              id: result.rows[0].id,
              username: result.rows[0].username,
              password: '',
              sysRoleIds: respone.rows[0].id,
              department: result.rows[0].department,
              manager: result.rows[0].manager,
              status: result.rows[0].status
            }
            this.ruleForm = data
          }
        })
      })
    }
  },
  watch: {
    username () {
      if (this.username !== '') {
        this.getData()
      }
    },
    visibleUserModify () {
      if (this.visibleUserModify) {
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
角色修改的权限数据未能获取,因此 name 属性的中的部分字段与totalRole请求返回字段未完全对应,未能测试角色修改
菜单权限和公号权限未做校验
 */
