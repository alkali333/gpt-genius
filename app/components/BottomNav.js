import { FaSun, FaMoon } from "react-icons/fa";
import Link from "next/link";

const BottomNav = () => (
  <div className="flex max-w-2xl mt-8 space-x-5">
    <Link
      href="/morning-practice"
      className="flex-1"
      aria-label="Go to Morning Practice"
    >
      <button className="w-full flex flex-col items-center justify-center py-4 px-2 bg-yellow-200 text-yellow-600 hover:bg-yellow-300 transition-colors rounded-lg">
        <FaSun className="h-6 w-6 mb-1" aria-hidden="true" />
        <span className="text-sm font-medium">Morning Practice</span>
      </button>
    </Link>
    <Link
      href="/evening-practice"
      className="flex-1"
      aria-label="Go to Evening Practice"
    >
      <button className="w-full flex flex-col items-center justify-center py-4 px-2 bg-indigo-200 text-indigo-600 hover:bg-indigo-300 transition-colors  rounded-lg">
        <FaMoon className="h-6 w-6 mb-1" aria-hidden="true" />
        <span className="text-sm font-medium">Evening Practice</span>
      </button>
    </Link>
  </div>
);

export default BottomNav;
