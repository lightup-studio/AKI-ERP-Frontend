export const showSizeText = (length?: string, width?: string, height?: string) => {
  return length || width || height
    ? `${length && `長 ${length}`} ${width && `x 寬 ${width}`} ${height && `x 高 ${height}`} cm`
    : '無';
};
