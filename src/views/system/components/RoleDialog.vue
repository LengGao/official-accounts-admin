<template>
  <div>
    <!-- 新增角色弹窗 -->
    <el-dialog title="新增角色"
               :visible.sync="roleVisible"
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
        <el-form-item label="角色名称"
                      prop="sysRoleName">
          <el-input type="text"
                    v-model="ruleForm.sysRoleName" />
        </el-form-item>
        <el-form-item label="菜单权限"
                      prop="menuIds">
          <el-tree :data="nodePrps"
                   :props="treeProps"
                   show-checkbox
                   @check-change="handleCheckChange"
                   class="demo-tree"></el-tree>
        </el-form-item>
        <el-form-item label="公号权限"
                      prop="wxClientIds">
          <el-checkbox-group v-model="ruleForm.wxClientIds"
                             @change="checkedChange">
            <el-checkbox v-for="(item,index) in checkList"
                         :key="index"
                         :label="item"></el-checkbox>
          </el-checkbox-group>
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
import { saveRole } from '@/api'

// 角色信息选项
const treeProps = {
  children: 'children',
  label: 'label'
}
const nodePrps = [
  {
    id: 1,
    label: '工作台',
    children: [
      {
        id: 4,
        label: '二级4'
      },
      {
        id: 7,
        label: '三级4'
      }
    ]
  },
  {
    id: 2,
    label: '一级 2',
    children: [
      {
        id: 5,
        label: '二级5'
      },
      {
        id: 8,
        label: '三级8'
      }
    ]
  },
  {
    id: 3,
    label: '一级 3',
    children: [
      {
        id: 6,
        label: '二级6'
      }
    ]
  }
]
export default {
  data () {
    var validatorMenuIds = (rule, value, callback) => {
      console.log('v', value)
      if (value.length === 0) {
        callback(new Error('请选择角色菜单权限'))
      }
    }
    return {
      // 表单项
      ruleForm: {
        menuIds: '',
        sysRoleName: '',
        wxClientIds: []
      },
      // 校验规则
      rule: {
        sysRoleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        menuIds: [
          { validator: validatorMenuIds, trigger: 'change' }
        ],
        wxClientIds: [
          { type: 'array', required: true, message: '请选择公号权限', trigger: 'change' }
        ]
      },
      // el-tree
      treeProps,
      nodePrps,
      // tree checked
      checkList: [
        '明师教育',
        '明师教育3',
        '明师教育2',
        '明师教育4'
      ]
    }
  },
  props: {
    roleVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 取消操作
    resetList (formName) {
      this.$emit('update:roleVisible', false)
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
        menuIds: this.ruleForm.menuIds,
        sysRoleIds: this.ruleForm.sysRoleIds,
        wxClientIds: this.ruleForm.wxClientIds
      }
      saveRole(data)
        .then(result => {
          me.$emit('update:roleVisible', false)
          me.$emit('updateTable')
        })
        .catch(err => {
          console.log('新增错误', err)
          me.$emit('update:roleVisible', false)
        })
    },
    // tree
    handleCheckChange (data, v1, v2) {
      let menuIds = this.ruleForm.menuIds
      let origin = Array.from(menuIds)
      let arr = []
      if (v1 === false && v2 === false) {
        let index = origin.indexOf(data.label)
        origin.splice(index, 1)
        arr = origin
        this.ruleForm.menuIds = arr
      } else if (v1 || v2) {
        arr = origin.push(data.label)
        this.ruleForm.menuIds = arr
      }
    },
    // check
    checkedChange (data) {
      this.ruleForm.wxClientIds = data
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-tree {
  display: flex;
  flex-direction: row;
}
</style>

/**
未完善部分
角色修改的权限数据未能获取,未能测试新增角色
角色菜单权限和工号权限未做校验
 */
