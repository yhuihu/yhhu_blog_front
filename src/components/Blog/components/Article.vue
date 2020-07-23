<template>
  <div
    id="article"
    class="article"
  >
    <h1
      id="title"
      class="title"
    > {{ blog.title }}</h1>
    <div
      v-if="blog.typeName !== '原创' && blog.originalUrl"
      class="origin-wrapper"
    >
      <a
        v-if="blog.typeName === '转载'"
        :href="blog.originalUrl"
        target="_blank"
        class="origin"
      >转自{{ blog.originalUrl }}</a>
      <a
        v-else-if="blog.typeName === '翻译'"
        :href="blog.originalUrl"
        target="_blank"
        class="origin"
      >译自{{ blog.originalUrl }}</a>
    </div>
    <div
      class="content markdown-body"
      v-html="content"
    />
    <div class="copyright"><i class="fa fa-copyright" />欢迎转载，请注明出处</div>
    <div style="text-align: center; margin-top: 40px">
      <button
        id="like-btn"
        class="btn btn-like"
        @click="addLike"
      >喜欢 {{ blog.likeCount }}
      </button>
    </div>
    <div
      id="outerdiv"
      style="position:fixed;top:0;left:0;background:rgba(0,0,0,0.7);z-index:99999;width:100%;height:100%;display:none;"
    >
      <div
        id="innerdiv"
        style="position:absolute;"
      >
        <img
          id="bigimg"
          style="border:5px solid #fff;"
          src=""
        >
      </div>
    </div>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import '@/assets/styles/github-md.css'
import { getRequest } from '@/utils/api'
import { postRequest } from '@/utils/api'
import $ from 'jquery'

export default {
  props: {
    blogId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      blog: {
        id: '',
        title: '',
        summary: '',
        createDate: '',
        updateDate: '',
        clickCount: '',
        commentCount: '',
        likeCount: '',
        tag: '',
        blogImage: '',
        originalUrl: '',
        content: '',
        typeName: ''
      },
      content: '',
      cookieKey: 'LIKE_BLOG_' + this.blogId
    }
  },
  watch: {
    blogId() {
      this.fetchData()
    }
  },
  created() {
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: function(code) {
        return hljs.highlightAuto(code).value
      },
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    })
    this.fetchData()
    this.addClick() // 添加点击数
  },
  updated: function() {
    $('.markdown-body img').click(function() {
      var _this = $(this)// 将当前的pimg元素作为_this传入函数
      imgShow('#outerdiv', '#innerdiv', '#bigimg', _this)
    })

    function imgShow(outerdiv, innerdiv, bigimg, _this) {
      var src = _this.attr('src')// 获取当前点击的pimg元素中的src属性
      $(bigimg).attr('src', src)// 设置#bigimg元素的src属性

      /* 获取当前点击图片的真实大小，并显示弹出层及大图*/
      $(bigimg).on('load', function() {
        var windowW = $(window).width()// 获取当前窗口宽度
        var windowH = $(window).height()// 获取当前窗口高度
        var realWidth = this.width// 获取图片真实宽度
        var realHeight = this.height// 获取图片真实高度
        var imgWidth, imgHeight
        var scale = 0.8// 缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放

        if (realHeight > windowH * scale) { // 判断图片高度
          imgHeight = windowH * scale// 如大于窗口高度，图片高度进行缩放
          imgWidth = imgHeight / realHeight * realWidth// 等比例缩放宽度
          if (imgWidth > windowW * scale) { // 如宽度扔大于窗口宽度
            imgWidth = windowW * scale// 再对宽度进行缩放
          }
        } else if (realWidth > windowW * scale) { // 如图片高度合适，判断图片宽度
          imgWidth = windowW * scale// 如大于窗口宽度，图片宽度进行缩放
          imgHeight = imgWidth / realWidth * realHeight// 等比例缩放高度
        } else { // 如果图片真实高度和宽度都符合要求，高宽不变
          imgWidth = realWidth
          imgHeight = realHeight
        }
        $(bigimg).css('width', imgWidth)// 以最终的宽度对图片缩放

        var w = (windowW - imgWidth) / 2// 计算图片与窗口左边距
        var h = (windowH - imgHeight) / 2// 计算图片与窗口上边距
        $(innerdiv).css({ 'top': h, 'left': w })// 设置#innerdiv的top和left属性
        $(outerdiv).fadeIn('normal')// 淡入显示#outerdiv及.pimg
      })

      $(outerdiv).click(function() { // 再次点击淡出消失弹出层
        $(this).fadeOut('normal')
      })
    }
  },
  methods: {
    fetchData() {
      getRequest('/blog/' + this.blogId + '/detail').then(response => {
        this.blog = response.data.data
        this.content = marked(this.blog.content)
      })
    },
    addClick() {
      postRequest('/blog/click', {
        blogId: this.blogId
      })
    },
    addLike() {
      if (Cookie.get(this.cookieKey)) return
      postRequest('/blog/like', {
        blogId: this.blogId
      }).then(response => {
        this.blog.likeCount += 1
        Cookie.set(this.cookieKey, 1)
      })
    }
  }
}

</script>

<style lang="scss">
.article {
  position: relative;
  display: block;
  padding-bottom: 60px;

  .title {
    word-break: break-word;
    margin: 20px 0 40px 0;
    font-size: 34px;
    text-align: center;
    font-weight: 700;
    line-height: 1.3;
    font-family: -apple-system, SF UI Display, Arial, PingFang SC,
      Hiragino Sans GB, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif;
  }

  .origin-wrapper {
    width: 100%;
    a {
      float: right;
    }
    .origin {
      font-size: 0.75rem;
      font-weight: 500;
      color: #bcbcbc;
      &:hover {
        text-decoration: none;
      }
    }
  }

  .content {
    word-wrap: break-word;
    word-break: normal;
    padding: 0;

    a:hover {
      color: #0366d6;
    }

    img {
      max-width: 100%;
    }
  }

  .copyright {
    position: absolute;
    right: 5px;
    bottom: 5px;
    color: #c8c8c8;
    font-size: 12px;
  }

  .btn-like {
    padding: 8px 25px;
    font-size: 16px;
    color: #fff;
    background-color: #ea6f5a;
    border-radius: 20px;
    border: none;

    &:hover {
      color: #fff;
    }

    &:focus {
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(255, 0, 0, 0.25);
    }
  }
}
</style>
