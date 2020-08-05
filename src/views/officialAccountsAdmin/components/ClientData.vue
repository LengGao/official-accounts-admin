<template>
    <div style="padding: 30px 30px 30px 0; box-sizing: border-box;">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%;">
        <el-table-column
          v-for="(item,index) in columns"
          :align="item['align']"
          :prop="item['prop']"
          :key="index"
          :label="item['label']"
          :width="item['width']">
          <template slot-scope="scope">
            <!--序号-->
            <span v-if="item.prop === 'id'">
              {{scope.row.id?scope.row.id:'暂无'}}
            </span>
            <!--公众号名称-->
            <span v-if="item.prop === 'name'">
              {{scope.row.name?scope.row.name:'暂无'}}
            </span>
            <!--appId-->
            <span v-if="item.prop === 'appId'">
              {{scope.row.appId?scope.row.appId:'暂无'}}
            </span>
            <!--新增时间-->
            <span v-if="item.prop === 'gmtCreate'">
              {{scope.row.gmtCreate?scope.row.gmtCreate:'暂无'}}
            </span>
            <!--删除操作-->
            <span v-if="item.prop === 'operation'">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删 除</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!--删除提示框-->
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <span style="display: block; text-align: center;">确定删除<b style="color: blue;">&nbsp;{{deleteName}}&nbsp;</b>公众号吗？</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="sureDelete">确 定</el-button>
  </span>
      </el-dialog>
    </div>
</template>

<script>
import { deleteClient, wxClients } from '@/api'
import { mapActions } from 'vuex'
import { msgSuccess, msgWarning } from '@/utils/common'
const width = 350
const align = 'center'
const columns = [
  { prop: 'id', label: '序号', width, align },
  { prop: 'name', label: '公众号名称', width, align },
  { prop: 'appId', label: 'appId', width, align },
  { prop: 'gmtCreate', label: '新增时间', width, align },
  { prop: 'operation', label: '操作', width, align }
]
export default {
  name: 'clientData',
  data () {
    return {
      deleteName: '',
      centerDialogVisible: false,
      columns,
      deleteId: ''
    }
  },
  computed: {
    tableData () {
      return this.$store.state.offcialAccount.tableData
    }
  },
  methods: {
    ...mapActions('offcialAccount', [
      'getTableData'
    ]),
    // 将请求回来的微信公众号数据放在全局变量中
    getWxClient (name, pageNum) {
      // 将请求回来的微信公众号数据放在全局变量中
      wxClients({
        name,
        pageNum
      }).then(res => {
        if (res.total === '0') {
          msgWarning('没有找到相应公众号')
          this.getTableData([]) // 初始化全局变量tableData
          return
        }
        // 改变全局变量的值
        this.getTableData({
          tableData: res.rows,
          totalNum: Number(res.total),
          clientName: this.$store.state.offcialAccount.clientName,
          currentPage: pageNum
        })
      })
    },
    // 显示二次删除确认窗口
    handleDelete (index, row) {
      this.centerDialogVisible = true // 删除确认框
      this.deleteName = row.name // 删除公众号名字
      this.deleteId = row.id // 删除公众号的id
    },
    // 删除公众号的请求
    deleteClientFn (clientId) {
      deleteClient(clientId).then(res => {
        if (res === '删除完毕') {
          // 重新请求数据 刷新页面
          let name = this.$store.state.offcialAccount.clientName
          let pageNum = this.$store.state.offcialAccount.currentPage
          this.getWxClient(name, String(pageNum))
          msgSuccess(res)
        }
      })
        .catch(err => {
          msgWarning(err)
        })
    },
    // 确认删除
    sureDelete () {
      this.centerDialogVisible = false
      this.deleteClientFn(this.deleteId)
    }
  },
  mounted () {
    this.getWxClient('', '1')
  }
}
</script>

<style scoped>

</style>
