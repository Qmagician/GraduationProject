<template>
  <div class="index">
    <mt-header title="添加个人车位">
      <router-link to="/mine" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div style="margin-top:5px;">
      <mt-field label="车位地址：" disabled>
        <mt-cell title="省市区:" :value="dataForm.areaString" is-link @click.native="handlerArea" style="margin-left: -20px;"></mt-cell>
        <mt-cell title="街道:" :value="dataForm.streetString" is-link @click.native="handlerStreet" style="margin-left: -20px;"></mt-cell>
      </mt-field>
      <mt-popup v-model="areaVisible" class="area-class" position="bottom">
        <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
      </mt-popup>
      <mt-popup v-model="streetVisible" class="area-class" position="bottom">
        <mt-picker :slots="slotstree" @change="onStreeChange"></mt-picker>
      </mt-popup>
    </div>
    <mt-field label="详细地址：" type="textarea" rows="2" v-model="dataForm.detailAddr"></mt-field>
    <mt-field label="开始时间：" placeholder="请选择" type="datetime-local" v-model="time1"></mt-field>
    <mt-field label="结束时间：" placeholder="请选择" type="datetime-local" v-model="time2"></mt-field>
    <mt-field label="价格：" placeholder="请输入金额" v-model="dataForm.price">元/小时</mt-field>
    <mt-field label="车位照片：" disabled style="width:100px;"></mt-field>
    <div style="margin-top: -30px;">
      <el-upload
        class="avatar-uploader"
        action="/api/pps/getImageUrl"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <el-button type="primary" style="margin-top: 20px;" @click="submit">确定</el-button>
  </div>
</template>

<script>
// 导入数据
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
  name: 'index',
  data() {
    return {
      imageUrl: '',

      areaVisible: false,
      streetVisible: false,
      time1:'',
      time2:'',
      dataForm: {
        userid: sessionStorage.getItem('userId'),
        areaString: '请选择',
        streetString: '请选择',
        detailAddr:'',
        startTime:'',
        endTime:'',
        price:'',
        imageUrl:'server/images/1.jpg',
        status:0,
      },
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
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(this.imageUrl);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },

    handlerArea() {
      this.areaVisible = true
    },
    handlerStreet() {
      if (this.slotstree[0].values.length === 0) {
        this.dataForm.streetString = '无可选街道'
        return
      }
      this.streetVisible = true
    },
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
        this.dataForm.areaString = values.join(',')
        if (index3 >= 0) {
          let __a = Object.values(__d[index2])
          let street = __a[index3]
          this.slotstree[0].values = street
        } else {
          this.$set(this.slotstree[0].values, [])
          this.dataForm.streetString = '无可选街道'
        }
      }
    },
    onStreeChange(picker, values) {
      this.dataForm.streetString = values.join(',')
    },

    // 确定
    submit(){
      this.dataForm.startTime = getFullFormatDate(new Date(this.time1));
      this.dataForm.endTime = getFullFormatDate(new Date(this.time2));
      this.$axios.get('/api/pps/saveParkInfo',
      {
        params:this.dataForm,
      }).then((res)=>{
          Toast(res.data.message);
          if (res.data.status === 'SUCCESS'){
            this.$router.push('/mine');
          }
      }).catch((err)=>{
        throw err;
      });
    },

  },
  components:{
  },
}
</script>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<style lang='stylus' scoped>
=======
<style scoped>
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
=======
<style scoped>
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
=======
<style scoped>
>>>>>>> 447b847412bf8b44e0ba21237d11dc6ee49763af
.area-class {
  width: 100%;
  height: 50%;
}

.avatar-uploader .el-upload {
    border: 1px solid blue;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 10px;
    height: 10px;
    display: block;
  }
</style>
