<template>
  <div>
    <el-dialog title="详情"
               :visible.sync="data.dialogVisible"
               width="60%">
      <!-- :before-close="handleClose" -->
      <div class="dialog-main">
        <div class="dialog-left">
          <div class="case">
            <div class="case-top"
                 v-html="data.data.example"
                 style="white-space: pre-wrap;">
              <!-- <p>您有新的作业了，请查收。</p>
              <p>班级：初一数学春季尖子班</p>
              <p>作业名称：2014年9月24日作业</p>
              <p>作业详情：请大家将数学课本68页面，课后作业3、6、7、8题作业完成，明早上交。</p>
              <p>感谢您的查阅，请认真对待，按时完成作业。</p> -->
            </div>
            <div class="case-bottom">
              <span>详情</span>
              <span class="el-icon-arrow-right"></span>
            </div>
          </div>
          <div class="case-text">内容示例</div>
        </div>
        <div class="dialog-right">
          <el-form ref="form"
                   label-width="80px"
                   size="mini"
                   label-position="left">
            <el-form-item label="模板ID">
              <span style="word-wrap: break-word;">{{data.data.id}}</span>
            </el-form-item>
            <el-form-item label="">
              <span style="color: #a3a2a8;">开发者调用模板消息接口时需提供模板ID</span>
            </el-form-item>
            <el-form-item label="标题">
              <span>{{data.data.title}}</span>
            </el-form-item>
            <el-form-item label="行业">
              <span>{{data.data.primaryIndustry}}{{data.data.deputyIndustry===null?'':'-'}}{{data.data.deputyIndustry}}</span>
            </el-form-item>
            <el-form-item label="详细内容">
              <div class="dialog-content"
                   style="white-space: pre-wrap;"
                   v-html="data.data.content">
                <!-- <p class="p">first.Data</p>
                <p class="p">班级：keyword1.DATA</p>
                <p class="p">作业名称：。。。。</p>
                <p class="p">作业详情：。。。。</p> -->
              </div>
            </el-form-item>
          </el-form>
          <div style="color: #a3a2a8;">在发送时，需要将内容的参数({{str}}内为参数)赋值替换为需要的信息</div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary"
                   @click="data.dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
      dialogVisible: false,
      str: '{{.DATA}}'
    }
  },
  props: {
    data: {
      type: Object,
      value: {}
    }
  },
  created () {
  },
  methods: {
  },
  watch: {
    data: {
      handler: function (val, oldVal) {
        console.log(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>

.dialog-main {
  width: 100%;
  overflow: hidden;

  .dialog-left {
    float: left;
    width: 50%;

    .case {
      overflow: hidden;

      .case-top {
        width: 320px;
        padding: 10px;
        border-top: 1px solid #eaedef;
        border-right: 1px solid #eaedef;
        border-left: 1px solid #eaedef;

        p {
          margin: 0;
          line-height: 25px;
        }
      }

      .case-bottom {
        position: relative;
        width: 320px;
        height: 40px;
        border: 1px solid #eaedef;

        span {
          position: absolute;
          top: 50%;
          color: #a3a2a8;
          transform: translateY(-50%);

          &:last-child {
            right: 10px;
          }

          &:first-child {
            left: 10px;
          }
        }
      }
    }

    .case-text {
      width: 320px;
      height: 50px;
      line-height: 50px;
      color: #a3a2a8;
      text-align: center;
    }
  }

  .dialog-right {
    float: left;
    width: 50%;

    .dialog-content {
      .p {
        margin: 5px 0;
      }
    }
  }
}

.el-form-item--mini.el-form-item {
  margin-bottom: 0;
}
</style>
