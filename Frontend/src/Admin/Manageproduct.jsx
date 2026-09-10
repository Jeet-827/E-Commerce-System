import React from "react";
import Nav from "./Nav";

const Manageorder = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex font-sans">
      {/* Sidebar Nav */}
      <Nav />

      {/* Main Content */}
      <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="pb-6 border-b border-slate-800">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Manage Products
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              View and organize catalog products
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Product Catalog Management</h3>
            <p className="text-xs text-slate-400">Inventory and product management view.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manageorder;