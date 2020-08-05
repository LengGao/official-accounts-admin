<template>
  <div class="fields-main">
    <table-scroll :hNum="216-52">
      <div class="fields">
        <el-row type="flex"
                class="row-bg"
                align='middle'
                justify="space-between"
                style='margin-bottom: 20px;'>
        </el-row>
        <el-table :data="tableData"
                  stripe
                  style="width: 100%;">
          <el-table-column type="index"
                           label="序号">
          </el-table-column>
          <el-table-column v-bind="item"
                           v-for='(item,index) in columns'
                           :key='index'>
            <template slot-scope="scope">
              <span v-if="item.prop === 'hidefield'">
                <el-button slot="reference"
                           @click="disableField(scope.row)">禁用</el-button>
              </span>
              <span v-else>
                {{scope.row[item.prop]}}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </table-scroll>
    <!-- <div class="page-code">
      <div class="page-position">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage4"
                       :page-sizes="[100, 200, 300, 400]"
                       :page-size="100"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="400">
        </el-pagination>
      </div>
    </div> -->
  </div>
</template>

<script>
import TableScroll from '@/components/TableScroll'
import { types, banTypes } from '@/api'
const width = 180
const columns = [
  { prop: 'label', label: '字段名称', width },
  { prop: 'hidefield', label: '操作' }
]
export default {
  data () {
    return {
      Height: null,
      columns,
      currentPage4: 4,
      tableData: [],
      dataTotal: null
    }
  },
  components: {
    TableScroll
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    getData () {
      types({ types: 'INSERT_DATA' }).then(res => {
        this.tableData = res
      })
    },
    disableField (data) {
      this.$confirm('确定禁用 ' + data.label + ' 字段吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        banTypes(data.id).then(res => {
          this.$message({
            type: 'success',
            message: '禁用成功'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消禁用'
        })
      })
    }
  },
  created () {
    this.getData()
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
</style>
