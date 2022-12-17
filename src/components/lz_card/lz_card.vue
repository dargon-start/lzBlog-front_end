<template>
  <div class="card_list" @click="toDetail">
    <div class="title">{{ itemInfo.title }}</div>
    <div class="content">{{ itemInfo.synopsis }}</div>
    <div class="bottom">
      <span class="bot_list"><i class="iconfont icon">&#xe611;</i>{{ itemInfo.glanceNum }}</span>
      <span class="bot_list">
        <i class="iconfont icon">&#xe609; </i>
        {{ formatUtcString(itemInfo.createTime) }}
      </span>
      <span class="bot_list">
        <i class="iconfont icon">&#xe687;</i>
        <span class="lable_item" v-for="(item, index) in itemInfo.labelList">{{ item.name }} &nbsp</span>
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, withDefaults } from "vue";
import { useRouter } from "vue-router";
import { formatUtcString } from "@/utils";
const Router = useRouter();
//导入类型
interface IProps {
  itemInfo?: any;
}
const props = withDefaults(defineProps<IProps>(), {
  itemInfo: {
    title: "",
    content: "",
    glanceNum: 0,
    updateTime: "",
    labelList: [""],
  },
});


//跳转到详情页
const toDetail = () => {
  // const newRoute = Router.resolve({ path: "/article", query: { artId: props.itemInfo.articleId } });
  // window.open(newRoute.href, '_blank')
  Router.push({ path: "/article", query: { artId: props.itemInfo.articleId } })
};
</script>
<style lang="less" scoped>
.card_list {
  box-sizing: border-box;
  height: 170px;
  margin: 0 2% 2% 2%;
  padding: 20px 30px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px #e0e0e0;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;

  &:hover {
    box-shadow: 0px 0px  5px #8e9395;
    transform: translateY(-2px);
  }

  .title {
    max-width: 100%;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: all 0.4s;

    &:hover {
      color: #0080ff;
    }

    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 2px;
      background-color: #0080ff;
      margin-top: 10px;
      visibility: hidden;
      transform: scaleX(0);
      transition: all 0.3s;
    }

    &:hover::after {
      visibility: visible;
      transform: scaleX(1);
    }
  }

  .content {
    color: #525151;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 20px;
    text-indent: 10px;
  }

  .bottom {
    color: #656363;

    .bot_list {
      display: inline-block;
      margin-right: 10px;

      .icon {
        margin: 0 4px;
        color: #0080ff;
      }
    }
  }
}
</style>
