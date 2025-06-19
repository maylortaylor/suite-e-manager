/** @format */

import type { Task } from "./task";
import type { TaskList } from "./task-list";

export interface Checklist {
  id: string;
  name: string;
  taskIds: string[];
  taskListIds: string[];
  isGlobal?: boolean;
  tasks?: Task[]; // Optional field for expanded task data
  taskLists?: TaskList[]; // Optional field for expanded task list data
}
