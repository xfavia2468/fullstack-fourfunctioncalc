from urllib import request
from flask import Flask, render_template, request, url_for, session, redirect
import re

app = Flask(__name__)
app.secret_key = 'SUPER_SECRET_KEY'

def process_input(inp):
    if inp == "c":
        return 0 # Immediately clear

    num, total, operation = None, None, None
    pattern = r"^(([+-]?(\d+(\.\d*)?|\.\d+))?([asdmc])([+-]?(\d+(\.\d*)?|\.\d+)))|c$"
    if not re.fullmatch(pattern, inp):
        raise ValueError("Invalid input format")
    match = re.search(pattern, inp)
    if match:
        operation = match.group(5)
        num = float(match.group(6))
        if match.group(2) is None:
            total = float(session.get('total', 0))
        else:
            total = float(match.group(2))

    if operation == "m":
        return total * num
    if operation == "d":
        if num == 0.0:
            raise ValueError("Divide by 0")
        return total / num
    if operation == "a":
        return total + num
    if operation == "s":
        return total - num

    raise ValueError("Invalid input") # If somehow reaches the end

@app.route("/", methods=['GET', 'POST'])
def index():
    result = None
    if 'total' not in session:
        session['total'] = 0

    if request.method == "POST":
        total = session.get('total', 0)

        try:
            inp = request.form['input'].strip()
            result = process_input(inp)
            session['total'] = result
            session.modified = True

        except ValueError as e:
            result = str(e)

    return render_template('index.html', result=result)

if __name__ == "__main__":
    app.run(debug=True)
