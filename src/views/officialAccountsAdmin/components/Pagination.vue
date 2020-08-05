<template>
  <div class="pagination-wrap">
    <div class="block main-part">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total=totalNum>
      </el-pagination>
    </div>
<!--    {{$store.state.offcialAccount.currentPage}}-->
  </div>
</template>

<script>
import { wxClients } from '@/api'
import { mapActions } from 'vuex'
import { msgWarning } from '@/utils/common'
export default {
  name: 'Pagination',
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
          currentPage: pageNum
        })
      })
    },
    handleCurrentChange (val) {
      // 请求跳转页面需要显示数据 改变全局变量的currentPage
      this.getWxClient(this.clientName, val)
    }
  },
  computed: {
    totalNum () {
      return this.$store.state.offcialAccount.totalNum
    },
    clientName () {
      return this.$store.state.offcialAccount.clientName
    }
  },
  data () {
    return {
      currentPage: 1
    }
  }
}
</script>

<style scoped>
  .pagination-wrap {
    position: relative;
    height: 100px;
    padding-bottom: 30px;
  }

  .main-part {
    position: absolute;
    right: 30px;
  }
</style>
