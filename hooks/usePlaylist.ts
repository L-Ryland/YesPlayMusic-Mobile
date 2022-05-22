import {
  fetchPlaylist,
  fetchRecommendedPlaylists,
  FetchRecommendedPlaylistsParams,
  fetchToplists,
} from "@/api/playlist";
import reactQueryClient from "@/utils/reactQueryClient";
import { APIs } from "@/api/CacheAPIs";
import {
  FetchPlaylistParams,
  PlaylistApiNames,
  FetchPlaylistResponse,
} from "@/api/playlist";
import { useQuery } from "react-query";

const fetch = (params: FetchPlaylistParams, noCache?: boolean) => {
  return fetchPlaylist(params, !!noCache);
};

export default function usePlaylist(
  params: FetchPlaylistParams,
  noCache?: boolean
) {
  return useQuery(
    [PlaylistApiNames.FETCH_PLAYLIST, params],
    () => fetch(params, noCache),
    {
      enabled: !!(params.id && params.id > 0 && !isNaN(Number(params.id))),
      refetchOnWindowFocus: true,
    }
  );
}

export function fetchPlaylistWithReactQuery(params: FetchPlaylistParams) {
  return reactQueryClient.fetchQuery(
    [PlaylistApiNames.FETCH_PLAYLIST, params],
    () => fetch(params),
    {
      staleTime: 3600000,
    }
  );
}

export async function prefetchPlaylist(params: FetchPlaylistParams) {
  const queryKey = [PlaylistApiNames.FETCH_PLAYLIST, params];
  await reactQueryClient.prefetchQuery(queryKey, () => fetch(params), {
    staleTime: 3600000,
  });
  return reactQueryClient.getQueryData(queryKey);
}

export function useRecommendPlaylist(params?: FetchRecommendedPlaylistsParams) {
  return useQuery(
    [PlaylistApiNames.FETCH_RECOMMENDED_PLAYLISTS, params],
    () => fetchRecommendedPlaylists(params),
    { staleTime: 3600000 }
  );
}

export function useToplist() {
  return useQuery([PlaylistApiNames.FETCH_TOP_LISTS], () => fetchToplists(), {
    staleTime: 3600000,
  });
}