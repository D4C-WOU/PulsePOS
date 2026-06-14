import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export const BackendLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--color-bg-deep)" }}
    >
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: "220px" }}>
        {/* Fixed Top Bar */}
        <TopBar />

        {/* Scrollable Content Area */}
        <main
          className="flex-1 overflow-y-auto p-6 lg:p-8"
          style={{
            marginTop: "56px", /* TopBar height */
            background: "var(--color-bg-deep)",
            /* Subtle dot pattern */
            backgroundImage: "radial-gradient(rgba(201,151,58,0.025) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default BackendLayout;
