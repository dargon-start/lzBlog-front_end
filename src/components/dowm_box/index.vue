<template>
  <div class="downBox">
    <div class="curType" @click="downHandler">
      {{ acitveItem.value }}
      <i v-if="!isdown" class="iconfont">&#xe6b9;</i>
      <i v-else class="iconfont">&#xe60a;</i>
    </div>
    <ul class="list" v-show="isdown">
      <li
        v-for="item in items"
        :key="item.id"
        class="item"
        @click="selitem(item)"
      >
        {{ item.value }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {defineProps, withDefaults, ref, defineExpose} from "vue";
import {Iitems} from "./type";
const props = withDefaults(
  defineProps<{
    items: Iitems[];
  }>(),
  {
    items: () => [],
  }
);

const acitveItem = ref(props.items[0]);
//处理下拉
const isdown = ref(false);
const downHandler = () => {
  isdown.value = !isdown.value;
};
//选择事件
const selitem = (item: Iitems) => {
  acitveItem.value = item;
  isdown.value = false;
};

//导出暴露的变量和方法
defineExpose({
  acitveItem,
});
</script>
<style lang="less" scoped>
.downBox {
  position: relative;
  width: 90px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  .curType {
    cursor: pointer;
  }
  .list {
    position: absolute;
    z-index: 6;
    left: -5px;
    top: 52px;
    width: 90px;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    overflow: hidden;
    .item {
      width: 90px;
      height: 45px;
    }
    .item:hover {
      background-color: #3388ff;
      opacity: 0.8;
    }
  }
}
</style>
