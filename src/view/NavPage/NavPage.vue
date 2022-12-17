<template>
  <div class="navpage">
    <!-- 搜索框 -->
    <div class="search">
      <DownBox :items="engines" ref="downBox"></DownBox>
      <input
        type="text"
        class="keyword"
        v-model="keyword"
        @keydown="Inputsearch"
      />
             
      <div class="label" type="button" @click="search">搜索</div>
    </div>
    <!-- 常用站点 -->
    
    <div class="comSite">
      <WebSites></WebSites>
    </div>
    <!-- 切换按钮 -->
    <router-link to="/home" class="toHome iconfont">&#xe62a;</router-link>
  </div>
</template>
<script lang="ts" setup>
import {ref, onMounted} from "vue";

//导入组件
import DownBox from "@/components/dowm_box/index.vue";
import WebSites from "@/components/website/website.vue";
const engines = [
  {
    id: 1,
    url: "https://www.baidu.com/s",
    value: "百度",
    sk: "wd",
  },
  {
    id: 2,
    url: "https://juejin.cn/search",
    value: "掘金",
    sk: "query",
  },

  {
    id: 3,
    url: "https://search.bilibili.com/all",
    value: "b站",
    sk: "keyword",
  },
  {
    id: 4,
    url: "https://www.jianshu.com/search",
    value: "简书",
    sk: "q",
  },
  {
    id: 5,
    url: "https://so.csdn.net/so/search",
    value: "CSDN",
    sk: "q",
  },
];
//-----搜索功能开始-----
//搜索关键字
const keyword = ref("");
const downBox = ref();
onMounted(() => {});
const search = () => {
  const searchType = downBox.value.acitveItem.url;
  const sk = downBox.value.acitveItem.sk;
  window.open(`${searchType}?${sk}=${keyword.value}`);
};
const Inputsearch = (e: any) => {
  if (e.keyCode === 13) {
    search();
  }
};
//---搜索功能结束-------

</script>
<style lang="less" scoped>
.navpage {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(@/assets/img/bg1.jpg) no-repeat center;
  background-size: 100% 100%;
  overflow: hidden;
  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 150px auto 60px;
    width: 40%;
    min-width: 400px;
    height: 50px;
    padding: 0 5px;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 10px;

    .keyword {
      box-sizing: border-box;
      flex: 1;
      height: 100%;
      background-color: rgba(255, 255, 255, 0);
      outline: none;
      border: none;
    }
    .label {
      width: 100px;
      height: 40px;
      color: #fff;
      background-color: rgb(51, 136, 255);
      text-align: center;
      line-height: 40px;
      border-radius: 15px;
      cursor: pointer;
    }
  }
  .comSite {
    width: 50%;
    margin: 0px auto;
  }
  .toHome {
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translate(-50%);
    font-size: 30px;
    color: #f0f0f0;
  }
}
</style>
