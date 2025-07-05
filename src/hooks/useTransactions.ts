
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/transaction';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(*)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      // Type assertion to ensure proper typing
      setTransactions((data || []) as Transaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select(`
          *,
          category:categories(*)
        `);

      if (error) throw error;
      if (data) {
        // Type assertion to ensure proper typing
        setTransactions(prev => [data[0] as Transaction, ...prev]);
      }
      return { success: true };
    } catch (error) {
      console.error('Error adding transaction:', error);
      return { success: false, error };
    }
  };

  const updateTransaction = async (id: string, transactionData: Omit<Transaction, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(transactionData)
        .eq('id', id)
        .select(`
          *,
          category:categories(*)
        `);

      if (error) throw error;
      if (data) {
        setTransactions(prev => 
          prev.map(t => t.id === id ? data[0] as Transaction : t)
        );
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating transaction:', error);
      return { success: false, error };
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTransactions(prev => prev.filter(t => t.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return { success: false, error };
    }
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
};
