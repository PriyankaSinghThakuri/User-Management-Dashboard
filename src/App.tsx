import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppSidebar } from "./components/app-sidebar";
import { ThemeProvider } from "./contexts/ThemeContext";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const UserDetails = lazy(() => import("./pages/UserDetails"));
const Users = lazy(() => import("./pages/Users"));
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                  <div className="p-6">
                    <div className="mb-6">
                      <SidebarTrigger />
                    </div>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/user/:id" element={<UserDetails />} />
                      </Routes>
                    </Suspense>
                  </div>
                </main>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
