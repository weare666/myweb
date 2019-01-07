import Vue from 'vue'
import Router from 'vue-router'
import Index from "../components/index.vue";
import Login from "../components/login.vue";

/*首页*/
import index from "../components/index.vue";

//商家管理
import businessManagement from "../components/businessManagement.vue";

//房源管理
import housingManagement from "../components/housingManagement.vue";

//运营管理
//用户管理
import userManagement from "../components/operationManagement/userManagement.vue";
//预约订单管理
import orderManagement from "../components/operationManagement/orderManagement.vue";
//用户反馈
import userFeedback from "../components/operationManagement/userFeedback.vue";

//模块设置
import moduleSetting from "../components/moduleSetting.vue";

//数据字典
//房源标签
import houseLabel from "../components/dataDictionary/houseLabel.vue";
//房屋类型
import houseType from "../components/dataDictionary/houseType.vue";
//房屋性质
import houseProperty from "../components/dataDictionary/houseProperty.vue";

//平台账号管理
import accountManagement from "../components/accountManagement.vue";

//角色与权限管理
import roleManagement from "../components/roleManagement.vue";



Vue.use(Router);

export default new Router({
//mode: 'history',
  routes: [
    {
      path: "/",
      component: Login
    },
    {
      path: "/index",
      component: index,
      children: [
      	//商家管理
      	{path: "/businessManagement", component: businessManagement},
      	//房源管理
      	{path: "/housingManagement", component: housingManagement},
      	//用户管理
      	{path: "/userManagement", component: userManagement},
      	//预约订单管理
      	{path: "/orderManagement", component: orderManagement},
      	//用户反馈
      	{path: "/userFeedback", component: userFeedback},
      	//模块设置
      	{path: "/moduleSetting", component: moduleSetting},
      	//房源标签
      	{path: "/houseLabel", component: houseLabel},
      	//房屋类型
      	{path: "/houseType", component: houseType},
      	//房屋性质
      	{path: "/houseProperty", component: houseProperty},
      	//平台账号管理
      	{path: "/accountManagement", component: accountManagement},
      	//角色与权限管理
      	{path: "/roleManagement", component: roleManagement}
      	
      ]
    }
  ]
})
