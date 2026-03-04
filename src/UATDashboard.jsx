import { useState } from "react";

// ── colour maps ──────────────────────────────────────────────────────────────
const PRIORITY_COLOR = {
  Critical: "bg-red-100 text-red-700",
  High:     "bg-orange-100 text-orange-700",
  Medium:   "bg-yellow-100 text-yellow-700",
};
const STATUS_COLOR = {
  Pass:        "bg-green-100 text-green-700",
  Fail:        "bg-red-100 text-red-700",
  Pending:     "bg-gray-100 text-gray-500",
  Blocked:     "bg-purple-100 text-purple-700",
  Open:        "bg-orange-100 text-orange-700",
  "In Progress":"bg-blue-100 text-blue-700",
  Resolved:    "bg-green-100 text-green-700",
  Approved:    "bg-green-100 text-green-700",
  Rejected:    "bg-red-100 text-red-700",
};
const TC_STATUSES   = ["Pending","Pass","Fail","Blocked"];
const DEF_STATUSES  = ["Open","In Progress","Resolved"];
const SO_STATUSES   = ["Pending","Approved","Rejected"];

// ── static data ──────────────────────────────────────────────────────────────
const TC_HEADERS = ["Test ID","Module","Form","Role","Priority","Test Title","Precondition","Test Steps","Expected Result","Status","Actual Result","Defect ID","Notes"];
const TC_ROWS_INIT = [
  ["UAT-01-1.1","Module 1","Form 1A","Field Agent","High","Open app and sync","App installed; WiFi available","Open app > sync > tap Community Registration","Form 1A opens with blank fields","Pending","","",""],
  ["UAT-01-1.3","Module 1","Form 1A","Field Agent","High","GPS auto-capture","Standing at community center","Tap GPS field","Coordinates auto-captured","Pending","","",""],
  ["UAT-01-1.4","Module 1","Form 1A","Field Agent","High","Mine site lookup","Lookup table pre-loaded","Tap mine_site > select Koumba Gold Mine","Dropdown populated; saved as parent ref","Pending","","",""],
  ["UAT-01-1.5","Module 1","Form 1A","Field Agent","High","Population/households validation","Form open","Enter population=350; households=72","Values accepted; no validation error","Pending","","",""],
  ["UAT-01-1.6","Module 1","Form 1A","Field Agent","Medium","Distance decimal validation","Form open","Enter distance_from_mine_km=12.5","Decimal accepted (0.1–500)","Pending","","",""],
  ["UAT-01-1.7","Module 1","Form 1A","Field Agent","Medium","Multi-select livelihoods","Form open","Select farming + fishing","Both values saved","Pending","","",""],
  ["UAT-01-1.11","Module 1","Form 1A","Field Agent","Critical","Submit — community case created","All fields complete","Tap Submit","Community case created; registration_date=today","Pending","","",""],
  ["UAT-01-NEG1","Module 1","Form 1A","Field Agent","High","NEG: population=0","Form open","Enter population=0 > Submit","Validation error; does not submit","Pending","","",""],
  ["UAT-01-NEG2","Module 1","Form 1A","Field Agent","High","NEG: distance=600","Form open","Enter distance=600 > Submit","Validation error; does not submit","Pending","","",""],
  ["UAT-01-NEG3","Module 1","Form 1A","Field Agent","High","NEG: blank community name","Form open","Leave name blank > Submit","Required field error","Pending","","",""],
  ["UAT-02-2.1","Module 1","Form 1B","Field Agent","High","Select community and open form","Community registered","Tap Beneficiary Reg > select Tsarahonenana","Form 1B opens; community pre-selected","Pending","","",""],
  ["UAT-02-2.3","Module 1","Form 1B","Field Agent","High","DOB and age auto-calc","Form open","Enter DOB=15/03/1991","age auto-calculates to 34","Pending","","",""],
  ["UAT-02-2.5","Module 1","Form 1B","Field Agent","High","Vulnerability status (age>=5)","Age>=5 entered","Verify vulnerability_status field","Field visible; widow+chronic_illness selectable","Pending","","",""],
  ["UAT-02-2.6","Module 1","Form 1B","Field Agent","Medium","Occupation no student default","Age>=18 entered","Open primary_occupation field","No auto-default to student","Pending","","",""],
  ["UAT-02-2.9","Module 1","Form 1B","Field Agent","Critical","Submit — beneficiary as child","All fields; consent=Yes","Tap Submit","Beneficiary case created; parent=Tsarahonenana","Pending","","",""],
  ["UAT-02-NEG1","Module 1","Form 1B","Field Agent","Critical","NEG: consent=No blocks submit","Form open","Set consent=No > Submit","Validation error; does not submit","Pending","","",""],
  ["UAT-02-NEG2","Module 1","Form 1B","Field Agent","Medium","NEG: vulnerability hidden (age<5)","Age<5 entered","Verify vulnerability_status","Field not visible","Pending","","",""],
  ["UAT-03-3.3","Module 2","Form 2A","Field Agent","High","health_education conditional fields","Form open","Select activity_type=health_education","health_topic appears; num_children_under5 hidden","Pending","","",""],
  ["UAT-03-3.11","Module 2","Form 2A","Field Agent","High","vaccination shows num_children_under5","Form open","Select activity_type=vaccination","num_children_under5 appears","Pending","","",""],
  ["UAT-03-3.6","Module 2","Form 2A","Field Agent","High","Total beneficiaries auto-calc","Form open","Enter male=0; female=28","total=28","Pending","","",""],
  ["UAT-03-3.10","Module 2","Form 2A","Field Agent","Critical","Submit — health_visit case created","All fields complete","Tap Submit","health_visit case created","Pending","","",""],
  ["UAT-03-NEG1","Module 2","Form 2A","Field Agent","High","NEG: date > 30 days past","Form open","Enter activity_date=31 days ago","Validation error","Pending","","",""],
  ["UAT-04-4.4","Module 2","Form 2B","Field Agent","Critical","Auto-close on completed","Open health_visit exists","Set followup_status=completed > Submit","health_visit case auto-closed","Pending","","",""],
  ["UAT-04-4.7","Module 2","Form 2B","Field Agent","Medium","Case stays open on ongoing","Open health_visit exists","Set followup_status=ongoing > Submit","Case remains open","Pending","","",""],
  ["UAT-05-5.2","Module 3","Form 3A","Field Agent","High","school_supplies hides fields","Form open","Select education_type=school_supplies","scholarship_amount and training_duration hidden","Pending","","",""],
  ["UAT-05-5.5","Module 3","Form 3A","Field Agent","High","Total students auto-calc","Form open","Enter male=22; female=23","total=45","Pending","","",""],
  ["UAT-05-5.8","Module 3","Form 3A","Field Agent","Critical","Auto-close on completed","Form open","Set completion_status=completed > Submit","Case created and immediately auto-closed","Pending","","",""],
  ["UAT-05-5.9","Module 3","Form 3A","Field Agent","Medium","scholarship_amount for scholarship","Form open","Select education_type=scholarship","scholarship_amount appears","Pending","","",""],
  ["UAT-06-6.2","Module 5","Form 5A","Field Agent","High","water_quality conditional fields","Form open","Select monitoring_type=water_quality","water_ph and water_turbidity appear","Pending","","",""],
  ["UAT-06-6.6","Module 5","Form 5A","Field Agent","High","Corrective action desc appears","Form open","Set corrective_action_needed=yes","corrective_action_desc appears","Pending","","",""],
  ["UAT-06-6.9","Module 5","Form 5A","Field Agent","Critical","NEG: photo_evidence_1 required","Form open","Leave photo empty > Submit","Validation error; photo required","Pending","","",""],
  ["UAT-06-6.10","Module 5","Form 5A","Field Agent","Critical","High risk case stays open","All fields complete","Set risk_level=high > Submit","Case created; stays OPEN","Pending","","",""],
  ["UAT-06-NEG1","Module 5","Form 5A","Field Agent","High","NEG: pH out of range","Form open","Enter water_ph=15 > Submit","Validation error (0–14)","Pending","","",""],
  ["UAT-07-7.2","Module 6","Form 6A","Field Agent","High","Anonymous reporting allowed","Form open","Leave reporter_name blank > Submit","Accepted; grievance created","Pending","","",""],
  ["UAT-07-7.4","Module 6","Form 6A","Field Agent","High","NEG: description min 20 chars","Form open","Enter description < 20 chars","Validation error","Pending","","",""],
  ["UAT-07-7.8","Module 6","Form 6A","Field Agent","Critical","Submit — grievance case open","All fields complete","Tap Submit","Grievance created; status=open","Pending","","",""],
  ["UAT-08-8.3","Module 6","Form 6B","Site Supervisor","High","community_satisfied on resolved","Open grievance exists","Set resolution_status=resolved","community_satisfied appears","Pending","","",""],
  ["UAT-08-8.4","Module 6","Form 6B","Site Supervisor","High","days_to_resolve auto-calc","Open grievance exists","Set resolution_status=resolved","days_to_resolve calculated","Pending","","",""],
  ["UAT-08-8.6","Module 6","Form 6B","Site Supervisor","Critical","Case auto-closes on resolved","Open grievance exists","Set resolved > Submit","Grievance case auto-closed","Pending","","",""],
  ["UAT-09-9.8","Module 6","Form 6C","Site Supervisor","Critical","Standalone — no case created","Form open","Complete Form 6C > Submit","No case created","Pending","","",""],
  ["UAT-10-10.5","Cross-Module","—","Field Agent","Critical","Offline capture and sync","Airplane mode on","Form 1A offline > WiFi > sync","No data loss post-sync","Pending","","",""],
  ["UAT-11-11.1","Cross-Module","—","Field Agent","Critical","RBAC: Field Agent no web access","Field Agent account","Log in > attempt dashboard","Web dashboard inaccessible","Pending","","",""],
  ["UAT-11-11.6","Cross-Module","—","ESG Director","Critical","RBAC: ESG Director read-only","ESG Director account","Attempt to edit a case","No edit access","Pending","","",""],
  ["UAT-12-12.2","Dashboard","—","CSR Manager","High","Filters apply correctly","Dashboard loaded","Apply Q1 2026 + Koumba filters","Filtered data only","Pending","","",""],
  ["UAT-12-12.3","Dashboard","—","CSR Manager","High","4 summary cards populate","Dashboard loaded","Navigate to Overview tab","All 4 cards correct","Pending","","",""],
  ["UAT-12-12.10","Dashboard","—","CSR Manager","Critical","GRI 14 export downloads","Dashboard loaded","Click Export GRI 14","CSV downloads; correct columns","Pending","","",""],
  ["UAT-13-13.1","Dashboard","—","CSR Manager","High","KPI: Beneficiary gender ratio","Test data loaded","Compare to manual calc","Values match","Pending","","",""],
  ["UAT-13-13.3","Dashboard","—","CSR Manager","High","KPI: Grievance resolution rate","Test data loaded","Compare to manual calc","Values match","Pending","","",""],
];

