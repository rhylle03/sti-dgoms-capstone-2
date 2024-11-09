import { supabase } from "./supabase/client";

export async function checkUserPrivelages(
  username: string,
  adminType: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, adminType")
    .eq("username", username)
    .single();

  if (error) throw error;

  if (data?.adminType === adminType) {
    return data.id.toString();
  } else {
    throw new Error("Invalid credentials");
  }
}
