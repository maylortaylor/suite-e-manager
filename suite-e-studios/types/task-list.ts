/** @format */

import type { Task } from "./task";

export interface TaskList {
  id: string;
  name: string;
  taskIds: string[];
  tasks?: Task[]; // Optional field for expanded task data
}
