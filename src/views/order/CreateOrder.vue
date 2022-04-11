<template>
  <div class="create-order">
    <nav-bar class="nav-bar">
      <template v-slot:default> 订单预览 </template>
    </nav-bar>

    <div class="address-wrap">
      <div class="name" @click="goTo">
        <div class="detail">
          <span class="address-name">{{address.name }}</span>
          <span>{{ address.phone}}</span>
        </div>
        <div class="address">
          {{address.province}} {{ address.city}} {{ address.county}} {{ address.address}}
        </div>
        <van-icon class="arrow" name="arrow"></van-icon>
        <div class="line"></div>
      </div>

      <div class="good">
        <div class="good-item" v-for="(item, index) in cartList" :key="index">
          <div class="good-img"><img v-lazy= "item.goods.cover_url" alt="" /></div>
          <div class="good-desc">
            <div class="good-title">
              <span>{{item.goods.title}}</span>
              <span>x{{item.num}}</span>
            </div>
            <div class="good-btn">
              <div class="price"><small>￥</small>{{item.goods.price+'.00'}}</div>
            </div>
          </div>
        </div>
      </div>
      <van-submit-bar class="submit-all" :price="total * 100" button-text="生成订单" @submit="handleCreateOrder"> 商品金额 </van-submit-bar>
      <van-popup v-model:show="showPay" closeable :close-on-click-overlay="false" position="bottom" :style="{ height: '40%' }" @close="close">

        <van-grid :border="false" :column-num="2">
          <van-grid-item>
            支付宝二维码<br>
            <van-image width="150" height="150" :src="aliyun" />
          </van-grid-item>
          <van-grid-item>
            微信二维码<br>
            <van-image width="150" height="150" :src="wechat" />
          </van-grid-item>
        </van-grid>

      </van-popup>
    </div>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue'
import { createOrder, getOrderPreview, payOrder, payOrderStatus } from 'network/order'
import { Notify,Toast  } from 'vant';
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref, reactive, toRefs, computed } from 'vue'
import {useStore} from 'vuex'
export default {
  name: 'CreateOrder',
  components: { NavBar },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      cartList: [],
      address: {},
      showPay:false,
      orderNo:'',
      aliyun:'',
      wechat:''
    })

    const init = () => {
      Toast.loading({message: '修改中...',forbidClick: true,});
      getOrderPreview().then(res =>{
        let address = res.address.filter(n => n.is_default == '1');
        if(address.length == 0){
          state.address = {
            address:'还没有设置默认地址，请选择或填写地址信息'
          }
        }else{
            state.address = address[0];
        }

        state.cartList = res.carts;
        Toast.clear()
      })
    }

    onMounted(() => {
      init()
    })

    const goTo = ()=> {
      router.push({path: './address'})
    }

    const handleCreateOrder= ()=>{
      
      const params = {
        address_id: state.address.id
      }
      createOrder(params).then(res =>{
        Toast('创建订单成功')
        store.dispatch('updateCart')

        state.showPay = true;
        state.orderNo = res.id;

        payOrder(state.orderNo,{type:'aliyun'}).then(res =>{
            state.aliyun = res.qr_code_url;
            state.wechat = res.qr_code_url;
        })

        // payOrder(state.orderNo,{type:'wechat'}).then(res =>{
        //   state.wechat = res.qr_code_url;
        // })
        // 轮询查看
        const timer = setInterval(() => {
          payOrderStatus(state.orderNo).then(res =>{
            if(res == '2'){
              clearInterval(timer);
              router.push({path:'./orderdetail',query:{id:state.orderNo}})
            }
          })
        }, 1000);
      })
    }

    const close= ()=>{
      router.push({path:'/orderdetail',query:{id:state.orderNo}})
    }

    const total = computed(()=>{
      let sum = 0;
      state.cartList.forEach(item =>{
        sum += parseInt(item.num) * parseFloat(item.goods.price)
      })
      return sum
    })
    return {
      ...toRefs(state),
      goTo,
      handleCreateOrder,
      close,
      total
    }
  },
}
</script>

<style lang="scss" scope>
.create-order {
  height: 100vh;
  width: 100vw;
  margin-top: 60px;
  .name{
    display: flex;
    position: relative;
    width: 100vw;
    height: 80px;
    .detail{
      height: 10px;
      margin-left: 15px;
      .address-name{
        margin-right: 15px;
      }
    }
    .address{ 
      position: absolute;
      left: 15px;
      bottom: 25px;
      line-height: 15px;
    }
    .arrow{
      position: absolute;
      font-weight: 900;
      font-size: 25px;
      top: 20px;
      right: 15px;
      
    }
    .line{
      position: absolute;
      left: 0;
      bottom: 0;
      height: 5px;
      width: 100vw;
      background-color: #42B983;
    }
  }

  .good-item {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .good-img {
      margin-left: 15px;
      flex: 3;
      img {
        width: 100px;
        height: auto;
      }
    }
    .good-desc {
      flex: 7;
      margin: auto 15px;
      .good-title {
        font-size: 20px;
        margin-left: 15px;
        display: flex;
        justify-content: space-between;
        text-align: left;
      }
      .good-btn {
        margin-top: 15px;
        margin-left: 15px;
        .price {
          font-size: 18px;
          text-align: left;
          color: red;
        }
      }
    }
  }
  .create-order {
    background-color: #fff !important;
  }
  .van-submit-bar__bar {
    background-color: #fff !important;
    z-index: 999;
    margin-bottom: 60px;
  }
}
</style>
