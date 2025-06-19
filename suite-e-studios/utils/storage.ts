/** @format */

import AsyncStorage from "@react-native-async-storage/async-storage";
import globalChecklists from "../global.checklists.json";

const SEEDED_FLAG = "hasSeededChecklistData";
const TASKS_KEY = "tasks";
const TASKLISTS_KEY = "taskLists";
const CHECKLISTS_KEY = "checklists";
const COMPLETED_TASKS_KEY = "completedTasks";

export interface ChecklistData {
  tasks: any[];
  taskLists: any[];
  checklists: any[];
  completedTasks?: Set<string>;
}

export async function saveSetting(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // Optionally log error
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export async function saveChecklistCache(
  key: string,
  value: object
): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Optionally log error
  }
}

export async function getChecklistCache<T = unknown>(
  key: string
): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? (JSON.parse(json) as T) : null;
  } catch (e) {
    return null;
  }
}

// Save all checklist data atomically
export async function saveAllChecklistData(data: ChecklistData): Promise<void> {
  try {
    const promises = [
      AsyncStorage.setItem(TASKS_KEY, JSON.stringify(data.tasks)),
      AsyncStorage.setItem(TASKLISTS_KEY, JSON.stringify(data.taskLists)),
      AsyncStorage.setItem(CHECKLISTS_KEY, JSON.stringify(data.checklists)),
    ];

    // Only save completed tasks if they exist
    if (data.completedTasks) {
      promises.push(
        AsyncStorage.setItem(
          COMPLETED_TASKS_KEY,
          JSON.stringify(Array.from(data.completedTasks))
        )
      );
    }

    await Promise.all(promises);
  } catch (e) {
    console.error("Error saving checklist data:", e);
    throw e;
  }
}

// Merge new items into existing array by id
export async function mergeAndSave(
  key: string,
  newItems: any[],
  idField: string = "id"
) {
  const existingRaw = await AsyncStorage.getItem(key);
  let existing: any[] = [];
  if (existingRaw) {
    try {
      existing = JSON.parse(existingRaw);
    } catch {}
  }
  const merged = [...existing];
  for (const item of newItems) {
    const idx = merged.findIndex((x) => x[idField] === item[idField]);
    if (idx === -1) merged.push(item);
    else merged[idx] = { ...merged[idx], ...item };
  }
  await AsyncStorage.setItem(key, JSON.stringify(merged));
}

// Seed AsyncStorage with global.checklists.json if not already seeded
export async function seedChecklistDataIfNeeded() {
  const seeded = await AsyncStorage.getItem(SEEDED_FLAG);
  if (seeded) return;
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(globalChecklists.tasks));
  await AsyncStorage.setItem(
    TASKLISTS_KEY,
    JSON.stringify(globalChecklists.taskLists)
  );
  await AsyncStorage.setItem(
    CHECKLISTS_KEY,
    JSON.stringify(globalChecklists.checklists)
  );
  await AsyncStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify([]));
  await AsyncStorage.setItem(SEEDED_FLAG, "true");
}

// Load all checklist data from storage, falling back to global data if needed
export async function loadAllChecklistData(): Promise<ChecklistData> {
  try {
    // Try to load from storage first
    const tasks = await getChecklistCache<any[]>(TASKS_KEY);
    const taskLists = await getChecklistCache<any[]>(TASKLISTS_KEY);
    const checklists = await getChecklistCache<any[]>(CHECKLISTS_KEY);
    const completedTasksArray =
      (await getChecklistCache<string[]>(COMPLETED_TASKS_KEY)) || [];

    // If any data is missing, seed and return global data
    if (!tasks || !taskLists || !checklists) {
      await seedChecklistDataIfNeeded();
      return {
        tasks: globalChecklists.tasks,
        taskLists: globalChecklists.taskLists,
        checklists: globalChecklists.checklists,
        completedTasks: new Set<string>(),
      };
    }

    // Return stored data
    return {
      tasks,
      taskLists,
      checklists,
      completedTasks: new Set<string>(completedTasksArray),
    };
  } catch (e) {
    // On error, return global data
    return {
      tasks: globalChecklists.tasks,
      taskLists: globalChecklists.taskLists,
      checklists: globalChecklists.checklists,
      completedTasks: new Set<string>(),
    };
  }
}
