import { fetchLyric } from '@/api/track'
import reactQueryClient from '@/utils/reactQueryClient'
import {
  FetchLyricParams,
  FetchLyricResponse,
  TrackApiNames,
} from '@/api/track'
import { APIs } from '@/api/CacheAPIs'
import {useQuery} from "react-query";

export default function useLyric(params: FetchLyricParams) {
  return useQuery(
    [TrackApiNames.FETCH_LYRIC, params],
    () => {
      return fetchLyric(params)
    },
    {
      enabled: !!params.id && params.id !== 0,
      refetchInterval: false,
      staleTime: Infinity,
    }
  )
}

export function fetchTracksWithReactQuery(params: FetchLyricParams) {
  return reactQueryClient.fetchQuery(
    [TrackApiNames.FETCH_LYRIC, params],
    () => {
      return fetchLyric(params)
    },
    {
      retry: 4,
      retryDelay: (retryCount: number) => {
        return retryCount * 500
      },
      staleTime: Infinity,
    }
  )
}
