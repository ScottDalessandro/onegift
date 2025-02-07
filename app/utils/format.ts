type PrismaDecimal = {
    s: number;
    e: number;
    d: number[];
  }
  
  export const formatDecimal = (price: PrismaDecimal) => {
    if (!price || !price.d || price.d.length === 0) return "0.00";
    
    const whole = price.d[0] ?? 0;
    const decimal = price.d[1] ?? 0;
    
    return Number(`${whole}.${String(decimal).slice(0, 2)}`).toFixed(2);
  };