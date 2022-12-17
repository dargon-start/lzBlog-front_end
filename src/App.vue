<template>
  <div class="app">
    <Lzheader v-if="$route.meta.isShowHead"></Lzheader>
    <router-view v-slot="{ Component, route }">
      <transition name="nav" mode="out-in">
        <component :is="route.path === '/navpage' ? Component : null"></component>
      </transition>
      <div class="bg" v-if="route.meta.isShowHead && route.path !== '/home'"></div>
      <transition name="fade" mode="out-in">
        <component :is="route.path !== '/navpage' ? Component : null" class="page"></component>
      </transition>
    </router-view>
    <el-backtop :right="50" :bottom="100">
      <div style="
        height: 100%;
        width: 100%;
        background-color: var(--el-bg-color-overlay);
        box-shadow: var(--el-box-shadow-lighter);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
        border-radius: 50%;
      ">
        <el-icon size="25">
          <Top />
        </el-icon>
      </div>
    </el-backtop>
  </div>
</template>
<script lang="ts" setup>
import Lzheader from "@/components/header/header.vue";
import { useStore } from "@/store/index";
import { Top } from '@element-plus/icons-vue'
import { getStorage, removeStorage } from "@/utils";
import { getUserInfo } from "@/network/user/user";
import { ElMessage } from "element-plus";
const Store = useStore();
Store.updateUserinfo()
</script>
<style lang="less" scoped>
.app {
  height: 100%;

  .bg {
    width: 100%;
    height: 60px;
  }

}

.nav-enter,
.nav-leave-to {
  transform: translateY(-100%);
}

.nav-enter-to,
.nav-leave {
  transform: translateY(0);
}

.nav-enter-active,
.nav-leave-active {
  transition: all 1s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  height: 0;
}
</style>
