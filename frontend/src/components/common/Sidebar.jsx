import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiGrid,
  FiMonitor,
  FiLogOut,
  FiX,
} from "react-icons/fi";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FiHome size={20} />,
    },
    {
      name: "Products",
      path: "/products",
      icon: <FiPackage size={20} />,
    },
    {
      name: "Orders",
      path: "/orders",
      icon: <FiShoppingBag size={20} />,
    },
    {
      name: "Tables",
      path: "/tables",
      icon: <FiGrid size={20} />,
    },
    {
      name: "Kitchen",
      path: "/kitchen",
      icon: <FiMonitor size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          h-screen w-64
          bg-[#111827]
          border-r border-slate-800
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white">
            PulsePOS
          </h1>

          <button
            onClick={toggleSidebar}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3
                    px-4 py-3 rounded-xl
                    transition-all duration-200

                    ${
                      isActive
                        ? "bg-orange-500 text-white shadow-lg"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }
                  `
                  }
                >
                  {item.icon}
                  <span className="font-medium">
                    {item.name}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <button
            className="
              w-full flex items-center gap-3
              px-4 py-3 rounded-xl
              text-red-400
              hover:bg-red-500/10
              transition
            "
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;