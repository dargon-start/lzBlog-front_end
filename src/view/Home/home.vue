<template>
  <div class="home">
    <div class="top">
      <div class="container">
        把意念深潜得下，何理不可得，把志气奋发起，何事不可做。
      </div>
    </div>
    <el-row class="content">
      <el-col :xs="0" :sm="1" :md="2" :lg="3" :xl="3"></el-col>
      <el-col :xs="24" :sm="14" :md="11" :lg="11" :xl="11" class="artical_list">
        <div class="sift">
          <span class="siftItem" :class="{'sift_active':pageInfo.type === 'hot'}" @click="()=>siftFn('hot')">最热</span>
          <span class="siftItem" :class="{'sift_active':pageInfo.type === 'new'}" @click="()=>siftFn('new')">最新</span>
        </div>
        <cardList :artList="artList" />
        <el-pagination :page-size="pageInfo.pageSize" :current-page="pageInfo.curPage" layout="prev, pager, next"
          :total="pageInfo.total" background @current-change='pageChange' />
      </el-col>
      <el-col :xs="0" :sm="9" :md="11" :lg="10" :xl="10" class="right_info">
        <userInfo class="userInfo"></userInfo>
      </el-col>
    </el-row>
    <div class="foot">
      <span class="iconfont">&#xe635;</span>
      <a href="http://beian.miit.gov.cn" target="_blank">豫ICP备2022018739号</a>
    </div>
  </div>

</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import cardList from "@/components/cardList/cardList.vue";
import userInfo from "@/components/user_info/user_info.vue";
import pagination from "@/base-ui/pagination/pagination.vue";
import { getArticList } from "@/network/article/article";
import { ElMessage } from "element-plus";
const artList = ref<any>([]);
const pageInfo = ref({
  curPage: 1,
  pageSize: 5,
  total: 0,
  type:'hot'
})
// 最新或最热按钮事件
const siftFn = (type:string)=>{
  switch(type){
    case 'new':
      pageInfo.value.type = 'new';
      pageInfo.value.curPage = 1;
      break;
    case 'hot':
      pageInfo.value.type = 'hot';
      pageInfo.value.curPage = 1;
      break;
  }
}

watch(pageInfo, () => {
  //获取文章列表
  getArticList((pageInfo.value.curPage - 1) * pageInfo.value.pageSize, pageInfo.value.pageSize,pageInfo.value.type)
    .then((res) => {
      artList.value = res.data.list;
      pageInfo.value.total = res.data.total
    })
    .catch((err) => {
      ElMessage({
        message: "获取文章失败",
        type: "error",
      });
    });
}, {
  deep: true,
  immediate: true
})

const pageChange = (curPage: number) => {
  console.log(curPage);
  pageInfo.value.curPage = curPage;
}


</script>
<style lang="less" scoped>
.home {
  width: 100%;

  .top {
    width: 100%;
    height: 65vh;
    background: url("@/assets/img/bg-logo.svg") no-repeat center;
    background-size: 100%;
    overflow: hidden;

    .container {
      position: relative;
      margin: 35vh auto;
      width: 40%;
      font-size: 20px;
      font-family: "Times New Roman", Times, serif;
      line-height: 30px;

      .typed-out {
        display: inline-block;
        position: absolute;
        width: 0;
        left: 0;
        top: 0;
        font-size: 2rem;
        overflow: hidden;
        white-space: nowrap;
        border-right: 0.1em solid #000;
        animation: typing 2s steps(20) forwards, blink 2s infinite;
      }
    }
  }

  .content {
    width: 100%;



    .artical_list {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      padding-right: 20px;
      overflow: hidden;

      .sift {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        box-sizing: border-box;
        padding: 10px;
        margin-bottom: 10px;
        .siftItem {
          padding: 8px 15px;
          margin-left: 10px;
          box-shadow: 0px 0px 5px #e0e0e0;
          cursor: pointer;
          border-radius: 3px;
          transition: all .25s;

          &:hover {
            transform: translateY(-2px);
          }
        }


        .sift_active {
          color: var(--primary-color);
        }
      }
    }

    .right_info {
      padding: 0 1%;
    }
  }
}

.foot {
  display: block;
  width: 100%;
  height: 80px;
  margin-top: 100px;
  line-height: 80px;
  text-align: center;

  a {
    margin-left: 5px;
    color: #919090;
  }
}
</style>
