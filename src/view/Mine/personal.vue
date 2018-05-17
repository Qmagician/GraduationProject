<template>
  <div>
    <mt-header fixed title="个人车位租赁系统"></mt-header>
    <div class="headImage" style="margin-top: 45px;">
      <el-upload class="avatar-uploader" multiple name="headImage" action="http://192.168.6.228:8888/api/pps/uploadHeadImage" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :data="userInfo">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <span>我的头像</span>
    <div class="personal-item" style="width: 94%;margin-left: 3%;margin-top: 40px;">
      <mt-cell :title="myPark" to="/mine" is-link>
        <span v-if="toBeReserve">待确认</span>
        <mt-badge type="error" style="margin-right: 10px;" v-if="toBeReserve">{{toBeReserve}}</mt-badge>
        <img slot="icon" src="../../assets/myPark.jpg" width="45" height="45" style="float: left;">
      </mt-cell>
      <mt-cell :title="balance">
        <el-button type="primary">充值</el-button>
        <img slot="icon" src="../../assets/yue.jpg" width="45" height="45" style="float: left;">
      </mt-cell>
      <mt-cell ></mt-cell>
      <div >
        <mt-button type="danger" style="width: 100%;margin-top: 30px;" @click="exitPark">退出登录</mt-button>
      </div>
    </div>
    
    
    
    <v-bottom></v-bottom>
  </div>
</template>

<script>
import Buttom from '@/components/bottom'
import { Cell, Toast, Badge } from 'mint-ui';

export default {
  
  data () {
    return {
      imageUrl: require('../../assets/user.png'),
      myPark:'我的车位：0',
      toBeReserve:'',
      balance:'我的余额：0元',
      userInfo:{},
      updateType:'IMAGE',
      updateValue:'',
    }
  },
  methods: {
    // 头像成功上传
    handleAvatarSuccess(res, file) {
      if (res.status == 'SUCCESS'){
        this.updateValue = res.imageUrl.replace(/\\/g,"/");
        this.updateType = 'IMAGE';
        this.updateUserInfo();
      }else{
        Toast(res.message);
      }
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 头像上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'||'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 获取车位总数
    getParkTotal(){
      this.$axios.get('/api/pps/getUserPark',
        {
          params:{'module':'MINE','userid':sessionStorage.getItem('userId')}
        }).then((res)=>{
        if (res.data.status === 'FAIL'){
          Toast(res.data.message);
        }else{
          this.myPark = "我的车位："+res.data.length;
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
          this.toBeReserve = res.data[0].num;
        }
      
      }).catch((err)=>{
        throw err;
      });
    },
    // 更新用户信息
    updateUserInfo(){
      this.$axios.get('/api/pps/updateUserInfo',{
        params:{'updateType':this.updateType,'updateValue':this.updateValue,'userId':sessionStorage.getItem('userId')}
      }).then((res)=>{
        if (res.data.status == 'SUCCESS' && this.updateType == 'IMAGE'){
          this.userInfo.headimg = this.updateValue
          sessionStorage.setItem('userInfoData',JSON.stringify(this.userInfo));
        }
        Toast(res.data.message);
      }).catch((err)=>{
        throw err;
      });
    },
    exitPark(){
      this.$router.push('/');
    }
  },
  mounted(){
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfoData'));
    if (this.userInfo.headimg){
      this.imageUrl = require('../../../server/'+this.userInfo.headimg);
    }
    this.getParkTotal();
    this.getToBeReserve();
    this.balance = "我的余额："+this.userInfo.balance+"元";
  },
  components:{
    'v-bottom':Buttom,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang='stylus' scoped>
  
</style>
