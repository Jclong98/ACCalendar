import calendar
import datetime
import sqlite3
import json

import pandas as pd
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

@app.route('/_get_data')
def get_data():

    fish_df = pd.read_csv("./static/fish.csv", index_col=0)
    bugs_df = pd.read_csv("./static/bugs.csv", index_col=0)

    return jsonify({
        "fish":json.loads(fish_df.to_json(orient="index")),
        "bugs":json.loads(bugs_df.to_json(orient="index")),
    })


@app.route('/')
def index():
    return render_template('index.html')
