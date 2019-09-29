<template />
<script>
import Cookie from 'js-cookie'
export default {
  name: 'User',
  data() {
    return {

    }
  },
  created() {
    var userName = this.$route.query.name
    var userId = this.$route.query.userId
    var avatar = this.$route.query.avatar
    const readerInfo = {
      id: userId,
      name: userName,
      avatar: avatar
    }
    Cookie.set('READER_INFO', readerInfo, { expires: 7 })
    this.$root.userId = readerInfo.id
    this.$router.push({ path: '/' })
  }
}
</script>
