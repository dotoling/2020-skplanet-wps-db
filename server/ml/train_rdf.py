import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import KFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import logging as log
from datetime import datetime
import joblib

log.basicConfig(filename='./log_train.log', filemode='a+', level=logging.INFO)
log.info('----- '+__file__+' '+str(datetime.now())+' -----')

df_all = pd.read_csv('./data/train_data.csv')

X = df_all.iloc[:,:-1].values
y = df_all.iloc[:,-1].values

kf = KFold(n_splits=5, shuffle=True, random_state=12321)

fold_n = 1
for train_idx, test_idx in kf.split(X):
    X_train, X_test = X[train_idx], X[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]
    
    clf = RandomForestClassifier(n_estimators=100, n_jobs=-1, random_state=42)
    clf.fit(X_train, y_train)

    acc_train = accuracy_score(y_train, clf.predict(X_train))
    acc_test = accuracy_score(y_test, clf.predict(X_test))

    log.info(f'FOLD #{fold_n} TRAIN ACC: {acc_train} / TEST ACC: {acc_test}')

    fold_n += 1


clf = RandomForestClassifier(n_estimators=100, n_jobs=-1, random_state=42)
clf.fit(X, y)

joblib.dump(clf, './data/model_rdf.plk')
log.info(__file__+' model dump done')