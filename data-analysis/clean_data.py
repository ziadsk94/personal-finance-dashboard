import pandas as pd
import sqlite3

def clean_transactions(db_path):
    conn = sqlite3.connect(db_path)
    df = pd.read_sql_query("SELECT * FROM transactions", conn)
    
    # Basic cleaning
    df['amount'] = df['amount'].astype(float)
    df['date'] = pd.to_datetime(df['date'])
    df = df.dropna(subset=['amount', 'category'])
    
    # Save cleaned data
    df.to_csv('cleaned_transactions.csv', index=False)
    conn.close()
    print("Data cleaned and saved to cleaned_transactions.csv")

if __name__ == "__main__":
    clean_transactions('../backend/transactions.db')