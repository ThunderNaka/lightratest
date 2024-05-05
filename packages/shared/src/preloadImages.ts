export const preloadImages = (imageUrls: string[]) => {
  const promises = [];
  const images: HTMLImageElement[] = [];

  for (const image of imageUrls) {
    const img = new Image();
    images.push(img);
    promises.push(
      new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      }),
    );
    img.src = image ?? "";
  }
  return Promise.all(promises).then(() => images);
};
