import { getISO8601, yyyymmdd, yyyymmddUTC } from "../util/dateUtil";
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

export const fetchOwnHabitHistory7All = async () => {
  const {data, error} = await supabase
  .from('activity_habits')
  .select('habit_id, timestamp')
  .match({user_id: userId()})
  .order('timestamp', {ascending: false})
  // .limit(7) // FIGURE OUT A BETTERY WAY LATER, (IF NECESSARY)
  if (error) console.log(error.message);
  return data;
}

// habithistory7 for ONE habit only
export const fetchOwnHabitHistory7 = async (id: string) => { 
  const {data, error} = await supabase
  .from('activity_habits')
  .select('habit_id, timestamp')
  .match({user_id: userId(), habit_id: id})
  .order('timestamp', {ascending: false})
  .limit(7)
  if (error) console.log(error.message);
  return data;
}

export const fetchOwnHabitHistoryPaginate = async () => {
  const {data, error} = await supabase
  .from('activity_habits')
  .select('user_id, habit_id, timestamp', {count: 'planned'})
  .match({user_id: userId()})
  .order('timestamp', {ascending: false})
  .limit(5)
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
    date: yyyymmdd()
  })
  // .rpc('habit_history_add_simple', {habit_id: id})
  if (error) console.log(error.message)
}

export const habitHistoryRemove = async (id: string) => {
  const todayRef = new Date();
  const tzOffset = todayRef.getTimezoneOffset();
  let todayTemp = new Date();
  todayTemp.setUTCDate(todayRef.getDate()) // important part: set UTC date in timestamp to our local date
  todayTemp.setUTCHours(tzOffset/60, 0, 0, 0);
  const today = todayTemp.toISOString()

  let tomorrowTemp = new Date();
  tomorrowTemp.setUTCDate(todayRef.getDate())
  tomorrowTemp.setUTCHours(tzOffset/60+24, 0, 0, 0);
  const tomorrow = tomorrowTemp.toISOString()

  // const today = new Date(new Date().setUTCHours(tzOffset/60, 0, 0, 0)).toISOString();
  // const tomorrow = new Date(new Date().setUTCHours(tzOffset/60+24, 0, 0, 0)).toISOString();
  console.log(`today:\t${today}`)
  console.log(`tomorrow:\t${tomorrow}`)
  const { data, error } = await supabase
  .from('activity_habits')
  .delete()
  .eq('habit_id', id)
  .gte('timestamp', today)
  .lte('timestamp', tomorrow)
  if (error) console.log(error.message)

  // No longer necessary

  // const dayMS = 86400000;
  // const today = new Date(yyyymmddUTC(new Date(todayTD.setUTCDate(new Date(Number(todayTD)).getUTCDate())))).toISOString()
  // const tomorrow = new Date(yyyymmddUTC(new Date(todayTD.setUTCDate(new Date(Number(todayTD)+dayMS).getUTCDate())))).toISOString()

  // .rpc('habit_history_remove', {h_id: id});
}

export const removeHabit = async (id: string) => {
  await supabase
  .from('activity_habits')
  .delete()
  .match({habit_id: id})
  const { error } = await supabase
  .from('habits')
  .delete()
  .match({id: id})
  if (error) console.log(error.message);
}