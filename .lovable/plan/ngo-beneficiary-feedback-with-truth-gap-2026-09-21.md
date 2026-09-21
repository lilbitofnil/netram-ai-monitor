# NGO & Beneficiary Feedback with Truth Gap

## What will be built

- Add a third **NGO & Public Feedback** option beside Administration and Inspection Officer on the first screen.
- Add a public NGO list showing location, response count, satisfaction score, and an **Open Scorecard** action.
- Add a mobile-friendly feedback form for overall satisfaction, cleanliness, staff behaviour, food/basic facilities, safety, promised-services delivery, and optional written feedback.
- Save each response anonymously and show an aggregated scorecard after submission without exposing personal information.
- Add a **Truth Gap** section in the administration panel that compares inspection compliance with beneficiary satisfaction, highlights significant differences, and links back to the relevant NGO and survey information.
- Remove visible demo labels/popups and SIH footer text from the entry/login experience while making these changes.

## Data and privacy

- Create a dedicated anonymous feedback table connected to NGOs.
- Allow public submission with strict validation; expose only aggregate results publicly.
- Keep individual written responses available only to authenticated administration through server-side access.
- Rate-limit duplicate browser submissions per NGO and show clear success/error states.

## Technical details

- New public routes: `/feedback` and `/feedback/$ngoId`.
- New admin route: `/admin/truth-gap`.
- Truth Gap formula: `inspection compliance − beneficiary satisfaction percentage`; show both values and the absolute gap, with status labels based on gap size.
- Add route-specific titles, descriptions, Open Graph metadata, and mobile/desktop validation.