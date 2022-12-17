<template>
  <div class="login">
    <div class="container">
      <h3 class="mb-4 title">Register</h3>
      <form action="#" class="signin-form">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="邮箱" v-model="user.email" />
        </div>
        <div class="form-group">
          <input type="password" class="form-control" placeholder="密码" v-model="user.password" autocomplete="off" />
        </div>
        <div class="form-code">
          <input type="text" class="code" placeholder="验证码" v-model="user.code" />
          <el-button type="primary" size="default" :disabled="isClickCode" round @click="getRegisterCode">{{ codeText }}</el-button>
        </div>
        <div class="form-group">
          <button type="button" class="submit" @click="successRegister">
            注册
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getCode, register, getPublickey } from "@/network/user/user";
import { setStorage, encrypt } from "@/utils";
import { ElMessage, ElNotification } from "element-plus";
import { useStore } from "@/store";
import { clear } from "console";
const Router = useRouter();
const Store = useStore();
const isClickCode = ref(false);
const codeText = ref('获取验证码');
const user = ref({
  email: "",
  password: "",
  code: "",
});

//获取验证码
const getRegisterCode = () => {
  getCode(user.value.email);
  isClickCode.value = true;
  let countDown = 60;
  let timer = setInterval(() => {
    codeText.value = `${countDown--}秒`
    if (countDown < 0) {
      clearInterval(timer);
      isClickCode.value = false;
      codeText.value = '获取验证码'
    }
  }, 1000)
}

const successRegister = async () => {
  //判断是否为空
  if (user.value.email === '' || user.value.password === '') {
    ElMessage({
      message: '邮箱或密码不能为空',
      type: "error",
    })
    return;
  } else if (user.value.code === '') {
    ElMessage({
      message: '验证码不能为空',
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
  console.log(resKey);
  const enpwd = encrypt(resKey.publicKey, user.value.password);
  if (enpwd) {
    user.value.password = enpwd;
  }

  //注册
  register(user.value)
    .then((res) => {
      Router.replace({ path: "/login" });
      ElMessage({
        message: '注册成功！',
        type: "success",
      });
    })
    .catch((err) => {
      ElMessage({
        message: err.response.data,
        type: "error",
      });
      user.value.email = '';
      user.value.password = '';
      user.value.code = '';
    });
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

      .form-code {
        display: flex;
        justify-content: space-between;

        .code {
          width: 180px;
        }
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
    }
  }
}
</style>
