<template>

  <div>

    <mt-header fixed title="车位位置">
      <router-link :to="{ path: perPage }" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div id="container"></div>
    <div id="tip" style="margin-top: 45px;">
      <input type="text" id="keyword" name="keyword" :value="searchPlace"/>
    </div>
    <!-- <v-bottom></v-bottom> -->
  </div>

</template>

<script>
import AMap from 'AMap'
import Buttom from '@/components/bottom'


export default {
  
  data () {
    return {
      perPage: '',
      searchPlace:'',
    }
  },
  methods: {
    goBack(){
      this.$router.back(-1);
    },
    loadmap(){
      let THIS = this;
      var windowsArr = [];
      var marker = [];
      var map = new AMap.Map("container", {
        resizeEnable: true,
            center: [116.397428, 39.90923],//地图中心点
            zoom: 13,//地图显示的缩放级别
            keyboardEnable: false
          });
      AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
        var autoOptions = {
          //city: "北京", //城市，默认全国
          input: "keyword"//使用联想输入的input的id
        };
        let autocomplete= new AMap.Autocomplete(autoOptions);
        var placeSearch = new AMap.PlaceSearch({
          //city:'北京',
          type: '停车场',
          map:map
        })
        placeSearch.search(THIS.searchPlace);
        AMap.event.addListener(autocomplete, "select", function(e){
           //TODO 针对选中的poi实现自己的功能
           placeSearch.setCity(e.poi.adcode);
           placeSearch.search(e.poi.name)
         });
      });
    }

  },
  mounted(){
    this.searchPlace = sessionStorage.getItem('searchValue');
    this.perPage = this.$route.query.perPage;
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
