# SENTRIX CORE — Security Decision Register

These decisions are not closed by this plan. The team must choose them. Options are listed so the consequence is visible before a choice is made.

Direction already stated by the team, and used as planning context:

- The Hardware Design Specification is the current hardware direction. It is not built.
- Research paper Section 13 is the previous hardware revision. It stays in the record.
- The physical SOS button is the planned hardware input. The research paper’s conflicting gesture maps are legacy and are not the final cancel behavior.
- Not every AI engine is required to run on the wearable.
- Current experiments use externally collected datasets. This team did not collect them from users.
- Permissions in `ACCESS_CONTROL.md` are a recommendation until SEC-11 is approved.

| ID | Status |
| --- | --- |
| SEC-01 | Direction recorded. Hardware is not built. |
| SEC-02 | UNRESOLVED |
| SEC-03 | UNRESOLVED |
| SEC-04 | UNRESOLVED |
| SEC-05 | UNRESOLVED |
| SEC-06 | UNRESOLVED |
| SEC-07 | UNRESOLVED |
| SEC-08 | UNRESOLVED for a finished board. Open debug is expected on a development kit. |
| SEC-09 | UNRESOLVED |
| SEC-10 | UNRESOLVED |
| SEC-11 | UNRESOLVED. A recommendation exists. |
| SEC-12 | UNRESOLVED. No dataset files are in the workspace. |
| SEC-13 | UNRESOLVED |
| SEC-14 | UNRESOLVED |
| SEC-15 | UNRESOLVED |
| SEC-16 | UNRESOLVED |
| SEC-17 | UNRESOLVED. Blocks verification of the current mobile stage. |

---

## SEC-01 — Hardware baseline

- Issue: The research paper Section 13 specifies nRF52840, SIM7080G, a separate u-blox GNSS module, ST4SIM, and NXP SE050. The Hardware Design Specification specifies nRF5340, nRF9151 (LTE-M/NB-IoT and GNSS), and no secure element.
- Why it matters: Debug pins, modem link, SIM location, and key storage all change with the silicon.
- Affected component: Development-kit prototype and custom band.
- Options:
  1. Plan the prototype and custom board from the Hardware Design Specification, and keep Section 13 as history.
  2. Build the research-paper Section 13 architecture instead.
  3. Mix parts from both documents.
- Consequence: Option 1 matches the team’s stated direction and avoids a secure element that the current bill of materials does not contain. Option 2 revives the SE050 and a different modem. Option 3 creates a third architecture that neither document specifies.
- Current direction: Option 1. Not implemented. The specification is pre-schematic.
- Status: Direction recorded. Not a claim that hardware exists.

## SEC-02 — Secure element

- Issue: The previous revision includes an NXP SE050. The current bill of materials does not.
- Why it matters: Device identity, firmware trust, and emergency-message keys need a storage place. Adding a chip silently would change the hardware design.
- Affected component: Custom band, future evidence and OTA.
- Options:
  1. Do not add a secure element. Record which nRF5340 or nRF9151 features, if any, will hold keys, under SEC-03 and SEC-06.
  2. Add a secure element in a later hardware revision, with an explicit bill-of-materials change.
- Consequence: Option 1 keeps the current specification and leaves key storage undecided. Option 2 adds cost, board area, and a new provisioning step.
- Current direction: Do not add an SE050 unless this decision is approved.
- Status: UNRESOLVED.

## SEC-03 — TrustZone

- Issue: The Hardware Design Specification lists TrustZone as an advantage of the nRF5340. It does not assign firmware, keys, or the emergency path to the secure world.
- Why it matters: TrustZone only isolates code and keys if the firmware is split on purpose.
- Affected component: Custom-band firmware.
- Options:
  1. Leave TrustZone unused in the graduation prototype and document that choice.
  2. Place boot trust and key use in the secure world, with the application in the non-secure world.
- Consequence: Option 1 is realistic for a student prototype and must be stated so reviewers do not assume isolation. Option 2 is more work and needs a design before firmware is written.
- Current direction: None. The chip capability is not a design.
- Status: UNRESOLVED.

## SEC-04 — BLE pairing and bonding

- Issue: The papers require BLE pairing and, in Phase 13, a GATT link to a Flutter app. Pairing method, bonding, and lost-phone handling are not specified.
- Why it matters: An unauthenticated lab link can accept a nearby radio. A bonded phone that is lost remains trusted until it is removed.
- Affected component: Development-kit BLE tests and the mobile app.
- Options:
  1. Define the pairing method, whether bonds are stored, and how a bond is deleted, before the first phone-to-kit test.
  2. Use an open lab link and label every build as a bench fixture until option 1 exists.
- Consequence: Option 1 is required before any test that carries real or realistic personal data. Option 2 is acceptable only for bench signals and externally collected files, and must not be described as product BLE security.
- Current direction: None. No BLE code is in the workspace.
- Status: UNRESOLVED.

