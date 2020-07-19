<template>
  <div v-loading="loading" class="comment-box">
    <form v-if="info.name" class="new-comment">
      <img
        v-if="info.avatar"
        class="avatar"
        :src="info.avatar"
      >
      <img
        v-else
        class="avatar"
        src="@/assets/imgs/add.png"
      >
      <textarea
        id="comment-text"
        ref="commentText"
        v-model="info.content"
        placeholder="写下你的评论..."
      />
      <div class="write-function-block">
        <div v-if="!isMobile" class="emoji-modal-wrap" style="display: inline-block">
          <a class="emoji-icon" tabindex="0" @click="showEmoji = !showEmoji" @blur="showEmoji = false">
            <i class="iconfont icon-smile" style="font-size: 1.5rem; color: #969696" />
            <div v-if="showEmoji" class="emoji-wrapper">
              <emoji class="emoji" @select="selectEmoji" />
            </div>
          </a>
        </div>
        <a ref="sendComment" class="btn btn-send" href="javascript:void(0)" @click="submitComment">发送</a>
      </div>
    </form>
    <div v-else class="sign-container">
      <button type="button" class="btn btn-sign" @click="showLogin">登录</button>
      <span>后发表评论</span>
    </div>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import emoji from '@/components/Emoji'
import { postRequest } from '@/utils/api'

export default {
  components: {
    emoji
  },
  props: {
    blogId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      info: {
        id: '',
        name: '',
        content: '',
        avatar: '',
        replyCommentId: '',
        email: ''
      },
      loading: false,
      infoVisible: false,
      showEmoji: false,
      cookieKey: 'READER_INFO',
      commentInterval: 30,
      commentReady: true,
      isMobile: false
    }
  },
  computed: {
    replyId() {
      return this.$root.state.comment.id
    },
    receiverName() {
      return this.$root.state.comment.name
    }
  },
  watch: {
    replyId(replyId) {
      if (replyId) {
        this.info.content = `@${this.receiverName}: `
        this.$refs.commentText.focus()
      }
    }
  },
  created() {
    this.info = { ...Cookie.getJSON(this.cookieKey), content: '', replyCommentId: '' }
  },

  mounted() {
    this.isMobile = window.matchMedia('(max-width:768px)').matches
  },
  methods: {
    showLogin: function() {
      this.$root.loginFormVisible = true
    },
    githubLogin: function() {
      this.loading = true
      postRequest('/user/login/github', {}).then(resp => {
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
    openModal() {
      this.infoVisible = true
    },
    submitComment() {
      if (!this.commentReady) return
      if (this.validateComment()) {
        this.loading = true
        this.info.blogId = this.blogId
        if (this.replyId) this.info.replyCommentId = this.replyId
        postRequest('/comment', this.info).then(response => {
          this.$message({
            message: '评论成功',
            type: 'success'
          })
          this.resetCommentTime()
          this.info.content = ''
          this.$root.state.comment.id = ''
          this.$root.state.comment.name = ''
          this.$root.state.comment.add += 1
        })
        this.loading = false
      }
    },
    validateComment() {
      if (!this.info.name) {
        this.openModal()
        return false
      }

      if (this.info.email && !/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.info.email)) {
        this.$message({
          message: '邮箱格式不正确！',
          type: 'warning'
        })
        return false
      }

      if (!this.info.content) {
        this.$message({
          message: '评论内容不能为空！',
          type: 'warning'
        })
        return false
      }

      if (this.info.content.length > 60) {
        this.$message({
          message: '评论字数不能超过60！',
          type: 'warning'
        })
        return false
      }
      return true
    },
    selectEmoji(code) {
      console.log('select emoji')
      this.info.content += code
    },
    resetCommentTime() {
      this.commentReady = false
      let timeLeft = this.commentInterval
      const judge = setInterval(() => {
        timeLeft--
        if (timeLeft <= 0) {
          this.commentReady = true
          this.$refs.sendComment.innerHTML = '发送'
          clearInterval(judge)
        } else {
          this.$refs.sendComment.innerHTML = timeLeft
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
  .comment-box {
    width: 100%;

    .new-comment {
      position: relative;
      margin-left: 48px;

      .avatar {
        position: absolute;
        left: -48px;
        margin-right: 5px;
        width: 38px;
        height: 38px;
        vertical-align: middle;
        display: inline-block;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      textarea {
        padding: 10px 15px;
        width: 100%;
        height: 80px;
        font-size: 13px;
        border: 1px solid #dcdcdc;
        border-radius: 4px;
        background-color: hsla(0, 0%, 71%, 0.1);
        resize: none;
        display: inline-block;
        vertical-align: top;
        outline-style: none;
      }

      .btn-send {
        float: right;
        width: 78px;
        margin: 10px 0;
        padding: 8px 18px;
        font-size: 16px;
        border: none;
        border-radius: 20px;
        color: #fff !important;
        background-color: #42c02e;
        cursor: pointer;
        outline: none;
        display: block;

        &:focus {
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(58, 255, 93, 0.25);
        }
      }

      .emoji-icon {
        position: absolute;
        outline: none;
        text-decoration: none;

        &:hover {
          text-decoration: none;
        }
      }

      .emoji-wrapper {
        position: relative;
        float: left;
        max-width: 100%;

        .emoji {
          position: absolute;
          top: -48px;
          left: -36px;
        }
      }
    }
  }
  .sign-container{
    text-align: center;
    padding: 10px 15px;
    width: 100%;
    height: 80px;
    font-size: 13px;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    background-color: hsla(0,0%,71%,.1);
    resize: none;
    display: inline-block;
    vertical-align: top;
    outline-style: none;
  }
  .btn {
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857;
    border-radius: 4px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .btn-sign {
    width: 78px;
    margin: 11px 10px 0 0;
    padding: 7px 18px;
    font-size: 16px;
    border: none;
    border-radius: 20px;
    color: #fff!important;
    background-color: #3194d0;
    outline: none;
  }
  span {
    font-size: 14px;
    vertical-align: -7px;
  }
</style>
