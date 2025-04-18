import { Sidebar } from "@/components/sidebar";
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 flex-shrink-0 h-full overflow-y-auto border-r">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center px-4">
            <MainNav />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

