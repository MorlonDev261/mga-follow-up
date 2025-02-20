interface PriceProps {
  price: number;
  currency: { left: boolean; unity: string };
}

const Price: React.FC<PriceProps> = ({ price, currency }) => {
  return (
    <>
      {currency.left ? `${currency.unity}${price}` : `${price} ${currency.unity}`}
    </>
  );
};
export default Price;
