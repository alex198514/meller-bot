/* Meller Bot web app: reads data.json (written by paper.py after every run), live prices from Binance's public API. */
"use strict";

const I18N = {
  ru: {
    tab_market: "Рынок", tab_signal: "Сигнал", tab_positions: "Позиции", tab_challenge: "Челлендж",
    search: "Поиск монеты", sorted: "Сортировка: ближе всего к пробою 20-дневного максимума",
    live: "живые цены Binance", data_at: "данные на {t}", to_breakout: "до пробоя", above: "выше уровня",
    bull: "бычий", bear: "медвежий", side: "боковик", nodata: "нет данных",
    entry: "Вход", stop: "Стоп", take: "Тейк", trailing: "трейлинг", plan: "план, если будет пробой",
    open_pos: "позиция открыта", level: "пробой",
    wait: "Ждём дневного закрытия выше {lvl}, осталось {d}%.",
    above_now: "Цена выше уровня {lvl}: сигнал будет, если дневная свеча закроется выше (закрытие в 00:00 UTC).",
    in_pos: "Позиция {v} открыта {date}: сейчас {r}, стоп {stop}.",
    no_pos: "Нет открытых позиций. Бот ждёт пробоя.", r_now: "сейчас", since: "с {date}",
    risk: "риск", tp_hit: "TP{n} исполнен", be: "стоп в безубытке", not_in_ch: "вне челленджа",
    challenge: "Челлендж", phase: "фаза", attempt: "попытка", target: "Цель", daily: "Дневной убыток",
    maxloss: "Макс. убыток", days: "Торговые дни", passed: "ОБЕ ФАЗЫ ПРОЙДЕНЫ", balance: "баланс",
    curve: "Кривая эквити", curve_hint: "Кривая появится после нескольких дневных закрытий.",
    history: "История сигналов", no_history: "Пока нет сделок.",
    OPEN: "вход", TP1: "TP1", TP2: "TP2", CLOSE_STOP: "стоп", CLOSE_BE: "безубыток", CLOSE_TRAIL: "трейлинг",
    loading: "загрузка…", load_fail: "Не удалось загрузить data.json",
  },
  en: {
    tab_market: "Market", tab_signal: "Signal", tab_positions: "Positions", tab_challenge: "Challenge",
    search: "Search coin", sorted: "Sorted by distance to the 20-day-high breakout",
    live: "live Binance prices", data_at: "data as of {t}", to_breakout: "to breakout", above: "above level",
    bull: "bull", bear: "bear", side: "sideways", nodata: "no data",
    entry: "Entry", stop: "Stop", take: "Take", trailing: "trailing", plan: "plan if it breaks out",
    open_pos: "position open", level: "breakout",
    wait: "Waiting for a daily close above {lvl}, {d}% to go.",
    above_now: "Price is above {lvl}: a signal comes if the daily candle closes above it (close at 00:00 UTC).",
    in_pos: "Position {v} opened {date}: now {r}, stop {stop}.",
    no_pos: "No open positions. The bot is waiting for a breakout.", r_now: "now", since: "since {date}",
    risk: "risk", tp_hit: "TP{n} hit", be: "stop at breakeven", not_in_ch: "outside the challenge",
    challenge: "Challenge", phase: "phase", attempt: "attempt", target: "Target", daily: "Daily loss",
    maxloss: "Max loss", days: "Trading days", passed: "BOTH PHASES PASSED", balance: "balance",
    curve: "Equity curve", curve_hint: "The curve appears after a few daily closes.",
    history: "Signal history", no_history: "No trades yet.",
    OPEN: "entry", TP1: "TP1", TP2: "TP2", CLOSE_STOP: "stop", CLOSE_BE: "breakeven", CLOSE_TRAIL: "trailing",
    loading: "loading…", load_fail: "Could not load data.json",
  },
};

const S = {
  data: null, live: {}, liveOk: false, liveAt: null,
  lang: (new URLSearchParams(location.search).get("lang") || localStorage_get("lang") ||
         (navigator.language || "ru").slice(0, 2)) === "ru" ? "ru" : "en",
  tab: "market", coin: null, query: "", klines: {}, chart: null, curveChart: null,
};

