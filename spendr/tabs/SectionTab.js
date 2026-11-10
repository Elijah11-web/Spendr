// ── SectionTab ─────────────────────────────────────────────
// Reusable for Expenses and Bills.
// Bills section shows auto-tithing as a read-only line at the top.

function SectionTab({
  title, icon, color,
  cats, customCats,
  budget, actual, notes,
  setBudget, setActual, setNotes,
  onAddCustomCat,
  showRecurring, recurringIds, onToggleRecurring,
  // Tithing (Bills only)
  tithingBudgetAuto, tithingActualAuto,
  selYear, selMonth, MONTHS,
  fmt, onBack,
}) {
  const allCats     = [...cats, ...(customCats || [])];
  const budgetTotal = allCats.reduce((s, c) => s + num(budget[c.id] || 0), 0)
                    + (tithingBudgetAuto || 0);
  const actualTotal = allCats.reduce((s, c) => s + num(actual[c.id] || 0), 0)
                    + (tithingActualAuto || 0);
  const overTotal   = budgetTotal > 0 && actualTotal > budgetTotal;

  return (
    <div style={{ animation: "fadeUp .3s ease" }}>
      <SectionHeader title={title} icon={icon} color={color} month={`${MONTHS[selMonth]} ${selYear}`} onBack={onBack} />

      <div style={{ padding: "0 16px" }}>

        <MonthProgressBanner selYear={selYear} selMonth={selMonth} MONTHS={MONTHS} />

        {/* Section totals */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "12px 0" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
            <div style={{ fontSize: 10, color: "#8E8E93", marginBottom: 4 }}>Total Budget</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#3C3C43" }}>{budgetTotal > 0 ? fmt(budgetTotal) : "—"}</div>
          </div>
          <div style={{
            background: "#fff", borderRadius: 14, padding: "12px 14px",
            boxShadow: "0 1px 4px rgba(0,0,0,.05)",
            border: `1px solid ${overTotal ? "#FFCDD2" : "transparent"}`,
          }}>
            <div style={{ fontSize: 10, color: "#8E8E93", marginBottom: 4 }}>Total Actual</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: overTotal ? "#FF3B30" : "#1C1C1E" }}>{actualTotal > 0 ? fmt(actualTotal) : "—"}</div>
          </div>
        </div>

        <Card>
          {/* ── Tithing row (Bills only, at top) ── */}
          {tithingBudgetAuto != null && (
            <div style={{
              paddingBottom: 14, marginBottom: 12,
              borderBottom: "1px solid #F2F2F7",
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 20, marginRight: 10 }}>🙏</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>Tithing (10%)</div>
                  <div style={{ fontSize: 10, color: "#FF9500", fontWeight: 600 }}>Auto-calculated from actual income</div>
                </div>
                <div style={{ fontSize: 9, background: "#FFF3E0", color: "#FF9500", padding: "3px 8px", borderRadius: 6, fontWeight: 700 }}>AUTO</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: "#8E8E93", fontWeight: 600, marginBottom: 4, letterSpacing: 0.4 }}>BUDGET</div>
                  <div style={{ padding: "10px 12px", background: "#FFF9F0", borderRadius: 10, border: "1px solid #FFE4B0", fontSize: 15, fontWeight: 700, color: "#FF9500" }}>
                    {tithingBudgetAuto > 0 ? fmt(tithingBudgetAuto) : "—"}
                  </div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: "#8E8E93", fontWeight: 600, marginBottom: 4, letterSpacing: 0.4 }}>ACTUAL</div>
                  <div style={{ padding: "10px 12px", background: "#FFF9F0", borderRadius: 10, border: "1px solid #FFE4B0", fontSize: 15, fontWeight: 700, color: "#FF9500" }}>
                    {tithingActualAuto > 0 ? fmt(tithingActualAuto) : "—"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Regular category rows ── */}
          {allCats.map((cat, ci) => {
            const b        = num(budget[cat.id] || 0);
            const a        = num(actual[cat.id] || 0);
            const over     = b > 0 && a > b;
            const pct      = b > 0 ? Math.min(a / b, 1) : 0;
            const barColor = over ? "#FF3B30" : pct > 0.85 ? "#FF9500" : "#34C759";
            const isRecurring = showRecurring && recurringIds && recurringIds.includes(cat.id);

            return (
              <div key={cat.id} style={{
                paddingBottom: 14, marginBottom: 12,
                borderBottom: ci < allCats.length - 1 ? "1px solid #F2F2F7" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 20, marginRight: 10 }}>{cat.icon}</div>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{cat.label}</div>
                  {over && <div style={{ fontSize: 9, background: "#FFE5E5", color: "#FF3B30", padding: "3px 8px", borderRadius: 6, fontWeight: 700, marginRight: 6 }}>OVER</div>}
                  {showRecurring && (
                    <RecurringToggle catId={cat.id} recurringIds={recurringIds || []} onToggle={onToggleRecurring} />
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: "#8E8E93", fontWeight: 600, marginBottom: 4, letterSpacing: 0.4 }}>
                      BUDGET {isRecurring && <span style={{ color: "#007AFF" }}>🔁</span>}
                    </div>
                    <NumInput val={budget[cat.id]} placeholder="0.00" onChange={v => setBudget({ [cat.id]: v })} color="#3C3C43" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: "#8E8E93", fontWeight: 600, marginBottom: 4, letterSpacing: 0.4 }}>ACTUAL</div>
                    <NumInput val={actual[cat.id]} placeholder="0.00" onChange={v => setActual({ [cat.id]: v })} color={over ? "#FF3B30" : "#1C1C1E"} highlight={over} />
                  </div>
                </div>

                <NotesInput val={(notes && notes[cat.id]) || ""} onChange={v => setNotes({ [cat.id]: v })} />

                {b > 0 && a > 0 && (
                  <div style={{ marginTop: 8, height: 4, background: "#F2F2F7", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct * 100}%`, background: barColor, borderRadius: 4, transition: "width .4s" }} />
                  </div>
                )}
                {over && <div style={{ fontSize: 11, color: "#FF3B30", marginTop: 5, fontWeight: 600 }}>Over by {fmt(a - b)}</div>}
                {b > 0 && a > 0 && !over && <div style={{ fontSize: 11, color: "#34C759", marginTop: 5, fontWeight: 600 }}>{fmt(b - a)} remaining</div>}
              </div>
            );
          })}

          <AddCategoryRow onAdd={onAddCustomCat} />
        </Card>
      </div>
    </div>
  );
}
