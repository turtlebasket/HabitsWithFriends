import { getISO8601 } from "../util/dateUtil";
import { supabase, userId } from "./supabase";

export const fetchHabits = async () => {
  const { data } = await supabase
  .from('habits')
  .select(`
    id,
    title,
    description,
    public,
    history7:history[0:6]
  `)
  .eq('user_id', userId());
  return data;
}

export const fetchHabit = async (id: string) => {
  const { data } = await supabase
  .from('habits')
  .select(`
    id,
    title, 
    description, 
    public,
    history7:history[0:6]
  `).eq('id', id);
  // @ts-ignore
  return data[0];
}

export const setHabits = async (newData: object) => {
  const { data } = await supabase
  .from('habits')
  .update(newData)
  .match({user_id: userId() ?? ""})
}

export const setHabit = async (newData: any) => {
  newData.user_id = userId();
  console.log(newData);
  const { data, error } = await supabase
  .from('habits')
  .upsert(newData)
  if (error) console.log(error);
}

export const habitHistoryAdd = async (id: string) => {
  const {data, error} = await supabase
  .rpc('habit_history_add_simple', {habit_id: id})
  if (error) console.log(error.message)
}

export const habitHistoryRemove = async (id: string) => {
  await supabase
  .rpc('habit_history_remove', {habit_id: id})
}

export const removeHabit = async (id: string) => {
  const { error } = await supabase
  .from('habits')
  .delete()
  .match({id: id})
  if (error) console.log(error.message);
}

// Helper Functions

/**
 * Timestamp range for last 5 days
 * @returns Timestamps for five days ago and tomorrow
 */
const last5DaysRange = async () => {
  const today = new Date(); // reference
  let tomorrow = new Date(today.setUTCDate(today.getUTCDate()+1)); // upper cutoff timestamp
  let fiveDaysAgo = new Date(today.setUTCDate(today.getUTCDate()-5)); // lower cutoff timestamp
  tomorrow.setUTCHours(0); tomorrow.setUTCMinutes(0); tomorrow.setUTCSeconds(0); tomorrow.setUTCMilliseconds(0);
  fiveDaysAgo.setUTCHours(0); fiveDaysAgo.setUTCMinutes(0); fiveDaysAgo.setUTCSeconds(0); fiveDaysAgo.setUTCMilliseconds(0);
  console.log([fiveDaysAgo, tomorrow]);
  return [fiveDaysAgo, tomorrow]
}