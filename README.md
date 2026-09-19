# Netram AI Monitor

# BUILD A COMPLETE APP — NETRAM AI (SIH 2026 PS26095)

You are a senior product designer, Flutter/Firebase full-stack engineer and SIH hackathon product developer.

Build a complete, production-quality, demo-ready Flutter mobile application called:

NETRAM AI

For:

SMART INDIA HACKATHON 2026

Problem Statement: SIH26095

Organization: Ministry of Social Justice & Empowerment (DoSJE)

The application must be fully navigable, functional where possible, realistic, polished and suitable for an SIH Round 1 demonstration.

IMPORTANT:

A UI reference/poster image has been provided with this prompt.

THE PROVIDED REFERENCE IMAGE IS THE PRIMARY VISUAL REFERENCE.

Do not create a generic Flutter dashboard.

Analyze the reference image carefully and maintain its:

- Color palette

- Visual hierarchy

- Typography style

- Spacing

- Shape language

- Button style

- Card style

- Accent colors

- Section composition

- Geometric design language

- White-space balance

Every screen of NETRAM AI must look like it belongs to the same visual identity.

==================================================

1. PROJECT OVERVIEW

==================================================

NETRAM AI is an AI-assisted NGO monitoring and inspection platform for the Department of Social Justice & Empowerment.

The system helps government officers monitor NGOs funded under government schemes.

Core objectives:

- NGO monitoring

- Surprise inspections

- Geo-tagged evidence collection

- AI-assisted attendance verification

- Compliance monitoring

- CCTV status monitoring

- Inspection reporting

- Risk identification

- Centralized NGO information

Target users:

1. Government Inspection Officers

2. State Officers

3. NGO Administrators

There are TWO major application experiences:

ADMIN / GOVERNMENT OFFICER PANEL

and

USER / INSPECTION OFFICER PANEL

Both must use the exact same NETRAM AI visual design system.

==================================================

2. IMPORTANT AUTHENTICATION MODEL

==================================================

Implement TWO different login experiences.

------------------------------------------

ADMIN LOGIN

------------------------------------------

The Admin / Government Officer login must use:

ACCESS CODE

The admin should NOT login through Google.

Admin login screen:

NETRAM AI

Government Administration Portal

Enter Admin Access Code

[ Access Code Input ]

[ LOGIN AS ADMIN ]

For the SIH DEMO:

Allow these demo access codes:

1111

1234

IMPORTANT:

Do NOT expose these codes visually anywhere inside the application UI.

For demo/local development, store them in a secure configuration/environment variable or backend authentication layer.

After successful access-code validation:

Navigate to:

ADMIN DASHBOARD

Admin permissions:

- View all NGOs

- View all inspections

- View NGO locations

- View compliance data

- View AI attendance results

- View alerts

- View reports

- Manage users

- Manage NGOs

- Review submitted inspections

- View evidence

- View inspection history

- View audit activity

------------------------------------------

USER / OFFICER LOGIN

------------------------------------------

Normal users should have a REAL GOOGLE LOGIN FLOW.

Login screen:

NETRAM AI

Inspection Officer Portal

[ Continue with Google ]

Also provide:

Email Login

Register

Forgot Password

Google authentication must use:

Firebase Authentication

Google Sign-In

Do NOT create a fake Google login button.

Use the actual Firebase Google authentication flow.

After successful Google login:

- Check Firestore user profile.

- Determine user role.

- Navigate to the appropriate dashboard.

For first-time users:

Create a Firestore user profile automatically.

Fields:

name

email

photoUrl

role

district

createdAt

Default role:

inspection_officer

Admin role should NOT be assigned from the client.

==================================================

3. AUTHENTICATION FLOW

==================================================

Application startup:

Splash Screen

↓

Check Firebase authentication state

↓

If Admin session exists:

Admin Dashboard

If Google user exists:

User Dashboard

If no session:

Login Selection Screen

Create an initial authentication selection page:

NETRAM AI

Smart NGO Monitoring & Inspection

[ Government Admin ]

[ Inspection Officer ]

The design must remain minimal.

Admin button:

Open Admin Access Code screen.

Inspection Officer button:

Open Google / Firebase login screen.

==================================================

4. DESIGN SYSTEM — VERY IMPORTANT

==================================================

The provided reference/poster image MUST be treated as the visual source of truth.

Do not randomly change the design for different screens.

Maintain ONE unified design system.

PRIMARY VISUAL STYLE:

Clean

Modern

