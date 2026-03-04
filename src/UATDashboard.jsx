import { useState } from "react";

const testCases = [
  ["Test ID","Module","Form","Role","Priority","Test Title","Precondition","Test Steps","Expected Result","Status","Actual Result","Defect ID","Notes"],
  ["UAT-01-1.1","Module 1","Form 1A","Field Agent","High","Open app and sync","App installed; WiFi available","Open app > sync over WiFi > tap Community Registration","Form 1A opens with blank fields","Pending","","",""],
  ["UAT-01-1.3","Module 1","Form 1A","Field Agent","High","GPS auto-capture","Standing at community center","Tap GPS field","Coordinates auto-captured","Pending","","",""],
  ["UAT-01-1.4","Module 1","Form 1A","Field Agent","High","Mine site lookup","Lookup table pre-loaded","Tap mine_site > select Koumba Gold Mine","Dropdown populated; selection saved as parent ref","Pending","","",""],
  ["UAT-01-1.5","Module 1","Form 1A","Field Agent","High","Population/households validation","Form open","Enter population=350; households=72","Values accepted; no validation error","Pending","","",""],
  ["UAT-01-1.6","Module 1","Form 1A","Field Agent","Medium","Distance decimal validation","Form open","Enter distance_from_mine_km=12.5","Decimal accepted (0.1–500 passes)","Pending","","",""],
  ["UAT-01-1.7","Module 1","Form 1A","Field Agent","Medium","Multi-select livelihoods","Form open","Select farming + fishing","Both values saved","Pending","","",""],
  ["UAT-01-1.11","Module 1","Form 1A","Field Agent","Critical","Submit — community case created","All fields complete","Tap Submit","Community case created; registration_date=today","Pending","","",""],
  ["UAT-01-NEG1","Module 1","Form 1A","Field Agent","High","NEG: population=0","Form open","Enter population=0 > Submit","Validation error; does not submit","Pending","","",""],
  ["UAT-01-NEG2","Module 1","Form 1A","Field Agent","High","NEG: distance=600","Form open","Enter distance=600 > Submit","Validation error; does not submit","Pending","","",""],
  ["UAT-01-NEG3","Module 1","Form 1A","Field Agent","High","NEG: blank community name","Form open","Leave name blank > Submit","Required field error; does not submit","Pending","","",""],
  ["UAT-02-2.1","Module 1","Form 1B","Field Agent","High","Select community and open form","Community registered","Tap Beneficiary Reg > select Tsarahonenana","Form 1B opens; community pre-selected","Pending","","",""],
  ["UAT-02-2.3","Module 1","Form 1B","Field Agent","High","DOB and age auto-calc","Form open","Enter DOB=15/03/1991","age auto-calculates to 34","Pending","","",""],
  ["UAT-02-2.5","Module 1","Form 1B","Field Agent","High","Vulnerability status display (age>=5)","Age>=5 entered","Verify vulnerability_status field","Field visible; widow+chronic_illness selectable","Pending","","",""],
  ["UAT-02-2.6","Module 1","Form 1B","Field Agent","Medium","Occupation no student default (age>=18)","Age>=18 entered","Open primary_occupation field","No auto-default to student","Pending","","",""],
  ["UAT-02-2.9","Module 1","Form 1B","Field Agent","Critical","Submit — beneficiary case as child","All fields complete; consent=Yes","Tap Submit","Beneficiary case created; parent=Tsarahonenana","Pending","","",""],
  ["UAT-02-NEG1","Module 1","Form 1B","Field Agent","Critical","NEG: consent=No blocks submit","Form open","Set consent=No > Submit","Validation error; does not submit","Pending","","",""],
  ["UAT-02-NEG2","Module 1","Form 1B","Field Agent","Medium","NEG: vulnerability hidden (age<5)","Age<5 entered","Verify vulnerability_status field","Field not visible","Pending","","",""],
  ["UAT-03-3.3","Module 2","Form 2A","Field Agent","High","health_education conditional fields","Form open","Select activity_type=health_education","health_topic appears; num_children_under5 hidden","Pending","","",""],
  ["UAT-03-3.11","Module 2","Form 2A","Field Agent","High","vaccination shows num_children_under5","Form open","Select activity_type=vaccination","num_children_under5 field appears","Pending","","",""],
  ["UAT-03-3.6","Module 2","Form 2A","Field Agent","High","Total beneficiaries auto-calc","Form open","Enter male=0; female=28","total auto-calculates to 28","Pending","","",""],
  ["UAT-03-3.10","Module 2","Form 2A","Field Agent","Critical","Submit — health_visit case created","All fields complete","Tap Submit","health_visit case created under Tsarahonenana","Pending","","",""],
  ["UAT-03-NEG1","Module 2","Form 2A","Field Agent","High","NEG: date > 30 days past","Form open","Enter activity_date=31 days ago > Submit","Validation error","Pending","","",""],
  ["UAT-04-4.4","Module 2","Form 2B","Field Agent","Critical","Auto-close on completed","Open health_visit exists","Set followup_status=completed > Submit","health_visit case auto-closed","Pending","","",""],
  ["UAT-04-4.7","Module 2","Form 2B","Field Agent","Medium","Case stays open on ongoing","Open health_visit exists","Set followup_status=ongoing > Submit","Case remains open","Pending","","",""],
  ["UAT-05-5.2","Module 3","Form 3A","Field Agent","High","school_supplies hides conditional fields","Form open","Select education_type=school_supplies","scholarship_amount and training_duration hidden","Pending","","",""],
  ["UAT-05-5.5","Module 3","Form 3A","Field Agent","High","Total students auto-calc","Form open","Enter male=22; female=23","total=45","Pending","","",""],
  ["UAT-05-5.8","Module 3","Form 3A","Field Agent","Critical","Auto-close on completed","Form open","Set completion_status=completed > Submit","Case created and immediately auto-closed","Pending","","",""],
  ["UAT-05-5.9","Module 3","Form 3A","Field Agent","Medium","scholarship_amount appears for scholarship","Form open","Select education_type=scholarship","scholarship_amount field appears","Pending","","",""],
  ["UAT-06-6.2","Module 5","Form 5A","Field Agent","High","water_quality conditional fields","Form open","Select monitoring_type=water_quality","water_ph and water_turbidity appear","Pending","","",""],
  ["UAT-06-6.6","Module 5","Form 5A","Field Agent","High","Corrective action desc appears","Form open","Set corrective_action_needed=yes","corrective_action_desc field appears","Pending","","",""],
  ["UAT-06-6.9","Module 5","Form 5A","Field Agent","Critical","NEG: photo_evidence_1 required","Form open","Leave photo_evidence_1 empty > Submit","Validation error; photo required","Pending","","",""],
  ["UAT-06-6.10","Module 5","Form 5A","Field Agent","Critical","High risk case stays open","All fields complete","Set risk_level=high > Submit","Case created; stays OPEN","Pending","","",""],
  ["UAT-06-NEG1","Module 5","Form 5A","Field Agent","High","NEG: pH out of range","Form open","Enter water_ph=15 > Submit","Validation error (0–14 only)","Pending","","",""],
  ["UAT-07-7.2","Module 6","Form 6A","Field Agent","High","Anonymous reporting allowed","Form open","Leave reporter_name blank > Submit","Form accepts blank; grievance created","Pending","","",""],
  ["UAT-07-7.4","Module 6","Form 6A","Field Agent","High","NEG: description min 20 chars","Form open","Enter description < 20 chars > Submit","Validation error; min 20 chars","Pending","","",""],
  ["UAT-07-7.8","Module 6","Form 6A","Field Agent","Critical","Submit — grievance case open","All fields complete","Tap Submit","Grievance case created; resolution_status=open","Pending","","",""],
  ["UAT-08-8.3","Module 6","Form 6B","Site Supervisor","High","community_satisfied appears on resolved","Open grievance exists","Set resolution_status=resolved","community_satisfied field appears","Pending","","",""],
  ["UAT-08-8.4","Module 6","Form 6B","Site Supervisor","High","days_to_resolve auto-calculated","Open grievance exists","Set resolution_status=resolved","days_to_resolve = followup_date − report_date","Pending","","",""],
  ["UAT-08-8.6","Module 6","Form 6B","Site Supervisor","Critical","Case auto-closes on resolved","Open grievance exists","Set resolution_status=resolved > Submit","Grievance case auto-closed","Pending","","",""],
  ["UAT-09-9.8","Module 6","Form 6C","Site Supervisor","Critical","Standalone form — no case created","Form open","Complete Form 6C > Submit","No case created; standalone form data only","Pending","","",""],
  ["UAT-10-10.5","Cross-Module","—","Field Agent","Critical","Offline capture and sync","Airplane mode enabled","Complete Form 1A offline > re-enable WiFi > sync","Cases created; no data loss post-sync","Pending","","",""],
  ["UAT-11-11.1","Cross-Module","—","Field Agent","Critical","RBAC: Field Agent no web access","Field Agent account","Log in as Field Agent > attempt dashboard access","Web dashboard inaccessible","Pending","","",""],
  ["UAT-11-11.6","Cross-Module","—","ESG Director","Critical","RBAC: ESG Director read-only","ESG Director account","Log in as Edouard > attempt to edit a case","No edit access; read-only","Pending","","",""],
  ["UAT-12-12.2","Dashboard","—","CSR Manager","High","Filters apply correctly","Dashboard loaded","Apply Q1 2026 + Koumba Gold Mine filters","Dashboard updates to filtered data only","Pending","","",""],
  ["UAT-12-12.3","Dashboard","—","CSR Manager","High","4 summary cards populate","Dashboard loaded","Navigate to Overview tab","All 4 cards show correct counts","Pending","","",""],
  ["UAT-12-12.10","Dashboard","—","CSR Manager","Critical","GRI 14 export downloads","Dashboard loaded","Click Export GRI 14 Report","CSV downloads; correct column structure","Pending","","",""],
  ["UAT-13-13.1","Dashboard","—","CSR Manager","High","KPI: Beneficiary gender ratio","Test data loaded","Compare dashboard gender ratio to manual calc","Values match","Pending","","",""],
  ["UAT-13-13.3","Dashboard","—","CSR Manager","High","KPI: Grievance resolution rate","Test data loaded","Compare dashboard resolution rate to manual calc","Values match","Pending","","",""],
];

