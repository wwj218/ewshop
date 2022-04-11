<template>
  <div class="register">
    <nav-bar>
      <template v-slot:default>
        <div>用户登录</div>
      </template>
    </nav-bar>

    <div style="margin-top: 50px">
      <div style="text-align: center">
        <img class="img" src="~assets/images/login.png" alt="">
      </div>
    </div>
    
    <van-form @submit="onSubmit" class="form">
      <van-cell-group inset>
        <van-field
          v-model="email"
          name="电子邮箱"
          label="电子邮箱"
          placeholder="请输入正确的电子邮箱格式"
          :rules="[{ required: true, message: '请填写正确的电子邮箱' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <div class="link-login" @click="$router.push({path:'./register'})">
          没有账号，立即注册
        </div>
        <van-button round block type="info" color="#44b883" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue';
import {reactive, ref,toRefs } from 'vue';
import {login} from 'network/user';
import { Notify,Toast  } from 'vant';
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
export default {
  name: 'Login',
  components: { NavBar },
  setup(props) {
   
   const router = useRouter();
   const store = useStore();

    const userinfo = reactive({
      email:'',
      password:'',
    })

  const onSubmit = ()=>{
    login(userinfo).then(res => {
      //将token保存在本地 
      window.localStorage.setItem('token',res.access_token);
      //在vuex islogin
      
      store.commit('setIsLogin', true)

      Toast.success('登录成功');
      userinfo.email = '';
      userinfo.password = '';

      setTimeout(() => {
        router.go(-1)
      }, 500);
    })
  }

    return{
      ...toRefs(userinfo),
      onSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.link-login{
  font-size: 14px;
  margin-bottom: 20px;
  color: #42b983;
 
}
.img{
  padding-top: 50px;
  margin-bottom: 20px;
  width: 125px;
  height: 100%;
}
</style>