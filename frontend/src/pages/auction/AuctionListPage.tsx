// AuctionListPage.tsx
import TurtleListLayout from "../../layout/TurtleListLayout";
import AuctionTurtle from "../../components/auction/AuctionTurtle";
import { getAuctionDatas } from "../../apis/tradeApi";
import AuctionTurtleSkeleton from "../../components/auction/skeleton/AuctionTurtleSkeleton";

const AuctionListPage = () => {
  const fetchData = (page: number, filters: object) => {
    return getAuctionDatas({ page, ...filters });
  };

  const auctionItems = [
    <AuctionTurtle key={0} />,
    <AuctionTurtle key={1} />,
  ];

  return (
    <TurtleListLayout
      title="경매중인 거북이"
      items={auctionItems}
      fetchData={fetchData}
      skeletonComponent={<AuctionTurtleSkeleton />} // Optional loading skeleton
    />
  );
};

export default AuctionListPage;
