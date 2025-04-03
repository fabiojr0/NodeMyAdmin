import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Exemplo: tempo de validade (staleTime) de 1 hora
      staleTime: 1000 * 60 * 60,
    },
  },
});

// Cria o persister utilizando o localStorage
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

// Configura a persistência do QueryClient
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: Infinity, // ou defina um tempo máximo, se preferir
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);
