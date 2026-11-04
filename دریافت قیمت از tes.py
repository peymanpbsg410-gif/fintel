import requests

# آدرس مطمئن و رسمی دیده‌بان تابلوی بورس
url = "http://old.tsetmc.com/tsev2/data/MarketWatchPlus.aspx"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

try:
    print("در حال دریافت اطلاعات کل تابلوی بازار از TSETMC...")
    # پارامتر h=0 یعنی اطلاعات اولیه کل بازار را بده
    response = requests.get(url, params={"h": "0", "r": "0"}, headers=headers, timeout=15)
    print(f"کد وضعیت سرور: {response.status_code}")

    if response.status_code == 200:
        raw_data = response.text
        # بخش اول دیتا شامل ردیف‌های نمادهاست که با @ جدا شده‌اند
        sections = raw_data.split("@")
        rows = sections[2].split(";") if len(sections) > 2 else []
        
        print(f"ارتباط کاملاً برقرار شد! تعداد {len(rows)} نماد دریافت گردید.\n")
        print("نمونه‌ای از چند نماد اوراق دولتی یافت‌شده در بازار امروز:")
        
        count = 0
        for row in rows:
            cols = row.split(",")
            if len(cols) > 7:
                symbol_persian = cols[2]  # نام فارسی نماد (مثل اراد یا اخزا)
                last_price = cols[7]      # آخرین قیمت معامله
                closing_price = cols[6]   # قیمت پایانی

                # فیلتر برای نمایش نمادهای بدهی (اراد، اخزا، گام)
                if any(k in symbol_persian for k in ["اراد", "اخزا", "گام"]):
                    print(f"نماد: {symbol_persian:12} | آخرین قیمت: {last_price} ریال | قیمت پایانی: {closing_price} ریال")
                    count += 1
                    if count >= 8: # فقط ۸ تای اول را برای نمونه نشان بده
                        break
    else:
        print("خطا در پاسخ سرور:", response.status_code)

except Exception as e:
    print(f"خطای اجرا: {e}")
