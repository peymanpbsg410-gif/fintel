import json
import urllib.request
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

def get_all_debt_securities():
    """دریافت اوراق بدهی از سایت مدیریت فناوری بورس تهران (TSETMC)"""
    url = "http://www.tsetmc.com/tsev2/data/MarketWatchInit.aspx?h=0&r=0"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            raw_data = response.read()
            text_data = raw_data.decode('latin1')
            
            parts = text_data.split('@')
            securities = []
            
            for part in parts:
                rows = part.split(';')
                for row in rows:
                    fields = row.split(',')
                    if len(fields) > 15:
                        securities.append({
                            "name": fields[2] if len(fields) > 2 else "نامشخص",
                            "volume": fields[5] if len(fields) > 5 else "0",
                            "lastPrice": fields[3] if len(fields) > 3 else "0",
                            "closingPrice": fields[4] if len(fields) > 4 else "0",
                            "yesterdayPrice": fields[7] if len(fields) > 7 else "0"
                        })
            return securities[:50]
    except Exception as e:
        return [{"error": str(e)}]

def app(environ, start_response):
    path = environ.get('PATH_INFO', '')
    
    if path == '/api/debt-securities' or path == '/api':
        data = get_all_debt_securities()
        response_body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        start_response('200 OK', [
            ('Content-Type', 'application/json; charset=utf-8'),
            ('Access-Control-Allow-Origin', '*')
        ])
        return [response_body]
    
    start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
    html = """
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>سامانه Fintel - اوراق بدهی</title>
        <style>
            body { font-family: Tahoma, sans-serif; background: #f4f4f9; color: #333; text-align: center; padding: 50px; }
            h1 { color: #2c3e50; }
            table { width: 80%; margin: 20px auto; border-collapse: collapse; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            th, td { padding: 12px; border: 1px solid #ddd; text-align: center; }
            th { background: #3498db; color: white; }
        </style>
    </head>
    <body>
        <h1>سامانه تحلیل اوراق بدهی (Fintel)</h1>
        <p>در حال بارگذاری داده‌های اوراق بدهی...</p>
        <div id="data-container"></div>
        <script>
            fetch('/api/debt-securities')
                .then(res => res.json())
                .then(data => {
                    if(data.length && !data[0].error) {
                        let html = '<table><tr><th>نام اوراق</th><th>حجم معامله</th><th>آخرین معامله</th><th>قیمت پایانی</th><th>قیمت روز قبل</th></tr>';
                        data.forEach(item => {
                            html += `<tr><td>${item.name}</td><td>${item.volume}</td><td>${item.lastPrice}</td><td>${item.closingPrice}</td><td>${item.yesterdayPrice}</td></tr>`;
                        });
                        html += '</table>';
                        document.body.innerHTML = '<h1>سامانه تحلیل اوراق بدهی (Fintel)</h1>' + html;
                    } else {
                        document.querySelector('p').innerText = 'خطا در دریافت اطلاعات یا عدم وجود داده.';
                    }
                })
                .catch(err => {
                    document.querySelector('p').innerText = 'خطا در ارتباط با سرور.';
                });
        </script>
    </body>
    </html>
    """
    return [html.encode('utf-8')]

application = app
