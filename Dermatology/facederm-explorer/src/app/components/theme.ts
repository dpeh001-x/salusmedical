export const IVORY = "#FAF6EF";
export const IVORY2 = "#F5EFE3";
export const CREAM = "#EDE4D3";
export const GOLD = "#C9A84C";
export const GOLD_LT = "#E2CFA0";
export const GOLD_DK = "#8B6820";
export const GOLD_WM = "#D4AF6A";
export const CHAR = "#1C1812";
export const SMOKE = "#6B6258";

export const sliderBg = (val: number, min: number, max: number) => {
  const pct = ((val - min) / (max - min)) * 100;
  return `linear-gradient(to right, ${GOLD_DK} 0%, ${GOLD} ${pct}%, #DDD ${pct}%, #DDD 100%)`;
};
