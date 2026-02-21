import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Project = lazy(() => import("./pages/Project"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Studio = lazy(() => import("./pages/Studio"));
const Settings = lazy(() => import("./pages/Settings"));
const Help = lazy(() => import("./pages/Help"));
const WebsiteDashboard = lazy(() => import("./pages/WebsiteDashboard"));
const PublicWebsite = lazy(() => import("./pages/PublicWebsite"));
const PublicBlogPage = lazy(() => import("./pages/PublicBlogPage"));
const PublicBlogPostPage = lazy(() => import("./pages/PublicBlogPostPage"));
const Leads = lazy(() => import("./pages/Leads"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Platform domains that serve the dashboard/editor app
const PLATFORM_HOSTNAMES = [
  'localhost',
  'lovable.app',
  'lovable.dev',
  'webcontainer.io',
  'lovableproject.com',
];

function isPlatformDomain(hostname: string): boolean {
  return PLATFORM_HOSTNAMES.some(ph => hostname === ph || hostname.endsWith(`.${ph}`));
}

// Check if current hostname is a custom domain (not platform)
const isCustomDomain = !isPlatformDomain(window.location.hostname);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            {isCustomDomain ? (
              // Custom domain: serve public website directly
              <Routes>
                <Route path="*" element={<PublicWebsite />} />
              </Routes>
            ) : (
              // Platform domain: normal app routing
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project/:id"
                  element={
                    <ProtectedRoute>
                      <Project />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project/:id/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project/:id/website"
                  element={
                    <ProtectedRoute>
                      <WebsiteDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project/:id/appointments"
                  element={
                    <ProtectedRoute>
                      <Appointments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/appointments"
                  element={
                    <ProtectedRoute>
                      <Appointments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project/:id/leads"
                  element={
                    <ProtectedRoute>
                      <Leads />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leads"
                  element={
                    <ProtectedRoute>
                      <Leads />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/studio"
                  element={
                    <ProtectedRoute>
                      <Studio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/help"
                  element={
                    <ProtectedRoute>
                      <Help />
                    </ProtectedRoute>
                  }
                />
                {/* Public website route - no auth required */}
                <Route path="/site/:subdomain" element={<PublicWebsite />} />
                <Route path="/site/:subdomain/blog" element={<PublicBlogPage />} />
                <Route path="/site/:subdomain/blog/:slug" element={<PublicBlogPostPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
