import calendar
import datetime
import sqlite3

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

def checkstringforlist(s, l):
    """
    checks a string to see if it contains any items in a list
    """

    for item in l:
        if item in s:
            return True

    return False

@app.route('/_get_months')
def get_months():

    included_months = []
    for k, v in request.args.items():
        if v == 'true':
            included_months.append(k)

    with sqlite3.connect('db.sqlite') as conn:
        fish = conn.execute("select name, price, location, hours, months from fish").fetchall()
        bugs = conn.execute("select name, price, location, hours, months from bugs").fetchall()

    included_fish = [line for line in fish if checkstringforlist(line[4], included_months)]
    included_bugs = [line for line in bugs if checkstringforlist(line[4], included_months)]

    return jsonify({"fish":included_fish, "bugs":included_bugs})


@app.route('/')
def index():

    current_month = datetime.datetime.now().strftime('%B')
    print(current_month)

    with sqlite3.connect('db.sqlite') as conn:
        fish = conn.execute("select name, price, location, hours, months from fish").fetchall()

    todays_fish = [row for row in fish if current_month in row[4]]

    print(todays_fish)

    return render_template('index.html', todays_fish=todays_fish, current_month=current_month)

app.run()
