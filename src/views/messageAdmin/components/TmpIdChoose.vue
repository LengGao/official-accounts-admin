<template>
  <div>
    <el-dialog title="选择模版Id"
               v-loading="loading"
               :visible.sync="dialogFormVisible">
      <el-row>
        <el-row class='table-border'>
          <el-col :span='8'>
            名称
          </el-col>
          <el-col :span='16'>
            id
          </el-col>
        </el-row>

        <el-row class='table-border mb10 '
                v-for='(item,index) in gridData.rows'
                :key='index'>
          <el-col :span='8'
                  class='radio-title'>
            <el-radio v-model="chooseTmpId"
                      :label="item.id">{{item.title}}</el-radio>
          </el-col>
          <el-col :span='16'>
            {{item.id}}
          </el-col>
        </el-row>

      </el-row>

      <!-- 分页 -->
      <el-row type='flex'
              justify="end">
        <el-col :span='12'
                style='display: flex; justify-content: flex-end;'>
          <el-pagination background
                         :page-size='10'
                         @current-change='currentChange'
                         @prev-click='prevClick'
                         @next-click='nextClick'
                         layout="prev, pager, next"
                         :total="+gridData.total">
          </el-pagination>
        </el-col>
      </el-row>
      <!-- 分页 end -->

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary"
                   @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { wxTemplates } from '@/api'
export default {
  props: ['ruleForm'],
  data () {
    return {
      gridData: { rows: [], total: 0 },
      chooseTmpId: '',
      dialogFormVisible: false,
      formLabelWidth: '120px',
      loading: false,
      pageObj: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    // 获取模版数据
    async getData (clientId) {
      this.loading = true
      const res = await wxTemplates(clientId, this.pageObj)
      this.loading = false
      this.gridData = res
    },
    cancel () {
      this.dialogFormVisible = false
    },
    submit () {
      this.dialogFormVisible = false
      this.ruleForm.messageData.templateId = this.chooseTmpId
      let selectMsgItem = {}
      this.gridData.rows.forEach(v => {
        if (v.id === this.chooseTmpId) {
          selectMsgItem = v
        }
      })
      this.$emit('selectMsgItem', selectMsgItem)
    },
    show () {
      this.dialogFormVisible = true
      if (this.gridData.rows.length === 0) {
        this.getData(this.ruleForm.clientId)
      }
    },
    // 换页
    currentChange (v) {
      this.pageObj.pageNum = v
      this.getData(this.ruleForm.clientId)
    },
    prevClick (v) {
      console.log(v)
    },
    nextClick (v) {
      console.log(v)
    }
  },
  watch: {
    // 监听推送公众号更改
    'ruleForm.clientId': {
      handler: function (newVal, oldVal) {
        if (!newVal) {
          this.$emit('selectMsgItem')
          this.ruleForm.messageData.templateId = ''
          return
        }
        this.page = {
          pageNum: 1,
          pageSize: 20
        }
        this.getData(newVal)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-border {
  text-align: center;
  border: 1px solid #dcdfe6;
}

.radio-title {
  padding-left: 10px;
  text-align: left;
}
</style>
