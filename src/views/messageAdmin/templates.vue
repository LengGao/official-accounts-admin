<template>
  <div class="fields-main">
    <div class="table-header">
      <span>我的公从号</span>
      <span>&nbsp;&nbsp;</span>
      <el-select v-model="myClient"
                 size="small"
                 placeholder="请选择">
        <el-option v-for="item in options"
                   :key="item.id"
                   :label="item.name"
                   :value="item.appId">
        </el-option>
      </el-select>
      <span>&nbsp;&nbsp;</span>
      <el-button type="primary"
                 size="small"
                 round>点击同步</el-button>
    </div>
    <table-scroll :hNum="216">
      <div class="fields">
        <el-table :data="tableData"
                  stripe
                  style="width: 100%;">
          <el-table-column type="index"
                           label="序号"
                           width="80">
          </el-table-column>
          <el-table-column v-bind="item"
                           :width="index===0?'200':''"
                           v-for='(item,index) in columns'
                           :key='index'>
            <template slot-scope="scope">
              <span v-if="item.prop === 'details'">
                <el-button slot="reference"
                           @click="goDetails(scope.row)">详情</el-button>
              </span>
              <span v-else>
                {{scope.row[item.prop]}}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </table-scroll>
    <div class="page-code">
      <div class="page-position">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage4"
                       :page-sizes="[100, 200, 300, 400]"
                       :page-size="100"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="pageTotal">
        </el-pagination>
      </div>
    </div>
    <!-- 弹框 -->
    <TmeplateDialog :data="dialogData" />
  </div>
</template>

<script>
import TableScroll from '@/components/TableScroll'
import TmeplateDialog from '@/views/messageAdmin/components/TmeplateDialog'
import { usableClient, wxTemplates } from '@/api'
const width = 180
const columns = [
  { prop: 'title', label: '模板标题', width },
  { prop: 'gmtCreate', label: '新增时间', width },
  { prop: 'details', label: '操作' }
]
export default {
  data () {
    return {
      Height: null,
      columns,
      myClient: '',
      myClientId: null,
      options: [],
      currentPage4: 1,
      pageTotal: 26,
      dialogVisible: false,
      tableData: [],
      page: { pageNum: 1, pageSize: 20 },
      dialogData: {
        dialogVisible: false,
        data: {}
      }
    }
  },
  components: {
    TableScroll,
    TmeplateDialog
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.page.pageNum = val
      this.getTableList(this.myClientId)
    },
    getTableList (id) {
      wxTemplates(id, this.page).then(data => {
        this.tableData = data.rows
        this.pageTotal = parseInt(data.total)
      })
    },
    getUsableClientData () {
      usableClient().then(res => {
        this.options = res
        this.myClient = res[0].name
        this.myClientId = res[0].id
        this.getTableList(this.myClientId)
      })
    },
    goDetails (item) {
      this.dialogData.dialogVisible = true
      this.dialogData.data = item
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    }
  },
  created () {
    this.getUsableClientData()
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.fields {
  padding: 20px;
}

.page-code {
  position: relative;
  width: 100%;
  height: 30px;

  .page-position {
    position: absolute;
    top: 0;
    right: 20px;
  }
}

.table-header {
  padding: 10px 20px;
}
</style>