Professional

Government technology

Minimal

Premium

Trustworthy

Data-focused

Use a white/light background.

Use strong blue as the primary brand color.

Use orange as the major accent.

Use green for positive/verified states.

Use red for warnings/high-risk states.

Suggested palette:

Primary Blue:

#1557E8

Deep Blue:

#123B8F

Orange:

#FF7A00

Green:

#16A34A

Red:

#DC2626

Background:

#F7F9FC

White:

#FFFFFF

Primary Text:

#111827

Secondary Text:

#667085

Borders:

#E5E7EB

IMPORTANT:

Do not make the entire app blue.

White should remain the dominant surface color.

Use blue and orange strategically as accents.

Use the same colors on:

- Login

- Dashboard

- Map

- Inspection

- Attendance

- Reports

- Profile

- Admin panel

- Forms

- Dialogues

- Bottom navigation

- Buttons

- Status badges

==================================================

5. POSTER-INSPIRED VISUAL LANGUAGE

==================================================

The reference image contains a clean, modern, structured technology aesthetic.

Replicate the design principles rather than blindly copying the poster.

Use:

- Strong typography

- Large headings

- Clean white sections

- Blue/orange accent blocks

- Geometric visual elements

- Thin borders

- Structured cards

- Strong alignment

- Generous whitespace

- Minimal shadows

- Consistent rounded corners

Cards:

12–20px radius.

Buttons:

10–14px radius.

Avoid excessive glassmorphism.

Use subtle shadows only.

Avoid generic Material 3 default styling when it conflicts with the reference.

Material 3 components should be customized to match the NETRAM AI design.

==================================================

6. TYPOGRAPHY

==================================================

Use:

Google Sans if available.

Fallback:

Poppins.

Headings:

Bold / ExtraBold.

Body:

Regular / Medium.

Statistics:

Large and bold.

Labels:

Small and uppercase where appropriate.

Maintain consistent typography hierarchy across all screens.

==================================================

7. NO EMOJIS

==================================================

IMPORTANT:

Do NOT use emojis anywhere in the application UI.

Do not use:

camera emojis

location emojis

warning emojis

person emojis

AI emojis

dashboard emojis

Instead use professional SVG icons.

Use:

Lucide icons

Material Symbols

or Flutter Icons.

Icons must visually match the reference style.

==================================================

8. APP STRUCTURE

==================================================

Create:

Splash

Authentication

Admin Panel

User / Officer Panel

USER BOTTOM NAVIGATION:

Dashboard

Map

Attendance

Reports

Profile

ADMIN NAVIGATION:

Dashboard

NGOs

Inspections

Map

Attendance

Alerts

Reports

Users

Settings

==================================================

9. SPLASH SCREEN

==================================================

Show:

NETRAM AI

AI-POWERED NGO MONITORING

Department of Social Justice & Empowerment

Minimal animated loading indicator.

Use the same blue/orange visual language.

No excessive animation.

Navigate automatically after Firebase initialization.

==================================================

10. LOGIN SELECTION SCREEN

==================================================

Create:

NETRAM AI

Smart NGO Monitoring & Inspection Platform

Two clean options:

GOVERNMENT ADMINISTRATION

Manage monitoring, inspections and compliance.

[ Continue as Admin ]

INSPECTION OFFICER

Conduct field inspections and submit evidence.

[ Continue as Officer ]

Keep this screen visually premium and minimal.

==================================================

11. ADMIN ACCESS CODE SCREEN

==================================================

Title:

Government Administration

Subtitle:

Authorized access for department officials.

Input:

Admin Access Code

Use numeric keypad-friendly input.

Button:

LOGIN

Demo access codes:

1111

1234

After successful validation:

Admin Dashboard.

Wrong code:

Show:

Invalid access code

Please verify your credentials.

Do not expose valid access codes in the UI.

Persist admin session locally for demo purposes, but structure authentication so it can later be replaced with Firebase/backend authorization.

==================================================

12. GOOGLE OFFICER LOGIN

==================================================

Create:

Inspection Officer Login

[ Continue with Google ]

Use REAL:

Firebase Authentication

Google Sign-In.

After successful login:

Retrieve:

name

email

profile image

from Google.

Create/update Firestore user profile.

Show user profile image throughout the application.

==================================================

13. ADMIN DASHBOARD

==================================================

Admin dashboard should immediately answer:

How many NGOs are being monitored?

How many inspections are pending?

Which NGOs require attention?

Where are NGOs located?

