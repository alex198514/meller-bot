/* Meller Bot web app: reads data.json (written by paper.py after every run), live prices from Binance's public API. */
"use strict";

const I18N = {
  ru: {
    tab_market: "Рынок", tab_signal: "Сигнал", tab_positions: "Позиции", tab_overview: "Обзор", tab_news: "Новости",
    news_all: "Все", news_mine: "Мои монеты", news_none: "Новостей пока нет.", news_coin: "Новости {coin}",
    news_coin_none: "Новостей за 7 дней нет", news_meta: "{n} заголовков за 7 дней · CoinDesk, Cointelegraph, Decrypt, Binance",
    delisting: "⚠ делистинг", ago_m: "{n} мин назад", ago_h: "{n} ч назад", ago_d: "{n} д назад", ago_now: "только что",
    bubbles_btn: "Пузыри", close: "Закрыть", heat_title: "Тепловая карта",
    heat_hint: "Площадь — объём за 24ч, цвет — изменение за {p}. Нажмите на монету.", heat_loading: "загрузка изменений за {p}…",
    fng_title: "Индекс страха и жадности", fng_yday: "Вчера", fng_week: "Неделю назад", fng_30: "За 30 дней",
    fng_ef: "Крайний страх", fng_f: "Страх", fng_n: "Нейтрально", fng_g: "Жадность", fng_eg: "Крайняя жадность",
    bubble_hint: "Размер — объём за 24ч, цвет — изменение за {p}. <i class=\"ring\"></i> до пробоя ≤ {n}%. Нажмите на монету.",
    bubble_loading: "загрузка изменений за {p}…", bubble_aria: "Пузыри монет: размер — объём, цвет — изменение цены",
    search: "Поиск монеты", near_title: "Ближе к пробою",
    near_explain: "Монеты отсортированы по расстоянию до 20-дневного максимума. Сигнал LONG появляется, когда " +
      "дневная свеча (закрытие в 00:00 UTC) закрывается выше этого уровня. Полная полоса — цена у уровня, " +
      "пустая — 20% и дальше.",
    show_all: "Показать все {n}", show_top: "Показать только топ-10",
    live: "онлайн", polling: "обновление раз в минуту", data_at: "данные {t}", to_breakout: "до пробоя", above: "выше уровня",
    bull: "бычий", bear: "медвежий", side: "боковик", nodata: "нет данных",
    chip_wait: "ЖДЁМ ПРОБОЯ", chip_long: "LONG ОТКРЫТ",
    entry: "Вход", stop: "Стоп", now: "Сейчас", take: "Тейк", trailing: "трейлинг",
    plan: "план, если будет пробой", plan_close: "план на закрытии сегодня",
    f_skip: "Свеча {x} ATR (фильтр {f} ATR): вход будет пропущен", f_ok: "Свеча {x} ATR: фильтр пройден, BUY на дневном закрытии",
    pos_note: "позиция {v} с {date}", level: "пробой",
    wait: "Ждём дневного закрытия выше {lvl}, осталось {d}%.",
    above_now: "Цена выше уровня {lvl}: сигнал будет, если дневная свеча закроется выше (закрытие в 00:00 UTC).",
    above_skip: "Цена выше уровня {lvl}, но сегодняшняя свеча уже {x} ATR: если закроется так, бот пропустит вход.",
    in_pos: "Позиция {v} открыта {date}: сейчас {r}, стоп {stop}.",
    no_pos: "Нет открытых позиций. Бот ждёт пробоя.", since: "с {date}",
    i_entered: "Я вошёл", my_trades: "Мои сделки", bot_positions: "Позиции бота", f_entry: "Цена входа", f_stop: "Стоп",
    f_size: "Размер, USDT", f_save: "Сохранить", f_hint: "По умолчанию риск $50 (0.5% от $10,000), как у бота. Комиссии не учитываются.",
    f_bad: "Проверьте числа: стоп должен быть ниже входа, размер больше нуля.", my_none: "Открытых сделок нет. Нажмите «Я вошёл» на вкладке Сигнал.",
    closed_btn: "Закрыл", delete_btn: "Удалить", ask_exit: "Цена выхода {coin}:", ask_delete: "Удалить сделку {coin} без записи в историю?",
    to_stop: "до стопа", to_tp1: "до TP1", size: "размер", result: "Результат", my_entry: "мой вход", bot_entry: "вход бота", me: "я", bot: "бот",
    history_t: "История моих сделок", summary: "Сделок: {n} · в плюсе {w}% · {r} · {u}", export_btn: "Экспорт", import_btn: "Импорт",
    imported: "Импортировано сделок: {n}", import_bad: "Файл не похож на экспорт журнала.", opened: "открыта {d}", closed_at: "закрыта {d}",
    risk: "Риск", tp_hit: "TP{n} исполнен", be: "стоп в безубытке", not_in_ch: "вне челленджа",
    challenge: "Челлендж", phase: "фаза", attempt: "попытка", target: "Цель", daily: "Дневной убыток",
    maxloss: "Макс. убыток", days: "Торговые дни", passed: "ОБЕ ФАЗЫ ПРОЙДЕНЫ", balance: "баланс",
    curve: "Кривая эквити", curve_hint: "Кривая появится после нескольких дневных закрытий.",
    history: "История сигналов", no_history: "Пока нет сделок.",
    OPEN: "вход", TP1: "TP1", TP2: "TP2", CLOSE_STOP: "стоп", CLOSE_BE: "безубыток", CLOSE_TRAIL: "трейлинг",
    loading: "загрузка…", load_fail: "Не удалось загрузить data.json",
  },
  en: {
    tab_market: "Market", tab_signal: "Signal", tab_positions: "Positions", tab_overview: "Overview", tab_news: "News",
    news_all: "All", news_mine: "My coins", news_none: "No news yet.", news_coin: "{coin} news",
    news_coin_none: "No news in 7 days", news_meta: "{n} headlines in 7 days · CoinDesk, Cointelegraph, Decrypt, Binance",
    delisting: "⚠ delisting", ago_m: "{n} min ago", ago_h: "{n} h ago", ago_d: "{n} d ago", ago_now: "just now",
    bubbles_btn: "Bubbles", close: "Close", heat_title: "Heatmap",
    heat_hint: "Area is 24h volume, colour the {p} change. Tap a coin.", heat_loading: "loading {p} changes…",
    fng_title: "Fear & Greed Index", fng_yday: "Yesterday", fng_week: "Last week", fng_30: "Last 30 days",
    fng_ef: "Extreme Fear", fng_f: "Fear", fng_n: "Neutral", fng_g: "Greed", fng_eg: "Extreme Greed",
    bubble_hint: "Size is 24h volume, colour the {p} change. <i class=\"ring\"></i> within {n}% of a breakout. Tap a coin.",
    bubble_loading: "loading {p} changes…", bubble_aria: "Coin bubbles: size is volume, colour is price change",
    search: "Search coin", near_title: "Closest to a breakout",
    near_explain: "Coins are sorted by their distance to the 20-day high. A LONG signal comes when a daily " +
      "candle (close at 00:00 UTC) closes above that level. A full bar means the price is at the level, an " +
      "empty one 20% or more away.",
    show_all: "Show all {n}", show_top: "Show top 10 only",
    live: "live", polling: "updating every minute", data_at: "data {t}", to_breakout: "to breakout", above: "above level",
    bull: "bull", bear: "bear", side: "sideways", nodata: "no data",
    chip_wait: "WAITING", chip_long: "LONG OPEN",
    entry: "Entry", stop: "Stop", now: "Now", take: "Take", trailing: "trailing",
    plan: "plan if it breaks out", plan_close: "plan at today's close",
    f_skip: "Candle {x} ATR (filter {f} ATR): entry will be skipped", f_ok: "Candle {x} ATR: filter passed, BUY at the daily close",
    pos_note: "position {v} since {date}", level: "breakout",
    wait: "Waiting for a daily close above {lvl}, {d}% to go.",
    above_now: "Price is above {lvl}: a signal comes if the daily candle closes above it (close at 00:00 UTC).",
    above_skip: "Price is above {lvl}, but today's candle is {x} ATR: if it closes like this, the bot will skip the entry.",
    in_pos: "Position {v} opened {date}: now {r}, stop {stop}.",
    no_pos: "No open positions. The bot is waiting for a breakout.", since: "since {date}",
    i_entered: "I entered", my_trades: "My trades", bot_positions: "Bot positions", f_entry: "Entry price", f_stop: "Stop",
    f_size: "Size, USDT", f_save: "Save", f_hint: "Default risk $50 (0.5% of $10,000), like the bot. Fees are not included.",
    f_bad: "Check the numbers: the stop must be below the entry and the size above zero.", my_none: "No open trades. Tap \u201cI entered\u201d on the Signal tab.",
    closed_btn: "Closed", delete_btn: "Delete", ask_exit: "Exit price for {coin}:", ask_delete: "Delete the {coin} trade without adding it to the history?",
    to_stop: "to stop", to_tp1: "to TP1", size: "size", result: "Result", my_entry: "my entry", bot_entry: "bot entry", me: "me", bot: "bot",
    history_t: "My trade history", summary: "Trades: {n} · winners {w}% · {r} · {u}", export_btn: "Export", import_btn: "Import",
    imported: "Trades imported: {n}", import_bad: "This file does not look like a journal export.", opened: "opened {d}", closed_at: "closed {d}",
    risk: "Risk", tp_hit: "TP{n} hit", be: "stop at breakeven", not_in_ch: "outside the challenge",
    challenge: "Challenge", phase: "phase", attempt: "attempt", target: "Target", daily: "Daily loss",
    maxloss: "Max loss", days: "Trading days", passed: "BOTH PHASES PASSED", balance: "balance",
    curve: "Equity curve", curve_hint: "The curve appears after a few daily closes.",
    history: "Signal history", no_history: "No trades yet.",
    OPEN: "entry", TP1: "TP1", TP2: "TP2", CLOSE_STOP: "stop", CLOSE_BE: "breakeven", CLOSE_TRAIL: "trailing",
    loading: "loading…", load_fail: "Could not load data.json",
  },
};

const S = {
  data: null, live: {}, liveOk: false,
  lang: (new URLSearchParams(location.search).get("lang") || storeGet("lang") ||
         (navigator.language || "ru").slice(0, 2)) === "ru" ? "ru" : "en",
  tab: "market", coin: null, query: "", klines: {}, chart: null, curveChart: null, showAll: false,
  news: null, newsFilter: "all", tf: "1d", series: null, dirty: new Set(), flash: {}, lastSlow: 0,
};

function storeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function storeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
const $ = (id) => document.getElementById(id);
const t = (k, vars) => (I18N[S.lang][k] || k).replace(/\{(\w+)\}/g, (_, n) => (vars && n in vars ? vars[n] : ""));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- formatting: numbers never wrap and are never cut ---------- */

