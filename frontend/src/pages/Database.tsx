/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import Tabs from "../components/Tabs";
import useTable from "../hooks/useTable";
import { Plus, Table, TrashSimple, TreeStructure } from "@phosphor-icons/react";

function Database() {
  const { dbName } = useParams();
  const tabs = [{ tab: "/database/" + dbName, name: "Estrutura" }];
  const { getTables, createTable } = useTable();

  const queryClient = useQueryClient();

  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([
    { name: "", type: "VARCHAR(255)", primaryKey: false, foreignKey: { table: "", column: "" } },
  ]);

  const { data: tables } = useQuery({
    queryKey: ["tables", dbName],
    queryFn: () => getTables(dbName ?? ""),
    staleTime: 0,
    enabled: !!dbName,
  });

  const mutation = useMutation({
    mutationFn: () => createTable(dbName ?? "", tableName.replaceAll(" ", "_"), columns),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables", dbName] });
      setTableName("");
      setColumns([{ name: "", type: "VARCHAR(255)", primaryKey: false, foreignKey: { table: "", column: "" } }]);
    },
  });

  const addColumn = () => {
    setColumns([
      ...columns,
      { name: "", type: "VARCHAR(255)", primaryKey: false, foreignKey: { table: "", column: "" } },
    ]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, field: unknown, value: unknown) => {
    const newColumns = [...columns];
    if (field === "primaryKey" && value) {
      newColumns.forEach((col, i) => {
        if (i !== index) col.primaryKey = false;
      });
    }
    // @ts-expect-error
    newColumns[index][field] = value;
    setColumns(newColumns);
  };

  return (
    <main className="py-4 w-full">
      <Tabs tabs={tabs} />
      <div className="p-4 flex flex-col gap-12 w-full">
        <h2 className="text-2xl">Banco de Dados: {dbName}</h2>

        <div className="bg-zinc-200 w-full p-8 border border-zinc-400 rounded relative">
          <div className="absolute -top-6 left-4 bg-white py-2 px-4 rounded border border-zinc-400">Criar Tabela</div>
          <input
            className="bg-white border border-zinc-400 rounded p-1 w-full"
            placeholder="Nome da tabela"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          />

          <table className="mt-4 w-full border border-zinc-400 bg-white">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="border px-4 py-2">Nome</th>
                <th className="border px-4 py-2">Tipo</th>
                <th className="border px-4 py-2">PK</th>
                <th className="border px-4 py-2">FK (Tabela)</th>
                <th className="border px-4 py-2">FK (Coluna)</th>
                <th className="border px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {columns.map((col, index) => (
                <tr key={index} className="border-t">
                  <td className="border px-4 py-2">
                    <input
                      className="w-full p-1 border border-zinc-400 rounded"
                      type="text"
                      value={col.name}
                      onChange={(e) => updateColumn(index, "name", e.target.value)}
                      placeholder="Nome da coluna"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      className="w-full p-1 border border-zinc-400 rounded"
                      value={col.type}
                      onChange={(e) => updateColumn(index, "type", e.target.value)}
                    >
                      <option value="VARCHAR(255)">VARCHAR(255)</option>
                      <option value="INT">INT</option>
                      <option value="TEXT">TEXT</option>
                      <option value="BOOLEAN">BOOLEAN</option>
                      <option value="DATE">DATE</option>
                      <option value="INT AUTO_INCREMENT">ID (AUTO_INCREMENT)</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={col.primaryKey}
                      onChange={(e) => updateColumn(index, "primaryKey", e.target.checked)}
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      className="w-full p-1 border border-zinc-400 rounded"
                      value={col.foreignKey.table}
                      onChange={(e) => updateColumn(index, "foreignKey", { ...col.foreignKey, table: e.target.value })}
                    >
                      <option value="">Nenhuma</option>
                      {tables?.map((table) => (
                        <option key={table} value={table}>
                          {table}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      className="w-full p-1 border border-zinc-400 rounded"
                      type="text"
                      placeholder="Nome da coluna"
                      value={col.foreignKey.column}
                      onChange={(e) => updateColumn(index, "foreignKey", { ...col.foreignKey, column: e.target.value })}
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {columns.length > 1 && (
                      <button className="text-red-500 hover:text-red-700" onClick={() => removeColumn(index)}>
                        Remover
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="mt-4 bg-orange-400 text-white py-1 px-4 rounded border border-zinc-400"
            onClick={addColumn}
          >
            + Adicionar Coluna
          </button>
          <button
            className="mt-4 bg-[#4D9942] text-white py-1 px-4 rounded ml-2 border border-zinc-400 cursor-pointer hover:bg-emerald-600 transition-colors active:scale-95"
            onClick={() => mutation.mutate()}
            disabled={!tableName || columns.some((col) => !col.name)}
          >
            Criar Tabela
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border border-zinc-400 bg-white rounded w-fit">
            <div className="border-r border-zinc-400 p-2 flex items-center gap-2">
              <input type="checkbox" /> Marcar Todos
            </div>
            <div className="p-2 flex items-center gap-2">
              <TrashSimple size={20} color="red" />
              Excluir
            </div>
          </div>

          {tables && (
            <div className="overflow-x-auto">
              <table className="border border-zinc-400 bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-700">
                    <th className="border px-4 py-2 w-auto">#</th>
                    <th className="border px-4 py-2 w-auto whitespace-nowrap">Tabela</th>
                    <th className="border px-4 py-2 w-auto">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map((table, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="border px-4 py-2">
                        <input type="checkbox" />
                      </td>
                      <td className="border px-4 py-2 whitespace-nowrap">{table}</td>
                      <td className="px-4 py-2 whitespace-nowrap flex items-center gap-2">
                        <Link
                          to={`/database/${dbName}/table/${table}`}
                          className="text-blue-600 hover:underline mr-2 flex items-center gap-1"
                        >
                          <Table size={20} />
                          Visualizar
                        </Link>
                        <Link
                          to={`/database/${dbName}/table/${table}/insert`}
                          className="text-[#4D9942] hover:underline mr-2 flex items-center gap-1"
                        >
                          <Plus size={20} />
                          Inserir
                        </Link>
                        <Link
                          to={`/database/${dbName}/table/${table}/structure`}
                          className="text-purple-600 hover:underline flex items-center gap-1"
                        >
                          <TreeStructure size={20} />
                          Estrutura
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="border px-4 py-2 font-bold">
                      Total: {tables.length}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Database;
