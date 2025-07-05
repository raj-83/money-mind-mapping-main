
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, Budget, BudgetComparison } from '@/types/transaction';
import { formatCurrency } from '@/utils/transactionUtils';

interface BudgetComparisonChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const BudgetComparisonChart = ({ transactions, budgets }: BudgetComparisonChartProps) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Filter current month's transactions and budgets
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() + 1 === currentMonth && 
           transactionDate.getFullYear() === currentYear &&
           t.type === 'expense';
  });

  const currentBudgets = budgets.filter(b => b.month === currentMonth && b.year === currentYear);

  // Calculate actual spending by category
  const actualSpending = currentMonthTransactions.reduce((acc, transaction) => {
    const categoryId = transaction.category_id || 'other';
    acc[categoryId] = (acc[categoryId] || 0) + Math.abs(transaction.amount);
    return acc;
  }, {} as Record<string, number>);

  // Create comparison data
  const comparisonData: BudgetComparison[] = currentBudgets.map(budget => ({
    category: budget.category?.name || 'Unknown',
    budgeted: budget.amount,
    actual: actualSpending[budget.category_id] || 0,
    color: budget.category?.color || '#6B7280'
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const budgeted = payload.find((p: any) => p.dataKey === 'budgeted')?.value || 0;
      const actual = payload.find((p: any) => p.dataKey === 'actual')?.value || 0;
      const difference = budgeted - actual;
      
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium mb-2">{label}</p>
          <p className="text-sm">Budgeted: {formatCurrency(budgeted)}</p>
          <p className="text-sm">Actual: {formatCurrency(actual)}</p>
          <p className={`text-sm font-medium ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {difference >= 0 ? 'Under' : 'Over'} by: {formatCurrency(Math.abs(difference))}
          </p>
        </div>
      );
    }
    return null;
  };

  if (comparisonData.length === 0) {
    return (
      <Card className="gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No budget data available for this month</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card border-0 shadow-md">
      <CardHeader>
        <CardTitle>Budget vs Actual - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="category" 
                className="text-sm"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                className="text-sm"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="budgeted" 
                fill="hsl(var(--primary))" 
                name="Budgeted"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
              <Bar 
                dataKey="actual" 
                fill="hsl(var(--destructive))" 
                name="Actual"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
