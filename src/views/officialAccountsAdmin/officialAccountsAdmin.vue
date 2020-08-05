<template>
  <div style="padding: 30px; background-color: #f0f2f5;">
    <!--顶部搜索行-->
    <el-row :gutter="10"
      align="middle"
      type="flex"
      style="height: 50px;">
      <el-col :span="4">
        <el-input
          v-model="clientName"
          clearable
          type="text"
          placeholder="请输入公众号"
          size="small"
        ></el-input>
      </el-col>
      <el-col :span="2" >
        <el-button type="primary" :disabled="!/^[\u4E00-\u9FA5\uF900-\uFA2D\w]+$/.test(clientName)?true:false" @click="searchFn">搜索</el-button>
      </el-col>
      <el-col :span="2">
        <el-button plain @click="dialogFormVisible = true">+新增公众号</el-button>
      </el-col>
    </el-row>
    <!--form表单模态框-->
    <el-dialog title="新增公众号" :visible.sync="dialogFormVisible" width="30%" center>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="公众号名称" :label-width="formLabelWidth" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name" autocomplete="off" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="AppId" :label-width="formLabelWidth" prop="appId">
          <el-col :span="20">
            <el-input v-model="form.appId" autocomplete="off" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="App秘钥" :label-width="formLabelWidth" prop="secretKey">
          <el-col :span="20">
            <el-input v-model="form.secretKey" autocomplete="off" clearable></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureCreate('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!--底部公众号表格-->
    <client-data/>
    <!--底部分页-->
    <pagination/>
  </div>
</template>

<script>
import ClientData from './components/ClientData'
import Pagination from './components/Pagination'
import { mapActions } from 'vuex'
import { wxClients, createClient } from '@/api'
import { msgSuccess, msgWarning } from '@/utils/common'
export default {
  components: {
    ClientData,
    Pagination
  },
  data () {
    return {
      clientName: '',
      dialogFormVisible: false,
      form: {
        name: '',
        appId: '',
        secretKey: ''
      },
      formLabelWidth: '120px',
      rules: {
        name: [
          { required: true, message: '请输入公众号名称', trigger: 'blur' },
          { min: 4, max: 30, message: '长度在 4 到 30 个字符', trigger: 'blur' }
        ],
        appId: [
          { required: true, message: 'ID不能为空', trigger: 'blur' }
        ],
        secretKey: [
          { required: true, message: '秘钥不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    searchFn () {
      this.getWxClient(this.clientName, 1)
    },
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
          this.clientName = '' // 初始化值
          return
        }
        // 改变全局变量的值
        this.getTableData({
          tableData: res.rows,
          totalNum: Number(res.total),
          clientName: this.clientName
        })
        this.clientName = '' // 初始化值
      })
    },
    ...mapActions('offcialAccount', [
      'getTableData'
    ]),
    // 新增公众号函数
    createClient () {
      createClient({
        name: this.form.name,
        appId: this.form.appId,
        appSecret: this.form.secretKey
      }).then(res => {
        if (res === '新增成功') {
          // 重新请求页面展示数据
          const name = this.$store.state.offcialAccount.clientName
          console.log(name)
          const currentPage = this.$store.state.offcialAccount.currentPage
          this.getWxClient(name, currentPage)
          msgSuccess(res) // 成功弹框
        }
      }).catch(err => { // 捕捉异常
        msgWarning(err.response.data.message)
        this.dialogFormVisible = true
      })
    },
    sureCreate (formName) {
      // form表单校验
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          // 发送新建公众号请求
          this.createClient()
        } else {
          return false
        }
      })
      // 初始化form
      this.form = {
        name: '',
        appId: '',
        secretKey: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
