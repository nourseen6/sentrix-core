# SENTRIX CORE — Access Control

## Status

This matrix is a **recommendation** for team approval (SEC-11). It is not an existing requirement, and it is not implemented. No account, role, or permission check exists in the workspace.

The recommendation follows least privilege. It uses two items the research paper already describes, without treating them as code:

- Nearby Helper disclosure in Table 44 and the Medical Helper tier in Table 45.
- The emergency-operator dashboard in Table 22, limited here to the active incident.

Administrator content access is not granted by this recommendation. Table 22 gives administrators user, device, model, OTA, and audit-log management. It does not say they may read location, audio, or health content. This matrix keeps those apart.

The legacy gesture tables are not an access-control rule. See SEC-10.

## Roles

| Role | Stage | Meaning in this recommendation |
| --- | --- | --- |
| User | Future | The person the account is about. |
| Guardian | Future | A person linked to one or more dependents, with only the grants that were approved for that link. |
| Nearby Helper | Future | An opted-in user. No access before an incident. Limited access after they accept a dispatch. |
| Medical Helper | Future | A Nearby Helper whose extra grant is vital signs during an accepted incident. Not a standing clinical login. |
| Emergency Operator | Future | A responder view of incidents assigned to that operator. |
| Administrator | Future | Platform operations. No routine user-content access. |

Child, elderly, and medical account names in the paper are not separate roles until SEC-11 says who owns those accounts. The recommendation is: a future dependent profile is owned by the linked guardian, and the dependent does not get a normal login. That sentence is part of the recommendation, not a paper requirement.

## Matrix

Legend: **Own** = that user’s data. **Linked** = a dependent this guardian is approved for. **Incident** = the open incident only. **No** = no access.

| Data or action | User | Guardian | Nearby Helper | Medical Helper | Emergency Operator | Administrator |
| --- | --- | --- | --- | --- | --- | --- |
| Own profile | Own | No | No | No | No | No content |
| Dependent profile | No | Linked | No | No | Incident | No content |
| Live location | Own | Linked, if monitoring was granted | Approximate distance and direction before acceptance. Precise location only after acceptance. | Same as Nearby Helper | Incident | No |
| Location history | Own | Linked, only if that grant exists | No | No | Incident window only | No |
| Heart rate, HRV, SpO2 | Own | Linked, only if granted | No | Incident, after acceptance | Incident | No |
| ECG | Own, only if that hardware exists | Linked, only if granted | No | Incident, after acceptance | Incident | No |
| Audio | Own | Linked, only if granted for that incident | No | No | Incident | No |
| Video | Own | Linked, only if granted for that incident | No | No | Incident | No |
| Medical profile | Own | Linked, only if granted | No | Incident, after acceptance | Incident | No |
| Digital Twin detail | Own | Deviation alert only, unless the full model was granted | No | No | Incident context only | No |
| Incident record | Own | Linked incidents | Own accepted dispatches | Own accepted dispatches | Assigned incidents | Metadata only, not body content |
| Start manual SOS | Own | No | No | No | No | No |
| Cancel an active alert | Own, subject to SEC-10 | No, until SEC-10 says otherwise | No | No | No | No |
| Authorize emergency-service contact | Own, if the account allows it | Linked, if that duty was granted | May contact services as a helper. May not authorize for the family. | Same as Nearby Helper | Does not add viewers | No |
| Device list and unpair | Own devices | No | No | No | No | Fleet metadata |
| Firmware and model rollout | No | No | No | No | No | Yes, with a recorded action |
| Audit log | Own security events | Own actions on linked dependents | No | No | Own incident actions | Read. Deleting a log entry is not a normal action. |

## Recommended constraints

These are part of the recommendation, not implemented behavior.

1. Helper and Medical Helper access ends when the incident is closed or the dispatch is declined.
2. Operator access is limited to incidents assigned to that operator.
3. If an administrator must see user content to fix a fault, that is a separate break-glass action with a written reason stored in the audit log. Break-glass is not in the research paper.
4. Externally collected training datasets are research files. They are not rows in this matrix and they are not user records.
5. Do not code Medical, Women Safety, Athlete, or Alzheimer labels from the scenarios as extra roles until SEC-11 maps them.

## Paper behavior that this recommendation does not adopt yet

| Paper item | Why it is not in force |
| --- | --- |
| Case 4 medical override of “I’m okay” | Narrative in the research paper. Cancel policy is SEC-10. |
| Case 19 biometric cancel | Appears only in that case study and conflicts with other gesture text. |
| Screen 60 “configurable permissions” | A screen name. The allowed settings are this recommendation until approved. |
| Pre-authorized emergency services in Case 4 | Not approved. Real contact is SEC-16. |

## Implementation note

When account code appears, implement only the roles that the build actually has. Future roles stay in this document. Do not add an administrator content browser to meet Table 22.
