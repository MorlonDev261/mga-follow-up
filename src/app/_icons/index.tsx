import { IoWalletOutline } from "react-icons/io5";
import { CgArrowsExchangeAlt } from "react-icons/cg";

export function SwapWallet() {
  return (
    <div className="relative">
      <IoWalletOutline size={24} />
      <CgArrowsExchangeAlt className="absolute bg-white dark:bg-gray-400 bottom-0 -right-2" size={15} />
    </div>
  );
}
