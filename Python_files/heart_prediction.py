import sys

import pandas as pd

with open('Machine_learning/heart_disease_prediction','rb') as diabetes:
    data = pd.read_pickle(diabetes)

lst = sys.argv[1].split(',')
lst = [float(i) for i in lst]
scoreval=data.predict([lst])

print(scoreval[0])