<template>
  <mt-tabbar fixed v-model="selected">
      <mt-tab-item id="home_page">
        <img slot="icon" src="../assets/home.png">
        首页
      </mt-tab-item>
      <mt-tab-item id="find">
        <img slot="icon" src="../assets/find.png">
        预约车位
      </mt-tab-item>
      <mt-tab-item id="reserved">
        <img slot="icon" src="../assets/reserved.png">
        我的预约
      </mt-tab-item>
      <mt-tab-item id="personal">
        <img slot="icon" src="../assets/mine.png">
        个人中心
      </mt-tab-item>
    </mt-tabbar>
</template>

<script>
export default {
  name: 'bottom',
  data () {
    return {
      selected:sessionStorage.getItem("page"),
    }
  },
  watch: {
    selected: function (val, oldVal) {
        switch(val){
          case 'home_page':sessionStorage.setItem("page","home_page");this.$router.push('/home');break;
          case 'find':sessionStorage.setItem("page","find");this.$router.push('/find');break;
          case 'reserved':sessionStorage.setItem("page","reserved");this.$router.push('/myreserve');break;
          case 'personal':sessionStorage.setItem("page","personal");this.$router.push('/personal');break;
          default:;
        }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
