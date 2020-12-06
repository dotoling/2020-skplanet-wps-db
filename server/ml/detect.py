import os, sys, json
import logging as log
from pathlib import Path
from datetime import datetime
from collections import defaultdict

import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

lines = sys.stdin.readlines()
user_wifi = json.loads(lines[0])
pos_name = sys.argv[1]

Path('./log').mkdir(parents=True, exist_ok=True)

base_path = Path(__file__).parent
data_path = base_path / 'data' / pos_name

handler = log.FileHandler(base_path / 'log/detect.log', 'a+', 'utf-8')
log.basicConfig(handlers=[handler], level=log.INFO)
log.info(f'{datetime.now()} ------- detection for {pos_name} -------')

model_rdf = joblib.load(base_path / 'model' / pos_name / 'model_rdf.plk')
model_svm = joblib.load(base_path / 'model' / pos_name / 'model_svm.plk')

enc_rp = LabelEncoder()
enc_rp.classes_ = np.load(base_path / 'model' / pos_name / 'classes.npy', allow_pickle=True)

enc_bssid = LabelEncoder()
enc_bssid.classes_ = np.load(base_path / 'model' / pos_name / 'features.npy', allow_pickle=True)

log.info(f'user data bssids : {len(user_wifi)}')

# 유저 데이터 중 모델에 없는 bssid를 제외한 detection용 데이터
# 실제 데이터 쓸때는 bssid_num이 아닌 string bssid를 사용
dict_detection = defaultdict.fromkeys(enc_bssid.transform(enc_bssid.classes_), 0)
for bssid_num, rssi in user_wifi:
    if bssid_num in dict_detection:
        dict_detection[bssid_num] = rssi

# string인 bssid를 숫자로 mapping
df_detection = pd.DataFrame().from_dict([dict_detection])
result_rdf = enc_rp.inverse_transform(model_rdf.predict(df_detection))[0]
result_svm = enc_rp.inverse_transform(model_svm.predict(df_detection))[0]

proba_rdf = model_rdf.predict_proba(df_detection)[0]
proba_svm = model_svm.predict_proba(df_detection)[0]

# 확률만 들어있는 기존의 리스트에다 tuple로 각각의 rp 이름을 붙여줌
proba_rdf = [(enc_rp.inverse_transform([rp])[0], proba) for rp, proba in enumerate(proba_rdf)]
proba_svm = [(enc_rp.inverse_transform([rp])[0], proba) for rp, proba in enumerate(proba_svm)]
proba_all = [(proba_rdf[i][0], np.mean([proba_rdf[i][1],proba_svm[i][1]])) for i in range(len(proba_rdf))]
result_all = enc_rp.classes_[np.argmax([p[1] for p in proba_all])]

# key = 확률을 기준으로 정렬
sorted_rdf = sorted(proba_rdf, key=lambda proba: proba[1], reverse=True)
sorted_svm = sorted(proba_svm, key=lambda proba: proba[1], reverse=True)
sorted_all = sorted(proba_all, key=lambda proba: proba[1], reverse=True)

log.info(f'RDF : {result_rdf}')
log.info(''.join([f'[{rp}] : {proba:.2f}, ' for rp, proba in sorted_rdf]))

log.info(f'SVM : {result_svm}')
log.info(''.join([f'[{rp}] : {proba:.2f}, ' for rp, proba in sorted_svm]))

log.info(f'ALL : {result_svm}')
log.info(''.join([f'[{rp}] : {proba:.2f}, ' for rp, proba in sorted_all]))


print(f'{pos_name} {result_rdf}')