/** >=1000: 2 decimals with separators; 10..1000: 2 decimals; 1..10: 3 decimals; <1: 4 significant digits. */
function fmtNum(p) {
  if (p == null || !isFinite(p)) return "—";
  const a = Math.abs(p);
  if (a >= 1000) return p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (a >= 10) return p.toFixed(2);
  if (a >= 1) return p.toFixed(3);
  if (a === 0) return "0";
  return p.toFixed(Math.min(12, 3 - Math.floor(Math.log10(a)))).replace(/0+$/, "").replace(/\.$/, "");
}
const fmt = (p) => (p == null || !isFinite(p) ? "—" : (p < 0 ? "−$" : "$") + fmtNum(Math.abs(p)));
const sgn = (x, d = 2) => (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(d);
const cls = (x) => (x >= 0 ? "up" : "down");
const N = (text, extra = "") => `<span class="num ${extra}">${text}</span>`;   // every number goes through here
/** A live number: updated in place by the WebSocket (data-px = price, data-chg = 24h change of `sym`). */
const NL = (kind, sym, text, extra = "") => `<span class="num ${extra}" data-${kind}="${esc(sym)}">${text}</span>`;

/** Coin icons shipped in icons/ (cryptocurrency-icons 0.18.1, CC0): lowercase ticker = symbol without "USDT". */
const ICONS = new Set("btc eth sol bnb xrp ada doge link ltc avax dot trx atom xlm aave uni zec bch ankr ape chz comp dash enj fil gmt grt icp iost lpt lsk mana neo ong sand stx uma vet zrx 1inch".split(" "));
const ticker = (sym) => sym.replace(/USDT$/, "").toLowerCase();

/** The coin's round icon, or a letter badge on a stable colour derived from the symbol. size: "xs" (20px), "sm" (28px), "lg" (40px). */
function badge(sym, coin, size = "sm") {
  const tk = ticker(sym);
  if (ICONS.has(tk)) return `<img class="cbadge cicon ${size}" src="icons/${tk}.svg" alt="" width="40" height="40" loading="lazy">`;
  let h = 0;
  for (const c of sym) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `<span class="cbadge ${size}" style="background:linear-gradient(135deg,hsl(${h},62%,52%),hsl(${(h + 30) % 360},62%,38%))">${esc(coin[0])}</span>`;
}

const TOP_N = 10;
const CHART_THEME = () => ({
  autoSize: true,                                   // sized from its container: never wider than the screen
  layout: { background: { type: "solid", color: "#18213a" }, textColor: "#9aa6bd", fontSize: 11 },
  grid: { vertLines: { color: "rgba(255,255,255,0.04)" }, horzLines: { color: "rgba(255,255,255,0.05)" } },
  rightPriceScale: { borderColor: "rgba(255,255,255,0.08)" }, timeScale: { borderColor: "rgba(255,255,255,0.08)" },
  localization: { locale: S.lang === "ru" ? "ru-RU" : "en-US" },
});

/* ---------- data ---------- */

async function loadData() {
  const r = await fetch("data.json?" + Date.now(), { cache: "no-store" });
  if (!r.ok) throw new Error("HTTP " + r.status);
  S.data = await r.json();
  S.bySym = Object.fromEntries(S.data.symbols.map((s) => [s.symbol, s]));
}

async function loadLive() {
  if (new URLSearchParams(location.search).has("offline")) { S.liveOk = false; return; }   // test the fallback
  const q = "?symbols=" + encodeURIComponent(JSON.stringify(S.data.symbols.map((s) => s.symbol)));
  for (const host of ["https://api.binance.com", "https://data-api.binance.vision"]) {
    try {
      const r = await fetch(host + "/api/v3/ticker/24hr" + q);
      if (!r.ok) continue;
      const rows = await r.json();
      S.live = Object.fromEntries(rows.map((x) => [x.symbol, { price: +x.lastPrice, change: +x.priceChangePercent, qv: +x.quoteVolume }]));
      S.liveOk = true;
      S.host = host;
      return;
    } catch (e) { /* blocked or offline: try the next host, then fall back to data.json */ }
  }
  S.liveOk = false;
}

const TFS = [["15m", "15m"], ["1h", "1H"], ["4h", "4H"], ["1d", "1D"]];
const kkey = (sym, tf) => (tf === "1d" ? sym : `${sym}|${tf}`);      // daily candles keep their key: the 2 ATR filter reads them
const hasSpot = (sym) => !!S.live[sym];                               // Binance spot data (REST and WebSocket) for this coin

async function loadKlines(sym, tf = "1d") {
  const c = S.klines[kkey(sym, tf)];
  if (c && Date.now() - c.at < 5 * 60 * 1000) return c.rows;
  if (S.liveOk && hasSpot(sym)) {
    try {
      const r = await fetch(`${S.host}/api/v3/klines?symbol=${sym}&interval=${tf}&limit=${tf === "1d" ? 120 : 300}`);
      if (r.ok) {
        const rows = (await r.json()).map((k) => ({ time: k[0] / 1000, open: +k[1], high: +k[2], low: +k[3], close: +k[4] }));
        S.klines[kkey(sym, tf)] = { at: Date.now(), rows };
        return rows;
      }
    } catch (e) { /* fall back below */ }
  }
  if (tf !== "1d") return [];
  return S.bySym[sym].ohlc.map(([d, o, h, l, cl]) => ({ time: d, open: o, high: h, low: l, close: cl }));
}

/* ---------- live prices: one Binance WebSocket (miniTicker for every coin with spot data, kline of the open chart) ---------- */

const WS_URL = "wss://stream.binance.com:9443/stream";
const WS = { sock: null, ok: false, tries: 0, timer: null, kline: null, id: 1, msgs: 0, klines: 0 };

function wsConnect() {
  if (document.hidden || WS.sock || new URLSearchParams(location.search).has("nows")) return;
  const syms = Object.keys(S.live);
  if (!syms.length) return;
  let sock;
  try { sock = new WebSocket(`${WS_URL}?streams=` + syms.map((s) => s.toLowerCase() + "@miniTicker").join("/")); }
  catch (e) { wsRetry(); return; }
  WS.sock = sock;
  sock.onopen = () => {
    WS.ok = true; WS.tries = 0;
    if (WS.kline) wsSend("SUBSCRIBE", [WS.kline]);
    renderHeader();
  };
  sock.onmessage = (ev) => {
    let m;
    try { m = JSON.parse(ev.data); } catch (e) { return; }
    const d = m && m.data;
    if (!d) return;
    WS.msgs++;
    if (d.e === "24hrMiniTicker") onTick(d);
    else if (d.e === "kline") onKline(d);
  };
  sock.onclose = () => {
    WS.sock = null;
    const was = WS.ok;
    WS.ok = false;
    if (was) renderHeader();
    wsRetry();
  };
  sock.onerror = () => { try { sock.close(); } catch (e) { /* closing anyway */ } };
}
function wsRetry() {                                          // 1, 2, 4 ... 30 s; polling covers the gap
  if (document.hidden) return;
  clearTimeout(WS.timer);
  WS.timer = setTimeout(wsConnect, Math.min(30000, 1000 * 2 ** WS.tries++));
}
function wsClose() {
  clearTimeout(WS.timer);
  if (WS.sock) { WS.sock.onclose = null; try { WS.sock.close(); } catch (e) { /* gone */ } WS.sock = null; }
  WS.ok = false;
}
function wsSend(method, params) {
  if (WS.sock && WS.sock.readyState === 1) WS.sock.send(JSON.stringify({ method, params, id: WS.id++ }));
}
/** Follow the kline stream of the open chart (none for coins without Binance spot data). */
function wsKline(sym, tf) {
  const s = sym && hasSpot(sym) ? `${sym.toLowerCase()}@kline_${tf}` : null;
  if (s === WS.kline) return;
  if (WS.kline) wsSend("UNSUBSCRIBE", [WS.kline]);
  WS.kline = s;
  if (s) wsSend("SUBSCRIBE", [s]);
}

function onTick(d) {
  const sym = d.s, p = +d.c, o = +d.o, old = S.live[sym];
  if (!old || !(p > 0)) return;
  if (p !== old.price) S.flash[sym] = p > old.price ? "up" : "down";
  S.live[sym] = { price: p, change: o > 0 ? 100 * (p / o - 1) : old.change, qv: +d.q > 0 ? +d.q : old.qv };
  S.dirty.add(sym);
}

function onKline(d) {
  const k = d.k;
  if (!k) return;
  WS.klines++;
  const bar = { time: k.t / 1000, open: +k.o, high: +k.h, low: +k.l, close: +k.c };
  const c = S.klines[kkey(d.s, k.i)];
  if (c && c.rows.length) {                                   // keep the cache current (the 2 ATR filter reads the daily one)
    const last = c.rows[c.rows.length - 1];
    if (last.time === bar.time) c.rows[c.rows.length - 1] = bar; else if (bar.time > last.time) c.rows.push(bar);
  }
  if (S.series && d.s === S.coin && k.i === S.tf) { try { S.series.update(bar); } catch (e) { /* older bar */ } }
}

/** Apply the queued price changes: numbers in place every second, heavier parts at most every 2 s. */
function applyLive() {
  if (!S.data || !S.dirty.size) return;
  const dirty = new Set(S.dirty);
  S.dirty.clear();
  let fit = false;
  for (const sym of dirty) {
    const px = price(sym), ch = change(sym), f = S.flash[sym];
    delete S.flash[sym];
    document.querySelectorAll(`[data-px="${sym}"]`).forEach((el) => {
      el.textContent = fmt(px);
      if (f) { el.classList.remove("flash-up", "flash-down"); void el.offsetWidth; el.classList.add("flash-" + f); }
      fit = true;
    });
    if (ch != null) document.querySelectorAll(`[data-chg="${sym}"]`).forEach((el) => {
      el.textContent = sgn(ch) + "%";
      el.classList.toggle("up", ch >= 0);
      el.classList.toggle("down", ch < 0);
    });
    document.querySelectorAll(`[data-dist="${sym}"]`).forEach((el) => {
      const dd = dist(sym), bc = barClass(dd);
      el.innerHTML = `<div class="lbl ${bc}">${dd <= 0 ? `<b>${esc(t("above"))}</b>` : `${esc(t("to_breakout"))} <b>${N(dd.toFixed(1) + "%")}</b>`}</div>
        <div class="bar ${bc}"><i style="width:${(100 * fill(dd)).toFixed(1)}%"></i></div>`;
    });
  }
  const now = Date.now();
  if (now - S.lastSlow >= 2000) {
    const mine = new Set(jLoad().map((x) => x.sym));
    if (S.tab === "signal" && dirty.has(S.coin)) {
      const L = levelsFor(S.coin);
      renderLadder(S.coin, L);
      $("sig-status").textContent = signalSentence(S.coin, L);
      S.lastSlow = now; fit = true;
    }
    if (S.tab === "positions" && [...dirty].some((s) => mine.has(s) || posOf(s))) {
      renderPositions();
      S.lastSlow = now; fit = true;
    }
  }
  if (fit) fitAll();
  if (B.still && bubblesOn()) drawBubbles();                  // reduced motion: no animation loop, redraw on new prices
  if (S.tab === "overview") for (const sym of dirty) heatTile(sym);
}

async function loadNews() {
  try {
    const r = await fetch("news.json?" + Date.now(), { cache: "no-store" });
    if (r.ok) {
      S.news = await r.json();
      S.news.items.sort((a, b) => Date.parse(b.published) - Date.parse(a.published));   // newest first, always
    }
  } catch (e) { /* no news: the tab says so */ }
}

const price = (sym) => (S.live[sym] ? S.live[sym].price : S.bySym[sym].last_close);
const change = (sym) => (S.live[sym] ? S.live[sym].change : null);
const dist = (sym) => 100 * (S.bySym[sym].level / price(sym) - 1);
const fill = (d) => Math.max(0, Math.min(1, 1 - Math.max(d, 0) / 20));
const posOf = (sym) => {
  const ps = S.data.positions.filter((p) => p.symbol === sym);
  return ps.find((p) => p.variant === "B") || ps[0] || null;
};

/** The trade's R if what is left were closed at `px` now (paper.open_r with the HashHedge fee and slippage). */
function liveR(p, px) {
  const { fee, slippage } = S.data.rules;
  const f = px * (1 - slippage);
  return p.booked_r + p.rem * ((f - p.entry - fee * (p.entry + f)) / p.risk) - p.unbooked_r;
}

/* ---------- header ---------- */

function renderHeader() {
  const m = S.data.market;
  const pill = $("market");
  pill.className = "pill " + (m ? m.state : "");
  pill.innerHTML = m
    ? `<span class="dot"></span><span class="word">${esc(t(m.state))}</span>${N(sgn(m.pct, 1) + "%")}`
    : esc(t("nodata"));
  pill.title = m ? `BTC ${fmt(m.btc)} vs 200-day ${fmt(m.sma200)}` : "";
  const u = new Date(S.data.updated), p2 = (n) => String(n).padStart(2, "0");
  const when = `${p2(u.getDate())}.${p2(u.getMonth() + 1)} ${p2(u.getHours())}:${p2(u.getMinutes())}`;
  $("status").innerHTML = WS.ok ? `<span class="dot"></span>${esc(t("live"))}`
    : S.liveOk ? esc(t("polling")) : esc(t("data_at", { t: when }));
  $("lang").textContent = S.lang === "ru" ? "EN" : "RU";
  document.documentElement.lang = S.lang;
  document.querySelectorAll("[data-t]").forEach((el) => { el.textContent = t(el.dataset.t); });
}

/* ---------- Рынок ---------- */

function sparkline(sym) {
  const s = S.bySym[sym];
  const pts = s.closes.slice();
  if (S.live[sym]) pts.push(S.live[sym].price);
  const lo = Math.min(...pts, s.level), hi = Math.max(...pts, s.level);
  const w = 200, h = 34, k = (v) => h - 3 - ((v - lo) / (hi - lo || 1)) * (h - 6);
  const line = pts.map((v, i) => `${((i / (pts.length - 1)) * w).toFixed(1)},${k(v).toFixed(1)}`).join(" ");
  const col = pts[pts.length - 1] >= pts[0] ? "#22d38a" : "#ff5a6a";
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    <polyline points="0,${h} ${line} ${w},${h}" fill="${col}" fill-opacity="0.08" stroke="none"/>
    <line x1="0" x2="${w}" y1="${k(s.level)}" y2="${k(s.level)}" stroke="#4c8dff" stroke-width="1.2" stroke-dasharray="4 4" vector-effect="non-scaling-stroke"/>
    <polyline points="${line}" fill="none" stroke="${col}" stroke-width="1.8" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>`;
}

const barClass = (d) => (d <= S.data.rules.near_pct ? "near" : d <= 10 ? "mid" : "");

function renderMarket() {
  $("search").placeholder = t("search");
  $("near-title").textContent = t("near_title");
  $("near-explain").textContent = t("near_explain");
  const q = S.query.trim().toUpperCase();
  const all = S.data.symbols
    .filter((s) => !q || s.coin.includes(q) || s.symbol.includes(q))
    .map((s) => ({ s, d: dist(s.symbol) }))
    .sort((a, b) => a.d - b.d);
  const rows = q || S.showAll ? all : all.slice(0, TOP_N);       // a search always shows every match
  const more = $("more");
  more.hidden = !!q || all.length <= TOP_N;
  more.textContent = S.showAll ? t("show_top") : t("show_all", { n: all.length });
  $("coins").innerHTML = rows.map(({ s, d }) => {
    const ch = change(s.symbol), pos = posOf(s.symbol), bc = barClass(d);
    const lbl = d <= 0 ? `<b>${esc(t("above"))}</b>` : `${esc(t("to_breakout"))} <b>${N(d.toFixed(1) + "%")}</b>`;
    return `<li class="row" data-sym="${esc(s.symbol)}">
      <div class="l1">${badge(s.symbol, s.coin)}<span class="cname">${esc(s.coin)}</span>
        ${pos ? `<span class="vbadge">${esc(pos.variant)}</span>` : ""}
        ${ch == null ? "" : NL("chg", s.symbol, sgn(ch) + "%", "chg " + cls(ch))}
        ${NL("px", s.symbol, fmt(price(s.symbol)), "price")}</div>
      <div class="l2">${sparkline(s.symbol)}
        <div class="dist" data-dist="${esc(s.symbol)}"><div class="lbl ${bc}">${lbl}</div>
          <div class="bar ${bc}"><i style="width:${(100 * fill(d)).toFixed(1)}%"></i></div></div></div>
    </li>`;
  }).join("");
}



/* ---------- Fear & Greed (alternative.me, CORS open, no key) ---------- */

const FNG_URL = "https://api.alternative.me/fng/?limit=30";

async function loadFng() {
  try {
    const r = await fetch(FNG_URL, { cache: "no-store" });
    if (!r.ok) return;
    const j = await r.json();
    const rows = (j.data || []).map((d) => ({ v: +d.value, c: String(d.value_classification || "").toLowerCase(), ts: +d.timestamp }))
      .filter((d) => d.v >= 0 && d.v <= 100 && d.ts > 0)
      .sort((a, b) => b.ts - a.ts);                            // newest first
    if (rows.length) S.fng = rows;
  } catch (e) { /* blocked or offline: the card stays hidden (or shows the last values) */ }
}

/** The alternative.me bands when the API gives no class: 0-24, 25-46, 47-54, 55-75, 76-100. */
/** The five zones of the dial: 0-24, 25-44, 45-55, 56-75, 76-100 (the label follows the value, as the dial does). */
const FNG_ZONES = [
  { from: 0, to: 25, key: "fng_ef", color: "#ff5a6a" },
  { from: 25, to: 45, key: "fng_f", color: "#ff8f4d" },
  { from: 45, to: 56, key: "fng_n", color: "#f4d04a" },
  { from: 56, to: 76, key: "fng_g", color: "#9ddb5f" },
  { from: 76, to: 101, key: "fng_eg", color: "#22d38a" },
];
const fngZone = (v) => FNG_ZONES.find((z) => v < z.to) || FNG_ZONES[4];
const fngLabel = (d) => t(fngZone(d.v).key);
const fngColor = (v) => fngZone(v).color;

const FNG_STOPS = FNG_ZONES.map((z) => `<stop offset="${Math.min(1, (z.from + z.to) / 200).toFixed(3)}" stop-color="${z.color}"/>`).join("");

/** Half-circle dial: five coloured zones with their names, a needle at the value (rotated by animateNeedle). */
function fngDial(v) {
  const cx = 160, cy = 140, R = 100, r = 74;
  const P = (rad, val) => { const a = Math.PI * (1 - val / 100); return [cx + rad * Math.cos(a), cy - rad * Math.sin(a)]; };
  const f = (n) => n.toFixed(2);
  const here = fngZone(v);
  const zones = FNG_ZONES.map((z) => {
    const v0 = z.from ? z.from + 0.5 : 0, v1 = z.to > 100 ? 100 : z.to - 0.5;           // a small gap between zones
    const [a, b] = [P(R, v0), P(R, v1)], [c, d] = [P(r, v1), P(r, v0)];
    const on = z === here;
    const mid = (z.from + Math.min(100, z.to - 1)) / 2, [lx, ly] = P(R + 12, mid);
    const words = t(z.key).split(" "), anchor = lx < cx - 20 ? "end" : lx > cx + 20 ? "start" : "middle";
    const y0 = ly - (words.length - 1) * 6.5 + (anchor === "middle" ? -2 : 3.5);
    const label = words.map((w, i) => `<tspan x="${f(lx)}" y="${f(y0 + i * 13)}">${esc(w)}</tspan>`).join("");
    return `<path d="M${f(a[0])} ${f(a[1])} A${R} ${R} 0 0 1 ${f(b[0])} ${f(b[1])} L${f(c[0])} ${f(c[1])} A${r} ${r} 0 0 0 ${f(d[0])} ${f(d[1])}Z"
        fill="${z.color}" fill-opacity="${on ? 1 : 0.32}"/>
      <text text-anchor="${anchor}" font-size="11.5" font-weight="${on ? 800 : 600}" fill="${on ? z.color : "#9aa6bd"}">${label}</text>`;
  }).join("");
  const ticks = [0, 25, 45, 56, 76, 100].map((x) => { const [a, b] = [P(r - 3, x), P(r - 8, x)];
    return `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="rgba(255,255,255,0.25)" stroke-width="1.2"/>`; }).join("");
  return `<svg viewBox="0 0 320 152" role="img" aria-hidden="true" font-family="Manrope, system-ui, sans-serif">
    ${zones}${ticks}
    <g id="fng-needle" transform="rotate(0 ${cx} ${cy})">
      <path d="M${cx - 92} ${cy} L${cx} ${cy - 5.5} L${cx + 14} ${cy} L${cx} ${cy + 5.5}Z" fill="#f2f5fb"/>
    </g>
    <circle cx="${cx}" cy="${cy}" r="9" fill="#f2f5fb"/><circle cx="${cx}" cy="${cy}" r="4.5" fill="${here.color}"/>
  </svg>`;
}

