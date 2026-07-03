import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ProtegeRota from "@/components/ProtegeRota";

export default function SistemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtegeRota>
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <div className="flex-1">
          <Header />

          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtegeRota>
  );
}