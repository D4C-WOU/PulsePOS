import { FiSearch, FiFilter, FiRefreshCw } from "react-icons/fi";

const ProductFilter = ({
  search,
  setSearch,
  category,
  setCategory,
  onReset,
}) => {
  return (
    <div className="bg-[#111827] border border-white/5 rounded-3xl p-6 shadow-xl mb-8">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <FiFilter className="text-orange-500 text-xl" />

        <h2 className="text-xl font-semibold text-white">
          Filter Products
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Search */}
        <div className="flex items-center bg-[#1A2333] rounded-2xl px-4 py-3">
          <FiSearch className="text-slate-500" />

          <input
            type="text"
            placeholder="Search Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent ml-3 w-full outline-none text-white placeholder:text-slate-500"
          />
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-[#1A2333] rounded-2xl px-4 py-3 text-white outline-none"
        >
          <option value="All">All Categories</option>
          <option value="Fast Food">Fast Food</option>
          <option value="Italian">Italian</option>
          <option value="Beverages">Beverages</option>
          <option value="Desserts">Desserts</option>
        </select>

        {/* Reset */}
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 rounded-2xl px-4 py-3 text-white font-semibold transition"
        >
          <FiRefreshCw />
          Reset
        </button>

      </div>
    </div>
  );
};

export default ProductFilter;