/* Meller Bot web app: reads data.json (written by paper.py after every run), live prices from Binance's public API. */
"use strict";

const I18N = {
  ru: {
    tab_market: "Рынок", tab_signal: "Сигнал", tab_positions: "Позиции", tab_challenge: "Челлендж", tab_news: "Новости",
    news_all: "Все", news_mine: "Мои монеты", news_none: "Новостей пока нет.", news_coin: "Новости {coin}",
    news_coin_none: "Новостей за 7 дней нет", news_meta: "{n} заголовков за 7 дней · CoinDesk, Cointelegraph, Decrypt, Binance",
    delisting: "⚠ делистинг", ago_m: "{n} мин назад", ago_h: "{n} ч назад", ago_d: "{n} д назад", ago_now: "только что",
    search: "Поиск монеты", near_title: "Ближе к пробою",
    near_explain: "Монеты отсортированы по расстоянию до 20-дневного максимума. Сигнал LONG появляется, когда " +
      "дневная свеча (закрытие в 00:00 UTC) закрывается выше этого уровня. Полная полоса — цена у уровня, " +
      "пустая — 20% и дальше.",
    show_all: "Показать все {n}", show_top: "Показать только топ-10",
    live: "живые цены", data_at: "данные {t}", to_breakout: "до пробоя", above: "выше уровня",
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
    tab_market: "Market", tab_signal: "Signal", tab_positions: "Positions", tab_challenge: "Challenge", tab_news: "News",
    news_all: "All", news_mine: "My coins", news_none: "No news yet.", news_coin: "{coin} news",
    news_coin_none: "No news in 7 days", news_meta: "{n} headlines in 7 days · CoinDesk, Cointelegraph, Decrypt, Binance",
    delisting: "⚠ delisting", ago_m: "{n} min ago", ago_h: "{n} h ago", ago_d: "{n} d ago", ago_now: "just now",
    search: "Search coin", near_title: "Closest to a breakout",
    near_explain: "Coins are sorted by their distance to the 20-day high. A LONG signal comes when a daily " +
      "candle (close at 00:00 UTC) closes above that level. A full bar means the price is at the level, an " +
      "empty one 20% or more away.",
    show_all: "Show all {n}", show_top: "Show top 10 only",
    live: "live prices", data_at: "data {t}", to_breakout: "to breakout", above: "above level",
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
  news: null, newsFilter: "all",
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
      S.live = Object.fromEntries(rows.map((x) => [x.symbol, { price: +x.lastPrice, change: +x.priceChangePercent }]));
      S.liveOk = true;
      S.host = host;
      return;
    } catch (e) { /* blocked or offline: try the next host, then fall back to data.json */ }
  }
  S.liveOk = false;
}

