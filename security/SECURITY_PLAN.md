# SENTRIX CORE — Security Plan

This plan is for the graduation project as it actually stands. It is not a commercial deployment, and it is not a claim that the research paper has been built.

Read this file first. The working detail is in the other files in `security/`.

| File | Use |
| --- | --- |
| `SECURITY_IMPLEMENTATION_STATUS.md` | What was found in the workspace on 1 October 2026 |
| `THREAT_MODEL.md` | Assets and threats by stage |
| `SECURITY_REQUIREMENTS.md` | Requirement rows with status and priority |
| `ACCESS_CONTROL.md` | Recommended role matrix, pending approval |
| `DATA_SECURITY.md` | External datasets versus future user data |
| `AI_SECURITY.md` | Experiment controls versus future on-device decisions |
| `HARDWARE_SECURITY.md` | Kit checklist and custom-band checklist |
| `SECURITY_TEST_PLAN.md` | Tests and the results that were actually run |
| `SECURITY_DECISIONS.md` | Choices the team still has to make |
| `tools/scan-secrets.ps1` | Source scan. Prints pattern names and paths, not secret values |

## Evidence

Inspected path: `D:\grad proj`, 1 October 2026.

Present:

- `SENTRIX_CORE_Research_Paper_v2.1 (1).pdf`
- `Hardware_Design_Specification (1) (2).pdf`

Not found: git metadata, mobile source, backend, AI scripts, model files, dataset files, firmware, development-kit logs, schematic or PCB files, environment files.

Secret scan: 0 source files, 0 findings (`SECURITY_TEST_PLAN.md`, T-SCAN).

The team’s mobile work and dataset experiments may exist on other machines. They are not evidence in this workspace until SEC-17 is closed by adding that source and repeating the inspection.

## Stages

| Stage | Meaning | Security posture |
| --- | --- | --- |
| Current | Mobile and software work, plus experiments on datasets collected by other parties. | Implement what the code actually contains. Do not mark paper screens as done. |
| Prototype | Development kits for sensors, MCU, BLE, cellular/GNSS, firmware, and pipeline tests. | Lab equipment. Debug is expected and must be labeled. |
| Planned | Custom band from the Hardware Design Specification, if it is finished before the demo. | Not built. Checklist only. |
| Future | Cloud, Digital Twin, guardians, Nearby Rescue Network, evidence, operator and admin dashboards. | Specified architecture. Not deployed. |

Hardware direction for the prototype and the custom stage is the Hardware Design Specification: nRF5340, nRF9151, BMI270, MAX86176, MAX30208, IM69D130, nPM1300, physical SOS button, BLE, LTE-M/NB-IoT, and GNSS. That direction is planning text. Research paper Section 13 is the previous revision and stays labeled as history.

## Current mobile and software

No authentication, authorization, local storage, or network client could be inspected, because the application is not in the workspace. This plan does not add a new login stack, a cloud project, or a cryptographic library. Those would be a new architecture, not a fix.

When the application tree is added, implement only the rows that match code that already exists:

| If the code already… | Then… | Requirement |
| --- | --- | --- |
| Stores a token or password | Move it to the platform credential store. Remove hard-coded copies. | CUR-06, CUR-08 |
| Has login and logout | Check session end, expiry, and repeated failures against the code. Add the missing check only. | CUR-09, CUR-10 |
| Calls a URL | Record every endpoint. Reject a new cleartext endpoint. | CUR-11 |
| Has roles | Enforce the approved subset of `ACCESS_CONTROL.md`. Do not invent operator and admin accounts for a build that has one user. | FUT-01 |
| Loads a model | Record the file in the model register before the demo. | CUR-12 |
| Shows an SOS control | Point it at a local demo state. Do not call a real emergency service while SEC-16 is open. | CUR-14 |

OTP, MFA, guardian verification, and helper identity checks are specified as screens or future flows. They stay FUTURE until the code has those flows.

## Data and AI

Current experiments, as described by the team, use pre-existing datasets from external sources. This workspace does not contain those files, so the register is empty on purpose. Section 6.1 of the research paper is a candidate list, not proof of use.

