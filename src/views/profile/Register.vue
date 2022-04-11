<template>
  <div class="register">
    <nav-bar>
      <template v-slot:default>
        <div>新用户注册</div>
      </template>
    </nav-bar>

    <div style="margin-top: 50px">
      <div style="text-align: center">
        <img class="img" src="~assets/images/register.png" alt="">
      </div>
    </div>
    
    <van-form @submit="onSubmit" class="form">
      <van-cell-group inset>
        <van-field
          v-model="name"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="password_confirmation"
          type="password"
          name="确认密码"
          label="确认密码"
          placeholder="确认密码"
          :rules="[{ required: true, message: '请填写一致的密码' }]"
        />
        <van-field
          v-model="email"
          name="电子邮箱"
          label="电子邮箱"
          placeholder="请输入正确的电子邮箱格式"
          :rules="[{ required: true, message: '请填写正确的电子邮箱' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <div class="link-login" @click="$router.push({path:'./login'})">
          已有账号，立即登录
        </div>
        <van-button round block type="info" color="#44b883" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue';
import {reactive, ref,toRefs } from 'vue';
import {register} from 'network/user';
import { Notify,Toast  } from 'vant';
import {useRouter} from 'vue-router'
export default {
  name: 'Register',
  components: { NavBar },
  setup(props) {
   
   const router = useRouter();

    const userinfo = reactive({
      name:'',
      password:'',
      password_confirmation:'',
      email:''
    })

  const onSubmit = ()=>{
    //验证
    if(userinfo.password !== userinfo.password_confirmation){
      Notify({ type: 'warning', message: '两次密码不一致，请重新输入' });
      userinfo.password_confirmation ='';
    }else{
      register(userinfo).then(res=>{
        //wz218
        //123456
        //123456@2929.com
        if(res.status == '201'){
          Toast.success('注册成功！');
          setTimeout(() => {
            router.push({path: '/login'})
          }, 500);
        }
        userinfo.password_confirmation ='';
        userinfo.password='';
      })
    }
    //提交
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
  width: 100px;
  height: 100%;
}
.form{
  margin-bottom: 1500px;
}
</style>
