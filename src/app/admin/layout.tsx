import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h1>Not authorized</h1>
        <p>Your account is signed in but not an admin of this site.</p>
      </div>
    );
  }
  return <>{children}</>;
}
