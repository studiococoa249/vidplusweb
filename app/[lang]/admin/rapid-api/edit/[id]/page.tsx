import { supabase } from "@/utils/supabase";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditRapidApiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: api, error } = await supabase
    .from("rapid_api")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !api) {
    notFound();
  }

  return <EditForm initialData={api} />;
}
