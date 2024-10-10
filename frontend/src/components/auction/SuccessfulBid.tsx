import AuctionSuccessPage from "../../pages/auction/AuctionSuccessPage";

function SuccessfulBid({
  nowBid,
  winningNickname,
}: {
  nowBid: number;
  winningNickname: string;
}) {
  return (
    <>
      <AuctionSuccessPage nowBid={nowBid} winningNickname={winningNickname} />
    </>
  );
}

export default SuccessfulBid;
