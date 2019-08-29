<template>
</template>
<script>
  import Cookie from 'js-cookie'
  export default {
    name: 'logOut',
    data() {
      return{

      }
    },
    created() {
      Cookie.remove('READER_INFO');
      this.$root.userId=''
      this.$router.push({ path: '/' })
    }
  }
</script>
