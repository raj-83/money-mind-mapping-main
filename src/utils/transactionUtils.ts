
import { Transaction, MonthlyData } from '@/types/transaction';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const generateMonthlyData = (transactions: Transaction[]): MonthlyData[] => {
  const monthlyMap = new Map<string, { expenses: number; income: number }>();
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { expenses: 0, income: 0 });
    }
    
    const monthData = monthlyMap.get(monthKey)!;
    if (transaction.type === 'expense') {
      monthData.expenses += Math.abs(transaction.amount);
    } else {
      monthData.income += transaction.amount;
    }
  });
  
  // Convert to array and sort by date
  return Array.from(monthlyMap.entries())
    .map(([key, data]) => ({
      month: new Date(key + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      ...data,
    }))
    .sort((a, b) => new Date(a.month + ' 1, 2024').getTime() - new Date(b.month + ' 1, 2024').getTime())
    .slice(-6); // Show last 6 months
};

export const calculateTotals = (transactions: Transaction[]) => {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'expense') {
        acc.totalExpenses += Math.abs(transaction.amount);
      } else {
        acc.totalIncome += transaction.amount;
      }
      return acc;
    },
    { totalExpenses: 0, totalIncome: 0 }
  );
};
