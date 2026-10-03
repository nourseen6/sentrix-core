# SentriX Core

A secure edge-AI personal safety system. Graduation project at Alryada University, in progress.

The system is designed as one path: wearable sensing, on-device detection, Bluetooth or cellular connectivity, a mobile app, cloud, and security across that path. It can be used with a phone, or on its own when the phone is not there.

The project is in development. This repository holds the design and the security plan.

## What is in this repository

- Research paper
- Hardware design specification
- Industry collaboration brief
- Security plan: threat model, requirements, access control, data, AI, hardware, and test plan

## Still outside this repository

Application source, model files, firmware, dataset copies, and hardware design files (schematic, PCB) are not in this workspace. Work on those parts may exist elsewhere. Until that source is added here, the security status of those parts is not verified from this repository.

## Security plan

Start with [`security/SECURITY_PLAN.md`](security/SECURITY_PLAN.md).

| File | What it covers |
|---|---|
| [`SECURITY_IMPLEMENTATION_STATUS.md`](security/SECURITY_IMPLEMENTATION_STATUS.md) | What was actually found in the workspace |
| [`THREAT_MODEL.md`](security/THREAT_MODEL.md) | Assets and threats by stage |
| [`SECURITY_REQUIREMENTS.md`](security/SECURITY_REQUIREMENTS.md) | Requirements, status, and priority |
| [`ACCESS_CONTROL.md`](security/ACCESS_CONTROL.md) | Role matrix, pending approval |
| [`DATA_SECURITY.md`](security/DATA_SECURITY.md) | External datasets and future user data |
| [`AI_SECURITY.md`](security/AI_SECURITY.md) | Experiment controls and future on-device decisions |
| [`HARDWARE_SECURITY.md`](security/HARDWARE_SECURITY.md) | Development-kit and custom-band checklists |
| [`SECURITY_TEST_PLAN.md`](security/SECURITY_TEST_PLAN.md) | Tests and the results that were run |
| [`SECURITY_DECISIONS.md`](security/SECURITY_DECISIONS.md) | Choices still open |

## Status

| Stage | Meaning |
|---|---|
| Current | Design documents and the security plan are in this repository |
| Prototype | Development kits, firmware, and pipeline tests are still ahead |
| Planned | Custom hardware, if it is finished |
| Future | Cloud services and the wider response network described in the design |
