import request from '@/utils/request';
import { mapTrackPlayableStatus } from '@/utils/common';
import type { AxiosPromise } from 'axios';
import { ResponseFormat } from "@/types";

export enum ArtistApiNames {
  FETCH_ARTIST = 'fetchArtist',
  FETCH_ARTIST_ALBUMS = 'fetchArtistAlbums',
  FETCH_TOP_ARTISTS = 'fetchTopArtists'
}

export interface ResponseType { 
  code: number
}

type requestFunction = <T>(params: T) => AxiosPromise<ResponseType>

// 歌手详情
export interface FetchArtistParams {
  id: number
}
export interface FetchArtistResponse {
  code: number
  more: boolean
  artist: Artist
  hotSongs: Track[]
}
export function fetchArtist(
  params: FetchArtistParams,
  noCache: boolean
): AxiosPromise<FetchArtistResponse> {
  const otherParams: { timestamp?: number } = {}
  if (noCache) otherParams.timestamp = new Date().getTime()
  return request({
    url: '/artists',
    method: 'get',
    params: { ...params, ...otherParams },
  })
}

// 获取歌手的专辑列表
export interface FetchArtistAlbumsParams {
  id: number
  limit?: number // default: 50
  offset?: number // default: 0
}
export interface FetchArtistAlbumsResponse extends ResponseFormat {
  hotAlbums: Album[]
  more: boolean
  artist: Artist
}
export function fetchArtistAlbums(
  params: FetchArtistAlbumsParams
): AxiosPromise<FetchArtistAlbumsResponse> {
  return request({
    url: 'artist/album',
    method: 'get',
    params,
  })
}
export interface ToplistArtistsParams {
  type: number | undefined
}
export interface TopListArtistsResponse extends ResponseFormat {
  list: {
    artists: Artist[],
    updateTime: number,
    type: ToplistArtistsParams["type"]
  }
}

 /**
  * 歌手榜
  * 说明 : 调用此接口 , 可获取排行榜中的歌手榜
  * - type : 地区
  * 1: 华语
  * 2: 欧美
  * 3: 韩国
  * 4: 日本
  * @export
  * @param {ToplistArtistsParams} [params=defaultToplistArtistsParams]
  * @return {*}  {AxiosPromise<ResponseType>}
  */
 export function fetchToplistOfArtists(params: ToplistArtistsParams ): Promise<TopListArtistsResponse> {
  return request({
    url: '/toplist/artist',
    method: 'get',
    params,
  });
}
