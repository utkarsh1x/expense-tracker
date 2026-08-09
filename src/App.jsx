
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Load from localStorage
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
    type: "expense",
  });

  // Search & Filter
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(
  localStorage.getItem("theme") || "dark"
);
  const [filterCategory, setFilterCategory] = useState("All");

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {

  document.body.className = theme;

  localStorage.setItem("theme", theme);

}, [theme]);

  // Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.amount ||
      !formData.category ||
      !formData.date ||
      !formData.description
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editingId !== null) {
      setTransactions(
        transactions.map((t) =>
          t.id === editingId
            ? {
                ...t,
                ...formData,
                amount: Number(formData.amount),
              }
            : t
        )
      );

      setEditingId(null);
    } else {
      const newTransaction = {
        id: Date.now(),
        ...formData,
        amount: Number(formData.amount),
      };

      setTransactions((prev) => [...prev, newTransaction]);
    }

    setFormData({
      amount: "",
      category: "",
      date: "",
      description: "",
      type: "expense",
    });
  };

  // Edit
  const handleEdit = (transaction) => {
    setFormData({
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      description: transaction.description,
      type: transaction.type,
    });

    setEditingId(transaction.id);
  };

  // Delete
  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      setTransactions(
        transactions.filter((t) => t.id !== id)
      );
    }
  };

  const exportToCSV = () => {

  if (transactions.length === 0) {
    alert("No transactions to export!");
    return;
  }

  const headers = [
    "Type",
    "Amount",
    "Category",
    "Date",
    "Description"
  ];

  const rows = transactions.map((transaction) => [
    transaction.type,
    transaction.amount,
    transaction.category,
    transaction.date,
    transaction.description
  ]);

  const csvContent = [
    headers,
    ...rows
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "transactions.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

};

  // Summary
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  // Search + Filter
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === "All" ||
      transaction.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app">

      <header className="header">

  <div className="header-top">

    <div>
      <h1>Expense Tracker</h1>
      <p>Track your income & expenses</p>
    </div>

    <button
      className="theme-btn"
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>

  </div>

</header>

      {/* SUMMARY */}

      <section className="summary">

        <div className="summary-card balance-card">
          <h3>Total Balance</h3>
          <h2>₹{totalBalance}</h2>
        </div>

        <div className="summary-card income-card">
          <h3>Total Income</h3>
          <h2>₹{totalIncome}</h2>
        </div>

        <div className="summary-card expense-card">
          <h3>Total Expense</h3>
          <h2>₹{totalExpense}</h2>
        </div>

      </section>

      <main className="container">

        {/* FORM */}

        <section className="form-section">

          <h2>
            {editingId !== null
              ? "Edit Transaction"
              : "Add Transaction"}
          </h2>

          <form onSubmit={handleSubmit}>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Education</option>
              <option>Salary</option>
              <option>Other</option>
            </select>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />

            <button type="submit">
              {editingId !== null
                ? "Update Transaction"
                : "Add Transaction"}
            </button>

          </form>

        </section>

                {/* TRANSACTIONS */}

        <section className="transactions-section">

          <h2>Transactions</h2>

          {/* Search + Filter */}

          <div className="filters">

            <input
              type="text"
              placeholder="🔍 Search description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value)
              }
            >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Education">Education</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>

          </div>

          <button
  type="button"
  className="export-btn"
  onClick={exportToCSV}
>
  📥 Export CSV
</button>

          {filteredTransactions.length === 0 ? (

            <p>No Transactions Found.</p>

          ) : (

            <div className="transaction-list">

              {filteredTransactions.map((transaction) => (

                <div
                  className="transaction-card"
                  key={transaction.id}
                >

                  <div className="transaction-left">

                    <h3>{transaction.description}</h3>

                    <p>
                      {transaction.category} | {transaction.date}
                    </p>

                    <span
                      className={
                        transaction.type === "income"
                          ? "income-text"
                          : "expense-text"
                      }
                    >
                      {transaction.type === "income"
                        ? "Income"
                        : "Expense"}
                    </span>

                  </div>

                  <div className="transaction-right">

                    <strong>
                      ₹{transaction.amount}
                    </strong>

                    <div className="transaction-actions">

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(transaction)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(transaction.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default App;