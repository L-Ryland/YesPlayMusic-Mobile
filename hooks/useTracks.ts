import { fetchAudioSource, fetchTracks } from "@/api/track";
import reactQueryClient from "@/utils/reactQueryClient";
import {
  FetchAudioSourceParams,
  FetchTracksParams,
  FetchTracksResponse,
  TrackApiNames,
} from "@/api/track";
import { APIs } from "@/api/CacheAPIs";
import { useQuery } from "react-query";

export default function useTracks(params: FetchTracksParams) {
  return useQuery(
    [TrackApiNames.FETCH_TRACKS, params],
    () => {
      return fetchTracks(params);
    },
    {
      enabled: params.ids.length !== 0,
      refetchInterval: false,
      staleTime: Infinity,
    }
  );
}

export function fetchTracksWithReactQuery(params: FetchTracksParams) {
  return reactQueryClient.fetchQuery(
    [TrackApiNames.FETCH_TRACKS, params],
    () => {
      return fetchTracks(params);
    },
    {
      retry: 4,
      retryDelay: (retryCount: number) => {
        return retryCount * 500;
      },
      staleTime: 86400000,
    }
  );
}

export function fetchAudioSourceWithReactQuery(params: FetchAudioSourceParams) {
  return reactQueryClient.fetchQuery(
    [TrackApiNames.FETCH_AUDIO_SOURCE, params],
    () => {
      return fetchAudioSource(params);
    },
    {
      retry: 3,
      staleTime: 0, // TODO: Web版1小时缓存
    }
  );
}
