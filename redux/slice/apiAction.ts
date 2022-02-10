import * as playlist from "@/api/playlist";
export const REQUEST="REQUEST"
export const RECEIVE="RECEIVE"

export const requestData = ({type: "REQUEST"});
export const recieiveData = data => ({type: "RECEIVE", data})

export const fetchData = async (params:any) => {
  try {
    const data = await playlist.recommendPlaylist(params);
  return data;
  } catch (error) {

  }
}