const DEF_HEADERS = ["Defect ID","Test ID","Module","Severity","Title","Steps to Reproduce","Expected Result","Actual Result","Evidence","Reported By","Date Reported","Assigned To","Status","Resolution","Date Resolved"];
const DEF_ROWS_INIT = [
  ["DEF-001","","","","","","","","","","","","Open","",""],
];

const SO_HEADERS = ["Area","Test IDs Covered","Tester Name","Role","Pass","Fail","Pending","Sign-off Date","Status","Comments"];
const SO_ROWS_INIT = [
  ["Module 1 — Registration","UAT-01, UAT-02","","Field Agent","","","","","Pending",""],
  ["Module 2 — Health","UAT-03, UAT-04","","Field Agent","","","","","Pending",""],
  ["Module 3 — Education","UAT-05","","Field Agent","","","","","Pending",""],
  ["Module 5 — Environment","UAT-06","","Field Agent","","","","","Pending",""],
  ["Module 6 — Grievances (6A/6B)","UAT-07, UAT-08","","Field Agent + Supervisor","","","","","Pending",""],
  ["Module 6 — Consultation (6C)","UAT-09","","Site Supervisor","","","","","Pending",""],
  ["Offline & Sync","UAT-10","","Field Agent","","","","","Pending",""],
  ["RBAC","UAT-11","","UAT Coordinator","","","","","Pending",""],
  ["Dashboard & KPIs","UAT-12, UAT-13","","CSR Manager","","","","","Pending",""],
  ["GRI 14 Export","UAT-12-12.10","","CSR Manager","","","","","Pending",""],
  ["OVERALL SIGN-OFF","All","","CSR Manager + Lead","","","","","Pending",""],
];

