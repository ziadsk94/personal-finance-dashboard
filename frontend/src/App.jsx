import "./App.css";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import ChartCard from "./components/ChartCard";

function App() {
  return (
    <div className="container">
      <header>
        <h1>Personal Finance Dashboard</h1>
      </header>
      <main>
        <section>
          <h2>Add Transaction</h2>
          <TransactionForm />
        </section>
        <section>
          <h2>Transactions</h2>
          <TransactionList />
        </section>
        <section>
          <h2>Insights</h2>
          <ChartCard />
        </section>
      </main>
    </div>
  );
}

export default App;
