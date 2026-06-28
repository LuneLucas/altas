const STORAGE_KEY = "travel-ledger-v2";
const LEGACY_STORAGE_KEYS = ["travel-ledger-v1"];
const CLOUD_STATE_KEY = "travel-ledger-cloud";
const SUPABASE_URL = "https://qvphpeetzyvnwaehrifa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cGhwZWV0enl2bndhZWhyaWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzIxMTAsImV4cCI6MjA5ODE0ODExMH0.k3FL_Ywt377guTfjzTu1bgucShpRfmnQCdxn4SqikuA";
const PUBLIC_APP_URL = "https://lunelucas.github.io/altas/";
const defaultFamilies = [
  { id: "family-a", name: "乐家" },
  { id: "family-b", name: "祺家" },
  { id: "family-c", name: "旦家" },
];
const familyVisuals = {
  "family-a": { color: "#7fa08f", gradient: "#a9ceb5", text: "#496f5f", soft: "rgba(127, 160, 143, 0.64)", wash: "rgba(127, 160, 143, 0.18)" },
  "family-b": { color: "#8fa0bd", gradient: "#b9c9e6", text: "#566a8a", soft: "rgba(143, 160, 189, 0.64)", wash: "rgba(143, 160, 189, 0.18)" },
  "family-c": { color: "#c89a9a", gradient: "#efc2bf", text: "#986a6a", soft: "rgba(200, 154, 154, 0.62)", wash: "rgba(200, 154, 154, 0.17)" },
};
const defaultCategories = ["交通", "住宿", "餐饮", "门票", "购物", "其他"];
const categoryVisuals = {
  "交通": { emoji: "🚄", bg: "#d9e8e2", text: "#486d62", border: "rgba(88, 126, 113, 0.28)", gradient: "#b9d8cc" },
  "住宿": { emoji: "🛏️", bg: "#dfe5f2", text: "#536782", border: "rgba(92, 112, 145, 0.26)", gradient: "#c1cde2" },
  "餐饮": { emoji: "🍽️", bg: "#f1dfce", text: "#7a5b3f", border: "rgba(143, 102, 62, 0.24)", gradient: "#e6c7aa" },
  "门票": { emoji: "🎫", bg: "#eadff0", text: "#69587b", border: "rgba(106, 83, 127, 0.24)", gradient: "#d8c3e3" },
  "购物": { emoji: "🛒", bg: "#eddcdf", text: "#7b565c", border: "rgba(133, 83, 92, 0.24)", gradient: "#e4bdc5" },
  "其他": { emoji: "🧩", bg: "#e5e2d8", text: "#696252", border: "rgba(104, 94, 72, 0.24)", gradient: "#d5cfbd" },
};
const categoryEmojiRules = [
  { keywords: ["车", "交通", "高铁", "火车", "机票", "飞机", "打车", "出租", "地铁", "公交", "油", "过路"], emoji: "🚄" },
  { keywords: ["住", "宿", "酒店", "民宿", "房", "宾馆"], emoji: "🛏️" },
  { keywords: ["餐", "饭", "吃", "早饭", "午饭", "晚饭", "饮", "咖啡", "奶茶", "小吃", "烧烤"], emoji: "🍽️" },
  { keywords: ["门票", "票", "景区", "乐园", "展", "馆", "演出"], emoji: "🎫" },
  { keywords: ["购物", "买", "超市", "礼物", "纪念品", "商场"], emoji: "🛒" },
  { keywords: ["娃", "孩子", "儿童", "宝宝"], emoji: "🧒" },
  { keywords: ["药", "医疗", "医院"], emoji: "💊" },
];
const customCategoryVisuals = [
  { emoji: "🧾", bg: "#dde8df", text: "#506b56", border: "rgba(82, 112, 90, 0.24)", gradient: "#c2d9c7" },
  { emoji: "📍", bg: "#e0e6ee", text: "#536578", border: "rgba(83, 102, 128, 0.24)", gradient: "#c5d2df" },
  { emoji: "☕", bg: "#eee0d1", text: "#735d46", border: "rgba(126, 95, 61, 0.24)", gradient: "#dfc7ad" },
  { emoji: "🎒", bg: "#e8dfed", text: "#65566f", border: "rgba(100, 80, 116, 0.24)", gradient: "#d3c2dc" },
  { emoji: "🌿", bg: "#dce8e6", text: "#4f6c68", border: "rgba(78, 111, 104, 0.24)", gradient: "#bdd8d4" },
];
const todayIso = () => new Date().toISOString().slice(0, 10);

const elements = {
  ledgerView: document.querySelector("#ledgerView"),
  settingsView: document.querySelector("#settingsView"),
  syncStatus: document.querySelector("#syncStatus"),
  createCloudLedgerButton: document.querySelector("#createCloudLedgerButton"),
  copyShareLinkButton: document.querySelector("#copyShareLinkButton"),
  openSettingsButton: document.querySelector("#openSettingsButton"),
  closeSettingsButton: document.querySelector("#closeSettingsButton"),
  settingsBackdrop: document.querySelector("#settingsBackdrop"),
  settingsClearLedgerButton: document.querySelector("#settingsClearLedgerButton"),
  amountLabel: document.querySelector("#amountLabel"),
  payerField: document.querySelector("#payerField"),
  familyRoster: document.querySelector("#familyRoster"),
  totalMetric: document.querySelector("#totalMetric"),
  totalAmount: document.querySelector("#totalAmount"),
  shareAmount: document.querySelector("#shareAmount"),
  expenseCount: document.querySelector("#expenseCount"),
  expenseForm: document.querySelector("#expenseForm"),
  amountInput: document.querySelector("#amountInput"),
  categoryInput: document.querySelector("#categoryInput"),
  dateInput: document.querySelector("#dateInput"),
  noteInput: document.querySelector("#noteInput"),
  payerError: document.querySelector("#payerError"),
  formError: document.querySelector("#formError"),
  editBanner: document.querySelector("#editBanner"),
  cancelEditButton: document.querySelector("#cancelEditButton"),
  submitButtonLabel: document.querySelector("#submitButtonLabel"),
  categoryForm: document.querySelector("#categoryForm"),
  newCategoryInput: document.querySelector("#newCategoryInput"),
  settingsCategoryForm: document.querySelector("#settingsCategoryForm"),
  settingsNewCategoryInput: document.querySelector("#settingsNewCategoryInput"),
  categoryChips: document.querySelector("#categoryChips"),
  settingsCategoryChips: document.querySelector("#settingsCategoryChips"),
  settingsFamilyList: document.querySelector("#settingsFamilyList"),
  settingsDataSummary: document.querySelector("#settingsDataSummary"),
  storageModeLabel: document.querySelector("#storageModeLabel"),
  paidByFamily: document.querySelector("#paidByFamily"),
  categorySummaryBlock: document.querySelector("#categorySummaryBlock"),
  categorySummary: document.querySelector("#categorySummary"),
  settlementList: document.querySelector("#settlementList"),
  ledgerFamilyFilter: document.querySelector("#ledgerFamilyFilter"),
  ledgerCategoryFilter: document.querySelector("#ledgerCategoryFilter"),
  ledgerList: document.querySelector("#ledgerList"),
  mobileSubmitBar: document.querySelector("#mobileSubmitBar"),
  mobileSubmitSummary: document.querySelector("#mobileSubmitSummary"),
  mobileSubmitButton: document.querySelector("#mobileSubmitButton"),
  toastHost: document.querySelector("#toastHost"),
};

