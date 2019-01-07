// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Qs from 'qs'
import Vuex from "vuex"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//font-awesome
import "../node_modules/font-awesome/css/font-awesome.css";
// import store from "./vuex/store.js";
// import '@/styles/index.scss'
import '@/styles/import.scss';
import VueQuillEditor from 'vue-quill-editor' //调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(Vuex);
Vue.use(VueQuillEditor)
Vue.use(ElementUI)
Vue.prototype.$axios = axios;
//axios.defaults.baseURL = '/vss';
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	// store,
	template: '<App/>',
	watch: {
		'$route': function(to, from) {
			//			console.log(to);
			//			console.log(from);
		}
	},
	components: {
		App
	}
})