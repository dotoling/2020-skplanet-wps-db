import os, sys, json
import logging as log
from pathlib import Path
from datetime import datetime
from collections import defaultdict

import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import KFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

pos_name = sys.argv[1]

base_path = Path(__file__).parent
handler = log.FileHandler(base_path / 'log/train.log', 'a+', 'utf-8')
log.basicConfig(handlers=[handler], level=log.INFO)
log.info(f'{datetime.now()} generating model for {pos_name}')

df_all = pd.DataFrame()
pos_path = base_path / 'data' / pos_name
train_datas = [pd.read_csv(path) for path in pos_path.glob('**/*') if path.is_file()]

# 맨 끝의 rp를 제외한 column(bssid) 모으기
bssid_set = set()
for data in train_datas:
    bssid_set.update(data.columns[:-1])

print(bssid_set)
exit()    

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

    log.info(f'{datetime.now()} FOLD #{fold_n} TRAIN ACC: {acc_train} / TEST ACC: {acc_test}')

    fold_n += 1


clf = RandomForestClassifier(n_estimators=100, n_jobs=-1, random_state=42)
clf.fit(X, y)

joblib.dump(clf, base_path / 'model' /  'model.plk')
log.info(f'{datetime.now()} model for {pos_name} generated successfully')