import { useState, useEffect } from "react";
import axios from "axios";

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/transactions/testUser"
      );
      setTransactions(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="transaction-list">
      {error && <div className="error-message">{error}</div>}
      {transactions.length === 0 && !error ? (
        <p>No transactions found.</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>{transaction.category}</td>
                <td>{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransactionList;
