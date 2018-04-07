<template>
  <div class="index">
    <!-- <mt-header fixed title="四级联动-demo-2"></mt-header> -->
    <mt-header title="个人车位租赁系统"></mt-header>
    <div class="page-content">
      <mt-field label="车位地址：" disabled>
        <mt-cell title="省市区:" :value="areaString" is-link @click.native="handlerArea" style="margin-left: -20px;"></mt-cell>
        <mt-cell title="街道:" :value="streetString" is-link @click.native="handlerStreet" style="margin-left: -20px;"></mt-cell>
      </mt-field>
      <mt-popup v-model="areaVisible" class="area-class" position="bottom">
        <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
      </mt-popup>
      <mt-popup v-model="streetVisible" class="area-class" position="bottom">
        <mt-picker :slots="slotstree" @change="onStreeChange"></mt-picker>
      </mt-popup>
    </div>
    <mt-field label="详细地址：" type="textarea" rows="4" v-model="detailAddr"></mt-field>
    <mt-field label="开始时间：" placeholder="请选择" type="datetime-local" v-model="startTime"></mt-field>
    <mt-field label="结束时间：" placeholder="请选择" type="datetime-local" v-model="endTime"></mt-field>
    <mt-field label="价格：" placeholder="请输入金额" v-model="price">元/小时</mt-field>
    <v-bottom></v-bottom>
  </div>
</template>

<script>
// 导入数据
import data from '../../assets/data/data2.json'
import Buttom from '@/components/bottom'
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
      areaVisible: false,
      streetVisible: false,
      areaString: '请选择',
      streetString: '请选择',
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
      detailAddr:'',
      startTime:'',
      endTime:'',
      price:'',
    }
  },
  methods: {
    handlerArea() {
      this.areaVisible = true
    },
    handlerStreet() {
      if (this.slotstree[0].values.length === 0) {
        this.streetString = '无可选街道'
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
        this.areaString = values.join(',')
        if (index3 >= 0) {
          let __a = Object.values(__d[index2])
          let street = __a[index3]
          this.slotstree[0].values = street
        } else {
          this.$set(this.slotstree[0].values, [])
          this.streetString = '无可选街道'
        }
      }
    },
    onStreeChange(picker, values) {
      this.streetString = values.join(',')
    }
  },
  components:{
    'v-bottom':Buttom,
  },
}
</script>
<style>
.area-class {
  width: 100%;
  height: 50%;
}
</style>
