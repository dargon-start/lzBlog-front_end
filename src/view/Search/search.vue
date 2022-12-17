<template>
  <div>
    <el-row>
      <el-col :xs="0" :sm="3" :md="4" :lg="5" :xl="6"></el-col>
      <el-col :xs="24" :sm="18" :md="16" :lg="14" :xl="12">
        <div class="list">
          <div class="article">
            <cardList :artList="artList" />
          </div>
          <el-pagination v-model:currentPage="pageInfo.currentPage" v-model:page-size="pageInfo.pageSize"
            layout="prev, pager, next" :total="total" background />
        </div>

      </el-col>
      <el-col :xs="0" :sm="3" :md="4" :lg="5" :xl="6"></el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { searchArtice } from "@/network/article/article";
import { ElMessage } from "element-plus";
import { VueEvent } from "@/utils";
import { useRoute, useRouter } from "vue-router";
const Route = useRoute();
const artList = ref([]);
const pageInfo = ref({
  currentPage: 1,
  pageSize: 5,
})
const total = ref(0)

watch(
  [() => Route.query.keyword, pageInfo],
  () => {
    const keyword = Route.query.keyword;
    if (keyword !== "" && keyword !== undefined) {
      searchArtice((pageInfo.value.currentPage - 1) * pageInfo.value.pageSize, pageInfo.value.pageSize, keyword as string)
        .then((res) => {
          artList.value = res.data.list;
          total.value = res.data.total;
        })
        .catch(() => {
          ElMessage({
            message: "获取文章失败",
            type: "error",
          });
        });
    }
  },
  {
    immediate: true,
    deep: true
  }
);
</script>
<style lang="less" scoped>
.list {
  margin: 0 auto;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  .article {
    margin-top: 30px;
    width: 100%;
  }
}
</style>
