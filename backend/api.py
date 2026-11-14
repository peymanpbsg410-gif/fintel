import json
import logging
import time
from urllib.request import Request, urlopen

SOURCE = "https://old.tsetmc.com/tsev2/data/MarketWatchInit.aspx?h=0&r=0"
DEBT_TYPES = {"70", "200", "207", "208", "301", "306", "308", "706"}
_cache = {"until": 0, "data": None}


def parse_num(val):
    if not val or not val.strip():
        return None
    try:
        n = float(val.strip())
        return int(n) if n.is_integer() else n
    except ValueError:
        return None


def get_all_debt_securities():
    if _cache["data"] is not None and time.time() < _cache["until"]:
        return _cache["data"]

    req = Request(
        SOURCE,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Referer": "https://www.tsetmc.com/",
        },
    )
    with urlopen(req, timeout=15) as resp:
        content = resp.read().decode("utf-8-sig")

    parts = content.split("@")
    if len(parts) < 3:
        raise ValueError("پاسخ TSETMC معتبر نیست")

    bonds = []
    for row in parts[2].split(";"):
        cols = row.split(",")
        if len(cols) < 26:
            continue

        symbol = cols[2].strip()
        name = cols[3].strip()
        sector = cols[18].strip()
        asset_type = cols[22].strip()

        # فیلتر جامع کلیه اوراق بدهی (صنعت ۶۹، انواع ابزارهای بدهی و نمادهای مربوطه)
        is_debt = (
            sector == "69"
            or asset_type in DEBT_TYPES
            or symbol.startswith(("اخزا", "اراد", "گام", "صکوک", "مبین", "سلف"))
            or name.startswith(("اخزا", "اراد", "گام", "صکوک", "اوراق"))
        )

        if not is_debt:
            continue

        bonds.append(
            {
                "symbol": name if name else symbol,
                "volume": parse_num(cols[9]),
                "lastPrice": parse_num(cols[7]),
                "closePrice": parse_num(cols[6]),
                "yesterdayPrice": parse_num(cols[13]),
            }
        )

    bonds.sort(key=lambda x: x["symbol"])
    _cache.update(data=bonds, until=time.time() + 55)
    return bonds


def app(environ, start_response):
    try:
        data = get_all_debt_securities()
        status = "200 OK"
    except Exception:
        logging.exception("Error fetching bonds")
        data = {"error": "خطا در دریافت اطلاعات از TSETMC"}
        status = "502 Bad Gateway"

    body = json.dumps(data, ensure_ascii=False).encode("utf-8")
    start_response(
        status,
        [
            ("Content-Type", "application/json; charset=utf-8"),
            ("Cache-Control", "no-store"),
        ],
    )
    return [body]
