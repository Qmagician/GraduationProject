<template>
  <div >
    <mt-header title="个人车位租赁系统"></mt-header>
      <div id="container"></div>
      <div id="tip"></div>
      <div id="panel" class="panel"></div>
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
    getLatAndLng(){
      let THIS = this;
      let mapObj = new AMap.Map('container');
      mapObj.plugin('AMap.Geolocation', function () {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 50),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          buttonPosition:'RB'
            /*enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,        //显示定位按钮，默认：true
            buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 50),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy:true */     //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', THIS.onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', THIS.onError);      //返回定位出错信息
      });
    },
    onComplete(data) {
      var str=['定位成功'];
        str.push('经度：' + data.position.getLng());
        str.push('纬度：' + data.position.getLat());
        if(data.accuracy){
             str.push('精度：' + data.accuracy + ' 米');
        }//如为IP精确定位结果则没有精度信息
        str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
        document.getElementById('tip').innerHTML = str.join('<br>');
    },
    onError(data) {
      document.getElementById('tip').innerHTML = '定位失败';
    },
    loadmap(){
      var map = new AMap.Map("container", {
        resizeEnable: true
      });
      map.plugin('AMap.Geolocation', function () {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 50),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          buttonPosition:'RB',
          showCircle: false, 
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function(status,result){
          AMap.service(["AMap.PlaceSearch"], function() {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 5,
                type: '停车场',
                pageIndex: 1,
                //city: "010", //城市
                map: map,
                panel: "panel"
            });
            
            var cpoint = [result.position.lng, result.position.lat]; //中心点坐标
            placeSearch.searchNearBy('', cpoint, 200, function(status, result) {

            });
          });
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
<style scoped>
h3 {
  font-weight: normal;
}
.panel{
  position: fixed;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 280px;
  border-bottom: solid 1px silver;
}
/* .map-style {
width: 100%;
position: absolute;
top: 0px;
bottom: 0px;
left: 0px;
} */
</style>
