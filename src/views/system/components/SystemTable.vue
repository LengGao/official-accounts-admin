<template>
  <div>
    <el-table :data="tableData"
              stripe
              style="width: 100%;">
      <el-table-column v-bind="item"
                       v-for="(item,index) in columns"
                       :key="index">
        <template slot-scope="scope">
          <span v-if="item.prop === 'account'">
            <el-button type="text"
                       @click="modify(scope.row.id, activeName !== 'ROLE' ? scope.row.username : scope.row.name,scope.row.status)">{{operations[0]}}</el-button>
            <el-button type="text"
                       @click="disable(scope.row.id, scope.row.status)">
              {{
              scope.row.status === 0 ? operations[2] : operations[1]}}
            </el-button>
          </span>
          <span v-else-if="item.prop === 'status'">{{scope.row.status === 0 ? '禁用' : '启用'}}</span>
          <span v-else>{{scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange"
                     :current-page="pageNum"
                     :page-size="pageSize"
                     layout="prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </div>
    <!-- 修改dialog -->
    <user-modify :visibleUserModify.sync="visibleUserModify"
                 :status="status"
                 :username="username"
                 @updateTable="updateTable" />
    <role-modify :visibleRoleModify.sync="visibleRoleModify"
                 :status="status"
                 :rolename="rolename"
                 @updateTable="updateTable" />

    <!-- 删除/禁用dialog -->
    <user-disable :visibleDisable.sync="visibleDisable"
                  :activeName="activeName"
                  :operation="operation"
                  :id="id"
                  @updateTable="updateTable" />
  </div>
</template>

<script>
import UserModify from './UserModify'
import RoleModify from './RoleModify'
import UserDisable from './UserDisable'
export default {
  components: {
    UserModify,
    RoleModify,
    UserDisable
  },
  data () {
    return {
      // dialog 出现时机
      visibleUserModify: false,
      visibleRoleModify: false,
      visibleDisable: false,
      // 修改  name
      username: '',
      rolename: '',
      // 删除/启用/禁用 id
      id: 0,
      // 执行的操作 禁用/启用
      operation: '',
      // 当前状态
      status: -1
    }
  },
  props: {
    columns: Array,
    tableData: Array,
    total: Number,
    pageSize: Number,
    pageNum: Number,
    activeName: String
  },
  computed: {
    operations () {
      if (this.activeName === 'ROLE') {
        return ['修改', '删除']
      } else {
        return ['修改', '禁用', '启用']
      }
    }
  },
  methods: {
    modify (id, name, status) {
      if (this.activeName !== 'ROLE') {
        this.username = name
        this.visibleUserModify = true
      } else {
        this.rolename = name
        this.visibleRoleModify = true
      }
      this.status = status
    },
    disable (id, status) {
      this.visibleDisable = true
      this.id = id
      this.operation = status === 0 ? '启用' : '禁用'
    },
    handleCurrentChange (val) {
      this.$emit('handleCurrentChange', val)
    },
    updateTable () {
      this.$emit('updateTable')
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
  float: right;
  margin-top: 15px;
}
</style>
