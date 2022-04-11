<template>
  <div id="home">
    <nav-bar>
      <template v-slot:default>
        <div>图书商城</div>
      </template>
    </nav-bar>

    <tab-control v-show="isShow" @tabClick="tabClick" :titles="['畅销', '新书', '精选']"></tab-control>

    <div class="wrapper">
      <div class="content">
        <div ref="banref">
          <home-swiper :banners ="banners"></home-swiper>
          <recommend :recommends="recommends"></recommend>
        </div>
        
        <tab-control @tabClick="tabClick" :titles="['畅销', '新书', '精选']"></tab-control>
        <goods-list :goods="showGoods"></goods-list>
      </div>
    </div>

    <back-top v-show="isShowBackTop" @bTop ="bTop"></back-top>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import { getHomeAllDate, getHomeGoods } from 'network/home';
import { onMounted, reactive, ref ,computed ,watchEffect,nextTick} from 'vue';

import NavBar from 'components/common/navbar/NavBar.vue';
import TabControl from 'components/content/tabControl/TabControl.vue';
import GoodsList from 'components/content/goods/GoodsList.vue';
import BackTop from 'components/common/backtop/BackTop.vue';
import recommend from './ChildComps/Recommend.vue';
import HomeSwiper from './ChildComps/HomeSwiper.vue';

export default {
  components: { NavBar, recommend, TabControl, GoodsList, BackTop, HomeSwiper },
  name: 'Home',
  setup(props) {

    let isShow = ref(false)
    let isShowBackTop = ref(false)
    let banref = ref(null)
    const recommends = ref([])
    //商品列表数据模型
    const goods = reactive({
      sales: {
        pages: 1,
        list: []
      },
      recommend: {
        pages: 1,
        list: []
      },
      new: {
        pages: 1,
        list: []
      },
    })

    let currentType = ref('sales');

    const showGoods = computed(()=>{
      return goods[currentType.value].list
    })

    let bscroll = reactive({});

    let banners = ref([])
    onMounted(()=> {
      getHomeAllDate().then((res) => {
        recommends.value = res.goods.data;
        banners.value = res.slides;
      })
    getHomeGoods('sales').then((res) => {
        goods.sales.list = res.goods.data
      })
    getHomeGoods('recommend').then((res) => {
        goods.recommend.list = res.goods.data
      })
     getHomeGoods('new').then((res) => {
        goods.new.list = res.goods.data
      })
      //创建BScroll对象
      bscroll = new BScroll(document.querySelector('.wrapper'),{
          probeType: 3,
          pullUpLoad: true, //上拉加载更多        
          click: true, //是否允许点击
      })
      //触发滚动事件
      bscroll.on('scroll',(position)=>{
       isShowBackTop.value = isShow.value = (-position.y) > banref.value.offsetHeight;
      })
      //触发上拉加载
      bscroll.on("pullingUp",async()=>{

        const page = goods[currentType.value].pages + 1;

       await getHomeGoods(currentType.value , page).then(res =>{
          goods[currentType.value].list.push(...res.goods.data);
          goods[currentType.value].pages += 1;
        })
        //完成上拉，展示数据
        bscroll.finishPullUp();
        
        //重新计算高度
        bscroll.refresh();
      })
      
    })
    const tabClick = (index) => {
      let types = ['sales','new','recommend'];

      currentType.value = types[index];

       nextTick(()=>{
        bscroll && bscroll.refresh();
        })
    }

    //监听变量变化
  watchEffect(()=>{
    nextTick(()=>{
      bscroll && bscroll.refresh();
    })
  })

  const bTop = ()=>{
    bscroll.scrollTo(0,0,800);
  }
    return {
      recommends,
      tabClick,
      goods,
      showGoods,
      isShow,
      banref,
      isShowBackTop,
      bTop,
      banners
    }
  },
}
</script>

<style scope>
#home{
  height: 100vh;
  position: relative;
}
.wrapper{
  position: absolute;
  top: 45px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow: hidden;
}
.content{

}

</style>
