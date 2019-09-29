<template />
<script>
import Cookie from 'js-cookie'
export default {
  name: 'LogOut',
  data() {
    return {

    }
  },
  created() {
    Cookie.remove('READER_INFO')
    this.$root.userId = ''
    this.$router.push({ path: '/' })
  }
}
</script>
