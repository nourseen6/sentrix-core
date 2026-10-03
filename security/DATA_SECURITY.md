# SENTRIX CORE — Data Security

## Data classes

These classes stay separate in storage, in the demo script, and in the report.

| Class | Definition | Status in this workspace |
| --- | --- | --- |
| Source data | Data collected by an external party before this project used it. Includes public and research datasets and examples such as Kaggle sets. | The team states that current experiments use this class. No files are in the workspace. |
| Project copy | The copy the team stores or processes. | Not found in workspace. |
| Processed data | Features, labels, embeddings, splits, and other derived files. | Not found in workspace. |
| Models | Models trained from those files. | Not found in workspace. See `AI_SECURITY.md`. |
| Future SENTRIX user data | Location, audio, health-related signals, and possible dependent data collected by a future SENTRIX deployment from real people. | Conceptual. Not collected. |
| Demo replay or simulation | Data played only to demonstrate the software. | UNRESOLVED (SEC-14). |

Do not call source data “data collected by SENTRIX CORE” or “data collected by the team.”

Research paper Section 6.1 (Table 2) is a candidate inventory from the literature. It is not the list of files in use. SEC-12 stays open until each file is entered in the register below.

## Dataset register

No dataset file, loader, or license file was found on 1 October 2026. Add one row per file actually used. Leave the row blank rather than copying the paper’s bibliography into it.

| Dataset name | Source | Type | Personal or sensitive content, if known | License or terms | Where the project copy is stored | Who can access it | Included in the app binary? | Redistributed? | Terms read by the team? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | Not found in workspace | — | — | — | No |

Rules for new rows:

- Record the source project or site, not this team, as the collector.
- If the terms are unread, set “Terms read” to No. Do not write “compliant.”
- If a file’s terms forbid redistribution, do not place it in the application package.
- Do not commit raw copies. `.gitignore` ignores `data/raw/`, `data/private/`, and `data/processed/` so a later git init does not pick them up by default.

## Current research-data requirements

| ID | Requirement | Status |
| --- | --- | --- |
| CUR-DATA-01 | Keep a register row for every dataset copy the team stores. | MISSING. Register exists; it has no verified rows. |
| CUR-DATA-02 | Store project copies separately from any future user-data directory. | MISSING as a populated layout. Ignore rules exist for `data/raw/`, `data/private/`, and `data/processed/`. |
| CUR-DATA-03 | Do not put dataset files inside the mobile application unless SEC-13 says the terms allow it. | NOT APPLICABLE until an app build exists. The requirement stands. |
| CUR-DATA-04 | Describe datasets in the report as externally collected. | Required in writing. This file follows that rule. |
| CUR-DATA-05 | Do not merge an external file and a future user record in one table or one screen without a visible class label. | FUTURE for user data. Required before that data exists. |

Privacy note for the current stage: externally collected sets can still contain information about real people who were recorded by someone else. That does not make this team the collector. It does mean the team should read the source terms before copying files into a demo (SEC-13). This document does not claim those terms have been satisfied.

Egypt’s Personal Data Protection Law, Law No. 151 of 2020, is a future assessment item if the project later processes personal data of people in Egypt. It is not applied to this workspace by this plan, and this file is not legal advice. GDPR and HIPAA are reference names only. The documents do not establish that either statute applies, and this plan does not claim compliance with them.

## Future user-data lifecycle

Requirements for a later real-user build. None of this data exists in the project today.

| Topic | Requirement |
| --- | --- |
| Collection | Collect a category only after the purpose is written down. Location, audio, health-related signals, and dependent data are separate purposes. |
| Purpose limitation | Safety monitoring, an active emergency, and model research are different purposes. Do not reuse emergency audio for training because it already sits on a server. |
| Access | Follow the approved result of SEC-11. Until then, the recommendation in `ACCESS_CONTROL.md` is the draft. |
| Retention | Set a retention period per class before the first real-user pilot. No period is specified in the PDFs. |
| Deletion | A deletion request removes the live record and documented backups of that record, or the exception is written down. Dataset files are not deleted under a user request, because they are not that user’s SENTRIX record. |
| Incident evidence | Keep the incident package for the retention period chosen above. The research paper’s SHA-256 hash on an audio clip is a specified idea, not a complete evidence design (threat T18). |
| Backups | Backups are in scope for deletion and access rules. |
| Guardian and dependent data | Access only through an approved link. Ownership is SEC-11. |
| Audio and video | Default is incident-scoped access. Screen 52 names the evidence center and does not define retention. |
| Location history | Separate from the live emergency share. History is not visible to a helper. |
| Health data and ECG | ECG exists in the plan only if the MAX86176 path in the Hardware Design Specification is built. |
| Digital Twin | Treat the model of routines and places as sensitive. A guardian deviation alert is not the same as a full export. |

## Backup and demo packaging

- A demo package lists which class is included: external copy, processed features, model, or replay.
- The package does not include `.env` files, SIM credentials, or user tokens.
- Future cloud backups are unspecified because no cloud product is selected. When one is chosen, name it in SEC decisions before calling the channel protected.
