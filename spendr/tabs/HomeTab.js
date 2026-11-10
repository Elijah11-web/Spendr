// ── HomeTab ────────────────────────────────────────────────
function HomeTab({
  selYear, selMonth, MONTHS,
  prevMonth, nextMonth,
  incomeEntries,
  totalIncomeBudget, totalIncomeActual,
  tithingBudgetAuto, tithingActualAuto,
  expBudgetTotal, expActualTotal,
  billBudgetTotal, billActualTotal,
  savBudgetTotal,  savActualTotal,
  totalExpBudget,  totalExpActual,
  balBudget, balActual,
  fmt, setTab,
}) {

  const DonutChart = ({ budget, actual, size = 110 }) => {
    const r = 38, cx = size / 2, cy = size / 2, stroke = 14;
    const circ = 2 * Math.PI * r;
    const pct  = budget > 0 ? Math.min(actual / budget, 1) : 0;
    const over = budget > 0 && actual > budget;
    const color = over ? "#FF3B30" : actual / budget > 0.85 ? "#FF9500" : "#34C759";
    return (
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F2F2F7" strokeWidth={stroke} />
        {budget > 0 && (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: "stroke-dasharray .5s ease" }} />
        )}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="9" fill="#8E8E93" fontFamily="inherit">{over ? "OVER" : "USED"}</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="12" fontWeight="700" fill={over ? "#FF3B30" : "#1C1C1E"} fontFamily="inherit">
          {budget > 0 ? `${Math.round(pct * 100)}%` : "—"}
        </text>
      </svg>
    );
  };

  const Row = ({ label, budget, actual, accent }) => {
    const diff = actual - budget;
    const over = budget > 0 && actual > budget;
    return (
      <div style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F2F2F7" }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, background: accent, marginRight: 10, flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: 13, color: "#1C1C1E", fontWeight: 500 }}>{label}</div>
        <div style={{ width: 80, textAlign: "right", fontSize: 13, color: "#3C3C43" }}>{budget > 0 ? fmt(budget) : "—"}</div>
        <div style={{ width: 80, textAlign: "right", fontSize: 13, fontWeight: 600, color: over ? "#FF3B30" : "#1C1C1E" }}>{actual > 0 ? fmt(actual) : "—"}</div>
        <div style={{ width: 72, textAlign: "right", fontSize: 11, color: over ? "#FF3B30" : diff < 0 && budget > 0 ? "#34C759" : "#8E8E93" }}>
          {budget > 0 && actual > 0 ? (over ? `+${fmt(Math.abs(diff))}` : fmt(diff)) : ""}
        </div>
      </div>
    );
  };

  const atEnd = selYear === NOW.getFullYear() && selMonth === 11;

  // Recent paychecks (last 3) for the overview card
  const recentEntries = [...(incomeEntries || [])].reverse().slice(0, 3);

  return (
    <div style={{ animation: "fadeUp .3s ease" }}>

      {/* ── Dark hero ── */}
      <div style={{ background: "linear-gradient(160deg,#1C1C1E 0%,#2C2C2E 100%)", padding: "56px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <button onClick={prevMonth} style={{ background: "rgba(255,255,255,.1)", borderRadius: 10, padding: "6px 14px", color: "#fff", fontSize: 16 }}>‹</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", letterSpacing: 2, textTransform: "uppercase" }}>MONTHLY BUDGET</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>{MONTHS[selMonth]} {selYear}</div>
          </div>
          <button onClick={nextMonth} style={{ background: "rgba(255,255,255,.1)", borderRadius: 10, padding: "6px 14px", color: atEnd ? "rgba(255,255,255,.2)" : "rgba(255,255,255,.8)", fontSize: 16 }}>›</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          {[
            { label: "Budget Income",  val: totalIncomeBudget, color: "#30D158" },
            { label: "Actual Income",  val: totalIncomeActual, color: "#30D158" },
            { label: "Budget Expense", val: totalExpBudget,    color: "#FF6B6B" },
            { label: "Actual Expense", val: totalExpActual,    color: "#FF6B6B" },
          ].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.07)", borderRadius: 14, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.45)", marginBottom: 4, letterSpacing: 0.5 }}>{item.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: item.color }}>{item.val > 0 ? fmt(item.val) : "—"}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[{ label: "Budget Balance", val: balBudget }, { label: "Actual Balance", val: balActual }].map((item, i) => (
            <div key={i} style={{
              background: item.val < 0 ? "rgba(255,59,48,.15)" : "rgba(48,209,88,.1)",
              border: `1px solid ${item.val < 0 ? "rgba(255,59,48,.3)" : "rgba(48,209,88,.2)"}`,
              borderRadius: 14, padding: "12px 14px",
            }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.45)", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: item.val < 0 ? "#FF453A" : "#30D158" }}>
                {totalIncomeBudget > 0 || totalIncomeActual > 0 ? fmt(item.val) : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Month progress ── */}
      <MonthProgressBanner selYear={selYear} selMonth={selMonth} MONTHS={MONTHS} />

      {/* ── Recent paychecks (from income log) ── */}
      {recentEntries.length > 0 && (
        <div style={{ background: "#fff", margin: "12px 16px 0", borderRadius: 18, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1C1E" }}>Recent Paychecks</div>
            <button onClick={() => setTab("income")} style={{ fontSize: 12, color: "#FF9500", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
              See all →
            </button>
          </div>
          {recentEntries.map((e, i) => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < recentEntries.length - 1 ? "1px solid #F2F2F7" : "none" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1C1C1E" }}>{e.label}</div>
                <div style={{ fontSize: 11, color: "#8E8E93" }}>{fmtDate(e.date + "T12:00:00")}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#30D158" }}>{fmt(num(e.amount))}</div>
                <div style={{ fontSize: 10, color: "#FF9500" }}>🙏 {fmt(num(e.amount) * 0.1)}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: "1px solid #F2F2F7" }}>
            <div style={{ fontSize: 12, color: "#8E8E93", fontWeight: 600 }}>
              {(incomeEntries || []).length} paycheck{(incomeEntries || []).length !== 1 ? "s" : ""} total
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#30D158" }}>{fmt(totalIncomeActual)}</div>
          </div>
        </div>
      )}

      {/* ── Donut card ── */}
      <div style={{ background: "#fff", margin: "12px 16px", borderRadius: 20, padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Spending vs Income</div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}><DonutChart budget={totalIncomeBudget} actual={totalExpBudget} /><div style={{ fontSize: 10, color: "#8E8E93", marginTop: 4 }}>Budget Plan</div></div>
          <div style={{ textAlign: "center" }}><DonutChart budget={totalIncomeActual} actual={totalExpActual} /><div style={{ fontSize: 10, color: "#8E8E93", marginTop: 4 }}>Actual</div></div>
        </div>
        {tithingActualAuto > 0 && (
          <div style={{ marginTop: 12, padding: "10px 12px", background: "#FFF9F0", borderRadius: 12, border: "1px solid #FFE4B0", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🙏</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#8E8E93" }}>Tithing this month (10% of income)</div>
              <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
                <div><div style={{ fontSize: 9, color: "#8E8E93" }}>Budget</div><div style={{ fontSize: 14, fontWeight: 700, color: "#FF9500" }}>{tithingBudgetAuto > 0 ? fmt(tithingBudgetAuto) : "—"}</div></div>
                <div><div style={{ fontSize: 9, color: "#8E8E93" }}>Actual</div><div style={{ fontSize: 14, fontWeight: 700, color: "#FF9500" }}>{fmt(tithingActualAuto)}</div></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Section cards ── */}
      {[
        { label: "Income",   budget: totalIncomeBudget, actual: totalIncomeActual, icon: "💵", color: "#30D158", tab: "income"   },
        { label: "Expenses", budget: expBudgetTotal,    actual: expActualTotal,    icon: "💸", color: "#FF6B6B", tab: "expenses" },
        { label: "Bills",    budget: billBudgetTotal,   actual: billActualTotal,   icon: "📋", color: "#60A5FA", tab: "bills"    },
        { label: "Savings",  budget: savBudgetTotal,    actual: savActualTotal,    icon: "🐷", color: "#FF9500", tab: "savings"  },
      ].map((s, i) => {
        const over     = s.budget > 0 && s.actual > s.budget;
        const diff     = s.actual - s.budget;
        const pct      = s.budget > 0 ? Math.min(s.actual / s.budget, 1) : 0;
        const barColor = over ? "#FF3B30" : pct > 0.85 ? "#FF9500" : "#34C759";
        return (
          <button key={i} onClick={() => setTab(s.tab)} style={{
            display: "block", width: "calc(100% - 32px)", margin: "0 16px 10px",
            background: "#fff", borderRadius: 18, padding: "14px 16px",
            boxShadow: "0 1px 4px rgba(0,0,0,.06)", textAlign: "left", fontFamily: "inherit",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E" }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "#8E8E93" }}>Budget vs Actual</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                {over && <div style={{ fontSize: 10, background: "#FFE5E5", color: "#FF3B30", padding: "2px 8px", borderRadius: 6, fontWeight: 700, marginBottom: 3 }}>OVER BUDGET</div>}
                <div style={{ fontSize: 11, color: over ? "#FF3B30" : diff < 0 && s.budget > 0 ? "#34C759" : "#8E8E93", fontWeight: 600 }}>
                  {s.budget > 0 && s.actual > 0 ? (over ? `▲ ${fmt(Math.abs(diff))}` : `▼ ${fmt(Math.abs(diff))} left`) : "Tap to edit"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 10, color: "#8E8E93", marginBottom: 2 }}>Budget</div><div style={{ fontSize: 15, fontWeight: 700, color: "#3C3C43" }}>{s.budget > 0 ? fmt(s.budget) : "—"}</div></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 10, color: "#8E8E93", marginBottom: 2 }}>Actual</div><div style={{ fontSize: 15, fontWeight: 700, color: over ? "#FF3B30" : "#1C1C1E" }}>{s.actual > 0 ? fmt(s.actual) : "—"}</div></div>
            </div>
            {s.budget > 0 && (
              <div style={{ height: 5, background: "#F2F2F7", borderRadius: 5, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct * 100}%`, background: barColor, borderRadius: 5, transition: "width .5s" }} />
              </div>
            )}
          </button>
        );
      })}

      {/* ── Cash Flow Summary ── */}
      <div style={{ background: "#fff", margin: "0 16px 16px", borderRadius: 18, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1C1E", marginBottom: 4 }}>Cash Flow Summary</div>
        <div style={{ display: "flex", padding: "6px 0", borderBottom: "1px solid #F2F2F7" }}>
          <div style={{ flex: 1 }} />
          <div style={{ width: 80, textAlign: "right", fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: 0.5 }}>BUDGET</div>
          <div style={{ width: 80, textAlign: "right", fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: 0.5 }}>ACTUAL</div>
          <div style={{ width: 72, textAlign: "right", fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: 0.5 }}>DIFF</div>
        </div>
        <Row label="Income"   budget={totalIncomeBudget} actual={totalIncomeActual} accent="#30D158" />
        <Row label="Expenses" budget={expBudgetTotal}     actual={expActualTotal}    accent="#FF6B6B" />
        <Row label="Bills"    budget={billBudgetTotal}    actual={billActualTotal}   accent="#60A5FA" />
        <Row label="Savings"  budget={savBudgetTotal}     actual={savActualTotal}    accent="#FF9500" />
        <div style={{ display: "flex", padding: "10px 0", marginTop: 4 }}>
          <div style={{ width: 18, marginRight: 10 }} />
          <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#1C1C1E" }}>Balance</div>
          <div style={{ width: 80, textAlign: "right", fontSize: 13, fontWeight: 700, color: balBudget < 0 ? "#FF3B30" : "#34C759" }}>{totalIncomeBudget > 0 ? fmt(balBudget) : "—"}</div>
          <div style={{ width: 80, textAlign: "right", fontSize: 13, fontWeight: 700, color: balActual  < 0 ? "#FF3B30" : "#34C759" }}>{totalIncomeActual > 0 ? fmt(balActual)  : "—"}</div>
          <div style={{ width: 72 }} />
        </div>
      </div>

    </div>
  );
}
