<template>

  <div class="home-style">

      <mt-header fixed title="个人车位租赁系统"></mt-header>
      <div id="container"></div>
      <div id="tip" style="margin-top: 45px;">
        <input type="text" id="keyword" name="keyword" value="请输入关键字：(选定后搜索)"/>
      </div>
      <!-- <div id="tip"></div> -->
      <!-- <div id="panel" class="panel"></div> -->
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
      msg: '欢迎来到个人车位租赁系统',
    }
  },
  methods: {
    loadmap(){
      var map = new AMap.Map("container", {
        resizeEnable: true
      });
      map.plugin('AMap.Geolocation', function () {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：无穷大
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
                //city: "010", //城市
                map: map,
                // panel: "panel"
            });
            
            let cpoint = [result.position.lng, result.position.lat]; //中心点坐标
            placeSearch.searchNearBy('', cpoint, 200, function(status, result) {

            });
          });
        });
      });
      
      AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
        let autoOptions = {
          //city: "北京", //城市，默认全国
          input: "keyword"//使用联想输入的input的id
        };
        let autocomplete= new AMap.Autocomplete(autoOptions);
        let placeSearch = new AMap.PlaceSearch({
          //city:'北京',
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
  },
  mounted(){
    //this.getLatAndLng();
    this.loadmap();     //加载地图和相关组件
  },
  components:{
    'v-bottom':Buttom,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang='stylus' scoped>

h3 {
  font-weight: normal;
}
.panel{
  position: fixed;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 40px;
  right: 10px;
  width: 280px;
  border-bottom: solid 1px silver;
}
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
