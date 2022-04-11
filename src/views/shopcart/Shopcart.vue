<template>
  <div>
    <nav-bar>
      <template v-slot:default>
      <div>
            购物车( <span style="color:red">{{ $store.state.cartCount }}</span> )
        </div>
      </template>
    </nav-bar>

    <div class="cart-box">
      <div class="cart-body">
        <van-checkbox-group ref="checkboxGroup" @change="groupChange" v-model="result">
           <van-swipe-cell :right-width="50" v-for="(item, index) in list" :key="index">
            <div class="goods-item">
              <van-checkbox :name="item.id" />
              <div class="goods-img">
                <img v-lazy="item.goods.cover_url" alt="">
              </div>
              <div class="goods-desc">
                <div class="goods-title">
                  <span>{{item.goods.title}}</span>
                  <span>x{{item.goods.stock}}</span>
                </div>
                <div class="goods-btn">
                  <div class="goods-price"><small>￥</small>{{item.goods.price+ '.00'}}</div>
                  <van-stepper integer :min ="1" :max="item.goods.stock" :model-value="item.num" :name="item.id" async-change 
                  @change="onChange" />
                </div>
              </div>
            </div>

            <template #right>
              <van-button square icon="delete" type="danger" class="delete-button"
              @click="deleteGoods(item.id)" />
            </template>
          </van-swipe-cell>   

        </van-checkbox-group>
      </div>
     
      <van-submit-bar class="submit-all" :price="total*100" @submit="onSubmit" button-text="结算">
        <van-checkbox  @click="allCheck" v-model:checked="checkAll">全选</van-checkbox>
      </van-submit-bar>     

      <div class="empty" v-if="!list.length">
        <img src="~assets/images/empty-cart.gif" alt="空购物车" class="empty-cart">
        <div class="title">购物车空空如也</div>
        <van-button round color="#1baeae" type="primary" block @click="goTo">前往购物</van-button>
      </div> 
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue"
import {ref,reactive,toRefs,onMounted,computed} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import {getCart,deleteCartItem,checkedCart,modifyCart} from 'network/cart'
import { Notify,Toast  } from 'vant';
export default {
  
  name:'Shopcart',
  components: { NavBar },
  setup(props) {

    const router = useRouter();
    const store = useStore();
    //页面数据  
    const state = reactive({
      list: [],
      //id数组
      result: [], 
      checkAll: true
    })
    //初始化购物车数据
    const init = ()=>{
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      })
      getCart('include=goods').then(res =>{
        
        state.list = res.data

        state.result = res.data.filter((n) => n.is_checked == 1).map(item => item.id);

        Toast.clear();
      })
    }

    onMounted(() => {
      init()
    })

    //计算总价
    const total = computed(()=>{

      let sum = 0;
      state.list.filter(item => state.result.includes(item.id)).forEach(item =>{
        sum += parseInt(item.num)*parseFloat(item.goods.price) 
      })
      return sum
    })

    //异步改变购物车数量
    const onChange = (value,detail) =>{
          Toast.loading({
            message: '修改中...',
            forbidClick: true,
          })
        modifyCart(detail.name, {num:value}).then(res =>{
            state.list.forEach(item =>{
              if(item.id == detail.name){
                item.num = value;
              }
            })
            Toast.clear();
          })
    }

    // 复选框改变处理
    const groupChange = (result) =>{
      if(result.length == state.list.length){
        state.checkAll = true
      }else{
        state.checkAll = false
      }
      console.log(result)
      state.result = result
      //改变数据库中的选中状态
      checkedCart({cart_ids: result})
    }

     //全选按钮
    const allCheck = ()=>{
      
      if(!state.checkAll){
        state.result = state.list.map(item=>item.id)
        state.checkAll = true
      }else{
        state.result = []
        state.checkAll = false
      }
     
    }

    //前往购物
    const goTo = ()=>{
      router.push({path:'/home'})
    }

   //删除商品
   const deleteGoods = (id)=>{

      deleteCartItem(id).then(res =>{
        init(); //重新初始化
        store.dispatch('updataCart');
      })
   }

  // 创建订单
  const onSubmit = ()=>{
    if(state.result.length == 0){
      Toast.fail('请选择商品进行结算');
      return;
    }else{
      router.push({path:'/createorder'})
    }
  }

    return {
      ...toRefs(state),
      goTo,
      onChange,
      groupChange,
      allCheck,
      deleteGoods,
      total,
      onSubmit
    };
  }
}
</script>

<style lang="scss" scoped>
.cart-box{
  height: 100vh;
  width: 100vw;
  .cart-body{
    margin: 60px 0 100px 0;
    padding-left: 10px;
    .goods-item{
      display: flex;
    }
    .goods-img{
      img{
        width: 100px;
        height: auto;
      }
    }
    .goods-desc{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      padding: 20px;
    }
    .goods-title{
      display: flex;
      justify-content: space-between;
    }
    .goods-btn{
      display: flex;
      justify-content: space-between;
      margin-left: 15px;
    }
    .goods-price{
      font-size: 16px;
      color: red;
      line-height: 28px;
    }
    .van-icon-delete{
      font-size: 20px;
      margin-top: 4px;
    }
  }
}
.delete-button{
  width: 50px;
  height: 100%;
}
.empty{
  width: 50%;
  margin: 0 auto;
  text-align: center;
  margin-top: 200px;
  .empty-cart{
    width: 200px;
    margin-bottom: 50px;
  }
  .van-icon-smile-o{
    font-size: 50px;
  }
  .title{
    font-size: 16px;
    margin-bottom: 20px;
  }
}
.submit-all{
  margin-bottom: 52px;
  .van-checkbox{
    margin-left: 0;
  }
  .van-submit-bar__text{
    margin-right: 10px;
  }
  .van-submit-bar__button{
    background: red;
  }
}
.van-checkbox__icon--checked .van-icon{
  background-color: red;
  border-color: red;
}
</style>