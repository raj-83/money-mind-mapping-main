
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, CategoryData } from '@/types/transaction';
import { formatCurrency } from '@/utils/transactionUtils';

interface CategoryPieChartProps {
  transactions: Transaction[];
}

export const CategoryPieChart = ({ transactions }: CategoryPieChartProps) => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const categoryData: CategoryData[] = expenseTransactions.reduce((acc, transaction) => {
    const categoryName = transaction.category?.name || 'Other';
    const categoryColor = transaction.category?.color || '#6B7280';
    const categoryIcon = transaction.category?.icon;
    
    const existingCategory = acc.find(item => item.name === categoryName);
    if (existingCategory) {
      existingCategory.value += Math.abs(transaction.amount);
    } else {
      acc.push({
        name: categoryName,
        value: Math.abs(transaction.amount),
        color: categoryColor,
        icon: categoryIcon
      });
    }
    return acc;
  }, [] as CategoryData[]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            {data.icon && <span>{data.icon}</span>}
            <p className="font-medium">{data.name}</p>
          </div>
          <p className="text-sm">
            Amount: {formatCurrency(data.value)}
          </p>
          <p className="text-sm">
            Percentage: {((data.value / expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <div className="flex items-center gap-1">
              {entry.payload.icon && <span className="text-xs">{entry.payload.icon}</span>}
              <span>{entry.value}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (categoryData.length === 0) {
    return (
      <Card className="gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card border-0 shadow-md">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
