import { supabase } from "@/utils/supabase";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditShortVideoPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { id } = await params;

  const { data: drama, error } = await supabase
    .from("short_drama")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !drama) {
    notFound();
  }

  const { data: genres } = await supabase.from("genre").select("*").order("name");

  return <EditForm initialData={drama} genres={genres || []} />;
}