Current experiment outputs are academic results. They are not a safety-critical on-device deployment. A later move of selected decisions onto the band is allowed by the project direction and is tracked as SEC-09. Fall detection and the physical SOS path are the first hardware-tied candidates. Distress audio (E4) and panic voice (E5) stay on the phone and cloud placements in Section 6 until a decision moves them.

## Prototype and custom hardware

Do not implement firmware in this workspace. There is no firmware project to modify.

Use `HARDWARE_SECURITY.md` as the lab sheet:

- Kit acceptance is K1–K4 and K8, with BLE and live SIM either decided or left out of the demo.
- Custom-band items B1–B17 are acceptance criteria, not completed work.
- TrustZone is an unused chip feature until SEC-03 is designed.
- No secure element is added.

## Emergency behavior

| Item | Plan |
| --- | --- |
| Start control on the planned hardware | Physical SOS button, independent of AI. |
| Gesture maps in the research paper | Design conflict. Not the security behavior. |
| Silent mode, guardian authorization, helper disclosure, operator view | Future requirements. Specified in the paper at different levels of detail. Not implemented. |
| Packet authentication and replay protection | Missing from both PDFs. Tracked as FUT-07. |
| Evidence SHA-256 | Named in the paper for a stored clip. Not a complete chain of custody. |

## Privacy

Current files, once located, are copies of externally collected data. Future location, audio, health-related data, and dependent data would be a different lifecycle, written in `DATA_SECURITY.md`.

A future real-user deployment in Egypt needs a privacy assessment against Egypt’s Personal Data Protection Law, Law No. 151 of 2020. That assessment is not done here and is not legal advice. This plan does not claim GDPR or HIPAA compliance. Those names are reference frameworks only. The project documents do not establish that they apply.

## What was implemented in this pass

| Control | Verification |
| --- | --- |
| Secret scan script | T-SCAN PASS, empty tree |
| Git ignore rules for secrets, raw datasets, and model binaries | File present. T-IGN NOT RUN because git is not initialized. |
| Status map, threat model, requirements, access recommendation, data and AI rules, hardware checklists, test plan, decision register | Reviewable documents. They do not change product behavior. |

## What was not implemented, and why

Mobile auth, storage, TLS, role checks, firmware, BLE security, secure boot, and OTA were not coded. The corresponding projects are absent. Coding them now would invent an application and a device the repository does not contain.

## Remaining risks

| Rank | Risk | Why this rank |
| --- | --- | --- |
| Critical | Mobile source is outside this workspace, so real auth and storage bugs are invisible. | CUR-07. The largest gap in the current stage. |
| Critical | Dataset names and licenses are unknown here. | A demo can mis-state provenance or ship a restricted file. |
| Critical | SEC-16 is open. A later SOS demo might be wired to a real service out of habit from the case studies. | False emergency. |
| High | BLE, UART, and debug rules are undecided, and kits are the next hardware step. | Lab radios and probes become the attack surface as soon as a board is powered. |
| High | Cancel authority is undefined, and the paper contains three gesture stories. | Easy to implement the wrong one. |
| Medium | No key storage, boot check, or OTA design. | Matters at the custom board, not for today’s empty tree. |
| Medium | Recommended access matrix is not approved. | Future roles will be inconsistent if each screen invents permissions. |
| Low | TrustZone and a secure element are undecided. | The current BOM has no SE050, and no firmware is using TrustZone. Safe as long as the report does not claim either one. |

## Next steps

1. Add the mobile project to this workspace (SEC-17) and repeat T-INV, T-SCAN, T-STORE-01, and T-NET-01.
2. Fill the dataset register from the files actually on disk (SEC-12, SEC-13). Do not paste Section 6.1 in as if it were the file list.
3. Approve or edit SEC-16 before any SOS button is shown.
4. When a kit arrives, walk K1–K10 and record SEC-04 before the first phone pairs.
5. Leave custom-board security at the checklist until the board exists. Revisit SEC-02, SEC-03, SEC-06, and SEC-08 before that board is described as product-like.
6. Approve or reject `ACCESS_CONTROL.md` under SEC-11 before building guardian or helper accounts.
