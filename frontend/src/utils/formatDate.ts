function formatDate(date: Date): string {
  const year = date.getFullYear() % 100; // 연도 마지막 두 자리 (24)
  const month = date.getMonth() + 1; // 월 (0부터 시작하므로 +1)
  const day = date.getDate(); // 일

  return `${year}년 ${month}월 ${day}일`;
}

// 테스트 예시
const date = new Date(2024, 8, 9); // 2024년 9월 9일 (월은 0부터 시작)
console.log(formatDate(date)); // 출력: 24년 9월 9일
export default formatDate;
