import {
  FiGrid,
  FiShoppingCart,
  FiClipboard,
  FiBox,
  FiTag,
  FiUsers,
  FiBarChart2,
  FiCoffee,
  FiCreditCard,
  FiLogOut,
} from "react-icons/fi";

import { TbToolsKitchen2 } from "react-icons/tb";
import { NavLink } from "react-router-dom";

const sections = [
  {
    title: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: FiGrid,
      },
    ],
  },

  {
    title: "OPERATIONS",
    items: [
      {
        name: "POS",
        path: "/pos",
        icon: FiShoppingCart,
      },
      {
        name: "Orders",
        path: "/orders",
        icon: FiClipboard,
      },
      {
        name: "Kitchen",
        path: "/kitchen",
        icon: TbToolsKitchen2,
      },
      {
        name: "Tables",
        path: "/tables",
        icon: FiCoffee,
      },
    ],
  },

  {
    title: "MENU",
    items: [
      {
        name: "Products",
        path: "/products",
        icon: FiBox,
      },
      {
        name: "Categories",
        path: "/categories",
        icon: FiTag,
      },
    ],
  },

  {
    title: "BUSINESS",
    items: [
      {
        name: "Customers",
        path: "/customers",
        icon: FiUsers,
      },
      {
        name: "Payments",
        path: "/payments",
        icon: FiCreditCard,
      },
      {
        name: "Reports",
        path: "/reports",
        icon: FiBarChart2,
      },
    ],
  },

  {
    title: "ADMIN",
    items: [
      {
        name: "Employees",
        path: "/employees",
        icon: FiUsers,
      },
    ],
  },
];

const Sidebar = () => {
  return (
    <aside className="w-72 bg-[#0F172A] border-r border-slate-800 flex flex-col">

      <div className="h-20 px-6 flex flex-col justify-center border-b border-slate-800">
        <h1 className="text-2xl font-bold text-orange-500">
          PulsePOS
        </h1>

        <p className="text-xs text-slate-500">
          Restaurant ERP
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">

        {sections.map((section) => (
          <div key={section.title} className="mb-8">

            <p className="text-xs font-semibold text-slate-500 mb-3 px-3">
              {section.title}
            </p>

            <div className="space-y-1">

              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `
                      flex items-center gap-3
                      px-4 py-3
                      rounded-xl
                      transition-all

                      ${isActive
                        ? "bg-orange-500 text-white shadow-lg"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }
                    `
                    }
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800 p-4">

        <div className="bg-slate-900 rounded-2xl p-4">

          <h3 className="font-semibold text-white">
            Admin User
          </h3>

          <p className="text-xs text-slate-500">
            Restaurant Manager
          </p>

          <button
            className="
              mt-4
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-red-500/10
              text-red-400
              py-2
              rounded-xl
            "
          >
            <FiLogOut />
            Logout
          </button>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;