<template>
  <div class="backTop" @click="backTop">
    
  </div>
</template>

<script>
export default {
  name:'BackTop',
  setup(props,{emit}) {
    return{
      backTop:()=>{
        emit('bTop');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .backTop{
    width: 50px;
    height: 50px;
    position: fixed;
    bottom: 80px;
    right: 25px;
    z-index: 20;
    box-shadow: 5px 5px 5px #888888;
    border-radius: 50%;
    background: #FCFCFC url('~assets/images/up.png') no-repeat center center;
  }
</style>
