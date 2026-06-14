import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <BrowserRouter>
      {/* App routes */}
      <AppRouter />
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#132A1E",
            color: "#FEFAE0",
            border: "1px solid #2D4A3E",
            fontSize: "13px",
            borderRadius: "10px",
          },
          success: {
            iconTheme: {
              primary: "#52B788",
              secondary: "#132A1E",
            },
          },
          error: {
            iconTheme: {
              primary: "#B22222",
              secondary: "#FEFAE0",
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
