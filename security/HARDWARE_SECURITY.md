# SENTRIX CORE — Hardware Security

The Hardware Design Specification is the planning direction for the development-kit stage and for a possible custom band. It is a pre-schematic draft. No kit, firmware, PCB, or assembled band is in the workspace.

Research paper Section 13 (nRF52840, SIM7080G, separate GNSS, ST4SIM, SE050, capacitive logo) is the previous revision. Do not build it unless SEC-01 is reopened. Do not add an SE050 to the current bill of materials.

The research paper Phase 4 shopping list still names an nRF52840 development kit. The current direction is nRF5340 and nRF9151. Which kit is purchased is part of SEC-01’s implementation, and it is not settled by a purchase in this workspace.

## Development-kit checklist

Kits are lab equipment. Debug access is expected. Passing this checklist does not make the kit a product.

| # | Check | Done when | Related decision |
| --- | --- | --- | --- |
| K1 | The kit is labeled as a lab prototype, not as the SENTRIX band. | Label is visible in the demo. | SEC-01 |
| K2 | Signals used on the kit are bench signals, externally collected files, or replay. No live stream from a real user, child, or patient. | Demo script names the data class. | SEC-12, SEC-14 |
| K3 | SWD or JTAG is recorded as open on purpose. | A line in the lab notes. | SEC-08 |
| K4 | UART logs are not treated as a public feed. The adapter is disconnected at the end of the session. | Lab habit, checked in T-UART. | SEC-05 |
| K5 | Firmware images flashed in the lab are named and stored with a version. | File name and date in the lab notes. | SEC-06 |
| K6 | Test Wi-Fi, SIM, or portal passwords are not reused later as product credentials. | Separate lab secret, not in source. | T3 |
| K7 | BLE is either still unwired, or SEC-04 is decided before a phone pairs. | Decision recorded, or BLE left off. | SEC-04 |
| K8 | The modem is not attached to a live emergency destination. | No real emergency-service address in the lab config. | SEC-16 |
| K9 | A live cellular subscription is used only if SEC-15 is explicitly approved. | Written approval, or modem not registered. | SEC-15 |
| K10 | Serial output does not print SIM credentials or location of a real person. | Log review on a sample capture. | SEC-05 |

### BLE requirement (do not mark as present)

The documents require BLE and a future GATT connection. They do not select pairing, bonding, encryption mode, identity, or lost-phone removal. Until SEC-04 is written down:

- record “BLE security mechanism: not selected”
- do not describe the kit link as a secure product link
- a phone-to-kit test is a connectivity test only

### nRF5340 requirements for later firmware

Document these as requirements, not as features already enabled:

| Topic | Requirement | Decision |
| --- | --- | --- |
| Secure boot | Required before a custom board is called product-like. Not required to call a kit a lab tool. | SEC-06 |
| Firmware authenticity | The image that is flashed is the image that was recorded. The check method is not chosen. | SEC-06 |
| TrustZone | Available on the part. Unused until a split is designed. | SEC-03 |
| Debug lock | Kits stay open. A product-like board does not keep open SWD without an accepted risk. | SEC-08 |
| Key handling | No key hierarchy is specified. Do not invent one in firmware comments and call it done. | SEC-02, SEC-03 |

### nRF9151 modem

| Topic | Requirement |
| --- | --- |
| Modem configuration | Lab configuration lives outside the mobile app repository. It is not committed. |
| SIM or eSIM | The specification requires one for network use. Credentials are not source code and are not printed in logs. |
| Emergency payload | Payloads in kit tests use synthetic or externally sourced coordinates, not a teammate’s live track, unless a separate data decision allows it. |
| MCU-to-modem UART | Specified as AT commands. Treat the pins as a high-value debug surface (SEC-05). |
| GNSS | Location from the kit is lab data. It is not a SENTRIX user location history. |

### Sensors in the current direction

