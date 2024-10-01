import TurtleListLayout from "../../layout/TurtleListLayout";
import AuctionTurtle from "../../components/auction/AuctionTurtle";
import { getAuctionDatas } from "../../apis/tradeApi";
import { useCallback, useState } from "react";

const AuctionListPage = () => {
  const [isProgressItem, setIsProgressItem] = useState(false);

  const fetchData = useCallback((page: number, filters: object) => {
    return getAuctionDatas({ page, ...filters });
  }, []);

  const auctionItems = [<AuctionTurtle key={0} />, <AuctionTurtle key={1} />];
  const progressFilter = () => {
    setIsProgressItem(!isProgressItem);
  };

  return (
    <TurtleListLayout
      title="경매중인 거북이"
      items={auctionItems}
      fetchData={fetchData}
      isProgressItemChecked={isProgressItem}
      setIsProgressItemChecked={progressFilter}
    />
  );
};

export default AuctionListPage;
