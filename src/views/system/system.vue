<template>
  <div class="container dashboard-editor-container">
    <el-tabs v-model="activeName"
             style="margin-top: 15px;"
             type="border-card">
      <el-tab-pane v-for="item in tabMapOptions"
                   :key="item.key"
                   :label="item.label"
                   :name="item.key">
        <!-- 搜索栏 -->
        <div>
          <el-form inline
                   label-width="100px">
            <el-form-item :label="activeName !== 'ROLE' ? '登录账号' : '角色名称' ">
              <el-col>
                <el-input title="请输入要查询的账号,若输入空则显示全部数据"
                          size="small"
                          placeholder="若输入空则显示全部数据"
                          v-model="keyword" />
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="search(keyword)"
                         round>搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="visibleDialog(activeName)"
                         round>新增</el-button>
            </el-form-item>
          </el-form>
          <!-- 标签页内容 -->
          <system-table :columns="columns[activeName]"
                        :tableData="tableData"
                        :total="total"
                        :page-size="pageSize"
                        :pageNum="pageNum"
                        :activeName="activeName"
                        @handleCurrentChange="handleCurrentChange"
                        @updateTable="updateTable" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 新增dialog -->
    <user-dialog :userVisible.sync="userVisible"
                 @updateTable="updateTable" />
    <role-dialog :roleVisible.sync="roleVisible"
                 @updateTable="updateTable" />
  </div>
</template>

<script>
import SystemTable from './components/SystemTable'
import UserDialog from './components/UserDialog'
import RoleDialog from './components/RoleDialog'
import { totalUser, totalRole, searchUser, searchRole } from '@/api'
const width = 180
// 表格列
const columns = {
  USER: [
    { prop: 'id', label: '序号', align: 'center' },
    { prop: 'username', label: '登录账号', width, align: 'center' },
    { prop: 'roleName', label: '所属角色', width, align: 'center' },
    { prop: 'department', label: '所属部门', align: 'center' },
    { prop: 'manager', label: '管理人', width, align: 'center' },
    { prop: 'status', label: '账号状态', width, align: 'center' },
    { prop: 'lastIp', label: '最后登录IP', width, align: 'center' },
    { prop: 'lastLoginTime', label: '最后登录时间', width, align: 'center' },
    { prop: 'account', label: '操作', align: 'center' }
  ],
  ROLE: [
    { prop: 'id', label: '序号', width, align: 'center' },
    { prop: 'name', label: '角色名称', align: 'center' },
    { prop: 'gmtCreate', label: '创建时间', align: 'center' },
    { prop: 'gmtModified', label: '修改时间', align: 'center' },
    { prop: 'account', label: '操作', align: 'center' }
  ]
}
export default {
  components: {
    SystemTable,
    UserDialog,
    RoleDialog
  },
  data () {
    return {
      // 表格列
      columns,
      // 显示时机
      userVisible: false,
      roleVisible: false,
      tableData: [],
      tabMapOptions: [
        { label: '用户管理', key: 'USER' },
        { label: '角色管理', key: 'ROLE' }
      ],
      activeName: 'USER',
      // 分页参数: 总记录数，起始页，每页显示条数
      total: 1,
      pageNum: 1,
      pageSize: 20,
      // 搜索框输入值
      keyword: ''
    }
  },
  methods: {
    // 搜索
    search (keyword) {
      if (this.activeName === 'ROLE') {
        let data =
          keyword !== '' && keyword !== null
            ? { roleName: keyword }
            : { pageNum: 1, pageSize: 20 }
        searchRole(data).then(result => {
          this.tableData = result.rows
          this.total = parseInt(result.total)
        })
      } else {
        let data =
          keyword !== '' && keyword !== null
            ? { username: keyword }
            : { pageNum: 1, pageSize: 20 }
        searchUser(data).then(result => {
          this.tableData = result.rows
          this.total = parseInt(result.total)
        })
      }
    },
    // 当前页改变时会触发
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData(this.pageNum, this.pageSize)
    },
    // 新增点击事件
    visibleDialog (val) {
      if (val === 'ROLE') {
        this.roleVisible = true
      } else {
        this.userVisible = true
      }
    },
    // 获取表格数据
    getData (pageNum, pageSize) {
      console.log('xx')
      if (this.activeName === 'ROLE') {
        totalRole({ pageNum: pageNum, pageSize: pageSize })
          .then(result => {
            this.tableData = result.rows
            this.total = parseInt(result.total)
          })
          .catch(err => {
            alert('列表获取失败' + err)
          })
      } else {
        totalUser({ pageNum: pageNum, pageSize: pageSize })
          .then(result => {
            this.tableData = result.rows
            this.total = parseInt(result.total)
          })
          .catch(err => {
            alert('列表获取失败' + err)
          })
      }
    },
    // 更新表格数据
    updateTable () {
      this.getData(this.pageNum, this.pageSize)
    }
  },
  watch: {
    activeName (val) {
      this.$router.replace(`${this.$route.path}?tab=${val}`)
      this.getData(this.pageNum, this.pageSize)
    }
  },
  created () {
    const tab = this.$route.query.tab
    if (tab) this.activeName = tab
    this.getData(this.pageNum, this.pageSize)
    console.log(this.activeName)
  }
}
</script>

<style lang="scss" scoped>
</style>
