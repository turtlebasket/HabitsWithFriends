import { supabase, userId } from "./supabase"

const fetchFriendsPaginate = async (friend_ids: string[]) => {
  const { data, error } = await supabase
  .from('friends')
}