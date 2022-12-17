import lzRequest from "../request";
import {IDataType} from "../type";

export function getLableList() {
  return lzRequest.get<IDataType<any>>({
    url: `/label`,
  });
}
