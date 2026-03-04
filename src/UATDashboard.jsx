import { useState } from "react";

const PRIORITY_COLOR = {
  Critical:"bg-red-100 text-red-700", High:"bg-orange-100 text-orange-700", Medium:"bg-yellow-100 text-yellow-700"
};
const STATUS_COLOR = {
  Pass:"bg-green-100 text-green-700", Fail:"bg-red-100 text-red-700",
  Pending:"bg-gray-100 text-gray-500", Blocked:"bg-purple-100 text-purple-700",
  Open:"bg-orange-100 text-orange-700", "In Progress":"bg-blue-100 text-blue-700",
  Resolved:"bg-green-100 text-green-700", Approved:"bg-green-100 text-green-700",
  Rejected:"bg-red-100 text-red-700",
};
const STEP_TYPE_COLOR = {
  "Pre-requisite":"bg-blue-50 text-blue-600",
  "Test Data":"bg-yellow-50 text-yellow-700",
  "Test Step":"bg-white text-gray-700",
  "Negative Test":"bg-red-50 text-red-600",
};
const TC_STATUSES  = ["Pending","Pass","Fail","Blocked","N/A"];
const DEF_STATUSES = ["Open","In Progress","Resolved"];
const SO_STATUSES  = ["Pending","Approved","Rejected"];

// ── full test case rows ───────────────────────────────────────────────────────
const TC_HEADERS = ["UAT ID","Scenario Title","Role","Module","Form","Duration","Step #","Step Type","Action / Description","Expected Result","Result","Notes / Bug ID","Tester Name","Test Date","Device Model"];

