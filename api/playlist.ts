import { ResponseFormat } from '@/types';
import request from '@/utils/request'

export enum PlaylistApiNames {
  FETCH_PLAYLIST = 'fetchPlaylist',
  FETCH_RECOMMENDED_PLAYLISTS = 'fetchRecommendedPlaylists',
  FETCH_DAILY_RECOMMEND_PLAYLISTS = 'fetchDailyRecommendPlaylists',
  LIKE_A_PLAYLIST = 'likeAPlaylist',
  TOP_LISTS = 'toplists',
}

// 歌单详情
export interface FetchPlaylistParams {
  id: number
  s?: number // 歌单最近的 s 个收藏者
}
export interface FetchPlaylistResponse {
  code: number
  playlist: Playlist
  privileges: unknown // TODO: unknown type
  relatedVideos: null
  resEntrance: null
  sharedPrivilege: null
  urls: null
}
export function fetchPlaylist(
  params: FetchPlaylistParams,
  noCache: boolean
): Promise<FetchPlaylistResponse> {
  const otherParams: { timestamp?: number } = {}
  if (noCache) otherParams.timestamp = new Date().getTime()
  if (!params.s) params.s = 0 // 网易云默认返回8个收藏者，这里设置为0，减少返回的JSON体积
  return request({
    url: '/playlist/detail',
    method: 'get',
    params: {
      ...params,
      ...otherParams,
    },
  })
}

// 推荐歌单
interface FetchRecommendedPlaylistsParams {
  limit?: number
}
export interface FetchRecommendedPlaylistsResponse {
  code: number
  category: number
  hasTaste: boolean
  result: Playlist[]
}
export function fetchRecommendedPlaylists(
  params: FetchRecommendedPlaylistsParams
): Promise<FetchRecommendedPlaylistsResponse> {
  return request({
    url: '/personalized',
    method: 'get',
    params,
  })
}

// 每日推荐歌单（需要登录）
export interface FetchDailyRecommendPlaylistsResponse {
  code: number
  featureFirst: boolean
  haveRcmdSongs: boolean
  recommend: Playlist[]
}
export function fetchDailyRecommendPlaylists(): Promise<FetchDailyRecommendPlaylistsResponse> {
  return request({
    url: '/recommend/resource',
    method: 'get',
  })
}

export interface LikeAPlaylistParams {
  t: 1 | 2
  id: number
}
export interface LikeAPlaylistResponse {
  code: number
}
export function likeAPlaylist(
  params: LikeAPlaylistParams
): Promise<LikeAPlaylistResponse> {
  return request({
    url: '/playlist/subscribe',
    method: 'post',
    params: {
      ...params,
      timestamp: Date.now(),
    },
  })
}

export interface DeletePlaylistParams {
  id: number
}
/**
 * 删除歌单
 * 说明 : 调用此接口 , 传入歌单id可删除歌单
 * - id : 歌单id,可多个,用逗号隔开
 * @export
 * @param {DeletePlaylistParams} params
 * @return {*}  {Promise<ResponseFormat>}
 */
export function deletePlaylist( params: DeletePlaylistParams): Promise<ResponseFormat> {
  return request({
    url: "/playlist/delete",
    method: "post",
    params,
  });
}


/**
 * 所有榜单
 * 说明 : 调用此接口,可获取所有榜单 接口地址 : /toplist
 */
 export function toplists(): Promise<ResponseFormat> {
  return request({
    url: "/toplist",
    method: "get",
  });
}

export interface FetchHighQualityPlaylistParmas {
  cat: string,
  limit?: number,
  before?: number
}
/**
 * 获取精品歌单
 * 说明 : 调用此接口 , 可获取精品歌单
 * - cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部", 可从精品歌单标签列表接口获取(/playlist/highquality/tags)
 * - limit: 取出歌单数量 , 默认为 20
 * - before: 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
  * @export
  * @param {FetchHighQualityPlaylistParmas} params
  * @return {*}  {Promise<ResponseFormat>}
 */
 /**
  *
  *
  */
 export function fetchHighQualityPlaylist(params: FetchHighQualityPlaylistParmas): Promise<ResponseFormat> {
  return request({
    url: "/top/playlist/highquality",
    method: "get",
    params,
  });
}


export interface TopPlaylistParams {
  order?: 'new' | 'hot',
  cat?: string,
  limit?: number,
}
const defaultTopPlaylistParams: TopPlaylistParams = {order: 'hot', limit: 50}
/**
 * 歌单 ( 网友精选碟 )
 * 说明 : 调用此接口 , 可获取网友精选碟歌单
 * - order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * - cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
 * - limit: 取出歌单数量 , 默认为 50
 * @param {Object=} params
 * @param {string=} params.order
 * @param {string=} params.cat
 * @param {number=} params.limit
 */
 export function topPlaylist(params: TopPlaylistParams = defaultTopPlaylistParams): Promise<ResponseFormat> {
  return request({
    url: "/top/playlist",
    method: "get",
    params: params,
  });
}
