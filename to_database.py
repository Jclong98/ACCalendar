import pandas as pd

import sqlite3

fish_df = pd.read_csv('./static/fish.csv', index_col=0)
bugs_df = pd.read_csv('./static/bugs.csv', index_col=0)


with sqlite3.connect("db.sqlite") as conn:
    fish_df.to_sql("fish", con=conn, if_exists="replace", index=False)
    bugs_df.to_sql("bugs", con=conn, if_exists="replace", index=False)



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

    print(fish_df)
    print(bugs_df)