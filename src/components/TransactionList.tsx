
import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/utils/transactionUtils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, onEdit, onDelete }: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <Card className="gradient-card border-0 shadow-md">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground text-lg">No transactions yet</p>
          <p className="text-sm text-muted-foreground mt-2">Add your first transaction to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Recent Transactions
          <span className="text-sm font-normal text-muted-foreground">
            ({transactions.length} total)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-background/50 hover:bg-background/80 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">
                      {transaction.description}
                    </p>
                    {transaction.category && (
                      <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted">
                        {transaction.category.icon && <span>{transaction.category.icon}</span>}
                        <span>{transaction.category.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`font-semibold text-lg ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(Math.abs(transaction.amount))}
                </span>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(transaction)}
                    className="hover:bg-primary/10"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(transaction.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};
