// ── Shared UI Components ───────────────────────────────────
// Depends on: constants.js

// ── Section page header ──
function SectionHeader({ title, icon, color, month }) {
  return (
    <div style={{
      background: `linear-gradient(160deg,${color}18 0%,${color}05 100%)`,
      padding: "52px 20px 20px",
      borderBottom: "1px solid #F2F2F7",
    }}>
      <div style={{ fontSize: 11, color: "#8E8E93", letterSpacing: 1, marginBottom: 4 }}>{month}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: color + "22",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
        }}>{icon}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#1C1C1E", letterSpacing: -0.5 }}>{title}</div>
      </div>
    </div>
  );
}

// ── White rounded card ──
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 18, padding: "16px",
      marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,.06)", ...style,
    }}>
      {children}
    </div>
  );
}

// ── Number input ──
function NumInput({ val, placeholder, onChange, color = "#1C1C1E", highlight = false }) {
  return (
    <div style={{
      width: "100%", minWidth: 0, padding: "10px 12px",
      background: highlight ? "#FFF5F5" : "#F7F7F8",
      borderRadius: 10, border: `1px solid ${highlight ? "#FFCDD2" : "#EFEFEF"}`,
      display: "flex", alignItems: "center", gap: 4,
      boxSizing: "border-box", overflow: "hidden",
    }}>
      <span style={{ fontSize: 13, color: "#C7C7CC", flexShrink: 0 }}>$</span>
      <input
        type="number" inputMode="decimal" placeholder={placeholder}
        value={val || ""} onChange={e => onChange(e.target.value)}
        style={{ flex: 1, fontSize: 15, fontWeight: 600, color, minWidth: 0, width: "100%" }}
      />
    </div>
  );
}

// ── Notes input ──
function NotesInput({ val, onChange }) {
  return (
    <div style={{ marginTop: 6 }}>
      <input
        type="text"
        placeholder="Add a note…"
        value={val || ""}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", fontSize: 12, color: "#3C3C43",
          background: "#F7F7F8", borderRadius: 8, padding: "7px 10px",
          border: "1px solid #EFEFEF", fontFamily: "inherit",
        }}
      />
    </div>
  );
}

// ── Two-column budget/actual input ──
function TwoColInput({ label, icon, budget, actual, onBudget, onActual }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{label}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, color: "#8E8E93", fontWeight: 600, marginBottom: 4, letterSpacing: 0.4 }}>BUDGET</div>
          <NumInput val={budget} placeholder="0.00" onChange={onBudget} color="#3C3C43" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, color: "#8E8E93", fontWeight: 600, marginBottom: 4, letterSpacing: 0.4 }}>ACTUAL</div>
          <NumInput val={actual} placeholder="0.00" onChange={onActual} color="#1C1C1E" />
        </div>
      </div>
    </div>
  );
}

// ── Auto tithing read-only display ──
function AutoTithingDisplay({ value, fmt }) {
  return (
    <div style={{
      width: "100%", minWidth: 0, padding: "10px 12px",
      background: "#FFF9F0", borderRadius: 10, border: "1px solid #FFE4B0",
      fontSize: 15, fontWeight: 700, color: "#FF9500",
      display: "flex", alignItems: "center", gap: 4,
      boxSizing: "border-box", overflow: "hidden",
    }}>
      <span style={{ fontSize: 12, color: "#FFB347", flexShrink: 0 }}>$</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
        {value > 0 ? fmt(value).replace("$", "") : "—"}
      </span>
    </div>
  );
}

