type PrismaDecimal = {
    s: number;
    e: number;
    d: number[];
  }
  
  export const formatDecimal = (price: PrismaDecimal) => {
    if (!price) return "0.00";
    return Number(`${price.d[0]}.${String(price.d[1]).slice(0, 2)}`).toFixed(2);
  };