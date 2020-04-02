import calendar
import datetime
import sqlite3
import json

import pandas as pd
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

@app.route('/_get_months')
def get_months():

    m = request.args['month']

    with sqlite3.connect("db.sqlite") as conn:
        fish_df = pd.read_sql("select * from fish", con=conn)
        bugs_df = pd.read_sql("select * from bugs", con=conn)

    months = [
        'january', 'february', 'march', 'april', 
        'may', 'june', 'july', 'august',
        'september', 'october', 'november', 'december',
    ]

    for month in months:
        fish_df.loc[fish_df[month]==1, month] = True
        fish_df.loc[fish_df[month]==0, month] = False

        bugs_df.loc[bugs_df[month]==1, month] = True
        bugs_df.loc[bugs_df[month]==0, month] = False
    
    return jsonify({
        "fish":json.loads(fish_df[fish_df[m]==True].to_json(orient="index")),
        "bugs":json.loads(bugs_df[bugs_df[m]==True].to_json(orient="index")),
    })


@app.route('/')
def index():

    return render_template('index.html')


