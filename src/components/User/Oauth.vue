<template>
  <el-dialog style="width: 60%;margin-left: auto;margin-right: auto;" title="登录" :visible.sync="this.$root.loginFormVisible" :close-on-click-modal="false" :show-close="false" @closed="handleCancel">
    <div v-loading="loading">
<!--      <el-form ref="loginForm" :model="loginForm" status-icon :rules="loginRules" label-width="50px" class="demo-ruleForm">-->
<!--        <el-form-item label="账号" prop="username">-->
<!--          <el-input v-model="loginForm.username" placeholder="请输入用户名" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="密码" prop="password">-->
<!--          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" auto-complete="true" />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div style="text-align: center">-->
<!--        <el-button class="btn-outline-success" @click="handleLogin">登 录</el-button>-->
<!--        <el-button class="btn-outline-info" @click="toReg">注 册</el-button>-->
<!--        <el-button class="btn-outline-danger" @click="handleCancel">取 消</el-button>-->
<!--      </div>-->
      <div style="text-align: center;margin-top: 5%">
<!--        <hr>-->
        <a
          id="github"
          title="Github"
          style="cursor: pointer;"
          @click="githubLogin"
        ><i class="iconfont icon-github" /></a>
      </div>
      <el-button class="btn-outline-danger" @click="handleCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postRequest } from '@/utils/api'
export default {
  name: 'Oauth',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   callback()
    // }
    // const validatePassword = (rule, value, callback) => {
    //   callback()
    // }
    return {
      loginRules: {
        username: [{
          required: true,
          min: 5,
          message: '请输入正确账号',
          // validator: validateUsername,
          trigger: ['change']
        }],
        password: [{
          required: true,
          message: '请输入正确密码',
          min: 6,
          // validator: validatePassword,
          trigger: ['change']
        }]
      },
      loginForm: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    handleCancel: function() {
      // this.$refs.loginForm.resetFields()
      this.$root.loginFormVisible = false
    },
    handleLogin() {
      this.$alert('请使用Github登录!')
      // this.$refs.loginForm.validate(valid => {
      //   if (valid) {
      //     this.loading = true
      //   }
      // })
    },
    githubLogin: function() {
      this.loading = true
      postRequest('/oauth/login/github', {}).then(resp => {
        if (resp.status === 200) {
          // 成功
          if (resp.data.code === 2000) {
            window.location.href = resp.data.data.redirectUrl
          }
        }
      }, resp => {
        this.loading = false
        this.$alert('找不到服务器⊙﹏⊙∥!', '失败!')
      })
      this.loading = true
    },
    toReg() {
      this.$refs.loginForm.resetFields()
      this.$root.loginFormVisible = false
      this.$root.regFormVisible = true
    }
  }
}
</script>

<style scoped>
  .iconfont {
    font-size: 2rem;
  }
</style>
