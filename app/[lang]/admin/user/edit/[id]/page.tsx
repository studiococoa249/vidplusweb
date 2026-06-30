import { supabase } from "@/utils/supabase";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !user) {
    notFound();
  }

  return <EditForm initialData={user} />;
}
