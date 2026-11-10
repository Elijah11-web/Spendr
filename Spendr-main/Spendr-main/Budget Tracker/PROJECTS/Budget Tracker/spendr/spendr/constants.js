// ── Constants ──────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const NOW    = new Date();
const KEY    = "spendr-v5";

// ── Category Definitions ───────────────────────────────────
const DEFAULT_EXPENSE_CATS = [
  { id: "groceries",     label: "Groceries",        icon: "🛒" },
  { id: "dining",        label: "Dining Out",        icon: "🍽" },
  { id: "personalcare",  label: "Personal Care",     icon: "🧴" },
  { id: "entertainment", label: "Entertainment",     icon: "🎬" },
  { id: "homesupplies",  label: "Home Supplies",     icon: "🏡" },
  { id: "transport",     label: "Transportation",    icon: "🚗" },
  { id: "gift",          label: "Gift",              icon: "🎁" },
  { id: "other",         label: "Other",             icon: "📦" },
];

const DEFAULT_BILL_CATS = [
  { id: "rent",      label: "Rent",             icon: "🏠" },
  { id: "electric",  label: "Electricity",      icon: "⚡" },
  { id: "cellphone", label: "Cell Phone",       icon: "📱" },
  { id: "internet",  label: "Internet",         icon: "🌐" },
  { id: "insurance", label: "Health Insurance", icon: "🏥" },
];

const DEFAULT_SAVINGS_CATS = [
  { id: "emergency", label: "Emergency Fund", icon: "🛡"  },
  { id: "vacation",  label: "Vacation",       icon: "✈️"  },
  { id: "invest",    label: "Investments",    icon: "📈"  },
  { id: "other_sav", label: "Other Savings",  icon: "💰"  },
];

// ── Storage ────────────────────────────────────────────────
const loadState = () => {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
};
const saveState = (s) => {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
};

// ── Helpers ────────────────────────────────────────────────
const mkKey = (y, m) => `${y}-${String(m + 1).padStart(2, "0")}`;

const fmt = (n) => {
  if (n == null || n === "") return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2,
  }).format(n);
};

const num = (v) => parseFloat(v) || 0;

const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const daysInMonth  = (y, m) => new Date(y, m + 1, 0).getDate();
const daysLeftInMonth = (y, m) => {
  const today = new Date();
  if (y !== today.getFullYear() || m !== today.getMonth()) return null;
  return daysInMonth(y, m) - today.getDate();
};
const dayOfMonth = () => new Date().getDate();
const pctMonthElapsed = (y, m) => {
  const today = new Date();
  if (y !== today.getFullYear() || m !== today.getMonth()) return null;
  return today.getDate() / daysInMonth(y, m);
};

const genId = () => "c_" + Math.random().toString(36).slice(2, 9);

// ── Blank Month Factory ────────────────────────────────────
// Income is now a log of entries: [{ id, label, amount, date }]
// Bills include tithing as a derived field (not stored — computed from income)
function makeBlankMonth(customExpCats = [], customBillCats = [], customSavCats = []) {
  const allExp  = [...DEFAULT_EXPENSE_CATS, ...customExpCats];
  const allBill = [...DEFAULT_BILL_CATS,    ...customBillCats];
  const allSav  = [...DEFAULT_SAVINGS_CATS, ...customSavCats];

  const expBudget  = {}; allExp.forEach(c  => { expBudget[c.id]  = ""; });
  const expActual  = {}; allExp.forEach(c  => { expActual[c.id]  = ""; });
  const expNotes   = {}; allExp.forEach(c  => { expNotes[c.id]   = ""; });
  const billBudget = {}; allBill.forEach(c => { billBudget[c.id] = ""; });
  const billActual = {}; allBill.forEach(c => { billActual[c.id] = ""; });
  const billNotes  = {}; allBill.forEach(c => { billNotes[c.id]  = ""; });
  const savBudget  = {}; allSav.forEach(c  => { savBudget[c.id]  = ""; });
  const savActual  = {}; allSav.forEach(c  => { savActual[c.id]  = ""; });
  const savNotes   = {}; allSav.forEach(c  => { savNotes[c.id]   = ""; });

  return {
    // New: income as a log of paycheck entries
    incomeEntries: [],   // [{ id, label, amount, date }]
    incomeBudget:  "",   // expected monthly income (single number)
    expBudget, expActual, expNotes,
    billBudget, billActual, billNotes,
    savBudget, savActual, savNotes,
  };
}

const initState = () => {
  const saved = loadState();
  return saved || {
    months: {},
    customExpCats:  [],
    customBillCats: [],
    customSavCats:  [],
    recurringBillIds: ["rent", "cellphone", "internet", "insurance"],
  };
};

// ── Export / Import ────────────────────────────────────────
const exportData = (state) => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `spendr-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const importData = (file, onSuccess, onError) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed && parsed.months) onSuccess(parsed);
      else onError("Invalid backup file.");
    } catch { onError("Could not parse file."); }
  };
  reader.readAsText(file);
};
