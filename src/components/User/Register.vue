<template>
  <div>
    <el-form
      v-loading="loading"
      :model="registerForm"
      :rules="registerRules"
      class="login-container"
      label-position="left"
      label-width="0px"
    >
      <h3 class="login_title">注册用户</h3>
      <el-form-item prop="avatar">
        <lb-upload
          v-model="registerForm.avatar"
          height="90px"
          class="inner-item"
        />
      </el-form-item>
      <el-form-item prop="username">
        <el-input
          v-model="registerForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
        />
      </el-form-item>
      <el-form-item prop="name">
        <el-input
          v-model="registerForm.name"
          type="text"
          auto-complete="off"
          placeholder="名称"
        />
      </el-form-item>
      <el-form-item prop="email">
        <el-input
          v-model="registerForm.email"
          type="email"
          auto-complete="off"
          placeholder="邮箱"
        />
      </el-form-item>
      <el-form-item
        prop="emailCode"
        class="pr"
      >
        <el-input
          v-model="registerForm.emailCode"
          type="text"
          auto-complete="off"
          placeholder="验证码"
          @keyup.native="handleInput"
        />
        <button
          type="button"
          class="code-btn"
          :disabled="!show"
          @click="getCode"
        >
          <span v-show="show">发送验证码</span>
          <span
            v-show="!show"
            class="count"
          >{{ count }} s</span>
        </button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click.native.prevent="doRegister"
        >注册</el-button>
        <el-button
          type="primary"
          @click.native.prevent="toLogin"
        >返回登录</el-button>
        <el-button
          type="primary"
          @click.native.prevent="githubLogin"
        >github登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { postRequest } from '@/utils/api'
import upload from '@/components/Upload'

export default {
  name: 'Register',
  components: {
    lbUpload: upload
  },
  data() {
    return {
      registerRules: {
        username: [
          { required: true, message: '请输入账号', trigger: ['blur', 'change'] },
          { min: 5, max: 12, message: '长度请保持在5-12个字符' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '密码长度需要在6-12个字符' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: ['blur', 'change'] },
          { type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
        ],
        emailCode: [
          { required: true, message: '请输入验证码', trigger: ['blur', 'change'] }
        ]
      },
      checked: true,
      registerForm: {
        username: '',
        password: '',
        name: '',
        email: '',
        emailCode: '',
        avatar: ''
      },
      loading: false,
      show: true,
      timer: null,
      count: ''
    }
  },
  mounted() {

  },
  methods: {
    handleInput() {
      this.registerForm.emailCode = this.registerForm.emailCode.replace(/[^\.\d]/g, '')
      this.registerForm.emailCode = this.registerForm.emailCode.replace('.', '')
    },
    validateRegister() {
      if (this.registerForm.email && !/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.registerForm.email)) {
        this.$message({
          message: '邮箱格式不正确！',
          type: 'warning'
        })
        this.loading = false
        return false
      }
      if (this.registerForm.name === '') {
        this.$message({
          message: '名称不能为空！',
          type: 'warning'
        })
        this.loading = false
        return false
      }
      if (this.registerForm.username.length < 5) {
        this.$message({
          message: '用户名必须大于5位！',
          type: 'warning'
        })
        this.loading = false
        return false
      } else if (this.registerForm.username.length > 12) {
        this.$message({
          message: '用户名必须小于12位！',
          type: 'warning'
        })
        this.loading = false
        return false
      }
      if (this.registerForm.password.length < 6) {
        this.$message({
          message: '密码必须大于等于6位！',
          type: 'warning'
        })
        this.loading = false
        return false
      } else if (this.registerForm.password.length > 12) {
        this.$message({
          message: '密码必须小于12位！',
          type: 'warning'
        })
        return false
      }
      return true
    },
    toLogin: function() {
      this.$router.push({ path: '/Login' })
    },
    doRegister: function() {
      this.loading = true
      if (this.validateRegister()) {
        postRequest('/doRegister', this.registerForm).then(resp => {
          this.loading = false
          if (resp.status === 200) {
            // 成功
            console.log(resp.data)
            this.$alert(resp.data.message)
            if (resp.data.code === 400) {
              // 进入400错误，不进行用户信息保存
            }
            if (resp.data.code === 200) {
              // 注册成功，跳转到登录
              this.$router.push({ path: '/Login' })
            }
          } else {
            // 失败
            this.loading = false
            this.$alert('服务端出现错误，请稍后重试!')
          }
        }, resp => {
          this.loading = false
          this.$alert('找不到服务器⊙﹏⊙∥!', '失败!')
        })
      }
      this.loading = true
    },
    githubLogin: function() {
      this.loading = true
      postRequest('/oauth/login/github', this.registerForm).then(resp => {
        if (resp.status === 200) {
          // 成功
          if (resp.data.code === 2000) {
            window.location.href = resp.data.data.redirectUrl
          }
        }
        this.loading = false
      }, resp => {
        this.loading = false
        this.$alert('找不到服务器⊙﹏⊙∥!', '失败!')
      })
      this.loading = true
    },
    getCode: function() {
      var _this = this
      _this.loading = true
      if (this.registerForm.email === '' && !/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.registerForm.email)) {
        this.$message({
          message: '邮箱格式不正确！',
          type: 'warning'
        })
        _this.loading = false
        return false
      } else {
        postRequest('/getRegisterCode', {
          email: this.registerForm.email
        }).then(resp => {
          _this.loading = false
          if (resp.status === 200) {
            // 成功
            _this.$alert(resp.data.message)
            if (resp.data.code === 400) {

            } else {
              if (!this.timer) {
                this.count = 300
                this.show = false
                this.timer = setInterval(() => {
                  if (this.count > 0) {
                    this.count--
                  } else {
                    this.show = true
                    clearInterval(this.timer)
                    this.timer = null
                  }
                }, 1000)
              }
            }
          } else {
            // 失败
            _this.loading = false
            _this.$alert('服务端出现错误，请稍后重试!')
          }
        }, resp => {
          _this.loading = false
          _this.$alert('找不到服务器⊙﹏⊙∥!', '失败!')
        })
      }
    }
  }
}
</script>

<style>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.login_remember {
  margin: 0px 0px 35px 0px;
  text-align: left;
}

.pr {
  position: relative;
}

.code-btn {
  width: 100px;
  height: 35px;
  position: absolute;
  top: 3px;
  right: 5px;
  z-index: 222;
  color: #f5a623;
  font-size: 14px;
  border: none;
  border-left: 1px solid #bababa;
  padding-left: 10px;
  background-color: #fff;
}
</style>
