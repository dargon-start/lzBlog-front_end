<template>
  <div class="pagination">
    <button :disabled="pageNo == 1" @click="$emit('getPageNo', pageNo - 1)">
      上一页
    </button>
    <button v-show="startAndend.start > 1" @click="$emit('getPageNo', 1)">
      1
    </button>
    <button v-show="startAndend.start > 2">···</button>

    <button
      v-for="index in showNum"
      :key="index"
      @click="$emit('getPageNo', startAndend.start + index - 1)"
      :class="{active: pageNo == startAndend.start + index - 1}"
    >
      {{ startAndend.start + index - 1 }}
    </button>

    <button v-show="startAndend.end < totalPage - 1">···</button>
    <button
      v-show="startAndend.end < totalPage"
      @click="$emit('getPageNo', totalPage)"
    >
      {{ totalPage }}
    </button>
    <button
      :disabled="pageNo == totalPage"
      @click="$emit('getPageNo', pageNo + 1)"
    >
      下一页
    </button>

    <button style="margin-left: 30px">共{{ total }}条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["pageNo", "pageSize", "total", "continuous"],
  computed: {
    //总页数
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    startAndend() {
      let start = this.pageNo - parseInt(this.continuous / 2);
      let end = this.pageNo + parseInt(this.continuous / 2);
      if (this.continuous > this.totalPage) {
        start = 1;
        end = this.totalPage;
      } else {
        //start应该大于0
        if (start < 1) {
          start = 1;
          end = this.continuous;
        }
        if (end > this.totalPage) {
          end = this.totalPage;
          start = this.totalPage - this.continuous + 1;
        }
      }
      return {start, end};
    },
    showNum() {
      return this.startAndend.end - this.startAndend.start + 1;
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
  .active {
    background-color: rgb(36, 36, 95);
  }
}
</style>