/** Swing the needle from 0 to the value (once per page load), or set it straight away under reduced motion. */
function animateNeedle(v) {
  const g = document.getElementById("fng-needle");
  if (!g) return;
  const set = (x) => g.setAttribute("transform", `rotate(${(1.8 * x).toFixed(2)} 160 140)`);
  if (S.fngSwung || reducedMotion()) { set(v); S.fngSwung = true; return; }
  S.fngSwung = true;
  const t0 = performance.now(), dur = 1300;
  const ease = (p) => { const c = 1.5; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };   // overshoot, settle
  const tick = (now) => {
    if (!g.isConnected) return;
    const p = Math.min(1, (now - t0) / dur);
    set(Math.max(0, Math.min(100, v * ease(p))));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function fngSpark(rows) {
  const pts = rows.slice().reverse(), n = pts.length;
  const xy = pts.map((d, i) => [n > 1 ? (300 * i) / (n - 1) : 150, 32 - (30 * d.v) / 100]);
  const line = xy.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return `<svg class="fng-spark" viewBox="0 0 300 34" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="fngS" x1="0" y1="32" x2="0" y2="2" gradientUnits="userSpaceOnUse">${FNG_STOPS}</linearGradient></defs>
    <polyline points="${line}" fill="none" stroke="url(#fngS)" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
  </svg>`;
}

function fngChart(rows) {
  const pts = rows.slice().reverse(), n = pts.length;
  const L = 24, R = 312, T = 8, Bm = 128;
  const X = (i) => (n > 1 ? L + ((R - L) * i) / (n - 1) : (L + R) / 2), Y = (v) => Bm - ((Bm - T) * v) / 100;
  const day = (ts) => new Date(ts * 1000).toLocaleDateString(S.lang === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "short", timeZone: "UTC" });
  const grid = [0, 25, 50, 75, 100].map((v) => `<line x1="${L}" x2="${R}" y1="${Y(v)}" y2="${Y(v)}" stroke="rgba(255,255,255,0.08)"/>
    <text x="${L - 6}" y="${Y(v) + 3.5}" text-anchor="end" font-size="10" fill="#9aa6bd">${v}</text>`).join("");
  const line = pts.map((d, i) => `${X(i).toFixed(1)},${Y(d.v).toFixed(1)}`).join(" ");
  const dots = pts.map((d, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(d.v).toFixed(1)}" r="${i === n - 1 ? 4.5 : 2.2}" fill="${fngColor(d.v)}"/>`).join("");
  const ticks = [0, Math.floor((n - 1) / 2), n - 1].filter((v, i, a) => a.indexOf(v) === i)
    .map((i, k, a) => `<text x="${X(i).toFixed(1)}" y="146" font-size="10" fill="#9aa6bd" text-anchor="${k === 0 && a.length > 1 ? "start" : k === a.length - 1 && a.length > 1 ? "end" : "middle"}">${esc(day(pts[i].ts))}</text>`).join("");
  const last = pts[n - 1];
  return `<div class="fng-full"><p class="cap">${esc(t("fng_30"))}</p>
    <svg viewBox="0 0 320 150" role="img" aria-label="${esc(t("fng_30"))}" font-family="Manrope, system-ui, sans-serif">
    <defs><linearGradient id="fngL" x1="0" y1="${Bm}" x2="0" y2="${T}" gradientUnits="userSpaceOnUse">${FNG_STOPS}</linearGradient></defs>
    ${grid}<polyline points="${line}" fill="none" stroke="url(#fngL)" stroke-width="2.2" stroke-linejoin="round"/>${dots}
    <text x="${Math.min(R, X(n - 1)).toFixed(1)}" y="${(Y(last.v) - 9).toFixed(1)}" text-anchor="end" font-size="12" font-weight="800" fill="${fngColor(last.v)}">${last.v}</text>
    ${ticks}</svg></div>`;
}

function renderFng() {
  const card = $("fng"), rows = S.fng;
  card.hidden = $("fng-attr").hidden = !rows;
  if (!rows) return;
  const now = rows[0], yd = rows[1], wk = rows[7];
  const key = [S.lang, rows.length, now.ts, now.v, yd && yd.v, wk && wk.v, !!S.fngOpen].join("|");
  if (key === S.fngKey) return;                               // unchanged: keep the DOM (and a running needle swing)
  S.fngKey = key;
  const kv = (k, d) => (d ? `<div class="fng-kv"><span class="k">${esc(t(k))}</span>
    <span class="v"><i style="background:${fngColor(d.v)}"></i>${d.v}</span><span class="c">${esc(fngLabel(d))}</span></div>` : "");
  card.setAttribute("aria-expanded", String(!!S.fngOpen));
  card.setAttribute("aria-label", `${t("fng_title")}: ${now.v}, ${fngLabel(now)}`);
  card.innerHTML = `<div class="fng-top"><span class="fng-title">${esc(t("fng_title"))}</span><span class="fng-chev">▼</span></div>
    <div class="fng-dial">${fngDial(now.v)}</div>
    <div class="fng-read"><div class="fng-val" style="color:${fngColor(now.v)}">${now.v}</div>
      <div class="fng-label" style="color:${fngColor(now.v)}">${esc(fngLabel(now))}</div></div>
    <div class="fng-hist">${kv("fng_yday", yd)}${kv("fng_week", wk)}</div>
    ${S.fngOpen ? fngChart(rows) : fngSpark(rows)}`;
  animateNeedle(now.v);
}


/* ---------- Overview: Fear & Greed, heatmap (treemap of the 75 coins), bubbles button ---------- */

const H = { w: 0, h: 0, rects: {} };

function renderOverview() {
  renderFng();
  renderHeat();
}

/** Squarified treemap: items [{a}] sorted by area (desc), laid out in the rectangle x, y, w, h. */
function squarify(items, x, y, w, h) {
  const out = [];
  const worst = (sum, min, max, side) => Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min));
  let i = 0;
  while (i < items.length && w > 0.5 && h > 0.5) {
    const side = Math.min(w, h);
    let j = i + 1, sum = items[i].a, max = items[i].a, min = items[i].a, best = worst(sum, min, max, side);
    while (j < items.length) {
      const a = items[j].a, s2 = sum + a, w2 = worst(s2, Math.min(min, a), Math.max(max, a), side);
      if (w2 > best) break;
      sum = s2; min = Math.min(min, a); max = Math.max(max, a); best = w2; j++;
    }
    const thick = sum / side;
    let off = 0;
    for (let k = i; k < j; k++) {
      const len = items[k].a / thick;
      out.push(w >= h ? { it: items[k], x, y: y + off, w: thick, h: len } : { it: items[k], x: x + off, y, w: len, h: thick });
      off += len;
    }
    if (w >= h) { x += thick; w -= thick; } else { y += thick; h -= thick; }
    i = j;
  }
  return out;
}

