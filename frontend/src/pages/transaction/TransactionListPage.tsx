// TransactionListPage.tsx
import TurtleListLayout from "../../layout/TurtleListLayout.tsx";
import TransactionTurtle from "../../components/transaction/TransactionTurtle";
import TmpTurtle1 from "../../assets/tmp_turtle.jpg";
import TmpTurtle2 from "../../assets/tmp_turtle_2.jpg";
import TmpTurtle3 from "../../assets/tmp_turtle_3.jpg";
import TmpTurtle4 from "../../assets/tmp_turtle_4.jpg";
import TmpTurtle5 from "../../assets/tmp_turtle_5.jpg";
import TmpTurtle6 from "../../assets/tmp_turtle_6.jpg";
import { getTransactionData } from "../../apis/tradeApi";

const TransactionListPage = () => {
  const TmpTurtleImages = [TmpTurtle1, TmpTurtle2, TmpTurtle3, TmpTurtle4, TmpTurtle5, TmpTurtle6];
  const fetchData = (page: number, filters: object) => {
    return getTransactionData({ page, ...filters });
  };

  const transactionItems = [
        <TransactionTurtle
            scientific_name="지오프리 사이드 넥 터틀"
            price={300000000}
            transaction_tag={["암컷", "성체"]}
            transaction_image={TmpTurtleImages[0]}
            progress="거래가능"
          />,
          <TransactionTurtle
            scientific_name="레이저 백 거북"
            price={94000000}
            transaction_tag={["수컷", "베이비"]}
            transaction_image={TmpTurtleImages[1]}
            progress="거래가능"
          />,
          <TransactionTurtle
            scientific_name="아프리카 사이드 넥"
            price={110000000}
            transaction_tag={["암컷", "베이비"]}
            transaction_image={TmpTurtleImages[2]}
            progress="거래가능"
          />,
          <TransactionTurtle
            scientific_name="미시시피 지도 거북이"
            price={700000000}
            transaction_tag={["암컷", "아성체"]}
            transaction_image={TmpTurtleImages[3]}
            progress="거래가능"
          />,
          <TransactionTurtle
            scientific_name="지오프리 사이드 넥 터틀"
            price={67200000}
            transaction_tag={["암컷", "성체"]}
            transaction_image={TmpTurtleImages[4]}
            progress="거래가능"
          />,
          <TransactionTurtle
            scientific_name="암보니아 상자 거북"
            price={43000000}
            transaction_tag={["수컷", "성체"]}
            transaction_image={TmpTurtleImages[5]}
            progress="거래완료"
          />
  ];

  return (
    <TurtleListLayout
      title="판매중인 거북이"
      items={transactionItems}
      fetchData={fetchData}
      // skeletonComponent={<TransactionTurtleSkeleton />} // Optional loading skeleton
    />
  );
};

export default TransactionListPage;
