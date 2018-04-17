<template>
  <div class="hello">
    <mt-header fixed title="个人车位租赁系统"></mt-header>

    <div style="margin-top: 40px;">
    <ul class="mui-table-view mui-table-view-chevron">
      <li class="mui-table-view-cell mui-media" v-for="(item, index) in parkInfo">
        <a class="mui-navigate-right" href="javascript:void(0)" @click.stop="showDetails(item)">
          <img class="mui-media-object mui-pull-left" src="../../../server/images/1.jpg">
          <div class="mui-media-body">
            <span style="text-align: left;">{{item.parkcity}}:{{item.parkstreet}}</span>
            <p class='mui-ellipsis'>{{item.parkdetails}}</p>
          </div>
        </a>
      </li>
    </ul>
    </div>



    <v-bottom></v-bottom>
  </div>
</template>

<script>
import Buttom from '@/components/bottom'
//import '../../assets/dist/css/mui.css'
export default {
  data () {
    return {
      parkInfo:[],
    }
  },
  methods:{
    // 获取车位信息
    getParkInfo(){
      this.$axios.get('/api/pps/getImagesList',
          {
            params:{userid:sessionStorage.getItem('userId')}
          }).then((res)=>{
          if (res.data.status === 'FAIL'){
            Toast(res.data.message);
          }else{
            this.parkInfo = res.data;
          }
        
        }).catch((err)=>{
          throw err;
        });

    },
    showDetails(item){
      console.log(item);
    },
  },
  mounted() {
    this.getParkInfo();
  },
  components:{
    'v-bottom':Buttom,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="../../assets/dist/css/mui.css">
</style>
