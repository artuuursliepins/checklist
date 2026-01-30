// Materiālu ķeksītis: PWA ar localStorage.
// Statusi: NEED -> ORDERED -> RECEIVED, un checkbox "atrasts/pārbaudīts".

const STORAGE_KEY = "materials_app_state_v1";

const DEFAULT_ITEMS = [
  // 24V barošana un drošība
  mk("Barošana (24V) un drošība", "24V barošanas bloks 300–350W (ieteic. 350W)", 1, "Mean Well LRS-350-24 | 24V 350W switching power supply metal", "Galvenā 24V kopne plafonam."),
  mk("Barošana (24V) un drošība", "IEC C14 ieeja ar slēdzi un drošinātāju", 1, "IEC C14 inlet fuse switch 230V", "Lai nav pliki vadi un lai var atslēgt."),
  mk("Barošana (24V) un drošība", "DC drošinātāju bloks (blade fuse block 6-way)", 1, "blade fuse block 6 way | automotive blade fuse holder", "Atsevišķas līnijas: balta, RGB, 5V buck u.c."),
  mk("Barošana (24V) un drošība", "ATO/ATC drošinātāju komplekts", 1, "ATO blade fuse assortment", "Paņem dažādus nominālus (5A, 7.5A, 10A, 15A, 20A)."),
  mk("Barošana (24V) un drošība", "Klemmju bloki / sadales bloks DC (termināļi)", 1, "DIN rail terminal block | busbar distribution block 12V 24V", "Sakārtotai sadalei plafona kārbā."),
  mk("Barošana (24V) un drošība", "WAGO 221 savienotāji (assortment)", 1, "WAGO 221 lever connector assortment", "Ērtāk un drošāk nekā savīt un aizmirst."),

  // DC-DC pārveide uz 5V
  mk("DC-DC (24V → 5V)", "DC-DC buck 24V → 5V 3A (ESP32/loģikai)", 1, "DC-DC buck 24V to 5V 3A", "Vienam kontrolierim parasti pietiek."),
  mk("DC-DC (24V → 5V)", "DC-DC buck 24V → 5V 20A (opc. matricām)", 1, "DC-DC buck 24V to 5V 20A", "Ja ir 2–4× 8×8 matricas vai cita 5V jauda."),
  mk("DC-DC (24V → 5V)", "Alternatīva: 5V 20A barošanas bloks (opc.)", 0, "5V 20A power supply | Mean Well LRS-100-5", "Ja gribi atsevišķu 5V PSU (siltums/rezerves)."),

  // Kontrole: ESP32 un plates
  mk("Kontrole (ESP32) un plates", "ESP32 kontrolieris (WLED/ESPHome) Type-C", 1, "ESP32 DevKit V1 Type-C", "Var arī ESP32-S3, ja gribi vairāk rezervju."),
  mk("Kontrole (ESP32) un plates", "ESP32-S3 N16R8 (opc., ja vajag jaudu/PSRAM)", 0, "ESP32-S3 DevKitC-1 N16R8 Type-C", "Noder balss/smagākiem efektiem."),
  mk("Kontrole (ESP32) un plates", "4-kanālu MOSFET PWM plate (3.3V loģika)", 1, "4 channel MOSFET driver module PWM 3.3V logic", "Balta (1ch) + RGB/RGBW (3–4ch)."),
  mk("Kontrole (ESP32) un plates", "1-kanāla MOSFET modulis (opc., rezerves)", 0, "MOSFET module 1 channel 3.3V logic", "Ja gribi atdalīt līnijas vai rezerves."),
  mk("Kontrole (ESP32) un plates", "Loģikas līmeņa pārveidotājs 74AHCT125 (opc.)", 0, "74AHCT125 level shifter | SN74AHCT125N", "Vajadzīgs, ja ir 5V datu līnijas digitālām lentēm."),

  // LED lentes
  mk("LED (24V) un savienojumi", "24V silti balta lente (W/m pēc izvēles) – garums (m)", 15, "24V warm white LED strip 2835 9.6W/m | 14.4W/m", "Ievadi precīzu metru skaitu pēc reālā plāna."),
  mk("LED (24V) un savienojumi", "24V RGB lente (opc.) – garums (m)", 5, "24V RGB LED strip 5050 60LED/m", "Ja gribi krāsainu akcentu."),
  mk("LED (24V) un savienojumi", "1000µF kondensators (>=35V) pie 24V kopnes", 2, "1000uF 35V capacitor", "Viens pie ieejas, viens pie lentes sākuma (praktiski)."),
  mk("LED (24V) un savienojumi", "Rezistors 330Ω (opc., datu līnijai)", 5, "330 ohm resistor kit", "Tikai, ja ir digitālā lente/datu vads."),
  mk("LED (24V) un savienojumi", "Skrūvju termināļi 5.08mm (2-pin, 3-pin)", 1, "screw terminal block 2 pin 5.08mm | 3 pin", "Ērti savienošanai."),
  mk("LED (24V) un savienojumi", "JST savienotāji (opc., ja vajag ātrus atvienojumus)", 1, "JST-SM connector 2 pin | 3 pin | JST-XH 2.54 kit", "Atkarīgs no tā, kā noformēsi līnijas."),

  // Matricas (opc.)
  mk("5V matricas (opc.)", "8×8 WS2812B matrica (64 LED) – gab.", 0, "8x8 WS2812B matrix", "Ja gribi pikseļu efektus plafonā."),
  mk("5V matricas (opc.)", "Biezāks 5V vads matricām (opc.)", 0, "silicone wire 14AWG | 16AWG", "Ja matricas ir 2–4 gab., strāvas nav joks."),

  // Kaste/noformējums
  mk("Kaste un montāža", "ABS projekta kārba (ap 200×150×80 vai lielāka)", 1, "ABS project box 200x150x80", "Lai viss ir servisējams un drošs."),
  mk("Kaste un montāža", "Kabeļu ievadi (PG7/PG9) komplekts", 1, "cable gland PG7 PG9 assortment", "Pret malu berzi un izvilkšanu."),
  mk("Kaste un montāža", "DIN sliede 35mm (opc.)", 1, "DIN rail 35mm 20cm", "Ja gribi kārtīgu montāžu."),
  mk("Kaste un montāža", "Stiprinājumi: M2/M3 skrūves + distanceri", 1, "m2 m3 screw kit | standoff spacer kit", "Plātēm un moduļiem."),
  mk("Kaste un montāža", "Perfboard/prototipēšanas plate (opc.)", 1, "prototype board 2.54mm perfboard", "Ja vajag “savaŗīt” savienojumus kā cilvēks."),

  // Vadi un “sīkumi”
  mk("Vadi un sīkumi", "Silikona vadi (16AWG/18AWG/22AWG) komplekts", 1, "silicone wire 16AWG 18AWG 22AWG", "24V jaudai + loģikai."),
  mk("Vadi un sīkumi", "Dupont vadi + pin header komplekts", 1, "dupont jumper wires kit | pin header 2.54 assortment", "Prototipēšanai un savienojumiem."),
  mk("Vadi un sīkumi", "Termosarukuma caurules komplekts", 1, "heat shrink tubing kit", "Lai nav “plikas vietas”."),
  mk("Vadi un sīkumi", "Lodēšanas alva + flux (opc.)", 0, "solder wire 0.8mm | solder flux pen", "Ja viss nav tikai ar spraudņiem.")
];

