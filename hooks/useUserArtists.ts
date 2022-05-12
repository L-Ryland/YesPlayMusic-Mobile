import {
  fetchUserArtists,
  UserApiNames,
  FetchUserArtistsResponse,
} from "@/api/user";
import { APIs } from "@/api/CacheAPIs";
import { useQuery } from "react-query";

export default function useUserArtists() {
  return useQuery([UserApiNames.FETCH_USER_ARTIST], fetchUserArtists, {
    refetchOnWindowFocus: true,
  });
}
