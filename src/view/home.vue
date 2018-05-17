<template>
  <div class="home-style">
    <mt-header fixed title="个人车位租赁系统"></mt-header>
    <div style="float: left;margin-top: 40px;position: absolute;z-index: 1;" v-if="rentNum||release">
      <img src="../assets/message.png" height="28" width="28" @click="dialogVisible = true">
    </div>
    <div id="container"></div>
    <div id="tip" style="margin-top: 45px;">
      <input type="text" id="keyword" name="keyword" :value="tip"/>
    </div>
    <!--消息提示框-->
    <el-dialog title="消息提醒" :visible.sync="dialogVisible" width="70%" >
      <div v-if="rentNum">
        您有 
        <span style="font-weight: bold;color: orange;" >{{rentNum}}</span> 个租用的车位明天到期，请及时处理
      </div>
      <div v-if="release">
        您有 
        <span style="font-weight: bold;color: orange;">{{release}}</span> 
        个发布的车位已过期，请及时处理
      </div>
      <div v-if="reverse">
        您有 
        <span style="font-weight: bold;color: orange;">{{reverse}}</span> 
        个被预约的车位待确认，请及时处理
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" size="small" @click="goToPage">马上处理</el-button>
      </span>
    </el-dialog>
    <v-bottom></v-bottom>
  </div>
</template>

<script>
import AMap from 'AMap'
import { Toast, MessageBox  } from 'mint-ui'
import Buttom from '@/components/bottom'
import {getFullFormatDate} from '../assets/js/common.js'

export default {
  name: 'home',
  data () {
    return {
      tip:'请输入关键字：(选定后搜索)',
      dialogVisible:false,
      rentNum:0,
      release:0,
      reverse:0,
    }
  },
  methods: {
    loadmap(){
      let THIS = this;
      var map = new AMap.Map("container", {
        resizeEnable: true
      });
      map.plugin('AMap.Geolocation', function () {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 5000,          //超过5秒后停止定位，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 55),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          buttonPosition:'RB',
          showCircle: false, 
        });
        map.addControl(geolocation);

        geolocation.getCurrentPosition(function(status,result){
          AMap.service(["AMap.PlaceSearch"], function() {
            let placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 5,
                type: '停车场',
                pageIndex: 1,
                map: map,
            });
            if (result.info == 'FAILED'){
              MessageBox('提示', '用户禁用了定位权限或浏览器禁止了非安全域的定位请求');
              return;
            }
            THIS.tip = result.formattedAddress;
            let cpoint = [result.position.lng, result.position.lat]; //中心点坐标
            placeSearch.searchNearBy('', cpoint, 200, function(status, result) {

            });
          });
        });
      });
      
      AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
        let autoOptions = {
          input: "keyword"//使用联想输入的input的id
        };
        let autocomplete= new AMap.Autocomplete(autoOptions);
        let placeSearch = new AMap.PlaceSearch({
          type: '停车场',
          map:map
        })
        AMap.event.addListener(autocomplete, "select", function(e){
           //TODO 针对选中的poi实现自己的功能
           placeSearch.setCity(e.poi.adcode);
           placeSearch.search(e.poi.name)
         });
      });
    },
    init(){
      this.getRentNum();
      this.getReleaseNum();
      this.getToBeReserve();
    },
    // 判断是否显示消息提醒框
    judgeTipShow(){
      if ((this.rentNum||this.release||this.reverse) && sessionStorage.getItem('showTimes') === '0'){
        this.dialogVisible = true;
        sessionStorage.setItem('showTimes', '1');
      }
    },
    // 跳转到对应的处理页面
    goToPage(){
      if (this.rentNum){
        sessionStorage.setItem("page","reserved");
        this.$router.push('./myreserve');
      }else{
        sessionStorage.setItem("page","personal");
        this.$router.push('./mine');
      }
    },
    // 获取将要到期的租用车位
    getRentNum(){
      let date1 = new Date();
      let date2 = new Date(date1);
      date2.setDate(date1.getDate() + 1);
      this.$axios.get('/api/pps/getRentNum',
        {
          params:{
            'userId':sessionStorage.getItem('userId'),
            'nowDate':getFullFormatDate(date1),
            'expireDate':getFullFormatDate(date2),
          }
        }).then((res)=>{
        if (res.data.status === 'FAIL'){
          Toast(res.data.message);
        }else{
          this.rentNum = res.data[0].num;
          this.judgeTipShow();
        }
      
      }).catch((err)=>{
        throw err;
      });
    },
    // 获取过期的车位
    getReleaseNum(){
      let newDate = getFullFormatDate(new Date());
      this.$axios.get('/api/pps/getReleaseNum',
        {
          params:{'userId':sessionStorage.getItem('userId'),'nowDate':newDate}
        }).then((res)=>{
        if (res.data.status === 'FAIL'){
          Toast(res.data.message);
        }else{
          this.release = res.data[0].num;
          this.judgeTipShow();
        }
      
      }).catch((err)=>{
        throw err;
      });
    },
    // 获取待确认的数量
    getToBeReserve()
    {
      this.$axios.get('/api/pps/getToBeReserve',
        {
          params:{'userId':sessionStorage.getItem('userId')}
        }).then((res)=>{
        if (res.data.status === 'FAIL'){
          Toast(res.data.message);
        }else{
          this.reverse = res.data[0].num;
          this.judgeTipShow();
        }
      
      }).catch((err)=>{
        throw err;
      });
    },
  },
  mounted(){
    this.loadmap();     //加载地图和相关组件
    this.init();
  },
  components:{
    'v-bottom':Buttom,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="stylus" scoped>

.amap-logo{
  margin-bottom: 55px;
}
#tip {
  background-color: #ddf;
  color: #333;
  border: 1px solid silver;
  box-shadow: 3px 4px 3px 0px silver;
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 5px;
  overflow: hidden;
  line-height: 20px;
}
#tip input[type="text"] {
  height: 25px;
  border: 0;
  padding-left: 5px;
  width: 280px;
  border-radius: 3px;
  outline: none;
}
</style>
