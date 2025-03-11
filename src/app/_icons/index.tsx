import { IoWalletOutline } from "react-icons/io5";
import { CgArrowsExchangeAlt } from "react-icons/cg";

export function SwapWallet() {
  return (
    <div className="relative">
      <IoWalletOutline size={24} />
      <CgArrowsExchangeAlt className="absolute rounded-full bg-white dark:bg-gray-500 text-sm bottom-0 w-5 h-5 -right-2" />
    </div>
  );
}
