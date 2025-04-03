import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useTable from "../hooks/useTable";
import Tabs from "../components/Tabs";

// Definição da estrutura esperada para colunas
interface Column {
  Default?: unknown;
  Extra?: string;
  Field: string;
  Key: string;
  Null: string;
  Type: string;
}

function TableInsert() {
  const { dbName, tableName } = useParams<{ dbName: string; tableName: string }>();
  const tabs = [
    { tab: `/database/${dbName}/table/${tableName}`, name: "Visualizar" },
    { tab: `/database/${dbName}/table/${tableName}/structure`, name: "Estrutura" },
    { tab: `/database/${dbName}/table/${tableName}/insert`, name: "Inserir" },
  ];
  const { insertRecord, getTableColumns } = useTable();

  // Estado do formulário
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [nullValues, setNullValues] = useState<Record<string, boolean>>({});

  // Fetch das colunas da tabela usando useQuery
  const { data: columns = [] } = useQuery<Column[]>({
    queryKey: ["tableColumns", dbName, tableName],
    queryFn: () => getTableColumns(dbName ?? "", tableName ?? ""),
    enabled: !!dbName && !!tableName,
  });

  // Inicializa os valores do formulário quando as colunas são carregadas
  useEffect(() => {
    if (columns.length > 0) {
      setFormData(Object.fromEntries(columns.map((col) => [col.Field, ""])));
      setNullValues(Object.fromEntries(columns.map((col) => [col.Field, false])));
    }
  }, [columns]);

  // Configuração do useMutation para inserir registros
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { columns: unknown[]; values: unknown[] }) => insertRecord(dbName ?? "", tableName ?? "", data),
    onSuccess: () => {
      alert("Registro inserido com sucesso!");
      setFormData(Object.fromEntries(columns.map((col) => [col.Field, ""]))); // Reset do form
      setNullValues(Object.fromEntries(columns.map((col) => [col.Field, false])));
      queryClient.invalidateQueries({ queryKey: ["tables-data"] }); // Atualiza a lista de colunas
    },
    onError: (error) => {
      console.error(error);
      alert("Erro ao inserir registro.");
    },
  });

  // Atualiza o estado ao alterar os inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Marca o valor como NULL (ou não)
  const handleNullChange = (field: string) => {
    setNullValues((prev) => {
      const newNullValues = { ...prev, [field]: !prev[field] };
      setFormData({ ...formData, [field]: newNullValues[field] ? "NULL" : "" });
      return newNullValues;
    });
  };

  // Dispara a mutação ao enviar o formulário
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filteredValues = columns.map((column) => {
      const value = formData[column.Field];

      if (column?.Extra === "auto_increment") return 0;

      // Se for NULL, retorna NULL sem aspas
      if (nullValues[column.Field]) return null;

      // Se for número, retorna sem aspas
      if (!isNaN(Number(value))) return value;

      // Retorna string com aspas simples e escapa caracteres problemáticos
      return `'${value.replace(/'/g, "''")}'`;
    });

    // Garante que o número de colunas e valores está correto
    if (columns.length !== filteredValues.length) {
      alert("Erro: número de colunas e valores não correspondem.");
      return;
    }

    // Passa colunas e valores formatados para a mutation
    mutation.mutate({
      columns,
      values: filteredValues,
    });
  };

  return (
    <main className="py-4 w-full">
      <Tabs tabs={tabs} />
      <div className="p-4 flex flex-col gap-12 w-full">
        <h2 className="text-2xl">Tabela: {tableName}</h2>
        <form onSubmit={handleSubmit} className="p-8 border rounded w-full h-fit bg-gray-100 relative">
          <div className="absolute -top-6 left-4 bg-white py-2 px-4 rounded border border-zinc-400">
            Inserir {tableName}
          </div>

          <table className="border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border p-2">Coluna</th>
                <th className="border p-2">Tipo</th>
                <th className="border p-2">Função</th>
                <th className="border p-2">Nulo</th>
                <th className="border p-2">Valor</th>
              </tr>
            </thead>
            <tbody>
              {columns.map((col) => (
                <tr key={col.Field} className="bg-white">
                  <td className="border p-2">{col.Field}</td>
                  <td className="border p-2 text-gray-600">{col.Type}</td>
                  <td className="border p-2">
                    <select className="border p-1 rounded w-full" disabled={col.Extra === "auto_increment"}>
                      <option value="">Nenhuma</option>
                      <option value="UUID()">UUID()</option>
                      <option value="NOW()">NOW()</option>
                    </select>
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={nullValues[col.Field]}
                      onChange={() => handleNullChange(col.Field)}
                      disabled={col.Extra === "auto_increment"}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      name={col.Field}
                      value={formData[col.Field] || ""}
                      onChange={handleChange}
                      disabled={nullValues[col.Field] || col.Extra === "auto_increment"}
                      className="p-1 border rounded w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4 w-full">
            Executar
          </button>
        </form>
      </div>
    </main>
  );
}

export default TableInsert;
