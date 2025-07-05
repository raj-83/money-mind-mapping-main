
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/transactionUtils';

interface DashboardStatsProps {
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
}

export const DashboardStats = ({ totalIncome, totalExpenses, transactionCount }: DashboardStatsProps) => {
  const netWorth = totalIncome - totalExpenses;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="gradient-card border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <ArrowUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(totalExpenses)}
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          <DollarSign className={`h-4 w-4 ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netWorth)}
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <div className="h-4 w-4 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs text-primary-foreground font-bold">
              {transactionCount > 99 ? '99+' : transactionCount}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {transactionCount}
          </div>
          <p className="text-xs text-muted-foreground">
            Total entries
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
