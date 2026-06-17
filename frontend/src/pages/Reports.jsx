const Reports = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Reports
        </h1>

        <p className="text-slate-400 mt-1">
          Restaurant performance analytics and insights.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <h3 className="font-semibold">
            Revenue
          </h3>

          <p className="text-slate-400 mt-2">
            Daily & monthly sales reports.
          </p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <h3 className="font-semibold">
            Orders
          </h3>

          <p className="text-slate-400 mt-2">
            Order analytics and trends.
          </p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <h3 className="font-semibold">
            Products
          </h3>

          <p className="text-slate-400 mt-2">
            Top-selling products overview.
          </p>
        </div>

      </div>

    </div>
  );
};

export default Reports;