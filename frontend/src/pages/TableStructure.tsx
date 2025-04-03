import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Tabs from "../components/Tabs";
import useTable from "../hooks/useTable";
import { TrashSimple } from "@phosphor-icons/react";
import { Key } from "react";

function Table() {
  const { dbName, tableName } = useParams();
  const tabs = [
    { tab: `/database/${dbName}/table/${tableName}`, name: "Visualizar" },
    { tab: `/database/${dbName}/table/${tableName}/structure`, name: "Estrutura" },
    { tab: `/database/${dbName}/table/${tableName}/insert`, name: "Inserir" },
  ];

  const { getTableColumns } = useTable();

  // Query para buscar os dados da tabela
  const { data } = useQuery({
    queryKey: ["tables-structure", dbName, tableName],
    queryFn: () => getTableColumns(dbName ?? "", tableName ?? ""),
    staleTime: 0,
    enabled: !!tableName,
  });
  console.log(data);
  
  return (
    <main className="py-4 w-full">
      <Tabs tabs={tabs} />
      <div className="p-4 flex flex-col gap-12 w-full">
        <h2 className="text-2xl">Tabela: {tableName}</h2>

        {/* Lista de dados da tabela */}
        <div className="flex flex-col gap-4">
          {/* Ações */}
          <div className="flex items-center gap-2 border border-zinc-400 bg-white rounded w-fit">
            <div className="border-r border-zinc-400 p-2 flex items-center gap-2">
              <input type="checkbox" /> Marcar Todos
            </div>
            <div className="p-2 flex items-center gap-2">
              <TrashSimple size={20} color="red" />
              Excluir
            </div>
          </div>

          {/* Renderização da tabela dinâmica */}
          {data && data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="border border-zinc-400 bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-700">
                    <th className="border px-4 py-2 w-auto">#</th>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} className="border px-4 py-2 w-auto whitespace-nowrap">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row: { [s: string]: unknown } | ArrayLike<unknown>, index: Key | null | undefined) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="border px-4 py-2">
                        <input type="checkbox" />
                      </td>
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="border px-4 py-2 whitespace-nowrap">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={Object.keys(data[0]).length + 1} className="border px-4 py-2 font-bold">
                      Total de Registros: {data.length}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Nenhum dado encontrado.</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default Table;