const SUMMARY_DATA = [
  ["Field","Value"],
  ["Project","CSR Impact Monitor (CommCare MVP)"],
  ["Version","1.0"],["Date","March 2026"],["Prepared By","UAT Coordinator"],
  ["",""],["OVERALL METRICS",""],
  ["Total Test Cases","48"],["Critical","14"],["High","25"],["Medium","9"],
  ["",""],["MODULE COVERAGE",""],
  ["Module","Total Tests"],
  ["Module 1 — Registration","10"],["Module 2 — Health","6"],
  ["Module 3 — Education","4"],["Module 5 — Environment","5"],
  ["Module 6 — Grievances/Engagement","8"],["Offline & Sync","1"],
  ["RBAC","2"],["Dashboard & KPIs","7"],["Module 4 — Livelihood","Pending Q2 2026"],
  ["",""],["EXIT CRITERIA","Status"],
  ["All P1 Critical pass","Pending"],["All P2 Major resolved","Pending"],
  ["Dashboard KPIs validated","Pending"],["CSR Manager sign-off","Pending"],["GRI 14 export validated","Pending"],
];

// ── csv helper ────────────────────────────────────────────────────────────────
function esc(v) {
  const s = String(v ?? "");
  return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g,'""')}"` : s;
}
function downloadCsv(rows, filename) {
  const blob = new Blob([rows.map(r => r.map(esc).join(",")).join("\n")], {type:"text/csv"});
  const a = Object.assign(document.createElement("a"), {href:URL.createObjectURL(blob), download:filename});
  a.click(); URL.revokeObjectURL(a.href);
}

