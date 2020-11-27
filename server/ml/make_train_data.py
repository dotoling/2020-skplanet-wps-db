import os
from pathlib import Path
import numpy as np
import pandas as pd
from collections import defaultdict
from sklearn.preprocessing import LabelEncoder

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

# string으로 되어있는 rp와 bssid들을 숫자로 mapping
rp_encoder.fit(rp_set)
#rp_set_encoded = rp_encoder.transform(rp_set)
#rp_set_decoded = rp_encoder.inverse_transform(rp_set_encoded)
np.save('./data/classes.npy', rp_encoder.classes_)

bssid_encoder.fit(bssid_set)
np.save('./data/features.npy', bssid_encoder.classes_)

train_data = pd.DataFrame()

for rp in np.unique(df_signal[4]):
    # 각 rp에 해당하는 signal 추출
    rp_data = df_signal[df_signal[4] == rp]
    rp_num = rp_encoder.transform([rp_data.iloc[0][4]])[0]

    # key : timestamp, value : bssid-rssi, rp
    scan_dict = defaultdict(lambda : defaultdict(int).fromkeys(bssid_set, 0))
    for idx, signal in rp_data.iterrows():
        #         timestamp  bssid        rssi
        scan_dict[signal[2]][signal[0]] = signal[1]

    for timestamp, scan_data in scan_dict.items():
        scan_data['rp'] = rp_num
    
    train_data = train_data.append(pd.DataFrame.from_dict(scan_dict).transpose())


cols = train_data.columns.tolist()
cols.sort()
train_data = train_data[cols]

train_data.to_csv(Path('./data/train_data.csv'), index=False)
train_data