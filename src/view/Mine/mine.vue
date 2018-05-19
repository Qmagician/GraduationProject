<template>
  <div class="mine-style">
    <mt-header fixed title="我的车位">
      <router-link to="/personal" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    
    <div class="add-search-style">
      <el-row>
        <el-button size="small" type="primary" class="add-btn" @click="addPark">新增</el-button>
        <el-input size="small" class="search-input" placeholder="市区 / 街道" v-model="condition" clearable>
          <el-button size="small"  slot="append" @click="search">搜索</el-button>
        </el-input>
      </el-row>
    </div>

    <div class="clearfix" style="margin-bottom: 55px;"> 

      <el-card class="body-card" :class="cardHeader(item)" v-for="(item,index) in parkInfo" :key="index">
        <div slot="header" style="height: 20px;">
          <span style="float: left;color:#f0f0f0;">{{item.parkcity}}</span>
        </div>
        <div class="text item">
          <el-col :span="10" >
            <!-- <img :src="getImage(item.imageurl)" height="100px" width="100px"  /> -->
            <img :src="require('../../../server/'+item.imageurl)" height="100px" width="100px" v-if="item.imageurl" />
            <img src='../../assets/nopicture.png' height="100px" width="100px" v-else />
          </el-col>
          <el-col :span="14">
            <el-row>
              <el-col :span="10" class="item-title">街道：</el-col>
              <el-col :span="14" class="item-text">{{item.parkstreet}}</el-col>
            </el-row>
            <hr />
            <el-row>
              <el-col :span="10" class="item-title">状态：</el-col>
              <el-col :span="7" class="item-status" style="background-color: #ef4f4f;" v-if="item.status=='0' && expireIs(item)">
                <div>已过期</div>
              </el-col>
              <el-col :span="7" class="item-status" style="background-color: #989393;" v-if="item.status=='0' && !expireIs(item)">
                <div>{{changeStatus(item.status)}}</div>
              </el-col>
              <el-col :span="7" class="item-status" style="background-color: #ff8331;" v-if="item.status=='1'">
                <div>{{changeStatus(item.status)}}</div>
              </el-col>
              <el-col :span="7" class="item-status" style="background-color: #2CB381;" v-if="item.status=='2'">
                <div>{{changeStatus(item.status)}}</div>
              </el-col>
            </el-row>
            <hr />
            <el-row>
              <el-col :span="10" class="item-title">价格：</el-col>
              <el-col :span="14" class="item-text">{{item.price}}元 / 小时</el-col>
            </el-row>
            <hr />
          </el-col>
        </div>
        <el-col>
          <el-row>
            <el-col :span="10" class="item-title">开始时间：</el-col>
            <el-col :span="14" class="item-text" >{{changeTime(item.starttime)}}</el-col>
          </el-row>
          <hr />
          <el-row>
            <el-col :span="10" class="item-title">结束时间：</el-col>
            <el-col :span="14" class="item-text" >{{changeTime(item.endtime)}}</el-col>
          </el-row>
          <hr />
          <el-row>
            <el-col :span="10" class="item-title">详细地址：</el-col>
            <el-col :span="14" class="item-text" >{{item.parkdetails}}{{item.carseatnum}}号车位</el-col>
          </el-row>
          <hr />
        </el-col>
        <div style="margin-top:10px;" v-if="item.status=='0'">
          <el-button size="small" class="operate-btn" type="primary" @click="deleteInfo(item)">删除</el-button>
          <el-button size="small" class="operate-btn" type="primary" @click="editInfo(item)">编辑</el-button>
        </div>
        <div style="margin-top:10px;" v-if="item.status=='1'">
          <el-button size="small" class="operate-btn" type="primary" @click="reject(item)">拒绝</el-button>
          <el-button size="small" class="operate-btn" type="primary" @click="agreement(item)">同意</el-button>
        </div>
        <div style="margin-top:10px;" v-if="item.status=='1' || item.status=='2'">
          <el-button size="small" class="operate-btn" type="primary" @click="dialogShow(item)">预约者</el-button>
        </div>
        <el-button size="small" class="operate-btn" type="primary" @click="searchMap(item)">位置</el-button>
      </el-card>

    </div>

    <el-dialog title="预约者信息" :visible.sync="dialogVisible" width="70%" >
      <div>姓名：{{name}}</div>
      <div>tel：{{phone}}</div>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="phoneCall">打电话</el-button>
      </span>
    </el-dialog>

    <v-bottom></v-bottom>
  </div>
