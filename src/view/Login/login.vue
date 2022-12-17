<template>
  <div class="login">
    <div class="container">
      <h3 class="mb-4 title">Login</h3>
      <form action="#" class="signin-form">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="邮箱" v-model="user.email" />
        </div>
        <div class="form-group">
          <input id="password-field" type="password" class="form-control" placeholder="密码" v-model="user.password"
            autocomplete="off" />
        </div>
        <div class="form-group">
          <button type="button" class="submit" @click="successLogin">
            登录
          </button>
        </div>
        <el-link class="tip" @click="toRegister">没有账号,去注册！</el-link>
      </form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login, getPublickey } from "@/network/user/user";
import { setStorage, encrypt } from "@/utils";
import { ElMessage, ElNotification } from "element-plus";
import { useStore } from "@/store";
const Router = useRouter();
const Store = useStore();
const user = ref({
  email: "",
  password: "",
});
const successLogin = async () => {
  //判断是否为空
  if (user.value.email === '' || user.value.password === '') {
    ElMessage({
      message: '邮箱或密码不能为空',
      type: "error",
    })
    return;
  }
  //获取公钥
  const resKey = await getPublickey().catch((err) => {
    ElMessage({
      message: err.response.message,
      type: "error",
    });
  });
  const enpwd = encrypt(resKey.publicKey, user.value.password);
  if (enpwd) {
    user.value.password = enpwd;
  }

  login(user.value)
    .then((res) => {
      console.log(res);
      setStorage("userInfo", res);
      Store.updateUserinfo();
      //跳转到首页
      Router.push({ path: "/home" });
      ElNotification({
        title: `Hello,${res.name}`,
        message: "欢迎来到龙仔的个人博客",
        type: "success",
        duration: 1500,
      });
    })
    .catch((err) => {
      console.log(err);

      ElMessage({
        message: err.response.data,
        type: "error",
      });

      user.value.email = '';
      user.value.password = '';
    });
};

const toRegister = () => {

  Router.push({ path: "/register" });
};
</script>
<style lang="less" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-image: url(@/assets/img/bg1.jpg);
  background-position: center;
  background-size: 100% 100%;
  overflow: hidden;
  .title{
    color: #fff;
  }
  .container {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .signin-form {
      text-align: center;

      input {
        width: 300px;
        height: 35px;
        border: none;
        outline: none;
        border-radius: 30px;
        padding-left: 16px;
        color: #fff;
        background-color: rgba(240, 240, 240, 0.2);
        margin-bottom: 20px;
      }

      /* 更改文本框的placeholder的颜色 */
      input::placeholder {
        color: #fff;
      }

      .submit {
        width: 320px;
        height: 40px;
        border-radius: 30px;
        border: none;
        background-color: #cecccc;
        cursor: pointer;
        &:hover{
          background-color: #e6e3e3;
        }
      }

      .tip::v-deep {
        margin-top: 20px;
        color: #fff;

        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