What AI alerts exist?

What reports require review?

Header:

NETRAM AI

Government Monitoring Portal

System Status:

Operational

Statistics:

TOTAL NGOs

ACTIVE NGOs

TODAY'S INSPECTIONS

PENDING REVIEWS

AI ALERTS

AVERAGE COMPLIANCE

Create large modern cards inspired by the reference image.

Do not make the dashboard look like a generic banking dashboard.

==================================================

14. ADMIN NGO MONITORING

==================================================

NGO management screen.

Search.

Filters:

State

District

Compliance

CCTV Status

Risk Level

NGO card:

NGO Name

City

District

Compliance Score

CCTV Status

Last Inspection

Risk Level

Example:

Sahyog Welfare Foundation

Chandigarh

Compliance:

92%

CCTV:

Active

Last Inspection:

17 Sep 2026

Risk:

LOW

==================================================

15. ADMIN LIVE MAP

==================================================

Use a REAL WORKING MAP.

IMPORTANT:

Do NOT use a static image as the map.

Use:

Google Maps Flutter

OR

if avoiding paid Google Maps dependency:

Flutter Map + OpenStreetMap.

Prefer:

Google Maps Flutter

if a Google Maps API key is configured.

The map must use real map tiles and allow:

- Pan

- Zoom

- Current location

- NGO markers

- Inspection locations

- Officer locations where permission is available

NGO coordinates must come from Firestore.

Marker colors:

Green:

Good compliance

Orange:

Warning

Red:

High Risk

Blue:

Normal

Tap marker:

Open a bottom sheet.

Show:

NGO Name

Location

Compliance

Risk Level

CCTV Status

Last Inspection

Buttons:

View NGO

Start Inspection

Do NOT fake live GPS.

If location permission is denied:

Show:

Location access is required for live officer tracking.

==================================================

16. USER/OFFICER DASHBOARD

==================================================

After Google login:

Show:

Welcome, [Officer Name]

Profile image.

Cards:

Today's Inspections

Pending Reports

Attendance Checks

AI Alerts

Recent assignments:

NGO Name

Location

Inspection Type

Scheduled Date

Status

Primary CTA:

START INSPECTION

==================================================

17. START INSPECTION

==================================================

When officer clicks:

START INSPECTION

Create inspection workflow.

STEP 1:

Select NGO

STEP 2:

Verify Location

STEP 3:

Verify Attendance

STEP 4:

Inspect Infrastructure

STEP 5:

Check CCTV

STEP 6:

Capture Evidence

STEP 7:

Add Remarks

STEP 8:

Submit Report

Use a progress indicator.

Example:

01 Location

02 Attendance

03 Inspection

04 Evidence

05 Report

==================================================

18. LOCATION VERIFICATION

==================================================

Use device/browser GPS.

Get:

Current Latitude

Current Longitude

Compare with NGO Firestore coordinates.

Calculate approximate distance.

Example:

NGO Location

31.2559, 75.7050

Current Location

31.2562, 75.7048

Distance:

42 meters

Status:

LOCATION VERIFIED

Default acceptable radius:

250 meters.

Make radius configurable.

If outside:

LOCATION COULD NOT BE VERIFIED

Allow officer to continue only with a clear warning/reason field if required.

==================================================

19. PHOTO EVIDENCE

==================================================

This must be a REAL WORKING FEATURE.

Officer should have:

CAPTURE PHOTO

CHOOSE FROM GALLERY

UPLOAD EVIDENCE

Use:

image_picker

Upload to:

Firebase Storage

After upload:

Save Firestore record.

Store:

inspectionId

officerId

ngoId

imageUrl

latitude

longitude

timestamp

Show image preview.

Evidence card:

Evidence

Captured:

18 Sep 2026

Location:

Verified

Uploaded by:

Officer

Do not claim metadata is tamper-proof.

==================================================

20. INSPECTION CHECKLIST

==================================================

Create a professional checklist.

Categories:

Attendance

Infrastructure

Beneficiary Verification

Documents

CCTV

Safety

Service Delivery

Each item:

YES

NO

N/A

Allow:

Remarks

Optional evidence attachment.

==================================================

21. AI ATTENDANCE VERIFICATION

==================================================

This is the PRIMARY AI FEATURE.

Workflow:

Officer selects/takes a photograph.

Show:

IMAGE PREVIEW

[ VERIFY ATTENDANCE ]

Then:

Uploading

Analyzing

Generating attendance result

Send:

POST /detect

