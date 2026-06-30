import { supabase } from "@/utils/supabase";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditGenrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: genre, error } = await supabase
    .from("genre")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !genre) {
    notFound();
  }

  return <EditForm initialData={genre} />;
}
