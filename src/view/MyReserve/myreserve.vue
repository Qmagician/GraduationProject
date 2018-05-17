<template>
  <div class="mine-style">
    <mt-header fixed title="个人车位租赁系统"></mt-header>
    <div class="add-search-style">
      <el-row>
        <!-- <el-button size="small" type="primary" class="history-btn" @click="reservedHistory">历史记录</el-button> -->
        <el-input size="small" class="search-input" placeholder="市区 / 街道" v-model="condition" clearable>
          <el-button size="small"  slot="append" @click="search">搜索</el-button>
        </el-input>
      </el-row>
    </div>

    <div class="clearfix" style="margin-bottom: 55px;"> 

      <el-card class="body-card" :class="cardHeader(item.status)" v-for="(item,index) in parkInfo" :key="index">
        <div slot="header" style="height: 20px;">
          <span style="float: left;color:#f0f0f0;">{{item.parkcity}}</span>
        </div>
        <div class="text item">
          <el-col :span="10" >
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
              <el-col :span="7" class="item-status" style="background-color: #989393;" v-if="item.status=='0'">
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
        <div style="margin-top:10px;" v-if="item.status=='1' || item.status=='2'">
          <el-button size="small" class="operate-btn" type="primary" @click="dialogShow(item)">所属人</el-button>
          <el-button size="small" class="operate-btn" type="primary" @click="cancelReserve(item)">取消</el-button>
          <el-button size="small" class="operate-btn" type="primary" @click="searchMap(item)">位置</el-button>
        </div>
      </el-card>

    </div>

    <el-dialog title="所属人信息" :visible.sync="dialogVisible" width="70%" >
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
import {changeStrToDate} from '../../assets/js/common.js'
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
    cardHeader(status){
      if (status == 0){
        return 'to-be-reserved ';
      }else if (status == 1){
        return 'to-be-confirmed';
      }else {
        return 'reserved';
      }
    },
    // 获取车位信息
    getReserveParkInfo(){
      this.$axios.get('/api/pps/getUserPark',
          {
            params:{'module':'MYRESERVE','userid':sessionStorage.getItem('userId')}
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
      this.$router.push({path:'/searchmap',query: {perPage: '/myreserve'}});
    },
    // 跳转到新增页面
    reservedHistory(){
      /*sessionStorage.setItem('operateType','add');
      this.$router.push('/addPark');*/
    },
    // 搜索
    search(){
      if (this.condition == ''){
        this.getReserveParkInfo();
        return;
      }
      this.$axios.get('/api/pps/searchUserPark',
          {
            params:{'section':'MYRESERVE','parkcity':this.condition,'userid':sessionStorage.getItem('userId')}
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
    // 状态转换
    changeStatus(value){
      switch(value){
        case 1: return '待确认';break;
        case 2: return '已租用';break;
        default:;
      }
    },
    // 时间转换
    changeTime(time){
      let tempTime = changeStrToDate(time);
      return tempTime;
    },
    // 取消预约
    cancelReserve(item){
      MessageBox.confirm('确定取消该车位的预约吗?').then(action => {
        this.$axios.get('/api/pps/rejectOrder',
        {
          params:{'num':item.num}
        }).then((res)=>{ 
          if (res.data.status === 'SUCCESS'){
            Toast('已成功取消对该车位的预约！');
          }else{
            Toast(res.data.message);
          }
        }).catch((err)=>{
          throw err;
        });
        this.getReserveParkInfo();
      }).catch(()=>{});
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
    this.getReserveParkInfo();
  },
  components:{
    'v-bottom':Buttom,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='stylus' scoped >
.add-search-style {
  margin-top: 40px;
  margin-left: 3%; 
  width: 94%;
  height: 40px;
  .history-btn {
    margin: 10px 0px; float: left;
  }
  .search-input {
    margin: 10px 0px;
    width: 100%;
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
