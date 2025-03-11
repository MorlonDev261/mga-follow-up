import { IoWalletOutline } from "react-icons/io5";
import { CgArrowsExchangeAlt } from "react-icons/cg";

export function SwapWallet() {
  return (
    <div className="relative">
      <IoWalletOutline size={24} />
      <CgArrowsExchangeAlt className="absolute rounded-full bg-white dark:bg-gray-500 text-sm bottom-0 w-10 h-10 -right-2" />
    </div>
  );
}
