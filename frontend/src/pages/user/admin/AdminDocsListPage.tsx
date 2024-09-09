import { Helmet } from "react-helmet-async";
import { AdminDocsListDataType } from "../../../types/document";
import { useNavigate } from "react-router-dom";

const documents = [
  {
    docType: "인공증식증명서",
    scientificName: "Malaclemys terrapin",
    name: "김싸피",
    email: "ssafy@ssafy.com",
    registerDate: "2024-08-20",
    turtleUUID: "e4eaaaf2-d142-11e1-b3e4-080027620cdd",
    documentHash: "0x1231824910237124",
  },
  {
    docType: "양도양수확인서",
    scientificName: "Malaclemys terrapin",
    name: "김싸피",
    email: "ssafy@ssafy.com",
    registerDate: "2024-08-20",
    turtleUUID: "d271c7d8-3f7b-4d4e-8a9e-d60f896b84cb",
    documentHash: "0x1231824910237124",
  },
  {
    docType: "폐사질병신고서",
    scientificName: "Malaclemys terrapin",
    name: "김싸피",
    email: "ssafy@ssafy.com",
    registerDate: "2024-08-20",
    turtleUUID: "e7c5d4e4-2b55-4d4f-8d53-7d98c6c2a30a",
    documentHash: "0x1231824910237124",
  },
];

const generateRandomData = (source: typeof documents, n: number) => {
  const randomData = [];
  for (let i = 0; i < n; i++) {
    const randomItem = source[Math.floor(Math.random() * source.length)];
    randomData.push({ ...randomItem, turtleUUID: crypto.randomUUID() });
  }
  return randomData;
};

const dummyData = generateRandomData(documents, 100);

function AdminDocsListPage() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>관리자 - 문서 목록 조회</title>
      </Helmet>

      <div className="max-w-screen-md mx-auto p-4 h-[100vh] flex flex-col">
        <h1 className="text-2xl font-bold mb-4">서류 신청 목록</h1>
        <div className="grid gap-4 grid-cols-1 overflow-y-auto">
          {dummyData.map((doc, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(`/admin/${doc.turtleUUID}/${doc.documentHash}`);
              }}
              className="border cursor-pointer rounded-lg px-6 py-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
            >
              <div className="flex flex-col">
                <p className="font-semibold">{doc.docType}</p>
                <div className="space-x-3">
                  <span>{doc.scientificName}</span>
                  <span className="text-gray-600">{doc.name}</span>
                  <span className="text-gray-600">{doc.email}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-gray-500">{doc.registerDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminDocsListPage;
