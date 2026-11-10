// ── MonthlyTab ─────────────────────────────────────────────
// Year grid with:
// - Color-coded month cards (green/yellow/red) based on actual balance
// - Year-to-date summary row at the top
// - Future months tappable for planning

function MonthlyTab({ state, fmt, MONTHS, selYear, setSelYear, onSelect }) {
  const now = new Date();

  // Compute summary for a given month
  const getMonthSummary = (y, m) => {
    const mk = mkKey(y, m);
    const d  = state.months[mk];
    if (!d) return null;

    const inc      = num(d.incomeActual)  + num(d.income2Actual  || 0);
    const bInc     = num(d.incomeBudget)  + num(d.income2Budget  || 0);
    const tActAuto = inc  * 0.1;
    const tBudAuto = bInc * 0.1;

    const allExpCats  = [...DEFAULT_EXPENSE_CATS,  ...(state.customExpCats    || [])];
    const allBillCats = [...DEFAULT_BILL_CATS,      ...(state.customBillCats   || [])];
    const allGiveCats = [...DEFAULT_GIVING_CATS,    ...(state.customGivingCats || [])];
    const allSavCats  = [...DEFAULT_SAVINGS_CATS,   ...(state.customSavCats    || [])];

    const exp = allExpCats.reduce((s, c)  => s + num((d.expActual  || {})[c.id] || 0), 0)
              + allBillCats.reduce((s, c) => s + num((d.billActual || {})[c.id] || 0), 0)
              + allGiveCats.reduce((s, c) => c.id === "tithing" ? s + tActAuto : s + num((d.giveActual || {})[c.id] || 0), 0)
              + allSavCats.reduce((s, c)  => s + num((d.savActual  || {})[c.id] || 0), 0);

    const bExp = allExpCats.reduce((s, c)  => s + num((d.expBudget  || {})[c.id] || 0), 0)
               + allBillCats.reduce((s, c) => s + num((d.billBudget || {})[c.id] || 0), 0)
               + allGiveCats.reduce((s, c) => c.id === "tithing" ? s + tBudAuto : s + num((d.giveBudget || {})[c.id] || 0), 0)
               + allSavCats.reduce((s, c)  => s + num((d.savBudget  || {})[c.id] || 0), 0);

    return {
      inc, exp, bal: inc - exp,
      bInc, bExp, bBal: bInc - bExp,
      hasData: inc > 0 || exp > 0,
    };
  };

  // Year-to-date totals (only months with actual data up to today)
  const ytdMonths = MONTHS.map((_, i) => getMonthSummary(selYear, i)).filter(Boolean);
  const ytdInc    = ytdMonths.reduce((s, m) => s + m.inc, 0);
  const ytdExp    = ytdMonths.reduce((s, m) => s + m.exp, 0);
  const ytdBal    = ytdInc - ytdExp;
  const hasYtd    = ytdInc > 0 || ytdExp > 0;

  const canGoForward = selYear < now.getFullYear();

  // Color coding based on actual balance
  const cardColor = (data) => {
    if (!data || !data.hasData) return null;
    if (data.bal < 0) return { bg: "#FFF5F5", border: "#FFCDD2", label: "#FF3B30" };
    const pct = data.bInc > 0 ? data.exp / data.bInc : 0;
    if (pct > 0.9) return { bg: "#FFFBF0", border: "#FFE4B0", label: "#FF9500" };
    return { bg: "#F0FFF4", border: "#B7EBC8", label: "#34C759" };
  };

  return (
    <div style={{ animation: "fadeUp .3s ease", padding: "52px 16px 20px" }}>

      {/* Year navigator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={() => setSelYear(y => y - 1)} style={{ background: "#F2F2F7", borderRadius: 10, padding: "6px 14px", color: "#3C3C43", fontSize: 16 }}>‹</button>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#1C1C1E" }}>{selYear}</div>
        <button onClick={() => { if (canGoForward) setSelYear(y => y + 1); }} style={{ background: "#F2F2F7", borderRadius: 10, padding: "6px 14px", color: canGoForward ? "#3C3C43" : "#C7C7CC", fontSize: 16 }}>›</button>
      </div>

      {/* Year-to-date summary */}
      {hasYtd && (
        <div style={{
          background: "linear-gradient(135deg, #1C1C1E, #2C2C2E)",
          borderRadius: 18, padding: "16px", marginBottom: 14,
          boxShadow: "0 2px 8px rgba(0,0,0,.12)",
        }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", letterSpacing: 1.5, marginBottom: 10 }}>{selYear} YEAR SO FAR</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginBottom: 3 }}>Income</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#30D158" }}>{fmt(ytdInc)}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginBottom: 3 }}>Spent</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#FF6B6B" }}>{fmt(ytdExp)}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginBottom: 3 }}>Net</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: ytdBal < 0 ? "#FF453A" : "#30D158" }}>{fmt(ytdBal)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Month grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {MONTHS.map((m, i) => {
          const data          = getMonthSummary(selYear, i);
          const isFutureYear  = selYear > now.getFullYear();
          const isCurrent     = selYear === now.getFullYear() && i === now.getMonth();
          const isFutureMonth = selYear === now.getFullYear() && i > now.getMonth();
          const disabled      = isFutureYear;
          const cc            = cardColor(data);
          const over          = data && data.bExp > 0 && data.exp > data.bExp;

          return (
            <button
              key={i}
              onClick={() => !disabled && onSelect(selYear, i)}
              style={{
                background: isCurrent ? "#FFF8F0" : cc ? cc.bg : isFutureMonth ? "#F9F9FB" : "#fff",
                border: `1.5px solid ${isCurrent ? "#FF9500" : cc ? cc.border : isFutureMonth ? "#EBEBEF" : "#F2F2F7"}`,
                borderRadius: 16, padding: "14px", textAlign: "left",
                opacity: disabled ? 0.4 : 1,
                cursor: disabled ? "default" : "pointer",
                fontFamily: "inherit", boxShadow: "0 1px 4px rgba(0,0,0,.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: isCurrent ? "#FF9500" : isFutureMonth ? "#C7C7CC" : "#1C1C1E" }}>{m}</div>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  {over && <div style={{ fontSize: 8, background: "#FFE5E5", color: "#FF3B30", padding: "2px 5px", borderRadius: 4, fontWeight: 700 }}>OVER</div>}
                  {/* Color dot for quick scan */}
                  {cc && <div style={{ width: 8, height: 8, borderRadius: 4, background: cc.label }}/>}
                  {isFutureMonth && !data?.hasData && <div style={{ fontSize: 8, background: "#F2F2F7", color: "#8E8E93", padding: "2px 5px", borderRadius: 4, fontWeight: 600 }}>PLAN</div>}
                </div>
              </div>

              {data && data.hasData ? (
                <>
                  <div style={{ fontSize: 11, color: "#8E8E93", marginBottom: 2 }}>Income</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#30D158", marginBottom: 4 }}>{fmt(data.inc)}</div>
                  <div style={{ fontSize: 11, color: "#8E8E93", marginBottom: 2 }}>Balance</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: data.bal < 0 ? "#FF3B30" : "#1C1C1E" }}>{fmt(data.bal)}</div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: "#C7C7CC", marginTop: 4 }}>
                  {isFutureMonth ? "Tap to plan" : "No data"}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      {hasYtd && (
        <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center" }}>
          {[
            { color: "#34C759", label: "On track" },
            { color: "#FF9500", label: "Near budget" },
            { color: "#FF3B30", label: "Over / negative" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: item.color }}/>
              <span style={{ fontSize: 11, color: "#8E8E93" }}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
