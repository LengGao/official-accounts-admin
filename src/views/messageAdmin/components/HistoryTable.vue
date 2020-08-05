<template>
  <div>
    <div class="search-form">
      <el-form ref="form"
               :inline="true"
               :model="searchData"
               class="demo-form-inline">
        <el-form-item label="公众号"
                      prop='clientName'>
          <el-input v-model="searchData.clientName"></el-input>
        </el-form-item>
        <el-form-item label="推送类型"
                      prop='pushType'>
          <el-select v-model="searchData.pushType">
            <el-option v-for="item in pushTypeData"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="推送时间"
                      prop='pushDate'>
          <el-col>
            <el-date-picker type="date"
                            placeholder="选择日期"
                            value-format="timestamp"
                            v-model="searchData.pushDate"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="推送状态"
                      prop='status'>
          <el-select v-model="searchData.status">
            <el-option v-for="item in pushStatusData"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="推送任务"
                      prop='name'>
          <el-input v-model="searchData.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click='getData'>查询</el-button>
          <el-button type="reset"
                     @click='reset'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData"
              v-loading="loading"
              stripe
              style="width: 100%;">
      <el-table-column v-bind="item"
                       v-for='(item,index) in columns'
                       :key='index'>
        <template slot-scope="scope">

          <div v-if="item.prop === 'pushStatus'">
            {{scope.row[item.prop] | pushStatus}}
          </div>

          <div v-else-if="item.prop === 'pushType'">
            {{scope.row[item.prop] | pushType}}
          </div>

          <div v-else-if="item.prop === 'message'">
            <el-popover placement="top-start"
                        width="200"
                        trigger="hover">
              <div>
                <div v-html='scope.row[item.prop]'>
                </div>

              </div>
              <el-button slot="reference">移入查看详情</el-button>
            </el-popover>
          </div>
          <div v-else>
            {{scope.row[item.prop]}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="280"
                       align="center">
        <template slot-scope="scope">
          <el-button size="mini"
                     @click='del(scope.row)'>删除</el-button>
          <el-button size="mini"
                     @click='send(scope.row)'>发送</el-button>
          <el-button size="mini"
                     :disabled="scope.row.pushType === 0 ||scope.row.pushType === 1 "
                     @click='setStatus(scope.row)'>{{!scope.row.status? '启用':'暂停'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block pagina">

      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="searchData.pageNum"
                     :page-size="searchData.pageSize"
                     layout="prev, pager, next, jumper"
                     :total="total">

      </el-pagination>
      <div style='font-size: 13px; line-height: 34px; color: #606266;'>总共 {{total}} 条</div>

    </div>
  </div>
</template>

<script>
import { history, pushStatus, sendTask, delTask } from '@/api'
const width = 180
const align = 'center'
const columns = [
  { prop: 'timerId', label: '序号', align, width: 60 },
  { prop: 'name', label: '推送任务', width, align },
  { prop: 'clientName', label: '公众号', width: 100, align },
  { prop: 'lastPushTime', label: '推送时间', width: 180, align },
  { prop: 'message', label: '推送内容', width, align },
  { prop: 'targetTypeName', label: '推送对象', width, align },
  // { prop: 'pushStatus', label: '推送状态', width, align },
  { prop: 'count', label: '触达数据', align },
  { prop: 'userName', label: '推送账号', width, align },
  { prop: 'pushType', label: '推送类型', width, align }
]
const pushTypeData = [
  { value: '', label: '全部' },
  { value: 0, label: '立即推送' },
  { value: 1, label: '定时推送' },
  { value: 2, label: '规律推送' }
]

const pushStatusData = [
  { value: '', label: '全部' },
  { value: true, label: '推送成功' },
  { value: false, label: '推送失败' }
]
export default {
  data () {
    return {
      columns,
      pushTypeData,
      pushStatusData,
      loading: false,
      tableData: [],
      searchData: {
        status: '',
        clientName: '',
        pushDate: '',
        pushType: '',
        userName: '',
        name: '',
        pageNum: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  created () {
    this.getData()
  },
  methods: {
    del (row) {
      this.$confirm('确定删除该推送任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTask(row.timerId).then(() => {
          this.getData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    send (row) {
      sendTask(row.timerId).then(() => {
        this.$message({
          type: 'success',
          message: '发布成功!'
        })
      })
    },
    getData () {
      const query = {}
      Object.keys(this.searchData).forEach(key => {
        if (this.searchData[key]) {
          query[key] = this.searchData[key]
        }
      })
      this.loading = true
      history(query).then(res => {
        this.loading = false
        this.tableData = res.rows
        this.total = Number(res.total)
      })
    },
    async setStatus (row) {
      await pushStatus(row.timerId, { status: !row.status })
      this.$message({
        type: 'success',
        message: (row.status ? '启用' : '暂停') + '成功!'
      })
      this.getData()
    },
    handleSizeChange (e) {
      console.log(e)
    },
    handleCurrentChange (e) {
      this.searchData.pageNum = e
      this.getData()
    },

    reset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.pagina {
  display: flex;
  padding: 20px;
  justify-content: flex-end;
  align-content: center;
}
</style>
