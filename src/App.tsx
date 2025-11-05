import {
  ErrorComponent,
  RouterProvider,
  createRouter,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { NotFoundPage } from "@/components/not-found";
import { LoadingScreen } from "@/components/LoadingScreen";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const NotFoundScreen = () => {
  return <NotFoundPage />;
};

const router = createRouter({
  routeTree,
  defaultPendingComponent: LoadingScreen,
  defaultPendingMinMs: 3000,
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    auth: undefined!,
    queryClient,
  },
  defaultNotFoundComponent: NotFoundScreen,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: "#fff",
              color: "#333",
              border: "1px solid #e2e8f0",
              padding: "16px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            },
            success: {
              icon: "🎉",
              style: {
                background: "#F0FDF4",
                color: "#4CAF50",
                border: "none",
              },
            },
            error: {
              icon: "❌",
              style: {
                background: "#fff",
                color: "#ef4444",
                border: "1px solid #fecaca",
              },
            },
          }}
        />
      </QueryClientProvider>
    </>
  );
}

export default App;
