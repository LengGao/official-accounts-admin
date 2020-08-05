<template>
  <div>
    <el-row type="flex"
            class="row-bg"
            align='middle'
            justify="space-between"
            style='margin-bottom: 20px;'>
      <span>
        消息推送数据
      </span>
      <el-button type="primary"
                 round
                 @click="seeMore">查看更多</el-button>
    </el-row>

    <el-table :data="tableData"
              stripe
              style="width: 100%;">
      <el-table-column v-bind="item"
                       v-for='(item,index) in columns'
                       :key='index'
                       :lable="item['label']">
        <template slot-scope="scope">
          <span v-if="item.prop === 'message'">
            <el-popover placement="top-start" width="200" trigger="hover">
              <div v-html='scope.row.message'>
                </div>
              <el-button slot="reference">移入查看详情</el-button>
            </el-popover>
          </span>
          <!--序号-->
          <span v-if="item.prop === 'timerId'">
            {{scope.row.timerId}}
          </span>
          <!--推送任务-->
          <span v-if="item.prop === 'name'">
            {{scope.row.name}}
          </span>
          <!--公众号-->
          <span v-if="item.prop === 'clientName'">
           {{scope.row.clientName}}
          </span>
          <!--推送时间-->
          <span v-if="item.prop === 'lastPushTime'">
            {{scope.row.lastPushTime}}
          </span>
          <!--推送对象-->
          <span v-if="item.prop === 'targetType'">
            {{scope.row.targetTypeName}}
          </span>
          <!--推送状态-->
          <span v-if="item.prop === 'status'">
            {{scope.row.status?'成功':'失败'}}
          </span>
          <!--触达数量-->
          <span v-if="item.prop === 'count'">
            {{scope.row.count}}
          </span>
          <!--推送账号-->
          <span v-if="item.prop === 'userName'">
            {{scope.row.userName?scope.row.userName:'暂无推送账号'}}
          </span>
          <!--推送类型-->
          <span v-if="item.prop === 'pushType'">
            {{scope.row.pushType===0?'立即推送':scope.row.pushType===1?'定时推送':scope.row.pushType===2?'规律推送':'无'}}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { history } from '@/api'
const width = 180
const align = 'center'
const columns = [
  { prop: 'timerId', label: '序号', align },
  { prop: 'name', label: '推送任务', width, align },
  { prop: 'clientName', label: '公众号', width, align },
  { prop: 'lastPushTime', label: '推送时间', align },
  { prop: 'targetType', label: '推送对象', width, align },
  { prop: 'message', label: '推送内容', width, align },
  { prop: 'status', label: '推送状态', width, align },
  { prop: 'count', label: '触达数量', width, align },
  { prop: 'userName', label: '推送账号', width, align },
  { prop: 'pushType', label: '推送类型', width, align }
]
export default {
  props: {
    clientId: String
  },
  data () {
    return {
      columns,
      tableData: []
    }
  },
  created () {
  },
  watch: {
    clientId (newId, oldId) {
      this.getData(newId)
    }
  },
  methods: {
    // 跳转页面 查看更多
    seeMore () {
      this.$router.push({
        path: '/message-admin/message',
        query: {
          showPage: 'second' // 显示推送历史页面
        }
      })
    },
    // 获取推送数据
    getData (newId) {
      history(
        {
          clientId: newId,
          pageNum: 1,
          pageSize: 5
        }
      ).then(res => {
        this.tableData = res.rows
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