const TC_ROWS_INIT = [
  // UAT-01
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","PRE-1","Pre-requisite","App installed and synced on Android device","","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","PRE-2","Pre-requisite","Logged in as Field Agent","","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","PRE-3","Pre-requisite","Mine site lookup table loaded (Koumba Gold Mine visible)","","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","DATA","Test Data","Community Name: Tsarahonenana | Mine Site: Koumba Gold Mine | Population: 350 | Households: 72 | Distance: 12.5 km | Livelihoods: farming/fishing | Health Facility: No | School: Yes | Clean Water: No | Leader: Monsieur Rakoto | Phone: +261 34 00 000 00","","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","1","Test Step","Open the CSR Impact Monitor app on your Android device","Home screen loads with all modules visible","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","2","Test Step","Tap 'Community & Beneficiary Registration'","Module opens showing Community Registration form option","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","3","Test Step","Tap 'Community Registration'","Form opens. First question is Community Name.","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","4","Test Step","Type 'Tsarahonenana' in the Community Name field","Text accepted. Max 100 characters allowed.","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","5","Test Step","Tap the GPS field and wait for coordinates to auto-capture","GPS coordinates captured automatically. Field shows latitude/longitude values.","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","6","Test Step","Select 'Koumba Gold Mine' from the mine_site_ref dropdown","Mine site selected from lookup table. Parent case set.","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","7","Test Step","Enter '350' for Estimated Population","Value accepted (valid range: 1–999999)","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","8","Test Step","Enter '72' for Number of Households","Value accepted (valid range: 1–99999)","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","9","Test Step","Enter '12.5' for Distance from Mine (km)","Decimal value accepted (valid range: 0.1–500)","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","10","Test Step","Select 'farming' and 'fishing' for Primary Livelihoods","Multi-select works. Both options selected simultaneously.","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","11","Test Step","Set Has Health Facility = No, Has School = Yes, Has Clean Water = No","Each field shows only Yes/No options.","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","12","Test Step","Enter leader name 'Monsieur Rakoto' and phone '+261 34 00 000 00'","Optional fields accepted without validation error.","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","13","Test Step","Take a photo using the registration_photo field","Camera opens. Photo captured and attached to form.","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","14","Test Step","Tap Submit","Form submits. App returns to home/root screen.","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","15","Test Step","Navigate to Community & Beneficiary Registration case list","New 'Tsarahonenana' community case visible in the list.","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","NEG-1","Negative Test","Leave Community Name blank → submit","Expect validation error — form cannot submit","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","NEG-2","Negative Test","Enter 0 for Estimated Population → submit","Expect validation error (min value = 1)","—","","","",""],
  ["UAT-01","Register a New Community","Field Agent (Fanja)","Module 1 — Community Registration","Form 1A: Community Registration","10–15 min","NEG-3","Negative Test","Enter 501 for Distance from Mine → submit","Expect validation error (max value = 500)","—","","","",""],
  // UAT-02
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","PRE-1","Pre-requisite","UAT-01 completed — Tsarahonenana community case exists","","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","PRE-2","Pre-requisite","Logged in as Field Agent","","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","DATA","Test Data","Full Name: Rasoa Vololomanga | Sex: Female | DOB: 15/03/1991 | Expected Age: 34 | ID: MG-101-234567 | Phone: +261 34 00 000 01 | Household: 5 | Vulnerability: widow/chronic_illness | Occupation: farmer | CSR Programs: health/education/livelihood | Consent: Yes","","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","1","Test Step","From home screen tap 'Community & Beneficiary Registration'","Module opens showing community case list","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","2","Test Step","Select 'Tsarahonenana' from the community list","Community selected. Register Beneficiary form option appears.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","3","Test Step","Tap 'Register Beneficiary'","Form opens. First question is beneficiary full name.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","4","Test Step","Enter 'Rasoa Vololomanga' as full name","Name accepted. This will become the case name.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","5","Test Step","Select 'Female' for Sex","Options shown: male, female, other.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","6","Test Step","Enter date of birth: 15/03/1991 using calendar picker","Date accepted. Must not be a future date.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","7","Test Step","Check the Age field","Age auto-calculated = 34. Hidden from user but saved to case.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","8","Test Step","Check if vulnerability_status question appears","Visible — age is 34 which is ≥ 5. If age were < 5 it would be hidden.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","9","Test Step","Select 'widow' and 'chronic_illness' for vulnerability_status","Multi-select works. Both options selected.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","10","Test Step","Enter '5' for Household Size","Value accepted (valid range: 1–50)","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","11","Test Step","Check primary_occupation default value","Age is 34 (≥18) so NO default to student. Field is blank.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","12","Test Step","Select 'farmer' for Primary Occupation","Selected correctly.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","13","Test Step","Select 'health', 'education', 'livelihood' for CSR Programs Enrolled","Multi-select works. Three options selected.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","14","Test Step","Enter ID 'MG-101-234567' and phone '+261 34 00 000 01'","Optional fields accepted.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","15","Test Step","Set consent_given = Yes","Consent accepted. Form can proceed.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","16","Test Step","Tap Submit","Form submits. App returns to home/root screen.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","17","Test Step","Navigate to Beneficiary Registration case list under Tsarahonenana","New beneficiary case 'Rasoa Vololomanga' visible. Linked to Tsarahonenana community.","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","NEG-1","Negative Test","Set consent_given = No → submit","Expect form blocked with validation error","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","NEG-2","Negative Test","Enter a future date for date_of_birth → submit","Expect validation error","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","NEG-3","Negative Test","Enter 51 for household_size → submit","Expect validation error (max = 50)","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","NEG-4","Negative Test","Enter DOB for a 3-year-old → check vulnerability_status","Expect vulnerability_status field to be HIDDEN (age < 5)","—","","","",""],
  ["UAT-02","Register a Beneficiary","Field Agent (Fanja)","Module 1 — Beneficiary Registration","Form 1B: Register Beneficiary","10–15 min","NEG-5","Negative Test","Enter DOB for a 15-year-old → check primary_occupation","Expect primary_occupation to default to 'student'","—","","","",""],
  // UAT-03
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","PRE-1","Pre-requisite","UAT-01 completed — Tsarahonenana community case exists","","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","PRE-2","Pre-requisite","Logged in as Field Agent","","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","DATA","Test Data","Community: Tsarahonenana | Date: Today | Activity Type: health_education | Health Topic: maternal_care | Male: 0 | Female: 28 | Expected Total: 28 | Referrals: 3 | Supplies: vitamins","","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","1","Test Step","Tap 'Health Program Monitoring' from home screen","Community case list opens.","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","2","Test Step","Select 'Tsarahonenana' from the community list","Community selected. Health Activity Report form option visible.","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","3","Test Step","Tap 'Health Activity Report'","Form opens with activity_date defaulting to today.","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","4","Test Step","Verify activity_date is set to today by default","Today's date pre-filled. Editable if needed.","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","5","Test Step","Select 'health_education' for Activity Type","health_topic field APPEARS (conditional display logic triggered).","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","6","Test Step","Verify num_children_under5 is NOT visible","Field hidden — only appears for vaccination or maternal_care activity types.","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","7","Test Step","Select 'maternal_care' for Health Topic","Option selected from: malaria, hiv, nutrition, water_sanitation, reproductive_health, first_aid, other.","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","8","Test Step","Enter description (min content; max 500 chars)","Long text field accepted. Character limit enforced.","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","9","Test Step","Enter 0 for male beneficiaries and 28 for female","Both values ≥ 0 accepted.","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","10","Test Step","Check num_beneficiaries_total field","Auto-calculated = 28 (0 + 28). Hidden from user.","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","11","Test Step","Enter '3' for referrals_made","Optional integer field accepted.","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","12","Test Step","Select 'vitamins' for supplies_distributed","Options: mosquito_nets, medicines, first_aid_kits, contraceptives, vitamins, none.","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","13","Test Step","Allow GPS to auto-capture location","GPS coordinates captured. Required field.","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","14","Test Step","Take a photo for photo_evidence","Photo attached (optional field).","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","15","Test Step","Tap Submit","Form submits. App returns to root screen.","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","16","Test Step","Navigate to Health Visit Follow-up module","New health_visit case visible in open cases list.","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","NEG-1","Negative Test","Select activity_type = 'screening' → verify health_topic field","Expect health_topic to be HIDDEN","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","NEG-2","Negative Test","Select activity_type = 'vaccination' → verify num_children_under5","Expect num_children_under5 to APPEAR","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","NEG-3","Negative Test","Enter -1 for male beneficiaries → submit","Expect validation error (min = 0)","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","NEG-4","Negative Test","Enter a date 31 days ago → submit","Expect validation error (max 30 days past)","—","","","",""],
  ["UAT-03","Record a Health Education Session","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2A: Health Activity Report","10 min","NEG-5","Negative Test","Enter a future date → submit","Expect validation error (not future date)","—","","","",""],
  // UAT-04
  ["UAT-04","Follow Up and Close a Health Visit","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2B: Health Visit Follow-up","5–10 min","PRE-1","Pre-requisite","UAT-03 completed — open health_visit case exists for Tsarahonenana","","—","","","",""],
  ["UAT-04","Follow Up and Close a Health Visit","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2B: Health Visit Follow-up","5–10 min","DATA","Test Data","Health Visit: Maternal health session (UAT-03) | Follow-up Date: Today | Status: completed | Outcome: All 3 referred women attended clinic. 2 received vitamins. 1 diagnosed with anemia.","","—","","","",""],
  ["UAT-04","Follow Up and Close a Health Visit","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2B: Health Visit Follow-up","5–10 min","1","Test Step","Tap 'Health Visit Follow-up' from home screen","List of open health_visit cases shown.","—","","","",""],
  ["UAT-04","Follow Up and Close a Health Visit","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2B: Health Visit Follow-up","5–10 min","2","Test Step","Select the maternal health session case from UAT-03","Case opens. Activity type and date pre-loaded from parent case.","—","","","",""],
  ["UAT-04","Follow Up and Close a Health Visit","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2B: Health Visit Follow-up","5–10 min","3","Test Step","Tap 'Health Visit Follow-up' form","Form opens with followup_date defaulting to today.","—","","","",""],
  ["UAT-04","Follow Up and Close a Health Visit","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2B: Health Visit Follow-up","5–10 min","4","Test Step","Verify followup_date defaults to today","Today's date pre-filled.","—","","","",""],
  ["UAT-04","Follow Up and Close a Health Visit","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2B: Health Visit Follow-up","5–10 min","5","Test Step","Select 'completed' for followup_status","Options: completed, ongoing, cancelled, rescheduled.","—","","","",""],
  ["UAT-04","Follow Up and Close a Health Visit","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2B: Health Visit Follow-up","5–10 min","6","Test Step","Enter outcome notes","Long text field accepted.","—","","","",""],
  ["UAT-04","Follow Up and Close a Health Visit","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2B: Health Visit Follow-up","5–10 min","7","Test Step","Tap Submit","Form submits successfully.","—","","","",""],
  ["UAT-04","Follow Up and Close a Health Visit","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2B: Health Visit Follow-up","5–10 min","8","Test Step","Navigate back to Health Visit Follow-up case list","Completed case NO LONGER appears in open cases list — it is closed.","—","","","",""],
  ["UAT-04","Follow Up and Close a Health Visit","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2B: Health Visit Follow-up","5–10 min","NEG-1","Negative Test","Select followup_status = 'ongoing' → submit → check case list","Expect case to remain OPEN in the list","—","","","",""],
  ["UAT-04","Follow Up and Close a Health Visit","Field Agent (Fanja)","Module 2 — Health Program Monitoring","Form 2B: Health Visit Follow-up","5–10 min","NEG-2","Negative Test","Select followup_status = 'cancelled' → submit → check case list","Expect case to be CLOSED","—","","","",""],
  // UAT-05
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","PRE-1","Pre-requisite","UAT-01 completed — Tsarahonenana community case exists","","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","DATA","Test Data","Community: Tsarahonenana | Date: Today | Type: school_supplies | Institution: École Primaire Tsarahonenana | Male: 22 | Female: 23 | Expected Total: 45 | Age Group: 6_to_12 | Status: completed","","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","1","Test Step","Tap 'Education Program Monitoring' from home screen","Community case list opens.","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","2","Test Step","Select 'Tsarahonenana'","Community selected. Education Activity Report visible.","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","3","Test Step","Tap 'Education Activity Report'","Form opens.","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","4","Test Step","Select 'school_supplies' for education_type","scholarship_amount and training_duration_days are both HIDDEN (conditional logic).","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","5","Test Step","Enter 'École Primaire Tsarahonenana' for institution_name","Text accepted.","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","6","Test Step","Enter 22 male and 23 female students","Both values accepted.","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","7","Test Step","Verify num_students_total is auto-calculated","Total = 45 (22 + 23). Auto-calculated.","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","8","Test Step","Select '6_to_12' for age_group","Options: under_6, 6_to_12, 13_to_18, over_18, mixed.","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","9","Test Step","Select 'completed' for completion_status","Options: planned, in_progress, completed.","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","10","Test Step","Allow GPS capture and take optional photo","GPS captured. Photo optional.","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","11","Test Step","Tap Submit","Form submits. education_activity case created and AUTO-CLOSED (status = completed).","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","NEG-1","Negative Test","Select education_type = 'scholarship' → verify scholarship_amount field","Expect scholarship_amount field to APPEAR","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","NEG-2","Negative Test","Select education_type = 'vocational_training' → verify training_duration_days","Expect training_duration_days to APPEAR","—","","","",""],
  ["UAT-05","Record a School Supplies Distribution","Field Agent (Fanja)","Module 3 — Education Program Monitoring","Form 3A: Education Activity Report","10 min","NEG-3","Negative Test","Select education_type = 'teacher_training' → verify training_duration_days","Expect training_duration_days to APPEAR","—","","","",""],
  // UAT-06
  ["UAT-06","Record a Livelihood Activity","Field Agent (Fanja)","Module 4 — Livelihood & Economic Programs","Form 4A: Livelihood Activity Report","10 min","PRE-1","Pre-requisite","UAT-01 completed — Tsarahonenana community case exists","","—","","","",""],
  ["UAT-06","Record a Livelihood Activity","Field Agent (Fanja)","Module 4 — Livelihood & Economic Programs","Form 4A: Livelihood Activity Report","10 min","DATA","Test Data","Community: Tsarahonenana | Date: Today | Type: agricultural_support | Male: 15 | Female: 20 | Expected Total: 35 | Hectares: 4.5 | Income Impact: moderate_increase","","—","","","",""],
  ["UAT-06","Record a Livelihood Activity","Field Agent (Fanja)","Module 4 — Livelihood & Economic Programs","Form 4A: Livelihood Activity Report","10 min","1","Test Step","Tap 'Livelihood and Economic Programs' from home screen","Community case list opens.","—","","","",""],
  ["UAT-06","Record a Livelihood Activity","Field Agent (Fanja)","Module 4 — Livelihood & Economic Programs","Form 4A: Livelihood Activity Report","10 min","2","Test Step","Select 'Tsarahonenana'","Community selected.","—","","","",""],
  ["UAT-06","Record a Livelihood Activity","Field Agent (Fanja)","Module 4 — Livelihood & Economic Programs","Form 4A: Livelihood Activity Report","10 min","3","Test Step","Tap 'Livelihood Activity Report'","Form opens.","—","","","",""],
  ["UAT-06","Record a Livelihood Activity","Field Agent (Fanja)","Module 4 — Livelihood & Economic Programs","Form 4A: Livelihood Activity Report","10 min","4","Test Step","Select 'agricultural_support' for livelihood_type","hectares_supported field APPEARS. value_distributed is HIDDEN.","—","","","",""],
  ["UAT-06","Record a Livelihood Activity","Field Agent (Fanja)","Module 4 — Livelihood & Economic Programs","Form 4A: Livelihood Activity Report","10 min","5","Test Step","Enter 15 male and 20 female beneficiaries","Both values accepted (≥ 0).","—","","","",""],
  ["UAT-06","Record a Livelihood Activity","Field Agent (Fanja)","Module 4 — Livelihood & Economic Programs","Form 4A: Livelihood Activity Report","10 min","6","Test Step","Verify num_beneficiaries_total auto-calculated","Total = 35. Auto-calculated.","—","","","",""],
  ["UAT-06","Record a Livelihood Activity","Field Agent (Fanja)","Module 4 — Livelihood & Economic Programs","Form 4A: Livelihood Activity Report","10 min","7","Test Step","Enter '4.5' for hectares_supported","Decimal value accepted.","—","","","",""],
  ["UAT-06","Record a Livelihood Activity","Field Agent (Fanja)","Module 4 — Livelihood & Economic Programs","Form 4A: Livelihood Activity Report","10 min","8","Test Step","Select 'moderate_increase' for expected_income_impact","Options: significant_increase, moderate_increase, no_change, too_early.","—","","","",""],
  ["UAT-06","Record a Livelihood Activity","Field Agent (Fanja)","Module 4 — Livelihood & Economic Programs","Form 4A: Livelihood Activity Report","10 min","9","Test Step","Allow GPS capture","GPS captured. Required field.","—","","","",""],
  ["UAT-06","Record a Livelihood Activity","Field Agent (Fanja)","Module 4 — Livelihood & Economic Programs","Form 4A: Livelihood Activity Report","10 min","10","Test Step","Tap Submit","Form submits. New livelihood_activity case created under Tsarahonenana.","—","","","",""],
  ["UAT-06","Record a Livelihood Activity","Field Agent (Fanja)","Module 4 — Livelihood & Economic Programs","Form 4A: Livelihood Activity Report","10 min","NEG-1","Negative Test","Select livelihood_type = 'microfinance' → check field visibility","Expect value_distributed to APPEAR and hectares_supported to be HIDDEN","—","","","",""],
  ["UAT-06","Record a Livelihood Activity","Field Agent (Fanja)","Module 4 — Livelihood & Economic Programs","Form 4A: Livelihood Activity Report","10 min","NEG-2","Negative Test","Select livelihood_type = 'equipment_provision' → check field visibility","Expect value_distributed to APPEAR","—","","","",""],
  // UAT-07
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","PRE-1","Pre-requisite","UAT-01 completed — Tsarahonenana community case exists","","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","PRE-2","Pre-requisite","Water testing kit available","","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","DATA","Test Data","Community: Tsarahonenana | Date: Today | Type: water_quality | pH: 5.2 | Turbidity: turbid | Risk: high | Corrective Action: Yes | Description: Stream shows signs of acid mine drainage. pH 5.2. Recommend urgent inspection.","","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","1","Test Step","Tap 'Environmental Monitoring' from home screen","Community case list opens.","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","2","Test Step","Select 'Tsarahonenana'","Community selected.","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","3","Test Step","Tap 'Environmental Monitoring Report'","Form opens with monitoring_date defaulting to today.","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","4","Test Step","Select 'water_quality' for monitoring_type","water_ph and water_turbidity fields APPEAR. trees_planted, species_observed, area_rehabilitated_ha remain hidden.","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","5","Test Step","Enter '5.2' for water_ph","Decimal accepted. Valid range: 0–14.","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","6","Test Step","Select 'turbid' for water_turbidity","Options: clear, slightly_turbid, turbid, very_turbid.","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","7","Test Step","Select 'high' for risk_level","Options: low, medium, high, critical.","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","8","Test Step","Set corrective_action_needed = Yes","corrective_action_desc field APPEARS.","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","9","Test Step","Enter corrective action description","Long text accepted.","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","10","Test Step","Allow GPS to auto-capture at stream location","GPS captured. Required field.","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","11","Test Step","Take photo for photo_evidence_1 (REQUIRED)","Photo captured. Form cannot submit without this photo.","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","12","Test Step","Optionally take photo_evidence_2","Second photo optional.","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","13","Test Step","Tap Submit","Form submits. New env_monitoring case created. Case stays OPEN (corrective action pending).","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","NEG-1","Negative Test","Enter -1 for water_ph → submit","Expect validation error (min = 0)","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","NEG-2","Negative Test","Enter 15 for water_ph → submit","Expect validation error (max = 14)","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","NEG-3","Negative Test","Select monitoring_type = 'reforestation' → check fields","Expect water_ph/turbidity HIDDEN and trees_planted to APPEAR","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","NEG-4","Negative Test","Select monitoring_type = 'biodiversity' → check fields","Expect species_observed to APPEAR","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","NEG-5","Negative Test","Set corrective_action_needed = No → check corrective_action_desc","Expect corrective_action_desc to be HIDDEN","—","","","",""],
  ["UAT-07","Monitor Water Quality Near the Mine","Field Agent (Fanja)","Module 5 — Environmental Monitoring","Form 5A: Environmental Monitoring Report","10–15 min","NEG-6","Negative Test","Submit without photo_evidence_1","Expect validation error — photo_evidence_1 is required","—","","","",""],
  // UAT-08
  ["UAT-08","Register a Community Grievance","Field Agent (Fanja)","Module 6 — Stakeholder Engagement & Grievances","Form 6A: Grievance Registration","10 min","PRE-1","Pre-requisite","UAT-01 completed — Tsarahonenana community case exists","","—","","","",""],
  ["UAT-08","Register a Community Grievance","Field Agent (Fanja)","Module 6 — Stakeholder Engagement & Grievances","Form 6A: Grievance Registration","10 min","DATA","Test Data","Community: Tsarahonenana | Reporter: (blank — anonymous) | Category: infrastructure_damage | Severity: high | Description: Mine blasting caused cracks in walls of 4 homes. Residents concerned about structural safety. | Assigned To: Jean-Pierre Mbeki","","—","","","",""],
  ["UAT-08","Register a Community Grievance","Field Agent (Fanja)","Module 6 — Stakeholder Engagement & Grievances","Form 6A: Grievance Registration","10 min","1","Test Step","Tap 'Stakeholder Engagement and Grievances' from home screen","Community case list opens.","—","","","",""],
  ["UAT-08","Register a Community Grievance","Field Agent (Fanja)","Module 6 — Stakeholder Engagement & Grievances","Form 6A: Grievance Registration","10 min","2","Test Step","Select 'Tsarahonenana'","Community selected.","—","","","",""],
  ["UAT-08","Register a Community Grievance","Field Agent (Fanja)","Module 6 — Stakeholder Engagement & Grievances","Form 6A: Grievance Registration","10 min","3","Test Step","Tap 'Grievance Registration'","Form opens with report_date defaulting to today.","—","","","",""],
  ["UAT-08","Register a Community Grievance","Field Agent (Fanja)","Module 6 — Stakeholder Engagement & Grievances","Form 6A: Grievance Registration","10 min","4","Test Step","Leave reporter_name blank (anonymous reporting)","Field is optional. Form does not require a name.","—","","","",""],
  ["UAT-08","Register a Community Grievance","Field Agent (Fanja)","Module 6 — Stakeholder Engagement & Grievances","Form 6A: Grievance Registration","10 min","5","Test Step","Select 'infrastructure_damage' for grievance_category","Options: environmental_damage, health_concern, land_dispute, noise_vibration, employment, compensation, safety, infrastructure_damage, other.","—","","","",""],
  ["UAT-08","Register a Community Grievance","Field Agent (Fanja)","Module 6 — Stakeholder Engagement & Grievances","Form 6A: Grievance Registration","10 min","6","Test Step","Select 'high' for severity","Options: low, medium, high, critical.","—","","","",""],
  ["UAT-08","Register a Community Grievance","Field Agent (Fanja)","Module 6 — Stakeholder Engagement & Grievances","Form 6A: Grievance Registration","10 min","7","Test Step","Enter description (minimum 20 characters)","Text accepted. Validation requires at least 20 characters.","—","","","",""],
  ["UAT-08","Register a Community Grievance","Field Agent (Fanja)","Module 6 — Stakeholder Engagement & Grievances","Form 6A: Grievance Registration","10 min","8","Test Step","Allow optional GPS capture","GPS optional for grievances.","—","","","",""],
  ["UAT-08","Register a Community Grievance","Field Agent (Fanja)","Module 6 — Stakeholder Engagement & Grievances","Form 6A: Grievance Registration","10 min","9","Test Step","Enter 'Jean-Pierre Mbeki' for assigned_to","Optional text field accepted.","—","","","",""],
  ["UAT-08","Register a Community Grievance","Field Agent (Fanja)","Module 6 — Stakeholder Engagement & Grievances","Form 6A: Grievance Registration","10 min","10","Test Step","Tap Submit","Form submits. New grievance case created with resolution_status = 'open' automatically.","—","","","",""],
  ["UAT-08","Register a Community Grievance","Field Agent (Fanja)","Module 6 — Stakeholder Engagement & Grievances","Form 6A: Grievance Registration","10 min","11","Test Step","Check grievance case in the case list","New grievance visible. resolution_status = open.","—","","","",""],
  ["UAT-08","Register a Community Grievance","Field Agent (Fanja)","Module 6 — Stakeholder Engagement & Grievances","Form 6A: Grievance Registration","10 min","NEG-1","Negative Test","Enter only 10 characters in description → submit","Expect validation error (min 20 chars required)","—","","","",""],
  // UAT-09
  ["UAT-09","Resolve a Grievance","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6B: Grievance Follow-up / Resolution","10 min","PRE-1","Pre-requisite","UAT-08 completed — open grievance case exists for Tsarahonenana","","—","","","",""],
  ["UAT-09","Resolve a Grievance","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6B: Grievance Follow-up / Resolution","10 min","PRE-2","Pre-requisite","Logged in as Site Supervisor","","—","","","",""],
  ["UAT-09","Resolve a Grievance","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6B: Grievance Follow-up / Resolution","10 min","DATA","Test Data","Grievance: Infrastructure damage from UAT-08 | Follow-up Date: Today | Action: Engineering team inspected and repaired all 4 homes. Families compensated per company policy. | Status: resolved | Community Satisfied: yes","","—","","","",""],
  ["UAT-09","Resolve a Grievance","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6B: Grievance Follow-up / Resolution","10 min","1","Test Step","Tap 'Stakeholder Engagement and Grievances' from home screen","List of open grievance cases shown.","—","","","",""],
  ["UAT-09","Resolve a Grievance","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6B: Grievance Follow-up / Resolution","10 min","2","Test Step","Select the infrastructure_damage grievance from UAT-08","Case selected.","—","","","",""],
  ["UAT-09","Resolve a Grievance","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6B: Grievance Follow-up / Resolution","10 min","3","Test Step","Tap 'Grievance Follow-up'","Form opens with followup_date defaulting to today.","—","","","",""],
  ["UAT-09","Resolve a Grievance","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6B: Grievance Follow-up / Resolution","10 min","4","Test Step","Enter action_taken description","Long text accepted. Required field.","—","","","",""],
  ["UAT-09","Resolve a Grievance","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6B: Grievance Follow-up / Resolution","10 min","5","Test Step","Select 'resolved' for resolution_status","Options: open, investigating, resolved, escalated, closed_unresolved. community_satisfied field APPEARS.","—","","","",""],
  ["UAT-09","Resolve a Grievance","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6B: Grievance Follow-up / Resolution","10 min","6","Test Step","Select 'yes' for community_satisfied","Options: yes, partially, no.","—","","","",""],
  ["UAT-09","Resolve a Grievance","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6B: Grievance Follow-up / Resolution","10 min","7","Test Step","Tap Submit","Form submits. days_to_resolve auto-calculated (today - report_date).","—","","","",""],
  ["UAT-09","Resolve a Grievance","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6B: Grievance Follow-up / Resolution","10 min","8","Test Step","Navigate back to grievance case list","Resolved grievance NO LONGER appears in open cases list — case is CLOSED.","—","","","",""],
  ["UAT-09","Resolve a Grievance","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6B: Grievance Follow-up / Resolution","10 min","NEG-1","Negative Test","Select resolution_status = 'investigating' → check community_satisfied","Expect community_satisfied to be HIDDEN","—","","","",""],
  ["UAT-09","Resolve a Grievance","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6B: Grievance Follow-up / Resolution","10 min","NEG-2","Negative Test","Select resolution_status = 'closed_unresolved' → submit → check case","Expect case to be CLOSED","—","","","",""],
  ["UAT-09","Resolve a Grievance","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6B: Grievance Follow-up / Resolution","10 min","NEG-3","Negative Test","Select resolution_status = 'escalated' → submit → check case","Expect case to remain OPEN","—","","","",""],
  // UAT-10
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","PRE-1","Pre-requisite","UAT-01 completed — Tsarahonenana community case exists","","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","PRE-2","Pre-requisite","Logged in as Site Supervisor","","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","DATA","Test Data","Date: Today | Type: town_hall | Community: Tsarahonenana | Male: 20 | Female: 25 | Topics: employment/environment/compensation/infrastructure | Key Outcomes: Community informed of expansion. Mine committed to monthly updates and priority hiring. | Follow-up: Yes","","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","1","Test Step","Tap 'Stakeholder Engagement and Grievances' from home screen","Module options visible.","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","2","Test Step","Tap 'Community Consultation Log'","Form opens directly (no case list — standalone form).","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","3","Test Step","Enter today's date for consultation_date","Date accepted.","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","4","Test Step","Select 'town_hall' for consultation_type","Options: town_hall, focus_group, one_on_one, written_submission, public_hearing.","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","5","Test Step","Select 'Tsarahonenana' from community_name_ref lookup","Community selected from case list lookup.","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","6","Test Step","Enter 20 male and 25 female attendees","Both values accepted.","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","7","Test Step","Select topics: employment, environment, compensation, infrastructure","Multi-select works. All 4 options selected.","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","8","Test Step","Enter key_outcomes summary","Long text accepted. Required field.","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","9","Test Step","Set follow_up_required = Yes","Options: yes, no.","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","10","Test Step","Tap Submit","Form submits as standalone data. App returns to home screen.","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","11","Test Step","Check all case lists (community, grievance, etc.)","NO new case created anywhere — data stored as form submission only.","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","NEG-1","Negative Test","Leave key_outcomes blank → submit","Expect validation error","—","","","",""],
  ["UAT-10","Log a Community Consultation","Site Supervisor (Jean-Pierre)","Module 6 — Stakeholder Engagement & Grievances","Form 6C: Community Consultation Log","10 min","NEG-2","Negative Test","Leave consultation_type blank → submit","Expect validation error","—","","","",""],
  // UAT-11
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","PRE-1","Pre-requisite","App synced while online before starting — all existing cases downloaded to device","","—","","","",""],
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","PRE-2","Pre-requisite","Turn OFF wifi and mobile data BEFORE starting Step 1","","—","","","",""],
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","DATA","Test Data","New Community: Ambohimahasoa | Beneficiary: Haja Rakotondrabe | Health Activity: Vaccination session — 15 children | Grievance: Noise complaint — high severity","","—","","","",""],
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","1","Test Step","Turn OFF wifi and mobile data on the device","Device has no internet connection.","—","","","",""],
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","2","Test Step","Open the CSR Impact Monitor app","App loads from local cache. No crash. Home screen visible.","—","","","",""],
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","3","Test Step","Navigate to Community Registration and register 'Ambohimahasoa'","Form completes and submits locally. Confirmation shown. Queued for sync.","—","","","",""],
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","4","Test Step","Navigate to Beneficiary Registration under existing community, register 'Haja Rakotondrabe'","Form submits locally. Queued for sync.","—","","","",""],
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","5","Test Step","Navigate to Health Activity Report, record a vaccination session (15 children)","Form submits locally. num_children_under5 visible (activity_type = vaccination). Queued.","—","","","",""],
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","6","Test Step","Navigate to Grievance Registration, register a noise complaint","Form submits locally. Queued for sync.","—","","","",""],
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","7","Test Step","Browse case lists and navigate between all modules","All existing cases visible from local cache. No crashes in 30 minutes.","—","","","",""],
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","8","Test Step","Turn wifi or mobile data back ON","Device reconnects to internet.","—","","","",""],
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","9","Test Step","Tap the Sync button in the app","All 4 queued forms upload. Sync confirmation shown.","—","","","",""],
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","10","Test Step","Check CommCare HQ web interface","All 4 submissions appear correctly. Cases created with right data and hierarchy.","—","","","",""],
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","11","Test Step","Check 'Ambohimahasoa' appears in community case list on device","New community case now visible and synced.","—","","","",""],
  ["UAT-11","Full Offline Mode Test","Field Agent (Fanja)","All Modules","Forms 1A + 1B + 2A + 6A","30–45 min","NEG-1","Negative Test","Interrupt sync mid-way by turning off wifi → re-enable → verify sync completes","Expect sync to resume and complete without any data loss","—","","","",""],
];

