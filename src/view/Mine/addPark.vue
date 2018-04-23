<template>
	<div class="add-parkinfo">
		<mt-header fixed :title="parkTitle">
			<router-link to="/mine" slot="left">
				<mt-button icon="back">返回</mt-button>
			</router-link>
		</mt-header>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm" style="margin-left: 3%;width: 94%;">
      
      <div class="address-style">
        <label>车位地址</label>
        <mt-cell title="省市区" :value="ruleForm.areaString" is-link @click.native="handlerArea" ></mt-cell>
        <mt-cell title="街道" :value="ruleForm.streetString" is-link @click.native="handlerStreet" ></mt-cell>
        <mt-popup v-model="areaVisible" class="area-class" position="bottom">
          <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
        </mt-popup>
        <mt-popup v-model="streetVisible" class="area-class" position="bottom">
          <mt-picker :slots="slotstree" @change="onStreeChange"></mt-picker>
        </mt-popup>
      </div>

			<el-form-item label="详细地址" prop="detailAddr">
				<el-input type="textarea" v-model="ruleForm.detailAddr"></el-input>
			</el-form-item>
			<el-form-item label="开始时间" prop="time1">
				<el-date-picker :editable='false' v-model="ruleForm.time1" type="datetime" :picker-options='datePicker' placeholder="选择日期时间" style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间" prop="time2">
				<el-date-picker :editable='false' v-model="ruleForm.time2" type="datetime" :picker-options='datePicker' placeholder="选择日期时间" style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item label="价格" prop="price">
				<el-input v-model.number="ruleForm.price" clearable><span slot="append">元 / 小时</span></el-input>
			</el-form-item>
			<el-form-item label="车位照片" prop="imageUrl">
				<el-upload class="avatar-uploader" multiple action="http://192.168.88.111:8888/api/pps/uploadImage" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
  			<img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
  			<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<div class="ruleform-btn">
					<el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
				</div>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import data from '../../assets/data/data2.json'
  import { Toast } from 'mint-ui'
  import {getFullFormatDate} from '../../assets/js/common.js'
  var index = 0
  var index2 = 0
  var index3 = 0
  // 初始化省
  let province = Object.keys(data)
  // 初始化市
  let _y = Object.values(data)
  let _m = _y.map(res => {
    return Object.keys(res)
  })
  let city = _m[index]
  // 初始化区
  let _c = Object.values(data)
  _c = _c.map(res => {
    return Object.values(res)
  })
  let __d = Object.values(_c[index])
  let area = Object.keys(__d[index])
  // 初始化街
  let __a = Object.values(__d[0])
  let street = __a[0]
	export default {
    data() {
      return {
        // 操作类型（新增还是编辑）
        operateType: sessionStorage.getItem('operateType'),
        parkTitle:'',
        // 省市街道是否可见
        areaVisible: false,
        streetVisible: false,
        // 内容分发,实时变动市区值
        slots: [{
          flex: 1,
          values: province,
          className: 'slot1',
          textAlign: 'left'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: city,
          className: 'slot3',
          textAlign: 'left'
        }, {
          divider: true,
          content: '-',
          className: 'slot4'
        }, {
          flex: 1,
          values: area,
          className: 'slot5',
          textAlign: 'left'
        }],
        slotstree: [{
          flex: 1,
          values: street,
          className: 'slot1',
          textAlign: 'center'
        }],
        // 数据表单（插入数据库的值）
        ruleForm: {
          num:'',
          userid: sessionStorage.getItem('userId'),
          areaString: '请选择',
          streetString: '请选择',
          detailAddr:'',
          // 记录开始和结束时间值
          time1:'',
          time2:'',
          starttime:'',
          endtime:'',
          price: '',
          imageUrl: '',
          status:0,
          fileData:'',
        },
        datePicker: { //时间控件维保日期时间限制
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7 ;
          }
        },
        // 校验规则
        rules: {
          detailAddr: [
            { required: true, message: '请填写详细地址', trigger: 'blur' },
            { min: 0, max: 1024, message: '长度在 0 到 1024 个字符', trigger: 'blur' }
          ],
          time1: [
            { required: true, message: '请选择日期时间', trigger: 'blur' }
          ],
          time2: [
            { required: true, message: '请选择日期时间', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请填写价格', trigger: 'blur' },
            { type: 'number', message: '价格必须为数字值' }
          ]
        }
      };
    },
    methods: {
      // 显示市区选择
      handlerArea() {
        this.areaVisible = true
      },
      // 判断是否有街道可选
      handlerStreet() {
        if (this.slotstree[0].values.length === 0) {
          this.ruleForm.streetString = '无可选街道'
          return
        }
        this.streetVisible = true
      },
      // 获取市区值
      onValuesChange(picker, values) {
        index = province.indexOf(values[0])
        index2 = _m[index].indexOf(values[1])
        if (index >= 0) {
          picker.setSlotValues(1, _m[index])
        }
        if (index >= 0 && index2 >= 0) {
          let __d = Object.values(_c[index])
          let area = Object.keys(__d[index2])
          index3 = area.indexOf(values[2])
          picker.setSlotValues(2, area)
          this.ruleForm.areaString = values.join(',')
          if (index3 >= 0) {
            let __a = Object.values(__d[index2])
            let street = __a[index3]
            this.slotstree[0].values = street
          } else {
            this.$set(this.slotstree[0].values, [])
            this.ruleForm.streetString = '无可选街道'
          }
        }
      },
      // 获取街道值
      onStreeChange(picker, values) {
        this.ruleForm.streetString = values.join(',')
      },
      // 图片上传成功
      handleAvatarSuccess(res, file) {
        this.ruleForm.imageUrl = URL.createObjectURL(file.raw);
        this.ruleForm.fileData = file;
     },
      // 在图片上传之前
      beforeAvatarUpload(file) {
        //const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        /*if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }*/
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
        //return isJPG && isLt2M;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.startTime = getFullFormatDate(new Date(this.ruleForm.time1));
            this.ruleForm.endTime = getFullFormatDate(new Date(this.ruleForm.time2));
            delete this.ruleForm.time1;
            delete this.ruleForm.time2;
            let api = this.operateType == 'add' ? '/api/pps/addParkInfo' : '/api/pps/editParkInfo';
            this.$axios.get(api,{params:this.ruleForm}).then((res)=>{
                Toast(res.data.message);
                if (res.data.status === 'SUCCESS'){
                  this.$router.push('/mine');
                }
            }).catch((err)=>{
              throw err;
            });

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted(){
      this.parkTitle = '添加个人车位';
      if (this.operateType == 'edit'){
        this.parkTitle = '编辑个人车位';
        let parkInfoData = JSON.parse(sessionStorage.getItem('parkInfoData'));
        this.ruleForm.num = parkInfoData.num;
        this.ruleForm.areaString = parkInfoData.parkcity;
        this.ruleForm.streetString = parkInfoData.parkstreet;
        this.ruleForm.detailAddr = parkInfoData.parkdetails;
        this.ruleForm.time1 = parkInfoData.starttime;
        this.ruleForm.time2 = parkInfoData.endtime;
        this.ruleForm.price = parkInfoData.price;
        this.ruleForm.imageUrl = parkInfoData.imageurl;
      }
    },
  }
</script>

<style lang='stylus' scoped>
.demo-ruleForm {
	margin-top: 45px;
  .address-style {
    border:1px solid #67c23a; 
    border-radius: 5px; 
    margin-bottom: 22px;
  }
  .area-class {
    width: 100%;
    height: 50%;
  }
	.avatar-uploader .el-upload {
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader-icon {
		border: 1px dashed #d9d9d9;
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
  .ruleform-btn {
    margin-left: -80px;
  }
}
</style>