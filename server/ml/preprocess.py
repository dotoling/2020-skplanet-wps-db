import sys, json

import os
from pathlib import Path
import numpy as np
import pandas as pd
from collections import defaultdict
from sklearn.preprocessing import LabelEncoder
from datetime import datetime

sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')
lines = sys.stdin.readlines()

user_wifi = json.loads(lines[0])
pos_name, lat, lon = sys.argv[1:4]

rssi_threshold = 40

df_wifi = pd.DataFrame.from_records(user_wifi)
df_wifi = df_wifi[df_wifi['rssi'] > rssi_threshold]

cur_time = datetime.now().strftime("%Y%m%d-%H%M%S")

# 전체 Wi-Fi 데이터 목록에서 rp 별로 분리
for rp_name, df_rp in df_wifi.groupby('rp'):

    data_path = Path(__file__).parent / 'data' / pos_name / rp_name
    data_path.mkdir(parents=True, exist_ok=True)

    # defaultdict.fromkeys()에서 알아서 중복 제거해줌
    # key = timestamp, value = defaultdict of bssid in rp : rssi, rp : no. of rp
    dict_rp = defaultdict(lambda : defaultdict(int).fromkeys(df_rp['bssid'], 0))
    for idx, wifi in df_rp.iterrows():
        dict_rp[wifi['timestamp']][wifi['bssid']] = wifi['rssi']
        dict_rp[wifi['timestamp']]['rp'] = wifi['rp']

    train_data = pd.DataFrame.from_dict(dict_rp).transpose()

    time = datetime.now().strftime("%Y%m%d-%H%M%S")
    train_data.to_csv(data_path / f'{cur_time}.csv', index=False)

