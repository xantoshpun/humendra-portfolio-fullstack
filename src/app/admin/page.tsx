import { auth } from "@/auth";
import { SignOutButton } from "./sign-out-button";

export default async function AdminHome() {
  const session = await auth();
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>
      <p>
        Signed in as <strong>{session!.user.email}</strong> ({session!.user.role})
      </p>
      <p>Sections will be added in Plan 2.</p>
      <SignOutButton />
    </div>
  );
}
