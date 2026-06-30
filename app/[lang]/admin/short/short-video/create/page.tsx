import { supabase } from "@/utils/supabase";
import CreateForm from "./CreateForm";

export default async function CreateShortVideoPage() {
  const { data: genres } = await supabase.from("genre").select("*").order("name");
  return <CreateForm genres={genres || []} />;
}
