import request from "@/utils/request";
import { mapTrackPlayableStatus } from "@/utils/common";
import { cacheAlbum, getAlbumFromCache } from "@/utils/db";
import type { AxiosPromise, AxiosResponse } from "axios";

export enum AlbumApiNames {
  FETCH_ALBUM = "fetchAlbum",
}

export interface ResponseType {
  code: number;
}

// 专辑详情
export interface FetchAlbumParams {
  id: number;
}
export interface FetchAlbumResponse {
  code: number;
  resourceState: boolean;
  album: Album;
  songs: Track[];
  description: string;
}
export function fetchAlbum(
  params: FetchAlbumParams,
  noCache?: boolean
): Promise<FetchAlbumResponse> {
  const otherParams: { timestamp?: number } = {};
  if (noCache) otherParams.timestamp = new Date().getTime();
  return request<FetchAlbumResponse>({
    url: "/album",
    method: "get",
    params: { ...params, ...otherParams },
  });
}

export interface LikeAAlbumParams {
  t: 1 | 2;
  id: number;
}
export interface LikeAAlbumResponse {
  code: number;
}
export function likeAAlbum(
  params: LikeAAlbumParams
): Promise<LikeAAlbumResponse> {
  return request({
    url: "/album/sub",
    method: "post",
    params: {
      ...params,
      timestamp: Date.now(),
    },
  });
}
export interface NewALbumsParams {
  limit?: number;
  offeSet?: number;
  area?: "ALL" | "ZH" | "EA" | "KR" | "JP";
}
const defaultNewAlbumsParams = { limit: 30, offset: 0 };
/**
 * 全部新碟
 * 说明 : 登录后调用此接口 ,可获取全部新碟
 * - limit - 返回数量 , 默认为 30
 * - offset - 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * - area - ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
 * @param {Object} params
 * @param {number} params.limit
 * @param {number=} params.offset
 * @param {string} params.area
 */
export function newAlbums(
  params: NewALbumsParams = defaultNewAlbumsParams
): AxiosPromise<ResponseType> {
  return request({
    url: "/album/new",
    method: "get",
    params,
  });
}
