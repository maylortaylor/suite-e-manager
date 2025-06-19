/** @format */

export type TaskCategory = "pre-event" | "during-event" | "post-event";
export type TaskRole =
  | "sound-engineer"
  | "event-producer"
  | "door-person"
  | "bar-person";

export interface Task {
  id: string;
  description: string;
  isComplete: boolean;
  category: TaskCategory;
  role: TaskRole;
}
