import api from "../setup/api";

const useTable = () => {
    const getTables = async (dbName: string) => {
        try {
            const response = await api.get(`/show-tables?dbName=${dbName}`);
            const { data } = response;

            if (!data || data.length === 0) return [];

            // Obtém a chave dinamicamente (exemplo: "Tables_in_meuBanco")
            const tableKey = Object.keys(data[0]).find(key => key.startsWith("Tables_in_"));

            if (!tableKey) throw new Error("Formato inesperado na resposta da API");

            // Extrai e retorna um array de strings usando flatMap
            return data.flatMap((db: Record<string, string>) => db[tableKey]) as string[];
        } catch (error) {
            console.error("Erro ao buscar tabelas:", error);
            return [];
        }
    };


    const createTable = async (dbName: string, tableName: string, columns: { name: string, type: string }[]) => {
        try {
            // Convertendo os objetos de colunas em um formato adequado para SQL
            const columnsSQL = columns.map(col => `${col.name} ${col.type}`).join(", ");

            const response = await api.post('/create-table', {
                dbName,
                tableName,
                columns: columnsSQL,
            });

            return response.data;
        } catch (error) {
            console.error('Erro ao criar tabela:', error);
            throw error;
        }
    };

    return { getTables, createTable };
}

export default useTable;
