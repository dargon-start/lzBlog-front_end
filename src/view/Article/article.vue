<template>
  <el-row>
    <el-col :xs="1" :sm="1" :md="2" :lg="3">
      <div class="grid-content ep-bg-purple" />
    </el-col>
    <el-col :xs="22" :sm="15" :md="15" :lg="15">
      <!-- 文章内容 -->
      <div class="editor" v-if="artDetail">
        <div class="article_head">
          <div class="title">{{ artDetail.title }}</div>
          <div class="article_info">
            <span>
              <i class="iconfont">&#xe645;</i>
              龙仔
            </span>
            <span>
              <i class="iconfont">&#xe609;</i>
              {{ formatUtcString(artDetail.createTime) }}
            </span>
            <span>
              <i class="iconfont">&#xe611;</i>
              {{ artDetail.glanceNum }}
            </span>
            <span>
              <i class="iconfont">&#xe687;</i>
              {{
                artDetail.labelList &&
                artDetail.labelList.map((item: any) => item.name).join(" ")
              }}
            </span>
          </div>
        </div>
        <div class="article_content" ref="artContent">
          <Editor
            class="editor-content-view"
            style="min-height: 500px; overflow-y: hidden"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
          />
        </div>
        <!-- <CateLogue :headers="headers" class="catelogue"></CateLogue> -->
        <catalogue :headers="headers"  class="catelogue"></catalogue>
      </div>
      <!-- 评论 -->
      <div class="commit">
        <Toolbar
          :editor="commitEditorRef"
          :defaultConfig="CommitToolbarConfig"
          mode="simple"
        />
        <Editor
          class="editor-content-view"
          style="min-height: 100px; overflow-y: hidden"
          v-model="commitHtml"
          :defaultConfig="commitEditorConfig"
          mode="simple"
          @onCreated="commitHandleCreated"
        />
        <el-button :disabled="iscanComment" type="primary" class="commitBtn" @click="handComment"
          >评论</el-button
        >
      </div>
      <div class="commitContainer" v-if="commentList">
        <ul>
          <li v-for="(item, index) in commentList" :key="item.id">
            <header class="userInfo">
              <span>{{ item.user.name }}</span>
              <span class="commit_time">{{
                formatUtcString(item.createAt)
              }}</span>
            </header>
            <div class="com_content" v-html="item.content"></div>
            <div>
              <span @click="handReponse(item)" class="operation">
                <span class="com_reponse">
                  {{ item.isopen ? "取消回复" : "回复" }}
                </span>
                <el-icon :size="18" class="response_icon">
                  <i-ep-ChatLineSquare />
                </el-icon>
              </span>
              <LzEditor
                v-if="item.isopen"
                @responseEvent="
                  (content, clearFn) => {
                    responseEvent(content, item.id, clearFn);
                  }
                "
                :rsName="'回复:'+item.user.name"
              >
              </LzEditor>
            </div>
            <!-- 二级评论 -->
            <div class="son_commit" v-if="item.childComment">
              <ul>
                <li
                  v-for="(sonComment, soni) in item.childComment"
                  :key="sonComment.id"
                >
                  <header class="userInfo">
                    <span>{{ sonComment.user.name }}</span>
                    <!-- 回复人 -->
                    <span class="mlr_10" v-if="item.id !== sonComment.commentId">回复:</span>
                    <span v-if="item.id !== sonComment.commentId">{{ sonComment.parentComment.pname }}</span>
                    <span class="commit_time">{{
                      formatUtcString(sonComment.createAt)
                    }}</span>
                  </header>
                  <div class="com_content" v-html="sonComment.content"></div>
                  <div v-if="item.id !== sonComment.commentId" class="beReplied" v-html="sonComment.parentComment.content"></div>
                  <div>
                    <span
                      @click.capture="handReponse(sonComment)"
                      class="operation"
                    >
                      <span class="com_reponse">
                        {{ sonComment.isopen ? "取消回复" : "回复" }}
                      </span>
                      <el-icon :size="18" class="response_icon">
                        <i-ep-ChatLineSquare />
                      </el-icon>
                    </span>
                    <LzEditor
                      v-if="sonComment.isopen"
                      @responseEvent="
                        (content, clearFn) => {
                          responseEvent(content, sonComment.id, clearFn);
                        }
                      "
                      :rsName="'回复:' + sonComment.user.name"
                    ></LzEditor>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </el-col>
    <el-col :xs="1" :sm="7" :md="6" :lg="5">
      <div class="grid-content ep-bg-purple" />
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import catalogue from 'wangeditor-catalogue';

