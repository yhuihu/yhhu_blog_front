<template>
</template>
<script>
  import Cookie from 'js-cookie'
  export default {
    name: 'user',
    data() {
      return{

      }
    },
    created() {
      var _this = this
      var userName=this.$route.query.name;
      var userId=this.$route.query.userId;
      var avatar=this.$route.query.avatar;
      const readerInfo={
        id: userId,
        name: userName,
        avatar: avatar
      };
      console.log(readerInfo)
      Cookie.set('READER_INFO', readerInfo, {expires: 7});
      this.$router.push({ path: '/' })
    }
  }
</script>