// Result column index = 10
const RESULT_COL = 10;
const NOTES_COL  = 11;
const TESTER_COL = 12;
const DATE_COL   = 13;
const DEVICE_COL = 14;

// Only Test Step and Negative Test rows get a status dropdown
const isEditable = (row) => ["Test Step","Negative Test"].includes(row[7]);

const DEF_HEADERS = ["Defect ID","Test ID","Module","Severity","Title","Steps to Reproduce","Expected Result","Actual Result","Evidence","Reported By","Date Reported","Assigned To","Status","Resolution","Date Resolved"];
const DEF_ROWS_INIT = [["DEF-001","","","","","","","","","","","","Open","",""]];

const SO_HEADERS = ["Area","Test IDs Covered","Tester Name","Role","Pass","Fail","Pending","Sign-off Date","Status","Comments"];
const SO_ROWS_INIT = [
  ["Module 1 — Registration","UAT-01, UAT-02","","Field Agent","","","","","Pending",""],
  ["Module 2 — Health","UAT-03, UAT-04","","Field Agent","","","","","Pending",""],
  ["Module 3 — Education","UAT-05","","Field Agent","","","","","Pending",""],
  ["Module 4 — Livelihood","UAT-06","","Field Agent","","","","","Pending",""],
  ["Module 5 — Environment","UAT-07","","Field Agent","","","","","Pending",""],
  ["Module 6 — Grievances (6A/6B)","UAT-08, UAT-09","","Field Agent + Supervisor","","","","","Pending",""],
  ["Module 6 — Consultation (6C)","UAT-10","","Site Supervisor","","","","","Pending",""],
  ["Offline & Sync","UAT-11","","Field Agent","","","","","Pending",""],
  ["OVERALL SIGN-OFF","All","","CSR Manager + Lead","","","","","Pending",""],
];

