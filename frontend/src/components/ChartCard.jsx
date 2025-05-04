import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ChartCard() {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/transactions/testUser"
        );
        const transactions = response.data;

        // Aggregate data by category
        const categories = [...new Set(transactions.map((t) => t.category))];
        const amounts = categories.map((category) =>
          transactions
            .filter((t) => t.category === category)
            .reduce((sum, t) => sum + t.amount, 0)
        );

        setChartData({
          labels: categories,
          datasets: [
            {
              label: "Spending by Category",
              data: amounts,
              backgroundColor: "rgba(37, 99, 235, 0.6)",
              borderColor: "rgba(37, 99, 235, 1)",
              borderWidth: 1,
            },
          ],
        });
        setError("");
      } catch (err) {
        setError("Failed to fetch transactions for chart");
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="chart-card">
      <h3>Spending Overview</h3>
      {error && <div className="error-message">{error}</div>}
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Spending by Category" },
            },
          }}
        />
      ) : (
        !error && <p>Loading chart...</p>
      )}
    </div>
  );
}

export default ChartCard;
