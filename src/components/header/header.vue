<template>
  <div class="header">
    <el-row>
      <el-col :xs="3" :sm="0">
        <el-icon class="menu" :size="35" @click="changeDrawer">
          <Imenu />
        </el-icon>
      </el-col>
      <!-- 抽屉 -->
      <teleport to="body">
        <el-drawer v-model="visible" :show-close="false" :with-header="false" direction="ltr" size="33%">
          <div class="head_logo">
            <img src="@/assets/img/action.gif" alt="" class="logo" />
            <span class="logo_span">龙仔博客</span>
          </div>
          <div class="navigate">
            <router-link v-for="(item, index) in title" class="title" :to="item.link"
              :class="{ active: $route.path === item.link }" @click="changeDrawer">{{ item.name }}
            </router-link>
          </div>
        </el-drawer>
      </teleport>

      <!-- logo -->
      <el-col :xs="0" :sm="7" :md="9" :lg="6" :xl="6" @click="toHome">
        <div class="head_logo">
          <img src="@/assets/img/action.gif" alt="" class="logo" />
          <span class="logo_span">龙仔的个人博客</span>
        </div>
      </el-col>

      <!-- 搜索框 -->
      <el-col class="search" :xs="15" :sm="10" :md="7" :lg="7" :xl="7">
        <el-input v-model="keyword" class="s_input" size="large" placeholder="搜索文章" :suffix-icon="Search"
          @keyup.enter="search" />
      </el-col>
      <!-- nav导航 -->
      <el-col class="nav" :xs="0" :sm="0" :md="0" :lg="8" :xl="8">
        <router-link v-for="(item, index) in title" class="title" :to="item.link"
          :class="{ active: $route.path === item.link }">{{ item.name }}
        </router-link>
      </el-col>
      <!-- nav_down导航 -->
      <el-col class="nav_down" :xs="0" :sm="4" :md="5" :lg="0" :xl="0">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ $route.name }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item, index) in title">
                <router-link :to="item.link">{{ item.name }}
                </router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <!-- 登录按钮 -->
      <el-col class="login" :xs="6" :sm="3" :md="3" :lg="2" :xl="2">
        <el-dropdown v-if="Store.userInfo" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ Store.userInfo["name"] }}
          </span>
          <template #dropdown style="margin-top: 20px">
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button type="primary" @click="toLogin" v-else>登录</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { Search, ArrowDown, Menu as Imenu } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { useStore } from "@/store";
import { removeStorage, desensitize, VueEvent } from "@/utils";

const Store = useStore();
const Router = useRouter();
const Route = useRoute();
const title = [
  { name: "首页", link: "/home" },
  { name: "标签", link: "/category" },
  // { name: "工具", link: "/tools" },
  { name: '导航', link: '/navpage' },
  { name: "关于我", link: "/about" }

];

const toHome = () => {
  Router.push({ path: "/home" });
};

const toLogin = () => {
  Router.push({ path: "/login" });
};

//处理列表选项事件
const handleCommand = (command: string) => {
  switch (command) {
    case "logout":
      removeStorage("userInfo");
      Store.updateUserinfo();
  }
};

//控制抽屉
const visible = ref(false);
const changeDrawer = () => {
  visible.value = !visible.value;
};

//搜索功能
const keyword = ref("");
const search = () => {
  Router.push({ path: "/search", query: { keyword: keyword.value } });
};


//处理搜索页刷新页面回显输入框
if (Route.path == '/search') {
  keyword.value = Route.query.keyword as string;
}

</script>
<style lang="less" scoped>
.header {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 60px;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.336);
  box-shadow: 0 3px 3px #e4e1e1;

  .head_logo {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .logo {
      width: 35px;
      height: 35px;
    }

    .logo_span {
      font-size: 22px;
      margin-left: 5px;
      color: #0080ff;
      cursor: pointer;
    }
  }

  .menu {
    line-height: 60px;
    margin: 10px;
    cursor: pointer;
  }

  .nav {
    height: 100%;

    .title {
      display: inline-block;
      padding: 0 5px;
      margin: 5px 15px;
      line-height: 50px;
      cursor: pointer;

      &:hover {
        color: #0080ff;
        border-bottom: 2px solid #0080ff;
      }
    }

    .active {
      color: #0080ff;
      border-bottom: 2px solid #0080ff;
    }
  }

  .nav_down {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .el-dropdown-link {
      cursor: pointer;
      color: #0080ff;
      display: flex;
      align-items: center;
    }
  }

  .login {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-dropdown-link {
      display: block;
      height: 60px;
      line-height: 60px;
    }
  }

  .search {
    overflow: hidden;

    .s_input {
      width: 280px;
      margin: 10px;
    }
    
  }
}
@media only screen and (max-width: 500px) {
  .s_input {
    width: 200px !important;
    margin: 10px;
  }

  .logo_span {
    font-size: 16px !important;
    line-height: 20px !important;
  }
}
</style>
