import { Category } from "./category";


export interface Day {
   // dayNumber: number;
  //categories: Category[];
  dayId: number;
  date:Date;
  //categories:Category[];
  categories: (Category & { amounts: number[] })[];
}
