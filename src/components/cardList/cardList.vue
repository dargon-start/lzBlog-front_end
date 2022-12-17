<template>
  <div class="card_container">
    <transition-group
      name="staggered-fade"
      tag="ul"
      v-bind:css="false"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
    >
      <lzCard
        class="card"
        v-for="(item, index) in artList"
        :key="index"
        :data-index="index"
        :item-info="item"
      ></lzCard>
    </transition-group>
  </div>
</template>
<script lang="ts" setup>
import {ref, defineProps, withDefaults} from "vue";
import lzCard from "@/components/lz_card/lz_card.vue";
import gsap from "gsap";
const Props = withDefaults(
  defineProps<{
    artList: any;
  }>(),
  {
    artList: () => [],
  }
);

function beforeEnter(el: any) {
  el.style.opacity = 0;
  el.style.height = 0;
}
function enter(el: any, done: any) {
  gsap.to(el, {
    opacity: 1,
    height: "150px",
    delay: el.dataset.index * 0.01,
    onComplete: done,
  });
}
</script>
<style lang="less" scoped>
.card_container {
  width: 100%;
}
</style>
