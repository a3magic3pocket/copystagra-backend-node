export const getKorTime = (date: Date) => {
  date.setHours(date.getHours() + 9);

  return date;
};

export const convertTimeToJavaTimeFormat = (date: Date) => {
  return [
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds() * 1000000,
  ];
};

export const convertTimeFieldToJavaTimeFormat = (
  data: Record<string, any>[],
  timeFields: string[]
) => {
  const result = data.map((row) => {
    for (const key in row) {
      if (timeFields.includes(key)) {
        const value = row[key];
        row[key] = convertTimeToJavaTimeFormat(value);
      }
    }
    return row;
  });

  return result;
};
