function Navbar({
    search,
    setSearch
}) {
  const time = new Date().toLocaleTimeString();

  return (
    <div className="h-20 px-8 flex items-center justify-between border-b border-white/10 bg-[#0B1120]/80 backdrop-blur-xl">
      
      <div className="text-2xl font-bold text-white">
        PulsePOS
      </div>

      <div className="w-[420px] bg-[#111827] rounded-2xl px-5 py-3 border border-white/5">
        <input
          type="text"
          placeholder="🔍 Search products..."
          className="w-full bg-transparent outline-none text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-6">
        <span className="text-slate-400">
          {time}
        </span>

        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
          P
        </div>
      </div>

    </div>
  );
}

export default Navbar;