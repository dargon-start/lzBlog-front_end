<template>
  <template v-if="labelList">
    <div
      v-for="(item, index) in labelList"
      class="item"
      :class="{active: item.name == acitveLable}"
      @click="handleCategory(item.name)"
      :style="{'background-color': `${colorList[index % 30]}a5`, ...tagStyle}"
    >
      <span class="name">{{ item.name }}</span>
      <!-- <span v-if="item.num" class="num">{{ item.num }}</span> -->
    </div>
  </template>
</template>
<script lang="ts" setup>
import {defineProps, withDefaults, ref, defineExpose, defineEmits} from "vue";
import {getLableList} from "@/network/label/label";
import {ElMessage} from "element-plus";
import {colorList} from "@/utils/config";
interface itemType {
  name: string;
  num?: number;
}

const props = withDefaults(
  defineProps<{
    tagStyle?: any;
    activeLable?: string;
  }>(),
  {}
);

const emits = defineEmits(["handLabel"]);
const labelList = ref<{id: number; name: string}[]>([]);
// 获取标签列表
getLableList()
  .then((res) => {
    console.log(res);
    labelList.value = res.data;
  })
  .catch((err) => {
    ElMessage({
      message: "获取标签失败！",
      type: "error",
    });
  });
const acitveLable = ref("");
if (props.activeLable) {
  acitveLable.value = props.activeLable;
}
const handleCategory = (lable: string) => {
  emits("handLabel", lable);
  acitveLable.value = lable;
};
</script>
<style lang="less" scoped>
.item {
  display: inline-block;
  padding: 10px 15px;
  box-shadow: 0 0 10px #e0e0e0;
  border-radius: 3px;
  margin: 10px;
  transition: all 0.5s;
  cursor: pointer;

  .name {
    color: #0e0e0e;
  }

  .num {
    display: inline-block;
    padding: 3px;
    border-radius: 5px;
    background-color: rgb(255, 91, 100);
    margin-left: 3px;
    font-size: 14px;
  }

  &:hover {
    transform: scale(1.3);
  }
}
.active {
  transform: scale(1.3);
}
</style>
