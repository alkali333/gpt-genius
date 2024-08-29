import { FaSun, FaMoon } from "react-icons/fa";
import Link from "next/link";

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 lg:ml-80">
    <div className="max-w-2xl flex space-x-5 p-4">
      <Link
        href="/morning-practice"
        className="flex-1"
        aria-label="Go to Morning Practice"
      >
        <button className="w-full flex flex-col items-center justify-center py-2 px-2 bg-yellow-200 text-yellow-600 hover:bg-yellow-300 transition-colors rounded-lg">
          <FaSun className="h-6 w-6 mb-1" aria-hidden="true" />
          <span className="text-sm font-medium">Morning Practice</span>
        </button>
      </Link>
      <Link
        href="/evening-practice"
        className="flex-1"
        aria-label="Go to Evening Practice"
      >
        <button className="w-full flex flex-col items-center justify-center py-2 px-2 bg-indigo-200 text-indigo-600 hover:bg-indigo-300 transition-colors rounded-lg">
          <FaMoon className="h-6 w-6 mb-1" aria-hidden="true" />
          <span className="text-sm font-medium">Evening Practice</span>
        </button>
      </Link>
    </div>
  </nav>
);

export default BottomNav;
