import { getISO8601, yyyymmdd } from "../util/dateUtil";
import { supabase, userId } from "./supabase";

export const fetchHabits = async () => {
  const { data } = await supabase
  .from('habits')
  .select(`
    id,
    title,
    description,
    public
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
    public
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

export const fetchOwnHabitHistory7 = async () => {
  const {data, error} = await supabase
  .from('activity_habits')
  .select('habit_id, timestamp')
  .match({user_id: userId()})
  if (error) console.log(error.message);
  return data;
}

export const fetchOwnHabitHistory7One = async (id: string) => {
  const {data, error} = await supabase
  .from('activity_habits')
  .select('habit_id, timestamp')
  .match({user_id: userId(), habit_id: id})
  if (error) console.log(error.message);
  return data;
}

export const fetchAllHabitHistory = async () => {
  const {data, error} = await supabase
  .from('activity_habits')
  .select('timestamp') // FIX LATER - ALL HABIT ACTIVITY GETTER (IF USERID IN FRIENDS)
}

export const habitHistoryAdd = async (id: string) => {
  const {data, error} = await supabase
  .from('activity_habits')
  .insert({
    habit_id: id,
    user_id: userId(),
    timestamp: new Date().toISOString()
  })
  // .rpc('habit_history_add_simple', {habit_id: id})
  if (error) console.log(error.message)
}

export const habitHistoryRemove = async (id: string) => {
  const todayTD = new Date()
  const today = new Date(todayTD.setUTCDate(todayTD.getUTCDate())).toISOString()
  const tomorrow = new Date(todayTD.setUTCDate(todayTD.getUTCDate()+1)).toISOString()
  const { data, error } = await supabase
  .rpc('habit_history_remove', {h_id: id});
  // .from('activity_habits')
  // .delete()
  // .eq('habit_id', id)
  // .rangeGte('timestamp', today)
  // .rangeLt('timestamp', tomorrow)
  if (error) console.log(error.message)
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
const last7DaysRange = () => {
  const today = new Date(); // reference
  let tomorrow = new Date(today.setUTCDate(today.getUTCDate()+1)); // upper cutoff timestamp
  let fiveDaysAgo = new Date(today.setUTCDate(today.getUTCDate()-7)); // lower cutoff timestamp
  tomorrow.setUTCHours(0); tomorrow.setUTCMinutes(0); tomorrow.setUTCSeconds(0); tomorrow.setUTCMilliseconds(0);
  fiveDaysAgo.setUTCHours(0); fiveDaysAgo.setUTCMinutes(0); fiveDaysAgo.setUTCSeconds(0); fiveDaysAgo.setUTCMilliseconds(0);
  console.log([fiveDaysAgo, tomorrow]);
  return [fiveDaysAgo, tomorrow]
}