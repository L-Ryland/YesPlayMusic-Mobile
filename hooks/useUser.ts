import {
  fetchUserAccount,
  UserApiNames,
  FetchUserAccountResponse,
} from "@/api/user";
import { APIs } from "@/api/CacheAPIs";
import { useQuery } from "react-query";

export default function useUser() {
  return useQuery(UserApiNames.FETCH_USER_ACCOUNT, fetchUserAccount, {
    refetchOnWindowFocus: true,
  });
}
