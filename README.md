# 💰 Personal Finance Visualizer

A modern web app to track personal expenses, visualize spending patterns, and stay within budget. Built using **Next.js**, **React**, **shadcn/ui**, **Recharts**, and **Supabase (PostgreSQL)**.

---

## 🚀 Features

### ✅ Stage 1: Basic Transaction Tracking
- Add, edit, delete transactions (amount, date, description)

- 
- Transaction list view
- Monthly expenses bar chart
- Basic form validation with error states

### ✅ Stage 2: Categories
- All Stage 1 features +
- Predefined categories (Food, Travel, Rent, etc.)
- Pie chart showing category breakdown
- Dashboard summary:
  - Total expenses
  - Category-wise expense
  - Most recent transactions

### ✅ Stage 3: Budgeting
- Set monthly budgets per category
- Budget vs actual comparison chart
- Simple spending insights based on your behavior

---

## 🧱 Tech Stack

| Tech            | Description                                |
|-----------------|--------------------------------------------|
| **Next.js**     | React framework for full-stack development |
| **React**       | Component-based UI                         |
| **shadcn/ui**   | Elegant UI component library               |
| **Recharts**    | Charting library                           |
| **Supabase**    | Backend-as-a-Service with PostgreSQL       |

---

## 📦 Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/personal-finance-visualizer.git
cd personal-finance-visualizer


Install dependencies

bash
Copy
Edit
npm install


Set up environment variables

bash
Copy
Edit
touch .env.local


Run the development server

bash
Copy
Edit
npm run dev
Open http://localhost:3000 to view the app in your browser.

📁 Project Structure
pgsql
Copy
Edit
.
├── components/
│   └── forms, charts, cards
├── lib/
│   └── supabaseClient.ts
├── pages/
│   └── index.tsx, dashboard.tsx, api/
├── utils/
├── public/
├── styles/
└── types/