function mk(section, name, qty, ali, notes="") {
  return {
    id: cryptoId(),
    section,
    name,
    qty,
    ali,       // AliExpress meklēšanas kods/frāze
    notes,
    checked: false,
    status: "NEED" // NEED | ORDERED | RECEIVED
  };
}

function cryptoId(){
  // Bez ārējām bibliotēkām
  return "i_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

const el = {
  list: document.getElementById("list"),
  stats: document.getElementById("stats"),
  search: document.getElementById("search"),
  sectionFilter: document.getElementById("sectionFilter"),
  statusFilter: document.getElementById("statusFilter"),
  onlyUnchecked: document.getElementById("onlyUnchecked"),
  exportBtn: document.getElementById("exportBtn"),
  importBtn: document.getElementById("importBtn"),
  importFile: document.getElementById("importFile"),
  resetBtn: document.getElementById("resetBtn"),
};

let state = loadState();

boot();
render();

function boot(){
  // Reģistrē service worker (strādā tikai caur http(s), nevis file://)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  }

  // Sekciju filtrs
  const sections = [...new Set(state.items.map(i => i.section))].sort();
  for (const s of sections) {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    el.sectionFilter.appendChild(opt);
  }

  el.search.addEventListener("input", render);
  el.sectionFilter.addEventListener("change", render);
  el.statusFilter.addEventListener("change", render);
  el.onlyUnchecked.addEventListener("change", render);

  el.exportBtn.addEventListener("click", doExport);
  el.importBtn.addEventListener("click", () => el.importFile.click());
  el.importFile.addEventListener("change", doImport);
  el.resetBtn.addEventListener("click", doReset);
}

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { items: DEFAULT_ITEMS };

  try {
    const parsed = JSON.parse(raw);
    // Ja kādreiz atjauno sarakstu, pievieno jaunus itemus (pēc nosaukuma+sekcijas)
    const merged = mergeDefaults(parsed.items || [], DEFAULT_ITEMS);
    return { items: merged };
  } catch {
    return { items: DEFAULT_ITEMS };
  }
}

