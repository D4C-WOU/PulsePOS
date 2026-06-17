import {
  FiBell,
  FiSearch,
} from "react-icons/fi";

import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const title =
    location.pathname
      .split("/")
      .filter(Boolean)
      .pop() || "dashboard";

  return (
    <header className="h-20 bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-800">

      <div className="h-full px-8 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold capitalize">
            {title}
          </h1>

          <p className="text-sm text-slate-500">
            Welcome back to PulsePOS
          </p>
        </div>

        <div className="flex items-center gap-4">

          <div
            className="
              w-80
              bg-slate-900
              border border-slate-800
              rounded-xl
              px-4 py-3
              flex items-center gap-3
            "
          >
            <FiSearch className="text-slate-500" />

            <input
              placeholder="Search..."
              className="
                bg-transparent
                outline-none
                w-full
              "
            />
          </div>

          <button
            className="
              h-12
              w-12
              rounded-xl
              bg-slate-900
              flex
              items-center
              justify-center
            "
          >
            <FiBell />
          </button>

        </div>

      </div>

    </header>
  );
};

export default Navbar;