<template>

  <div class="hello">
  
    
    <mt-header fixed title="个人车位租赁系统"><div><a name="top" ></a></div></mt-header>

    <div style="margin-top: 45px;width: 94%;margin-left: 3%">

      <el-row>

        <el-input size="small" class="search-input" placeholder="市区 / 街道" v-model="condition" clearable>
          <el-button size="small"  slot="append" @click="search">搜索</el-button>
        </el-input>
        <!-- <span style="padding-top: 5px;height: 40px;width: 6%;font-size: 12px" @click="showTimeSelect">更多</span> -->
        <img :src="moreIcon" style="padding-top: 15px;height: 18px;width: 8%" @click="showTimeSelect">
      </el-row>
      <el-collapse-transition>
        <div v-if="!moreIconFlag">
          <el-row>
            <label style="width: 20%;">开始时间：</label>
            <el-date-picker :editable='false' v-model="startTime" type="datetime"  placeholder="选择日期时间" style="width: 70%;"></el-date-picker>
          </el-row>
          <el-row style="padding-top: 10px;">
            <label style="width: 20%;">结束时间：</label>
            <el-date-picker :editable='false' v-model="endTime" type="datetime"  placeholder="选择日期时间" style="width: 70%;"></el-date-picker>
          </el-row>
        </div>
      </el-collapse-transition>
    </div>
    <div style="margin-top: 5px;">
    <ul class="list-style" style="list-style: none;padding-left: 3%;">
      <li class="item-stle" style="width: 100%;height: 70px;padding-bottom: 10px;" v-for="(item, index) in parkInfo">
        <a href="javascript:void(0)" @click.stop="showDetails(item)" style="text-decoration: none;">
          <img class="img-style" style="float: left;height: 70px;width: 70px;" :src="require('../../../server/'+item.imageurl)">
          <div class="content-style">
            <span style="text-align: left;">{{item.parkcity}}:{{item.parkstreet}}</span>
            <p style="margin: 5px;">{{changeTime(item.starttime)}}—{{changeTime(item.endtime)}}</p>
          </div>
        </a>
      </li>
    </ul>
    </div>
    <div style="margin-bottom: 55px;" v-if="anchorShow"><a href="#top" >返回顶部</a></div>
    
    <!--分页-->
    <!-- <div class="block" style="margin-bottom: 55px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage2"
        :page-sizes="[20, 40, 60, 80, 100]"
        :page-size="20"
        layout="sizes, total, prev, pager, next"
        :total="80">
      </el-pagination>
    </div> -->
    <!-- <div style="margin-top: 5px;">
    <ul class="mui-table-view mui-table-view-chevron">
      <li class="mui-table-view-cell mui-media" v-for="(item, index) in parkInfo">
        <a class="mui-navigate-right" href="javascript:void(0)" @click.stop="showDetails(item)">
          <img class="mui-media-object mui-pull-left" :src="require('../../../server/'+item.imageurl)">
          <div class="mui-media-body">
            <span style="text-align: left;">{{item.parkcity}}:{{item.parkstreet}}</span>
            <p class='mui-ellipsis'>{{changeTime(item.starttime)}}—{{changeTime(item.endtime)}}</p>
          </div>
        </a>
      </li>
    </ul>
    </div> -->
    <v-bottom></v-bottom>
  </div>
</template>

<script>
import Buttom from '@/components/bottom'
import { Toast } from 'mint-ui'
import {changeStrToDate, getFullFormatDate} from '../../assets/js/common.js'
//import '../../assets/dist/css/mui.css'
export default {
  data () {
    return {
      anchorShow:false,
      currentPage2:1,
      pagLayout:'total, prev, pager, next',
      moreIconFlag:true,
      moreIcon:require('../../assets/unfold.png'),
      startTime:'',
      endTime:'',
      condition:'',
      parkInfo:[],
    }
  },
  methods:{
    /*handleSizeChange(val){

    },
    handleCurrentChange(val){

    },
    parseNumber(number){
        return parseInt(number)
      },*/
    showTimeSelect(){
      if (this.moreIconFlag){
        this.moreIconFlag = false;
        this.moreIcon = require('../../assets/packup.png');
      }else{
        this.moreIconFlag = true;
        this.moreIcon = require('../../assets/unfold.png');
        this.startTime = '';
        this.endTime = '';
      }
      
    },
    // 获取车位信息
    getParkInfo(){
      let nowTime = getFullFormatDate(new Date());
      this.$axios.get('/api/pps/getImagesList',
          {
            params:{'userid':sessionStorage.getItem('userId'),'nowTime':nowTime}
          }).then((res)=>{
          if (res.data.status === 'FAIL'){
            Toast(res.data.message);
          }else{
            this.parkInfo = res.data;
            if(res.data.length >= 7){
              this.anchorShow = true;
            }
          }
        
        }).catch((err)=>{
          throw err;
        });

    },
    // 时间转换
    changeTime(time){
      let tempTime = changeStrToDate(time);
      return tempTime;
    },
    // 搜索
    search(){
      let t1 = '';
      let t2 = '';
      let time1 = '';
      let time2 = '';
      if (this.condition == '' && this.startTime == '' && this.endTime == ''){
        t1 = '';
        t2 = '';
        this.getParkInfo();
        return;
      }
      if ((this.startTime > this.endTime) || (this.startTime == '' && this.endTime != '') || (this.startTime != '' && this.endTime == '')){
        Toast("请正确选择时间范围");
        return;
      }
      if (this.startTime != '' && this.endTime != ''){
        t1 = new Date(this.startTime);
        t2 = new Date(this.endTime);
        time1 = getFullFormatDate(t1);
        time2 = getFullFormatDate(t2);
      }
      
      this.$axios.get('/api/pps/searchUserPark',
          {
            params:{
              'section':'FIND',
              'parkcity':this.condition,
              'startTime':time1,
              'endTime':time2,
              'userid':sessionStorage.getItem('userId'),
            }
          }).then((res)=>{
            console.log(res);
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
<style lang='stylus' scoped >
.toolbar{
  margin-bottom: 55px;
}
.search-input {
    margin: 10px 0px;
    width: 90%;
    float: left;
  }
</style>