const defectLog = [
  ["Defect ID","Test ID","Module","Severity","Title","Steps to Reproduce","Expected Result","Actual Result","Screenshot/Evidence","Reported By","Date Reported","Assigned To","Status","Resolution","Date Resolved"],
  ["DEF-001","","","","","","","","","","","","Open","",""],
];

const signOff = [
  ["Area","Test IDs Covered","Tester Name","Role","Pass Count","Fail Count","Pending Count","Sign-off Date","Status","Comments"],
  ["Module 1 — Registration","UAT-01, UAT-02","","Field Agent","","","","","Pending",""],
  ["Module 2 — Health","UAT-03, UAT-04","","Field Agent","","","","","Pending",""],
  ["Module 3 — Education","UAT-05","","Field Agent","","","","","Pending",""],
  ["Module 5 — Environment","UAT-06","","Field Agent","","","","","Pending",""],
  ["Module 6 — Grievances (6A/6B)","UAT-07, UAT-08","","Field Agent + Supervisor","","","","","Pending",""],
  ["Module 6 — Consultation (6C)","UAT-09","","Site Supervisor","","","","","Pending",""],
  ["Offline & Sync","UAT-10","","Field Agent","","","","","Pending",""],
  ["Role-Based Access Control","UAT-11","","UAT Coordinator","","","","","Pending",""],
  ["Web Dashboard & KPIs","UAT-12, UAT-13","","CSR Manager","","","","","Pending",""],
  ["GRI 14 Export","UAT-12-12.10","","CSR Manager","","","","","Pending",""],
  ["OVERALL UAT SIGN-OFF","All","","CSR Manager + Project Lead","","","","","Pending",""],
];

