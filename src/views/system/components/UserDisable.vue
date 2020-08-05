<template>
  <div>
    <!--弹窗-->
    <el-dialog :title="operation+'用户'"
               :visible.sync="visibleDisable"
               width="600px"
               :before-close="resetList"
               :modal="true"
               :center="true"
               :modal-append-to-body="false"
               v-if="activeName === 'USER'">
      <span>
        确定要{{operation}}
        <span class='toast'>{{data}}</span>
        吗?
      </span>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="resetList">取 消</el-button>
        <el-button type="primary"
                   @click="compile">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除角色"
               :visible.sync="visibleDisable"
               width="600px"
               :before-close="resetList"
               :modal="true"
               :center="true"
               :modal-append-to-body="false"
               v-else>
      <span>
        确定要删除
        <span class='toast'>{{data}}</span>
        角色吗？
      </span>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="resetList()">取 消</el-button>
        <el-button type="primary"
                   @click="compile()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { disableUser, deleteRole } from '@/api'
export default {
  data () {
    return {
      data: '明师'
    }
  },
  props: {
    visibleDisable: {
      type: Boolean,
      default: false
    },
    activeName: String,
    operation: String,
    id: Number
  },
  methods: {
    resetList () {
      this.$emit('update:visibleDisable', false)
    },
    compile () {
      let me = this
      if (this.activeName === 'ROLE') {
        deleteRole({ roleId: this.id }).then((result) => {
          me.$emit('update:visibleDisable', false)
          me.$emit('updateTable')
        }).catch(error => {
          alert('删除失败' + error)
          me.$emit('update:visibleDisable', false)
        })
      } else {
        let enable = this.operation === '禁用' ? 0 : 1
        disableUser({ sysUserId: this.id, enable: enable }).then((result) => {
          me.$emit('update:visibleDisable', false)
          me.$emit('updateTable')
        }).catch(error => {
          alert('删除失败' + error)
          me.$emit('update:visibleDisable', false)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.toast {
  margin: 0 5px;
  color: #409eff;
}
</style>

/**
未完善部分
角色删除接口未完善
 */
