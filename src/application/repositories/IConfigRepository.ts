export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface Level {
  value: string;
  label: string;
  icon: string;
  desc?: string;
  color?: string; // e.g. 'text-success'
  bg?: string; // e.g. 'bg-success/10'
}

export interface IConfigRepository {
  getCategories(): Promise<Category[]>;
  getLevels(): Promise<Level[]>;
}
