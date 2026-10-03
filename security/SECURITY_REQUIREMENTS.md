# SENTRIX CORE — Security Requirements

Status values mean:

| Status | Meaning |
| --- | --- |
| IMPLEMENTED | Present in this workspace and checked. |
| PARTIALLY IMPLEMENTED | A piece exists, and the control is not finished. |
| MISSING | Needed for the current stage, and not present. |
| PLANNED | Belongs to the kit or custom-hardware stage. Not built. |
| FUTURE | Belongs to the full ecosystem. Not deployed. |
| NOT APPLICABLE | No current component to attach it to. The requirement remains for when that component appears. |

A research-paper screen is never IMPLEMENTED by itself.

| ID | Requirement | Stage | Component | Threat | Priority | Status | Implementation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CUR-01 | Keep external datasets, processed files, and future user data in separate classes. | Current | Data | T1 | Critical | PARTIALLY IMPLEMENTED | Classes are defined in `DATA_SECURITY.md`. No dataset files are in the workspace to separate. |
| CUR-02 | Maintain a dataset register with source, storage, and terms. | Current | Data | T1, T2 | Critical | MISSING | Empty register is in `DATA_SECURITY.md`. SEC-12. |
| CUR-03 | Do not put a dataset file in the app package until its terms are read. | Current | Mobile, data | T2 | High | NOT APPLICABLE | No app binary and no license files. Rule stands. SEC-13. |
| CUR-04 | Ignore secrets, raw data, and model binaries in git. | Current | Repo | T3 | High | IMPLEMENTED | `.gitignore`. Git itself is not initialized, so enforcement starts at `git init`. |
| CUR-05 | Scan source-like files for likely credentials before sharing the tree. | Current | Repo | T3 | High | IMPLEMENTED | `security/tools/scan-secrets.ps1`. Run on 1 October 2026: 0 source files, 0 findings. |
| CUR-06 | Do not hard-code API keys, passwords, or tokens. | Current | Mobile, any new code | T3 | Critical | NOT APPLICABLE | No source files. The scanner covers this when files appear. |
| CUR-07 | Inspect the real mobile tree and record auth, storage, and network from code. | Current | Mobile | T3, T12 | Critical | MISSING | Source not in workspace. SEC-17. |
| CUR-08 | Use the platform’s credential store for any token the app already keeps. | Current | Mobile | T12 | High | NOT APPLICABLE | No storage code found. Implement only after CUR-07 shows tokens exist. |
| CUR-09 | Expire sessions and support logout if accounts exist. | Current | Mobile | T12 | High | NOT APPLICABLE | Paper Screen 69 names sessions. No session code. |
| CUR-10 | Limit repeated failed logins if a password or OTP login exists. | Current | Mobile | Account takeover | Medium | NOT APPLICABLE | Do not add a new login system just to satisfy this row. |
| CUR-11 | Reject cleartext API endpoints if the app already calls a server. | Current | Mobile | Network | High | NOT APPLICABLE | No client calls found. Do not assume HTTPS. |
| CUR-12 | Log model version and external dataset ids for each experiment. | Current | AI | T4, provenance | High | MISSING | Empty model register in `AI_SECURITY.md`. |
| CUR-13 | Do not report Section 6 metrics as results from this repository. | Current | AI, report | Misreporting | High | MISSING | A writing rule in `AI_SECURITY.md`. The report text was not edited. |
| CUR-14 | Keep demo SOS off real emergency services until SEC-16 is approved. | Current and demo | Emergency | T9 | Critical | MISSING | No dialer code found. The prohibition is a team rule, not yet an approved decision. |
| KIT-01 | Label development kits as lab equipment. | Prototype | Hardware | T5 | High | PLANNED | Checklist K1 in `HARDWARE_SECURITY.md`. |
| KIT-02 | Keep SWD open only as a recorded lab condition. | Prototype | MCU | T5 | High | PLANNED | SEC-08. |
| KIT-03 | Disconnect UART at the end of a session and do not print SIM secrets. | Prototype | Modem | T7 | High | PLANNED | SEC-05. |
| KIT-04 | Select BLE pairing before any phone pairing test, or leave BLE off. | Prototype | BLE | T6 | High | PLANNED | Mechanism not selected. SEC-04. |
| KIT-05 | Do not stream a real person’s location or audio into the kit. | Prototype | Sensors, radio | T8 | Critical | PLANNED | K2. |
| KIT-06 | Do not register a live SIM unless SEC-15 is approved. | Prototype | nRF9151 | T7, T9 | Critical | PLANNED | No modem in workspace. |
| KIT-07 | Version every firmware image flashed in the lab. | Prototype | Firmware | T11 | Medium | PLANNED | No firmware files. |
| KIT-08 | Test one sensor-failure case and one injected-pattern case when firmware exists. | Prototype | BMI270, MAX86176, MAX30208, IM69D130 | T16 | Medium | PLANNED | Distinct from Engine E12’s paper description. |
| BAND-01 | Physical SOS is debounced and does not depend on a model. | Custom hardware | Button | Missed SOS, false SOS | Critical | PLANNED | Hardware Design Specification. Not built. |
| BAND-02 | Apply the SEC-06 boot decision before a product-like demo. | Custom hardware | Boot | T11 | High | PLANNED | Design not chosen. |
| BAND-03 | Apply the SEC-08 debug decision. List any remaining test pads. | Custom hardware | PCB | T10 | High | PLANNED | Specification still allows a possible test point. |
| BAND-04 | Do not add an SE050 unless SEC-02 approves a BOM change. | Custom hardware | Keys | T11 | High | PLANNED | Current BOM has no secure element. |
| BAND-05 | Name key storage or state that none exists. | Custom hardware | Keys | T11, T18 | High | PLANNED | SEC-02, SEC-03. |
| BAND-06 | BLE matches the SEC-04 decision. | Custom hardware | BLE | T6 | High | PLANNED | — |
| BAND-07 | Modem UART is not reachable on a closed unit, or the risk is accepted in writing. | Custom hardware | nRF9151 | T7 | High | PLANNED | SEC-05. |
| BAND-08 | Factory reset clears bonds and local logs and still allows SOS. | Custom hardware | Device | T12 | Medium | PLANNED | — |
| BAND-09 | A failed update does not disable local SOS detection. | Custom hardware | OTA, button | T15 | High | PLANNED | SEC-07. No OTA code. |
| BAND-10 | Lost-band unpair exists in the account, or the unit is still a lab asset. | Custom hardware | App, band | T12 | Medium | FUTURE | No account code. |
| FUT-01 | Approve an access matrix before role-based screens are treated as real. | Future | Accounts | T13, T14 | High | FUTURE | Draft in `ACCESS_CONTROL.md`. SEC-11. |
| FUT-02 | Helper location follows staged disclosure. | Future | Nearby Helper | T13 | High | FUTURE | Paper Table 44. Not implemented. |
| FUT-03 | Medical Helper sees vitals only during an accepted incident. | Future | Medical Helper | T13 | High | FUTURE | Paper Table 45, tightened in the recommendation. |
| FUT-04 | Operator sees only assigned incidents. | Future | Operator | T14 | High | FUTURE | Paper Table 22, narrowed in the recommendation. |
| FUT-05 | Administrator manages fleet and updates and does not get routine content access. | Future | Admin | T14 | High | FUTURE | Recommendation. Break-glass is not in the paper. |
| FUT-06 | Any future network API is authenticated and protected in transit. Algorithm and provider are not chosen. | Future | Cloud | Network | High | FUTURE | No API exists. Do not name a cloud product. |
| FUT-07 | Emergency messages are authenticated and replay-resistant once a real radio path exists. | Future | Emergency | T9, replay | High | FUTURE | Not specified in the PDFs. |
| FUT-08 | Evidence integrity is more than a hash stored beside the file, if evidence is shown to a third party. | Future | Evidence | T18 | Medium | FUTURE | Paper names SHA-256 for a clip. Verifier is unspecified. |
| FUT-09 | Retention and deletion exist before real-user collection. | Future | Privacy | T1 | High | FUTURE | Periods are not in the PDFs. `DATA_SECURITY.md`. |
| FUT-10 | Dependent profiles have an owner. | Future | Guardian | T14 | High | FUTURE | SEC-11. |
| FUT-11 | Cancel authority matches SEC-10, not the legacy gesture tables. | Future | Emergency | T17 | Critical | FUTURE | Conflict recorded. Not resolved. |
| EMR-01 | Record the gesture conflict and do not code it as the security behavior. | All | SOS | T17 | Critical | PARTIALLY IMPLEMENTED | Recorded in this set and in SEC-10. No product code exists to enforce it. |
| EMR-02 | Planned hardware start control is the physical SOS button. | Custom hardware | Button | T17 | High | PLANNED | Hardware Design Specification. |
| EMR-03 | Silent emergency, if implemented later, has an explicit leakage review for speaker and LED. | Future | Emergency | Coercion scenario in the paper | Medium | FUTURE | Speaker and RGB LED are in the previous revision, not in the current BOM. Do not import them silently. |
| AI-08 | On-device model integrity before a model may raise an emergency. | Planned band | AI | T15 | High | FUTURE | `AI_SECURITY.md`. SEC-09. |