// ── status dropdown ───────────────────────────────────────────────────────────
function StatusSelect({ value, options, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`text-xs font-medium px-2 py-1 rounded border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${STATUS_COLOR[value] || "bg-gray-100 text-gray-600"}`}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ── editable text cell ────────────────────────────────────────────────────────
function EditCell({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="text-xs border border-gray-200 rounded px-1 py-0.5 w-full min-w-16 focus:outline-none focus:ring-1 focus:ring-blue-400"
    />
  );
}

// ── progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ rows, statusCol }) {
  const total = rows.length;
  const pass  = rows.filter(r => r[statusCol] === "Pass" || r[statusCol] === "Resolved" || r[statusCol] === "Approved").length;
  const fail  = rows.filter(r => r[statusCol] === "Fail" || r[statusCol] === "Rejected").length;
  const pct   = total ? Math.round((pass/total)*100) : 0;
  return (
    <div className="flex items-center gap-3 px-6 py-2 bg-white border-b border-gray-100 text-xs">
      <span className="text-gray-500">Progress:</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div className="bg-green-500 h-2 rounded-full transition-all" style={{width:`${pct}%`}} />
      </div>
      <span className="font-semibold text-gray-700">{pct}%</span>
      <span className="text-green-600 font-medium">✓ {pass} pass</span>
      <span className="text-red-500 font-medium">✗ {fail} fail</span>
      <span className="text-gray-400">{total - pass - fail} remaining</span>
    </div>
  );
}

// ── main app ──────────────────────────────────────────────────────────────────
const TABS = ["UAT Summary","Test Cases","Defect Log","Sign-off Tracker"];

