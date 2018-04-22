// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// 引入element组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入element手机端组件及其样式
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import App from './App';
import router from './router';
import Axios from 'axios'; // 引入axios
// 引入省市区三级联动组件及其样式
import VueAreaLinkage from 'vue-area-linkage';
import 'vue-area-linkage/dist/index.css';

Vue.prototype.$axios = Axios

Vue.use(ElementUI);
Vue.use(Mint);
Vue.use(VueAreaLinkage);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