| Part | Specified role | Failure | Accidental odd reading | Deliberate manipulation |
| --- | --- | --- | --- | --- |
| BMI270 | Motion and fall cues | Missing samples. The paper’s Engine E12 is a future reliability idea, not code. | A knock on the desk looks like impact. | A scripted motion or a tapped bus can fake a fall. |
| MAX86176 | PPG, and ECG in this specification | No skin contact, saturated optical reading. | Motion artifact. | Injected samples on the digital bus. Not a concern until the bus is wired. |
| MAX30208 | Temperature | No conversion. | Sensor not at skin temperature, which is expected on a bare kit. | Forced out-of-range values on I2C. |
| IM69D130 | Microphone for a later audio path | Silent bus. | Room noise. | A played file is a test input, not a user distress recording. |

Kit tests should include one “bad sensor” case and one “injected pattern” case when firmware exists. They are different tests. Neither is evidence of on-device AI until a model from the register is actually running.

### Kit acceptance

The kit stage is acceptable for the graduation demo when K1–K4 and K8 are true, and K7 and K9 are either done or explicitly not in the demo. Connectivity may be shown. Security of BLE and the modem must be described as “not selected yet” if SEC-04, SEC-05, and SEC-15 are still open.

## Custom band checklist

Use this only if a custom board is built. Do not write this checklist into a report as completed work.

| # | Control | Acceptance | Decision still required |
| --- | --- | --- | --- |
| B1 | Physical SOS button | A press is debounced and is not produced by the AI model. Matches the Hardware Design Specification. | Cancel policy remains SEC-10. |
| B2 | Secure boot | Boot behavior matches the written SEC-06 choice. | SEC-06 |
| B3 | Firmware authenticity | An unofficial image is rejected, or the unit is labeled an engineering sample that does not check images. | SEC-06 |
| B4 | Rollback | An older image cannot replace a newer one without a recorded maintenance step, or rollback is documented as unsupported. | SEC-06, SEC-07 |
| B5 | Debug policy | SWD and modem trace match SEC-08. | SEC-08 |
| B6 | Enclosure and test points | Test pads that remain are listed. A “possible pogo test point” from the specification is either removed or accepted in writing. | SEC-08 |
| B7 | BLE | Same mechanism as SEC-04, not a new unnamed mode. | SEC-04 |
| B8 | Cellular | SIM or eSIM material is provisioned outside source code. Logs do not print it. | SEC-15 |
| B9 | UART | Not reachable without opening the device, or the residual risk is written down. | SEC-05 |
| B10 | Device identity | The identity source is named. It is not an SE050 unless SEC-02 adds one. | SEC-02 |
| B11 | Key storage | The storage location is named. If none exists, say so and do not imply hardware key storage. | SEC-02, SEC-03 |
| B12 | Provisioning | Factory or lab provisioning steps are written, including who holds the programming probe. | SEC-08 |
| B13 | Factory reset | Reset clears bonds and local logs. It does not delete the ability to press SOS. | SEC-04, SEC-10 |
| B14 | Lost or stolen band | The future account can unpair it. Until that account exists, loss procedure is “lab asset return.” | Future app |
| B15 | OTA | Either absent (SEC-07 option 1) or signed and tested. | SEC-07 |
| B16 | Update failure | A failed update still allows the physical SOS press to be detected locally. Sending that press off the device may wait until the radio recovers. | SEC-07, SEC-16 |
| B17 | Tamper | The paper’s forceful-removal classes are future behavior. A custom demo does not claim them unless the classifier is in the firmware that was tested. | SEC-09 |

### Key storage decision

The current bill of materials has no secure element. If the custom board needs keys for boot or for emergency messages, the team chooses one of these and records it under SEC-02. This plan does not choose:

- no stored secret, engineering firmware only
- use of nRF5340 features after SEC-03 is designed
- a later bill-of-materials change that adds a secure element

## Legacy architecture note

If a slide or chapter still shows the nRF52840 design, label it “previous revision, research paper Section 13.” Do not mix its SE050, ST4SIM, or capacitive SOS into the kit checklist.
