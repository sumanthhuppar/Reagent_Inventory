from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('reagents.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS reagents
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    quantity FLOAT,
                    quantity_measure TEXT,
                    source TEXT,
                    expiry DATE)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/reagents', methods=['GET', 'POST'])
def reagents():
    conn = get_db_connection()
    if request.method == 'POST':
        data = request.json
        conn.execute('INSERT INTO reagents (name, quantity, quantity_measure, source, expiry) VALUES (?, ?, ?, ?, ?)',
                     (data['name'], data['quantity'], data['quantity_measure'], data['source'], data['expiry']))
        conn.commit()
        return jsonify({"message": "Reagent added successfully"}), 201
    
    reagents = conn.execute('SELECT * FROM reagents').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in reagents])

@app.route('/reagents/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def reagent(id):
    conn = get_db_connection()
    
    if request.method == 'PUT':
        data = request.json
        conn.execute('UPDATE reagents SET name=?, quantity=?, quantity_measure=?, source=?, expiry=? WHERE id=?',
                     (data['name'], data['quantity'], data['quantity_measure'], data['source'], data['expiry'], id))
        conn.commit()
        return jsonify({"message": "Reagent updated successfully"})
    
    elif request.method == 'DELETE':
        conn.execute('DELETE FROM reagents WHERE id=?', (id,))
        conn.commit()
        return jsonify({"message": "Reagent deleted successfully"})
    
    # Fetch reagent details
    reagent = conn.execute('SELECT * FROM reagents WHERE id=?', (id,)).fetchone()
    conn.close()
    
    if not reagent:
        return jsonify({"error": "Reagent not found"}), 404
    
    return jsonify(dict(reagent))


@app.route('/reagents/expiring-soon', methods=['GET'])
def expiring_soon():
    conn = get_db_connection()
    two_months_from_now = datetime.now() + timedelta(days=60)
    reagents = conn.execute('''
        SELECT * FROM reagents 
        WHERE expiry <= ? 
        ORDER BY expiry ASC
    ''', (two_months_from_now.strftime('%Y-%m-%d'),)).fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in reagents])

@app.route('/api/search', methods=['POST'])
def search_reagents():
    query = request.json.get('query', '')

    # Perform search logic (example: simple substring search)
    results = []
    for reagent in reagents:
        if query.lower() in reagent['name'].lower():
            results.append(reagent)

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)