import 'wangeditor-catalogue/css';

import {useRouter, useRoute} from "vue-router";
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  nextTick,
  getCurrentInstance,
  watch
} from "vue";
import {useStore} from "@/store";

import {
  createComment,
  replyComment,
  getComment,
} from "@/network/comment/comment";

import {IDomEditor} from "@wangeditor/editor";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";

import {getArticleInfo} from "@/network/article/article";

// import CateLogue from "@/components/catalogue";
import {formatUtcString} from "@/utils";
import {ElMessage, ElMessageBox} from "element-plus";

import LzEditor from "@/components/editor/Editor.vue";


const Router = useRouter();
const Route = useRoute();
const Store = useStore();

const artContent = ref<HTMLDivElement>();
const artId = Number(Route.query.artId);
const headers = ref<any>();

let artDetail = ref<any>(undefined);
let commentList = ref<any>(undefined);
let mode = "default";
// 编辑器实例，必须用 shallowRef
let editorRef = shallowRef<IDomEditor>();

// 内容 HTML
const valueHtml = ref("");

let editorConfig = {
  readOnly: true,
  scroll: true,
};

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  headers.value = editor.getElemsByTypePrefix("header");
  console.log(headers.value,'ppppppppppppp');
};

const getArticleDetail = () => {
  //请求文章详情
  getArticleInfo(artId).then((res) => {
    console.log(res);

    artDetail.value = res.data;
    valueHtml.value = `${res.data.content}`;
    nextTick(() => {
      handleCopy();
    });
  });
};
// 获取评论
const getArticleComment = () => {
  getComment(artId).then((res) => {
    // 添加控制回复控件字段
    let clist = res.data;
    if (res.data) {
      let len = clist.length;
      // isopen.value = new Array(len).fill(false)
      for (let i = 0; i < len; i++) {
        clist[i].isopen = false;
        if (clist.childComment) {
          for (let j = 0; j < clist.childComment.length; j++) {
            clist[i].childComment[j].isopen = false;
          }
        }
      }
    }
    commentList.value = clist;
  });
};

// 异步获取内容
onMounted(() => {
  console.log("mounted");
  getArticleDetail();
  getArticleComment();
});
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

/* ----  处理一键复制功能   开始 ----*/

//获取复制按钮

function handleCopy() {
  const preEl = document.querySelectorAll("pre");
  preEl.forEach((preItem) => {
    const copyBtn = document.createElement("span");
    copyBtn.className = "copyBtn";
    copyBtn.innerHTML = "复制";
    preItem.appendChild(copyBtn);

    //添加事件
    copyBtn.addEventListener("click", function () {
      // console.log(preItem.innerText);
      let codeText = preItem.innerText;
      codeText = codeText.replace("复制", "");
      console.log(codeText);

      let save = function (e: any) {
        e.clipboardData.setData("text/plain", codeText);
        e.preventDefault();
      };
      document.addEventListener("copy", save);
      document.execCommand("copy");
      document.removeEventListener("copy", save);
      ElMessage({
        type: "success",
        message: "复制成功",
      });
    });
  });
}

/* ----  处理一键复制功能   结束 ----*/

/* ----  评论  ----- */
let commitEditorRef = shallowRef<IDomEditor>();
let commitHtml = ref("");
let iscanComment = ref(true);

const commitHandleCreated = (editor: IDomEditor) => {
  commitEditorRef.value = editor; // 记录 editor 实例，重要！
};

const commitEditorConfig = {
  scroll: true,
  placeholder: "请发表你的评论...",
};

const CommitToolbarConfig = {
  toolbarKeys: ["bulletedList", "numberedList", "emotion"],
};

watch(commitHtml,(newValue)=>{
  if(newValue === '<p><br></p>'){
    iscanComment.value = true
  }else{
    iscanComment.value = false
  }
})

//评论按钮事件
const handComment = async () => {
  if (Store.userInfo) {
    if(commitHtml.value !== '<p><br></p>') {
    await createComment(commitHtml.value, artId);
    commitEditorRef.value && commitEditorRef.value.clear(); // 记录 editor 实例，重要！
    getArticleComment();  
  }
  } else {
    ElMessageBox.confirm("您未登录，登录后可发表评论！", "提示", {
      confirmButtonText: "去登录",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        Router.push({path: "/login"});
      })
      .catch(() => {});
  }


  
};