export default function App() {
  const [tab, setTab]       = useState(0);
  const [tcRows, setTcRows] = useState(TC_ROWS_INIT.map(r => [...r]));
  const [defRows, setDefRows] = useState(DEF_ROWS_INIT.map(r => [...r]));
  const [soRows, setSoRows] = useState(SO_ROWS_INIT.map(r => [...r]));

  // generic cell updater
  const updater = (setter) => (ri, ci, val) =>
    setter(prev => prev.map((r,i) => i===ri ? r.map((c,j) => j===ci ? val : c) : r));

  const updateTc  = updater(setTcRows);
  const updateDef = updater(setDefRows);
  const updateSo  = updater(setSoRows);

  // add defect row
  const addDefect = () => {
    const id = `DEF-${String(defRows.length+1).padStart(3,"0")}`;
    setDefRows(prev => [...prev, [id,"","","","","","","","","","","","Open","",""]]);
  };

  // exports
  const exportTc  = () => downloadCsv([TC_HEADERS,  ...tcRows],  "UAT_Test_Cases_Updated.csv");
  const exportDef = () => downloadCsv([DEF_HEADERS, ...defRows], "UAT_Defect_Log_Updated.csv");
  const exportSo  = () => downloadCsv([SO_HEADERS,  ...soRows],  "UAT_Signoff_Updated.csv");
  const exportSum = () => downloadCsv(SUMMARY_DATA,              "UAT_Summary.csv");

  // editable cols per sheet
  const TC_STATUS_COL  = 9;   // "Status"
  const TC_ACTUAL_COL  = 10;  // "Actual Result"
  const TC_DEFECT_COL  = 11;  // "Defect ID"
  const TC_NOTES_COL   = 12;  // "Notes"
  const DEF_STATUS_COL = 12;  // "Status"
  const SO_STATUS_COL  = 8;   // "Status"
  const SO_TESTER_COL  = 2;
  const SO_DATE_COL    = 7;
  const SO_COMMENTS_COL= 9;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* header */}
      <div className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-blue-200 mb-1">Dimagi · CommCare MVP</div>
          <div className="text-xl font-bold">CSR Impact Monitor — UAT Workbook</div>
          <div className="text-sm text-blue-200 mt-1">v1.0 · March 2026 · 48 test cases across 8 modules</div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {tab===0 && <button onClick={exportSum}  className="bg-white text-blue-700 font-semibold text-xs px-3 py-2 rounded-lg hover:bg-blue-50">⬇ Summary CSV</button>}
          {tab===1 && <button onClick={exportTc}   className="bg-white text-blue-700 font-semibold text-xs px-3 py-2 rounded-lg hover:bg-blue-50">⬇ Export Test Cases</button>}
          {tab===2 && <button onClick={exportDef}  className="bg-white text-blue-700 font-semibold text-xs px-3 py-2 rounded-lg hover:bg-blue-50">⬇ Export Defect Log</button>}
          {tab===3 && <button onClick={exportSo}   className="bg-white text-blue-700 font-semibold text-xs px-3 py-2 rounded-lg hover:bg-blue-50">⬇ Export Sign-off</button>}
        </div>
      </div>

      {/* tabs */}
      <div className="flex border-b border-gray-200 bg-white px-6">
        {TABS.map((t,i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${tab===i?"border-blue-600 text-blue-700":"border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* progress bars */}
      {tab===1 && <ProgressBar rows={tcRows}  statusCol={TC_STATUS_COL} />}
      {tab===2 && <ProgressBar rows={defRows} statusCol={DEF_STATUS_COL} />}
      {tab===3 && <ProgressBar rows={soRows}  statusCol={SO_STATUS_COL} />}

      {/* stat chips for test cases */}
      {tab===1 && (
        <div className="bg-white px-6 py-2 border-b border-gray-100 flex gap-3 flex-wrap text-xs">
          {["Critical","High","Medium"].map(p => (
            <span key={p} className={`px-2 py-0.5 rounded font-medium ${PRIORITY_COLOR[p]}`}>
              {p}: {tcRows.filter(r=>r[4]===p).length}
            </span>
          ))}
          {TC_STATUSES.map(s => (
            <span key={s} className={`px-2 py-0.5 rounded font-medium ${STATUS_COLOR[s]}`}>
              {s}: {tcRows.filter(r=>r[TC_STATUS_COL]===s).length}
            </span>
          ))}
        </div>
      )}

      {/* ── UAT SUMMARY ── */}
      {tab===0 && (
        <div className="overflow-x-auto px-4 py-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs">
            <thead><tr className="bg-gray-100 text-gray-600 uppercase">
              {SUMMARY_DATA[0].map((h,i) => <th key={i} className="px-3 py-2 text-left font-semibold border-b border-gray-200 whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>
              {SUMMARY_DATA.slice(1).map((row,ri) => (
                <tr key={ri} className={ri%2===0?"bg-white":"bg-gray-50"}>
                  {row.map((v,ci) => (
                    <td key={ci} className="px-3 py-2 border-b border-gray-100 whitespace-nowrap font-medium text-gray-700">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TEST CASES ── */}
      {tab===1 && (
        <div className="overflow-x-auto px-4 py-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs">
            <thead><tr className="bg-gray-100 text-gray-600 uppercase">
              {TC_HEADERS.map((h,i) => <th key={i} className="px-3 py-2 text-left font-semibold border-b border-gray-200 whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>
              {tcRows.map((row,ri) => (
                <tr key={ri} className={ri%2===0?"bg-white":"bg-gray-50"}>
                  {TC_HEADERS.map((_,ci) => {
                    const v = row[ci] ?? "";
                    if (ci === TC_STATUS_COL)
                      return <td key={ci} className="px-2 py-1.5 border-b border-gray-100">
                        <StatusSelect value={v} options={TC_STATUSES} onChange={val => updateTc(ri,ci,val)} />
                      </td>;
                    if (ci === TC_ACTUAL_COL || ci === TC_DEFECT_COL || ci === TC_NOTES_COL)
                      return <td key={ci} className="px-2 py-1.5 border-b border-gray-100 min-w-24">
                        <EditCell value={v} onChange={val => updateTc(ri,ci,val)} />
                      </td>;
                    if (ci === 4 && PRIORITY_COLOR[v])
                      return <td key={ci} className="px-2 py-1.5 border-b border-gray-100">
                        <span className={`px-2 py-0.5 rounded font-medium ${PRIORITY_COLOR[v]}`}>{v}</span>
                      </td>;
                    return <td key={ci} className="px-3 py-1.5 border-b border-gray-100 whitespace-nowrap max-w-xs truncate text-gray-700">{v}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── DEFECT LOG ── */}
      {tab===2 && (
        <div className="overflow-x-auto px-4 py-4">
          <div className="mb-2 flex justify-end">
            <button onClick={addDefect} className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700">
              + Add Defect
            </button>
          </div>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs">
            <thead><tr className="bg-gray-100 text-gray-600 uppercase">
              {DEF_HEADERS.map((h,i) => <th key={i} className="px-3 py-2 text-left font-semibold border-b border-gray-200 whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>
              {defRows.map((row,ri) => (
                <tr key={ri} className={ri%2===0?"bg-white":"bg-gray-50"}>
                  {DEF_HEADERS.map((_,ci) => {
                    const v = row[ci] ?? "";
                    if (ci === DEF_STATUS_COL)
                      return <td key={ci} className="px-2 py-1.5 border-b border-gray-100">
                        <StatusSelect value={v} options={DEF_STATUSES} onChange={val => updateDef(ri,ci,val)} />
                      </td>;
                    if (ci === 0) // Defect ID — read only
                      return <td key={ci} className="px-3 py-1.5 border-b border-gray-100 font-medium text-blue-700 whitespace-nowrap">{v}</td>;
                    return <td key={ci} className="px-2 py-1.5 border-b border-gray-100 min-w-20">
                      <EditCell value={v} onChange={val => updateDef(ri,ci,val)} />
                    </td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── SIGN-OFF TRACKER ── */}
      {tab===3 && (
        <div className="overflow-x-auto px-4 py-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs">
            <thead><tr className="bg-gray-100 text-gray-600 uppercase">
              {SO_HEADERS.map((h,i) => <th key={i} className="px-3 py-2 text-left font-semibold border-b border-gray-200 whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>
              {soRows.map((row,ri) => (
                <tr key={ri} className={`${ri%2===0?"bg-white":"bg-gray-50"} ${ri===soRows.length-1?"font-semibold border-t-2 border-gray-300":""}`}>
                  {SO_HEADERS.map((_,ci) => {
                    const v = row[ci] ?? "";
                    if (ci === SO_STATUS_COL)
                      return <td key={ci} className="px-2 py-1.5 border-b border-gray-100">
                        <StatusSelect value={v} options={SO_STATUSES} onChange={val => updateSo(ri,ci,val)} />
                      </td>;
                    if (ci === SO_TESTER_COL || ci === SO_DATE_COL || ci === SO_COMMENTS_COL)
                      return <td key={ci} className="px-2 py-1.5 border-b border-gray-100 min-w-24">
                        <EditCell value={v} onChange={val => updateSo(ri,ci,val)} />
                      </td>;
                    return <td key={ci} className="px-3 py-1.5 border-b border-gray-100 whitespace-nowrap text-gray-700">{v}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-6 pb-6 pt-2 text-xs text-gray-400">
        💡 Status changes are session-only. Use the export button to download your updated data as CSV.
      </div>
    </div>
  );
}