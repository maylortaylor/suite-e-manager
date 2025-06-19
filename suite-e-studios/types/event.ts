/** @format */

export interface Event {
  id: string;
  title: string;
  start: string; // ISO date
  end: string; // ISO date
  roleId: string;
  checklistIds: string[];
}