## SEC-05 — MCU-to-modem link

- Issue: The current direction sends AT commands from the nRF5340 to the nRF9151 over UART. No authentication on that link is specified.
- Why it matters: Anyone who can reach that UART can command the modem, including an emergency transmission.
- Affected component: Development-kit modem tests and the custom board.
- Options:
  1. Treat the UART as an on-board link that must not be exposed in a finished enclosure, and keep debug adapters off the demo unit.
  2. Add an authenticated command channel. That is a new design and is not in either PDF.
- Consequence: Option 1 matches a normal module UART and depends on SEC-08. Option 2 is extra design work and should not be implied by this plan.
- Current direction: The link is specified as UART AT commands. Protection beyond physical access is UNRESOLVED.
- Status: UNRESOLVED.

## SEC-06 — Secure boot

- Issue: Research paper Table 27 names secure boot as a bootloader duty. It gives no signature, key, or failure behavior. The Hardware Design Specification does not restate it.
- Why it matters: Without a chosen boot check, a custom board can run any image flashed over SWD.
- Affected component: Custom-band firmware. Not required to label a development kit as a lab tool.
- Options:
  1. Require a documented boot check before a custom board is presented as product-like.
  2. Demo unsigned firmware and label the device as an engineering unit.
- Consequence: Option 1 needs a key-storage decision (SEC-02, SEC-03) before code is written. Option 2 is acceptable for an engineering demo if the label is explicit.
- Current direction: None.
- Status: UNRESOLVED.

## SEC-07 — OTA updates

- Issue: Screen 21, Engine E13, and the admin dashboard name over-the-air firmware and model updates. Signature, version rollback, and what happens if an update fails during an emergency are not specified.
- Why it matters: A bad or unofficial update can disable fall detection or SOS.
- Affected component: Future band and app. No update code exists.
- Options:
  1. No OTA in the graduation demo. Updates are flashed on the bench and recorded by version.
  2. Design signed OTA before any remote update is shown.
- Consequence: Option 1 avoids an unfinished update path. Option 2 is future work and depends on SEC-06.
- Current direction: OTA is conceptual. Do not implement a remote updater in the current app solely because the paper names the screen.
- Status: UNRESOLVED.

## SEC-08 — Debug ports

- Issue: The Hardware Design Specification includes SWD for development and manufacturing, says it is not needed on a finished consumer product, and still allows a possible pogo test point. A modem trace connector is also mentioned.
- Why it matters: Open SWD on a board shown as the product exposes firmware and data.
- Affected component: Development kits and the custom board.
- Options:
  1. Keep debug open on kits and label them as lab equipment.
  2. Before a custom board is shown as product-like, disable or lock SWD and modem trace, or document the remaining test pads as an accepted engineering risk.
- Consequence: Option 1 is the correct prototype posture. Option 2 is required before the same image is described as a closed wearable.
- Current direction: Open debug is expected only at the kit stage.
- Status: UNRESOLVED for a finished board.

## SEC-09 — Which AI decisions run on the wearable

- Issue: Section 6 places distress audio and panic voice on the phone and in the cloud. Section 13.11’s on-device list is motion, health rules, fall, and context. The Hardware Design Specification also describes on-band detection of a distress sound and abnormal temperature, and LTE alerting with no phone.
- Why it matters: Phone-independent operation is only true for decisions that actually run on the band.
- Affected component: Firmware AI and the emergency path.
- Options:
  1. Keep current experiments on the computer and phone. Later, move only selected decisions. The hardware specification’s fall path and physical SOS are the first candidates. Leave E4 and E5 on the phone until a separate decision moves them.
  2. Move every engine on-device.
- Consequence: Option 1 matches the team’s direction and the Section 6 placement of audio. Option 2 conflicts with the stated direction and with the memory limits noted for on-device models.
- Current direction: Option 1 as a goal. The exact set to move is not chosen. No model code is in the workspace. Current dataset experiments are not a safety-critical deployment.
- Status: UNRESOLVED for the exact on-device set.

## SEC-10 — Who may cancel an active alert

- Issue: Section 7.2, Section 13.10, and Case 19 disagree on press meaning, including a biometric cancel that appears only in Case 19. The hardware direction replaces that input with a physical SOS button for starting an alert. Cancel authority is still undefined. Case 4’s medical override of “I’m okay” is design narrative, not an approved policy.
- Why it matters: The wrong cancel rule lets a nearby person stop a real alert, or stops the user from stopping a false one.
- Affected component: Firmware SOS, mobile emergency screen, future guardian policy.
- Options:
  1. Approve a written cancel policy: who may cancel, on which severity, and whether a medical override exists.
  2. Leave cancel undefined until the policy is approved. Hardware work may still specify the physical button as the start control.
