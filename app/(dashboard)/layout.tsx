import { getWorkspace } from "@/lib/workspace";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { workspace, user } = await getWorkspace();

  return (
    <div className="flex h-screen">
      <Sidebar workspace={workspace} user={user} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
