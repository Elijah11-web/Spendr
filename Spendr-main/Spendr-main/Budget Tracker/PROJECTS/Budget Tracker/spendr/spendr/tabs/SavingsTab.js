// ── SavingsTab ─────────────────────────────────────────────
// Savings goals only — tithing has moved to GivingTab.
// Supports: custom categories, notes per item.

function SavingsTab({
  data, setData,
  customSavCats, onAddCustomSavCat,
  selYear, selMonth, MONTHS,
  fmt, onBack,
}) {
  const allCats     = [...DEFAULT_SAVINGS_CATS, ...(customSavCats || [])];
  const budgetTotal = allCats.reduce((s, c) => s + num(data.savBudget[c.id] || 0), 0);
  const actualTotal = allCats.reduce((s, c) => s + num(data.savActual[c.id] || 0), 0);

  return (
    <div style={{ animation: "fadeUp .3s ease" }}>
      <SectionHeader title="Savings" icon="🐷" color="#FF9500" month={`${MONTHS[selMonth]} ${selYear}`} onBack={onBack}/>

      <div style={{ padding: "0 16px" }}>

        <MonthProgressBanner selYear={selYear} selMonth={selMonth} MONTHS={MONTHS}/>

        {/* Totals */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "12px 0" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
            <div style={{ fontSize: 10, color: "#8E8E93", marginBottom: 4 }}>Total Budget</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#3C3C43" }}>{budgetTotal > 0 ? fmt(budgetTotal) : "—"}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
            <div style={{ fontSize: 10, color: "#8E8E93", marginBottom: 4 }}>Total Actual</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{actualTotal > 0 ? fmt(actualTotal) : "—"}</div>
          </div>
        </div>

        <Card>
          {allCats.map((cat, ci) => {
            const b   = num(data.savBudget[cat.id] || 0);
            const a   = num(data.savActual[cat.id] || 0);
            const pct = b > 0 ? Math.min(a / b, 1) : 0;

            return (
              <div key={cat.id} style={{
                paddingBottom: 14, marginBottom: 12,
                borderBottom: ci < allCats.length - 1 ? "1px solid #F2F2F7" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 20, marginRight: 10 }}>{cat.icon}</div>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{cat.label}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: "#8E8E93", fontWeight: 600, marginBottom: 4, letterSpacing: 0.4 }}>BUDGET</div>
                    <NumInput val={data.savBudget[cat.id]} placeholder="0.00" onChange={v => setData(d => ({ ...d, savBudget: { ...d.savBudget, [cat.id]: v } }))} color="#3C3C43"/>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: "#8E8E93", fontWeight: 600, marginBottom: 4, letterSpacing: 0.4 }}>ACTUAL</div>
                    <NumInput val={data.savActual[cat.id]} placeholder="0.00" onChange={v => setData(d => ({ ...d, savActual: { ...d.savActual, [cat.id]: v } }))} color="#1C1C1E"/>
                  </div>
                </div>

                <NotesInput
                  val={(data.savNotes && data.savNotes[cat.id]) || ""}
                  onChange={v => setData(d => ({ ...d, savNotes: { ...d.savNotes, [cat.id]: v } }))}
                />

                {b > 0 && a > 0 && (
                  <div style={{ marginTop: 8, height: 4, background: "#F2F2F7", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct * 100}%`, background: "#FF9500", borderRadius: 4, transition: "width .4s" }}/>
                  </div>
                )}
                {b > 0 && a > 0 && <div style={{ fontSize: 11, color: "#FF9500", marginTop: 5, fontWeight: 600 }}>{fmt(a)} saved of {fmt(b)} goal</div>}
              </div>
            );
          })}

          <AddCategoryRow onAdd={onAddCustomSavCat}/>
        </Card>

      </div>
    </div>
  );
}
