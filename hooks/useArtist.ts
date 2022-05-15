import {
  fetchArtist,
  fetchToplistOfArtists,
  ToplistArtistsParams,
} from "@/api/artist";
import { APIs } from "@/api/CacheAPIs";
import {
  FetchArtistParams,
  ArtistApiNames,
  FetchArtistResponse,
} from "@/api/artist";
import { useQuery } from "react-query";
import { shuffle } from "lodash-es";

export default function useArtist(
  params: FetchArtistParams,
  noCache?: boolean
) {
  return useQuery(
    [ArtistApiNames.FETCH_ARTIST, params],
    () => fetchArtist(params, !!noCache),
    {
      enabled: !!params.id && params.id > 0 && !isNaN(Number(params.id)),
      staleTime: 5 * 60 * 1000, // 5 mins
    }
  );
}

export function useTopArtists(params: ToplistArtistsParams) {
  return useQuery(
    [ArtistApiNames.FETCH_TOP_ARTISTS, params],
    async () => {
      const {
        list: { artists },
      } = await fetchToplistOfArtists(params);
      // alert(`useTopArtists - ${JSON.stringify(artists)}`)
      return shuffle(artists).slice(0, 5);
    },
    {
      enabled: true,
      staleTime: 300000,
    }
  );
}
