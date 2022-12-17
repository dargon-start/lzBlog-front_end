<template>
  <div class="Editor">
    <Toolbar :editor="EditorRef" :defaultConfig="ToolbarConfig" mode="simple" />
    <Editor
      class="editor-content-view"
      v-model="HtmlContent"
      :defaultConfig="EditorConfig"
      mode="simple"
      @onCreated="HandleCreated"
    />
    <el-button :disabled="isCan" type="primary" class="commitBtn" @click="responseEvent">{{
      btnTitle
    }}</el-button>
  </div>
</template>
<script lang="ts" setup>
import {
  ref,
  shallowRef,
  withDefaults,
  defineProps,
  defineExpose,
  defineEmits,
  watch
} from "vue";
import {IDomEditor} from "@wangeditor/editor";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
const props = withDefaults(
  defineProps<{
    btnTitle?: string;
    rsName?:string;
  }>(),
  {
    btnTitle: "回复",
    rsName:'请输入...'
  }
);

const emits = defineEmits(["responseEvent", "editorBlur"]);
let EditorRef = shallowRef<IDomEditor>();
let HtmlContent = ref("");
let isCan = ref(true)

watch(HtmlContent,(newValue)=>{
  if(newValue === '<p><br></p>'){
    isCan.value = true
  }else{
    isCan.value = false
  }
})

const HandleCreated = (editor: IDomEditor) => {
  EditorRef.value = editor; // 记录 editor 实例，重要！
};

const EditorConfig = {
  scroll: true,
  placeholder: props.rsName,
  autoFocus: true,
};

const ToolbarConfig = {
  toolbarKeys: ["bulletedList", "numberedList", "emotion"],
};

const clearFn = () => {
  EditorRef.value?.clear();
};

//回复按钮事件
const responseEvent = () => {

  
  emits("responseEvent", HtmlContent.value, clearFn);
};

defineExpose({
  HtmlContent,
});
</script>
<style lang="less" scoped>
.Editor {
  position: relative;
  width: 100%;
  margin: 10px 0 50px 0;

  ::v-deep(.w-e-text-container) {
    background-color: #f2f3f5;
    min-height: 80px;
    p {
      line-height: 1;
    }
  }

  ::v-deep(.w-e-panel-content-emotion) {
    width: 50vw;
    max-width: 300px;
  }

  ::v-deep(.w-e-bar) {
    background-color: #f2f3f5;
  }

  .commitBtn {
    position: absolute;
    right: 10px;
    bottom: -40px;
  }
}
</style>
