import AuctionSuccessPage from "../../pages/auction/AuctionSuccessPage";

function SuccessfulBid({ nowBid }: { nowBid: number }) {
  return (
    <>
      <AuctionSuccessPage nowBid={nowBid} />
    </>
  );
}

export default SuccessfulBid;
