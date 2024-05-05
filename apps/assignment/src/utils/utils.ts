export const copyToClipboard = (text: string, e?: React.MouseEvent) => {
  if (e) e.stopPropagation();
  void navigator.clipboard.writeText(text);
};

export const includeStringWithoutAccent = (string1: string, string2: string) =>
  string1
    .normalize("NFD")
    .toLowerCase()
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "")
    .includes(
      string2
        .normalize("NFD")
        .toLowerCase()
        .replace(/\p{Diacritic}/gu, "")
        .replace(/\s+/g, ""),
    );

export const getDarkColor = (backgroundColor: string) => {
  const [baseColor] = backgroundColor.split("-");

  return `${baseColor}-800`;
};

export const getSortingParams = (sort: string) => {
  if (sort) {
    const desc = sort.includes("-");
    const id = sort.replace("-", "");
    return [{ desc, id }];
  }
  return [];
};
