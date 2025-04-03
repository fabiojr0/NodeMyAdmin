import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ListDatabases from "./pages/ListDatabases";
import Database from "./pages/Database";
import Table from "./pages/Table";
import TableStructure from "./pages/TableStructure";
import TableInsert from "./pages/TableInsert";

function App() {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Navigate to="/databases" replace />} />
        <Route path="/databases" element={<ListDatabases />} />
        <Route path="/database/:dbName" element={<Database />} />
        <Route path="/database/:dbName/table/:tableName" element={<Table />} />
        <Route path="/database/:dbName/table/:tableName/structure" element={<TableStructure />} />
        <Route path="/database/:dbName/table/:tableName/insert" element={<TableInsert />} />
      </Routes>
    </div>
  );
}

export default App;
