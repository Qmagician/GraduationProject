<template>
	<div>
		<mt-header fixed title="车位详情">
			<router-link to="/find" slot="left">
				<mt-button icon="back">返回</mt-button>
			</router-link>
		</mt-header>
		<div style="margin-top: 45px;">
			<el-row>
				<el-col style="width: 94%; margin-left: 3%;">
					<el-card style="width: 100%">
						<img :src="require('../../../server/'+parkDetails.imageurl)" height="250" width="100%" class="image">
						<div style="padding: 14px;">
							<el-row>
		            <el-col :span="8" class="item-title">市区：</el-col>
		            <el-col :span="16" class="item-text" >{{parkDetails.parkcity}}</el-col>
		          </el-row>
		          <hr style="border : 0.5px dashed gray;"/>
		          <el-row>
		            <el-col :span="8" class="item-title">街道：</el-col>
		            <el-col :span="16" class="item-text" >{{parkDetails.parkstreet}}</el-col>
		          </el-row>
		          <hr style="border : 0.5px dashed gray;"/>
		          <el-row>
		            <el-col :span="8" class="item-title">详细地址：</el-col>
		            <el-col :span="16" class="item-text" >{{parkDetails.parkdetails}}{{parkDetails.carseatnum}}号车位</el-col>
		          </el-row>
		          <hr style="border : 0.5px dashed gray;"/>
		          <el-row>
		            <el-col :span="8" class="item-title">开始时间：</el-col>
		            <el-col :span="16" class="item-text" >{{changeTime(parkDetails.starttime)}}</el-col>
		          </el-row>
		          <hr style="border : 0.5px dashed gray;"/>
		          <el-row>
		            <el-col :span="8" class="item-title">结束时间：</el-col>
		            <el-col :span="16" class="item-text" >{{changeTime(parkDetails.endtime)}}</el-col>
		          </el-row>
		          <hr style="border : 0.5px dashed gray;"/>
							<el-row>
		            <el-col :span="8" class="item-title">价格：</el-col>
		            <el-col :span="16" class="item-text" >{{parkDetails.price}}元 / 小时</el-col>
		          </el-row>
		          <hr style="border : 0.5px dashed gray;"/>
		          <el-row>
		            <el-col :span="8" class="item-title">车位所属：</el-col>
		            <el-col :span="16" class="item-text" >{{parkDetails.username}}</el-col>
		          </el-row>
		          <hr style="border : 0.5px dashed gray;"/>
		          <el-row>
		            <el-col :span="8" class="item-title">电话：</el-col>
		            <el-col :span="16" class="item-text" >{{parkDetails.phone}}</el-col>
		          </el-row>
		          <hr style="border : 0.5px dashed gray;"/>
		          <div style="margin-top:10px;">
			          <el-button size="small" class="operate-btn" type="primary" @click="dialogVisible = true">预约</el-button>
			          <el-button size="small" class="operate-btn" type="primary" @click="phoneCall">电话</el-button>
			          <el-button size="small" class="operate-btn" type="primary" @click="searchMap">位置</el-button>
			        </div>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
		<el-dialog title="提示" :visible.sync="dialogVisible" width="70%" >
      <div>确定预约该车位吗？到时后将产生
        <span style="font-weight: bold;color: orange;">{{parkDetails.totalcost}}</span>
        元的费用。
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submitReserve">确定</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
import {changeStrToDate} from '../../assets/js/common.js'
import { Toast } from 'mint-ui'
export default {
  data() {
    return {
      parkDetails:{
        imageurl:'images/nopicture.png',
      },
      dialogVisible:false,
    };
  },
  methods: {
  	// 时间转换
    changeTime(time){
      let tempTime = changeStrToDate(time);
      return tempTime;
    },
    // 车位位置显示
    searchMap(){
    	sessionStorage.setItem('searchValue',this.parkDetails.parkcity+this.parkDetails.parkstreet+this.parkDetails.parkdetails);
    	this.$router.push({path:'/searchmap',query: {perPage: '/details'}});
    },
    // 预约车位
    submitReserve(){
    	this.$axios.get('/api/pps/reservePark',
    	{
    		params:{num:this.parkDetails.num,userid:sessionStorage.getItem('userId')}
    	}).then((res)=>{
    		Toast(res.data.message);
    	}).catch((err)=>{
    		throw err;
    	});
    	this.dialogVisible = false;
    	sessionStorage.setItem("page","reserved");
    	this.$router.push('/myreserve');
    },
    // 打电话
    phoneCall(){
    	window.location.href = 'tel:'+this.parkDetails.phone;
    },
  },
  mounted() {
  	this.parkDetails = JSON.parse(sessionStorage.getItem('parkDetailsData'));
  },
}
</script>


<style lang="stylus" scoped>
  .time {
    font-size: 13px;
    color: #999;
  }
   .item-title {
    text-align: right;
  }
  .item-text {
    text-align: left;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
	.operate-btn {
    float: right; 
    margin:0px 0px 10px 5px;
  }
  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>