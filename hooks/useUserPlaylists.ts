import { likeAPlaylist } from "@/api/playlist";
import { useQueryClient, useQuery, useMutation } from "react-query";
import useUser from "./useUser";
import {
  fetchUserPlaylists,
  FetchUserPlaylistsResponse,
  UserApiNames,
} from "@/api/user";
import { ToastAndroid } from "react-native";

export default function useUserPlaylists() {
  const { data: user } = useUser();
  const uid = user?.profile?.userId ?? 0;

  const params = {
    uid: uid,
    offset: 0,
    limit: 2000,
  };

  return useQuery(
    [UserApiNames.FETCH_USER_PLAYLISTS, uid],
    async () => {
      if (!params.uid) {
        throw new Error("请登录后再请求用户收藏的歌单");
      }
      const data = await fetchUserPlaylists(params);
      return data;
    },
    {
      enabled: !!params.uid && params.uid !== 0 && params.offset !== undefined,
      refetchOnWindowFocus: true,
    }
  );
}

export const useMutationLikeAPlaylist = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { data: userPlaylists } = useUserPlaylists();
  const uid = user?.account?.id ?? 0;
  const key = [UserApiNames.FETCH_USER_PLAYLISTS, uid];

  return useMutation(
    async (playlist: Playlist) => {
      if (!playlist.id || userPlaylists?.playlist === undefined) {
        throw new Error(
          "playlist id is required or userPlaylists is undefined"
        );
      }
      const response = await likeAPlaylist({
        id: playlist.id,
        t:
          userPlaylists.playlist.findIndex((p) => p.id === playlist.id) > -1
            ? 2
            : 1,
      });
      if (response.code !== 200) throw new Error((response as any).msg);
      return response;
    },
    {
      onMutate: async (playlist) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(key);

        // Snapshot the previous value
        const previousData = queryClient.getQueryData(key);

        // Optimistically update to the new value
        queryClient.setQueryData(key, (old) => {
          const userPlaylists = old as FetchUserPlaylistsResponse;
          const playlists = userPlaylists.playlist;
          const newPlaylists =
            playlists.findIndex((p) => p.id === playlist.id) > -1
              ? playlists.filter((p) => p.id !== playlist.id)
              : [...playlists, playlist];
          return {
            ...userPlaylists,
            playlist: newPlaylists,
          };
        });

        // Return a context object with the snapshotted value
        return { previousData };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, trackID, context) => {
        queryClient.setQueryData(key, (context as any).previousData);
        ToastAndroid.show(JSON.stringify(err), ToastAndroid.SHORT);
      },
    }
  );
};
