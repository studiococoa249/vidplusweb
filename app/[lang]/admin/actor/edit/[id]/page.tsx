import { supabase } from "@/utils/supabase";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditActorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: actor, error } = await supabase
    .from("actor")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !actor) {
    notFound();
  }

  return <EditForm initialData={actor} />;
}
