import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TableSelection from "./pages/TableSelection";
import KitchenDisplay from "./pages/KitchenDisplay";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tables" replace />} />
        <Route path="/tables" element={<TableSelection />} />
        <Route path="/kitchen" element={<KitchenDisplay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;