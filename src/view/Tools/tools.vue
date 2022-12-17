<template>
  <el-row>
    <el-col :span="5" :xs="0" :sm="2" :md="3" :lg="4"></el-col>
    <el-col :span="14" :xs="24" :sm="20" :md="18" :lg="16">
      <div class="Tools">
        <!-- 工具分类表 -->
        <div v-for="(item, index) in tools" class="site_category">
          <h3>{{ item.title }}</h3>
          <section class="site_list">
            <a
              v-for="(site, index) in item.site"
              class="site_item"
              :href="site.url"
              target="_blank"
            >
              <img
                :src="`/web_logo/${site.img}`"
                alt=""
                class="site_img"
                :style="site.style"
              />
              <span class="site_name">{{ site.name }}</span>
            </a>
          </section>
        </div>
      </div>
      </el-col>
    <el-col :span="5" :xs="0" :sm="2" :md="3" :lg="4"></el-col>
  </el-row>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {tools} from "./config";
</script>
<style lang="less" scoped>
.Tools {
  box-sizing: border-box;
  margin: 20px auto;
  overflow: hidden;

  .site_category {
    margin: 10px;
    padding: 20px 30px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0px 0px 10px #e0e0e0;

    .site_list {
      display: flex;
      flex-wrap: wrap;
      .site_item {
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0px 0px 10px #e0e0e0;
        border-radius: 10px;
        padding: 7px 10px;
        margin: 10px;
        transition: all 0.7s;
        .site_img {
          width: 40px;
          height: 40px;
        }
        .site_name {
          display: block;
          margin-left: 5px;
        }

        &:hover {
          background-color: #0080ee;
          box-shadow: 0px 0px 10px #e0e0e0;
        }
      }
    }
  }
}
</style>