/** Tile colour: from the card colour towards green / red, stronger for bigger moves (full at the period's scale). */
function heatColor(ch) {
  if (ch == null) return "rgb(38,48,74)";
  const a = 0.18 + 0.82 * Math.min(1, Math.abs(ch) / PERIOD_SCALE[B.period]);
  const base = [31, 42, 71], to = ch >= 0 ? [22, 170, 108] : [214, 64, 82];
  return "rgb(" + base.map((v, i) => Math.round(v + (to[i] - v) * a)).join(",") + ")";
}

const pctText = (ch) => (ch == null ? "—" : (ch >= 0 ? "+" : "−") + Math.abs(ch).toFixed(Math.abs(ch) < 10 ? 2 : 1) + "%");

/** Lay out the 75 tiles (area = 24h quote volume) and draw them. */
function renderHeat() {
  if (!S.data) return;
  const box = $("heat");
  const pl = { "1h": "1H", "24h": "24H", "7d": "7D" }[B.period];
  const waiting = B.period !== "24h" && !Object.keys(B.base[B.period]).length;
  $("heat-hint").textContent = waiting ? t("heat_loading", { p: pl }) : t("heat_hint", { p: pl });
  document.querySelectorAll(".period-seg button").forEach((x) => x.classList.toggle("on", x.dataset.p === B.period));
  if (B.period !== "24h") loadPeriod(B.period);
  const w = box.clientWidth;
  if (!w) return;
  const h = Math.round(Math.min(560, Math.max(340, w * 1.25)));
  box.style.height = h + "px";
  const syms = S.data.symbols.map((s) => s.symbol);
  const vols = syms.map((s) => (S.live[s] && S.live[s].qv > 0 ? S.live[s].qv : 0));
  const known = vols.filter((v) => v > 0).sort((a, b) => a - b);
  const med = known.length ? known[known.length >> 1] : 1;
  const items = syms.map((s, i) => ({ sym: s, v: vols[i] > 0 ? vols[i] : med }));
  const total = items.reduce((a, x) => a + x.v, 0);
  // inner size: the box has a 1px border
  const iw = w - 2, ih = h - 2;
  items.forEach((x) => { x.a = (x.v / total) * iw * ih; });
  items.sort((a, b) => b.a - a.a);
  H.w = w; H.h = h; H.rects = {};
  box.innerHTML = squarify(items, 0, 0, iw, ih).map((r) => {
    const sym = r.it.sym;
    H.rects[sym] = r;
    return `<div class="ht" role="listitem" data-sym="${esc(sym)}" style="left:${r.x.toFixed(2)}px;top:${r.y.toFixed(2)}px;width:${r.w.toFixed(2)}px;height:${r.h.toFixed(2)}px"></div>`;
  }).join("");
  for (const sym of syms) heatTile(sym);
}

/** Colour and text of one tile (called on every live price change of that coin). */
function heatTile(sym) {
  const r = H.rects[sym];
  if (!r) return;
  const el = $("heat").querySelector(`.ht[data-sym="${sym}"]`);
  if (!el) return;
  const coin = S.bySym[sym].coin, ch = bubbleChange(sym);
  el.style.backgroundColor = heatColor(ch);
  const pct = pctText(ch);
  el.setAttribute("aria-label", `${coin} ${pct}`);
  // name size: limited by the tile width (≈0.66 em per letter) and height
  const fs = Math.min(26, (r.w - 6) / (coin.length * 0.66), r.h * 0.36);
  if (fs < 8 || r.h < 13) { if (el.innerHTML) el.innerHTML = ""; return; }
  const ps = Math.max(8, Math.min(fs * 0.78, (r.w - 6) / (pct.length * 0.6)));
  const both = r.h >= fs * 1.15 + ps * 1.25 + 4 && ps >= 8 && (r.w - 6) >= pct.length * 0.6 * 8;
  const html = `<b style="font-size:${fs.toFixed(1)}px">${esc(coin)}</b>${both ? `<span style="font-size:${ps.toFixed(1)}px">${pct}</span>` : ""}`;
  if (el.innerHTML !== html) el.innerHTML = html;
}

/* ---------- bubbles: one circle per coin, size = 24h quote volume, colour = change over the chosen period ---------- */

const B = {
  open: false,
  period: ["1h", "24h", "7d"].includes(storeGet("meller_bubble_period")) ? storeGet("meller_bubble_period") : "24h",
  nodes: [], bySym: {}, raf: 0, w: 0, h: 0, dpr: 1, last: 0, lastRadii: 0,
  base: { "1h": {}, "7d": {} }, at: { "1h": 0, "7d": 0 }, loading: { "1h": false, "7d": false },
  still: false,
};
const PERIOD_SCALE = { "1h": 3, "24h": 10, "7d": 25 };        // |change| at which the colour is at full strength
const reducedMotion = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
const bubblesOn = () => !!S.data && S.tab === "overview" && B.open && !document.hidden;

function openBubbles() {
  if (!S.data) return;
  B.open = true;
  $("bubble-view").hidden = false;
  document.body.classList.add("noscroll");
  syncView();
  $("bubble-close").focus({ preventScroll: true });
}

function closeBubbles() {
  if (!B.open) return;
  B.open = false;
  stopBubbles();
  $("bubble-view").hidden = true;
  document.body.classList.remove("noscroll");
}

function syncView() {
  const bub = B.open;
  $("bubble-close").setAttribute("aria-label", t("close"));
  document.querySelectorAll(".period-seg button").forEach((b) => b.classList.toggle("on", b.dataset.p === B.period));
  const pl = { "1h": "1H", "24h": "24H", "7d": "7D" }[B.period];
  const waiting = B.period !== "24h" && !Object.keys(B.base[B.period]).length;
  $("bubble-hint").innerHTML = waiting ? esc(t("bubble_loading", { p: pl }))
    : t("bubble_hint", { p: pl, n: S.data ? S.data.rules.near_pct : 3 });
  $("bubbles").setAttribute("aria-label", t("bubble_aria"));
  if (bub && bubblesOn()) startBubbles(); else stopBubbles();
}

