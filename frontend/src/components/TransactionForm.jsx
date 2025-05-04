import { useState } from "react";
import axios from "axios";

function TransactionForm({ onTransactionAdded }) {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.post("http://localhost:5000/transactions", {
        userId: "testUser", // TODO: Replace with authenticated user ID
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
      });
      setSuccess("Transaction added successfully!");
      setFormData({ amount: "", category: "", date: "" });
      if (onTransactionAdded) onTransactionAdded();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          name="amount"
          id="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          name="date"
          id="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="submit-button">
        Add Transaction
      </button>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </form>
  );
}

export default TransactionForm;
