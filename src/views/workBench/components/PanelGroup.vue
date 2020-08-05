<template>
  <el-row :gutter="40"
          class="panel-group">
    <el-col :xs="12"
            :sm="12"
            :lg="6"
            class="card-panel-col"
            v-for='({title,val}, index) in list'
            :key='index'>
      <div class="card-panel">
        <div class="card-panel-text">
          {{title}}
        </div>
        <div class="card-panel-text">
          {{val}}
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { fansDetail } from '@/api'
let list = [{ title: '新增关注', val: 0 }, { title: '取消关注', val: 0 }, { title: '净增关注', val: 0 }, { title: '总粉丝数', val: 0 }]

export default {
  props: {
    clientId: String
  },
  data () {
    return {
      list,
      fansObj: {}
    }
  },
  mounted () {
    this.list = [{ title: '新增关注', val: 0 }, { title: '取消关注', val: 0 }, { title: '净增关注', val: 0 }, { title: '总粉丝数', val: 0 }]
  },
  watch: {
    clientId (newId, oldId) {
      this.getFansDetail(newId)
    }
  },
  methods: {
  // 获取公众粉丝数据
    getFansDetail (newId) {
      fansDetail(newId).then(res => {
        this.fansObj = res
        this.list.map(val => {
          if (val['title'] === '新增关注') {
            val.val = this.fansObj.newUser
            return
          }
          if (val['title'] === '取消关注') {
            val.val = this.fansObj.cancelUser
            return
          }
          if (val['title'] === '净增关注') {
            val.val = this.fansObj.netGrowUser
            return
          }
          if (val['title'] === '总粉丝数') {
            val.val = this.fansObj.cumulateUser
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    position: relative;
    display: flex;
    height: 108px;
    overflow: hidden;
    font-size: 12px;
    color: #666;
    text-align: center;
    // cursor: pointer;
    background: #fff;
    border-color: rgba(0, 0, 0, .05);
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    justify-content: center;
    align-items: center;
  }

  .card-panel-text {
    width: 100%;
    font-size: 20px;
  }
}
</style>
