<template>
  <div >
    <mt-header title="个人车位租赁系统"></mt-header>
    <!-- <h3>{{ msg }}</h3> -->
    <div id="container" class="mymap"></div>
    <v-bottom></v-bottom>
  </div>

</template>

<script>
import AMap from 'AMap'
import Buttom from '@/components/bottom'
export default {
  name: 'home',
  data () {
    return {
      msg: '欢迎来到个人车位租赁系统'
    }
  },
  methods: {
    loadmap(){
      const map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 9
      });
    }
  },
  mounted(){
    this.loadmap();     //加载地图和相关组件
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
.mymap{
  width: 400px;
  height: 550px;
}
</style>