to:

http://localhost:5000/detect

Multipart request:

image

Backend response:

people_count

confidence

status

annotated_image

Show result:

PEOPLE DETECTED

18

CONFIDENCE

94%

EXPECTED ATTENDANCE

20

DIFFERENCE

-2

STATUS

MISMATCH

Status:

VERIFIED

Green

or:

MISMATCH

Red

Important:

Clearly label:

AI-ASSISTED RESULT

AI output must not be presented as an absolute determination.

Allow officer to review the result before saving.

==================================================

22. FIREBASE ATTENDANCE RESULT

==================================================

Save:

ngoId

officerId

inspectionId

peopleCount

expectedAttendance

difference

confidence

status

imageUrl

timestamp

==================================================

23. CCTV MONITORING

==================================================

Create CCTV screen.

Show:

Total Cameras

Active

Offline

Motion Missing

Create 4 professional CCTV cards.

Each card:

NGO Name

Camera ID

Status

Last Updated

For the SIH prototype:

If no actual CCTV stream is configured:

Show:

CCTV STREAM NOT CONFIGURED

instead of pretending the video is live.

Provide:

CONNECT CCTV

button.

If backend/stream configuration is unavailable:

Show:

FEATURE WILL BE ADDED SOON

This keeps the demo credible.

==================================================

24. COMPLIANCE REPORT

==================================================

Create detailed report screen.

Cards:

Attendance Score

Inspection Score

CCTV Health

Documentation

Overall Compliance

Use circular progress indicator.

Example:

OVERALL COMPLIANCE

91%

AI Summary:

AI-ASSISTED SUMMARY

Attendance appears consistent with recent records.

CCTV status is operational.

One documentation item requires review.

Important:

Do not claim AI has definitively verified compliance.

Use:

AI-assisted

Potential issue

Requires review

Button:

GENERATE REPORT

==================================================

25. REPORT SUBMISSION

==================================================

Officer completes:

Checklist

Attendance

Evidence

Remarks

Then:

REVIEW REPORT

Show complete summary.

Button:

SUBMIT INSPECTION REPORT

After submission:

Show:

REPORT SUBMITTED

Status:

UNDER ADMIN REVIEW

Create Firestore record.

Admin receives notification.

==================================================

26. ADMIN REPORT REVIEW

==================================================

Admin can open submitted reports.

Show:

NGO

Officer

Date

Location

Attendance

Checklist

Evidence

Remarks

AI-assisted insights

Actions:

APPROVE

REQUEST CLARIFICATION

REJECT

Every action should be recorded.

==================================================

27. ALERTS

==================================================

Admin Alerts screen.

Alert types:

Attendance Mismatch

CCTV Offline

Inspection Overdue

Compliance Drop

Location Verification Issue

Severity:

Low

Medium

High

Critical

Use:

Green

Orange

Red

appropriately.

==================================================

28. AI ANALYTICS

==================================================

Admin AI Analytics screen.

Show:

Total AI Alerts

Attendance Anomalies

Compliance Changes

Inspection Patterns

Charts:

Compliance trend

Attendance trend

Inspection trend

Alert distribution

Use:

fl_chart

or another Flutter chart package.

Every AI insight must be labeled:

AI-ASSISTED INSIGHT

REQUIRES HUMAN REVIEW

==================================================

29. PROFILE

==================================================

Officer profile:

Profile image

Name

Email

District

Role

Joined Date

Buttons:

Edit Profile

Notification Settings

Logout

Logout must actually sign out Firebase.

==================================================

30. FIRESTORE DATABASE

==================================================

Collections:

users

Fields:

uid

name

email

photoUrl

role

district

createdAt

ngos

Fields:

id

name

city

state

district

latitude

longitude

compliance

cctvStatus

riskLevel

lastInspection

createdAt

inspections

Fields:

id

ngoId

officerId

attendanceCount

expectedAttendance

attendanceDifference

attendanceConfidence

remarks

status

inspectionType

latitude

longitude

timestamp

evidence

Fields:

id

inspectionId

officerId

ngoId

imageUrl

latitude

longitude

timestamp

alerts

Fields:

id

title

severity

ngoId

timestamp

status

attendance_results

Fields:

inspectionId

peopleCount

expectedCount

difference

confidence

status

imageUrl

timestamp

reports

Fields:

inspectionId

ngoId

officerId

overallCompliance

status

submittedAt

reviewedAt

==================================================

31. FIREBASE STORAGE

==================================================