// ── helpers ───────────────────────────────────────────────────────────────────
function esc(v){const s=String(v??"");return s.includes(",")||s.includes('"')||s.includes("\n")?`"${s.replace(/"/g,'""')}"`  :s;}
function downloadCsv(rows,filename){
  const blob=new Blob([rows.map(r=>r.map(esc).join(",")).join("\n")],{type:"text/csv"});
  const a=Object.assign(document.createElement("a"),{href:URL.createObjectURL(blob),download:filename});
  a.click();URL.revokeObjectURL(a.href);
}

function StatusSelect({value,options,onChange}){
  return(
    <select value={value} onChange={e=>onChange(e.target.value)}
      className={`text-xs font-medium px-2 py-1 rounded border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${STATUS_COLOR[value]||"bg-gray-100 text-gray-600"}`}>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );
}
function EditCell({value,onChange,wide}){
  return(
    <input type="text" value={value} onChange={e=>onChange(e.target.value)}
      className={`text-xs border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400 ${wide?"w-32":"w-20"}`}/>
  );
}
function ProgressBar({rows,statusCol,editableOnly}){
  const scoped = editableOnly ? rows.filter(r=>isEditable(r)) : rows;
  const total=scoped.length;
  const pass=scoped.filter(r=>["Pass","Resolved","Approved"].includes(r[statusCol])).length;
  const fail=scoped.filter(r=>["Fail","Rejected"].includes(r[statusCol])).length;
  const pct=total?Math.round((pass/total)*100):0;
  return(
    <div className="flex items-center gap-3 px-6 py-2 bg-white border-b border-gray-100 text-xs">
      <span className="text-gray-500">Progress (test steps only):</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div className="bg-green-500 h-2 rounded-full transition-all" style={{width:`${pct}%`}}/>
      </div>
      <span className="font-semibold text-gray-700">{pct}%</span>
      <span className="text-green-600 font-medium">✓ {pass} pass</span>
      <span className="text-red-500 font-medium">✗ {fail} fail</span>
      <span className="text-gray-400">{total-pass-fail} remaining</span>
    </div>
  );
}

