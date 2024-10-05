import TurtleListLayout from "../../layout/TurtleListLayout";
import TransactionTurtle from "../../components/transaction/TransactionTurtle";
import { getTransactionData } from "../../apis/tradeApi";
import { useCallback, useState } from "react";
import { TransactionItemDataType } from "../../types/transaction";

const TransactionListPage = () => {
  const [TransactionItems, setTransactionItems] = useState<JSX.Element[]>([]);
  const [ProgressTransactionItems, setProgressTransactionItems] = useState<JSX.Element[]>([]);
  const [isProgressItem, setIsProgressItem] = useState(false);
  const [pages, setPages] = useState(0); 
  const [filters, setFilters] = useState<object>({}); 


  const fetchData = useCallback(
    async (page: number, filters: object, isSearch?: boolean): Promise<void> => {
      const result = await getTransactionData({ page, ...filters });

      if (result?.success) {
        const progressItems: JSX.Element[] = [];
        const transactionItems = result.data.data.data.transactions.map(
          (item: TransactionItemDataType) => {
            if (item.progress === "SAIL")
              progressItems.push(
                <TransactionTurtle key={item.transactionId} item={item} />
              );

            return <TransactionTurtle key={item.transactionId} item={item} />;
          }
        );

        if (isSearch) {
          setTransactionItems(transactionItems);
          setProgressTransactionItems(progressItems);
        } else {
          setTransactionItems((prev) => [...prev, ...transactionItems]);
          setProgressTransactionItems((prev) => [...prev, ...progressItems]);
        }
      }
    },
    []
  );


  const progressFilter = () => {
    setIsProgressItem(!isProgressItem);
  };

  return (
    <TurtleListLayout
      title="판매중인 거북이"
      items={isProgressItem ? ProgressTransactionItems : TransactionItems}
      fetchData={fetchData}
      isProgressItemChecked={isProgressItem}
      setIsProgressItemChecked={progressFilter}
    />
  );
};

export default TransactionListPage;