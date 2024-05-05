export const normalizeString = (str: string) => {
  // Normalize diacritics
  const normalizedName = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return normalizedName.toLowerCase();
};
