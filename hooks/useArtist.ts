import { fetchArtist } from "@/api/artist";
import { APIs } from "@/api/CacheAPIs";
import {
  FetchArtistParams,
  ArtistApiNames,
  FetchArtistResponse,
} from "@/shared/api/Artist";

export default function useArtist(
  params: FetchArtistParams,
  noCache?: boolean
) {
  return useQuery(
    [ArtistApiNames.FetchArtist, params],
    () => fetchArtist(params, !!noCache),
    {
      enabled: !!params.id && params.id > 0 && !isNaN(Number(params.id)),
      staleTime: 5 * 60 * 1000, // 5 mins
    }
  );
}
