<template>
<div class="order">
  <nav-bar class="nav-bar">
    <template v-slot:default> 
        订单列表 
    </template>
  </nav-bar>

  <van-tabs ref="tabs" @click="onChangeTab" class="order-tab">
    <van-tab title="全部"></van-tab>
    <van-tab title="待付款"></van-tab>
    <van-tab title="已支付"></van-tab>
    <van-tab title="发货"></van-tab>
    <van-tab title="交易完成"></van-tab>
    <van-tab title="过期"></van-tab>
  </van-tabs>
    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="order-list-refresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          @offset="10"
        >
        <div @click="goTo(item.id)" class="order-item-box" v-for="(item,index) in list" :key="index">
          <div class="order-item-header">
            <span style="line-height:30px;">订单号：{{item.order_no}} <br> 创建时间：{{item.created_at}}</span>
          </div>
          <van-card
            v-for="sub in item.orderDetails.data"
            :key="sub.id"
            :num="sub.num"
            :price="sub.goods.price+'.00'"
            desc="全场包邮"
            :title="sub.goods.title"
            :thumb="sub.goods.cover_url"
          />
        </div>
        </van-list>
    </van-pull-refresh>
  </div>
</div>

</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue'
import { getOrderList } from 'network/order'
import { Notify,Toast  } from 'vant';
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref, reactive, toRefs, computed } from 'vue'
import {useStore} from 'vuex'
export default {
  name:'Order',
  components: { NavBar },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    let tabs = ref(null)
    const state = reactive({
      loading:false,
      finished:false,
      refreshing:false,
      list:[],
      page:1,
      totalPage:0,
      status:0,
      
    })
    onMounted(()=>{
      onRefresh()
    })

    const loadData = ()=>{
      getOrderList({page:state.page,status:state.status,include:'orderDetails.goods'}).then(res =>{
          state.list = state.list.concat(res.data);
          state.loading = false;

          state.totalPage = res.meta.pagination.total_pages;
          if(state.page >= state.totalPage){
            state.finished = true
          }

          
      })
    }

    const onLoad = ()=>{
      if(!state.refreshing && state.page < state.totalPage){
        state.page = state.page + 1
      }
    
      if(state.refreshing){
        state.list = [];
        state.refreshing = false;
      }
      loadData()
    }

    const onRefresh = ()=>{
      state.refreshing = true
      state.finished = false
      state.loading = true

      state.page = 1;
      onLoad()
    }

    const onChangeTab = (name)=>{
      state.status = name;
      onRefresh()
    }

    //到订单详情页
    const goTo = (id)=>{
        router.push({path:'/orderdetail',query:{id}})
    }
    return {
      ...toRefs(state),
      onLoad,
      onRefresh,
      tabs,
      onChangeTab,
      goTo
    }
    
  }
}
</script>

<style lang="scss" scoped>
.order{
  width: 100vw;
  position: relative;
  .order-tab{
    width: 100vw;
    position: sticky;
    top: 45px;
    background: #FFFFFF;
    z-index: 2;
  }
  .content{
    width: 100vw;
    margin-top: 100px;
    .order-item-box{
      
      .order-item-header{
        width: 92vw;
        margin-left: 15px;
        span{
          display: block;
          text-align: left;
          font-size: 15px;
        } 
      
      }
      .van-card{
        width: 92vw;
        margin-left: 15px;
        text-align: left;
        margin-bottom: 50px;
      }
    }
  }
}
</style>