## Emergency: specified versus missing

| Topic | What the documents say | Security requirement still missing |
| --- | --- | --- |
| Manual start | Hardware specification: debounced physical button, independent of AI. | The button is not built. Cancel is unspecified (SEC-10). |
| Legacy gestures | Research paper Section 7.2, Section 13.10, and Case 19 disagree. | Do not choose a winner in code. SEC-10. |
| Automatic detection | Engines and a risk score are specified. On-device scope conflicts. SEC-09. | No detection code. A model must not page a real service (SEC-16). |
| Silent emergency | Research paper Section 7.3: no vibration, sound, or visible change. Guardian is told not to call. | Not implemented. Current BOM has no speaker. Do not add one for this mode without a new decision. |
| Guardian notice | Specified as a future behavior, including a silent push. | No push channel exists. |
| Helper notice | Specified with staged disclosure. | FUT-02. |
| Operator | Table 22 dashboard. | FUT-04. |
| False alarms and flooding | Context engine and helper trust scores are described qualitatively. | No rate limit or trust cutoff is specified. Add one before a live helper network. |
| Replay and message integrity | SHA-256 is named for stored audio evidence. | No rule authenticates an emergency packet or blocks a replayed packet (FUT-07, FUT-08). |
| Who may authorize emergency services | Case studies use a guardian, sometimes pre-authorized. | Not approved. SEC-16 forbids assuming a live dispatch. |

## Priority for the team this term

1. CUR-07, CUR-02, CUR-14.
2. CUR-04 and CUR-05 stay in use as files are added.
3. KIT-01 through KIT-06 when a board is powered.
4. Leave FUT and BAND rows as checklists until that stage starts.