function mergeDefaults(existing, defaults){
  const key = (x) => `${x.section}||${x.name}`.toLowerCase();
  const map = new Map(existing.map(x => [key(x), x]));
  for (const d of defaults) {
    const k = key(d);
    if (!map.has(k)) map.set(k, d);
  }
  return [...map.values()];
}

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getFiltered(){
  const q = el.search.value.trim().toLowerCase();
  const sec = el.sectionFilter.value;
  const st = el.statusFilter.value;
  const onlyUnchecked = el.onlyUnchecked.checked;

  return state.items.filter(i => {
    if (sec !== "ALL" && i.section !== sec) return false;
    if (st !== "ALL" && i.status !== st) return false;
    if (onlyUnchecked && i.checked) return false;

    if (!q) return true;
    const hay = `${i.section} ${i.name} ${i.ali} ${i.notes}`.toLowerCase();
    return hay.includes(q);
  });
}

function render(){
  const items = getFiltered();

  const total = state.items.length;
  const checked = state.items.filter(i => i.checked).length;
  const received = state.items.filter(i => i.status === "RECEIVED").length;
  el.stats.textContent = `Kopā: ${total} | Ieķeksēti: ${checked} | Statusā “Saņemts”: ${received}`;

  el.list.innerHTML = "";

  // Grupē pēc sekcijas
  const grouped = new Map();
  for (const i of items) {
    if (!grouped.has(i.section)) grouped.set(i.section, []);
    grouped.get(i.section).push(i);
  }

  for (const [section, arr] of grouped.entries()) {
    const h = document.createElement("div");
    h.className = "card";
    h.innerHTML = `<div class="itemTitle"><span class="name">${escapeHtml(section)}</span>
      <span class="chip">${arr.length} vien.</span></div>`;
    el.list.appendChild(h);

    for (const it of arr) {
      el.list.appendChild(renderItem(it));
    }
  }
}

function renderItem(it){
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="row">
      <input type="checkbox" ${it.checked ? "checked" : ""} data-id="${it.id}" class="chk" />
      <div style="flex:1">
        <div class="itemTitle">
          <span class="name">${escapeHtml(it.name)}</span>
          <span class="chip">${escapeHtml(it.statusLabel || statusLabel(it.status))}</span>
          <span class="chip">Qty: <b>${escapeHtml(String(it.qty))}</b></span>
        </div>
        <div class="small"><b>AliExpress:</b> <code>${escapeHtml(it.ali)}</code></div>
        ${it.notes ? `<div class="small">${escapeHtml(it.notes)}</div>` : ""}
        <div class="meta">
          <input class="qty" type="number" min="0" step="1" value="${escapeHtml(String(it.qty))}" data-id="${it.id}" data-field="qty" />
          <select class="status" data-id="${it.id}" data-field="status">
            <option value="NEED" ${it.status==="NEED"?"selected":""}>Jāpērk</option>
            <option value="ORDERED" ${it.status==="ORDERED"?"selected":""}>Pasūtīts</option>
            <option value="RECEIVED" ${it.status==="RECEIVED"?"selected":""}>Saņemts</option>
          </select>
          <button class="btn" data-act="copy" data-id="${it.id}">Kopēt meklējumu</button>
        </div>
      </div>
    </div>
  `;

  // notikumi
  card.querySelector(".chk").addEventListener("change", (e) => {
    const item = byId(e.target.dataset.id);
    item.checked = e.target.checked;
    save();
    render();
  });

  card.querySelectorAll("[data-field]").forEach(inp => {
    inp.addEventListener("change", (e) => {
      const item = byId(e.target.dataset.id);
      const field = e.target.dataset.field;
      if (field === "qty") item.qty = Number(e.target.value || 0);
      if (field === "status") item.status = e.target.value;
      save();
      render();
    });
  });

  card.querySelector('[data-act="copy"]').addEventListener("click", async (e) => {
    const item = byId(e.target.dataset.id);
    try {
      await navigator.clipboard.writeText(item.ali);
      e.target.textContent = "Nokopēts";
      setTimeout(() => (e.target.textContent = "Kopēt meklējumu"), 900);
    } catch {
      // fallback: nekas, dzīvojam tālāk
    }
  });

  return card;
}

function byId(id){
  const x = state.items.find(i => i.id === id);
  if (!x) throw new Error("Nav itema ar id=" + id);
  return x;
}

function statusLabel(s){
  if (s === "NEED") return "Jāpērk";
  if (s === "ORDERED") return "Pasūtīts";
  if (s === "RECEIVED") return "Saņemts";
  return s;
}

function doExport(){
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `materials-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function doImport(e){
  const file = e.target.files?.[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const imported = JSON.parse(String(r.result || ""));
      if (!imported.items || !Array.isArray(imported.items)) throw new Error("Nepareizs formāts");
      state.items = mergeDefaults(imported.items, DEFAULT_ITEMS);
      save();
      render();
    } catch {
      alert("Import neizdevās. Failam jābūt JSON ar lauku 'items'.");
    }
  };
  r.readAsText(file);
  e.target.value = "";
}

function doReset(){
  const ok = confirm("Reset nozīmē: atpakaļ uz sākotnējo sarakstu un statusiem. Turpināt?");
  if (!ok) return;
  state = { items: DEFAULT_ITEMS };
  save();
  render();
}

function escapeHtml(s){
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}