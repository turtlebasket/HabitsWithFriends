import { supabase, userId } from "./supabase";

export const fetchOwnActivity = async () => {
  const { data } = await supabase
  .from('activity')
  .select(`
    id,
    action_type,
    from,
    to
  `)
  .eq('from', userId());
  return data;
}

// wanna do friend activity next.