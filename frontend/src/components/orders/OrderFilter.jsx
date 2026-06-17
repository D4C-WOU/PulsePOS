import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";

const OrderFilter = ({
  search,
  setSearch,
  status,
  setStatus,
  payment,
  setPayment,
  onReset,
}) => {
  return (
    <div className="bg-[#111827] border border-white/5 rounded-3xl p-6 shadow-xl mb-8">

      <div className="flex items-center gap-2 mb-6">
        <FiFilter className="text-orange-500 text-xl" />

        <h2 className="text-xl font-semibold text-white">
          Filter Orders
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Search */}
        <div className="flex items-center bg-[#1A2333] rounded-2xl px-4 py-3">
          <FiSearch className="text-slate-500" />

          <input
            type="text"
            placeholder="Search Order / Customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent ml-3 outline-none w-full text-white placeholder:text-slate-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-[#1A2333] rounded-2xl px-4 py-3 text-white outline-none"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Cooking">Cooking</option>
          <option value="Ready">Ready</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Payment Filter */}
        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className="bg-[#1A2333] rounded-2xl px-4 py-3 text-white outline-none"
        >
          <option value="All">All Payments</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
        </select>

        {/* Reset */}
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 rounded-2xl px-4 py-3 font-semibold text-white transition"
        >
          <FiRefreshCw />
          Reset Filters
        </button>

      </div>
    </div>
  );
};

export default OrderFilter;