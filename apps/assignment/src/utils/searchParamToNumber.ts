export const searchParamToNumber = (id: string | null) => {
  if (id === null) {
    return null;
  }

  const result = parseInt(id, 10);

  return isNaN(result) ? null : result;
};
