<template>
  <div style="position: relative;">
    <mt-header fixed title="个人车位租赁系统"></mt-header>
    <div style="margin-top: 40px; height: 40px;">
      <el-row>
        <el-button size="small" type="primary" style="margin: 10px 10px; float: left;" @click="addPark">新增</el-button>
        <el-button size="small" type="primary" style="margin: 10px 10px 10px 0px; float: right;" @click="search">搜索</el-button>
        <el-input size="small" style="margin: 10px 0px;float: right;width: 50%;" placeholder="市区" v-model="condition" clearable></el-input>
      </el-row>
    </div>
    <div style="margin-top: 20px;"> 
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
export default {
  data () {
    return {
      parkInfo:[],
      condition:''
    }
  },
  methods:{
    // 获取车位信息
    getUserParkInfo(){
      this.$axios.get('/api/pps/getUserPark',
          {
            params:{'userid':sessionStorage.getItem('userId')}
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
    addPark(){
      this.$router.push('/addPark');
    },
    search(){
      if (this.condition == ''){
        Toast('请先填写搜索条件！');
        return;
      }
      this.$axios.get('/api/pps/searchUserPark',
          {
            params:{'parkcity':this.condition,'userid':sessionStorage.getItem('userId')}
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
      //this.getUserParkInfo({'condition':"parkcity like '%"+this.condition+"%'"});
    },
    showDetails(item){
      console.log(item);
    },
  },
  mounted() {
    this.getUserParkInfo();
  },
  components:{
    'v-bottom':Buttom,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="../../assets/dist/css/mui.css">
</style>
