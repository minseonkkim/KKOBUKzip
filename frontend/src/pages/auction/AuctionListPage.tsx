import TurtleListLayout from "../../layout/TurtleListLayout";
import AuctionTurtle from "../../components/auction/AuctionTurtle";
import { getAuctionDatas } from "../../apis/tradeApi";
import { useCallback, useState } from "react";
import { AuctionItemDataType, AuctionListDataType } from "../../types/auction";

const AuctionListPage = () => {

  const [AuctionItems, setAuctionItems] = useState<JSX.Element[]>([]);
  const [ProgressAuctionItems, setProgressAuctionItems] = useState<JSX.Element[]>(
    []
  );
  const [isProgressItem, setIsProgressItem] = useState(false);
    const [pages, setPages] = useState(0); 
  const [filters, setFilters] = useState<object>({}); 

  const fetchData = useCallback(
    async (page: number, filters: object, isSearch?: boolean): Promise<void> => {
      const result = await getAuctionDatas({ page, ...filters });

      if (result?.status == 200) {
        const progressItems: JSX.Element[] = [];
        const auctionItems = result.data.data.data.auctions.map(
          (item: AuctionListDataType) => {
            console.log(item.auctionProgress);
            if (item.auctionProgress === "DURING_AUCTION") {
              // auctionId로 변경
              progressItems.push(<AuctionTurtle key={item.auctionId!} data={item} />);
            }
            // auctionId로 변경
            return <AuctionTurtle key={item.auctionId} data={item} />;
          }
        );

        if (isSearch) {
          setAuctionItems(() => [...auctionItems]);
          setProgressAuctionItems(() => [...progressItems]);
        } else {
          setAuctionItems((prev) => [...prev, ...auctionItems]);
          setProgressAuctionItems((prev) => [...prev, ...progressItems]);
        }
      }
    },
    []
  );

  const progressFilter = () => {
    setIsProgressItem(!isProgressItem);
  };

  const resetFilters = () => {
    setFilters({}); 
    setPages(0); 
    fetchData(0, {}, true);
  };


  return (
    <TurtleListLayout
      title="경매중인 거북이"
      items={isProgressItem ? ProgressAuctionItems : AuctionItems}
      fetchData={fetchData} 
      isProgressItemChecked={isProgressItem}
      setIsProgressItemChecked={progressFilter}
       resetFilters={resetFilters}
    />
  );
};

export default AuctionListPage;