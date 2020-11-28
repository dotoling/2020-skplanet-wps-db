import os
from pathlib import Path
import numpy as np
import pandas as pd
from collections import defaultdict
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import KFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import logging as log
from datetime import datetime
import joblib

# --- 데이터 전처리 ---
data_dir = Path('./data')
data_dir.mkdir(parents=True, exist_ok=True)

rssi_threshold = 40

df_signal = pd.read_csv(Path('./data/signal_data.csv'), header=None)
# rssi(%)를 string에서 int로 변환(%)
df_signal[1] = pd.to_numeric(df_signal[1])
df_signal = df_signal[df_signal[1] > rssi_threshold]

bssid_set = np.unique(df_signal[0])
rp_set = np.unique(df_signal[4])
timestamp_set = np.unique(df_signal[2])

rp_encoder = LabelEncoder()
bssid_encoder = LabelEncoder()

# string으로 되어있는 rp를 숫자로 mapping
rp_encoder.fit(rp_set)
np.save('./data/classes.npy', rp_encoder.classes_)
df_signal[4] = rp_encoder.transform(df_signal[4])

# key : timestamp, value : bssid-rssi, rp
# df_signal : [0] bssid, [1] rssi, [2] timestamp, [3] position, [4] rp
scan_dict = defaultdict(lambda : defaultdict(int).fromkeys(bssid_set, 0))
for idx, signal in df_signal.iterrows():
    #         timestamp  bssid        rssi
    scan_dict[signal[2]][signal[0]] = signal[1]
    scan_dict[signal[2]]['rp'] = signal[4]

train_data = pd.DataFrame.from_dict(scan_dict).transpose()

train_data.to_csv(Path('./data/train_data.csv'), index=False)


# --- 모델 생성 ---
handler = log.FileHandler('./log/train.log', 'a+', 'utf-8')
log.basicConfig(handlers=[handler], level=log.INFO)
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