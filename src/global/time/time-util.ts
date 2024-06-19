export const getKorTime = (date: Date) => {
  date.setHours(date.getHours() + 9);

  return date;
};
