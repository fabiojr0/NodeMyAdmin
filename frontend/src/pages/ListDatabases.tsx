import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Tabs from "../components/Tabs";
import useDatabase from "../hooks/useDatabase";
import { TrashSimple } from "@phosphor-icons/react";

function ListDatabases() {
  const tabs = [{ tab: "databases", name: "Banco de Dados" }];
  const { getDatabases, createDatabase } = useDatabase();
  const queryClient = useQueryClient();

  // Estado para armazenar o nome do banco de dados a ser criado
  const [dbName, setDbName] = useState("");

  // Query para buscar bancos de dados
  const { data } = useQuery({
    queryKey: ["databases"],
    queryFn: getDatabases,
    staleTime: 1000 * 60 * 5,
  });

  // Mutation para criar banco de dados
  const mutation = useMutation({
    mutationFn: createDatabase,
    onSuccess: () => {
      // Recarregar a lista de bancos de dados após a criação
      queryClient.invalidateQueries({ queryKey: ["databases"] });
      setDbName(""); // Resetar o input
    },
  });

  return (
    <main className="py-4 w-full">
      <Tabs tabs={tabs} />
      <div className="p-4 flex flex-col gap-12 w-full">
        <h2 className="text-2xl">Banco de Dados</h2>

        <div className="bg-zinc-200 w-full p-8 border border-zinc-400 rounded relative">
          <div className="absolute -top-6 left-4 bg-white py-2 px-4 rounded border border-zinc-400">
            Criar Banco de Dados
          </div>
          <input
            className="bg-white border border-zinc-400 rounded p-1"
            placeholder="Nome do banco de dados"
            value={dbName}
            onChange={(e) => setDbName(e.target.value)}
          />
          <button
            className="bg-emerald-600 text-white py-1 px-4 rounded ml-2 border border-zinc-400 cursor-pointer hover:bg-emerald-700 transition-colors active:scale-95"
            onClick={() => mutation.mutate(dbName)}
          >
            Criar
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

          {data && (
            <div className="overflow-x-auto">
              <table className="border border-zinc-400 bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-700">
                    <th className="border px-4 py-2 w-auto">#</th>
                    <th className="border px-4 py-2 w-auto whitespace-nowrap">Banco de dados</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((db, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="border px-4 py-2">
                        <input type="checkbox" />
                      </td>
                      <td className="border px-4 py-2 whitespace-nowrap">{db}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="border px-4 py-2 font-bold">
                      Total: {data.length}
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

export default ListDatabases;
