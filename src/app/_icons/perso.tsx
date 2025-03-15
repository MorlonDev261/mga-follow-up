import { IoWalletOutline } from "react-icons/io5";
import { CgArrowsExchangeAlt } from "react-icons/cg";

export function SwapWallet() {
  return (
    <div className="relative">
      <IoWalletOutline size={24} />
      <CgArrowsExchangeAlt className="absolute rounded-full bg-white dark:bg-gray-500 text-sm bottom-0 w-3 h-3 shadow-[0px_0px_1px_rgba(0,0,0,0.2)] dark:shadow-none -right-1" />
    </div>
  );
}
