from flask import Flask, send_from_directory

app = Flask(__name__)

@app.route("/")
def index():
    return send_from_directory(".","index.html")

@app.route("/<filename>")
def serve(filename):
    return send_from_directory(".",filename)

@app.route("/<path:filename>")
def serve_file(filename):
    return send_from_directory(".",filename)




app.run(host="0.0.0.0", port=2000, debug=True)
