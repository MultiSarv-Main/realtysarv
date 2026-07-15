# Firebase Security Specifications

This document defines the Security Specifications and threat model validation for the RealtySarv Firestore database integration.

## Data Invariants

1. **User Identity Bindings**: Users are strictly indexed by their firebase authenticated `uid` path parameter. No user can register under another user's `uid` or elevate their own `role`.
2. **Mandatory Audit Logs**: Actions that alter finances (vouchers, ledger balances) or leads status must be recorded in the general `auditTrails` bucket with valid parameters.
3. **Temporal Invariance**: All timestamps must be generated using `request.time` (server-side verification).
4. **Referential Integrity**: Vouchers must specify a valid project context.

## Dirty Dozen Payloads

Below are twelve malicious scenarios designed to exploit updates, spoof identity, create updating gaps, or execute denial of wallet attacks on our Firestore collections.

### Scenario 1-3: User Spoofing & Promotion
- **Attack 1**: Self-updating role level to "Admin" as standard Sales user.
- **Attack 2**: Assigning a user profile with mismatching request.auth string.
- **Attack 3**: Disabling `isActive` of another team member.

### Scenario 4-6: Lead Overriding & State Violations
- **Attack 4**: Overwriting the `ownerId` of an assigned lead to hijack commission.
- **Attack 5**: Forcing status increments on invalid or empty lead keys.
- **Attack 6**: Setting high value budget data using a massive string (>100KB) to exceed storage limits.

### Scenario 7-9: Financial Fraud Vouchers
- **Attack 7**: Modifying the `totalAmount` on a voucher locked in "Approved" state.
- **Attack 8**: Injecting empty `voucherNumber` or non-numeric negative transaction values.
- **Attack 9**: Modifying historical audit items to conceal illicit activities.

### Scenario 10-12: Denial of Wallet / Structural Attacks
- **Attack 10**: Attempting list queries over entire `vouchers` without specifying a filter.
- **Attack 11**: Placing massive character strings as document IDs.
- **Attack 12**: Forging audit trail logs using an invalid timestamp parameter.

---

## Test Runner Specification

We write `/firestore.rules.test.ts` using our standard testing frameworks to verify that all malicious payloads return permission errors securely.

```ts
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

// Verification test suite to run against emulate mode or unit test contexts
describe('Firestore Security Rules Unit Tests', () => {
    it('blocks self role promotion', async () => {
        // Test role elevation fails
    });
    it('blocks spoofed owner id assignments on active leads', async () => {
        // Test lead hijacks fail
    });
    it('blocks terminal voucher changes', async () => {
        // Locked status updates must be rejected
    });
});
```
