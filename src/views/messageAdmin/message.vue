<template>
  <div class='container message'>
    <el-tabs v-model="activeName"
             type="border-card"
             @tab-click="handleClick">
      <el-tab-pane label="新增消息推送"
                   name="first">
        <new-message />
      </el-tab-pane>
      <el-tab-pane label="推送历史"
                   name="second">
        <history-table />
      </el-tab-pane>
    </el-tabs>
  </div>

</template>
<script>
import NewMessage from './components/NewMessage'
import HistoryTable from './components/HistoryTable'
import { msgWarning } from '@/utils/common'
export default {
  components: {
    NewMessage,
    HistoryTable
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  mounted () {
    if (!this.$route.query.showPage) {
      return
    }
    this.activeName = this.$route.query.showPage
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