// ── Blue info box ──
function InfoBox({ text }) {
  return (
    <div style={{
      background: "#F2F6FF", borderRadius: 14, padding: "12px 14px",
      marginBottom: 16, display: "flex", gap: 8, alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 16 }}>ℹ️</span>
      <div style={{ fontSize: 12, color: "#3A6EA5", lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

// ── Month-to-date progress banner ──
function MonthProgressBanner({ selYear, selMonth, MONTHS }) {
  const daysLeft  = daysLeftInMonth(selYear, selMonth);
  const pct       = pctMonthElapsed(selYear, selMonth);
  const totalDays = daysInMonth(selYear, selMonth);
  if (daysLeft === null) return null; // not current month

  const dayNum = dayOfMonth();
  const urgency = daysLeft <= 5 ? "#FF3B30" : daysLeft <= 10 ? "#FF9500" : "#34C759";

  return (
    <div style={{
      margin: "12px 16px 0",
      background: "#fff", borderRadius: 14, padding: "12px 14px",
      boxShadow: "0 1px 4px rgba(0,0,0,.05)",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: urgency + "15",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0,
      }}>📅</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1C1C1E" }}>
            Day {dayNum} of {totalDays} — {MONTHS[selMonth]}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: urgency }}>
            {daysLeft === 0 ? "Last day!" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
          </span>
        </div>
        <div style={{ height: 4, background: "#F2F2F7", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct * 100}%`, background: urgency, borderRadius: 4, transition: "width .5s" }} />
        </div>
      </div>
    </div>
  );
}

// ── Export/Import toolbar ──
function DataToolbar({ state, onImport }) {
  const fileRef = React.useRef();
  return (
    <div style={{
      margin: "12px 16px",
      background: "#fff", borderRadius: 14, padding: "12px 14px",
      boxShadow: "0 1px 4px rgba(0,0,0,.05)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1C1E" }}>Your Data</div>
        <div style={{ fontSize: 11, color: "#8E8E93", marginTop: 2 }}>Stored in browser — back up regularly</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => exportData(state)}
          style={{
            fontSize: 12, fontWeight: 600, color: "#fff",
            background: "#34C759", borderRadius: 10, padding: "8px 12px",
            border: "none", cursor: "pointer",
          }}
        >⬇ Export</button>
        <button
          onClick={() => fileRef.current.click()}
          style={{
            fontSize: 12, fontWeight: 600, color: "#3A6EA5",
            background: "#F2F6FF", borderRadius: 10, padding: "8px 12px",
            border: "none", cursor: "pointer",
          }}
        >⬆ Import</button>
        <input
          ref={fileRef} type="file" accept=".json"
          style={{ display: "none" }}
          onChange={e => {
            const f = e.target.files[0];
            if (f) importData(f, onImport, (err) => alert("Import failed: " + err));
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

// ── Recurring toggle chip ──
function RecurringToggle({ catId, recurringIds, onToggle }) {
  const on = recurringIds.includes(catId);
  return (
    <button
      onClick={() => onToggle(catId)}
      title={on ? "Recurring: budget copies from last month" : "Set as recurring"}
      style={{
        fontSize: 10, fontWeight: 700,
        background: on ? "#E8F5FF" : "#F2F2F7",
        color: on ? "#007AFF" : "#C7C7CC",
        border: `1px solid ${on ? "#B8DAFF" : "#E5E5EA"}`,
        borderRadius: 6, padding: "3px 7px",
        cursor: "pointer",
      }}
    >🔁 {on ? "Recurring" : "Set recurring"}</button>
  );
}

// ── Add custom category row ──
function AddCategoryRow({ onAdd }) {
  const [open, setOpen] = React.useState(false);
  const [label, setLabel] = React.useState("");
  const [icon, setIcon]   = React.useState("📌");

  const ICON_OPTS = ["📌","🐾","🎓","💊","🏋️","🛠","🎮","🚌","🍼","👔","🌿","🏦","📚","🎵","✂️","🛒"];

  const submit = () => {
    if (!label.trim()) return;
    onAdd({ id: genId(), label: label.trim(), icon });
    setLabel(""); setIcon("📌"); setOpen(false);
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      style={{
        width: "100%", marginTop: 8, padding: "10px",
        background: "#F7F7F8", borderRadius: 12,
        border: "1.5px dashed #D1D1D6",
        fontSize: 13, color: "#8E8E93", fontWeight: 600,
        cursor: "pointer",
      }}
    >+ Add custom category</button>
  );

  return (
    <div style={{ marginTop: 8, background: "#F7F7F8", borderRadius: 12, padding: "12px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#8E8E93", marginBottom: 8, letterSpacing: 0.5 }}>NEW CATEGORY</div>

      {/* Icon picker */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {ICON_OPTS.map(e => (
          <button key={e} onClick={() => setIcon(e)} style={{
            fontSize: 18, width: 34, height: 34, borderRadius: 8,
            background: icon === e ? "#FF9500" + "22" : "#fff",
            border: `1.5px solid ${icon === e ? "#FF9500" : "#E5E5EA"}`,
            cursor: "pointer",
          }}>{e}</button>
        ))}
      </div>

      {/* Label input */}
      <input
        autoFocus
        placeholder="Category name"
        value={label}
        onChange={e => setLabel(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
        style={{
          width: "100%", fontSize: 14, fontWeight: 600, color: "#1C1C1E",
          background: "#fff", borderRadius: 10, padding: "10px 12px",
          border: "1px solid #E5E5EA", fontFamily: "inherit", marginBottom: 8,
        }}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={submit} style={{
          flex: 1, padding: "9px", borderRadius: 10, background: "#FF9500",
          color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
        }}>Add</button>
        <button onClick={() => setOpen(false)} style={{
          flex: 1, padding: "9px", borderRadius: 10, background: "#F2F2F7",
          color: "#8E8E93", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
        }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Nav Icons ──
function HouseIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>; }
function CalIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function IncIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>; }
function ExpIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>; }
function BillIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>; }
function SaveIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>; }
function GiveIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
