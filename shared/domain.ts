export type KegStatus = "IN_STOCK" | "IN_USE" | "CLEANING" | "RETURN_DUE";

export type Keg = {
  id: string;
  beerName: string;
  capacityL: number;
  status: KegStatus;
  dueDate: string;
};

export type KegSummary = {
  total: number;
  inStock: number;
  inUse: number;
  cleaning: number;
  returnDue: number;
};

export const summarizeKegs = (kegs: Keg[]): KegSummary => {
  const summary: KegSummary = {
    total: kegs.length,
    inStock: 0,
    inUse: 0,
    cleaning: 0,
    returnDue: 0
  };

  kegs.forEach((keg) => {
    if (keg.status === "IN_STOCK") summary.inStock += 1;
    if (keg.status === "IN_USE") summary.inUse += 1;
    if (keg.status === "CLEANING") summary.cleaning += 1;
    if (keg.status === "RETURN_DUE") summary.returnDue += 1;
  });

  return summary;
};