- Consequence: Option 1 is required before an emergency demo. Option 2 prevents the legacy gesture table from being coded by accident.
- Current direction: Physical button starts SOS on the planned hardware. Gestures are not the final behavior. Cancel policy is not approved.
- Status: UNRESOLVED.

## SEC-11 — Guardian and dependent ownership

- Issue: Screen 6 names Personal, Child, Elderly, and Medical Guardian. Scenarios also use Medical, Women Safety, and other labels. Screen 60 says guardian permissions are configurable and does not list them.
- Why it matters: Child location and medical profiles need an owner and a minimum access rule.
- Affected component: Future accounts. No account code is in the workspace.
- Options:
  1. Approve, edit, or reject the matrix in `ACCESS_CONTROL.md`.
  2. Delay all role checks until the first account-bearing build, and keep the matrix as a recommendation only.
- Consequence: Option 1 gives the app a target when accounts are added. Option 2 avoids pretending the matrix is already a requirement.
- Current direction: The matrix is a recommendation. It is not implemented and not approved.
- Status: UNRESOLVED.

## SEC-12 — Datasets actually used

- Issue: Research paper Section 6.1 is a candidate inventory. The team stated that experiments use externally collected GPS, audio, and other sensor datasets, including public sets such as Kaggle sets. No dataset file is in this workspace.
- Why it matters: Privacy and license duties attach to the files actually stored, not to the paper’s bibliography.
- Affected component: Current AI experiments.
- Options:
  1. Add a row to the register in `DATA_SECURITY.md` for each file in use, with source and storage path.
  2. Leave the register empty until the files are located.
- Consequence: Option 1 is required before the project claims a dataset list. Option 2 is the honest state of this workspace.
- Current direction: Do not treat Section 6.1 as the list of files in use.
- Status: UNRESOLVED.

## SEC-13 — Dataset licenses

- Issue: No license file is in the workspace. Some public datasets restrict redistribution or require a use agreement.
- Why it matters: Putting a restricted file inside the demo app can violate the source terms. This plan does not judge compliance.
- Affected component: Current experiments and any demo package.
- Options:
  1. Record the license or terms next to each SEC-12 row before the demo is packaged.
  2. Demo only files whose terms the team has read.
- Consequence: Option 1 is a project record, not a legal opinion. Option 2 reduces the chance of shipping a restricted copy.
- Current direction: No license is verified.
- Status: UNRESOLVED.

## SEC-14 — Replayed or simulated demo data

- Issue: The team asked to keep simulated or replayed demo data separate if it is used. The workspace does not show whether it is used.
- Why it matters: Reviewers must be able to tell external datasets, replay, and future user data apart.
- Affected component: Demo script and any app fixtures.
- Options:
  1. State in the demo script which class is on screen.
  2. Use only externally collected files and say so.
- Consequence: Either option is acceptable. Silence is not, once a demo runs.
- Current direction: None observed in the workspace.
- Status: UNRESOLVED.

## SEC-15 — Real cellular radio in the demo

- Issue: The nRF9151 path can register on a live network once a SIM or eSIM and a subscription exist. Neither is in the workspace.
- Why it matters: A live registration transmits from the lab and may carry a location payload.
- Affected component: Development-kit and custom-board demos.
- Options:
  1. Bench tests use a terminated or carrier-approved lab setup, with payloads that are not a real person’s location.
  2. A later demo uses a real subscription, still without real emergency-service contact (SEC-16).
- Consequence: Option 1 fits the current academic stage. Option 2 needs a written lab rule before the modem is attached.
- Current direction: No modem is present in the workspace.
- Status: UNRESOLVED.

## SEC-16 — Contact with real emergency services

- Issue: The research paper’s case studies contact emergency services after guardian authorization. Screen 55 describes a simulation that does not dispatch. The demo rule is not set.
- Why it matters: A test SOS that leaves the lab can create a false emergency.
- Affected component: Any SOS demo on the phone, kit, or band.
- Options:
  1. Academic demos stay inside the project. They do not call, SMS, or packet a real emergency service.
  2. A supervised live test is a separate, approved exercise.
- Consequence: Option 1 is the safe default for a graduation demo. Option 2 needs an approval that this plan does not grant.
- Current direction: None recorded.
- Status: UNRESOLVED. Until it is closed, demos must not be described as contacting real emergency services.

## SEC-17 — Where the current mobile source lives

- Issue: The team is developing a mobile application. This workspace contains only the two PDFs plus the security files added here.
- Why it matters: Authentication, storage, and network controls cannot be implemented or tested until the source is in the workspace that this plan tracks.
- Affected component: Current mobile stage.
- Options:
  1. Add the application repository to this workspace and re-run the status map.
  2. Point this plan at another path and repeat the inspection there.
- Consequence: Option 1 makes the next implementation pass possible. Option 2 is equivalent if the inspection is actually repeated.
- Current direction: Source was not available during this inspection.
- Status: UNRESOLVED.
