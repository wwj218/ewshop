<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" :product="item" :key="item"></goods-list-item>
   
  </div>
</template>

<script>
import GoodsListItem from './GoodsListItem.vue'
export default {
  components: { GoodsListItem },
  name: 'GoodsList',
  props:{
    goods:{
      type:Array,
      default(){
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.goods{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 25px;
}
</style>
