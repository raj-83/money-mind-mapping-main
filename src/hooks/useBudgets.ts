
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Budget } from '@/types/transaction';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          category:categories(*)
        `)
        .order('month');

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const setBudget = async (categoryId: string, amount: number, month: number, year: number) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .upsert([{
          category_id: categoryId,
          amount,
          month,
          year
        }])
        .select(`
          *,
          category:categories(*)
        `);

      if (error) throw error;
      fetchBudgets(); // Refresh the list
      return { success: true };
    } catch (error) {
      console.error('Error setting budget:', error);
      return { success: false, error };
    }
  };

  return {
    budgets,
    loading,
    setBudget,
    refetch: fetchBudgets
  };
};
