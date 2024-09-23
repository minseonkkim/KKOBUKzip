function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const year = date.getFullYear() % 100; // 연도 마지막 두 자리 (24)
    const month = date.getMonth() + 1; // 월 (0부터 시작하므로 +1)
    const day = date.getDate(); // 일

    return `${year}년 ${month}월 ${day}일`;
  } catch (e) {
    return "";
  }
}

// 테스트 예시
const date = "2024-9-9"; // 2024년 9월 9일
// 2024-09-15T10:15:30 등 timezon을 포함한 date도 가능
console.log(formatDate(date)); // 출력: 24년 9월 9일
export default formatDate;
