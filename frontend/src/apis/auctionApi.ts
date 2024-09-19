import authAxios from "./http-commons/authAxios";
import guestAxios from "./http-commons/guestAxios";

/*
// getAuctionDatas api fetch
/api/auction?gender={gender}&size={0between10}&price={0between1000}&progress=1&page=1
*/
export const getAuctionDatas = async (
  gender?: string,
  size?: string,
  price?: string,
  progress?: string,
  page?: number
) => {
  const response = await guestAxios.get(
    `/auction?gender=${gender}&size=${size}&price=${price}&progress=${progress}&page=${page}`
  );
  return response.data;
};
