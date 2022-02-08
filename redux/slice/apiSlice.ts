// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "api",
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    /**
     * 推荐歌单
     * 说明 : 调用此接口 , 可获取推荐歌单
     * - limit: 取出数量 , 默认为 30 (不支持 offset)
     * - 调用例子 : /personalized?limit=1
     * @param {Object} params
     * @param {limit=number} params.limit
     */
    recommendPlaylist: builder.query({
      query: (limit=30) => ({ url: `personalized?limit=${limit}`, method: "get" }),
    }),
    /**
     * 获取歌单详情
     * 说明 : 歌单能看到歌单名字, 但看不到具体歌单内容 , 调用此接口 , 传入歌单 id, 可以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)，
     * 但是返回的trackIds是完整的，tracks 则是不完整的，可拿全部 trackIds 请求一次 song/detail 接口
     * 获取所有歌曲的详情 (https://github.com/Binaryify/NeteaseCloudMusicApi/issues/452)
     * - id : 歌单 id
     * - s : 歌单最近的 s 个收藏者, 默认为8
     * @param {number} id
     * @param {boolean=} noCache
     */
    getPlaylistDetail: builder.query({
      query: (id, nocache=false) => {
        let param = id
        // if (nocache) param.timestamp = new Date().getTime();
        return { url: `playlist/detail?id=${param}`, method: 'GET'}},
    }),
    /**
     * 收藏/取消收藏歌单
     * 说明 : 调用此接口, 传入类型和歌单 id 可收藏歌单或者取消收藏歌单
     * - t : 类型,1:收藏,2:取消收藏
     * - id : 歌单 id
     * @param {Object} params
     * @param {number} params.t
     * @param {number} params.id
     */
    subscribePlaylist: builder.query({
      query: (params) => ({
        url: `playlist/subscribe/${params}`,
        method: "post",
      }),
    }),
    /**
     * 删除歌单
     * 说明 : 调用此接口 , 传入歌单id可删除歌单
     * - id : 歌单id,可多个,用逗号隔开
     *  * @param {number} id
     */
    deletePlaylist: builder.mutation({
      query: (id: Number) => ({url: `/playlist/delete?${id}`, method: 'post'})
    })
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useRecommendPlaylistQuery, useGetPlaylistDetailQuery } = apiSlice;
