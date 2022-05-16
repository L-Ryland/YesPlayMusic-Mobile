import { fetchArtistAlbums, FetchArtistAlbumsParams, ArtistApiNames, FetchArtistAlbumsResponse } from '@/api/artist'
import { APIs } from '@/api/CacheAPIs'
import {useQuery} from "react-query";

export default function useArtistAlbums(params: FetchArtistAlbumsParams) {
  return useQuery(
    [ArtistApiNames.FETCH_ARTIST_ALBUMS, params],
    async () => {
      const data = await fetchArtistAlbums(params)
      return data
    },
    {
      enabled: !!params.id && params.id !== 0,
      staleTime: 3600000,
    }
  )
}
