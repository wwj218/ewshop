<template>
  <div>
    <nav-bar>
      <template v-slot:default>
        <div>商品详情:{{ id }}</div>
      </template>
    </nav-bar>

    <van-image
        style="margin-top:50px"
        width="100%"
        lazy-load
        :src="detail.cover_url"
      />
      <van-card
              style="text-align: left"
              :num="detail.stock"
              :price="detail.price +'.00'"
              :desc="detail.description"
              :title="detail.title"
            >
              <template #tags>
                <van-tag plain type="danger" style="margin-right: 10px;margin-top: 10px">热销</van-tag>
                <van-tag plain type="danger">推荐</van-tag>
              </template>
              <template #footer class="footer">
                <img src="~assets/images/sc.png" class="imga" @click="change" v-if="show">
                <img src="~assets/images/collected.png" class="imga" @click="change" v-if="!show">
                <van-button type="warning" size="small" @click="handleAddCart">加入购物车</van-button>
                <van-button type="danger" size="small" @click="goToCart">立即购买</van-button>
              </template>
            </van-card>

            <van-tabs v-model="active">
              <van-tab title="概述">
                <div class="content" v-html="detail.details">
                </div>
              </van-tab>
              <van-tab title="相关图书">
                 <goods-list :goods="like_goods"></goods-list>
              </van-tab>
            </van-tabs>
  </div>

</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue"
import {useRoute, useRouter} from 'vue-router'
import {ref,onMounted, reactive,toRefs} from 'vue'
import {useStore} from 'vuex'
import { getDetail } from 'network/detail'
import {addCart} from 'network/cart'
import { Toast  } from 'vant';
import GoodsList from 'components/content/goods/GoodsList.vue'
import { Collect} from 'network/collect'
export default {
  name:'Detail',
  components: { NavBar,GoodsList },
  setup(props) {
    let active = ref(1)
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    let id = ref(0);
    const state = reactive({
      show:true
    })
    
    id.value = route.query.id
   
    //商品详情
    let book = reactive({
        detail:{
        },
        like_goods:[],
        is_collect:0
    })
    onMounted(() => {
      id.value = route.query.id;
      getDetail(id.value).then((res)=>{
        book.detail = res.goods;
        book.like_goods = res.like_goods;
        book.is_collect = res.goods.is_collect
        if(book.is_collect == 0){
          state.show = true
        }else{
          state.show = false
        }
      })
      
    })
    //添加购物车
    const handleAddCart = ()=>{
      addCart({goods_id:book.detail.id, num:1}).then(res=>{
        if(res.status == '204' || res.status == '201'){
          Toast.success('添加成功');
          // 设置store中cartCount
          store.dispatch('updateCart')
        }
      })
    }

    //立即购买
    const goToCart = ()=>{
       addCart({goods_id:book.detail.id, num:1}).then(res=>{
        if(res.status == '204' || res.status == '201'){
          Toast.success('添加成功，已在购物车等您');
          store.dispatch('updateCart')
          router.push({path:'/shopcart'});
        }                                                                                                                                                                       
      })
    }
    //添加和取消收藏
    const collected = (id)=>{
      Collect(id).then(res =>{
        if(res.status == 201){
          Toast.success('添加收藏成功！');
        }else if(res.status == 204){
          Toast.success('取消收藏成功！');
        }
      })
    }


    const change = ()=>{
        state.show= !state.show
        collected(book.detail.id)
    }
    return{
      id,
      ...toRefs(book),
      active,
      handleAddCart,
      goToCart,
      ...toRefs(state),
      change
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  padding: 10px;
  
}
.footer{
  position: relative;
}
.imga{
    position: absolute;
    top: 95px;
    left: 160px;
    height: 30px;
    width: auto;
  }
</style>
