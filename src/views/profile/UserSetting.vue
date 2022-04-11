<template>
  <div id="box">
    <nav-bar class="nav-bar">
      <template v-slot:default>
      <div>
            账号管理
        </div>
      </template>
    </nav-bar> 

    <div class="user-box">
        <div class="info">
          <img src="~assets/images/1.png" alt="默认头像">
          <div class="user-desc">
            <van-uploader :after-read="afterRead">
             <span class="name">更换头像</span>
            </van-uploader>
          </div>
      </div>

      <ul class="user-list">
        <li class="van-hairline-bottom">
          <span>账号：    {{user.email}}</span>
          <van-icon name="arrow" />
        </li>
        <li class="van-hairline-bottom" >
          <span>昵称：    {{user.name}}</span>
          <van-icon name="arrow" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue"
import {getUser,getUserAvater,getUserName} from 'network/user';
import { Toast  } from 'vant';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {onMounted,ref,reactive,toRefs} from 'vue'
export default {
  name:'UserSetting',
  components: { NavBar },
  setup(props) {

    const router = useRouter();
    const store = useStore();
    const state = reactive({
      user:{
        name:'',
        avatar:''
      },
      text:''
    })
    const init = ()=>{
      getUser().then(res =>{
        state.user = res
      })
      
    }

    onMounted(() => {
      init()
    })

    const afterRead = (file) => {
      console.log(file)
    };


    return{
      ...toRefs(state),
      afterRead
    }
  }
}
</script>

<style lang="scss" scoped>
  #box{
    background-color: #FCFCFC;
    height: 100vh;
  }
  .user-box{
    margin-top: 65px;
   .info{
     img{
       height: 150px;
       width: 150px;
       border-radius: 50%;
       margin: 0 auto;
     }
     .name{
       font-size: 10px;
       color: red;
     }
   }
    
    .user-list{
      padding: 0 8px;
      margin-top: 40px;
      li{
        padding-left: 5px;
        padding-right: 5px;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        span{
          text-align: left;
          input{
            border: none;
            background-color: #fff;
          }
        }
        .van-icon-arrow{
          margin-top: 13px;
        }
        .icon{
          margin-right: 10px;
        }
        margin: 20px 0 !important;
        background: #FFFFFF;
        border-radius: 3px;
      }
    }
  }
</style>