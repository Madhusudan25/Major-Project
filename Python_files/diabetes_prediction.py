import sys
import tensorflow as tf
import pandas as pd
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# with open('/Machine_learning/mymodels') as diabetes:
new_model = tf.keras.models.load_model('Machine_learning/mymodels')
# score = new_model.predict([[6,148,72,35,0,33.6,0.627,50]])
lst = sys.argv[1].split(',')
lst = [float(i) for i in lst]
scoreval=new_model.predict([lst],verbose=0)

# print(new_model.predict([[6,148,72,35,0,33.6,0.627,50]],verbose=0))

print(scoreval[0][0])