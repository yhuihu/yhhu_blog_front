<template>
  <el-dialog
    style="width: 60%;margin-left: auto;margin-right: auto;"
    title="注册用户"
    :visible.sync="this.$root.regFormVisible"
    :close-on-click-modal="false"
    :show-close="false"
    @closed="handleCancel"
  >
    <div v-loading="loading">
      <el-form ref="regForm" :model="regForm" status-icon :rules="regRules" label-width="50px" class="demo-ruleForm">
        <el-form-item label="账号" prop="username">
          <el-input v-model="regForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="regForm.password" placeholder="请输入密码" type="password" auto-complete="true" />
        </el-form-item><el-form-item label="确认密码" prop="password1">
          <el-input v-model="regForm.password1" placeholder="重复输入密码" type="password" auto-complete="true" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <pan-thumb :image="regForm.icon" />
          <image-cropper
            v-model="that.$root.uploadVisible"
            field="file"
            :width="300"
            :height="300"
            :url="url"
            img-format="png"
            @crop-success="cropSuccess"
            @crop-upload-success="cropUploadSuccess"
            @crop-upload-fail="cropUploadFail"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button class="btn-outline-success" @click="handleLogin">返回登录</el-button>
        <el-button class="btn-outline-info" @click="handleLogin">确认注册</el-button>
        <el-button class="btn-outline-danger" @click="handleCancel">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { postRequest } from '@/utils/api'
import PanThumb from '@/components/PanThumb'
import ImageCropper from 'vue-image-crop-upload'

export default {
  name: 'Reg',
  components: { ImageCropper, PanThumb },
  data() {
    return {
      that: this,
      url: process.env.BASE_URL + '/upload',
      regRules: {
        username: [{
          required: true,
          min: 6,
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
      regForm: {
        username: '',
        password: '',
        password1: '',
        icon: 'http://yhhu.xyz/seBr6CFscQuuyfMgf5emRILZ'
      },
      loading: false
    }
  },
  methods: {
    /**
       *
       * @param image
       * @param field
       */
    cropSuccess(image, field) {
      console.log('-------- crop success --------')
      // this.image = image
    },

    /**
       * 上传成功
       * @param jsonData 服务器返回数据，已进行 JSON 转码
       * @param field
       */
    cropUploadSuccess(jsonData, field) {
      console.log('-------- upload success --------')
      this.regForm.icon = jsonData.data.url
      // 更新头像
      // modifyIcon({
      //   username: this.$store.getters.name,
      //   path: jsonData.data.path
      // }).then(response => {
      //   this.$message({
      //     message: response.message,
      //     type: 'success'
      //   })
      //
      //   // 更新 vuex 中的头像
      //   this.$store.dispatch('user/setAvatar', jsonData.data.path)
      // }).catch(() => {
      // })
    },

    /**
       * 上传失败
       * @param status 服务器返回的失败状态码
       * @param field
       */
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    },
    handleCancel: function() {
      this.$refs.regForm.resetFields()
      this.regForm.icon = 'http://yhhu.xyz/seBr6CFscQuuyfMgf5emRILZ'
      this.$root.regFormVisible = false
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
        }
      })
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
    }
  }
}
</script>

<style scoped>

</style>
