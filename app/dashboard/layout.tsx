import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/modules/dashboard/actions";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";
import Navbar from "@/modules/home/Navbar";


export const metadata = {
  title: "Dashboard - CuraVibe",
  description: "Your AI-powered project playgrounds.",
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-black">
      {/* Floating navbar */}
      <Navbar />

      {/* Flow wrapper */}
      <main className="relative z-0 w-full pt-28">{children}</main>
    </div>
  );
}
