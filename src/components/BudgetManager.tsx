
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useBudgets } from '@/hooks/useBudgets';
import { formatCurrency } from '@/utils/transactionUtils';
import { toast } from 'sonner';

export const BudgetManager = () => {
  const { categories } = useCategories();
  const { budgets, setBudget } = useBudgets();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category_id || !formData.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await setBudget(
      formData.category_id,
      parseFloat(formData.amount),
      formData.month,
      formData.year
    );

    if (result.success) {
      toast.success('Budget set successfully!');
      setIsDialogOpen(false);
      setFormData({
        category_id: '',
        amount: '',
        month: currentMonth,
        year: currentYear,
      });
    } else {
      toast.error('Failed to set budget');
    }
  };

  const expenseCategories = categories.filter(cat => cat.name !== 'Income');
  const currentBudgets = budgets.filter(b => b.month === currentMonth && b.year === currentYear);

  return (
    <Card className="gradient-card border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Monthly Budgets</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Set Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Monthly Budget</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          {category.icon && <span>{category.icon}</span>}
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Select value={formData.month.toString()} onValueChange={(value) => setFormData({ ...formData, month: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {new Date(2024, i).toLocaleDateString('en-US', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={formData.year.toString()} onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Budget Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1 gradient-primary">
                  Set Budget
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {currentBudgets.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No budgets set for this month
          </p>
        ) : (
          <div className="space-y-3">
            {currentBudgets.map((budget) => (
              <div
                key={budget.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-background/50"
              >
                <div className="flex items-center gap-3">
                  {budget.category?.icon && (
                    <span className="text-lg">{budget.category.icon}</span>
                  )}
                  <span className="font-medium">{budget.category?.name}</span>
                </div>
                <span className="font-semibold text-lg">
                  {formatCurrency(budget.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