</template>
<script>
import Buttom from '@/components/bottom'
import { Toast } from 'mint-ui'
import { MessageBox } from 'mint-ui'
import {changeStrToDate, getFullFormatDate} from '../../assets/js/common.js'
export default {
  data () {
    return {
      parkInfo:[],
      condition:'',
      dialogVisible:false,
      name:'',
      phone:'',
    }
  },
  methods:{
    cardHeader(item){
      if (item.status == 0){
        if (item.endtime < getFullFormatDate(new Date())){
          return 'expired';
        }else{
          return 'to-be-reserved ';
        }
      }else if (item.status == 1){
        return 'to-be-confirmed';
      }else {
        return 'reserved';
      }
    },
    getImage(imageUrl){
      let THIS = this;
      this.$axios.get('/api/pps/getImage',{
        params:{'imageUrl':imageUrl}
      }).then((res) => {
        var binaryData = [];
        binaryData.push(res.data);
        let imgSrc = window.URL.createObjectURL(new Blob(binaryData, {type: "image/jpeg/png"}));
        // var img = document.createElement('img');
        // img.src = window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}));
        // img.height = 60;
        // img.onload = function() {
        //     window.URL.revokeObjectURL(this.src);
        // }
        //this.$refs.imageRef.src=img.src;
        console.log(imgSrc);
        return imgSrc;
        
        //return require('../../assets/nopicture.png');
        // if(res.data.status == 'SUCCESS'){
        //   return res.imageUrl;
        // }else{
        //   return require('../../assets/nopicture.png');
        // }
      }).catch((err) => {
        throw err;
      })
    },
    // 获取车位信息
    getUserParkInfo(){
      this.$axios.get('/api/pps/getUserPark',
        {
          params:{'module':'MINE','userid':sessionStorage.getItem('userId')}
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
    // 车位地理位置
     searchMap(item){
      sessionStorage.setItem('searchValue',item.parkcity+item.parkstreet+item.parkdetails);
      this.$router.push({path:'/searchmap',query: {perPage: '/mine'}});
    },
    // 跳转到新增页面
    addPark(){
      sessionStorage.setItem('operateType','add');
      this.$router.push('/addPark');
    },
    // 搜索
    search(){
      if (this.condition == ''){
        this.getUserParkInfo();
        return;
      }
      this.$axios.get('/api/pps/searchUserPark',
          {
            params:{'section':'MINE','parkcity':this.condition,'userid':sessionStorage.getItem('userId')}
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
    expireIs(item){
      let nowDate = getFullFormatDate(new Date());
      if (item.endtime < nowDate){
        return true;
      }else{
        return false;
      }
    },
    // 状态转换
    changeStatus(value){
      switch(value){
        case 0: return '待预约';break;
        case 1: return '待确认';break;
        case 2: return '已出租';break;
        default:;
      }
    },
    // 时间转换
    changeTime(time){
      let tempTime = changeStrToDate(time);
      return tempTime;
    },
    // 删除
    deleteInfo(item){
      MessageBox.confirm('确定要删除该车位信息?').then(action => {
        this.$axios.get('/api/pps/deleteParkInfo',
        {
          params:{'num':item.num,'imageurl':item.imageurl}
        }).then((res)=>{ 
          Toast(res.data.message);
        }).catch((err)=>{
          throw err;
        });
        this.getUserParkInfo();
      }).catch(()=>{});
    },
    // 编辑
    editInfo(item){
      sessionStorage.setItem('operateType','edit');
      sessionStorage.setItem('parkInfoData',JSON.stringify(item));
      this.$router.push('/addPark');
    },
    // 拒绝
    reject(item){
      this.$axios.get('/api/pps/rejectOrder',
      {
        params:{'num':item.num}
      }).then((res)=>{ 
        Toast(res.data.message);
      }).catch((err)=>{
        throw err;
      });
      this.getUserParkInfo();
    },
    // 同意
    agreement(item){
      this.$axios.get('/api/pps/agreeOrder',
      {
        params:{'num':item.num}
      }).then((res)=>{
        /*if (res.data.status == 'SUCCESS'){
          item.balance = parseInt(item.balance)-parseInt(item.totalcost);
        }*/
        Toast(res.data.message);
      }).catch((err)=>{
        throw err;
      });
      this.getUserParkInfo();
    },
    // 预约者信息弹窗
    dialogShow(item){
      this.name = item.username;
      this.phone = item.phone;
      this.dialogVisible = true;
    },
    // 打电话
    phoneCall(){
      this.dialogVisible = false;
      window.location.href = 'tel:'+this.phone;
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
<style lang="stylus" scoped >
.add-search-style {
  margin-top: 40px;
  margin-left: 3%; 
  width: 94%;
  height: 40px;
  .add-btn {
    margin: 10px 0px; float: left;
  }
  .search-input {
    margin: 10px 0px;
    width: 75%;
    float: right;
  }
}
.body-card {
  width: 94%;
  margin-left: 3%;
  margin-top: 10px;
  .item-title {
    text-align: right;
  }
  .item-text {
    text-align: left;
  }
  .item-status {
    text-align: center;
    border-radius: 3px;
    div {
      color:#f0f0f0;
    }
  }
  hr {
    border : 0.5px dashed gray;
  }
  .operate-btn {
    float: right; 
    margin:0px 0px 10px 5px;
  }
}
.text {
  font-size: 14px;
}
.clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
.item {
  margin-bottom: 10px;
}
</style>
