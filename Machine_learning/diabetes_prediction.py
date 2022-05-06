# from xxlimited import new
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

diabetes_data = pd.read_csv("diabetes.csv")
diabetes_data_copy = diabetes_data.copy(deep = True)
diabetes_data_copy[['Glucose','BloodPressure','SkinThickness','Insulin','BMI']] = diabetes_data_copy[['Glucose','BloodPressure','SkinThickness','Insulin','BMI']].replace(0,np.NaN)
diabetes_data_copy.isnull().sum()

diabetes_data_copy['Glucose'].fillna(diabetes_data_copy['Glucose'].mean(), inplace = True)
diabetes_data_copy['BloodPressure'].fillna(diabetes_data_copy['BloodPressure'].mean(), inplace = True)
diabetes_data_copy['SkinThickness'].fillna(diabetes_data_copy['SkinThickness'].median(), inplace = True)
diabetes_data_copy['Insulin'].fillna(diabetes_data_copy['Insulin'].median(), inplace = True)
diabetes_data_copy['BMI'].fillna(diabetes_data_copy['BMI'].median(), inplace = True)
print(diabetes_data_copy)
from sklearn.preprocessing import StandardScaler
sc_X = StandardScaler()
X =  pd.DataFrame(sc_X.fit_transform(diabetes_data_copy.drop(["Outcome"],axis = 1),),
        columns=['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin',
       'BMI', 'Pedigree', 'Age'])
y = diabetes_data_copy.Outcome
X=X.iloc[:,:].values
y=y.iloc[:].values

print(y)

"""## Importing the dataset"""

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.3,random_state=0)

X_train.shape

print(X_test[0])
type(y_train)

"""## Training the ANN MODEL"""

y_train.shape

# from tensorflow.keras.models import Sequential
# # from keras.models import Sequential
# from tensorflow.keras.layers import Dense
import tensorflow as tf
ann = tf.keras.models.Sequential()
ann.add(tf.keras.layers.Dense(units=6, activation='relu'))
ann.add(tf.keras.layers.Dense(units=6, activation='relu'))
ann.add(tf.keras.layers.Dense(units=1, activation='sigmoid'))
ann.compile(optimizer = 'adam', loss = 'binary_crossentropy', metrics = ['accuracy'])

# model = Sequential()
# model.add(Dense(8,activation='relu',input_dim=8))
# model.add(Dense(6,activation='relu',input_dim=8))
# model.add(Dense(1,activation='sigmoid',input_dim=6))

ann.compile(loss='binary_crossentropy',optimizer='adam',metrics=['accuracy'])

ann.fit(X_train, y_train, batch_size = 32, epochs = 128)
# model.fit(X_train, y_train, batch_size = 32, epochs = 128)

print(X_test[0])

print(round(ann.predict([[-0.84488505, 2.54185013,  0.29737562,  1.58123429, -0.18154124,  1.52019338,
  2.784923  , -0.95646168]])[0][0]))

"""## Predicting the Test set results"""
# tf.keras.models.save_model(ann, 
#                           'imdb_model', 
#                            include_optimizer=True, 
#                            save_format='tf')
# ann.save('Machine_learning')
# new_model = tf.keras.models.load_model('mymodels')
new_model = tf.keras.models.load_model('mymodels')
# tf.saved_model.save(ann, './')
y_pred = new_model.predict(X_test)
for i in range(len(y_pred)):
  y_pred[i][0]=round(y_pred[i][0])

print(y_test)

np.shape(y_test)

np.shape(y_pred)

"""## Making the Confusion Matrix"""

from sklearn.metrics import confusion_matrix, accuracy_score
cm = confusion_matrix(y_pred,y_test)
result=accuracy_score(y_pred,y_test)

import seaborn as sns
import matplotlib.pyplot as plt
plt.figure(figsize=(5,5))
sns.heatmap(cm,cmap="Spectral", annot=True, cbar=False, square=True, annot_kws={"fontsize":18})
plt.xlabel("Predicted values", fontsize=15, fontweight='bold')
plt.xticks(fontsize=15, fontweight='bold')
plt.ylabel("Actual values", fontsize=15, fontweight='bold')
plt.yticks(fontsize=15, fontweight='bold')
plt.title("Confusion Matrix", fontsize=20, fontweight='bold')
plt.show()
print("The accuracy obtained from Artificial Neural Network is " + str(result) )

# import pickle
# data={
#   "model":ann,
#   "scaler":sc_X
# }
# with open('diabetes_prediction','wb') as f:
#   pickle.dump(data,f)
# with open('diabetes_prediction','rb') as f:
#   data=pickle.load(f)

# y_pred = data.model.predict(X_test)
# for i in range(len(y_pred)):
#   y_pred[i][0]=round(y_pred[i][0])

# result=accuracy_score(y_pred,y_test)
# print(result)