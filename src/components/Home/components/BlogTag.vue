<template>
  <div class="sidebar tag">
    <div class="sidebar-title"><i class="iconfont icon-tag" />&nbsp;标签</div>
    <ul class="ul-tag">
      <a
        v-for="tag in tags"
        :key="tag.id"
        href="javascript:void(0)"
        @click="getBlogListByTag(tag.id)"
      >{{ tag.name }}</a>
    </ul>
  </div>
</template>

<script>
import { getRequest } from '@/utils/api'

export default {
  data() {
    return {
      tags: [
        {
          id: '',
          name: ''
        }
      ],
      page: 1,
      size: 999
    }
  },
  created() {
    getRequest('/tag', {
      page: this.page,
      size: this.size
    }).then(response => {
      this.tags = response.data.data.records
    })
  },
  methods: {
    getBlogListByTag(tagId) {
      const state = this.$root.state.blogListState // 通过该变量防止先按标签搜索后按关键词搜索，然后又按相同标签搜索时页面不刷新问题
      if (state !== 1 && state !== -1) { // 如果前面不是按标签搜索的话
        this.$root.state.tagId = tagId
        this.$root.state.blogListState = 1
      } else if (tagId !== this.$root.state.tagId) { // 如果前面是按标签搜索的且现在标签改变了，通过置反blogListState触发computed
        this.$root.state.blogListState = -state
        this.$root.state.tagId = tagId
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  margin-bottom: 10px;
  padding: 15px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;

  & > .sidebar-title {
    border-bottom: 1px solid #ea6f5a;
    font-size: 15px;
    font-weight: 500;
    padding: 0 0 5px 0;
    margin-bottom: 5px;
  }

  ul {
    padding-left: 0;

    li {
      list-style: none;
      margin: 3px 0px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      a {
        text-decoration: none;
        font-size: 15px;
        color: #000000;
      }

      a:hover {
        color: #6d6d6d;
      }
    }
  }
}

.tag {
  clear: both;
  overflow: hidden;
  background: #fff;

  ul {
    overflow: hidden;
    font-size: 12px;

    a {
      text-decoration: none;
      line-height: 16px;
      height: 24px;
      display: block;
      background: #999;
      float: left;
      padding: 3px 11px;
      margin: 10px 10px 0 0;
      border-radius: 8px;
      -moz-transition: all 0.5s ease;
      -webkit-transition: all 0.5s ease;
      -ms-transition: all 0.5s ease;
      -o-transition: all 0.5s ease;
      transition: all 0.5s ease;
      transition: all 0.5s;
      color: #f9f9f9;
    }

    a:nth-child(8n-7) {
      background: #8a9b0f;
    }

    a:nth-child(8n-6) {
      background: #eb6841;
    }

    a:nth-child(8n-5) {
      background: #3fb8af;
    }

    a:nth-child(8n-4) {
      background: #fe4365;
    }

    a:nth-child(8n-3) {
      background: #fc9d9a;
    }

    a:nth-child(8n-2) {
      background: #edc951;
    }

    a:nth-child(8n-1) {
      background: #c8c8a9;
    }

    a:nth-child(8n) {
      background: #83af9b;
    }

    a:first-child {
      background: #28a745;
    }

    a:last-child {
      background: #ffc107;
    }

    a:hover {
      text-shadow: #ffffff 1px 1px 1px;
      color: #ffffff;
    }
  }
}
</style>
