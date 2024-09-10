function CheckButonSet({
  handleAcceptSubmit,
  handleDenySubmit,
}: {
  handleAcceptSubmit: () => void;
  handleDenySubmit: () => void;
}) {
  return (
    <>
      <div className="space-x-3 text-right">
        <button
          type="button"
          onClick={handleDenySubmit}
          className="w-36 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2"
        >
          승인거부
        </button>

        <button
          type="button"
          onClick={handleAcceptSubmit}
          className="w-36 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          승인
        </button>
      </div>
    </>
  );
}

export default CheckButonSet;