const summary = [
  ["Field","Value"],
  ["Project","CSR Impact Monitor (CommCare MVP)"],
  ["Version","1.0"],
  ["Date","March 2026"],
  ["Prepared By","UAT Coordinator"],
  ["",""],
  ["OVERALL METRICS",""],
  ["Total Test Cases","48"],
  ["Critical","14"],
  ["High","25"],
  ["Medium","9"],
  ["",""],
  ["Module","Total Tests"],
  ["Module 1 — Registration","10"],
  ["Module 2 — Health","6"],
  ["Module 3 — Education","4"],
  ["Module 5 — Environment","5"],
  ["Module 6 — Grievances/Engagement","8"],
  ["Offline & Sync","1"],
  ["RBAC","2"],
  ["Dashboard & KPIs","7"],
  ["Module 4 — Livelihood","Pending Q2 2026"],
  ["",""],
  ["EXIT CRITERIA",""],
  ["All P1 Critical pass","Pending"],
  ["All P2 Major resolved","Pending"],
  ["Dashboard KPIs validated","Pending"],
  ["CSR Manager sign-off","Pending"],
  ["GRI 14 export validated","Pending"],
];

function escapeCsv(val) {
  const s = String(val ?? "");
  return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(data) {
  return data.map(row => row.map(escapeCsv).join(",")).join("\n");
}

function downloadCsv(data, filename) {
  const blob = new Blob([toCsv(data)], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

const TABS = [
  { label: "UAT Summary", data: summary, filename: "UAT_Summary.csv" },
  { label: "Test Cases", data: testCases, filename: "UAT_Test_Cases.csv" },
  { label: "Defect Log", data: defectLog, filename: "UAT_Defect_Log.csv" },
  { label: "Sign-off Tracker", data: signOff, filename: "UAT_Signoff_Tracker.csv" },
];

const PRIORITY_COLOR = { Critical:"bg-red-100 text-red-700", High:"bg-orange-100 text-orange-700", Medium:"bg-yellow-100 text-yellow-700" };
const STATUS_COLOR = { Pass:"bg-green-100 text-green-700", Fail:"bg-red-100 text-red-700", Pending:"bg-gray-100 text-gray-500", Blocked:"bg-purple-100 text-purple-700", Open:"bg-orange-100 text-orange-700" };

export default function App() {
  const [tab, setTab] = useState(0);
  const { data, filename } = TABS[tab];
  const headers = data[0];
  const rows = data.slice(1);

  function downloadAll() {
    TABS.forEach(t => downloadCsv(t.data, t.filename));
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-blue-200 mb-1">Dimagi · CommCare MVP</div>
          <div className="text-xl font-bold">CSR Impact Monitor — UAT Workbook</div>
          <div className="text-sm text-blue-200 mt-1">v1.0 · March 2026 · 48 test cases across 8 modules</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => downloadCsv(data, filename)}
            className="bg-white text-blue-700 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-blue-50 transition">
            ⬇ This sheet (.csv)
          </button>
          <button onClick={downloadAll}
            className="bg-blue-500 text-white font-semibold text-sm px-3 py-2 rounded-lg hover:bg-blue-400 transition">
            ⬇ All 4 sheets (.csv)
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 bg-white px-6">
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${tab === i ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 1 && (
        <div className="bg-white px-6 py-3 border-b border-gray-100 flex gap-4 text-sm flex-wrap">
          {["Critical","High","Medium"].map(p => {
            const count = rows.filter(r => r[4] === p).length;
            return <span key={p} className={`px-2 py-0.5 rounded font-medium ${PRIORITY_COLOR[p]}`}>{p}: {count}</span>;
          })}
          <span className="text-gray-400 self-center">Total: {rows.length} tests</span>
        </div>
      )}

      <div className="overflow-x-auto px-4 py-4">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase">
              {headers.map((h, i) => (
                <th key={i} className="px-3 py-2 text-left font-semibold whitespace-nowrap border-b border-gray-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {headers.map((h, ci) => {
                  const val = row[ci] ?? "";
                  let cell = <span className="text-gray-700">{val}</span>;
                  if ((h === "Priority" || h === "Severity") && PRIORITY_COLOR[val])
                    cell = <span className={`px-2 py-0.5 rounded font-medium ${PRIORITY_COLOR[val]}`}>{val}</span>;
                  if (h === "Status" && STATUS_COLOR[val])
                    cell = <span className={`px-2 py-0.5 rounded font-medium ${STATUS_COLOR[val]}`}>{val}</span>;
                  return (
                    <td key={ci} className="px-3 py-2 border-b border-gray-100 whitespace-nowrap max-w-xs truncate">{cell}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 pb-6 text-xs text-gray-400">
        💡 Download each sheet as CSV, then open in Excel or Google Sheets. To get a single .xlsx, paste all 4 CSVs into separate tabs in Excel and save as .xlsx.
      </div>
    </div>
  );
}