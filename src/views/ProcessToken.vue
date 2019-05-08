<template>
  <div></div>
</template>

<script>
export default {
  created() {
    const loading = this.$loading({
      lock: true,
      text: 'Processing...',
      spinner: 'el-icon-loading',
    });
    const { token } = this.$route.query;
    if ((typeof token !== 'undefined') && token.length) {
      this.$store.commit('setApiToken', token);
      window.location.href = '/';
    }
    loading.close();
  },
};
</script>

<style lang="scss" scoped>
div {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}
</style>