const TABS=["UAT Summary","Test Cases","Defect Log","Sign-off Tracker"];
const SUMMARY=[
  ["Field","Value"],["Project","CSR Impact Monitor (CommCare MVP)"],["Version","1.0"],["Date","March 2026"],["Prepared By","UAT Coordinator"],
  ["",""],["OVERALL METRICS",""],["Total Scenarios","11"],["Total Steps (incl. PRE/NEG)","170+"],
  ["",""],["MODULE COVERAGE",""],["Module","Scenarios"],
  ["Module 1 — Registration","UAT-01, UAT-02"],["Module 2 — Health","UAT-03, UAT-04"],
  ["Module 3 — Education","UAT-05"],["Module 4 — Livelihood","UAT-06"],
  ["Module 5 — Environment","UAT-07"],["Module 6 — Grievances/Engagement","UAT-08, UAT-09, UAT-10"],
  ["Offline & Sync","UAT-11"],
  ["",""],["EXIT CRITERIA","Status"],
  ["All P1 Critical pass","Pending"],["All P2 Major resolved","Pending"],
  ["Dashboard KPIs validated","Pending"],["CSR Manager sign-off","Pending"],["GRI 14 export validated","Pending"],
];

export default function App(){
  const [tab,setTab]=useState(0);
  const [tcRows,setTcRows]=useState(TC_ROWS_INIT.map(r=>[...r]));
  const [defRows,setDefRows]=useState(DEF_ROWS_INIT.map(r=>[...r]));
  const [soRows,setSoRows]=useState(SO_ROWS_INIT.map(r=>[...r]));
  const [filter,setFilter]=useState("All");

  const updater=setter=>(ri,ci,val)=>setter(prev=>prev.map((r,i)=>i===ri?r.map((c,j)=>j===ci?val:c):r));
  const updateTc=updater(setTcRows);
  const updateDef=updater(setDefRows);
  const updateSo=updater(setSoRows);

  const addDefect=()=>{
    const id=`DEF-${String(defRows.length+1).padStart(3,"0")}`;
    setDefRows(prev=>[...prev,[id,"","","","","","","","","","","","Open","",""]]);
  };

  // unique UAT IDs for filter
  const uatIds=["All",...[...new Set(TC_ROWS_INIT.map(r=>r[0]))]];
  const visibleRows=filter==="All"?tcRows:tcRows.filter(r=>r[0]===filter);

  return(
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* header */}
      <div className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-xs uppercase tracking-widest text-blue-200 mb-1">Dimagi · CommCare MVP</div>
          <div className="text-xl font-bold">CSR Impact Monitor — UAT Workbook</div>
          <div className="text-sm text-blue-200 mt-1">v1.0 · March 2026 · 11 scenarios · 170+ steps</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tab===0&&<button onClick={()=>downloadCsv(SUMMARY,"UAT_Summary.csv")} className="bg-white text-blue-700 font-semibold text-xs px-3 py-2 rounded-lg hover:bg-blue-50">⬇ Summary CSV</button>}
          {tab===1&&<button onClick={()=>downloadCsv([TC_HEADERS,...tcRows],"UAT_Test_Cases_Updated.csv")} className="bg-white text-blue-700 font-semibold text-xs px-3 py-2 rounded-lg hover:bg-blue-50">⬇ Export Test Cases</button>}
          {tab===2&&<button onClick={()=>downloadCsv([DEF_HEADERS,...defRows],"UAT_Defect_Log_Updated.csv")} className="bg-white text-blue-700 font-semibold text-xs px-3 py-2 rounded-lg hover:bg-blue-50">⬇ Export Defect Log</button>}
          {tab===3&&<button onClick={()=>downloadCsv([SO_HEADERS,...soRows],"UAT_Signoff_Updated.csv")} className="bg-white text-blue-700 font-semibold text-xs px-3 py-2 rounded-lg hover:bg-blue-50">⬇ Export Sign-off</button>}
        </div>
      </div>

      {/* tabs */}
      <div className="flex border-b border-gray-200 bg-white px-6">
        {TABS.map((t,i)=>(
          <button key={i} onClick={()=>setTab(i)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${tab===i?"border-blue-600 text-blue-700":"border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* progress */}
      {tab===1&&<ProgressBar rows={tcRows} statusCol={RESULT_COL} editableOnly={true}/>}
      {tab===2&&<ProgressBar rows={defRows} statusCol={12}/>}
      {tab===3&&<ProgressBar rows={soRows} statusCol={8}/>}

      {/* filter bar for test cases */}
      {tab===1&&(
        <div className="bg-white px-6 py-2 border-b border-gray-100 flex gap-2 flex-wrap items-center text-xs">
          <span className="text-gray-500 font-medium">Filter by scenario:</span>
          {uatIds.map(id=>(
            <button key={id} onClick={()=>setFilter(id)}
              className={`px-2 py-0.5 rounded font-medium border transition ${filter===id?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>
              {id}
            </button>
          ))}
          <span className="ml-auto text-gray-400">{visibleRows.length} rows shown</span>
        </div>
      )}

      {/* ── SUMMARY ── */}
      {tab===0&&(
        <div className="overflow-x-auto px-4 py-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs">
            <thead><tr className="bg-gray-100 text-gray-600 uppercase">
              {SUMMARY[0].map((h,i)=><th key={i} className="px-3 py-2 text-left font-semibold border-b border-gray-200 whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>
              {SUMMARY.slice(1).map((row,ri)=>(
                <tr key={ri} className={ri%2===0?"bg-white":"bg-gray-50"}>
                  {row.map((v,ci)=><td key={ci} className="px-3 py-2 border-b border-gray-100 text-gray-700 font-medium whitespace-nowrap">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TEST CASES ── */}
      {tab===1&&(
        <div className="overflow-x-auto px-4 py-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase">
                {TC_HEADERS.map((h,i)=><th key={i} className="px-3 py-2 text-left font-semibold border-b border-gray-200 whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row,ri)=>{
                const stepType=row[7];
                const rowBg=STEP_TYPE_COLOR[stepType]||"bg-white text-gray-700";
                const editable=isEditable(row);
                // find original index for state update
                const origIdx=tcRows.indexOf(row);
                return(
                  <tr key={ri} className={`border-b border-gray-100 ${rowBg}`}>
                    {TC_HEADERS.map((_,ci)=>{
                      const v=row[ci]??"";
                      // Result column — dropdown only for Test Step / Negative Test
                      if(ci===RESULT_COL){
                        if(editable) return(
                          <td key={ci} className="px-2 py-1.5">
                            <StatusSelect value={v} options={TC_STATUSES} onChange={val=>updateTc(origIdx,ci,val)}/>
                          </td>);
                        return <td key={ci} className="px-3 py-1.5 text-gray-400 italic">—</td>;
                      }
                      // Editable text cells
                      if(editable&&(ci===NOTES_COL||ci===TESTER_COL||ci===DATE_COL||ci===DEVICE_COL))
                        return<td key={ci} className="px-2 py-1.5"><EditCell value={v} onChange={val=>updateTc(origIdx,ci,val)} wide={ci===NOTES_COL}/></td>;
                      // Step type badge
                      if(ci===7)
                        return<td key={ci} className="px-2 py-1.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${STEP_TYPE_COLOR[v]||""}`}>{v}</span>
                        </td>;
                      return<td key={ci} className="px-3 py-1.5 whitespace-nowrap max-w-xs truncate">{v}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── DEFECT LOG ── */}
      {tab===2&&(
        <div className="overflow-x-auto px-4 py-4">
          <div className="mb-2 flex justify-end">
            <button onClick={addDefect} className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700">+ Add Defect</button>
          </div>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs">
            <thead><tr className="bg-gray-100 text-gray-600 uppercase">
              {DEF_HEADERS.map((h,i)=><th key={i} className="px-3 py-2 text-left font-semibold border-b border-gray-200 whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>
              {defRows.map((row,ri)=>(
                <tr key={ri} className={ri%2===0?"bg-white":"bg-gray-50"}>
                  {DEF_HEADERS.map((_,ci)=>{
                    const v=row[ci]??"";
                    if(ci===12) return<td key={ci} className="px-2 py-1.5 border-b border-gray-100"><StatusSelect value={v} options={DEF_STATUSES} onChange={val=>updateDef(ri,ci,val)}/></td>;
                    if(ci===0) return<td key={ci} className="px-3 py-1.5 border-b border-gray-100 font-medium text-blue-700 whitespace-nowrap">{v}</td>;
                    return<td key={ci} className="px-2 py-1.5 border-b border-gray-100 min-w-16"><EditCell value={v} onChange={val=>updateDef(ri,ci,val)}/></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── SIGN-OFF ── */}
      {tab===3&&(
        <div className="overflow-x-auto px-4 py-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs">
            <thead><tr className="bg-gray-100 text-gray-600 uppercase">
              {SO_HEADERS.map((h,i)=><th key={i} className="px-3 py-2 text-left font-semibold border-b border-gray-200 whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>
              {soRows.map((row,ri)=>(
                <tr key={ri} className={`${ri%2===0?"bg-white":"bg-gray-50"} ${ri===soRows.length-1?"font-semibold border-t-2 border-gray-300":""}`}>
                  {SO_HEADERS.map((_,ci)=>{
                    const v=row[ci]??"";
                    if(ci===8) return<td key={ci} className="px-2 py-1.5 border-b border-gray-100"><StatusSelect value={v} options={SO_STATUSES} onChange={val=>updateSo(ri,ci,val)}/></td>;
                    if(ci===2||ci===7||ci===9) return<td key={ci} className="px-2 py-1.5 border-b border-gray-100 min-w-24"><EditCell value={v} onChange={val=>updateSo(ri,ci,val)}/></td>;
                    return<td key={ci} className="px-3 py-1.5 border-b border-gray-100 whitespace-nowrap text-gray-700">{v}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-6 pb-6 pt-2 text-xs text-gray-400">
        💡 Status changes are session-only. Use ⬇ Export to download your updated data as CSV.
      </div>
    </div>
  );
}