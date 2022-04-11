import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
const Home = () => import( '../views/home/Home.vue')
const Categroy = () => import( '../views/category/Categroy.vue')
const Detail = () => import( '../views/detail/Detail.vue')
const Profile = () => import( '../views/profile/Profile.vue')
const Shopcart = () => import( '../views/shopcart/Shopcart.vue')
const Register = () => import('../views/profile/Register.vue')
const Login = () => import('../views/profile/Login.vue')
const Address = () => import('../views/profile/Address.vue')
const AddressEdit = () => import('../views/profile/AddressEdit.vue')
const CreateOrder = () => import('../views/order/CreateOrder.vue')
const OrderDetail = () => import('../views/order/OrderDetail.vue')
const Order = () => import('../views/order/Order.vue')
const UserSetting = () => import( '../views/profile/UserSetting.vue')
const Collect = () => import('../views/collect/Collect.vue')

import { Notify,Toast  } from 'vant';

const routes = [
  {
    path: '/',
    name: 'DefaultHome',
    component: Home,
    meta:{
      title:'图书商城'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta:{
      title:'图书商城'
    }
  },
  {
    path: '/categroy',
    name: 'Categroy',
    component: Categroy,
    meta:{
      title:'图书商城-商品分类'
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta:{
      title:'图书商城-商品详情'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta:{
      title:'图书商城-个人中心',
      //是否确认授权
      isAuthRequired: true
    }
  },
  {
    path: '/shopcart',
    name: 'Shopcart',
    component: Shopcart,
    meta:{
      title:'图书商城-购物车',
      //是否确认授权
      isAuthRequired: true
    }
  },
  {
    path: '/address',
    name: 'Address',
    component:Address,
    meta:{
      title:'图书商城-地址管理',
      //是否确认授权
      isAuthRequired: true
    }
  },
  {
    path: '/addressedit',
    name: 'AddressEdit',
    component:AddressEdit,
    meta:{
      title:'图书商城-地址编辑',
      //是否确认授权
      isAuthRequired: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component:Register,
    meta:{
      title:'图书商城-用户注册'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component:Login,
    meta:{
      title:'图书商城-用户登录'
    }
  },
  {
    path: '/createOrder',
    name: 'CreateOrder',
    component:CreateOrder,
    meta:{
      title:'图书商城-订单预览'
    }
  },
  {
    path: '/orderdetail',
    name: 'OrderDetail',
    component:OrderDetail,
    meta:{
      title:'图书商城-订单详情'
    }
  },
  {
    path: '/order',
    name: 'Order',
    component:Order,
    meta:{
      title:'图书商城-订单列表'
    }
  },
  {
    path: '/setting',
    name: 'UserSetting',
    component: UserSetting,
    meta:{
      title:'图书商城-账号管理',
      //是否确认授权
      isAuthRequired: true
    }
  },
  {
    path: '/collect',
    name: 'Collect',
    component: Collect,
    meta:{
      title:'图书商城-我的收藏',
      //是否确认授权
      isAuthRequired: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  //如果没登录，跳到login
  if(to.meta.isAuthRequired && store.state.user.isLogin === false) {
    Toast.fail('请先登录');
    return next('/login');
  }else{
    
    next();
  }
  document.title = to.meta.title;
  
})

export default router