function localStorage_get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function localStorage_set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
const $ = (id) => document.getElementById(id);
const t = (k, vars) => (I18N[S.lang][k] || k).replace(/\{(\w+)\}/g, (_, n) => (vars && n in vars ? vars[n] : ""));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function fmt(p) {
  if (p == null || !isFinite(p)) return "—";
  const a = Math.abs(p);
  if (a >= 1000) return "$" + p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (a >= 1) return "$" + p.toFixed(4);
  return "$" + Number(p.toPrecision(4)).toString();
}
const sgn = (x, d = 2) => (x >= 0 ? "+" : "") + x.toFixed(d);
const cls = (x) => (x >= 0 ? "up" : "down");

/* ---------- data ---------- */

async function loadData() {
  const r = await fetch("data.json?" + Date.now(), { cache: "no-store" });
  if (!r.ok) throw new Error("HTTP " + r.status);
  S.data = await r.json();
  S.bySym = Object.fromEntries(S.data.symbols.map((s) => [s.symbol, s]));
}

async function loadLive() {
  if (new URLSearchParams(location.search).has("offline")) { S.liveOk = false; return; }   // test the fallback
  const syms = S.data.symbols.map((s) => s.symbol);
  const q = "?symbols=" + encodeURIComponent(JSON.stringify(syms));
  for (const host of ["https://api.binance.com", "https://data-api.binance.vision"]) {
    try {
      const r = await fetch(host + "/api/v3/ticker/24hr" + q);
      if (!r.ok) continue;
      const rows = await r.json();
      S.live = Object.fromEntries(rows.map((x) => [x.symbol, { price: +x.lastPrice, change: +x.priceChangePercent }]));
      S.liveOk = true;
      S.liveAt = new Date();
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
  return S.bySym[sym].ohlc.map(([d, o, h, l, c]) => ({ time: d, open: o, high: h, low: l, close: c }));
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
  const mark = (f - p.entry - fee * (p.entry + f)) / p.risk;
  return p.booked_r + p.rem * mark - p.unbooked_r;
}

/* ---------- header ---------- */

function renderHeader() {
  const m = S.data.market;
  const chip = $("market");
  chip.className = "chip " + (m ? m.state : "");
  chip.textContent = m ? `● ${t(m.state)} ${sgn(m.pct, 1)}%` : t("nodata");
  chip.title = m ? `BTC ${fmt(m.btc)} vs 200-day ${fmt(m.sma200)}` : "";
  const upd = new Date(S.data.updated);
  const p2 = (n) => String(n).padStart(2, "0");
  const when = `${p2(upd.getDate())}.${p2(upd.getMonth() + 1)} ${p2(upd.getHours())}:${p2(upd.getMinutes())}`;
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
  const w = 84, h = 30, k = (v) => h - 2 - ((v - lo) / (hi - lo || 1)) * (h - 4);
  const line = pts.map((v, i) => `${((i / (pts.length - 1)) * w).toFixed(1)},${k(v).toFixed(1)}`).join(" ");
  const up = pts[pts.length - 1] >= pts[0];
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    <line x1="0" x2="${w}" y1="${k(s.level)}" y2="${k(s.level)}" stroke="#58a6ff" stroke-width="1" stroke-dasharray="3 3"/>
    <polyline points="${line}" fill="none" stroke="${up ? "#2ecc71" : "#f85149"}" stroke-width="1.6"/></svg>`;
}

function renderMarket() {
  $("search").placeholder = t("search");
  $("market-hint").textContent = t("sorted");
  const q = S.query.trim().toUpperCase();
  const rows = S.data.symbols
    .filter((s) => !q || s.coin.includes(q) || s.symbol.includes(q))
    .map((s) => ({ s, d: dist(s.symbol) }))
    .sort((a, b) => a.d - b.d);
  $("coins").innerHTML = rows.map(({ s, d }) => {
    const ch = change(s.symbol), pos = posOf(s.symbol);
    const near = d <= S.data.rules.near_pct, mid = d <= 10;
    const lbl = d <= 0 ? `<b>${esc(t("above"))}</b>` : `${esc(t("to_breakout"))} <b>${d.toFixed(1)}%</b>`;
    return `<li class="row" data-sym="${esc(s.symbol)}">
      <div><div class="coin">${esc(s.coin)}${pos ? `<span class="badge">${esc(pos.variant)}</span>` : ""}</div>
        <div class="px">${fmt(price(s.symbol))} ${ch == null ? "" : `<span class="pct ${cls(ch)}">${sgn(ch)}%</span>`}</div></div>
      ${sparkline(s.symbol)}
      <div class="dist"><div class="lbl ${near ? "near" : ""}">${lbl}</div>
        <div class="bar ${near ? "near" : mid ? "mid" : ""}"><i style="width:${(100 * fill(d)).toFixed(1)}%"></i></div></div>
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
  const entry = s.level, stop = entry - r.stop_atr * s.atr, risk = entry - stop;
  return { open: false, entry, stop, tp1: entry + r.tp_r[0] * risk, tp2: entry + r.tp_r[1] * risk };
}

function renderSignalBox(sym) {
  const L = levelsFor(sym), pc = (x) => 100 * (x / L.entry - 1);
  const rr = (L.tp2 - L.entry) / (L.entry - L.stop);
  $("sig-box").innerHTML = `
    <div class="sig-tags"><span class="tag">LONG · 1D · R:R 1:${rr.toFixed(1)}</span>
      <span class="tag ${L.open ? "ghost" : "plan"}">${esc(L.open ? t("open_pos") : t("plan"))}</span></div>
    <div class="es">
      <div class="cell"><div class="k">${esc(t("entry"))}</div><div class="v">${fmt(L.entry)}</div></div>
      <div class="cell"><div class="k">${esc(t("stop"))}</div><div class="v down">${fmt(L.stop)}</div>
        <div class="s down">${sgn(pc(L.stop))}%</div></div>
    </div>
    <div class="tps">
      <div class="cell"><div class="k">${esc(t("take"))} 1</div><div class="v">${sgn(pc(L.tp1))}%</div><div class="p">${fmt(L.tp1)}</div></div>
      <div class="cell"><div class="k">${esc(t("take"))} 2</div><div class="v">${sgn(pc(L.tp2))}%</div><div class="p">${fmt(L.tp2)}</div></div>
      <div class="cell trail"><div class="k">${esc(t("take"))} 3</div><div class="v">${esc(t("trailing"))}</div></div>
    </div>`;
  const s = S.bySym[sym], d = dist(sym);
  let sentence;
  if (L.open) {
    const r = liveR(L.p, price(sym));
    sentence = t("in_pos", { v: L.p.variant, date: L.p.entry_date, r: sgn(r) + "R", stop: fmt(L.p.stop) });
  } else if (d <= 0) sentence = t("above_now", { lvl: fmt(s.level) });
  else sentence = t("wait", { lvl: fmt(s.level), d: d.toFixed(1) });
  $("sig-status").textContent = sentence;
}

async function renderSignal() {
  const sel = $("coin-select");
  if (!sel.options.length) {
    sel.innerHTML = S.data.symbols.slice().sort((a, b) => a.coin.localeCompare(b.coin))
      .map((s) => `<option value="${esc(s.symbol)}">${esc(s.coin)}</option>`).join("");
  }
  const sym = S.coin;
  sel.value = sym;
  $("sig-price").textContent = fmt(price(sym));
  const ch = change(sym);
  $("sig-change").textContent = ch == null ? "" : sgn(ch) + "%";
  $("sig-change").className = "pct " + (ch == null ? "" : cls(ch));
  renderSignalBox(sym);
  const rows = await loadKlines(sym);
  if (S.coin !== sym || typeof LightweightCharts === "undefined") return;
  const el = $("chart");
  if (S.chart) S.chart.remove();
  S.chart = LightweightCharts.createChart(el, {
    width: el.clientWidth, height: el.clientHeight,
    layout: { background: { type: "solid", color: "#161b22" }, textColor: "#8b949e", fontSize: 11 },
    grid: { vertLines: { color: "#1f262e" }, horzLines: { color: "#1f262e" } },
    rightPriceScale: { borderColor: "#283039" }, timeScale: { borderColor: "#283039" },
    crosshair: { mode: 0 }, handleScale: true, handleScroll: true,
    localization: { locale: S.lang === "ru" ? "ru-RU" : "en-US" },
  });
  const series = S.chart.addCandlestickSeries({
    upColor: "#2ecc71", downColor: "#f85149", borderVisible: false, wickUpColor: "#2ecc71", wickDownColor: "#f85149",
    priceFormat: { type: "custom", formatter: (p) => fmt(p).slice(1), minMove: 1e-9 },
  });
  series.setData(rows);
  const line = (p, color, title, style = 2) => series.createPriceLine({ price: p, color, lineWidth: 2, lineStyle: style, axisLabelVisible: true, title });
  line(S.bySym[sym].level, "#58a6ff", t("level"), 1);
  const L = levelsFor(sym);
  if (L.open) {
    line(L.entry, "#e6edf3", t("entry"));
    line(L.stop, "#f85149", t("stop"));
    line(L.tp1, "#2ecc71", "TP1");
    line(L.tp2, "#2ecc71", "TP2");
  }
  S.chart.timeScale().fitContent();
}

/* ---------- Позиции ---------- */

function renderPositions() {
  const ps = S.data.positions;
  if (!ps.length) { $("positions").innerHTML = `<div class="empty">${esc(t("no_pos"))}</div>`; return; }
  $("positions").innerHTML = ps.map((p) => {
    const px = price(p.symbol), r = liveR(p, px), usd = r * p.risk_usd;
    const tags = [];
    p.hit.forEach((k) => tags.push(t("tp_hit", { n: k + 1 })));
    if (p.be) tags.push(t("be"));
    if (!p.in_challenge) tags.push(t("not_in_ch"));
    return `<div class="card" data-sym="${esc(p.symbol)}">
      <div class="card-head"><div class="name">${esc(p.coin)} <span class="tag ghost">${esc(p.variant)}</span></div>
        <div class="meta">${esc(t("since", { date: p.entry_date }))}</div></div>
      <div class="big ${cls(r)}">${sgn(r)}R <span style="font-size:18px">${usd >= 0 ? "+" : "−"}$${Math.abs(usd).toFixed(2)}</span></div>
      <div class="kv">
        <span>${esc(t("entry"))}</span><b>${fmt(p.entry)}</b>
        <span>${esc(t("r_now"))}</span><b>${fmt(px)}</b>
        <span>${esc(t("stop"))}</span><b class="down">${fmt(p.stop)}</b>
        <span>TP1 / TP2</span><b>${p.tp.length ? `${fmt(p.tp[0])} / ${fmt(p.tp[1])}` : "—"}</b>
        <span>${esc(t("risk"))}</span><b>$${p.risk_usd.toFixed(2)}</b>
        <span></span><b class="pct" style="color:var(--muted)">${esc(tags.join(" · "))}</b>
      </div></div>`;
  }).join("");
}

/* ---------- Челлендж ---------- */

function meter(label, value, frac, kind) {
  const f = Math.max(0, Math.min(1, frac));
  return `<div class="meter"><div class="line"><span>${esc(label)}</span><span>${esc(value)}</span></div>
    <div class="bar ${kind}"><i style="width:${(100 * f).toFixed(1)}%"></i></div></div>`;
}

function renderChallenge() {
  const chs = S.data.challenges;
  $("challenges").innerHTML = chs.map((c) => {
    const pnl = 100 * (c.equity / c.start_balance - 1);
    const sev = (f) => (f >= 0.8 ? "danger" : f >= 0.5 ? "warn" : "");
    const dF = c.daily_used_pct / c.daily_loss_pct, mF = c.max_used_pct / c.max_loss_pct;
    const kind = c.name === "A" ? t("trailing") : "TP 2R+4R";
    return `<div class="card"><div class="card-head"><div class="name">${esc(t("challenge"))} ${esc(c.name)}</div>
        <div class="meta">${esc(t("attempt"))} #${c.attempt} · ${esc(t("phase"))} ${c.phase} · ${kind}</div></div>
      ${c.status === "passed" ? `<div class="big up">${esc(t("passed"))}</div>` : `
      <div class="big">$${c.equity.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        <span class="pct ${cls(pnl)}" style="font-size:18px">${sgn(pnl)}%</span></div>
      <div class="hint">${esc(t("balance"))} $${c.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
      ${meter(`${t("target")} +${c.target_pct}%`, `${Math.max(0, pnl).toFixed(2)}% / ${c.target_pct}%`, pnl / c.target_pct, "")}
      ${meter(t("daily"), `${c.daily_used_pct.toFixed(1)}% / ${c.daily_loss_pct}%`, dF, sev(dF))}
      ${meter(t("maxloss"), `${c.max_used_pct.toFixed(1)}% / ${c.max_loss_pct}%`, mF, sev(mF))}
      ${meter(t("days"), `${c.trading_days} / ${c.min_days}`, c.trading_days / c.min_days, "days")}`}
    </div>`;
  }).join("");

  $("curve-title").textContent = t("curve");
  const el = $("curve");
  const enough = chs.some((c) => c.curve.length >= 2);
  $("curve-hint").textContent = enough ? "" : t("curve_hint");
  el.hidden = !enough;
  if (S.curveChart) { S.curveChart.remove(); S.curveChart = null; }
  if (enough && typeof LightweightCharts !== "undefined") {
    S.curveChart = LightweightCharts.createChart(el, {
      width: el.clientWidth, height: el.clientHeight,
      layout: { background: { type: "solid", color: "#161b22" }, textColor: "#8b949e", fontSize: 11 },
      grid: { vertLines: { color: "#1f262e" }, horzLines: { color: "#1f262e" } },
      rightPriceScale: { borderColor: "#283039" }, timeScale: { borderColor: "#283039" },
      localization: { locale: S.lang === "ru" ? "ru-RU" : "en-US" },
    });
    const colors = { A: "#58a6ff", B: "#2ecc71" };
    chs.forEach((c) => {
      if (c.curve.length < 2) return;
      const s = S.curveChart.addLineSeries({ color: colors[c.name] || "#e6edf3", lineWidth: 2, title: c.name });
      s.setData(c.curve.map(([d, eq]) => ({ time: d, value: eq })));
    });
    S.curveChart.timeScale().fitContent();
  }

  $("history-title").textContent = t("history");
  const ev = S.data.events.slice().reverse();
  $("history").innerHTML = ev.length ? ev.map((e) => `<li>
      <div><div class="act">${esc(e.coin)} · ${esc(t(e.action))} <span class="tag ghost" style="padding:1px 6px;font-size:11px">${esc(e.variant)}</span></div>
        <div class="when">${esc(e.date)} · ${fmt(e.price)}</div></div>
      <div class="pct ${e.r == null ? "" : cls(e.r)}" style="font-weight:700">${e.r == null || e.action === "OPEN" ? "" : sgn(e.r) + "R"}</div>
    </li>`).join("") : `<li><span class="when">${esc(t("no_history"))}</span></li>`;
}

/* ---------- navigation ---------- */

function show(tab) {
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
}

function openCoin(sym) { S.coin = sym; show("signal"); }

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
  const [hashTab, hashCoin] = location.hash.slice(1).split("/");    // deep links: #signal/BTCUSDT, #challenge
  if (hashCoin && S.bySym[hashCoin]) S.coin = hashCoin;
  if (["market", "signal", "positions", "challenge"].includes(hashTab)) S.tab = hashTab;
  show(S.tab);
  await loadLive();
  render();
  setInterval(async () => { await loadLive(); if (S.tab !== "signal") render(); else renderHeader(); }, 60 * 1000);
}

$("tabbar").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-tab]");
  if (b) show(b.dataset.tab);
});
$("coins").addEventListener("click", (e) => {
  const row = e.target.closest(".row");
  if (row) openCoin(row.dataset.sym);
});
$("positions").addEventListener("click", (e) => {
  const card = e.target.closest(".card[data-sym]");
  if (card) openCoin(card.dataset.sym);
});
$("coin-select").addEventListener("change", (e) => { S.coin = e.target.value; renderSignal(); });
$("search").addEventListener("input", (e) => { S.query = e.target.value; renderMarket(); });
$("lang").addEventListener("click", () => {
  S.lang = S.lang === "ru" ? "en" : "ru";
  localStorage_set("lang", S.lang);
  render();
});
window.addEventListener("resize", () => {
  if (S.chart) S.chart.applyOptions({ width: $("chart").clientWidth });
  if (S.curveChart) S.curveChart.applyOptions({ width: $("curve").clientWidth });
});

init();