/** Price change of a coin over the chosen period (null: no data). 1H and 7D compare the live price with a kline close. */
function bubbleChange(sym) {
  if (B.period === "24h") return change(sym);
  const base = B.base[B.period][sym];
  return base > 0 ? 100 * (price(sym) / base - 1) : null;
}

/** 1H / 7D: the close 60 one-minute candles / 168 hourly candles ago for every coin, at most once a minute. */
async function loadPeriod(p) {
  if (p === "24h" || B.loading[p] || Date.now() - B.at[p] < 60 * 1000) return;
  B.loading[p] = true;
  B.at[p] = Date.now();
  const host = S.host || "https://data-api.binance.vision";
  const [iv, lim] = p === "1h" ? ["1m", 61] : ["1h", 169];
  const out = {};
  if (p === "7d") {                                            // coins without Binance spot: daily closes from data.json
    for (const s of S.data.symbols) {
      const c = s.closes || [];
      if (c.length >= 7) out[s.symbol] = c[c.length - 7];
    }
  }
  const queue = S.liveOk ? S.data.symbols.map((s) => s.symbol).filter(hasSpot) : [];
  const worker = async () => {
    while (queue.length) {
      const sym = queue.shift();
      try {
        const r = await fetch(`${host}/api/v3/klines?symbol=${sym}&interval=${iv}&limit=${lim}`);
        if (!r.ok) continue;
        const k = await r.json();
        if (k.length >= lim - 1) out[sym] = +k[0][4];
      } catch (e) { /* this coin stays grey until the next refresh */ }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  B.base[p] = Object.assign(B.base[p], out);
  B.loading[p] = false;
  if (B.open) { syncView(); if (B.still) drawBubbles(); }
  if (S.tab === "overview") renderHeat();
}

/** Box size: whatever the full-screen overlay leaves under its header (CSS flex). */
function sizeBubbles() {
  const box = $("bubble-box"), cv = $("bubbles");
  const w = Math.round(box.clientWidth);
  const h = Math.max(200, Math.round(box.clientHeight));
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  if (w === B.w && h === B.h && dpr === B.dpr) return false;
  const sx = B.w ? w / B.w : 1, sy = B.h ? h / B.h : 1;
  for (const n of B.nodes) { n.x *= sx; n.y *= sy; }
  B.w = w; B.h = h; B.dpr = dpr;
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  return true;
}

/** Radius ∝ √(24h quote volume), scaled so the bubbles cover about half the box, within a min and max size. */
function targetRadii() {
  const syms = S.data.symbols.map((s) => s.symbol);
  const vols = syms.map((s) => (S.live[s] && S.live[s].qv > 0 ? S.live[s].qv : 0));
  const known = vols.filter((v) => v > 0).sort((a, b) => a - b);
  const med = known.length ? known[known.length >> 1] : 1;
  const root = vols.map((v) => Math.sqrt(v > 0 ? v : med));
  const side = Math.min(B.w, B.h);
  // the minimum shrinks on short screens so the smallest bubbles cover at most ~28% of the box and sizes still differ
  const rmin = Math.max(11, Math.min(Math.max(15, 0.045 * side), Math.sqrt(0.28 * B.w * B.h / (Math.PI * syms.length))));
  const rmax = Math.max(rmin, 0.2 * side);
  const area = (k) => root.reduce((a, q) => a + Math.PI * Math.min(rmax, Math.max(rmin, k * q)) ** 2, 0);
  const goal = 0.5 * B.w * B.h;
  let lo = 0, hi = 1;
  while (area(hi) < goal && hi < 1e9) hi *= 2;
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (area(m) < goal) lo = m; else hi = m; }
  syms.forEach((s, i) => {
    let n = B.bySym[s];
    if (!n) {
      n = B.bySym[s] = { sym: s, coin: S.bySym[s].coin, x: B.w * (0.1 + 0.8 * Math.random()), y: B.h * (0.1 + 0.8 * Math.random()),
        vx: 0, vy: 0, r: rmin };
      B.nodes.push(n);
    }
    n.tr = Math.min(rmax, Math.max(rmin, lo * root[i]));
  });
  B.lastRadii = Date.now();
}

/** One physics step (dt in 60 Hz frames): drift, push overlapping bubbles apart, stay inside the box. */
function stepBubbles(dt, drift) {
  const ns = B.nodes, cx = B.w / 2, cy = B.h / 2;
  for (const n of ns) {
    n.r += (n.tr - n.r) * Math.min(1, 0.08 * dt);
    if (drift) { n.vx += (Math.random() - 0.5) * 0.03 * dt; n.vy += (Math.random() - 0.5) * 0.03 * dt; }
    n.vx += (cx - n.x) * 0.00002 * dt; n.vy += (cy - n.y) * 0.00002 * dt;
  }
  for (let i = 0; i < ns.length; i++) {
    const a = ns[i];
    for (let j = i + 1; j < ns.length; j++) {
      const b = ns[j];
      let dx = b.x - a.x, dy = b.y - a.y;
      const min = a.r + b.r + 2;
      if (Math.abs(dx) >= min || Math.abs(dy) >= min) continue;
      let d = Math.hypot(dx, dy);
      if (d >= min) continue;
      if (d < 0.01) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d = Math.hypot(dx, dy); }
      const push = (min - d) / d * 0.5, wa = b.r / (a.r + b.r), wb = a.r / (a.r + b.r);   // the smaller one moves more
      a.x -= dx * push * wa; a.y -= dy * push * wa;
      b.x += dx * push * wb; b.y += dy * push * wb;
      a.vx -= dx / d * 0.02 * wa; a.vy -= dy / d * 0.02 * wa;
      b.vx += dx / d * 0.02 * wb; b.vy += dy / d * 0.02 * wb;
    }
  }
  const damp = Math.pow(0.94, dt);
  for (const n of ns) {
    n.vx *= damp; n.vy *= damp;
    const v = Math.hypot(n.vx, n.vy);
    if (v > 0.5) { n.vx *= 0.5 / v; n.vy *= 0.5 / v; }
    n.x += n.vx * dt; n.y += n.vy * dt;
    const r = Math.min(n.r, B.w / 2, B.h / 2);
    if (n.x < r) { n.x = r; n.vx = Math.abs(n.vx); } else if (n.x > B.w - r) { n.x = B.w - r; n.vx = -Math.abs(n.vx); }
    if (n.y < r) { n.y = r; n.vy = Math.abs(n.vy); } else if (n.y > B.h - r) { n.y = B.h - r; n.vy = -Math.abs(n.vy); }
  }
}

function drawBubbles() {
  const cv = $("bubbles"), ctx = cv.getContext("2d");
  ctx.setTransform(B.dpr, 0, 0, B.dpr, 0, 0);
  ctx.clearRect(0, 0, B.w, B.h);
  const scale = PERIOD_SCALE[B.period], near = S.data.rules.near_pct;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const n of B.nodes) {
    const ch = bubbleChange(n.sym);
    const a = ch == null ? 0 : Math.min(1, Math.abs(ch) / scale);
    const rgb = ch == null ? "154,166,189" : ch >= 0 ? "34,211,138" : "255,90,106";
    const g = ctx.createRadialGradient(n.x - n.r * 0.3, n.y - n.r * 0.35, n.r * 0.1, n.x, n.y, n.r);
    g.addColorStop(0, `rgba(${rgb},${(0.16 + 0.5 * a).toFixed(3)})`);
    g.addColorStop(1, `rgba(${rgb},${(0.06 + 0.22 * a).toFixed(3)})`);
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, 2 * Math.PI);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = `rgba(${rgb},${(0.3 + 0.6 * a).toFixed(3)})`;
    ctx.stroke();
    if (dist(n.sym) <= near) {                                 // close to its breakout level
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + 3, 0, 2 * Math.PI);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#f5b942";
      ctx.stroke();
    }
    const showPct = ch != null && n.r >= 20;
    let fs = Math.max(9, Math.min(20, n.r * (showPct ? 0.4 : 0.5)));
    ctx.font = `800 ${fs}px Manrope, system-ui, sans-serif`;
    const w = ctx.measureText(n.coin).width;
    if (w > 1.6 * n.r) { fs = Math.max(7, fs * 1.6 * n.r / w); ctx.font = `800 ${fs}px Manrope, system-ui, sans-serif`; }
    ctx.fillStyle = "#f2f5fb";
    ctx.fillText(n.coin, n.x, showPct ? n.y - fs * 0.45 : n.y);
    if (showPct) {
      const ps = Math.max(8, fs * 0.8);
      ctx.font = `700 ${ps}px Manrope, system-ui, sans-serif`;
      ctx.fillStyle = "rgba(242,245,251,0.85)";
      ctx.fillText((ch >= 0 ? "+" : "−") + Math.abs(ch).toFixed(Math.abs(ch) < 10 ? 1 : 0) + "%", n.x, n.y + fs * 0.65);
    }
  }
}

function bubbleFrame(ts) {
  B.raf = 0;
  if (!bubblesOn()) return;
  const dt = B.last ? Math.min(3, (ts - B.last) / (1000 / 60)) : 1;
  B.last = ts;
  if (Date.now() - B.lastRadii > 5000) targetRadii();         // volumes move: re-size every few seconds
  stepBubbles(dt, true);
  drawBubbles();
  B.raf = requestAnimationFrame(bubbleFrame);
}

/** Start (or refresh) the bubbles: size the canvas, set the radii, load the period's data, run or draw once. */
function startBubbles(resized) {
  const changed = sizeBubbles();
  const fresh = !B.nodes.length;
  targetRadii();
  if (fresh || changed || resized) for (let i = 0; i < 120; i++) stepBubbles(1, false);   // settle before the first frame
  loadPeriod(B.period);
  B.still = reducedMotion();
  if (B.still) {
    if (B.raf) { cancelAnimationFrame(B.raf); B.raf = 0; }
    for (let i = 0; i < 60; i++) stepBubbles(1, false);
    for (const n of B.nodes) { n.r = n.tr; n.vx = n.vy = 0; }
    drawBubbles();
    return;
  }
  drawBubbles();
  if (!B.raf) { B.last = 0; B.raf = requestAnimationFrame(bubbleFrame); }
}

function stopBubbles() {
  if (B.raf) cancelAnimationFrame(B.raf);
  B.raf = 0;
}
setInterval(() => {                                          // 1H / 7D bases once a minute; the heatmap re-lays out with new volumes
  if (!S.data || document.hidden || S.tab !== "overview") return;
  loadPeriod(B.period);
  renderHeat();
}, 60 * 1000);

/* ---------- Сигнал ---------- */

function levelsFor(sym) {
  const s = S.bySym[sym], p = posOf(sym), r = S.data.rules;
  if (p) {
    const tp = p.tp.length ? p.tp : [p.entry + r.tp_r[0] * p.risk, p.entry + r.tp_r[1] * p.risk];
    return { open: true, p, entry: p.entry, stop: p.stop, tp1: tp[0], tp2: tp[1] };
  }
  // above the level: the plan if today closes here (entry = the current price); below it: entry at the level
  const above = price(sym) > s.level;
  const entry = above ? price(sym) : s.level, stop = entry - r.stop_atr * s.atr, risk = entry - stop;
  return { open: false, above, entry, stop, tp1: entry + r.tp_r[0] * risk, tp2: entry + r.tp_r[1] * risk };
}

