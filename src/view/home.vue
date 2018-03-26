<template>
  <div >
    <mt-header title="个人车位租赁系统"></mt-header>
    <h3>{{ msg }}</h3>
    <v-bottom></v-bottom>
  </div>

</template>

<script>
import Buttom from '@/components/bottom'
export default {
  name: 'home',
  data () {
    return {
      msg: '欢迎来到个人车位租赁系统'
    }
  },
  components:{
    'v-bottom':Buttom,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  font-weight: normal;
}
</style>
