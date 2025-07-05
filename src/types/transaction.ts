
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category_id?: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Budget {
  id: string;
  category_id: string;
  amount: number;
  month: number;
  year: number;
  category?: Category;
}

export interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
  icon?: string;
}

export interface BudgetComparison {
  category: string;
  budgeted: number;
  actual: number;
  color: string;
}
