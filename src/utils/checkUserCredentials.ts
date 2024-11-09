import { supabase } from "./supabase/client";

interface UserCredentials {
  id: string | null;
  userType: string | null;
  password: string | null;
}

export async function checkUserCredentials(
  username: string,
  password: string,
  userType: string
): Promise<UserCredentials | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, password, userType, firstName, lastName")
    .eq("username", username)
    .single();

  console.log({ data, error });

  if (error) throw error;

  const userCredentials: UserCredentials = {
    id: data?.id.toString(),
    userType: data?.userType,
    password: data?.password,
  };

  if (data?.password === password) {
    console.log(userCredentials);
    return userCredentials;
  } else {
    throw new Error("Invalid credentials");
  }
}
