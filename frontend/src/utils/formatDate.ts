function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const year = date.getFullYear() % 100; // 연도 마지막 두 자리 (24)
    const month = date.getMonth() + 1; // 월 (0부터 시작하므로 +1)
    const day = date.getDate(); // 일

    return `${year}년 ${month}월 ${day}일`;
  } catch {
    return "";
  }
}
export default formatDate;
