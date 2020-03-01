<template>
  <div class="container" style="background-color: #ffffff">
    <div class="row blog-wrapper">
      <div class="article-wrapper">
        <lb-article :blog-id="blogId"/>
      </div>
      <div class="comment-box-wrapper">
        <lb-comment-box :blog-id="blogId"/>
      </div>
      <div class="comment-wrapper">
        <lb-comment :blog-id="blogId"/>
      </div>
    </div>
    <el-footer style="text-align: center;margin-top: 20px;background-color: #24292e;color: lavender;height: 30px">
      ICP证：<a href="http://www.beian.miit.gov.cn">粤ICP备19094902号</a></el-footer>
  </div>
</template>

<script>
import article from './components/Article'
import comment from './components/Comment'
import commentBox from './components/CommentBox'

export default {
  components: {
    lbArticle: article,
    lbComment: comment,
    lbCommentBox: commentBox
  },
  props: {
    blogId: {
      type: Number,
      default: 1
    }
  },
  created() {
    this.$root.state.currPage = (this.blogId === 1) ? 'about' : 'blog'
  }
}
</script>

<style lang="scss" scoped>

  .container {
    padding-top: 72px;
    height: 100vh;

    @media (min-width: 960px) {
      .blog-wrapper{
        margin: 0 auto;
        padding: 40px 20px 20px 20px;
        max-width: 720px;
        width: 90%;

      }
    }

    @media (max-width: 960px) {
      .blog-wrapper{
        margin: 0 auto;
        padding: 40px 0px 20px 0px;
        width: 100%;
      }
    }

    .article-wrapper{
      width: 100%;
      margin-bottom: 1.25rem;
    }

    .comment-box-wrapper{
      width: 100%;
    }

    .comment-wrapper{
      width: 100%;
    }
  }

</style>