/** Today's daily candle so far (UTC): the newest Binance kline if it is today's, else the export's; widened by the
    live price (the klines are cached for up to 5 minutes). null if unknown. */
function todayBar(sym) {
  const day0 = Math.floor(Date.now() / 86400000) * 86400, p = price(sym);
  const k = S.klines[sym];
  let bar = null;
  if (k && k.rows.length && k.rows[k.rows.length - 1].time === day0) bar = k.rows[k.rows.length - 1];
  const td = S.bySym[sym].today;
  if (!bar && td && td[0] === new Date(day0 * 1000).toISOString().slice(0, 10)) bar = { high: td[2], low: td[3] };
  return bar ? { high: Math.max(bar.high, p), low: Math.min(bar.low, p) } : null;
}

/** Today's candle so far in filtered ATRs vs the 2 ATR filter: { x, lim, skip }, or null if unknown. */
function candleFilter(sym) {
  const bar = todayBar(sym), atr = S.bySym[sym].atr, lim = S.data.rules.skip_range_atr || 2;
  if (!bar || !atr) return null;
  const x = (bar.high - bar.low) / atr;
  return { x, lim, skip: x > lim };
}

/** The 2 ATR candle filter line under the plan: what B does if the day closes above the level now. */
function filterStatus(sym) {
  const c = candleFilter(sym);
  if (!c) return "";
  return `<div class="fstat ${c.skip ? "bad" : "ok"}">${esc(t(c.skip ? "f_skip" : "f_ok", { x: c.x.toFixed(1), f: c.lim }))}</div>`;
}

/** The sentence under the take-profit boxes; above the level it follows the candle filter. */
function signalSentence(sym, L) {
  const s = S.bySym[sym];
  if (L.open) return t("in_pos", { v: L.p.variant, date: L.p.entry_date, r: sgn(liveR(L.p, price(sym))) + "R", stop: fmt(L.p.stop) });
  if (L.above) {
    const c = candleFilter(sym);
    return c && c.skip ? t("above_skip", { lvl: fmt(s.level), x: c.x.toFixed(1) }) : t("above_now", { lvl: fmt(s.level) });
  }
  return t("wait", { lvl: fmt(s.level), d: dist(sym).toFixed(1) });
}

function renderHero(sym, L) {
  const s = S.bySym[sym], ch = change(sym);
  const opts = S.data.symbols.slice().sort((a, b) => a.coin.localeCompare(b.coin))
    .map((x) => `<option value="${esc(x.symbol)}"${x.symbol === sym ? " selected" : ""}>${esc(x.coin)}</option>`).join("");
  $("sig-hero").innerHTML = `
    <div class="hero-top">${badge(sym, s.coin, "lg")}
      <label class="picker"><span class="cname">${esc(s.coin)}</span><span class="chev">▾</span>
        <select id="coin-select" aria-label="Coin">${opts}</select></label>
      <span class="schip ${L.open ? "long" : "wait"}">${esc(L.open ? t("chip_long") : t("chip_wait"))}</span></div>
    <div class="hero-price">${NL("px", sym, fmt(price(sym)), "big")}${ch == null ? "" : NL("chg", sym, sgn(ch) + "%", "chg " + cls(ch))}</div>`;
  $("coin-select").addEventListener("change", (e) => { S.coin = e.target.value; renderSignal(); });
}

/** Vertical ladder: TP2, TP1, entry, the current price, stop at true scale; the label rows are pushed apart. */
function renderLadder(sym, L) {
  const now = price(sym), H = 330, PAD = 22, GAP = 46;
  const items = [
    { k: "tp2", name: "TP2", p: L.tp2, col: "#22d38a" },
    { k: "tp1", name: "TP1", p: L.tp1, col: "#22d38a" },
    { k: "entry", name: t("entry"), p: L.entry, col: "#f2f5fb" },
    { k: "now", name: t("now"), p: now, col: "#4c8dff" },
    { k: "stop", name: t("stop"), p: L.stop, col: "#ff5a6a" },
  ].sort((a, b) => b.p - a.p);
  const hi = Math.max(...items.map((i) => i.p)), lo = Math.min(...items.map((i) => i.p));
  const y = (p) => PAD + ((hi - p) / (hi - lo || 1)) * (H - 2 * PAD);
  items.forEach((i) => { i.y = y(i.p); i.ly = i.y; });
  for (let n = 1; n < items.length; n++) items[n].ly = Math.max(items[n].ly, items[n - 1].ly + GAP);
  items[items.length - 1].ly = Math.min(items[items.length - 1].ly, H - PAD);
  for (let n = items.length - 2; n >= 0; n--) items[n].ly = Math.min(items[n].ly, items[n + 1].ly - GAP);
  items[0].ly = Math.max(items[0].ly, PAD);
  for (let n = 1; n < items.length; n++) items[n].ly = Math.max(items[n].ly, items[n - 1].ly + GAP);
  const yE = y(L.entry), rr = (L.tp2 - L.entry) / (L.entry - L.stop);
  const note = L.open ? t("pos_note", { v: L.p.variant, date: L.p.entry_date }) : t(L.above ? "plan_close" : "plan");
  $("ladder").innerHTML = `
    <div class="lad-head"><span class="tag long">LONG · 1D · R:R 1:${rr.toFixed(1)}</span><span class="tag note">${esc(note)}</span></div>
    ${!L.open && L.above ? filterStatus(sym) : ""}
    <div class="ladder">
      <div class="track"></div>
      <div class="zone g" style="top:${y(L.tp2).toFixed(1)}px;height:${(yE - y(L.tp2)).toFixed(1)}px"></div>
      <div class="zone r" style="top:${yE.toFixed(1)}px;height:${(y(L.stop) - yE).toFixed(1)}px"></div>
      <svg class="links" viewBox="0 0 46 ${H}" preserveAspectRatio="none">${items.map((i) =>
        `<path d="M14 ${i.y.toFixed(1)} C30 ${i.y.toFixed(1)} 30 ${i.ly.toFixed(1)} 46 ${i.ly.toFixed(1)}" stroke="${i.col}" stroke-opacity="0.6" fill="none" stroke-width="1.2"/>`).join("")}</svg>
      ${items.map((i) => `<div class="dot" style="top:${i.y.toFixed(1)}px;background:${i.col}${i.k === "now" ? ";box-shadow:0 0 0 4px rgba(76,141,255,.25)" : ""}"></div>`).join("")}
      ${items.map((i) => {
        const pc = 100 * (i.p / now - 1);
        return `<div class="lrow ${i.k === "now" ? "now" : ""}" style="top:${i.ly.toFixed(1)}px">
          <span class="name">${esc(i.name)}</span>${N(fmt(i.p), "lp")}
          ${i.k === "now" ? `<span class="lpc"></span>` : N(sgn(pc) + "%", "lpc " + cls(pc))}</div>`;
      }).join("")}
    </div>`;
}

function renderTps(L) {
  const pc = (x) => 100 * (x / L.entry - 1);
  const p1 = fmt(L.tp1), p2 = fmt(L.tp2);
  $("tps").classList.toggle("stack", Math.max(p1.length, p2.length) > 9);   // long tiny-coin prices: one per row
  $("tps").innerHTML = `
    <div class="tp"><div class="k">${esc(t("take"))} 1</div>${N(sgn(pc(L.tp1)) + "%", "v")} ${N(p1, "p")}</div>
    <div class="tp"><div class="k">${esc(t("take"))} 2</div>${N(sgn(pc(L.tp2)) + "%", "v")} ${N(p2, "p")}</div>
    <div class="tp trail"><div class="k">${esc(t("take"))} 3</div><span class="v">${esc(t("trailing"))}</span></div>`;
}

/** The timeframe switch above the chart; 15m / 1H / 4H only for coins with Binance spot data. */
function renderTfs(sym) {
  if (!hasSpot(sym)) S.tf = "1d";
  $("tfs").innerHTML = TFS.filter(([tf]) => tf === "1d" || hasSpot(sym))
    .map(([tf, label]) => `<button type="button" data-tf="${tf}" class="${tf === S.tf ? "on" : ""}">${label}</button>`).join("");
}

async function renderSignal() {
  const sym = S.coin, L = levelsFor(sym), s = S.bySym[sym];
  $("entered-btn").textContent = t("i_entered");
  renderHero(sym, L);
  renderLadder(sym, L);
  renderTps(L);
  renderSigNews(sym);
  fitAll();
  $("sig-status").textContent = signalSentence(sym, L);
  renderTfs(sym);
  const tf = S.tf;
  if (tf === "1d") await loadKlines(sym, "1d");
  else await Promise.all([loadKlines(sym, "1d"), loadKlines(sym, tf)]);   // the daily one feeds the 2 ATR filter
  const rows = await loadKlines(sym, tf);
  wsKline(sym, tf);
  if (S.coin === sym && S.tab === "signal" && !L.open && L.above) {       // today's candle now known
    renderLadder(sym, L);
    $("sig-status").textContent = signalSentence(sym, L);
    fitAll();
  }
  // only while the Signal tab is on screen: a chart built in a hidden tab has no width to size from
  if (S.coin !== sym || S.tf !== tf || S.tab !== "signal" || typeof LightweightCharts === "undefined") return;
  destroyCharts();
  S.chart = LightweightCharts.createChart($("chart"), { ...CHART_THEME(), crosshair: { mode: 0 } });
  const series = S.chart.addCandlestickSeries({
    upColor: "#22d38a", downColor: "#ff5a6a", borderVisible: false, wickUpColor: "#22d38a", wickDownColor: "#ff5a6a",
    priceFormat: { type: "custom", formatter: (p) => fmtNum(p), minMove: 1e-9 },
  });
  series.setData(rows);
  S.series = series;
  const line = (p, color, title, style = 2) => series.createPriceLine({ price: p, color, lineWidth: 2, lineStyle: style, axisLabelVisible: true, title });
  line(s.level, "#4c8dff", t("level"), 1);
  if (L.open) {
    line(L.entry, "#f2f5fb", t("entry"));
    line(L.stop, "#ff5a6a", t("stop"));
    line(L.tp1, "#22d38a", "TP1");
    line(L.tp2, "#22d38a", "TP2");
  }
  S.chart.timeScale().fitContent();
}

/* ---------- my trade journal: on this phone only (localStorage), export / import as JSON ---------- */

const J_KEY = "meller_journal_v1";
const num = (v) => { const x = parseFloat(String(v).replace(",", ".").replace(/[^0-9.\-eE]/g, "")); return isFinite(x) ? x : NaN; };
const usd = (x) => (x < 0 ? "−$" : "+$") + Math.abs(x).toFixed(2);
const today10 = () => new Date().toISOString().slice(0, 10);

