// ── App Root ───────────────────────────────────────────────
const { useState, useEffect } = React;

function App() {
  const [state,    setState]    = useState(initState);
  const [tab,      setTab]      = useState("home");
  const [selYear,  setSelYear]  = useState(NOW.getFullYear());
  const [selMonth, setSelMonth] = useState(NOW.getMonth());

  useEffect(() => { saveState(state); }, [state]);

  // ── Current month ──
  const mk        = mkKey(selYear, selMonth);
  const monthData = state.months[mk] || makeBlankMonth(
    state.customExpCats, state.customBillCats, state.customSavCats
  );

  const setMonthData = (updater) => {
    setState(prev => {
      const current = prev.months[mk] || makeBlankMonth(
        prev.customExpCats, prev.customBillCats, prev.customSavCats
      );
      const updated = typeof updater === "function" ? updater(current) : updater;
      return { ...prev, months: { ...prev.months, [mk]: updated } };
    });
  };

  // ── Auto-fill recurring bills on new month ──
  useEffect(() => {
    if (state.months[mk]) return;
    let py = selYear, pm = selMonth - 1;
    if (pm < 0) { py -= 1; pm = 11; }
    const prevData = state.months[mkKey(py, pm)];
    if (!prevData) return;
    const recurringIds = state.recurringBillIds || [];
    if (!recurringIds.length) return;
    const src = prevData.billBudget || {};
    const carry = {};
    recurringIds.forEach(id => { if (src[id]) carry[id] = src[id]; });
    setMonthData(d => ({ ...d, billBudget: { ...d.billBudget, ...carry } }));
  }, [mk]); // eslint-disable-line

  // ── Income — log-based ──
  const incomeEntries    = monthData.incomeEntries || [];
  const totalIncomeActual = incomeEntries.reduce((s, e) => s + num(e.amount), 0);
  const totalIncomeBudget = num(monthData.incomeBudget);
  const tithingActualAuto = totalIncomeActual * 0.1;
  const tithingBudgetAuto = totalIncomeBudget * 0.1;

  // ── Custom cats ──
  const customExpCats  = state.customExpCats  || [];
  const customBillCats = state.customBillCats || [];
  const customSavCats  = state.customSavCats  || [];
  const recurringBillIds = state.recurringBillIds || [];

  const addCustomCat   = (section, cat) => setState(prev => ({ ...prev, [section]: [...(prev[section] || []), cat] }));
  const toggleRecurring = (catId) => setState(prev => {
    const ids = prev.recurringBillIds || [];
    return { ...prev, recurringBillIds: ids.includes(catId) ? ids.filter(i => i !== catId) : [...ids, catId] };
  });

  // ── Section totals ──
  const allExpCats  = [...DEFAULT_EXPENSE_CATS, ...customExpCats];
  const allBillCats = [...DEFAULT_BILL_CATS,    ...customBillCats];
  const allSavCats  = [...DEFAULT_SAVINGS_CATS,  ...customSavCats];

  const expBudgetTotal  = allExpCats.reduce((s, c)  => s + num((monthData.expBudget  || {})[c.id] || 0), 0);
  const expActualTotal  = allExpCats.reduce((s, c)  => s + num((monthData.expActual  || {})[c.id] || 0), 0);
  const billBudgetTotal = allBillCats.reduce((s, c) => s + num((monthData.billBudget || {})[c.id] || 0), 0) + tithingBudgetAuto;
  const billActualTotal = allBillCats.reduce((s, c) => s + num((monthData.billActual || {})[c.id] || 0), 0) + tithingActualAuto;
  const savBudgetTotal  = allSavCats.reduce((s, c)  => s + num((monthData.savBudget  || {})[c.id] || 0), 0);
  const savActualTotal  = allSavCats.reduce((s, c)  => s + num((monthData.savActual  || {})[c.id] || 0), 0);

  const totalExpBudget = expBudgetTotal + billBudgetTotal + savBudgetTotal;
  const totalExpActual = expActualTotal + billActualTotal + savActualTotal;
  const balBudget      = totalIncomeBudget - totalExpBudget;
  const balActual      = totalIncomeActual - totalExpActual;

  // ── Month nav ──
  const prevMonth = () => {
    if (selMonth === 0) { setSelYear(y => y - 1); setSelMonth(11); }
    else setSelMonth(m => m - 1);
  };
  const nextMonth = () => {
    const cy = NOW.getFullYear();
    if (selYear > cy) return;
    if (selMonth === 11) { if (selYear < cy) { setSelYear(y => y + 1); setSelMonth(0); } }
    else setSelMonth(m => m + 1);
  };

  const NAV = [
    { id: "home",     icon: <HouseIcon />, label: "Overview"  },
    { id: "monthly",  icon: <CalIcon />,   label: "Monthly"   },
    { id: "income",   icon: <IncIcon />,   label: "Income"    },
    { id: "expenses", icon: <ExpIcon />,   label: "Expenses"  },
    { id: "bills",    icon: <BillIcon />,  label: "Bills"     },
    { id: "savings",  icon: <SaveIcon />,  label: "Savings"   },
  ];

  return (
    <div style={{ minHeight: "100vh", maxWidth: 430, margin: "0 auto", background: "#F7F7F8", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 90 }}>

        {tab === "home" && (
          <HomeTab
            selYear={selYear} selMonth={selMonth} MONTHS={MONTHS}
            prevMonth={prevMonth} nextMonth={nextMonth}
            incomeEntries={incomeEntries}
            totalIncomeBudget={totalIncomeBudget} totalIncomeActual={totalIncomeActual}
            tithingBudgetAuto={tithingBudgetAuto} tithingActualAuto={tithingActualAuto}
            expBudgetTotal={expBudgetTotal}   expActualTotal={expActualTotal}
            billBudgetTotal={billBudgetTotal} billActualTotal={billActualTotal}
            savBudgetTotal={savBudgetTotal}   savActualTotal={savActualTotal}
            totalExpBudget={totalExpBudget}   totalExpActual={totalExpActual}
            balBudget={balBudget} balActual={balActual}
            fmt={fmt} setTab={setTab}
          />
        )}

        {tab === "income" && (
          <IncomeTab
            data={monthData} setData={setMonthData}
            tithingActualAuto={tithingActualAuto}
            selYear={selYear} selMonth={selMonth} MONTHS={MONTHS}
            fmt={fmt} onBack={() => setTab("home")}
          />
        )}

        {tab === "expenses" && (
          <SectionTab
            title="Expenses" icon="💸" color="#FF6B6B"
            cats={DEFAULT_EXPENSE_CATS} customCats={customExpCats}
            budget={monthData.expBudget || {}} actual={monthData.expActual || {}} notes={monthData.expNotes || {}}
            setBudget={v => setMonthData(d => ({ ...d, expBudget: { ...d.expBudget, ...v } }))}
            setActual={v => setMonthData(d => ({ ...d, expActual: { ...d.expActual, ...v } }))}
            setNotes={v  => setMonthData(d => ({ ...d, expNotes:  { ...d.expNotes,  ...v } }))}
            onAddCustomCat={cat => addCustomCat("customExpCats", cat)}
            showRecurring={false}
            selYear={selYear} selMonth={selMonth} MONTHS={MONTHS}
            fmt={fmt} onBack={() => setTab("home")}
          />
        )}

        {tab === "bills" && (
          <SectionTab
            title="Bills" icon="📋" color="#60A5FA"
            cats={DEFAULT_BILL_CATS} customCats={customBillCats}
            budget={monthData.billBudget || {}} actual={monthData.billActual || {}} notes={monthData.billNotes || {}}
            setBudget={v => setMonthData(d => ({ ...d, billBudget: { ...d.billBudget, ...v } }))}
            setActual={v => setMonthData(d => ({ ...d, billActual: { ...d.billActual, ...v } }))}
            setNotes={v  => setMonthData(d => ({ ...d, billNotes:  { ...d.billNotes,  ...v } }))}
            onAddCustomCat={cat => addCustomCat("customBillCats", cat)}
            showRecurring={true}
            recurringIds={recurringBillIds}
            onToggleRecurring={toggleRecurring}
            tithingBudgetAuto={tithingBudgetAuto}
            tithingActualAuto={tithingActualAuto}
            selYear={selYear} selMonth={selMonth} MONTHS={MONTHS}
            fmt={fmt} onBack={() => setTab("home")}
          />
        )}

        {tab === "savings" && (
          <SavingsTab
            data={monthData} setData={setMonthData}
            customSavCats={customSavCats}
            onAddCustomSavCat={cat => addCustomCat("customSavCats", cat)}
            selYear={selYear} selMonth={selMonth} MONTHS={MONTHS}
            fmt={fmt} onBack={() => setTab("home")}
          />
        )}

        {tab === "monthly" && (
          <MonthlyTab
            state={state} fmt={fmt} MONTHS={MONTHS}
            selYear={selYear} setSelYear={setSelYear}
            selMonth={selMonth}
            onSelect={(y, m) => { setSelYear(y); setSelMonth(m); setTab("home"); }}
          />
        )}

        {(tab === "home" || tab === "monthly") && (
          <DataToolbar state={state} onImport={ns => { setState(ns); alert("Imported!"); }} />
        )}

      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "rgba(255,255,255,.95)", backdropFilter: "blur(20px)",
        borderTop: "1px solid #E5E5EA", display: "flex",
        padding: "8px 0 calc(8px + env(safe-area-inset-bottom,0px))", zIndex: 50,
      }}>
        {NAV.map(item => (
          <button key={item.id} className="nb" onClick={() => setTab(item.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            background: "none", padding: "4px 0",
          }}>
            <span style={{ color: tab === item.id ? "#FF9500" : "#8E8E93", transition: "color .15s" }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: tab === item.id ? "#FF9500" : "#8E8E93", letterSpacing: 0.2 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
