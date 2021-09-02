import { supabase, userId } from "./supabase";
import {v4 as uuidv4} from "uuid";

export const fetchUserData = async () => {
  const {data, error} = await supabase.from('user_data')
  .select(`
    id,
    handle,
    full_name,
    description,
    dob,
    friends
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

// export const uploadNewPfp = async (file) => {
//   const filename = `${uuidv4()}.png`;

//   const {data, error} = await supabase
//   .storage
//   .from('pfps')
//   .upload(filename, file)
//   if (error) console.log(error.message);

// }