Use Firebase Storage.

Folder:

inspection_evidence/

Store uploaded photographs.

Use secure Firebase Storage rules.

Do not expose unrestricted uploads.

==================================================

32. SAMPLE DATA

==================================================

If Firestore is empty, provide a demo seed mechanism.

Seed 5 NGOs:

Delhi

Kolkata

Chandigarh

Lucknow

Jaipur

Each NGO:

Name

Coordinates

Compliance

CCTV status

Risk level

Last inspection

IMPORTANT:

Clearly label these as:

DEMO DATA

==================================================

33. UI COMPONENT SYSTEM

==================================================

Create reusable widgets:

NetramAppBar

NetramCard

StatCard

NGOCard

InspectionCard

AlertCard

StatusBadge

PrimaryButton

SecondaryButton

NetramTextField

EvidenceCard

ComplianceRing

MapBottomSheet

SectionHeader

LoadingState

EmptyState

ErrorState

Every widget must use the same design tokens.

==================================================

34. ADMIN VS USER UI

==================================================

ADMIN:

More data-oriented.

Dashboard.

Maps.

Tables/lists.

Alerts.

Analytics.

Reports.

User management.

USER:

More action-oriented.

Assignments.

Inspection workflow.

Camera/evidence.

Attendance.

Reports.

However:

Both MUST look like the same NETRAM AI product.

==================================================

35. OFFLINE / NETWORK STATES

==================================================

If Firebase/network unavailable:

Show a clean error screen.

Example:

Unable to connect to monitoring services.

[ Retry ]

Do not crash.

For inspection evidence:

Allow local temporary state where practical and upload when connectivity returns.

If full offline sync is too complex for the prototype:

Clearly show:

Offline mode is currently unavailable.

==================================================

36. BACKEND / AI FEATURE STATUS

==================================================

Do NOT fake integrations.

Working:

Firebase Authentication

Google Sign-In

Firestore

Firebase Storage

Google Maps / OpenStreetMap

Photo upload

Inspection submission

Reports

Admin access-code login

AI attendance:

Working only when Flask backend is running.

CCTV:

UI + integration-ready.

Video streams are not fake live feeds.

If external service is unavailable:

Show:

FEATURE WILL BE ADDED SOON

or:

SERVICE NOT CONFIGURED

==================================================

37. SECURITY

==================================================

Important:

Do not hardcode sensitive production secrets.

Do not expose Firebase server credentials.

Do not expose Flask API secrets.

Do not expose admin credentials in visible UI.

Admin access code is only a DEMO authentication mechanism.

For production:

Use Firebase custom claims / secure backend authorization for admin roles.

Never trust role information coming only from the Flutter client.

==================================================

38. FOLDER STRUCTURE

==================================================

lib/

main.dart

app.dart

theme/

  app_theme.dart

  colors.dart

  typography.dart

models/

  user_model.dart

  ngo_model.dart

  inspection_model.dart

  evidence_model.dart

  alert_model.dart

  report_model.dart

screens/

  splash/

  auth/

  admin/

  officer/

  map/

  attendance/

  inspection/

  reports/

  profile/

services/

  auth_service.dart

  firestore_service.dart

  storage_service.dart

  api_service.dart

  location_service.dart

  map_service.dart

  notification_service.dart

widgets/

  cards/

  buttons/

  badges/

  charts/

  forms/

  common/

assets/

  images/

  icons/

==================================================

39. API SERVICE

==================================================

Create:

api_service.dart

Method:

detectAttendance(File image)

Request:

POST /detect

Multipart:

image

Response:

{

  "people_count": 18,

  "confidence": 0.94,

  "status": "mismatch",

  "annotated_image": "..."

}

Handle:

200

400

500

timeout

connection refused

If backend is unavailable:

Show:

AI verification service is currently unavailable.

==================================================

40. MAP SERVICE

==================================================

Create reusable map service.

Read NGO coordinates from Firestore.

Create markers dynamically.

Marker tap:

Bottom sheet.

Current officer location:

Use geolocator.

Ask location permission.

Handle:

Denied

Denied Forever

Service Disabled

Success

==================================================

41. NAVIGATION

==================================================

Use:

go_router

or a clean Navigator architecture.

Protected routes:

Admin routes

Officer routes

Unauthorized users must not access admin screens.

==================================================

42. ANIMATION

==================================================

Use subtle animations.

Splash fade.

Card entrance.

Page transitions.

Progress animations.

Report submission success animation.

Do NOT over-animate.

