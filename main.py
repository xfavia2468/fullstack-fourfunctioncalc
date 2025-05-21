from urllib import request

from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/", methods=['GET'])
def index():
    if request.method == "GET":
        return render_template('index.html')

    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)