// 处理是否展示回复框
const handReponse = (comment: any) => {
  if (Store.userInfo) {
    comment.isopen = !comment.isopen;
  } else {
    ElMessageBox.confirm("您未登录，登录后可发表评论！", "提示", {
      confirmButtonText: "去登录",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        Router.push({path: "/login"});
      })
      .catch(() => {});
  }
};

//处理二级评论回复
const responseEvent = async (
  content: string,
  commentId: number,
  clearFn: () => void
) => {
  if (Store.userInfo) {
    await replyComment(commentId, content, artId);
    clearFn();
    getArticleComment();
  } else {
    ElMessageBox.confirm("您未登录，登录后可发表评论！", "提示", {
      confirmButtonText: "去登录",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        Router.push({path: "/login"});
      })
      .catch(() => {});
  }
};
</script>
<style lang="less" scoped>
.editor {
  position: relative;
  padding-bottom: 100px;
  margin-top: 50px;

  .article_head {
    margin-bottom: 20px;

    .title {
      max-width: 100%;
      font-size: 26px;
      line-height: 40px;
      font-weight: 500;
      margin-bottom: 20px;
      overflow: hidden;
    }

    .article_info {
      color: #7f7f7f;

      span {
        margin-right: 10px;
      }

      .iconfont {
        color: #0080ff;
      }
    }
  }

  .article_content {
    margin-left: -10px;

    ::v-deep(.editor-content-view) {
      padding: 0 10px;
      margin-top: 20px;
      overflow-x: auto;

      p,
      li {
        white-space: pre-wrap;
      }

      blockquote {
        border-left: 8px solid #d0e5f2;
        padding: 10px 10px;
        margin: 10px 0;
        background-color: #f1f1f1;
      }

      code {
        font-family: monospace;
        font-size: 16px;
        background-color: #eaf2ff;
        padding: 3px;
        border-radius: 3px;
      }

      pre {
        position: relative;
      }

      .copyBtn {
        display: block;
        position: absolute;
        right: 5px;
        top: 5px;
        width: 40px;
        height: 25px;
        font-size: 12px;
        text-align: center;
        line-height: 25px;
        border-radius: 3px;
        background-color: #d0e5f2;
        cursor: pointer;
      }

      .copyBtn:hover {
        background-color: #ccc;
      }

      pre > code {
        display: block;
        font-family: monospace;
        padding: 10px;
        border-radius: 10px;
        background-color: #f8f8f8;
      }

      td,
      th {
        border: 1px solid #ccc;
        min-width: 50px;
        height: 20px;
      }

      th {
        background-color: #4e96e7;
      }

      ul,
      ol {
        padding-left: 20px;
      }

      input[type="checkbox"] {
        margin-right: 5px;
      }

      .w-e-image-container {
        width: 95% !important;
      }

      .table-container {
        border: none;
      }
    }
  }

  .catelogue {
    position: fixed;
    right: 0;
    top: 100px;
  }
}

.commit {
  position: relative;
  margin-bottom: 20px;
  // overflow: hidden;

  ::v-deep(.w-e-text-container) {
    min-height: 100px;
    background-color: #f2f3f5;

    p {
      line-height: 1;
    }
  }

  ::v-deep(.w-e-panel-content-emotion) {
    width: 60vw;
    max-width: 300px;
  }

  .commitBtn {
    position: absolute;
    right: 10px;
    bottom: -40px;
  }
}

.commitContainer {
  margin-bottom: 120px;
  color: #333;

  > ul {
    list-style-type: none;
  }

  .userInfo {
    line-height: 40px;

    .commit_time {
      margin-left: 20px;
      color: #7f7f7f;
    }
  }

  .com_content {
    padding: 5px 30px;

    ul {
      list-style-type: disc !important;
    }
  }
  .beReplied{
    padding: 10px;
    background:#f2f3f5;
    border: 1px solid #e4e6eb;
    border-radius: 5px;

    ::v-deep(p){
      margin: 5px;
    }

    ::v-deep(ul){
      margin-left: 15px;
    }
  }

  .operation {
    display: inline-block;
    color: rgb(125, 124, 124);
    cursor: pointer;

    &:hover {
      color: #0080ff;
    }

    .com_reponse {
      font-size: 12px;
    }

    .response_icon {
      vertical-align: middle;
    }
  }

  .son_commit {
    margin-left: 30px;
    margin-top: 10px;
    border-radius: 10px;
    padding: 10px 20px;
    background-color: #f9fafb;

    > ul {
      list-style-type: none;
    }
  }
}

@media screen and (max-width: 768px) {
  .catelogue {
    display: none;
  }
}
</style>
