<template>
  <div class="info">
    <div class="info_top">
      <img src="@/assets/img/xiaowang.jpg" alt="" class="avart" />
      <div class="name">龙仔</div>
      <div class="art_info">
        <ul class="info_item" v-for="item in info" :key="item[0]">
          <li class="item_li">
            {{ item[0] }}
          </li>
          <li class="item_li">{{ item[1] }}</li>
        </ul>
      </div>
      <section class="tags">
        <div class="head_tag">
          <el-icon style="color: #0080ee; margin-right: 5px; vertical-align: middle">
            <i-ep-PriceTag />
          </el-icon>
          <span class="tag_title">标签</span>
        </div>
        <div class="tag_list">
          <div class="tag_item" v-for="(item, index) in labelList" :style="{
            'background-color': `${colorList[index % 30]}a5`,
          }" @click="toCategory(item.name)">
            {{ item.name }}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { getTotalArtandlabel } from "@/network/article/article";
import { getLableList } from "@/network/label/label";
import { ElMessage } from "element-plus";
import { colorList } from "@/utils/config";
import { useRouter } from "vue-router";
const router = useRouter();
const info = reactive([
  ["文章", 0],
  ["标签", 0],
]);

getTotalArtandlabel().then((res) => {
  console.log(res);
  info[0][1] = res.data.articleNum;
  info[1][1] = res.data.labelNum;
});

const labelList = ref<{ id: number; name: string }[]>([]);
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

//路由跳转
const toCategory = (labelName: string) => {
  router.push({ path: "/category", query: { labelName } });
};
</script>
<style lang="less" scoped>
.info {
  width: 100%;
  min-width: 300px;
  max-width: 400px;
  background-color: #fff;
  box-shadow: 0px 0px 10px #e0e0e0;
  border-radius: 5px;
  overflow: hidden;

  .info_top {
    position: relative;
    overflow: hidden;

    .avart {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%);
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 10px auto;
    }

    .name {
      position: absolute;
      width: 100%;
      top: 90px;
      text-align: center;
      margin: 15px 0;
    }

    .art_info {
      display: flex;
      justify-content: space-between;
      margin-top: 140px;

      .info_item {
        flex: 1;
        text-align: center;
        margin: 10px 0;
        list-style-type: none;

        &:first-child {
          border-right: 2px solid #323232;
        }


        .item_li {
          margin-top: 10px;

          &:first-child {
            font-size: 18px;
          }

          &:last-child {
            font-style: 14px;
          }
        }
      }
    }

    .tags {
      width: 100%;

      .head_tag {
        padding-left: 15px;
        margin: 15px 0;
        font-size: 20px;
        overflow: hidden;

        .tag_title {
          display: inline-block;
          margin-top: 0px;
        }
      }

      .tag_list {
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
        padding: 10px 10px;


        .tag_item {
          width: 40%;
          height: 30px;
          margin: 10px;
          box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
          border-radius: 5px;
          text-align: center;
          line-height: 30px;
          cursor: pointer;
          transition: all 0.5s;

          &:hover {
            transform: scale(1.1);
          }
        }
      }
    }
  }
}
</style>
