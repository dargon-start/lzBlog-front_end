import lzRequest from "../request";
import {IDataType} from "../type";
//获取站点列表
function getSiteList(userId: number) {
  return lzRequest.get<IDataType<any>>({
    url: `/website/${userId}`,
  });
}

//添加站点
function addSite(name: string, url: string) {
  return lzRequest.post<IDataType>({
    url: "/website",
    timeout: 80000,
    data: {
      name,
      url,
    },
  });
}

function delsite(id: number) {
  return lzRequest.delete<IDataType>({
    url: `/website`,
    params: {
      id,
    },
  });
}

function getToolList(){
  return lzRequest.get<IDataType>({
    url: `/toolSite`,
  });
}

export {addSite, getSiteList, delsite,getToolList};
