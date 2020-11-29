import sys, json

import os
from pathlib import Path
import numpy as np
import pandas as pd
from collections import defaultdict
from sklearn.preprocessing import LabelEncoder

sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')
lines = sys.stdin.readlines()

user_wifi = json.loads(lines[0])
pos_name, lat, lon = sys.argv[1:4]

df = pd.DataFrame.from_records(user_wifi)
print(df)