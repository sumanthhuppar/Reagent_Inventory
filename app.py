from flask import Flask, json, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime, timedelta
import smtplib
import getpass
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

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
                    packingtype TEXT,
                    quantity FLOAT,
                    quantity_measure TEXT,
                    source TEXT,
                    expiry DATE,
                    setAlert INTEGER,
                    setQuantity INTEGER,
                    last_updated DATE)''')
    conn.commit()
    conn.close()

init_db()





@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    sender_email = "reagentvvce@gmail.com"
    receiver_email = "sumanthh30062002@gmail.com"
    # data.get('to_email')
    password = "fxyornljpwuvjbqm"  # It's recommended to use environment variables or a secure method to store passwords

    # Create the email body
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = "ReAgent REPORT"

    #db data in json format
    db_data = data['dbData']
    reagent_name = None

    for item in db_data:
        if item['name'] == "HCL":
            reagent_name = item['name']
            break  # Exit the loop once HCL is found

    
            # Add the body to the email
            # message.attach(MIMEText(f"Dear Sir/Madam,\n\nPlease find the attached report
            # for the reagent {reagent_name}.\n\nThank you,\nReAgent Team", "plain"))

    # Email body
    # email_body = "Dear Sir/Madam,\n\nPlease find the attached report for the reagent " + reagent_name + "\n\nThank you,\nReAgent Team"

    # email_body = f"""
    #     <html>
    #     <body>
    #         <p>Dear Sir/Madam,</p>
    #         <p>Please find the attached report for the reagent <b style='color:green;'>{reagent_name}</b>.</p>
    #         <p>Thank you,<br>ReAgent Team</p>
    #     </body>
    #     </html>
    #     """


    # Connect to the SQLite database
    conn = sqlite3.connect('D:\\Reagent_Inventory\\reagents.db')
    cursor = conn.cursor()

# Fetch all records from the reagents table
    cursor.execute("SELECT name,quantity,expiry FROM reagents")
    rows = cursor.fetchall()

# Start building the HTML table
    html_table = """
        <table border="1">
        <tr>
        <th>Name</th>
        <th>Quantity</th>
        <th>Expiration Date</th>
        </tr>
        """

# Loop through the rows and add them to the table
    for row in rows:
        html_table += f"""
        <tr>
            <td>{row[0]}</td>
            <td>{row[1]}</td>
            <td>{row[2]}</td>
        </tr>
        """

    # Close the table HTML
    html_table += "</table>"

# Close the database connection
    conn.close()

# Include the table in your email body
    email_body = f"""
<!DOCTYPE html>
<html>
<head>
<style>
    body {{ font-family: Arial, sans-serif; }}
    table {{ border-collapse: collapse; width: 100%; }}
    th, td {{ border: 1px solid #ddd; padding: 8px; }}
    th {{ background-color: #f2f2f2; }}
</style>
</head>
<body>
    <p>Dear Sir/Madam,</p>
    <p>Please find below the report for the reagents:</p>
    {html_table}
    <p>Thank you,<br>ReAgent Team</p>
</body>
</html>
"""


    message.attach(MIMEText(email_body, "html")) # plain for text

    # Specify the file path here
    file_path = "D:\\Reagent_Inventory\\reagents.db"
    attachment = open(file_path, "rb")

    part = MIMEBase('application', 'octet-stream')
    part.set_payload((attachment).read())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', "attachment; filename= " + file_path.split('/')[-1])

    message.attach(part)

    # Sending the email
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, password)
        text = message.as_string()
        server.sendmail(sender_email, receiver_email, text)
        server.quit()
        return jsonify({"message": "Email sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/reagents', methods=['GET', 'POST'])
def reagents():
    conn = get_db_connection()
    if request.method == 'POST':
        data = request.json
        current_date = datetime.now().strftime('%Y-%m-%d')
        conn.execute('INSERT INTO reagents (name,packingtype, quantity, quantity_measure, source, expiry, setAlert,setQuantity, last_updated) VALUES (?,?, ?, ?, ?, ?, ?, ?,?)',
                     (data['name'],data['packingtype'], data['quantity'], data['quantity_measure'], data['source'], data['expiry'], data['setAlert'],data['setQuantity'], current_date))
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
        current_date = datetime.now().strftime('%Y-%m-%d')
        conn.execute('UPDATE reagents SET name=?,packingtype=?, quantity=?, quantity_measure=?, source=?, expiry=?, setAlert=?,setQuantity = ?, last_updated=? WHERE id=?',
                     (data['name'],data['packingtype'], data['quantity'], data['quantity_measure'], data['source'], data['expiry'],data['setAlert'], data['setQuantity'], current_date, id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Reagent updated successfully"})
    
    elif request.method == 'DELETE':
        conn.execute('DELETE FROM reagents WHERE id=?', (id,))
        conn.commit()
        conn.close()
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
    conn = get_db_connection()
    results = []
    for row in conn.execute('SELECT * FROM reagents'):
        if query.lower() in row['name'].lower():
            results.append(dict(row))
    conn.close()

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
