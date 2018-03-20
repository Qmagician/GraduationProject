<template>
  <div>
    <div class="login-wrap" v-show="showLogin">
      <h3>{{msg}}</h3>
      <!-- <p v-show="showTishi">{{tishi}}</p> -->
      <el-col :span="24" style="margin-bottom: 10px;">
        <el-input style="width:250px;" placeholder="请输入用户名" v-model="username" clearable :maxlength="32"></el-input>
      </el-col>
      <el-col :span="24" style="margin-bottom: 10px;">
        <el-input type="password" style="width:250px;" placeholder="请输入密码" v-model="password" clearable :maxlength="16"></el-input>
      </el-col>
      <p v-show="showTishi">{{tishi}}</p>
      <el-col :span="24">
        <el-button style="width:250px;" type="primary" v-on:click="login">登录</el-button>
      </el-col>
      <!-- <button v-on:click="login">登录</button> -->
      <span v-on:click="ToRegister">没有账号？马上注册</span>
    </div>

    <div class="register-wrap" v-show="showRegister">
      <h3>{{msg}}</h3>
      <!-- <p v-show="showTishi">{{tishi}}</p> -->
      <el-col :span="24" style="margin-bottom: 10px;">
        <el-input style="width:250px;" placeholder="请输入用户名" v-model="newUsername" :maxlength="32" clearable></el-input>
      </el-col>
      <el-col :span="24" style="margin-bottom: 10px;">
        <el-input type="password" style="width:250px;" placeholder="请输入密码" v-model="newPassword" :maxlength="16" clearable></el-input>
      </el-col>
      <el-col :span="24" style="margin-bottom: 10px;">
        <el-input style="width:250px;" placeholder="请输入电话号码" v-model="phone" :maxlength="11" clearable></el-input>
      </el-col>
      <p v-show="showTishi">{{tishi}}</p>
      <el-col :span="24">
        <el-button style="width:250px;" type="primary" v-on:click="register">注册</el-button>
      </el-col>
      <span v-on:click="ToLogin">已有账号？马上登录</span>
    </div>
  </div>
</template>

<script>
import {setCookie,getCookie} from '../assets/js/cookie.js'
import { Toast } from 'mint-ui'
import 'mint-ui/lib/style.css'
export default {
  name: 'login',
  data () {
    return {
      msg:'个人车位租赁系统',
      showLogin: true,
      showRegister: false,
      showTishi: false,
      tishi: '',
      username: '',
      password: '',
      newUsername: '',
      newPassword: '',
      phone: ''
    }
  },
  methods:{
    login(){
      let THIS = this;
      if(THIS.username == "" || THIS.password == ""){
        THIS.tishi = "请输入用户名或密码";
        THIS.showTishi = true;
      }else{
        this.$axios.get('/api/pps/login',
          {
            params:{
              'username':THIS.username,
              'password':THIS.password
            }
          }).then((res)=>{
          if (res.data.status === 'FAIL'){
            THIS.tishi = res.data.message;
            THIS.showTishi = true;
          }else{
            Toast('登录成功!');
            setTimeout(function(){
              THIS.$router.push('/home');
            }.bind(THIS),1000);
          }
        
      }).catch((err)=>{
        throw err;
      });
      }
    },
    register(){
      let THIS = this;
      if(THIS.newUsername == "" || THIS.newPassword == "" || THIS.phone == ""){
        THIS.tishi = "请输入完整信息";
        THIS.showTishi = true;
      }else{
        
        this.$axios.get('/api/pps/register',
          {
            params:{
              'username':THIS.newUsername,
              'password':THIS.newPassword,
              'phone': THIS.phone,
            }
          }).then((res)=>{
          if (res.data.status === 'FAIL'){
            THIS.tishi = res.data.message;
            THIS.showTishi = true;
            //Toast(res.data.message);
          }else{
            Toast(res.data.message);
            THIS.ToLogin();
          }
        
        }).catch((err)=>{
          throw err;
        });
      }
    },
    ToRegister(){
      let THIS = this;
      THIS.showRegister = true;
      THIS.showLogin = false;
    },
    ToLogin(){
      let THIS = this;
      THIS.showLogin = true;
      THIS.showRegister = false;
    },
  },
  mounted(){
    /*页面挂载获取cookie,如果存在username的cookie，则跳转到主页，不需要登录*/
    if(getCookie('username')){
      this.$router.push('/home');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login-wrap{text-align:center;}
p{color:red;}
span{cursor:pointer;}
span:hover{color:#41b883;}
</style>
