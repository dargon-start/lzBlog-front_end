<template>
  <div class="wrapper">
    <!-- tab切换 -->
    <div class="tabs">
      <span v-for="(tab,index) in tabs" class="tab" :class="{activeTab:tab === activeTab}"
        @click="tabTriger(tab)">{{tab}}</span>
    </div>
    <div class="container">
      <template v-for="(item, index) in allsite[activeTab]">
        <div class="item">
          <a :href="item.url" class="siteItem" target="_blank">
            <img :src="item.icon" alt="" class="icon" />
            <span class="siteName">{{ item.name }}</span>
          </a>
          <el-icon v-if="activeTab === '常用'" class="delete" color="#e0e0e0"
            @click.stop="delwebsite($event,item.id)"><i-ep-Close /></el-icon>
        </div>
      </template>
      <!-- 添加站点 -->
      <div class="addButton" @click="changeIsshow" v-if="activeTab === '常用'">
        <i class="iconfont iconAdd">&#xe7db;</i>
      </div>
      <!-- 弹出框 -->
      <el-dialog v-model="dialogFormVisible" title="添加站点" width="400px">
        <el-form :model="site" ref="siteForm" :rules="rules">
          <el-form-item label="站点名" :label-width="labWidth" prop="name">
            <el-input v-model="site.name" autocomplete="off" placeholder="百度" />
          </el-form-item>
          <el-form-item label="站点地址" :label-width="labWidth" prop="url">
            <el-input v-model="site.url" autocomplete="off" placeholder="https://baidu.com" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="resetForm(siteForm)">取消</el-button>
            <el-button type="primary" @click="siteAdd(siteForm)">添加</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ref, reactive} from "vue";
import {getSiteList, addSite,delsite,getToolList} from "@/network/nav_page/nav_page";
import {useStore} from "@/store";
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";
import type {FormInstance} from "element-plus";

const Store = useStore();
const Router = useRouter();

let allsite = ref<any>({})
let siteForm = ref<FormInstance>()
let rules = reactive({
  name:[{required: true,message:'请输入网站名称',trigger:'blur'}],
  url:[{required: true,message:'请输入网站地址',trigger:'blur'}]
})
Store.userInfo &&
  getSiteList(Store.userInfo!["id"])
    .then((res) => {
      allsite.value['常用']=res.data
    })
    .catch((err) => {
      if(err.response){
        ElMessage({
          message: err.response.data,
          type: "error",
        });
      }else{
        ElMessage({
          message: err,
          type: "error",
        });
      }
    });

/* --- 添加站点开始  ----- */
const labWidth = "80px";
//处理添加站点的card是否显示
const dialogFormVisible = ref(false);
function changeIsshow() {
  if (Store.userInfo) {
    dialogFormVisible.value = !dialogFormVisible.value;
  } else {
    ElMessageBox.confirm("您未登录，登录后可添加常用站点！", "提示", {
      confirmButtonText: "去登录",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        Router.push({path: "/login"});
      })
      .catch(() => {});
  }
}

//新增的站点数据
const site = reactive({
  name: "",
  url: "",
});
//发送网络请求
async function siteAdd(formEl: FormInstance | undefined) {
  if (!formEl) return;
  formEl.validate(async(valid) => {
    if (valid) {
      dialogFormVisible.value = false;
  const res = await addSite(site.name, site.url).catch((err) => {
    
    if(err.response){
        ElMessage({
          message: err.response.data,
          type: "error",
        });
      }else{
        ElMessage({
          message: err,
          type: "error",
        });
      }
  
  });
  console.log(res);
  formEl.resetFields();
  
  if (res && res!.msg === "添加站点成功") {
   await getSiteList(Store.userInfo!["id"])
      .then((res) => {
        console.log(res);
        allsite.value['常用'] = res.data;
      })
      .catch((err) => {});
    ElMessage({
          message: res.msg,
          type: "success",
        });
  }
      
    } else {
      
      return false;
    }
  });
 
}

/* --- 添加站点结束  ----- */

/* 删除站点 */
const delwebsite =async (event:any,id:number)=>{
  console.log('111');
  console.log(event);
  
  try {
    const res= await delsite(id)
    console.log(res);
    await getSiteList(Store.userInfo!["id"])
      .then((res) => {
        console.log(res);
        allsite.value['常用'] = res.data;
      })
      .catch((err) => {});
    ElMessage({
      message: res.msg,
      type: "success",
    });
  } catch (err:any) {
    console.log(err);
     ElMessage({
      message: err.response.data,
      type: "error",
    });
  }

}


/* ------ tab栏 ------- */
let tabs = ref([''])
let activeTab = ref('常用')
getToolList().then(({data})=>{
  console.log(data);

  tabs.value = data.map((item:any)=>{
    allsite.value[item.typeName] = item.tool;
    return item.typeName
  })
  tabs.value.unshift('常用')
})

function tabTriger(tag:string){
  activeTab.value = tag
}


const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogFormVisible.value = false;

};
</script>
<style lang="less" scoped>
.tabs {
  display: flex;
  color: #fff;
  margin: 30px;

  .tab {
    position: relative;
    padding: 8px;
    margin-right: 20px;
    cursor: pointer;
    font-size: 20px;
    font-weight: 500;
    border-radius: 25px;
    transition: all .5s;

    &:hover {
      background-color: rgba(255, 255, 255, 40%);
      color: var(--primary-color);

    }
  }

  .activeTab {
    background-color: rgba(255, 255, 255, 30%);
    color: var(--primary-color);
  }
}

.container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .item {
    position: relative;
    width: 80px;
    height: 100px;
    border-radius: 10px;

    .siteItem {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding-top: 5px;
      width: 80px;
      height: 100px;
      cursor: pointer;

      .icon {
        width: 50px;
        height: 50px;
        border-radius: 10px;
      }

      .siteName {
        margin-top: 10px;
        text-align: center;
        color: #e0e0e0;
      }
    }

    .delete {
      display: none;
      position: absolute;
      z-index: 5;
      top: 0;
      right: 0;
      // font-size: 18px;
      cursor: pointer;
      width: 16px;
      height: 16px;
      background-color: rgba(115, 110, 110, 0.5);
      box-shadow: 0 0 5px #e0e0e0;
      border-radius: 50%;
    }

    &:hover {
      background-color: rgba(240, 240, 240, 0.2);

      .delete {
        display: block;
      }
    }

  }


  .addButton {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 100px;
    border-radius: 10px;
    cursor: pointer;

    .iconAdd {
      font-size: 30px;
      color: #fff;
    }

    .addsite {
      position: absolute;
      left: 0px;
      top: 100px;
      width: 300px;
      height: 300px;
      padding: 15px 10px;
      background-color: #fafafa;
      border-radius: 10px;
    }

    &:hover {
      background-color: rgba(200, 200, 200, 0.5);
    }
  }
}
</style>