async function loadKlines(sym) {
  const c = S.klines[sym];
  if (c && Date.now() - c.at < 5 * 60 * 1000) return c.rows;
  if (S.liveOk) {
    try {
      const r = await fetch(`${S.host}/api/v3/klines?symbol=${sym}&interval=1d&limit=120`);
      if (r.ok) {
        const rows = (await r.json()).map((k) => ({ time: k[0] / 1000, open: +k[1], high: +k[2], low: +k[3], close: +k[4] }));
        S.klines[sym] = { at: Date.now(), rows };
        return rows;
      }
    } catch (e) { /* fall back below */ }
  }
  return S.bySym[sym].ohlc.map(([d, o, h, l, cl]) => ({ time: d, open: o, high: h, low: l, close: cl }));
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
  $("status").innerHTML = S.liveOk ? `<span class="dot"></span>${esc(t("live"))}` : esc(t("data_at", { t: when }));
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
        ${ch == null ? "" : N(sgn(ch) + "%", "chg " + cls(ch))}
        ${N(fmt(price(s.symbol)), "price")}</div>
      <div class="l2">${sparkline(s.symbol)}
        <div class="dist"><div class="lbl ${bc}">${lbl}</div>
          <div class="bar ${bc}"><i style="width:${(100 * fill(d)).toFixed(1)}%"></i></div></div></div>
    </li>`;
  }).join("");
}

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
    <div class="hero-price">${N(fmt(price(sym)), "big")}${ch == null ? "" : N(sgn(ch) + "%", "chg " + cls(ch))}</div>`;
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

async function renderSignal() {
  const sym = S.coin, L = levelsFor(sym), s = S.bySym[sym];
  $("entered-btn").textContent = t("i_entered");
  renderHero(sym, L);
  renderLadder(sym, L);
  renderTps(L);
  renderSigNews(sym);
  fitAll();
  $("sig-status").textContent = signalSentence(sym, L);
  const rows = await loadKlines(sym);
  if (S.coin === sym && S.tab === "signal" && !L.open && L.above) {       // today's candle now known
    renderLadder(sym, L);
    $("sig-status").textContent = signalSentence(sym, L);
    fitAll();
  }
  // only while the Signal tab is on screen: a chart built in a hidden tab has no width to size from
  if (S.coin !== sym || S.tab !== "signal" || typeof LightweightCharts === "undefined") return;
  destroyCharts();
  S.chart = LightweightCharts.createChart($("chart"), { ...CHART_THEME(), crosshair: { mode: 0 } });
  const series = S.chart.addCandlestickSeries({
    upColor: "#22d38a", downColor: "#ff5a6a", borderVisible: false, wickUpColor: "#22d38a", wickDownColor: "#ff5a6a",
    priceFormat: { type: "custom", formatter: (p) => fmtNum(p), minMove: 1e-9 },
  });
  series.setData(rows);
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

function meter(label, value, frac, kind) {
  const f = Math.max(0, Math.min(1, frac));
  return `<div class="meter"><div class="line"><span class="lab">${esc(label)}</span>${N(value, "val")}</div>
    <div class="bar ${kind}"><i style="width:${(100 * f).toFixed(1)}%"></i></div></div>`;
}

function renderChallenge() {
  const chs = S.data.challenges;
  const money = (x) => "$" + x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  $("challenges").innerHTML = chs.map((c) => {
    const pnl = 100 * (c.equity / c.start_balance - 1);
    const sev = (f) => (f >= 0.8 ? "danger" : f >= 0.5 ? "warn" : "");
    const dF = c.daily_used_pct / c.daily_loss_pct, mF = c.max_used_pct / c.max_loss_pct;
    const kind = c.name === "A" ? t("trailing") : "TP 2R+4R";
    return `<div class="card ccard"><div class="chead"><span class="name">${esc(t("challenge"))} ${esc(c.name)}</span>
        <span class="meta">${esc(t("attempt"))} #${c.attempt} · ${esc(t("phase"))} ${c.phase} · ${esc(kind)}</span></div>
      ${c.status === "passed" ? `<div class="ceq"><span class="big up">${esc(t("passed"))}</span></div>` : `
      <div class="ceq">${N(money(c.equity), "big")}${N(sgn(pnl) + "%", "pct " + cls(pnl))}</div>
      <div class="cbal">${esc(t("balance"))} ${N(money(c.balance))}</div>
      ${meter(`${t("target")} +${c.target_pct}%`, `${Math.max(0, pnl).toFixed(2)}% / ${c.target_pct}%`, pnl / c.target_pct, "")}
      ${meter(t("daily"), `${c.daily_used_pct.toFixed(1)}% / ${c.daily_loss_pct}%`, dF, sev(dF))}
      ${meter(t("maxloss"), `${c.max_used_pct.toFixed(1)}% / ${c.max_loss_pct}%`, mF, sev(mF))}
      ${meter(t("days"), `${c.trading_days} / ${c.min_days}`, c.trading_days / c.min_days, "days")}`}
    </div>`;
  }).join("");

  $("curve-title").textContent = t("curve");
  const enough = chs.some((c) => c.curve.length >= 2);
  $("curve-hint").textContent = enough ? "" : t("curve_hint");
  $("curve-card").hidden = !enough;
  destroyCharts();
  if (enough && S.tab === "challenge" && typeof LightweightCharts !== "undefined") {
    S.curveChart = LightweightCharts.createChart($("curve"), CHART_THEME());
    const colors = { A: "#4c8dff", B: "#22d38a" };
    chs.forEach((c) => {
      if (c.curve.length < 2) return;
      const s = S.curveChart.addLineSeries({ color: colors[c.name] || "#f2f5fb", lineWidth: 2, title: c.name });
      s.setData(c.curve.map(([d, eq]) => ({ time: d, value: eq })));
    });
    S.curveChart.timeScale().fitContent();
  }

  $("history-title").textContent = t("history");
  const ev = S.data.events.slice().reverse();
  $("history").innerHTML = ev.length ? ev.map((e) => `<li class="card">${badge(e.symbol, e.coin)}
      <div class="what"><div class="act">${esc(e.coin)} · ${esc(t(e.action))} · ${esc(e.variant)}</div>
        <div class="when">${N(esc(e.date))} · ${N(fmt(e.price))}</div></div>
      ${e.r == null || e.action === "OPEN" ? "" : N(sgn(e.r) + "R", "res " + cls(e.r))}
    </li>`).join("") : `<li class="card"><span class="when">${esc(t("no_history"))}</span></li>`;
}

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
window.addEventListener("resize", () => fitAll());
// desktop-mode zoom changed (index.html): rebuild the charts at the new size and re-fit the lines
window.addEventListener("mb-zoom", () => { destroyCharts(); render(); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitAll());   // Manrope changes the widths

/* ---------- navigation ---------- */

function destroyCharts() {
  if (S.chart) { S.chart.remove(); S.chart = null; }
  if (S.curveChart) { S.curveChart.remove(); S.curveChart = null; }
}

function show(tab) {
  if (tab !== S.tab) destroyCharts();
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
  if (S.tab === "challenge") renderChallenge();
  if (S.tab === "news") renderNews();
  fitAll();
}

function openCoin(sym) { S.coin = sym; show("signal"); }

/** Deep links: #signal/BTCUSDT, #challenge, ... Sets the coin; returns the tab named in the hash (or the current one). */
function hashTab() {
  const [tab, coin] = location.hash.slice(1).split("/");
  if (coin && S.bySym[coin]) S.coin = coin;
  return ["market", "signal", "positions", "news", "challenge"].includes(tab) ? tab : S.tab;
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
  await loadNews();
  show(hashTab());
  await loadLive();
  render();
  setInterval(async () => { await loadLive(); if (S.tab !== "signal") render(); else renderHeader(); }, 60 * 1000);
  setInterval(async () => { await loadNews(); if (S.tab === "news") render(); }, 10 * 60 * 1000);
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
