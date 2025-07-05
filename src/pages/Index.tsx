
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { MonthlyChart } from '@/components/MonthlyChart';
import { CategoryPieChart } from '@/components/CategoryPieChart';
import { BudgetManager } from '@/components/BudgetManager';
import { BudgetComparisonChart } from '@/components/BudgetComparisonChart';
import { DashboardStats } from '@/components/DashboardStats';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';
import { generateMonthlyData, calculateTotals } from '@/utils/transactionUtils';
import { toast } from 'sonner';

const Index = () => {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { budgets } = useBudgets();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleAddTransaction = async (transactionData) => {
    const result = await addTransaction(transactionData);
    if (result.success) {
      setIsDialogOpen(false);
      toast.success('Transaction added successfully!');
    } else {
      toast.error('Failed to add transaction');
    }
  };

  const handleUpdateTransaction = async (transactionData) => {
    if (!editingTransaction) return;
    
    const result = await updateTransaction(editingTransaction.id, transactionData);
    if (result.success) {
      setEditingTransaction(null);
      setIsDialogOpen(false);
      toast.success('Transaction updated successfully!');
    } else {
      toast.error('Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    const result = await deleteTransaction(id);
    if (result.success) {
      toast.success('Transaction deleted successfully!');
    } else {
      toast.error('Failed to delete transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setEditingTransaction(null);
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  const monthlyData = generateMonthlyData(transactions);
  const { totalIncome, totalExpenses } = calculateTotals(transactions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Personal Finance Tracker
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Take control of your finances with beautiful insights and easy transaction management
          </p>
        </div>

        {/* Stats Overview */}
        <DashboardStats
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          transactionCount={transactions.length}
        />

        {/* Action Button */}
        <div className="flex justify-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="gradient-primary text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => setEditingTransaction(null)}
              >
                Add New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-transparent border-0 shadow-none">
              <TransactionForm
                onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                onCancel={handleCancel}
                transaction={editingTransaction || undefined}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <MonthlyChart data={monthlyData} />
              <CategoryPieChart transactions={transactions} />
            </div>
            <TransactionList
              transactions={transactions.slice(0, 5)}
              onEdit={handleEdit}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionList
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <BudgetManager />
              <BudgetComparisonChart transactions={transactions} budgets={budgets} />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <MonthlyChart data={monthlyData} />
                <CategoryPieChart transactions={transactions} />
              </div>
              <BudgetComparisonChart transactions={transactions} budgets={budgets} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Your financial data is stored securely in Supabase
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
