import { useState } from "react";
import { motion } from "framer-motion";
import { FiUsers } from "react-icons/fi";

const floors = [
  {
    id: 1,
    name: "Ground Floor",
  },
  {
    id: 2,
    name: "First Floor",
  },
  {
    id: 3,
    name: "Outdoor",
  },
];

const tablesData = [
  {
    id: 1,
    number: 1,
    seats: 4,
    status: "available",
    floor: 1,
  },
  {
    id: 2,
    number: 2,
    seats: 2,
    status: "occupied",
    floor: 1,
  },
  {
    id: 3,
    number: 3,
    seats: 6,
    status: "available",
    floor: 1,
  },
  {
    id: 4,
    number: 4,
    seats: 4,
    status: "occupied",
    floor: 1,
  },
  {
    id: 5,
    number: 5,
    seats: 8,
    status: "available",
    floor: 2,
  },
  {
    id: 6,
    number: 6,
    seats: 4,
    status: "occupied",
    floor: 2,
  },
  {
    id: 7,
    number: 7,
    seats: 2,
    status: "available",
    floor: 3,
  },
  {
    id: 8,
    number: 8,
    seats: 4,
    status: "occupied",
    floor: 3,
  },
];

const Tables = () => {
  const [selectedFloor, setSelectedFloor] = useState(1);

  const filteredTables = tablesData.filter(
    (table) => table.floor === selectedFloor
  );

  return (
    <div className="min-h-screen bg-[#0B1120] p-6">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Table Management
        </h1>

        <p className="text-slate-400 mt-2">
          Monitor and manage restaurant tables
        </p>
      </div>

      {/* Floor Selector */}
      <div className="flex flex-wrap gap-3 mb-8">
        {floors.map((floor) => (
          <button
            key={floor.id}
            onClick={() =>
              setSelectedFloor(floor.id)
            }
            className={`
              px-5 py-3 rounded-xl font-medium transition
              
              ${
                selectedFloor === floor.id
                  ? "bg-orange-500 text-white"
                  : "bg-[#111827] text-slate-400 border border-slate-800 hover:text-white"
              }
            `}
          >
            {floor.name}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5">
          <p className="text-slate-400">
            Total Tables
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {filteredTables.length}
          </h2>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5">
          <p className="text-slate-400">
            Occupied
          </p>

          <h2 className="text-3xl font-bold text-orange-500 mt-2">
            {
              filteredTables.filter(
                (t) => t.status === "occupied"
              ).length
            }
          </h2>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5">
          <p className="text-slate-400">
            Available
          </p>

          <h2 className="text-3xl font-bold text-green-500 mt-2">
            {
              filteredTables.filter(
                (t) => t.status === "available"
              ).length
            }
          </h2>
        </div>

      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTables.map((table, index) => (
          <motion.div
            key={table.id}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.05,
            }}
            whileHover={{
              scale: 1.03,
            }}
            className={`
              rounded-3xl
              p-6
              border
              cursor-pointer
              transition-all

              ${
                table.status === "occupied"
                  ? "bg-orange-500/10 border-orange-500/30"
                  : "bg-[#111827] border-slate-800"
              }
            `}
          >
            <div className="flex justify-between items-start">
              
              <div>
                <h3 className="text-2xl font-bold text-white">
                  T-{table.number}
                </h3>

                <p className="text-slate-400 text-sm mt-1">
                  Table Number
                </p>
              </div>

              <span
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold

                  ${
                    table.status === "occupied"
                      ? "bg-orange-500/20 text-orange-500"
                      : "bg-green-500/20 text-green-500"
                  }
                `}
              >
                {table.status}
              </span>

            </div>

            <div className="mt-6 flex items-center gap-3">
              <FiUsers
                className={
                  table.status === "occupied"
                    ? "text-orange-500"
                    : "text-green-500"
                }
              />

              <span className="text-white">
                {table.seats} Seats
              </span>
            </div>

            <div className="mt-6">
              <button
                className={`
                  w-full py-3 rounded-xl font-medium

                  ${
                    table.status === "occupied"
                      ? "bg-orange-500 text-white"
                      : "bg-green-500 text-white"
                  }
                `}
              >
                {table.status === "occupied"
                  ? "View Order"
                  : "Assign Table"}
              </button>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Tables;