let state = loadState();
let lastAddedExpenseId = "";
let lastAddedCategory = "";
let editingExpenseId = "";
let toastTimer = 0;
let totalAmountText = "";
let totalAmountSwapTimer = 0;
let cloudState = loadCloudState();
let cloudBusy = false;
let cloudReady = false;
let pendingSettingsSync = 0;

function loadState() {
  const today = todayIso();
  const storageKeys = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];

  for (const key of storageKeys) {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      if (saved && Array.isArray(saved.families) && Array.isArray(saved.categories) && Array.isArray(saved.expenses)) {
        const expenses = saved.expenses.filter(isValidExpense).map(normalizeExpense);
        const categories = normalizeCategories([...saved.categories, ...expenses.map((expense) => expense.category)]);
        return {
          families: normalizeFamilies(saved.families),
          familyMembers: normalizeFamilyMembers(saved.familyMembers),
          categories,
          expenses,
          activeDate: expenses.length ? normalizeDate(saved.activeDate, today) : today,
          activeCategory: normalizeCategory(saved.activeCategory, categories[0]),
          selectedPayerId: normalizePayerId(saved.selectedPayerId) || defaultFamilies[0].id,
          ledgerFamilyFilter: normalizePayerId(saved.ledgerFamilyFilter),
          ledgerCategoryFilter: normalizeCategoryFilter(saved.ledgerCategoryFilter, categories),
        };
      }
    } catch {
      localStorage.removeItem(key);
    }
  }

  return {
    families: defaultFamilies.map((family) => ({ ...family })),
    familyMembers: normalizeFamilyMembers(),
    categories: [...defaultCategories],
    expenses: [],
    activeDate: today,
    activeCategory: defaultCategories[0],
    selectedPayerId: defaultFamilies[0].id,
    ledgerFamilyFilter: "",
    ledgerCategoryFilter: "",
  };
}

function normalizeFamilies(families) {
  return defaultFamilies.map((family) => ({ ...family }));
}

function normalizeFamilyMembers(memberCounts = {}) {
  return Object.fromEntries(
    defaultFamilies.map((family) => {
      const count = Number(memberCounts[family.id]);
      return [family.id, Number.isInteger(count) && count > 0 ? Math.min(count, 20) : 1];
    }),
  );
}

function normalizeCategories(categories) {
  const merged = [...defaultCategories, ...categories].map((category) => String(category).trim()).filter(Boolean);
  return [...new Set(merged)];
}

function normalizePayerId(payerId) {
  return defaultFamilies.some((family) => family.id === payerId) ? payerId : "";
}

function normalizeDate(value, fallback = todayIso()) {
  const date = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fallback;
  return Number.isNaN(new Date(`${date}T00:00:00`).getTime()) ? fallback : date;
}

function normalizeCategory(category, fallback = defaultCategories[0]) {
  const normalized = String(category || "").trim();
  return normalized || fallback;
}

function normalizeCategoryFilter(category, categories) {
  const normalized = String(category || "").trim();
  return categories.includes(normalized) ? normalized : "";
}

function normalizeExpense(expense) {
  return {
    id: expense.id,
    amount: Math.round(Number(expense.amount) * 100) / 100,
    payerId: normalizePayerId(expense.payerId),
    category: normalizeCategory(expense.category),
    note: String(expense.note || "").trim(),
    date: normalizeDate(expense.date),
  };
}

function isValidExpense(expense) {
  return (
    expense &&
    typeof expense.id === "string" &&
    Number.isFinite(Number(expense.amount)) &&
    Number(expense.amount) > 0 &&
    Boolean(normalizePayerId(expense.payerId)) &&
    typeof expense.category === "string" &&
    typeof expense.date === "string"
  );
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadCloudState() {
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("ledger") || "";
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(CLOUD_STATE_KEY) || "{}") || {};
  } catch {
    localStorage.removeItem(CLOUD_STATE_KEY);
  }

  return {
    shareToken: tokenFromUrl || saved.shareToken || "",
    lastPulledAt: "",
  };
}

function saveCloudState() {
  localStorage.setItem(CLOUD_STATE_KEY, JSON.stringify({ shareToken: cloudState.shareToken }));
}

function isCloudConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes("填"));
}

function isCloudLedgerActive() {
  return isCloudConfigured() && Boolean(cloudState.shareToken);
}

