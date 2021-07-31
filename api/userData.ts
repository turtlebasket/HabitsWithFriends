import { supabase, userId } from "./supabase"

export const fetchUserData = async () => {
  const {data, error} = await supabase.from('user_data')
  .select(`
    id,
    full_name,
    dob,
    description
  `)
  .match({id: userId()})
  // if (error) { console.log(error.message); return {}; }
  if (data == null) return null
  else return data[0];
}

export const setUserData = async (newData: any) => {
  newData.id = userId();
  const { data, error } = await supabase.from('user_data')
  .upsert(newData)
}
