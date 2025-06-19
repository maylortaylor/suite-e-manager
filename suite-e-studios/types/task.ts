/** @format */

export interface Task {
  id: string;
  description: string;
  isComplete: boolean;
  category: "pre-event" | "during-event" | "post-event";
}