async function supabaseRpc(functionName, payload = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase 请求失败：${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function normalizeRemotePayload(payload) {
  const ledger = payload?.ledger || {};
  const expenses = Array.isArray(payload?.expenses) ? payload.expenses : [];
  const categories = Array.isArray(ledger.categories) ? ledger.categories : defaultCategories;
  const familyMembers = ledger.family_members && typeof ledger.family_members === "object" ? ledger.family_members : {};

  return {
    families: normalizeFamilies(ledger.families || defaultFamilies),
    familyMembers: normalizeFamilyMembers(familyMembers),
    categories: normalizeCategories([...categories, ...expenses.map((expense) => expense.category)]),
    expenses: expenses
      .map((expense) => ({
        id: String(expense.id),
        amount: Math.round(Number(expense.amount) * 100) / 100,
        payerId: normalizePayerId(expense.payer_id),
        category: normalizeCategory(expense.category),
        note: String(expense.note || "").trim(),
        date: normalizeDate(expense.expense_date),
      }))
      .filter(isValidExpense),
    activeDate: state.activeDate || todayIso(),
    activeCategory: normalizeCategory(state.activeCategory, categories[0] || defaultCategories[0]),
    selectedPayerId: normalizePayerId(state.selectedPayerId) || defaultFamilies[0].id,
    ledgerFamilyFilter: normalizePayerId(state.ledgerFamilyFilter),
    ledgerCategoryFilter: normalizeCategoryFilter(state.ledgerCategoryFilter, categories),
  };
}

async function pullCloudLedger({ announce = false } = {}) {
  if (!isCloudLedgerActive()) return false;

  cloudBusy = true;
  updateCloudControls();
  try {
    const payload = await supabaseRpc("get_travel_ledger", { p_share_token: cloudState.shareToken });
    state = normalizeRemotePayload(payload);
    cloudReady = true;
    cloudState.lastPulledAt = new Date().toISOString();
    saveCloudState();
    render({ skipCloudSave: true, animateFinancialChanges: announce });
    if (announce) showToast({ message: "已同步云账本" });
    return true;
  } catch (error) {
    cloudReady = false;
    updateCloudControls("同步失败");
    showToast({ message: "云账本同步失败，先保留本地数据" });
    return false;
  } finally {
    cloudBusy = false;
    updateCloudControls();
  }
}

async function createCloudLedger() {
  if (!isCloudConfigured()) {
    showToast({ message: "还需要填写 Supabase anon public key" });
    return;
  }

  cloudBusy = true;
  updateCloudControls();
  try {
    const payload = await supabaseRpc("create_travel_ledger");
    cloudState.shareToken = payload?.ledger?.share_token || "";
    if (!cloudState.shareToken) throw new Error("Missing share token");
    saveCloudState();
    updateLedgerUrl();
    await syncAllLocalDataToCloud();
    await pullCloudLedger({ announce: true });
  } catch (error) {
    showToast({ message: "创建云账本失败，请确认 SQL 已执行" });
  } finally {
    cloudBusy = false;
    updateCloudControls();
  }
}

async function syncAllLocalDataToCloud() {
  if (!isCloudLedgerActive()) return;
  await syncCloudSettingsNow();
  for (const expense of state.expenses) {
    await syncCloudExpense(expense);
  }
}

function updateLedgerUrl() {
  if (window.location.protocol === "file:") return;
  const url = new URL(window.location.href);
  url.searchParams.set("ledger", cloudState.shareToken);
  window.history.replaceState({}, "", url);
}

async function copyShareLink() {
  if (!cloudState.shareToken) return;
  const url = getShareUrl();
  if (!url) {
    showToast({ message: "先发布到网页地址，再复制邀请链接" });
    return;
  }
  url.searchParams.set("ledger", cloudState.shareToken);
  await navigator.clipboard.writeText(url.toString());
  const isLocalUrl = ["localhost", "127.0.0.1", ""].includes(url.hostname);
  showToast({ message: isLocalUrl ? "已复制本机测试链接，发布后再发给家人" : "邀请链接已复制" });
}

function getShareUrl() {
  if (PUBLIC_APP_URL) return new URL(PUBLIC_APP_URL);
  if (window.location.protocol === "file:") return null;
  return new URL(window.location.href);
}

function queueCloudSettingsSync() {
  if (!isCloudLedgerActive()) return;
  window.clearTimeout(pendingSettingsSync);
  pendingSettingsSync = window.setTimeout(() => {
    syncCloudSettingsNow();
  }, 350);
}

async function syncCloudSettingsNow() {
  if (!isCloudLedgerActive()) return;
  await supabaseRpc("update_travel_ledger_settings", {
    p_share_token: cloudState.shareToken,
    p_categories: state.categories,
    p_family_members: state.familyMembers,
  });
}

async function syncCloudExpense(expense) {
  if (!isCloudLedgerActive()) return;
  await supabaseRpc("save_travel_expense", {
    p_share_token: cloudState.shareToken,
    p_id: expense.id,
    p_amount: expense.amount,
    p_payer_id: expense.payerId,
    p_category: expense.category,
    p_note: expense.note,
    p_expense_date: expense.date,
  });
}

async function deleteCloudExpense(expenseId) {
  if (!isCloudLedgerActive()) return;
  await supabaseRpc("delete_travel_expense", {
    p_share_token: cloudState.shareToken,
    p_id: expenseId,
  });
}

async function clearCloudLedger() {
  if (!isCloudLedgerActive()) return;
  await supabaseRpc("clear_travel_ledger", { p_share_token: cloudState.shareToken });
}

function updateCloudControls(forcedStatus = "") {
  const configured = isCloudConfigured();
  const active = isCloudLedgerActive();
  elements.syncStatus.classList.toggle("is-cloud", active && !forcedStatus);
  elements.syncStatus.classList.toggle("is-error", Boolean(forcedStatus));
  elements.syncStatus.textContent = forcedStatus || (active ? (cloudBusy ? "云账本同步中" : "云账本") : configured ? "本地账本" : "本地账本");
  elements.createCloudLedgerButton.hidden = active;
  elements.createCloudLedgerButton.disabled = cloudBusy;
  elements.copyShareLinkButton.hidden = !active;
  elements.copyShareLinkButton.disabled = cloudBusy;
  if (elements.storageModeLabel) {
    elements.storageModeLabel.textContent = active ? "Supabase 云端" : "当前浏览器";
  }
}

function formatMoney(cents) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function expenseToCents(expense) {
  return Math.round(Number(expense.amount) * 100);
}

function getFamilyName(familyId) {
  return state.families.find((family) => family.id === familyId)?.name || "未知家庭";
}

function getFamilyVisual(familyId) {
  return familyVisuals[familyId] || familyVisuals[defaultFamilies[0].id];
}

function getCategoryVisual(category) {
  const baseVisual = categoryVisuals[category] || customCategoryVisuals[stringHash(category) % customCategoryVisuals.length];
  const emoji = getCategoryEmoji(category, baseVisual.emoji);
  return { ...baseVisual, emoji };
}

function formatCategoryLabel(category) {
  const visual = getCategoryVisual(category);
  return `${visual.emoji} ${category}`;
}

function getCategoryEmoji(category, fallback) {
  const normalized = String(category || "").trim();
  const matchedRule = categoryEmojiRules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
  return matchedRule?.emoji || fallback;
}

function categoryStyle(category) {
  const visual = getCategoryVisual(category);
  return `--category-bg: ${visual.bg}; --category-text: ${visual.text}; --category-border: ${visual.border}; --category-gradient: ${visual.gradient};`;
}

function stringHash(value) {
  return [...String(value)].reduce((hash, char) => (hash * 31 + char.codePointAt(0)) >>> 0, 7);
}

function calculateSummary() {
  const paidByFamily = Object.fromEntries(state.families.map((family) => [family.id, 0]));
  const categoryTotals = Object.fromEntries(state.categories.map((category) => [category, 0]));
  let totalCents = 0;

  for (const expense of state.expenses) {
    const cents = expenseToCents(expense);
    totalCents += cents;
    paidByFamily[expense.payerId] = (paidByFamily[expense.payerId] || 0) + cents;
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + cents;
  }

  const totalMembers = getTotalMembers();
  const perPersonCents = totalMembers ? Math.round(totalCents / totalMembers) : 0;
  const shareByFamily = calculateFamilyShares(totalCents, totalMembers);
  const balances = state.families.map((family) => ({
    family,
    cents: (paidByFamily[family.id] || 0) - shareByFamily[family.id],
  }));

  return {
    totalCents,
    shareCents: perPersonCents,
    totalMembers,
    shareByFamily,
    paidByFamily,
    categoryTotals,
    settlements: calculateSettlements(balances),
  };
}

function getTotalMembers() {
  return state.families.reduce((sum, family) => sum + (state.familyMembers[family.id] || 1), 0);
}

function calculateFamilyShares(totalCents, totalMembers) {
  if (!totalMembers) {
    return Object.fromEntries(state.families.map((family) => [family.id, 0]));
  }

  const roughShares = state.families.map((family) => {
    const members = state.familyMembers[family.id] || 1;
    const exactShare = (totalCents * members) / totalMembers;
    const cents = Math.floor(exactShare);
    return {
      family,
      cents,
      remainder: exactShare - cents,
    };
  });

  let remainingCents = totalCents - roughShares.reduce((sum, item) => sum + item.cents, 0);
  const sortedByRemainder = [...roughShares].sort((a, b) => b.remainder - a.remainder);
  for (const item of sortedByRemainder) {
    if (remainingCents <= 0) break;
    item.cents += 1;
    remainingCents -= 1;
  }

  return Object.fromEntries(roughShares.map((item) => [item.family.id, item.cents]));
}

function calculateSettlements(balances) {
  const debtors = balances
    .filter((item) => item.cents < 0)
    .map((item) => ({ ...item, cents: Math.abs(item.cents) }))
    .sort((a, b) => b.cents - a.cents);
  const creditors = balances.filter((item) => item.cents > 0).sort((a, b) => b.cents - a.cents);
  const settlements = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const cents = Math.min(debtor.cents, creditor.cents);

    if (cents > 0) {
      settlements.push({
        from: debtor.family.name,
        to: creditor.family.name,
        cents,
      });
    }

    debtor.cents -= cents;
    creditor.cents -= cents;

    if (debtor.cents === 0) debtorIndex += 1;
    if (creditor.cents === 0) creditorIndex += 1;
  }

  return settlements;
}

function render(options = {}) {
  const { animateFinancialChanges = false } = options;
  updateClearLedgerButton();
  updateCloudControls();
  renderFormOptions();
  renderFamilyRoster();
  renderCategories();
  renderLedgerFilters();
  renderSummary({ animateFinancialChanges });
  renderLedger({ animateFinancialChanges });
  renderSettings();
  renderEditState();
  renderMobileSubmitBar();
  applySelectedFamilyTheme();
  applySubmitButtonTheme();
  updateAmountMotionState();
  saveState();
}

function renderFormOptions() {
  elements.dateInput.value = state.activeDate;
  if (!state.categories.includes(state.activeCategory)) {
    state.activeCategory = state.categories[0] || defaultCategories[0];
  }
  elements.categoryInput.value = state.activeCategory;
}

function renderLedgerFilters() {
  elements.ledgerFamilyFilter.innerHTML = [
    `<option value="">全部家庭</option>`,
    ...state.families.map((family) => `<option value="${escapeHtml(family.id)}">${escapeHtml(family.name)}</option>`),
  ].join("");
  elements.ledgerFamilyFilter.value = state.ledgerFamilyFilter || "";

  elements.ledgerCategoryFilter.innerHTML = [
    `<option value="">全部类别</option>`,
    ...state.categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(formatCategoryLabel(category))}</option>`),
  ].join("");
  elements.ledgerCategoryFilter.value = state.ledgerCategoryFilter || "";
}

function renderFamilyRoster() {
  elements.familyRoster.innerHTML = state.families
    .map((family) => {
      const selected = family.id === state.selectedPayerId;
      return `
        <button class="family-tag${selected ? " is-selected" : ""}" type="button" data-payer-id="${escapeHtml(family.id)}" style="${familyStyle(family.id)}" aria-pressed="${selected}">
          <span>${escapeHtml(family.name)}</span>
        </button>
      `;
    })
    .join("");
}

function renderCategories() {
  elements.categoryChips.innerHTML = state.categories
    .map((category) => {
      const isNew = category === lastAddedCategory ? " is-entering" : "";
      const selected = category === state.activeCategory;
      return `
        <button class="chip category-chip selectable-category-chip${selected ? " is-selected" : ""}${isNew}" type="button" data-category="${escapeHtml(category)}" style="${categoryStyle(category)}" aria-pressed="${selected}">
          <span>${escapeHtml(formatCategoryLabel(category))}</span>
        </button>
      `;
    })
    .join("");
}

function renderSettings() {
  const summary = calculateSummary();
  const usedCategories = new Set(state.expenses.map((expense) => expense.category));

  elements.settingsFamilyList.innerHTML = state.families
    .map(
      (family) => `
        <div class="settings-family" style="${familyStyle(family.id)}">
          <span>${escapeHtml(family.name)}<small>已付 ${formatMoney(summary.paidByFamily[family.id] || 0)} · 应承担 ${formatMoney(summary.shareByFamily[family.id] || 0)}</small></span>
          <div class="member-stepper" aria-label="${escapeHtml(family.name)}人数">
            <button type="button" data-member-step="${escapeHtml(family.id)}" data-step="-1" aria-label="减少${escapeHtml(family.name)}人数">−</button>
            <strong>${state.familyMembers[family.id] || 1} 人</strong>
            <button type="button" data-member-step="${escapeHtml(family.id)}" data-step="1" aria-label="增加${escapeHtml(family.name)}人数">+</button>
          </div>
        </div>
      `,
    )
    .join("");

  elements.settingsCategoryChips.innerHTML = state.categories
    .map((category) => {
      const isDefault = defaultCategories.includes(category);
      const isUsed = usedCategories.has(category);
      const status = isDefault ? "预设" : isUsed ? "使用中" : "可删除";
      const removeButton =
        isDefault || isUsed
          ? ""
          : `<button class="chip-remove-button" type="button" data-remove-category="${escapeHtml(category)}" aria-label="删除 ${escapeHtml(category)}">×</button>`;

      return `
        <span class="chip category-chip settings-category-chip" style="${categoryStyle(category)}">
          <span>${escapeHtml(formatCategoryLabel(category))}</span>
          <small>${status}</small>
          ${removeButton}
        </span>
      `;
    })
    .join("");

  elements.settingsDataSummary.innerHTML = `
    <div class="settings-data-item">
      <span>总支出</span>
      <strong>${formatMoney(summary.totalCents)}</strong>
    </div>
    <div class="settings-data-item">
      <span>账单笔数</span>
      <strong>${state.expenses.length}</strong>
    </div>
    <div class="settings-data-item">
      <span>总人数</span>
      <strong>${summary.totalMembers}</strong>
    </div>
    <div class="settings-data-item">
      <span>类别数量</span>
      <strong>${state.categories.length}</strong>
    </div>
  `;
}

function renderTotalAmount(nextText, shouldAnimate) {
  const previousText = totalAmountText || elements.totalAmount.textContent || nextText;
  totalAmountText = nextText;
  window.clearTimeout(totalAmountSwapTimer);

  if (!shouldAnimate || previousText === nextText || prefersReducedMotion()) {
    elements.totalAmount.classList.remove("is-soft-refresh");
    elements.totalAmount.textContent = nextText;
    return;
  }

  elements.totalAmount.classList.remove("is-soft-refresh");
  elements.totalAmount.textContent = nextText;
  void elements.totalAmount.offsetWidth;
  elements.totalAmount.classList.add("is-soft-refresh");

  totalAmountSwapTimer = window.setTimeout(() => {
    elements.totalAmount.classList.remove("is-soft-refresh");
    elements.totalAmount.textContent = totalAmountText;
  }, getCssDurationMs("--number-swap-motion", 980) + 60);
}

function renderSummary({ animateFinancialChanges = false } = {}) {
  const summary = calculateSummary();
  const enterClass = animateFinancialChanges ? " is-entering" : "";
  renderTotalAmount(formatMoney(summary.totalCents), animateFinancialChanges);
  elements.shareAmount.textContent = formatMoney(summary.shareCents);
  elements.expenseCount.textContent = String(state.expenses.length);
  renderTotalMetricGradient(summary);

  elements.paidByFamily.innerHTML = state.families
    .map(
      (family) => `
        <div class="row-item family-row${enterClass}" style="${familyStyle(family.id)}">
          <span>${escapeHtml(family.name)}<small>${state.familyMembers[family.id] || 1} 人 · 应承担 ${formatMoney(summary.shareByFamily[family.id] || 0)}</small></span>
          <strong>${formatMoney(summary.paidByFamily[family.id] || 0)}</strong>
        </div>
      `,
    )
    .join("");

  const activeCategoryRows = state.categories.filter((category) => summary.categoryTotals[category] > 0);
  renderCategorySummaryGradient(summary, activeCategoryRows);
  elements.categorySummary.innerHTML = activeCategoryRows.length
    ? activeCategoryRows
        .map(
          (category) => `
            <div class="row-item category-row${enterClass}" style="${categoryStyle(category)}">
              <span>${escapeHtml(formatCategoryLabel(category))}</span>
              <strong>${formatMoney(summary.categoryTotals[category])}</strong>
            </div>
          `,
        )
        .join("")
    : `<div class="empty-state${enterClass}">暂无类别支出</div>`;

  elements.settlementList.innerHTML = summary.settlements.length
    ? summary.settlements
        .map(
          (settlement) => `
            <div class="settlement-item${enterClass}">
              <span>${escapeHtml(settlement.from)} 给 ${escapeHtml(settlement.to)}</span>
              <strong>${formatMoney(settlement.cents)}</strong>
            </div>
          `,
        )
        .join("")
    : `<div class="empty-state${enterClass}">当前无需转账</div>`;
}

function renderLedger({ animateFinancialChanges = false } = {}) {
  const visibleExpenses = getVisibleExpenses();
  const enterClass = animateFinancialChanges ? " is-entering" : "";

  if (!state.expenses.length) {
    elements.ledgerList.innerHTML = `<div class="empty-state${enterClass}">还没有账单<br><small>记下第一笔，立刻看到分摊和平账。</small></div>`;
    return;
  }

  if (!visibleExpenses.length) {
    elements.ledgerList.innerHTML = `<div class="empty-state${enterClass}">没有符合筛选的账单</div>`;
    return;
  }

  const groups = groupExpensesByDate(visibleExpenses);
  elements.ledgerList.innerHTML = groups
    .map(
      (group) => `
        <section class="ledger-day-group${enterClass}">
          <div class="ledger-day-heading">
            <time datetime="${escapeHtml(group.date)}">${escapeHtml(formatLedgerDate(group.date))}</time>
            <strong>${formatMoney(group.totalCents)}</strong>
          </div>
          <div class="ledger-day-items">
            ${group.expenses
              .map(
                (expense) => `
                  <article class="ledger-item${expense.id === lastAddedExpenseId ? " is-entering" : ""}${expense.id === editingExpenseId ? " is-editing" : ""}" style="${familyStyle(expense.payerId)}" data-expense-id="${escapeHtml(expense.id)}" tabindex="0" aria-label="编辑这笔账单">
                    <time class="ledger-date" datetime="${escapeHtml(expense.date)}">${escapeHtml(expense.date)}</time>
                    <div class="ledger-main">
                      <div class="ledger-title">
                        <span class="ledger-family">${escapeHtml(getFamilyName(expense.payerId))}</span>
                        <span class="category-pill" style="${categoryStyle(expense.category)}">${escapeHtml(formatCategoryLabel(expense.category))}</span>
                      </div>
                      <p class="ledger-note">${escapeHtml(expense.note || "无备注")}</p>
                    </div>
                    <strong class="ledger-amount">${formatMoney(expenseToCents(expense))}</strong>
                    <button class="delete-button" type="button" data-delete-id="${escapeHtml(expense.id)}" aria-label="删除这笔账">×</button>
                  </article>
                `,
              )
              .join("")}
          </div>
        </section>
      `,
    )
    .join("");
}

function getVisibleExpenses() {
  return state.expenses
    .filter((expense) => !state.ledgerFamilyFilter || expense.payerId === state.ledgerFamilyFilter)
    .filter((expense) => !state.ledgerCategoryFilter || expense.category === state.ledgerCategoryFilter)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

function groupExpensesByDate(expenses) {
  const groups = [];
  for (const expense of expenses) {
    let group = groups[groups.length - 1];
    if (!group || group.date !== expense.date) {
      group = { date: expense.date, totalCents: 0, expenses: [] };
      groups.push(group);
    }
    group.expenses.push(expense);
    group.totalCents += expenseToCents(expense);
  }
  return groups;
}

function formatLedgerDate(date) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(parsed);
}

function renderEditState() {
  const isEditing = Boolean(editingExpenseId);
  elements.editBanner.hidden = !isEditing;
  elements.submitButtonLabel.textContent = isEditing ? "保存修改" : "添加账单";
  elements.expenseForm.classList.toggle("is-editing", isEditing);
}

function renderMobileSubmitBar() {
  const family = getFamilyName(state.selectedPayerId);
  const category = formatCategoryLabel(state.activeCategory);
  const date = state.activeDate === todayIso() ? "今天" : state.activeDate.slice(5);
  const action = editingExpenseId ? "保存修改" : "添加账单";
  elements.mobileSubmitSummary.textContent = `${family} · ${category} · ${date}`;
  elements.mobileSubmitButton.querySelector(".button-label").textContent = action;
}

function handleExpenseSubmit(event) {
  event.preventDefault();
  elements.formError.textContent = "";
  elements.payerError.textContent = "";

  const amount = Number(elements.amountInput.value);
  const payerId = state.selectedPayerId;
  const category = elements.categoryInput.value;
  const date = normalizeDate(elements.dateInput.value, state.activeDate);
  const note = elements.noteInput.value.trim();

  if (!Number.isFinite(amount) || amount <= 0) {
    elements.formError.textContent = "请输入大于 0 的有效金额。";
    elements.amountInput.focus();
    return;
  }

  if (!state.families.some((family) => family.id === payerId)) {
    elements.payerError.textContent = "请选择付款家庭。";
    elements.familyRoster.querySelector(".family-tag")?.focus();
    return;
  }

  if (!category) {
    elements.formError.textContent = "请选择类别。";
    elements.categoryChips.querySelector(".selectable-category-chip")?.focus();
    return;
  }

  const expenseId = editingExpenseId || crypto.randomUUID();
  const savedExpense = {
    id: expenseId,
    amount: Math.round(amount * 100) / 100,
    payerId,
    category,
    note,
    date,
  };

  if (editingExpenseId) {
    state.expenses = state.expenses.map((expense) => (expense.id === editingExpenseId ? savedExpense : expense));
    editingExpenseId = "";
    showToast({ message: "已更新账单" });
  } else {
    state.expenses.push(savedExpense);
    lastAddedExpenseId = expenseId;
    triggerAddEffect(payerId, savedExpense.amount);
  }

  state.activeDate = date;
  state.activeCategory = category;
  state.selectedPayerId = payerId;

  elements.expenseForm.reset();
  render({ animateFinancialChanges: true });
  syncCloudExpense(savedExpense).catch(() => {
    showToast({ message: "云端保存失败，本地已保留" });
  });
  elements.amountInput.focus();
  window.setTimeout(() => {
    if (lastAddedExpenseId === expenseId) lastAddedExpenseId = "";
  }, 1783);
}

function handleInlineCategoryAdd(event) {
  event.preventDefault();
  addCategoryFromInput(elements.newCategoryInput);
}

function handleNewCategoryKeydown(event) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  addCategoryFromInput(elements.newCategoryInput);
}

function handleSettingsCategorySubmit(event) {
  event.preventDefault();
  addCategoryFromInput(elements.settingsNewCategoryInput);
}

function addCategoryFromInput(input) {
  const category = input.value.trim();
  if (!category) return;

  if (!state.categories.includes(category)) {
    state.categories.push(category);
    lastAddedCategory = category;
  }
  state.activeCategory = category;

  input.value = "";
  render();
  queueCloudSettingsSync();
  window.setTimeout(() => {
    if (lastAddedCategory === category) lastAddedCategory = "";
  }, 1560);
}

function handleCategorySelection(event) {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  state.activeCategory = normalizeCategory(button.dataset.category, state.activeCategory);
  elements.categoryInput.value = state.activeCategory;
  renderCategories();
  renderMobileSubmitBar();
  saveState();
}

function handleSettingsCategoryClick(event) {
  const button = event.target.closest("[data-remove-category]");
  if (!button) return;

  const category = button.dataset.removeCategory;
  if (defaultCategories.includes(category)) return;
  if (state.expenses.some((expense) => expense.category === category)) return;
  const categoryIndex = state.categories.indexOf(category);
  state.categories = state.categories.filter((item) => item !== category);
  if (state.activeCategory === category) {
    state.activeCategory = state.categories[0] || defaultCategories[0];
  }
  render();
  queueCloudSettingsSync();
  showToast({
    message: `已删除“${category}”`,
    actionLabel: "撤销",
    onAction: () => {
      state.categories.splice(Math.max(categoryIndex, 0), 0, category);
      state.categories = normalizeCategories(state.categories);
      state.activeCategory = category;
      render();
      queueCloudSettingsSync();
    },
  });
}

function handleFamilyMemberStep(event) {
  const button = event.target.closest("[data-member-step]");
  if (!button) return;

  const familyId = normalizePayerId(button.dataset.memberStep);
  if (!familyId) return;

  const current = state.familyMembers[familyId] || 1;
  const step = Number(button.dataset.step) || 0;
  const count = Math.max(1, Math.min(20, current + step));
  state.familyMembers[familyId] = count;
  render({ animateFinancialChanges: true });
  queueCloudSettingsSync();
}

function handleLedgerClick(event) {
  const button = event.target.closest("[data-delete-id]");
  if (button) {
    deleteExpense(button.dataset.deleteId, button.closest(".ledger-item"));
    return;
  }

  const item = event.target.closest("[data-expense-id]");
  if (!item) return;
  startEditExpense(item.dataset.expenseId);
}

function handleLedgerKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  const item = event.target.closest("[data-expense-id]");
  if (!item || event.target.closest("button")) return;
  event.preventDefault();
  startEditExpense(item.dataset.expenseId);
}

function deleteExpense(expenseId, item) {
  const expenseIndex = state.expenses.findIndex((expense) => expense.id === expenseId);
  if (expenseIndex < 0) return;
  const [deletedExpense] = state.expenses.slice(expenseIndex, expenseIndex + 1);
  item?.classList.add("is-removing");
  const button = item?.querySelector("[data-delete-id]");
  if (button) button.disabled = true;

  const delay = getCssDurationMs("--motion", 240) + 40;
  window.setTimeout(() => {
    state.expenses = state.expenses.filter((expense) => expense.id !== expenseId);
    deleteCloudExpense(expenseId).catch(() => {
      showToast({ message: "云端删除失败，本地已删除" });
    });
    if (editingExpenseId === expenseId) cancelEdit();
    render({ animateFinancialChanges: true });
    showToast({
      message: "已删除账单",
      actionLabel: "撤销",
      onAction: () => {
        state.expenses.splice(Math.min(expenseIndex, state.expenses.length), 0, deletedExpense);
        render({ animateFinancialChanges: true });
        syncCloudExpense(deletedExpense).catch(() => {
          showToast({ message: "云端撤销失败，本地已恢复" });
        });
      },
    });
  }, delay);
}

function handleClearLedger() {
  if (!state.expenses.length) return;

  const deletedExpenses = [...state.expenses];
  const previousDate = state.activeDate;
  const items = [...elements.ledgerList.querySelectorAll(".ledger-item")];
  items.forEach((item, index) => {
    window.setTimeout(() => item.classList.add("is-removing"), index * 63);
  });

  window.setTimeout(
    () => {
      state.expenses = [];
      state.activeDate = todayIso();
      editingExpenseId = "";
      clearCloudLedger().catch(() => {
        showToast({ message: "云端清空失败，本地已清空" });
      });
      render({ animateFinancialChanges: true });
      showToast({
        message: "已清空账本",
        actionLabel: "撤销",
        onAction: () => {
          state.expenses = deletedExpenses;
          state.activeDate = previousDate;
          render({ animateFinancialChanges: true });
          syncAllLocalDataToCloud().catch(() => {
            showToast({ message: "云端撤销失败，本地已恢复" });
          });
        },
      });
    },
    items.length ? Math.min(1159, 580 + items.length * 63) : 0,
  );
}

function openSettings() {
  elements.settingsView.hidden = false;
  document.body.classList.add("settings-open");
  renderSettings();
  elements.closeSettingsButton.focus();
}

function closeSettings() {
  elements.settingsView.hidden = true;
  document.body.classList.remove("settings-open");
  elements.openSettingsButton.focus();
}

function handleFamilySelection(event) {
  const button = event.target.closest("[data-payer-id]");
  if (!button) return;

  state.selectedPayerId = normalizePayerId(button.dataset.payerId);
  elements.payerError.textContent = "";
  applySelectedFamilyTheme();
  renderFamilyRoster();
  applySubmitButtonTheme();
  renderMobileSubmitBar();
  updateAmountMotionState();
  saveState();
}

function renderTotalMetricGradient(summary) {
  const activeSegments = getPaidSegments(summary);
  const gradientStops = buildSoftGradientStops(activeSegments);
  const aura = buildGradientAura(activeSegments);
  const firstFamily = activeSegments[0].family;
  const lastFamily = activeSegments[activeSegments.length - 1].family;

  elements.totalMetric.style.setProperty("--total-gradient", `linear-gradient(135deg, ${gradientStops.join(", ")})`);
  elements.totalMetric.style.setProperty("--total-aura", aura);
  elements.totalMetric.style.setProperty("--total-glow-left", colorWithAlpha(getFamilyVisual(firstFamily.id).gradient, 0.42));
  elements.totalMetric.style.setProperty("--total-glow-right", colorWithAlpha(getFamilyVisual(lastFamily.id).gradient, 0.42));
}

function renderCategorySummaryGradient(summary, activeCategories) {
  const segments = getCategorySegments(summary, activeCategories);
  const gradientStops = buildCategoryGradientStops(segments);
  const aura = buildCategoryGradientAura(segments);
  const firstCategory = segments[0].category;
  const lastCategory = segments[segments.length - 1].category;

  elements.categorySummaryBlock.style.setProperty("--category-summary-gradient", `linear-gradient(135deg, ${gradientStops.join(", ")})`);
  elements.categorySummaryBlock.style.setProperty("--category-summary-aura", aura);
  elements.categorySummaryBlock.style.setProperty("--category-glow-left", colorWithAlpha(getCategoryVisual(firstCategory).gradient, 0.46));
  elements.categorySummaryBlock.style.setProperty("--category-glow-right", colorWithAlpha(getCategoryVisual(lastCategory).gradient, 0.46));
}

function getPaidSegments(summary) {
  const paidFamilies =
    summary.totalCents > 0
      ? state.families.filter((family) => (summary.paidByFamily[family.id] || 0) > 0)
      : state.families;
  const families = paidFamilies.length ? paidFamilies : [state.families[0]];
  let cursor = 0;

  return families.map((family, index) => {
    const paid = summary.paidByFamily[family.id] || 0;
    const share = summary.totalCents > 0 ? paid / summary.totalCents : 1 / families.length;
    const start = cursor;
    const end = index === families.length - 1 ? 100 : cursor + share * 100;
    cursor = end;
    return { family, start, end, share };
  });
}

function buildSoftGradientStops(segments) {
  if (segments.length === 1) {
    const color = getFamilyVisual(segments[0].family.id).gradient;
    return [
      `${colorWithAlpha(color, 0.52)} 0%`,
      `${colorWithAlpha(color, 0.62)} 52%`,
      `${colorWithAlpha(color, 0.46)} 100%`,
    ];
  }

  const stops = [`${colorWithAlpha(getFamilyVisual(segments[0].family.id).gradient, 0.54)} 0%`];

  for (let index = 0; index < segments.length - 1; index += 1) {
    const current = segments[index];
    const next = segments[index + 1];
    const currentColor = getFamilyVisual(current.family.id).gradient;
    const nextColor = getFamilyVisual(next.family.id).gradient;
    const boundary = current.end;
    const softWidth = Math.min(14, Math.max(6, Math.min(current.end - current.start, next.end - next.start) * 0.34));
    const left = Math.max(current.start, boundary - softWidth);
    const right = Math.min(next.end, boundary + softWidth);
    const mixed = mixHexColors(currentColor, nextColor, 0.5);

    stops.push(
      `${colorWithAlpha(currentColor, 0.54)} ${formatPercent(left)}`,
      `${colorWithAlpha(mixed, 0.58)} ${formatPercent(boundary)}`,
      `${colorWithAlpha(nextColor, 0.54)} ${formatPercent(right)}`,
    );
  }

  const finalColor = getFamilyVisual(segments[segments.length - 1].family.id).gradient;
  stops.push(`${colorWithAlpha(finalColor, 0.48)} 100%`);
  return stops;
}

function buildGradientAura(segments) {
  return segments
    .map((segment, index) => {
      const center = segment.start + (segment.end - segment.start) / 2;
      const y = index % 2 === 0 ? 16 : 52;
      const color = colorWithAlpha(getFamilyVisual(segment.family.id).gradient, 0.32);
      return `radial-gradient(circle at ${formatPercent(center)} ${y}%, ${color}, transparent 48%)`;
    })
    .join(", ");
}

function getCategorySegments(summary, activeCategories) {
  const categories = activeCategories.length ? activeCategories : defaultCategories.slice(0, 3);
  let cursor = 0;

  return categories.map((category, index) => {
    const cents = summary.categoryTotals[category] || 0;
    const share = summary.totalCents > 0 ? cents / summary.totalCents : 1 / categories.length;
    const start = cursor;
    const end = index === categories.length - 1 ? 100 : cursor + share * 100;
    cursor = end;
    return { category, start, end, share };
  });
}

function buildCategoryGradientStops(segments) {
  if (segments.length === 1) {
    const color = getCategoryVisual(segments[0].category).gradient;
    return [
      `${colorWithAlpha(color, 0.52)} 0%`,
      `${colorWithAlpha(color, 0.62)} 54%`,
      `${colorWithAlpha(color, 0.46)} 100%`,
    ];
  }

  const stops = [`${colorWithAlpha(getCategoryVisual(segments[0].category).gradient, 0.52)} 0%`];

  for (let index = 0; index < segments.length - 1; index += 1) {
    const current = segments[index];
    const next = segments[index + 1];
    const currentColor = getCategoryVisual(current.category).gradient;
    const nextColor = getCategoryVisual(next.category).gradient;
    const boundary = current.end;
    const softWidth = Math.min(16, Math.max(7, Math.min(current.end - current.start, next.end - next.start) * 0.36));
    const left = Math.max(current.start, boundary - softWidth);
    const right = Math.min(next.end, boundary + softWidth);
    const mixed = mixHexColors(currentColor, nextColor, 0.5);

    stops.push(
      `${colorWithAlpha(currentColor, 0.52)} ${formatPercent(left)}`,
      `${colorWithAlpha(mixed, 0.58)} ${formatPercent(boundary)}`,
      `${colorWithAlpha(nextColor, 0.52)} ${formatPercent(right)}`,
    );
  }

  const finalColor = getCategoryVisual(segments[segments.length - 1].category).gradient;
  stops.push(`${colorWithAlpha(finalColor, 0.46)} 100%`);
  return stops;
}

function buildCategoryGradientAura(segments) {
  return segments
    .map((segment, index) => {
      const center = segment.start + (segment.end - segment.start) / 2;
      const y = index % 2 === 0 ? 16 : 52;
      const color = colorWithAlpha(getCategoryVisual(segment.category).gradient, 0.32);
      return `radial-gradient(circle at ${formatPercent(center)} ${y}%, ${color}, transparent 45%)`;
    })
    .join(", ");
}

function familyStyle(familyId) {
  const visual = getFamilyVisual(familyId);
  return `--family-color: ${visual.color}; --family-text: ${visual.text}; --family-soft: ${visual.soft}; --family-wash: ${visual.wash};`;
}

function applySelectedFamilyTheme() {
  if (!state.selectedPayerId) {
    elements.amountLabel.classList.remove("amount-themed");
    elements.amountLabel.style.removeProperty("--selected-family-color");
    elements.amountLabel.style.removeProperty("--selected-family-text");
    elements.amountLabel.style.removeProperty("--selected-family-soft");
    elements.amountLabel.style.removeProperty("--selected-family-wash");
    elements.amountLabel.style.removeProperty("--selected-family-glow");
    return;
  }

  const style = getFamilyVisual(state.selectedPayerId);
  elements.amountLabel.classList.add("amount-themed");
  elements.amountLabel.style.setProperty("--selected-family-color", style.color);
  elements.amountLabel.style.setProperty("--selected-family-text", style.text);
  elements.amountLabel.style.setProperty("--selected-family-soft", style.soft);
  elements.amountLabel.style.setProperty("--selected-family-wash", colorWithAlpha(style.color, 0.24));
  elements.amountLabel.style.setProperty("--selected-family-glow", colorWithAlpha(style.color, 0.42));
}

function applySubmitButtonTheme() {
  const style = state.selectedPayerId ? getFamilyVisual(state.selectedPayerId) : null;
  const color = style?.color || "#176c5f";
  const text = style?.text || "#176c5f";
  const wash = style?.wash || "rgba(23, 108, 95, 0.14)";
  const glow = colorWithAlpha(color, state.selectedPayerId ? 0.30 : 0.22);
  [elements.expenseForm, elements.mobileSubmitBar].forEach((element) => {
    element.style.setProperty("--submit-color", color);
    element.style.setProperty("--submit-text", text);
    element.style.setProperty("--submit-wash", wash);
    element.style.setProperty("--submit-glow", glow);
  });
  elements.expenseForm.classList.toggle("submit-themed", Boolean(state.selectedPayerId));
  elements.mobileSubmitBar.classList.toggle("submit-themed", Boolean(state.selectedPayerId));
}

function getCssDurationMs(variableName, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  if (raw.endsWith("ms")) return Number.parseFloat(raw) || fallback;
  if (raw.endsWith("s")) return (Number.parseFloat(raw) || fallback / 1000) * 1000;
  return fallback;
}

function colorWithAlpha(hex, alpha) {
  const { red, green, blue } = hexToRgb(hex);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function mixHexColors(firstHex, secondHex, weight) {
  const first = hexToRgb(firstHex);
  const second = hexToRgb(secondHex);
  const mix = (from, to) => Math.round(from + (to - from) * weight);
  return rgbToHex(mix(first.red, second.red), mix(first.green, second.green), mix(first.blue, second.blue));
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  return {
    red: (value >> 16) & 255,
    green: (value >> 8) & 255,
    blue: value & 255,
  };
}

function rgbToHex(red, green, blue) {
  const toHex = (value) => value.toString(16).padStart(2, "0");
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function formatPercent(value) {
  return `${value.toFixed(2)}%`;
}

function updateAmountMotionState() {
  elements.amountLabel.classList.toggle("amount-active", document.activeElement === elements.amountInput);
}

function pulseAmountField() {
  elements.amountLabel.classList.remove("amount-pulse");
  void elements.amountLabel.offsetWidth;
  elements.amountLabel.classList.add("amount-pulse");
}

function startEditExpense(expenseId) {
  const expense = state.expenses.find((item) => item.id === expenseId);
  if (!expense) return;

  editingExpenseId = expense.id;
  state.selectedPayerId = expense.payerId;
  state.activeCategory = expense.category;
  state.activeDate = expense.date;
  render();
  elements.amountInput.value = String(expense.amount);
  elements.noteInput.value = expense.note;
  elements.expenseForm.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  elements.amountInput.focus();
  showToast({ message: "已载入账单，可直接修改" });
}

function cancelEdit() {
  editingExpenseId = "";
  elements.expenseForm.reset();
  render();
  elements.amountInput.focus();
}

function showToast({ message, actionLabel = "", onAction = null }) {
  window.clearTimeout(toastTimer);
  elements.toastHost.innerHTML = `
    <div class="toast is-visible">
      <span>${escapeHtml(message)}</span>
      ${actionLabel ? `<button class="toast-action" type="button">${escapeHtml(actionLabel)}</button>` : ""}
    </div>
  `;

  const actionButton = elements.toastHost.querySelector(".toast-action");
  actionButton?.addEventListener(
    "click",
    () => {
      window.clearTimeout(toastTimer);
      elements.toastHost.innerHTML = "";
      onAction?.();
    },
    { once: true },
  );

  toastTimer = window.setTimeout(() => {
    elements.toastHost.innerHTML = "";
  }, actionLabel ? 5200 : 2600);
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function triggerAddEffect(payerId, amount) {
  const visual = getFamilyVisual(payerId);
  const themedGlow = colorWithAlpha(visual.color, 0.36);
  elements.expenseForm.classList.remove("form-celebrate");
  elements.expenseForm.style.setProperty("--submit-color", visual.color);
  elements.expenseForm.style.setProperty("--submit-glow", themedGlow);
  void elements.expenseForm.offsetWidth;
  elements.expenseForm.classList.add("form-celebrate");
  triggerTotalAbsorbEffect(visual);
  emitLedgerToken(visual, amount);
  window.setTimeout(() => {
    elements.expenseForm.classList.remove("form-celebrate");
  }, 1560);
}

function triggerTotalAbsorbEffect(visual) {
  elements.totalMetric.classList.remove("is-absorbing");
  elements.totalMetric.style.setProperty("--absorb-color", colorWithAlpha(visual.color, 0.18));
  elements.totalMetric.style.setProperty("--absorb-glow", colorWithAlpha(visual.gradient, 0.30));
  void elements.totalMetric.offsetWidth;
  elements.totalMetric.classList.add("is-absorbing");
  window.setTimeout(() => {
    elements.totalMetric.classList.remove("is-absorbing");
  }, 1320);
}

function emitLedgerToken(visual, amount) {
  if (prefersReducedMotion()) return;

  const amountRect = elements.amountLabel.getBoundingClientRect();
  const startX = amountRect.left + amountRect.width * 0.5;
  const startY = amountRect.top + amountRect.height * 0.38;
  const token = document.createElement("div");

  token.className = "ledger-token";
  token.textContent = formatMoney(Math.round(Number(amount) * 100));
  token.style.setProperty("--token-color", visual.color);
  token.style.setProperty("--token-text", visual.text);
  token.style.setProperty("--token-glow", colorWithAlpha(visual.color, 0.34));
  token.style.setProperty("--start-x", `${startX}px`);
  token.style.setProperty("--start-y", `${startY}px`);
  document.body.append(token);
  token.addEventListener("animationend", () => token.remove(), { once: true });
}

function updateClearLedgerButton() {
  const isEmpty = state.expenses.length === 0;
  elements.settingsClearLedgerButton.disabled = isEmpty;
  elements.settingsClearLedgerButton.setAttribute("aria-disabled", String(isEmpty));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

elements.expenseForm.addEventListener("submit", handleExpenseSubmit);
elements.categoryForm.addEventListener("click", (event) => {
  if (event.target.closest("button")) handleInlineCategoryAdd(event);
});
elements.newCategoryInput.addEventListener("keydown", handleNewCategoryKeydown);
elements.categoryChips.addEventListener("click", handleCategorySelection);
elements.settingsCategoryForm.addEventListener("submit", handleSettingsCategorySubmit);
elements.settingsCategoryChips.addEventListener("click", handleSettingsCategoryClick);
elements.settingsFamilyList.addEventListener("click", handleFamilyMemberStep);
elements.familyRoster.addEventListener("click", handleFamilySelection);
elements.ledgerList.addEventListener("click", handleLedgerClick);
elements.ledgerList.addEventListener("keydown", handleLedgerKeydown);
elements.settingsClearLedgerButton.addEventListener("click", handleClearLedger);
elements.createCloudLedgerButton.addEventListener("click", createCloudLedger);
elements.copyShareLinkButton.addEventListener("click", copyShareLink);
elements.openSettingsButton.addEventListener("click", openSettings);
elements.closeSettingsButton.addEventListener("click", closeSettings);
elements.settingsBackdrop.addEventListener("click", closeSettings);
elements.cancelEditButton.addEventListener("click", cancelEdit);
elements.mobileSubmitButton.addEventListener("click", () => {
  elements.expenseForm.requestSubmit();
});
elements.amountInput.addEventListener("focus", updateAmountMotionState);
elements.amountInput.addEventListener("blur", updateAmountMotionState);
elements.amountInput.addEventListener("input", () => {
  updateAmountMotionState();
  pulseAmountField();
});
elements.categoryInput.addEventListener("change", () => {
  state.activeCategory = elements.categoryInput.value || state.activeCategory;
  renderMobileSubmitBar();
  saveState();
});
elements.dateInput.addEventListener("change", () => {
  state.activeDate = normalizeDate(elements.dateInput.value, state.activeDate);
  elements.dateInput.value = state.activeDate;
  renderMobileSubmitBar();
  saveState();
});
elements.ledgerFamilyFilter.addEventListener("change", () => {
  state.ledgerFamilyFilter = normalizePayerId(elements.ledgerFamilyFilter.value);
  render();
});
elements.ledgerCategoryFilter.addEventListener("change", () => {
  state.ledgerCategoryFilter = normalizeCategoryFilter(elements.ledgerCategoryFilter.value, state.categories);
  render();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.settingsView.hidden) {
    closeSettings();
  }
});

render();
pullCloudLedger({ announce: Boolean(cloudState.shareToken) });
