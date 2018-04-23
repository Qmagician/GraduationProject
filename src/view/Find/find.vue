<template>
  <div class="hello">
    <mt-header fixed title="个人车位租赁系统"></mt-header>
    <div style="margin-top: 45px;width: 94%;margin-left: 3%">
      <el-row>
        <el-input size="small" class="search-input" placeholder="市区" v-model="condition" clearable>
          <el-button size="small"  slot="append" @click="search">搜索</el-button>
        </el-input>
      </el-row>
    </div>
    <div style="margin-top: 5px;">
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
import { Toast } from 'mint-ui'
//import '../../assets/dist/css/mui.css'
export default {
  data () {
    return {
      condition:'',
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
    // 搜索
    search(){
      if (this.condition == ''){
        this.getParkInfo();
        return;
      }
      this.$axios.get('/api/pps/searchUserPark',
          {
            params:{'type':'all','parkcity':this.condition,'userid':sessionStorage.getItem('userId')}
          }).then((res)=>{
          if (res.data.status === 'FAIL'){
            Toast(res.data.message);
          }else{
            if (res.data.length == 0){
              Toast('没有搜索到匹配的结果！');
            }
            this.parkInfo = res.data;
          }
        
        }).catch((err)=>{
          throw err;
        });
    },
    showDetails(item){
      console.log(item);
      sessionStorage.setItem('parkDetailsData',JSON.stringify(item));
      this.$router.push('/details');
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
.search-input {
    margin: 10px 0px;
    width: 75%;
    float: right;
  }
</style>
