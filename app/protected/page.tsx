import { redirect } from "next/navigation";

export default function ProtectedPage() {
  // Redirect to the management dashboard
  redirect("/protected/manage");
}
