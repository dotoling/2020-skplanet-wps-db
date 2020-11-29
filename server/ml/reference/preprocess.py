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