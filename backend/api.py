#!/usr/bin/python3
import json
import requests

# تنظیمات خروجی برای وب‌سرور
print("Content-Type: application/json\n")

def get_tsetmc_bonds():
    try:
        # آدرس دیده‌بان بازار TSETMC (نسخه فشرده داده‌ها)
        url = "http://www.tsetmc.com/tsev2/data/MarketWatchInit.aspx?h=0&r=0"
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        
        # در اینجا منطق پارس کردن دیتای TSETMC قرار می‌گیرد
        # برای گام اول، یک ساختار نمونه منطبق با ۵ ستون درخواستی برمی‌گردانیم
        # تا از صحت اتصال گیت‌هاب و هاست مطمئن شوید
        
        sample_data = [
            {"symbol": "اراد 120", "volume": 550000, "lastPrice": 820000, "closePrice": 821000, "yesterdayPrice": 815000},
            {"symbol": "گام بانک ملت", "volume": 1200000, "lastPrice": 790000, "closePrice": 792000, "yesterdayPrice": 800000}
        ]
        
        return json.dumps(sample_data)
    except Exception as e:
        return json.dumps([{"symbol": "خطا در اتصال", "volume": 0, "lastPrice": 0, "closePrice": 0, "yesterdayPrice": 0}])

print(get_tsetmc_bonds())