The application must feel professional.

==================================================

43. ACCESSIBILITY

==================================================

Maintain:

Good contrast.

Readable font sizes.

Large touch targets.

Accessible labels.

Avoid relying on color alone for status.

==================================================

44. RESPONSIVE UI

==================================================

Primary target:

Android phones.

Also ensure:

Tablet compatibility.

Admin dashboard can adapt to larger screens.

==================================================

45. ADMIN DEMO FLOW

==================================================

Demo:

Open NETRAM AI

↓

Government Admin

↓

Enter Access Code

↓

1111

↓

Admin Dashboard

↓

View NGO statistics

↓

Open Live Map

↓

Tap NGO

↓

View compliance

↓

Open inspection

↓

Review submitted report

↓

View evidence

↓

View AI attendance result

↓

Approve / Request clarification

==================================================

46. OFFICER DEMO FLOW

==================================================

Open NETRAM AI

↓

Inspection Officer

↓

Continue with Google

↓

Firebase Google Authentication

↓

Officer Dashboard

↓

Today's Inspection

↓

Start Inspection

↓

Verify Location

↓

AI Attendance

↓

Capture Evidence

↓

Checklist

↓

Remarks

↓

Review Report

↓

Submit

↓

Report submitted

↓

Admin receives report

==================================================

47. IMPORTANT UI RULE

==================================================

THE REFERENCE IMAGE MUST REMAIN THE VISUAL NORTH STAR.

If a default Flutter Material component looks different from the reference:

CUSTOMIZE IT.

Do not replace the design with:

generic Material dashboard

generic blue cards

generic glassmorphism

generic banking UI

generic hospital UI

generic admin template

Every screen must visually belong to NETRAM AI.

Maintain:

same header style

same card radius

same button style

same typography

same blue

same orange

same spacing

same icon style

same background

same visual hierarchy

==================================================

48. DEMO CREDIBILITY

==================================================

Never claim a feature is live when it is only simulated.

For example:

GOOD:

"CCTV integration ready — stream configuration required."

BAD:

"Live CCTV" when showing a fake video.

GOOD:

"AI-assisted attendance result."

BAD:

"AI has verified fraud."

The application should look ambitious but technically credible.

==================================================

49. FINAL PRODUCT EXPERIENCE

==================================================

The final product should communicate:

NETRAM AI

"Real-time NGO monitoring.

Smarter inspections.

Evidence-driven compliance."

The complete product flow is:

AUTHENTICATION

↓

DASHBOARD

↓

LIVE MAP

↓

NGO

↓

INSPECTION

↓

LOCATION VERIFICATION

↓

AI ATTENDANCE

↓

PHOTO EVIDENCE

↓

CHECKLIST

↓

REPORT

↓

ADMIN REVIEW

↓

AI-ASSISTED ANALYTICS

==================================================

50. FINAL IMPLEMENTATION REQUIREMENT

==================================================

Generate a COMPLETE Flutter project.

Do not generate only UI mockups.

Implement all local functionality possible.

Implement Firebase integration.

Implement Google authentication.

Implement Admin Access Code authentication.

Implement Firestore CRUD.

Implement Firebase Storage upload.

Implement real map integration.

Implement geolocation.

Implement inspection workflow.

Implement report submission.

Implement AI API integration.

Implement role-based navigation.

Implement loading/error/success states.

Use mock/demo data only where external infrastructure is unavailable.

Keep the code clean, modular and compile-ready.

No unnecessary explanations.

No placeholder TODOs.

No emojis.

No fake live functionality.

The application must compile after Firebase configuration and Google Maps configuration are provided.

Most importantly:

MAINTAIN THE EXACT SAME NETRAM AI VISUAL IDENTITY ACROSS ADMIN AND OFFICER PANELS, USING THE PROVIDED REFERENCE IMAGE AS THE PRIMARY DESIGN REFERENCE.



ONE VIDEO ALSO UPLOADED CHECK TO GET MORE DETAILS ANSD FUNCTIONALITY . 
GOOGLE AUTHENTICE LOGIN MUST 

AND EDIT PORLIE IOPTION ALSO ADD LIKE FOR PHOTOS

AI INTEGREATE HOW MUCH POSSIBLE,, OPEN SOURCE WORKING BACKEND


BUILD WITHIN CREDIT,, 
DATABASE ONE UNIVERSAL

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://netram-ai-monitor.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1fcb376c-bb0f-42f4-b6f5-a683c8965947).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
