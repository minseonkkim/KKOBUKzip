// TransactionListPage.tsx
import TurtleListLayout from "../../layout/TurtleListLayout";
import TransactionTurtle from "../../components/transaction/TransactionTurtle";
import TmpTurtle1 from "../../assets/tmp_turtle.jpg";
import TmpTurtle2 from "../../assets/tmp_turtle_2.jpg";
import TmpTurtle3 from "../../assets/tmp_turtle_3.jpg";
import TmpTurtle4 from "../../assets/tmp_turtle_4.jpg";
import TmpTurtle5 from "../../assets/tmp_turtle_5.jpg";
import TmpTurtle6 from "../../assets/tmp_turtle_6.jpg";
import { getTransactionData } from "../../apis/tradeApi";
import { useCallback, useState } from "react";
import { TransactionItemDataType } from "../../types/transaction";
// import AuctionTurtleSkeleton from "../../components/auction/skeleton/AuctionTurtleSkeleton";

const TransactionListPage = () => {
  const [TransactionItems, setTransactionItems] = useState<JSX.Element[]>([]);

  const fetchData = useCallback(async (page: number, filters: object) => {
    const result = await getTransactionData({ page, ...filters });
    if (result.success) {
      console.log(result.data.data.data);
      const transactionItems = result.data.data.data.transactions.map(
        (item: TransactionItemDataType) => (
          <TransactionTurtle key={item.transactionId} item={item} />
        )
      );
      setTransactionItems(transactionItems);
      return result;
    }
  }, []);

  return (
    <TurtleListLayout
      title="판매중인 거북이"
      items={TransactionItems}
      fetchData={fetchData}
      // skeletonComponent={<AuctionTurtleSkeleton />}
    />
  );
};

export default TransactionListPage;
