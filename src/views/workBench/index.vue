<template>
  <div class="container dashboard-editor-container">
    <p>公号粉丝数据</p>
    <el-form label-width="100px">
      <el-form-item label="我的公众号">
        <el-select v-model="clientId"
                   placeholder="请选择">
          <el-option v-for="item in options"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <panel-group :client-id="clientId" />

    <!-- 消息推送数据 -->
    <message-data :client-id="clientId" />
    <!-- 消息推送数据end -->

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import MessageData from './components/MessageData'
import { usableClient } from '@/api'

export default {
  name: 'DashboardAdmin',
  components:
    {
      MessageData,
      PanelGroup

    },
  data () {
    return {
      options: [],
      columns: [

      ],
      officialAccounts: '',
      clientId: null
    }
  },
  created () {
    this.init()
    this.getUsableClient()
  },
  methods: {
    async init () {
      // 初始化clientID 值
      this.clientId = null
      // const res = await sendHistory()
      // console.log('首页数据', res)
    },
    // 请求公众号数据
    getUsableClient () {
      usableClient().then(res => {
        this.options = res
        if (res && res.length > 0) this.clientId = res[0].id
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-editor-container {
  position: relative;
}

.el-form-item__label {
  text-align: left;
}
</style>
