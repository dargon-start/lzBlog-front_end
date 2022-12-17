import lzRequest from "../request";
import {IDataType} from "../type";
//获取文章列表
export function getArticList(offset: number, size: number, type: string) {
  return lzRequest.get<IDataType<any>>({
    url: `/article`,
    params: {
      offset,
      size,
      type
    },
  });
}

//根据标签获取文章
export function getArticListBylabel(
  offset: number,
  size: number,
  labelName?: string
) {
  return lzRequest.get<IDataType<any>>({
    url: `/label/article`,
    params: {
      offset,
      size,
      labelName,
    },
  });
}

//获取文章详情
export function getArticleInfo(aId: number) {
  return lzRequest.get<IDataType<any>>({
    url: `/article/${aId}`,
  });
}

//获取文章和标签数量
export function getTotalArtandlabel() {
  return lzRequest.get<IDataType<any>>({
    url: `/article/amount`,
  });
}

//搜索文章
export function searchArtice(offset: number, size: number, keyword: string) {
  return lzRequest.get<IDataType<any>>({
    url: `/article/search`,
    params: {
      offset,
      size,
      keyword,
    },
  });
}
