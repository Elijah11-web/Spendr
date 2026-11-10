// ── IncomeTab ──────────────────────────────────────────────
// Log-based income entry. Each paycheck is entered once, saved
// with a date stamp, and accumulated. The input clears on Enter.

function IncomeTab({ data, setData, tithingActualAuto, selYear, selMonth, MONTHS, fmt, onBack }) {
  const { useState, useRef } = React;

  const [draftAmount, setDraftAmount] = useState("");
  const [draftLabel,  setDraftLabel]  = useState("");
  const [draftDate,   setDraftDate]   = useState(todayISO());
  const amountRef = useRef(null);

  const entries = data.incomeEntries || [];
  const totalActual = entries.reduce((s, e) => s + num(e.amount), 0);

  // ── Add entry on Enter / button ──
  const addEntry = () => {
    const amount = num(draftAmount);
    if (amount <= 0) return;
    const entry = {
      id:     genId(),
      label:  draftLabel.trim() || "Income",
      amount: draftAmount,
      date:   draftDate,
    };
    setData(d => ({ ...d, incomeEntries: [...(d.incomeEntries || []), entry] }));
    setDraftAmount("");
    setDraftLabel("");
    setDraftDate(todayISO());
    // Refocus amount field so user can immediately type next one
    setTimeout(() => amountRef.current && amountRef.current.focus(), 50);
  };

  const removeEntry = (id) => {
    setData(d => ({ ...d, incomeEntries: (d.incomeEntries || []).filter(e => e.id !== id) }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addEntry(); }
  };

  return (
    <div style={{ animation: "fadeUp .3s ease" }}>
      <SectionHeader title="Income" icon="💵" color="#30D158" month={`${MONTHS[selMonth]} ${selYear}`} onBack={onBack} />

      <div style={{ padding: "0 16px" }}>

        <MonthProgressBanner selYear={selYear} selMonth={selMonth} MONTHS={MONTHS} />

        {/* ── Total + Tithing summary ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "12px 0" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
            <div style={{ fontSize: 10, color: "#8E8E93", marginBottom: 4 }}>Total Income</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#30D158" }}>{totalActual > 0 ? fmt(totalActual) : "—"}</div>
            <div style={{ fontSize: 10, color: "#8E8E93", marginTop: 2 }}>{entries.length} paycheck{entries.length !== 1 ? "s" : ""} logged</div>
          </div>
          <div style={{ background: "#FFF9F0", borderRadius: 14, padding: "12px 14px", boxShadow: "0 1px 4px rgba(0,0,0,.05)", border: "1px solid #FFE4B0" }}>
            <div style={{ fontSize: 10, color: "#8E8E93", marginBottom: 4 }}>🙏 Tithing (10%)</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#FF9500" }}>{totalActual > 0 ? fmt(tithingActualAuto) : "—"}</div>
            <div style={{ fontSize: 10, color: "#FF9500", marginTop: 2 }}>auto-calculated</div>
          </div>
        </div>

        {/* ── Expected monthly income (budget) ── */}
        <Card>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#8E8E93", letterSpacing: 0.5, marginBottom: 10 }}>EXPECTED MONTHLY INCOME</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 12px", background: "#F7F7F8", borderRadius: 10, border: "1px solid #EFEFEF" }}>
            <span style={{ fontSize: 13, color: "#C7C7CC" }}>$</span>
            <input
              type="number" inputMode="decimal" placeholder="0.00"
              value={data.incomeBudget || ""}
              onChange={e => setData(d => ({ ...d, incomeBudget: e.target.value }))}
              style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#3C3C43", background: "transparent", border: "none", outline: "none", fontFamily: "inherit" }}
            />
          </div>
          <div style={{ fontSize: 11, color: "#8E8E93", marginTop: 6 }}>What you expect to earn this month</div>
        </Card>

        {/* ── Paycheck entry form ── */}
        <Card>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#8E8E93", letterSpacing: 0.5, marginBottom: 12 }}>LOG A PAYCHECK</div>

          {/* Label */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: "#8E8E93", fontWeight: 600, marginBottom: 4, letterSpacing: 0.4 }}>SOURCE / LABEL</div>
            <input
              type="text" placeholder="e.g. Salary, Side Job, Freelance…"
              value={draftLabel}
              onChange={e => setDraftLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%", fontSize: 14, fontWeight: 500, color: "#1C1C1E",
                background: "#F7F7F8", borderRadius: 10, padding: "10px 12px",
                border: "1px solid #EFEFEF", fontFamily: "inherit",
              }}
            />
          </div>

          {/* Amount + Date side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: "#8E8E93", fontWeight: 600, marginBottom: 4, letterSpacing: 0.4 }}>AMOUNT</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 12px", background: "#F7F7F8", borderRadius: 10, border: "1px solid #EFEFEF" }}>
                <span style={{ fontSize: 13, color: "#C7C7CC" }}>$</span>
                <input
                  ref={amountRef}
                  type="number" inputMode="decimal" placeholder="0.00"
                  value={draftAmount}
                  onChange={e => setDraftAmount(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#1C1C1E", background: "transparent", border: "none", outline: "none", fontFamily: "inherit", minWidth: 0 }}
                />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#8E8E93", fontWeight: 600, marginBottom: 4, letterSpacing: 0.4 }}>DATE</div>
              <input
                type="date"
                value={draftDate}
                onChange={e => setDraftDate(e.target.value)}
                style={{
                  width: "100%", fontSize: 13, fontWeight: 500, color: "#1C1C1E",
                  background: "#F7F7F8", borderRadius: 10, padding: "10px 10px",
                  border: "1px solid #EFEFEF", fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Add button */}
          <button
            onClick={addEntry}
            disabled={!num(draftAmount)}
            style={{
              width: "100%", padding: "13px",
              background: num(draftAmount) > 0 ? "#30D158" : "#E5E5EA",
              color: num(draftAmount) > 0 ? "#fff" : "#C7C7CC",
              borderRadius: 12, fontSize: 15, fontWeight: 700,
              border: "none", cursor: num(draftAmount) > 0 ? "pointer" : "default",
              transition: "background .2s",
            }}
          >
            ↵ Save Paycheck
          </button>
          <div style={{ fontSize: 11, color: "#8E8E93", textAlign: "center", marginTop: 6 }}>
            Press Enter or tap Save — input clears for next entry
          </div>
        </Card>

        {/* ── Logged paychecks list ── */}
        {entries.length > 0 && (
          <Card>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#8E8E93", letterSpacing: 0.5, marginBottom: 12 }}>
              PAYCHECKS THIS MONTH
            </div>
            {[...entries].reverse().map((entry, i) => (
              <div key={entry.id} style={{
                display: "flex", alignItems: "center",
                padding: "10px 0",
                borderBottom: i < entries.length - 1 ? "1px solid #F2F2F7" : "none",
              }}>
                {/* Date badge */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "#F0FFF4", flexShrink: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  marginRight: 12,
                }}>
                  <div style={{ fontSize: 8, color: "#34C759", fontWeight: 700, letterSpacing: 0.3 }}>
                    {new Date(entry.date + "T12:00:00").toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#34C759", lineHeight: 1 }}>
                    {new Date(entry.date + "T12:00:00").getDate()}
                  </div>
                </div>

                {/* Label + full date */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1C1E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {entry.label}
                  </div>
                  <div style={{ fontSize: 11, color: "#8E8E93" }}>{fmtDate(entry.date + "T12:00:00")}</div>
                </div>

                {/* Amount */}
                <div style={{ textAlign: "right", marginRight: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#30D158" }}>{fmt(num(entry.amount))}</div>
                  <div style={{ fontSize: 10, color: "#8E8E93" }}>10% → {fmt(num(entry.amount) * 0.1)}</div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeEntry(entry.id)}
                  style={{ background: "#FFE5E5", border: "none", borderRadius: 8, width: 30, height: 30, fontSize: 14, color: "#FF3B30", cursor: "pointer", flexShrink: 0 }}
                >✕</button>
              </div>
            ))}

            {/* Running total footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 10, borderTop: "2px solid #F2F2F7" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1C1E" }}>Total</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#30D158" }}>{fmt(totalActual)}</div>
                <div style={{ fontSize: 11, color: "#FF9500" }}>Tithing: {fmt(tithingActualAuto)}</div>
              </div>
            </div>
          </Card>
        )}

        {entries.length === 0 && (
          <InfoBox text="Enter each paycheck or income payment and press Enter or Save. They'll stack up below with their dates. The total auto-updates everywhere in the app." />
        )}

      </div>
    </div>
  );
}
