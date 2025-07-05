
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create budgets table
CREATE TABLE public.budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category_id, month, year)
);

-- Insert default categories
INSERT INTO public.categories (name, color, icon) VALUES
('Food & Dining', '#EF4444', '🍽️'),
('Transportation', '#3B82F6', '🚗'),
('Shopping', '#8B5CF6', '🛍️'),
('Entertainment', '#F59E0B', '🎬'),
('Bills & Utilities', '#10B981', '💡'),
('Healthcare', '#EC4899', '🏥'),
('Education', '#6366F1', '📚'),
('Travel', '#14B8A6', '✈️'),
('Income', '#22C55E', '💰'),
('Other', '#6B7280', '📝');

-- Enable Row Level Security (commented out since no auth is implemented)
-- ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no auth)
-- CREATE POLICY "Allow all operations on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all operations on transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all operations on budgets" ON public.budgets FOR ALL USING (true) WITH CHECK (true);
