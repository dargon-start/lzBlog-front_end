import {defineStore} from "pinia";
import {getStorage} from "@/utils";
export const useStore = defineStore("main", {
  state: () => {
    return {
      userInfo: null,
    };
  },
  actions: {
    updateUserinfo() {
      if (getStorage("userInfo")) {
        this.userInfo = getStorage("userInfo");
      } else {
        this.userInfo = null;
      }
    },
  },
});
