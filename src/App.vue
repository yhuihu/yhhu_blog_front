<template>
  <div id="app" class="page-full-screen">
    <lb-navbar />
    <lb-oauth />
    <lb-reg />
    <lb-back-to-top />
    <router-view />
  </div>
</template>

<script>
import navbar from '@/components/Navbar'
import backToTop from '@/components/BackToTop'
import oauth from '@/components/User/Oauth'
import reg from '@/components/User/reg'

export default {
  name: 'App',
  components: {
    lbNavbar: navbar,
    lbBackToTop: backToTop,
    lbOauth: oauth,
    lbReg: reg
  }
}
</script>

<style>
  .page-full-screen {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
</style>
