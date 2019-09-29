<template>
  <div>
    <el-form
      v-loading="loading"
      :model="loginForm1"
      :rules="rules"
      class="login-container"
      label-position="left"
      label-width="0px"
    >
      <h3 class="login_title">用户登录</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm1.username" type="text" auto-complete="off" placeholder="账号" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm1.password" type="password" auto-complete="off" placeholder="密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="doLogin">登录</el-button>
        <el-button type="primary" @click.native.prevent="toRegister">注册</el-button>
        <el-button type="primary" @click.native.prevent="forgetClick">忘记密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { postRequest } from '@/utils/api'
import Cookie from 'js-cookie'

export default {
  name: 'Login',
  data() {
    return {
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: ['blur', 'change'] }],
        password: [{ required: true, message: '请输入密码', trigger: ['blur', 'change'] }]
      },
      checked: true,
      loginForm1: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  mounted() {

  },
  created() {
    // 如果存在token
    if (localStorage.getItem('token')) {
      postRequest('/checkToken', {}).then(resp => {
        if (resp.status === 200) {
          if (resp.data.code === 200) {
            // const readerInfo={
            //   id: resp.data.data.User.id,
            //   name: resp.data.data.User.name,
            //   avatar: resp.data.data.User.avatar,
            //   email: resp.data.data.User.email
            // };
            // Cookie.set('READER_INFO', readerInfo, {expires: 7});
            this.$router.push({ path: '/home' })
          } else {
            localStorage.removeItem('token')
            Cookie.remove('READER_INFO')
          }
        }
      })
    }
  },

  methods: {
    toRegister: function() {
      this.$router.push({ path: '/register' })
    },
    doLogin: function() {
      const _this = this
      this.loading = true
      if (this.loginForm1.username === '' || this.loginForm1.password === '') {
        _this.$alert('账号或密码为空!')
        _this.loading = false
        return
      }
      postRequest('/login', this.loginForm1).then(resp => {
        _this.loading = false
        if (resp.status === 200) {
          // 成功
          console.log(resp.data)
          if (resp.data.message === '登录成功') {
            localStorage.setItem('token', JSON.stringify(resp.data.data.Token))
            const readerInfo = {
              id: resp.data.data.User.id,
              name: resp.data.data.User.name,
              avatar: resp.data.data.User.avatar,
              email: resp.data.data.User.email
            }

            Cookie.set('READER_INFO', readerInfo, { expires: 7 })
            console.log(Cookie.get('READER_INFO'))
          }
          _this.$alert(resp.data.message)
          // if (json.status === 'success') {
          //   _this.$router.replace({path: '/home'});
          // } else {
          //   _this.$alert('登录失败!', '失败!');
          // }
        } else {
          // 失败
          _this.$alert('登录失败!', '失败!')
        }
      }, resp => {
        _this.loading = false
        _this.$alert('找不到服务器⊙﹏⊙∥!', '失败!')
      })
      // Login(this.loginForm1).then(resp => {
      //   _this.loading = false;
      //   if (resp.status === 200) {
      //     //成功
      //     var json = resp.data;
      //     console.log(resp.data);
      //     if (resp.data.message === "登录成功") {
      //       localStorage.setItem("token", JSON.stringify(resp.data.data.Token));
      //     }
      //     _this.$alert(resp.data.message);
      //     // if (json.status === 'success') {
      //     //   _this.$router.replace({path: '/home'});
      //     // } else {
      //     //   _this.$alert('登录失败!', '失败!');
      //     // }
      //   } else {
      //     //失败
      //     _this.$alert('登录失败!', '失败!');
      //   }
      // }, resp => {
      //   _this.loading = false;
      //   _this.$alert('找不到服务器⊙﹏⊙∥!', '失败!');
      // });
    },
    forgetClick: function() {
      const _this = this
      _this.$alert('未开发完成')
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
</style>

