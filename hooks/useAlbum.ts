import { fetchAlbum } from "@/api/album";
import reactQueryClient from "@/utils/reactQueryClient";
import { APIs } from "@/api/CacheAPIs";
import {
  FetchAlbumParams,
  AlbumApiNames,
  FetchAlbumResponse,
} from "@/api/album";
import { useQuery } from "react-query";
import { AxiosPromise } from "axios";

const fetch = async (params: FetchAlbumParams, noCache?: boolean) => {
  const album = await fetchAlbum(params, !!noCache);
  if (album?.album?.songs) {
    album.album.songs = album.songs;
  }
  return album;
};

export default function useAlbum(params: FetchAlbumParams, noCache?: boolean) {
  return useQuery(
    [AlbumApiNames.FETCH_ALBUM, params.id],
    () => fetch(params, noCache),
    {
      enabled: !!params.id,
      staleTime: 24 * 60 * 60 * 1000, // 24 hours
    }
  );
}

export function fetchAlbumWithReactQuery(params: FetchAlbumParams) {
  return reactQueryClient.fetchQuery(
    [AlbumApiNames.FETCH_ALBUM, params.id],
    () => fetch(params),
    {
      staleTime: Infinity,
    }
  );
}

export async function prefetchAlbum(params: FetchAlbumParams) {
  await reactQueryClient.prefetchQuery(
    [AlbumApiNames.FETCH_ALBUM, params.id],
    () => fetch(params),
    {
      staleTime: Infinity,
    }
  );
}
