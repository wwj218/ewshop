<template>
  <div class="order-detail-box">
    <nav-bar class="nav-bar">
      <template v-slot:default> 订单详情 </template>
    </nav-bar>
    <div class="order-status">
      <div class="status-item">
        <label>订单状态：</label>
        <span>{{statusString}}</span>
      </div>
      <div class="status-item">
        <label>订单编号：</label>
        <span>{{detail.order_no}}</span>
      </div>
      <div class="status-item">
        <label>下单时间：</label>
        <span>{{detail.created_at}}</span>
      </div>
      
      <van-button v-if="detail.status == 1" @click="showPayFn" style="margin-bottom: 10px" color="#1baeae" block>去支付</van-button>
      <van-button v-if="detail.status == 2" @click="handleConfirmOrder" block>确认订单</van-button>
    </div>
    <div class="order-price">
      <div class="price-item">
        <label>商品金额：</label>
        <span>￥ {{total + '.00'}}</span>
      </div>
      <div class="price-item">
        <label>配送方式：</label>
        <span>普通快递</span>
      </div>
    </div>

    <van-card
      v-for="(item,index) in detail.orderDetails.data"
      :key="index"
      :num="item.num"
      :price="item.price + '.00'"
      desc="全场包邮"
      :title="item.goods.title"
      :thumb="item.goods.cover_url"
    />

    <div style="width:100%;height:50px;">

    </div>

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
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue'
import { getOrderDetail,comfirmOrder,viewExpress,payOrderStatus,payOrder } from 'network/order'
import { Dialog, Notify,Toast  } from 'vant';
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref, reactive, toRefs, computed } from 'vue'
import {useStore} from 'vuex'
export default {
  name: 'OrderDetail',
  components: { NavBar },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      //订单id
      orderNo:'',
      detail:{
        orderDetails:{
          data:[]
        },
        status:0
      },
      showPay:false,
      aliyun:'',
      wechat:'',
    })

    const init = () =>{
      const {id} = route.query;
      state.orderNo = id;

      getOrderDetail(id).then(res =>{
        state.detail = res;
      })
    }

    onMounted(() => {
      Toast.loading({message:'加载中...',forbidClick:true})
      init()
      Toast.clear()
    })

    const statusString = computed(()=>{
      //1已下单2已支付3等待发货4确认收货5已过期
        let status = ['','已下单','已支付','等待发货','确认收货','已过期'];
        return status[state.detail.status]
    })

    const total = computed(()=>{
        let sum = 0;
        state.detail.orderDetails.data.forEach(item =>{
          sum += item.num * item.price;
        })
        return sum
    })

    const showPayFn = () =>{
      state.showPay = true;
      payOrder(state.orderNo,{type:'aliyun'}).then(res =>{
            state.aliyun = res.qr_code_url;
            state.wechat = res.qr_code_url;
      })
      // 轮询查看
        const timer = setInterval(() => {
          payOrderStatus(state.orderNo).then(res =>{       
            if(res == '2'){
              clearInterval(timer);
              state.showPay = false;
              router.push({path:'./orderdetail',query:{id:state.orderNo}})
            }
          })
        }, 1000);
    }

    const handleConfirmOrder = ()=>{
      Dialog.confirm({
         message:'是否确认订单',
      }) .then(() => {
        // on confirm
        comfirmOrder(state.orderNo).then(res =>{
            Toast('确认成功');
            init()
        })
      }).catch(() => {
        // on cancel
      });
    }

    const close= ()=>{
      router.push({path:'/orderdetail'})
    }

    return {
      ...toRefs(state),
      statusString,
      total,
      showPayFn,
      handleConfirmOrder,
      close
    }
  },
}
</script>

<style lang="scss" >
.order-detail-box{
  label{
    color: #CACDD1;
  }
  height: 100vh;
  width: 100vw;
  margin-top: 60px;
  .order-status{
    width: 92vw;
    margin-left: 15px;
    margin-bottom: 50px;
    background-color: #FFFFFF;
    .status-item{
      font-size: 15px;
      text-align: left;
      margin-bottom: 8px;
    }
  }
  .order-price{
    width: 92vw;
    margin-top: 25px;
    margin-left: 15px;
    background-color: #FFFFFF;
    margin-bottom: 25px;
    .price-item{
      text-align: left;
      margin-bottom: 15px;
    }
  }
  .van-card{
    width: 92vw;
    margin-left: 15px;
    text-align: left;
  }
}
</style>
