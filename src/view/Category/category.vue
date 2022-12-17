<template>
  <el-row>
    <el-col :xs="0" :sm="3" :md="4" :lg="5" :xl="6"></el-col>
    <el-col :xs="24" :sm="18" :md="16" :lg="14" :xl="12">
      <div class="category">
        <div class="top_type">
          <categroy @handLabel="handLabel" :activeLable="(route.query.labelName as string)"></categroy>
        </div>
        <div class="article">
          <cardList :artList="artList" />
        </div>
        <el-pagination v-model:currentPage="pageInfo.currentPage" v-model:page-size="pageInfo.pageSize"
          layout="prev, pager, next" :total="total" background />

      </div>
    </el-col>

    <el-col :xs="0" :sm="3" :md="4" :lg="5" :xl="6"></el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import categroy from "@/components/streaming_cpm/streaming_cpm.vue";
import cardList from "@/components/cardList/cardList.vue";
import { getArticListBylabel } from "@/network/article/article";
import { ElMessage } from "element-plus";

const route = useRoute();
const curLabel = ref<string>('');
const pageInfo = ref({
  currentPage: 1,
  pageSize: 5,
})
const total = ref(0)

//进入页面curLabel=route.labelName
curLabel.value = route.query.labelName as string;

//获取文章
const artList = ref([]);
const getlistBylabel = (offset: number, size: number, lableName: string) => {
  getArticListBylabel(offset, size, lableName)
    .then((res) => {
      console.log(res);
      artList.value = res.data.list;
      total.value = res.data.total;
    })
    .catch((err) => {
      ElMessage({
        message: "获取文章失败",
        type: "error",
      });
    });
};

watch(pageInfo, () => {
  getlistBylabel((pageInfo.value.currentPage - 1) * pageInfo.value.pageSize, pageInfo.value.pageSize, curLabel.value);
}, {
  immediate: true,
  deep: true
})

//点击label
const handLabel = (lableName: string) => {
  curLabel.value = lableName;
  pageInfo.value.currentPage = 1;//重置为1
  getlistBylabel((pageInfo.value.currentPage - 1) * pageInfo.value.pageSize, pageInfo.value.pageSize, lableName);
};


</script>
<style lang="less" scoped>
.category {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  margin-top: 20px;
  padding-bottom: 50px;

  .top_type {
    width: 100%;
  }

  .article {
    margin-top: 30px;
    width: 100%;
  }
}
</style>
