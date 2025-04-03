import api from "../setup/api";

const useTable = () => {
    // Busca todas as tabelas de um banco
    const getTables = async (dbName: string) => {
        try {
            const response = await api.get(`/show-tables?dbName=${dbName}`);
            const { data } = response;

            if (!data || data.length === 0) return [];

            // Obtém a chave dinamicamente (exemplo: "Tables_in_meuBanco")
            const tableKey = Object.keys(data[0]).find(key => key.startsWith("Tables_in_"));

            if (!tableKey) throw new Error("Formato inesperado na resposta da API");

            return data.flatMap((db: Record<string, string>) => db[tableKey]) as string[];
        } catch (error) {
            console.error("Erro ao buscar tabelas:", error);
            return [];
        }
    };

    // Cria uma tabela
    const createTable = async (dbName: string, tableName: string, columns: { name: string, type: string, primaryKey: boolean, foreignKey: { table: string, column: string } }[]) => {
        try {
            const columnDefinitions = columns.map(col => {
                let definition = `${col.name} ${col.type}`;
                if (col.primaryKey) definition += " PRIMARY KEY";
                if (col.foreignKey.table) definition += ` REFERENCES ${col.foreignKey.table}(${col.foreignKey.column})`;
                return definition;
            }).join(", ");

            const response = await api.post("/create-table", {
                dbName,
                tableName,
                columns: columnDefinitions,
            });
            console.log("Tabela criada com sucesso:", response.data);

            return response.data;
        } catch (error) {
            console.error("Erro ao criar tabela:", error);
            throw error;
        }
    };


    // Obtém os dados de uma tabela (SELECT)
    const getTableData = async (dbName: string, tableName: string) => {
        try {
            const response = await api.get(`/list-records?dbName=${dbName}&tableName=${tableName}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar dados da tabela:", error);
            return [];
        }
    };

    // Obtém a estrutura das colunas de uma tabela (DESCRIBE)
    const getTableColumns = async (dbName: string, tableName: string) => {
        try {
            const response = await api.get(`/show-columns?dbName=${dbName}&tableName=${tableName}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar colunas da tabela:", error);
            return [];
        }
    };

    // Insere um registro na tabela (INSERT)
    const insertRecord = async (dbName: string, tableName: string, data: { columns: unknown[]; values: unknown[] }) => {
        try {
            const { columns, values } = data;

            return await api.post("/insert-record", {
                dbName,
                tableName,
                columns,
                values,
            });

        } catch (error) {
            console.error("Erro ao inserir registro:", error);
            throw error;
        }
    };


    return { getTables, createTable, getTableData, getTableColumns, insertRecord };
}

export default useTable;
