// تنظیمات ستون‌ها - برای گام‌های بعد اینجا را گسترش می‌دهیم
const columns = [
    { label: 'نام اوراق', key: 'symbol' },
    { label: 'حجم معامله', key: 'volume' },
    { label: 'آخرین معامله', key: 'lastPrice' },
    { label: 'قیمت پایانی', key: 'closePrice' },
    { label: 'قیمت دیروز', key: 'yesterdayPrice' }
];

async function fetchBondsData() {
    try {
        const response = await fetch('backend/api.py'); // فراخوانی فایل پایتون
        const data = await response.json();
        renderTable(data);
        document.getElementById('last-update').innerText = 'آخرین به‌روزرسانی: ' + new Date().toLocaleTimeString('fa-IR');
    } catch (error) {
        console.error('خطا در دریافت داده:', error);
        document.getElementById('last-update').innerText = 'خطا در آپدیت داده‌ها';
    }
}

function renderTable(data) {
    const headerRow = document.getElementById('table-header');
    const body = document.getElementById('bonds-body');
    
    // ساخت هدر (فقط بار اول یا برای اطمینان)
    headerRow.innerHTML = columns.map(col => `<th>${col.label}</th>`).join('');
    
    // ساخت ردیف‌ها
    body.innerHTML = data.map(bond => `
        <tr>
            ${columns.map(col => `<td class="${typeof bond[col.key] === 'number' ? 'numeric' : ''}">${bond[col.key]?.toLocaleString('fa-IR') || '-'}</td>`).join('')}
        </tr>
    `).join('');
}

// شروع به کار و آپدیت ۶۰ ثانیه‌ای
fetchBondsData();
setInterval(fetchBondsData, 60000);
