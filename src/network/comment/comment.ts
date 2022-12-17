import lzRequest from "../request";
import {IDataType} from "../type";
// 一级评论
export function createComment(content: string, articleId: number) {
  return lzRequest.post<IDataType<any>>({
    url: `/comment`,
    data: {
      content,
      articleId,
    },
  });
}

// 二级评论
export function replyComment(
  commentId: number,
  content: string,
  articleId: number
) {
  return lzRequest.post<IDataType<any>>({
    url: `/comment/reply/${commentId}`,
    data: {
      content,
      articleId,
    },
  });
}

// 评论列表
export function getComment(articleId: number) {
  return lzRequest.get<IDataType<any>>({
    url: `/comment`,
    params: {
      articleId,
    },
  });
}
