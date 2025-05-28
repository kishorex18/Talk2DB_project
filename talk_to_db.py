from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import requests

app = Flask(__name__)
CORS(app)

# Call to local LLM
def ask_llm(prompt):
    response = requests.post("http://localhost:11434/api/generate", json={
        "model": "mistral",
        "prompt": prompt,
        "stream": False
    })
    return response.json()["response"].strip()

# Get table & column summary
def get_db_summary(config):
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()

    summary = {}
    for (table,) in tables:
        cursor.execute(f"SHOW COLUMNS FROM `{table}`")
        columns = cursor.fetchall()
        summary[table] = [col[0] for col in columns]

    cursor.close()
    conn.close()
    return summary

# Converts NL to SQL, runs, and returns result
def query_database(config, nl_query):
    try:
        prompt = f"""You are an expert MySQL translator.
        Only respond with the SQL query and nothing else.
        Do not explain anything. No markdown. No backticks.
        Convert this natural language query into a valid MySQL query: "{nl_query}"
        """

        sql_query = ask_llm(prompt)
        sql_query = sql_query.strip().split('\n')[0].strip('` ')

        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        cursor.execute(sql_query)

        if cursor.description:
            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()
            result = [dict(zip(columns, row)) for row in rows]
        else:
            conn.commit()
            result = {"message": "Query executed successfully."}

        cursor.close()
        conn.close()

        return {"sql": sql_query, "result": result}

    except Exception as e:
        return {"error": str(e)}

@app.route('/connect', methods=['POST'])
def connect_db():
    data = request.json
    config = {
        'host': 'localhost',
        'user': data.get('username'),
        'password': data.get('password'),
        'database': data.get('database'),
        'port': 3306
    }
    try:
        summary = get_db_summary(config)
        return jsonify(summary)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/query', methods=['POST'])
def handle_query():
    data = request.json
    config = {
        'host': 'localhost',
        'user': data.get('username'),
        'password': data.get('password'),
        'database': data.get('database'),
        'port': 3306
    }
    nl_query = data.get('query')
    return jsonify(query_database(config, nl_query))

if __name__ == '__main__':
    app.run(port=5000, debug=True)
