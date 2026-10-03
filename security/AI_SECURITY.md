# SENTRIX CORE — AI Security

## Two different uses of AI

| Use | What it is | Status |
| --- | --- | --- |
| Current experiments | Training or evaluation on externally collected datasets, and any mobile code that displays experiment results. | The team reports this work is underway. No training script, model file, or dataset file is in the workspace. This use is an academic experiment. It is not a deployed safety system. |
| Future on-device safety decisions | Selected real-time decisions on the wearable, especially when the phone is absent. Candidates already tied to the hardware direction are fall detection and the physical SOS path. Engines E4 and E5 are specified on the phone and in the cloud until SEC-09 moves them. | PLANNED. Not running on hardware. Do not describe the current experiment as safety-critical on-device AI. |

Research paper Section 6 defines thirteen engines, datasets, and reported metrics. Those pages are the design. They are not test results from this repository.

## Controls

| ID | Control | Stage | Status | What to do |
| --- | --- | --- | --- | --- |
| AI-01 | Record the model version used in each experiment. | Current | MISSING | Add a row to the register below when a model file exists. Include date, file name, and the dataset rows from `DATA_SECURITY.md` that trained or tested it. |
| AI-02 | Record training-data provenance as external. | Current | MISSING | The dataset register is the source. Do not write “collected by the team.” |
| AI-03 | Restrict who can replace a model file used by the app or a demo. | Current, once a model is loaded by software | MISSING | Keep model binaries out of casual copies. `.gitignore` ignores common model extensions under `models/`. |
| AI-04 | Treat a model update as a version change, not a silent overwrite. | Current experiments and future OTA | MISSING | Keep the previous file until the new row is recorded. Remote OTA is SEC-07 and is not implemented. |
| AI-05 | Rollback | Future, and any demo that can swap models | FUTURE | Engine E13 names drift alerts and rollback recommendations. There is no rollback mechanism in the workspace. A current experiment can roll back by selecting the previous registered file. |
| AI-06 | Malformed inputs | Current scripts, when they exist | MISSING | Reject or log files that do not match the expected shape. Do not add this to a product safety claim. |
| AI-07 | Sensor or file manipulation | Prototype and later | PLANNED | A bad sensor (Engine E12 in the paper) and a deliberate inject are different tests. See `HARDWARE_SECURITY.md`. |
| AI-08 | Integrity of a future on-device model | Planned band | FUTURE | Depends on SEC-06 and SEC-07. No algorithm is chosen here. |
| AI-09 | Do not present paper metrics as results of this repository. | Current | Required in reporting | Section 6 performance figures stay cited as the paper’s figures until this repo produces its own evaluation log. |

## Model register

Empty on 1 October 2026.

| Model file | Version or date | Task | Dataset rows used | Produced by this team? | Loaded by the mobile app? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | Not found in workspace | — |

## Experiment logging

When training code is added, each run log should include:

- model register id
- dataset register ids
- a statement that the source data was externally collected
- the metric names and the split
- the person or machine that ran it

That log is an academic record. It does not make the model a medical device or an emergency authority.

## Future safety-critical path

Before a model output can raise an emergency on a band:

1. SEC-09 lists that model as an on-device decision.
2. The model file in the firmware image matches a register row.
3. A bench test shows the output on known samples, including a sample that must not alarm.
4. SEC-16 is closed so the test cannot reach a real emergency service.
5. Failure of the model leaves the physical SOS button usable. That button is specified as independent of AI in the Hardware Design Specification.

Until those five items are true, model output in the current project is an experiment result.
