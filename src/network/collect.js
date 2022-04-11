import { request } from "./request";

//添加和取消收藏
export function Collect(id){
  return request({
    url:`/api/collects/goods/${id}`,
    method:'post'
  })
}

//我的收藏
export function myCollect(){
  return request({
    url:`/api/collects`,
    method:'get'
  })
}