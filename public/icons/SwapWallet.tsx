import { IoWalletOutline } from "react-icons/io5";
import { CgArrowsExchangeAlt } from "react-icons/cg";

function SwapWallet() {
  return (
    <div className="relative">
      <IoWalletOutline size={24} />
      <CgArrowsExchangeAlt className="absolute bottom-1 right-1" size={10} />
    </div>
  );
}

export default SwapWallet;