function jLoad() {
  try {
    const d = JSON.parse(localStorage.getItem(J_KEY) || "{}");
    return Array.isArray(d.trades) ? d.trades : [];
  } catch (e) { return []; }
}
function jSave(trades) {
  try { localStorage.setItem(J_KEY, JSON.stringify({ version: 1, trades })); return true; } catch (e) { return false; }
}
/** A trade from storage or an import, or null if it is not one. */
function jClean(x) {
  if (!x || typeof x !== "object" || !S.bySym[x.sym]) return null;
  const t = { id: String(x.id || Date.now() + Math.random()).slice(0, 40), sym: x.sym, entry: num(x.entry), stop: num(x.stop),
              tp1: num(x.tp1), tp2: num(x.tp2), size: num(x.size), opened: String(x.opened || "").slice(0, 10), closed: null };
  if (!(t.entry > 0 && t.size > 0 && t.stop > 0 && t.stop < t.entry)) return null;
  if (x.closed && num(x.closed.price) > 0) t.closed = { price: num(x.closed.price), date: String(x.closed.date || "").slice(0, 10) };
  return t;
}
const jR = (t, px) => (px - t.entry) / (t.entry - t.stop);
const jUsd = (t, px) => t.size * (px / t.entry - 1);

function openSheet() {
  const sym = S.coin, L = levelsFor(sym), p = price(sym), f = $("entry-form");
  const stop = L.stop, entry = p;
  const r = entry - stop;
  f.entry.value = fmtNum(entry);
  f.stop.value = fmtNum(stop);
  f.tp1.value = fmtNum(L.open ? L.tp1 : entry + 2 * r);
  f.tp2.value = fmtNum(L.open ? L.tp2 : entry + 4 * r);
  f.size.value = r > 0 ? (50 / r * entry).toFixed(2) : "";
  $("sheet-title").textContent = `${t("i_entered")}: ${S.bySym[sym].coin}`;
  $("sheet-hint").textContent = t("f_hint");
  $("sheet").hidden = false;
}

function saveSheet(e) {
  e.preventDefault();
  const f = $("entry-form");
  const tr = jClean({ id: Date.now().toString(36), sym: S.coin, entry: f.entry.value, stop: f.stop.value, tp1: f.tp1.value,
                      tp2: f.tp2.value, size: f.size.value, opened: today10() });
  if (!tr) { $("sheet-hint").textContent = t("f_bad"); return; }
  jSave(jLoad().concat([tr]));
  $("sheet").hidden = true;
  show("positions");
}

function renderJournal() {
  const all = jLoad().map(jClean).filter(Boolean);
  const open = all.filter((x) => !x.closed), done = all.filter((x) => x.closed).reverse();
  const cards = open.map((x) => {
    const coin = S.bySym[x.sym].coin, px = price(x.sym), r = jR(x, px), pc = 100 * (px / x.entry - 1);
    const bot = posOf(x.sym);
    const br = bot ? liveR(bot, px) : 0;
    const vs = bot ? `<div class="vs"><span></span><span class="h">${esc(t("me"))}</span><span class="h">${esc(t("bot"))}</span>
        <span class="k">${esc(t("entry"))}</span>${N(fmt(x.entry))}${N(fmt(bot.entry))}
        <span class="k">${esc(t("result"))}</span>${N(sgn(r) + "R", cls(r))}${N(sgn(br) + "R", cls(br))}</div>` : "";
    return `<div class="card jcard">
      <div class="phead">${badge(x.sym, coin)}<span class="cname">${esc(coin)}</span><span class="since">${esc(t("opened", { d: x.opened }))}</span></div>
      <div class="pnl">${N(sgn(r) + "R", "r " + cls(r))}${N(sgn(pc) + "%", "usd " + cls(pc))}${N(usd(jUsd(x, px)), "usd " + cls(pc))}</div>
      <div class="kv">
        <span class="k">${esc(t("entry"))}</span><span class="v">${N(fmt(x.entry))}</span>
        <span class="k">${esc(t("now"))}</span><span class="v">${N(fmt(px))}</span>
        <span class="k">${esc(t("stop"))}</span><span class="v">${N(fmt(x.stop), "down")} ${N(sgn(100 * (x.stop / px - 1), 1) + "%", "down")}</span>
        ${x.tp1 > 0 ? `<span class="k">TP1</span><span class="v">${N(fmt(x.tp1), "up")} ${N(sgn(100 * (x.tp1 / px - 1), 1) + "%", "up")}</span>` : ""}
        ${x.tp2 > 0 ? `<span class="k">TP2</span><span class="v">${N(fmt(x.tp2), "up")}</span>` : ""}
        <span class="k">${esc(t("size"))}</span><span class="v">${N("$" + x.size.toFixed(2))}</span>
      </div>${vs}
      <div class="jbtns"><button type="button" class="ghost-btn" data-close="${esc(x.id)}">${esc(t("closed_btn"))}</button>
        <button type="button" class="ghost-btn danger" data-del="${esc(x.id)}">${esc(t("delete_btn"))}</button></div>
    </div>`;
  }).join("");
  const rs = done.map((x) => jR(x, x.closed.price)), us = done.map((x) => jUsd(x, x.closed.price));
  const tr = rs.reduce((a, b) => a + b, 0), tu = us.reduce((a, b) => a + b, 0);
  const summary = done.length ? t("summary", { n: done.length, w: Math.round(100 * rs.filter((v) => v > 0).length / done.length),
                                               r: sgn(tr) + "R", u: usd(tu) }) : "";
  const hist = done.map((x, i) => `<li class="card">${badge(x.sym, S.bySym[x.sym].coin)}
      <div class="what"><div class="act">${esc(S.bySym[x.sym].coin)} ${N(fmt(x.entry))} → ${N(fmt(x.closed.price))}</div>
        <div class="when">${esc(x.opened)} … ${esc(x.closed.date)}</div></div>
      <div class="hres">${N(sgn(rs[i]) + "R", "res " + cls(rs[i]))}${N(usd(us[i]), "when " + cls(us[i]))}</div></li>`).join("");
  $("journal").innerHTML = `
    <div class="jhead"><h2 class="h2">${esc(t("my_trades"))}</h2>
      <div class="jio"><button type="button" class="ghost-btn" id="j-export">${esc(t("export_btn"))}</button>
        <button type="button" class="ghost-btn" id="j-import">${esc(t("import_btn"))}</button></div></div>
    ${cards || `<div class="card empty small">${esc(t("my_none"))}</div>`}
    ${done.length ? `<h2 class="h2">${esc(t("history_t"))}</h2><p class="jsum">${N(esc(summary))}</p><ul class="history">${hist}</ul>` : ""}`;
  $("bot-pos-title").textContent = t("bot_positions");
}

