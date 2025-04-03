import { isAxiosError } from "axios";
import api from "../setup/api";

const useDatabase = () => {
    const createDatabase = async (dbName: string) => {
        try {
            const response = await api.post('/create-database', { dbName });

            if (response.status !== 200) {
                return { type: 'error', text: `Erro ao criar banco de dados` }
            }

            return { type: 'success', text: `Banco de dados ${dbName} criado com sucesso!` }
        } catch (error) {

            if (isAxiosError(error)) {
                return { type: 'error', text: `Erro ao criar banco de dados: ${error?.response?.data.error}` }
            }

            console.error('Error creating database:', error);
        }
    };

    const getDatabases = async () => {
        try {
            const response = await api.get('/show-databases');

            const { data } = response;

            const databases = data.flatMap((db: { Database: string }) => db.Database) // Flatten the array of databases

            return databases as string[];
        } catch (error) {
            console.error('Error fetching databases:', error);
            return [];
        }
    };

    return { getDatabases, createDatabase };
}



export default useDatabase;