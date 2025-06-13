from urllib import request
from flask import Flask, render_template, request, url_for, session, redirect, jsonify
import re, math, ast, operator, os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-key")

''' ================================MATH================================'''

# Supported operators
operators = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.Mod: operator.mod,
    ast.USub: operator.neg,
}

# Supported functions
allowed_functions = {
    'sqrt': math.sqrt,
}

def safe_eval(node):
    """Recursively evaluate an AST node safely."""
    if isinstance(node, ast.Expression):
        return safe_eval(node.body)
    elif isinstance(node, ast.BinOp):
        left = safe_eval(node.left)
        right = safe_eval(node.right)
        op_type = type(node.op)
        if op_type in operators:
            return operators[op_type](left, right)
        else:
            raise ValueError(f"Unsupported binary operator: {op_type}")
    elif isinstance(node, ast.UnaryOp):
        operand = safe_eval(node.operand)
        op_type = type(node.op)
        if op_type in operators:
            return operators[op_type](operand)
        else:
            raise ValueError(f"Unsupported unary operator: {op_type}")
    elif isinstance(node, ast.Call):
        if isinstance(node.func, ast.Name):
            func_name = node.func.id
            if func_name in allowed_functions:
                args = [safe_eval(arg) for arg in node.args]
                return allowed_functions[func_name](*args)
            else:
                raise ValueError(f"Unsupported function: {func_name}")
        else:
            raise ValueError("Invalid function call")
    elif isinstance(node, ast.Constant):  # Python >= 3.8
        if isinstance(node.value, (int, float)):
            return node.value
        else:
            raise ValueError("Only numeric constants are allowed")
    else:
        raise ValueError(f"Unsupported expression type: {type(node)}")

def parse_math_expression(expr: str):
    """Parses and evaluates a math expression safely."""
    try:
        node = ast.parse(expr, mode='eval')
        return safe_eval(node)
    except Exception as e:
        return f"Error: {str(e)}"
    
'''==================================================================================================================='''

@app.route("/", methods=['GET', 'POST'])
def index():
    result = None
    if 'total' not in session:
        session['total'] = 0

    if request.method == "POST":
        total = session.get('total', 0)

        try:
            inp = request.form['input'].strip()
            result = parse_math_expression(inp)
            session['total'] = result
            session.modified = True

        except ValueError as e:
            result = str(e)

    return render_template('index.html', result=result)

@app.route("/api/submit", methods=['POST'])
def api_submit():
    data = request.get_json()

    if not data or 'input' not in data:
        return jsonify({'error': 'Missing input'}), 400
    
    user_input = data['input']
    result = parse_math_expression(user_input)

    return jsonify({'result': result})
    
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
