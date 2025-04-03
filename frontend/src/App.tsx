import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import ListDatabases from "./pages/ListDatabases";
import Database from "./pages/Database";

function App() {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/databases" element={<ListDatabases />} />
        <Route path="/database/:dbName" element={<Database />} />
      </Routes>
    </div>
  );
}

export default App;
