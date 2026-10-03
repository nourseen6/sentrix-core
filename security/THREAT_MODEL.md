# SENTRIX CORE — Threat Model

Status of this model: preliminary and staged. It uses the two PDFs for the intended architecture and the 1 October 2026 workspace inspection for what exists. Threats that belong only to a later stage are marked with that stage.

## Assets

### Current project assets

These are the assets of the work as it exists or as the team described it. Copies of externally collected datasets are not “data collected by SENTRIX CORE” and not “data collected by the team.”

| Asset | Evidence | Stage |
| --- | --- | --- |
| Research paper and hardware specification | Present in the workspace | Current |
| Security documents in `security/` | Added by this work | Current |
| Externally collected dataset copies, if they exist on team machines | Not found in this workspace. Claimed by the team as GPS, audio, and other sensor sets from existing sources. | Current, location UNRESOLVED (SEC-12) |
| Trained models and experiment outputs, if they exist on team machines | Not found in this workspace | Current, location UNRESOLVED |
| Mobile application source and any accounts it already stores | Not found in this workspace (SEC-17) | Current, unverified |

No session tokens, location histories, health records, audio captured by this team, firmware images, BLE bonds, or SIM credentials were found.

### Future SENTRIX assets

Specified by the research paper or the hardware direction. Not deployed.

| Asset | Where it is specified | Stage |
| --- | --- | --- |
| Accounts, credentials, sessions | Research paper Screens 3, 5, and 69 | Future, when accounts exist |
| User location, routes, safe zones | Screens 34–37, Engine E10 | Future |
| Health-related signals, and ECG if the MAX86176 path is built | Engine E3; ECG only in the Hardware Design Specification | Future / planned hardware |
| Audio, and camera or video evidence | Engines E4 and E5, Screen 52 | Future |
| Digital Twin | Engine E7 | Future |
| Incident records and evidence hashes | Section 7.6; SHA-256 is named for an evidence clip | Future |
| Guardian links | Screens 15 and 56–61 | Future |
| Helper identity and trust score | Section 8 | Future |
| Admin and operator access | Table 22 | Future |
| Firmware and on-device models | Hardware direction; Engine E13 | Prototype, then planned band |
| BLE bond | Screen 9, Phase 13 | Prototype |
| SIM or eSIM profile | Hardware Design Specification, nRF9151 | Prototype or planned band |
| Emergency state and SOS | Physical button in the hardware specification | Planned hardware; policy UNRESOLVED (SEC-10, SEC-16) |

## Trust boundaries

| Boundary | Stage | Notes |
| --- | --- | --- |
| External dataset source → team copy | Current | The source collected the data. The team holds a copy. Terms are UNRESOLVED (SEC-13). |
| Team machines → this workspace | Current | The workspace does not contain the app, models, or datasets. |
| Development kit debug probe → kit | Prototype | SWD and UART are expected on a kit. |
| Phone → kit over BLE | Prototype | Pairing method is UNRESOLVED (SEC-04). |
| nRF5340 → nRF9151 over UART | Prototype / planned | AT commands are specified. Link authentication is not. |
| Band or phone → a future cloud → guardian, helper, operator, admin | Future | The path is specified. No cloud product is chosen in the documents or the workspace. |
| Helper before acceptance → after acceptance | Future | Research paper Table 44. Not implemented. |
| Legacy logo gestures | Not a current boundary | Recorded as a design conflict. Not the planned SOS control. |

## Threat actors

| Actor | Stage where this is realistic |
| --- | --- |
| Person with a copy of the project files or a shared drive | Current |
| Person with a development machine used for experiments | Current |
| Person with physical access to a development kit and its debugger | Prototype |
| Nearby BLE radio during a kit test | Prototype |
| Person who steals a paired phone | Future, if the app stores sessions or location. Not evidenced now. |
| Person who steals a future band | Planned hardware and later |
| Malicious or curious Nearby Helper | Future |
| Compromised guardian account | Future |
| Compromised administrator account | Future |
| Person who flashes unofficial firmware | Prototype and planned band |
| Person who replaces a model file used in an experiment or a later update | Current experiments, if model files exist; future OTA |
| Person who spoofs a sensor on a bench | Prototype |

A live attacker against a deployed cloud, a production SIM fleet, or real emergency services is out of scope for the current academic stage. Those actors are listed under Future so the later requirements exist. They are not current operating threats.

## Threats

| ID | Threat | Stage | Impact if it happens |
| --- | --- | --- | --- |
| T1 | Dataset copies are described as collected by the team, or mixed with future user records | Current | The project record is false, and a later privacy review starts from the wrong data class. |
| T2 | A restricted external dataset is copied into a demo binary | Current | Possible breach of the source terms. License is not verified here. |
| T3 | Secrets are committed once source appears | Current, preventive | Credential theft. No source secrets were found on 1 October 2026. |
| T4 | Unpublished models or notes are copied from an unprotected machine | Current | Loss of academic work. |
| T5 | Open SWD or UART on a kit is later described as a closed product | Prototype | Firmware and logs can be read or changed. |
| T6 | BLE test with no defined pairing | Prototype | A nearby radio can attach to the lab device. |
| T7 | Modem UART left attached to a host that any lab user can open | Prototype | Unwanted transmissions, including a false SOS if SEC-16 is ignored. |
| T8 | A real person’s live location or audio is used on the kit | Prototype | The lab test becomes personal-data processing. |
| T9 | Demo SOS contacts a real emergency service | Prototype or demo | False emergency. SEC-16 is UNRESOLVED. |
| T10 | Debug left active on a custom board shown as the band | Planned | Same exposure as T5 on hardware that looks finished. |
| T11 | Unsigned or unofficial firmware on a custom board | Planned | Safety logic can be removed. Secure boot design is UNRESOLVED. |
| T12 | Stolen future phone or band | Future | Location and SOS until revocation exists. Revocation is not specified. |
| T13 | Helper receives precise location outside an accepted incident | Future | Tracking of a vulnerable person. Table 44 is the paper’s control and is not implemented. |
| T14 | Guardian or admin account used to read content the role does not need | Future | Broad disclosure. Least privilege is recommended, not implemented. |
| T15 | Unofficial model or firmware update | Future | Wrong emergency decision. OTA design is UNRESOLVED. |
| T16 | Sensor spoofing on the bench, distinct from a failed sensor | Prototype | False fall or false “all clear.” Engine E12 addresses bad sensors in the paper, not an adversarial inject. |
| T17 | Legacy gesture map is implemented as cancel behavior | Any build that codes it | Alert started or stopped by the wrong press. |
| T18 | Evidence file and its SHA-256 hash are both editable by the same party | Future | The hash no longer shows integrity. The paper specifies the hash and not a verifier. |

## Current-stage focus

The realistic work now is T1, T2, T3, and T4, plus keeping the mobile source inspectable (SEC-17). Prototype threats T5–T9 apply when kits are powered. Future threats stay in the requirements so they are not forgotten. They are not claims about a deployed system.
