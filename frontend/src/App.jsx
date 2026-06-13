import { useState } from "react";

import Login from "./pages/Login";
import POS from "./pages/POS";

function App() {
  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  return isLoggedIn ? (
    <POS />
  ) : (
    <Login
      onLogin={() =>
        setIsLoggedIn(true)
      }
    />
  );
}

export default App;