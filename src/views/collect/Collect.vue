<template>
  <div>
    <nav-bar>
      <template v-slot:default>
      <div>
            我的收藏
        </div>
      </template>
    </nav-bar>

    <div class="cart-box">
      <div class="cart-body">
        <van-checkbox-group ref="checkboxGroup" @change="groupChange" v-model="result">
           <van-swipe-cell :right-width="50" v-for="(item, index) in list" :key="index">
            <div class="goods-item">
              <van-checkbox :name="item.goods_id" />
              <div class="goods-img">
                <img v-lazy="item.goods.cover_url" alt="">
              </div>
              <div class="goods-desc">
                <div class="goods-title">
                  <span>{{item.created_at}}</span>
                </div>
                <div class="goods-btn">
                  <span class="desc">{{item.goods.title}}</span>
                  <div class="goods-price"><small>￥</small>{{item.goods.price+ '.00'}}</div>
                </div>
              </div>
            </div>
          </van-swipe-cell>   
        </van-checkbox-group>
      </div>
     
      <van-submit-bar class="submit-all" @submit="onSubmit" button-text="删除">
        <van-checkbox class="choice" @click="allCheck" v-model:checked="checkAll">全选</van-checkbox>
      </van-submit-bar>     

      <div class="empty" v-if="!list.length">
        <img src="~assets/images/nocollect.gif" alt="空收藏夹" class="empty-cart">
        <div class="title">还没有收藏过商品哦</div>
      </div> 
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue"
import {ref,reactive,toRefs,onMounted,computed,inject} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import {getCart,deleteCartItem,checkedCart,modifyCart} from 'network/cart'
import {myCollect,Collect} from 'network/collect'
import { Notify,Toast  } from 'vant';
export default {
  
  name:'Collect',
  components: { NavBar },
  setup(props) {

    const router = useRouter();
    const store = useStore();
    //页面数据  
    const state = reactive({
      list: [],
      //id数组
      result: [], 
      checkAll: false
    })
    //刷新页面
    const reload = inject('reload')
    //初始化收藏夹数据
    const init = ()=>{
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      })
     myCollect().then(res =>{
       state.list = res.data
      console.log(state.list)
     })
    }

    onMounted(() => {
      init()
    })
 

    // 复选框改变处理
    const groupChange = (result) =>{
      if(result.length == state.list.length){
        state.checkAll = true
      }else{
        state.checkAll = false
      }
      console.log(result)
      state.result = result
    }

     //全选按钮
    const allCheck = ()=>{
      if(!state.checkAll){
        state.result = state.list.map(item=>item.goods_id)
        state.checkAll = true
      }else{
        state.result = []
        state.checkAll = false
      }
    }

    



  // 创建订单
  const onSubmit = ()=>{
    if(state.result.length == 0){
      Toast.fail('你还没有收藏商品哦！');
      return;
    }else{
      
    for(let i = 0; i < state.result.length; i++){
      Collect(state.result[i]).then(res =>{
          console.log(res)
      })
      reload()
      init()
      
    }
      
    }
  }

    return {
      ...toRefs(state),
      groupChange,
      allCheck,
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
      
      .desc{
        display: inline;
      }
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
  .choice{
    position: absolute;
    bottom: 15px;
    left: 35px;
  }
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