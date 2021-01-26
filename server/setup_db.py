import sqlite3
from sqlite3 import Error
import pandas as pd

def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print(sqlite3.version)
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

# make db file and schema
create_connection('ext.db')
conn = sqlite3.connect('ext.db')
c = conn.cursor()
c.execute('''DROP TABLE IF EXISTS names''')
c.execute('''CREATE TABLE names (id PRIMARY KEY, name text, prob_m REAL, prob_w REAL)''')

# get data from python
names = pd.read_csv('common_names.csv', index_col=0)
names.to_sql('names', conn, if_exists='replace', index=False)
c.execute('''SELECT * FROM names''').fetchall()