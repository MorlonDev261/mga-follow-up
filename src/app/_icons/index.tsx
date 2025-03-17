import { IoWalletOutline } from "react-icons/io5";
import { CgArrowsExchangeAlt } from "react-icons/cg";

export function SwapWallet() {
  return (
    <div className="relative">
      <IoWalletOutline size={24} />
      <CgArrowsExchangeAlt className="absolute rounded-full bg-background text-sm bottom-0 w-3 h-3 right-0" />
    </div>
  );
}
