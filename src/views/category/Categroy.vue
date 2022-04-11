<template>
  <div>
    <nav-bar>
      <template v-slot:default>
        <div>商品分类</div>
      </template>
    </nav-bar>

    <div id="mainbox">
      <div class="ordertab">
        <van-tabs v-model="active" @click="tabClick">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评论排序"></van-tab>
        </van-tabs>
      </div>

      <van-sidebar class="leftmenu" v-model="activeKey">
        <van-collapse v-model="activeName" accordion>
          <van-collapse-item v-for="(item, index) in categories" :key="item.id" :title="item.name" :name="item.name">
            <van-sidebar-item v-for="sub in item.children" :title="sub.name" :key="sub.id" @click="getGoods(sub.id)" />
          </van-collapse-item>
        </van-collapse>
      </van-sidebar>
      <div class="goodslist">
        <div class="content">
          <van-card 
                 
                  v-for="item in showGoods" :key="item.id" 
                  @click="itemClick(item.id)"
                  :num="item.comments_count"
                  :tag="item.comments_count >= 10 ? '热销' : '流行'"
                  :price="item.price"
                  :desc="item.updated_at" 
                  :title="item.title" 
                  :thumb="item.cover_url" 
                  :lazy-load="true" />
        </div>
      </div>
    </div>
   <back-top v-show="isShowBackTop" @bTop ="bTop"></back-top>
  </div>
</template>

<script>
import {useRouter} from 'vue-router'
import { ref, reactive, onMounted, computed, watchEffect, nextTick } from 'vue'
import { getCategory, getCategoryGoods } from 'network/category'
import BScroll from 'better-scroll'

import NavBar from 'components/common/navbar/NavBar.vue'
import BackTop from 'components/common/backtop/BackTop.vue';


export default {
  name: 'Categroy',
  components: { NavBar,BackTop},
  setup(props) {
    const router = useRouter()
    let active = ref(2)
    let activeKey = ref(0)
    let categories = ref([])
    let activeName = ref(1)
    let isShowBackTop = ref(false)
    //当前的排序条件
    let currentOrder = ref('sales')
    //当前的分类id
    let currentCid = ref(0)

    //数据模型
    const goods = reactive({
      sales: {
        page: 1,
        list: [],
      },
      price: {
        page: 1,
        list: [],
      },
      comments_count: {
        page: 1,
        list: [],
      },
    })

    const showGoods = computed(() => {
      return goods[currentOrder.value].list
    })

    const init = () => {
      getCategoryGoods('sales', currentCid.value).then((res) => {
        goods.sales.list = res.goods.data
      })
      getCategoryGoods('price', currentCid.value).then((res) => {
        goods.price.list = res.goods.data
      })
      getCategoryGoods('comments_count', currentCid.value).then((res) => {
        goods.comments_count.list = res.goods.data
      })
    }
    let bscroll = reactive({})

    onMounted(() => {
      getCategory().then((res) => {
        categories.value = res.categories
      })
      init()
      //创建BScroll对象
      bscroll = new BScroll(document.querySelector('.goodslist'), {
        probeType: 3,
        pullUpLoad: true, //上拉加载更多
        click: true, //是否允许点击
      })

      //注册滚动事件
      bscroll.on('scroll',(position)=>{
        isShowBackTop.value = (-position.y) >300
      })
      bscroll.on('pullingUp', async () => {

        const page = goods[currentOrder.value].page + 1;
        getCategoryGoods(currentOrder.value, currentCid.value).then((res) => {
          goods[currentOrder.value].list.push(...res.goods.data);
          goods[currentOrder.value].page += 1;
          
        })

        //完成上拉，展示数据
        bscroll.finishPullUp()

        nextTick(() => {
            bscroll && bscroll.refresh()
        })
      })
    })

    //排序选项卡
    const tabClick = (index) => {
      // 排序的数组
      let orders = ['sales', 'price', 'comments_count']
      currentOrder.value = orders[index]

      getCategoryGoods(currentOrder.value, currentCid.value).then((res) => {
        goods[currentOrder.value].list = res.goods.data
        nextTick(() => {
          bscroll && bscroll.refresh()
        })
      })
    }
    //通过分类获得商品
    const getGoods = (cid) => {
      currentCid.value = cid
      init()
    }

    watchEffect(() => {
      nextTick(() => {
        bscroll && bscroll.refresh()
      })
    })

    const bTop = ()=>{
      bscroll.scrollTo(0,0,300);
    }
    return {
      activeKey,
      categories,
      activeName,
      active,
      tabClick,
      currentOrder,
      getGoods,
      currentCid,
      goods,
      showGoods,
      bscroll,
      isShowBackTop,
      bTop,
      itemClick:(id)=>{
        router.push({
          path:'/detail',
          query:{id}
        })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
#mainbox {
  margin-top: 45px;
  display: flex;
  .ordertab {
    flex: 1;
    float: right;
    height: 50px;
    z-index: 9;
    position: fixed;
    top: 45px;
    right: 0;
    left: 130px;
  }
  .leftmenu {
    position: fixed;
    top: 95px;
    left: 0;
    width: 130px;
  }
  .goodslist {
    flex: 1;
    position: absolute;
    top: 100px;
    left: 130px;
    right: 0;
    height: 100vh;
    padding: 10px;
    text-align: left !important;
    .content{
      padding-top: 100px;
    }
  }
}
.van-card__thumb {
  width: 68px;
}
</style>