function jAction(e) {
  const c = e.target.closest("[data-close],[data-del],#j-export,#j-import");
  if (!c) return;
  const all = jLoad();
  if (c.id === "j-export") {
    const blob = new Blob([JSON.stringify({ version: 1, app: "meller-bot", exported: new Date().toISOString(), trades: all }, null, 1)],
                          { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `meller-journal-${today10()}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    return;
  }
  if (c.id === "j-import") { $("import-file").click(); return; }
  const id = c.dataset.close || c.dataset.del, x = all.find((y) => String(y.id) === id);
  if (!x) return;
  const coin = (S.bySym[x.sym] || {}).coin || x.sym;
  if (c.dataset.del) {
    if (!confirm(t("ask_delete", { coin }))) return;
    jSave(all.filter((y) => y !== x));
  } else {
    const v = num(prompt(t("ask_exit", { coin }), fmtNum(price(x.sym))) || "");
    if (!(v > 0)) return;
    x.closed = { price: v, date: today10() };
    jSave(all);
  }
  renderJournal();
  fitAll();
}

function jImport(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const d = JSON.parse(rd.result);
      const incoming = (Array.isArray(d.trades) ? d.trades : []).map(jClean).filter(Boolean);
      if (!incoming.length) throw new Error("empty");
      const all = jLoad(), ids = new Set(all.map((y) => String(y.id)));
      const add = incoming.filter((y) => !ids.has(String(y.id)));
      jSave(all.concat(add));
      alert(t("imported", { n: add.length }));
      renderJournal();
      fitAll();
    } catch (err) { alert(t("import_bad")); }
    e.target.value = "";
  };
  rd.readAsText(file);
}

/* ---------- Позиции ---------- */

function renderPositions() {
  renderJournal();
  const ps = S.data.positions;
  if (!ps.length) { $("positions").innerHTML = `<div class="card empty">${esc(t("no_pos"))}</div>`; return; }
  $("positions").innerHTML = ps.map((p) => {
    const px = price(p.symbol), r = liveR(p, px), usd = r * p.risk_usd;
    const tags = p.hit.map((k) => t("tp_hit", { n: k + 1 }));
    if (p.be) tags.push(t("be"));
    if (!p.in_challenge) tags.push(t("not_in_ch"));
    const kv = (k, v, c = "") => `<span class="k">${esc(k)}</span><span class="v">${N(v, c)}</span>`;
    return `<div class="card pcard" data-sym="${esc(p.symbol)}">
      <div class="phead">${badge(p.symbol, p.coin)}<span class="cname">${esc(p.coin)}</span><span class="vbadge">${esc(p.variant)}</span>
        <span class="since">${esc(t("since", { date: p.entry_date }))}</span></div>
      <div class="pnl">${N(sgn(r) + "R", "r " + cls(r))}${N(sgn(usd).replace(/^([+−])/, "$1$"), "usd " + cls(usd))}</div>
      <div class="kv">
        ${kv(t("entry"), fmt(p.entry))}${kv(t("now"), fmt(px))}${kv(t("stop"), fmt(p.stop), "down")}
        ${p.tp.length ? kv("TP1", fmt(p.tp[0]), "up") + kv("TP2", fmt(p.tp[1]), "up") : ""}
        ${kv(t("risk"), "$" + p.risk_usd.toFixed(2))}
      </div>
      ${tags.length ? `<div class="ptags">${tags.map((x) => `<span>${esc(x)}</span>`).join("")}</div>` : ""}
    </div>`;
  }).join("");
}

/* ---------- Челлендж ---------- */

/* ---------- Новости ---------- */

function ago(iso) {
  const min = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
  if (min < 1) return t("ago_now");
  if (min < 60) return t("ago_m", { n: min });
  if (min < 48 * 60) return t("ago_h", { n: Math.round(min / 60) });
  return t("ago_d", { n: Math.round(min / 1440) });
}

/** One headline: source and age, the title, coin chips; opens the original article in a new tab. */
function newsItem(it) {
  const safe = /^https?:\/\//.test(it.link) ? it.link : "#";
  const chips = it.symbols.filter((s) => S.bySym[s]).map((s) =>
    `<span class="nchip">${badge(s, S.bySym[s].coin, "xs")}<span>${esc(S.bySym[s].coin)}</span></span>`).join("");
  return `<a class="card news ${it.delisting ? "delist" : ""}" href="${esc(safe)}" target="_blank" rel="noopener noreferrer">
    <div class="nmeta"><span class="src">${esc(it.source)}</span><span class="dotsep">·</span><span>${esc(ago(it.published))}</span>
      ${it.delisting ? `<span class="dlabel">${esc(t("delisting"))}</span>` : ""}</div>
    <div class="ntitle">${esc(it.title)}</div>
    ${chips ? `<div class="nchips">${chips}</div>` : ""}
  </a>`;
}

function renderNews() {
  document.querySelectorAll("#news-filter button").forEach((b) => b.classList.toggle("on", b.dataset.f === S.newsFilter));
  const items = ((S.news && S.news.items) || []).filter((it) => S.newsFilter === "all" || it.symbols.length);
  $("news-meta").textContent = S.news ? t("news_meta", { n: S.news.items.length }) : "";
  $("news-list").innerHTML = items.length ? items.map(newsItem).join("") : `<div class="card empty">${esc(t("news_none"))}</div>`;
}

function renderSigNews(sym) {
  $("sig-news-title").textContent = t("news_coin", { coin: S.bySym[sym].coin });
  const items = ((S.news && S.news.items) || []).filter((it) => it.symbols.includes(sym)).slice(0, 3);
  $("sig-news").innerHTML = items.length ? items.map(newsItem).join("")
    : `<div class="card empty small">${esc(t("news_coin_none"))}</div>`;
}

/* ---------- fitting: one-line rows step their fonts down instead of cutting a number ---------- */

/** [line selector, items that may shrink (":scope" = the line itself), smallest font in px] */
const FIT = [
  [".l1", [".price", ".cname", ".chg"], 12],
  [".dist .lbl", [":scope"], 11],
  [".hero-top", [".cname", ".schip"], 12],
  [".hero-price", [".big"], 20],
  [".lrow", [".lp", ".name", ".lpc"], 11],
  [".tp", [".v", ".p", ".k"], 11],
  [".kv .v", [".num"], 12],
  [".pnl", [".r", ".usd"], 14],
  [".ceq", [".big", ".pct"], 14],
  [".meter .line", [".val", ".lab"], 11],
  [".history li", [".act", ".res", ".when"], 11],
  [".phead", [".cname", ".since"], 11],
  [".jsum", [".num"], 11],
  [".chead", [".name", ".meta"], 11],
  [".tabbar button", [":scope > span:last-child"], 10],
];

/** While a line is wider than its box, take 1px off its largest shrinkable font (down to the minimum). */
function fitAll() {
  for (const [boxSel, itemSels, min] of FIT) {
    for (const box of document.querySelectorAll(boxSel)) {
      if (!box.getClientRects().length) continue;                  // hidden tab
      const items = itemSels.flatMap((sel) => (sel === ":scope" ? [box] : [...box.querySelectorAll(sel)]));
      items.forEach((el) => { el.style.fontSize = ""; });
      for (let guard = 0; box.scrollWidth > box.clientWidth + 0.5 && guard < 80; guard++) {
        let best = null, size = 0;
        for (const el of items) {
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs > min && fs > size) { best = el; size = fs; }
        }
        if (!best) break;
        best.style.fontSize = size - 1 + "px";
      }
    }
  }
}
window.addEventListener("resize", () => {
  fitAll();
  if (bubblesOn()) startBubbles(true);
  if (S.data && S.tab === "overview" && $("heat").clientWidth !== H.w) renderHeat();
});
// desktop-mode zoom changed (index.html): rebuild the charts at the new size and re-fit the lines
window.addEventListener("mb-zoom", () => { destroyCharts(); render(); if (bubblesOn()) startBubbles(true); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitAll());   // Manrope changes the widths

/* ---------- navigation ---------- */

function destroyCharts() {
  if (S.chart) { S.chart.remove(); S.chart = null; S.series = null; }
  if (S.curveChart) { S.curveChart.remove(); S.curveChart = null; }
}

function show(tab) {
  if (tab !== S.tab) destroyCharts();
  if (tab !== "signal") wsKline(null);
  if (tab !== "overview") closeBubbles();
  S.tab = tab;
  document.querySelectorAll(".tab").forEach((el) => { el.hidden = el.id !== "tab-" + tab; });
  document.querySelectorAll(".tabbar button").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  render();
  window.scrollTo(0, 0);
}

function render() {
  if (!S.data) return;
  renderHeader();
  if (S.tab === "market") renderMarket();
  if (S.tab === "signal") renderSignal();
  if (S.tab === "positions") renderPositions();
  if (S.tab === "overview") renderOverview();
  if (S.tab === "news") renderNews();
  fitAll();
}

function openCoin(sym) { S.coin = sym; show("signal"); }

/** Deep links: #signal/BTCUSDT, #overview, ... Sets the coin; returns the tab named in the hash (or the current one).
 *  The old #challenge link (the tab is gone) opens the Overview. */
function hashTab() {
  let [tab, coin] = location.hash.slice(1).split("/");
  if (coin && S.bySym[coin]) S.coin = coin;
  if (tab === "challenge") tab = "overview";
  return ["market", "signal", "positions", "news", "overview"].includes(tab) ? tab : S.tab;
}
window.addEventListener("hashchange", () => { if (S.data) show(hashTab()); });

async function init() {
  $("status").textContent = t("loading");
  try {
    await loadData();
  } catch (e) {
    $("status").textContent = t("load_fail");
    return;
  }
  S.coin = (S.data.positions[0] || {}).symbol ||
    S.data.symbols.slice().sort((a, b) => a.dist_pct - b.dist_pct)[0].symbol;
  await Promise.all([loadNews(), loadFng()]);
  show(hashTab());
  await loadLive();
  render();
  wsConnect();
  setInterval(applyLive, 1000);
  setInterval(async () => {                                   // polling: only while the WebSocket is down
    if (WS.ok || document.hidden) return;
    await loadLive();
    if (S.tab !== "signal") render(); else renderHeader();
  }, 60 * 1000);
  document.addEventListener("visibilitychange", async () => {
    if (document.hidden) { wsClose(); stopBubbles(); return; }
    await loadLive();
    render();
    wsConnect();
  });
  setInterval(async () => { await loadNews(); if (S.tab === "news") render(); }, 10 * 60 * 1000);
  setInterval(async () => {                                   // Fear & Greed: every 10 minutes while the app is open
    if (document.hidden) return;
    await loadFng();
    if (S.tab === "overview") { renderFng(); fitAll(); }
  }, 10 * 60 * 1000);
}

$("tabbar").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-tab]");
  if (b) { show(b.dataset.tab); track("tab-" + b.dataset.tab); }
});
// anonymous visit statistics (GoatCounter, no cookies): which tab was opened
function track(name) {
  try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: name, title: name, event: true }); } catch (e) {}
}
$("coins").addEventListener("click", (e) => {
  const row = e.target.closest(".row");
  if (row) openCoin(row.dataset.sym);
});
$("positions").addEventListener("click", (e) => {
  const card = e.target.closest(".pcard[data-sym]");
  if (card) openCoin(card.dataset.sym);
});
$("entered-btn").addEventListener("click", openSheet);
$("tfs").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-tf]");
  if (b && b.dataset.tf !== S.tf) { S.tf = b.dataset.tf; renderSignal(); }
});
$("sheet-close").addEventListener("click", () => { $("sheet").hidden = true; });
$("sheet").addEventListener("click", (e) => { if (e.target.id === "sheet") $("sheet").hidden = true; });
$("entry-form").addEventListener("submit", saveSheet);
$("journal").addEventListener("click", jAction);
$("import-file").addEventListener("change", jImport);
$("search").addEventListener("input", (e) => { S.query = e.target.value; renderMarket(); fitAll(); });
$("lang").addEventListener("click", () => {
  S.lang = S.lang === "ru" ? "en" : "ru";
  storeSet("lang", S.lang);
  render();
});
$("news-filter").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-f]");
  if (b) { S.newsFilter = b.dataset.f; renderNews(); fitAll(); }
});
$("bubbles-btn").addEventListener("click", openBubbles);
$("bubble-close").addEventListener("click", closeBubbles);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && B.open) closeBubbles(); });
$("fng").addEventListener("click", () => { S.fngOpen = !S.fngOpen; renderFng(); fitAll(); });
$("fng").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); S.fngOpen = !S.fngOpen; renderFng(); }
});
document.querySelectorAll(".period-seg").forEach((seg) => seg.addEventListener("click", (e) => {   // shared: heatmap + bubbles
  const b = e.target.closest("button[data-p]");
  if (!b || b.dataset.p === B.period) return;
  B.period = b.dataset.p;
  storeSet("meller_bubble_period", B.period);
  document.querySelectorAll(".period-seg button").forEach((x) => x.classList.toggle("on", x.dataset.p === B.period));
  loadPeriod(B.period);
  if (B.open) syncView();
  renderHeat();
}));
$("heat").addEventListener("click", (e) => {
  const tile = e.target.closest(".ht[data-sym]");
  if (tile) openCoin(tile.dataset.sym);
});
(function () {                                               // tap a bubble: open that coin on the Signal tab
  const cv = $("bubbles");
  let down = null;
  cv.addEventListener("pointerdown", (e) => { down = { x: e.clientX, y: e.clientY }; });
  cv.addEventListener("pointerup", (e) => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 12) { down = null; return; }
    down = null;
    const r = cv.getBoundingClientRect();
    const x = (e.clientX - r.left) * (B.w / r.width), y = (e.clientY - r.top) * (B.h / r.height);
    let hit = null, best = Infinity;
    for (const n of B.nodes) {
      const d = Math.hypot(x - n.x, y - n.y) / Math.max(n.r, 18);   // small bubbles get a finger-sized target
      if (d <= 1 && d < best) { best = d; hit = n; }
    }
    if (hit) { closeBubbles(); openCoin(hit.sym); }
  });
})();
$("more").addEventListener("click", () => { S.showAll = !S.showAll; renderMarket(); fitAll(); });
$("near-info").addEventListener("click", (e) => {
  const open = $("near-explain").hidden;
  $("near-explain").hidden = !open;
  e.currentTarget.setAttribute("aria-expanded", String(open));
});

/* ?debug=1: what iOS really gives the page (viewport size, zoom, standalone mode) */
function debugOverlay() {
  if (!new URLSearchParams(location.search).has("debug")) return;
  const box = document.createElement("div");
  box.className = "debug";
  document.body.appendChild(box);
  const meta = document.querySelector('meta[name="viewport"]');
  const update = () => {
    const vv = window.visualViewport;
    box.textContent = [
      `innerWidth × innerHeight: ${window.innerWidth} × ${window.innerHeight}`,
      `screen.width × height: ${screen.width} × ${screen.height}`,
      `devicePixelRatio: ${window.devicePixelRatio}`,
      `zoom (desktop-mode fix): ${window.__mb ? window.__mb.zoom.toFixed(3) : "n/a"}  effective width: ${window.__mb ? Math.round(window.__mb.width) : "n/a"}`,
      `visualViewport.scale: ${vv ? vv.scale : "n/a"}  (width ${vv ? Math.round(vv.width) : "n/a"})`,
      `display-mode standalone: ${matchMedia("(display-mode: standalone)").matches}`,
      `navigator.standalone: ${navigator.standalone}`,
      `documentElement.clientWidth: ${document.documentElement.clientWidth}  scrollWidth: ${document.documentElement.scrollWidth}`,
      `viewport meta: ${meta ? meta.content : "MISSING"}`,
      `url: ${location.pathname}${location.search}`,
    ].join("\n");
  };
  update();
  window.addEventListener("resize", update);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", update);
  setInterval(update, 1000);
}

debugOverlay();
init();
