# AI-Assisted Development Workflow Comparison

This document compares two different workflows for building the **Creator Settings Form** in the `FE-03-ai-assisted-workflow-drill` workspace. It highlights the differences between a minimal-effort, single-commit workflow (Round 1) and a precise, test-driven, multi-commit workflow with validation and accessibility (Round 2).

---

## Workflow Comparison Matrix

| Dimension | Round 1: Lazy (Vague Prompt) | Round 2: Precise (Test-Driven & Accessible) |
| :--- | :--- | :--- |
| **Commit Strategy** | **1 commit** (all-in-one blob) | **4 commits** (plan &rarr; schema &rarr; test &rarr; fix &rarr; UI/a11y) |
| **Validation Method** | Basic manual checks (`if/else` checks) | Robust schema validation using **Zod** |
| **Testing** | None (manual testing in browser only) | Automated unit tests via **Vitest** covering edge cases |
| **Accessibility (a11y)**| Minimal/none (basic markup) | Accessible forms (`aria-invalid`, `aria-describedby`, `<label htmlFor>`) |
| **Development Loop** | Generate &rarr; Manual QA &rarr; Hotfix | Plan &rarr; Implement &rarr; Test Failure &rarr; Correct &rarr; Verify |
| **End-to-End Speed** | Fast start, slow integration / high risk | Structured start, zero-defect integration / fast delivery |

---

## Round 1: The Vague/Lazy Approach

### Approach Overview
In Round 1, the goal was to build a settings form with minimal effort using a generic, vague prompt. The AI generated a standard React form with primitive state and ad-hoc validation (e.g., `email.includes('@')`).

### Commit History
Round 1 consists of a single commit:
*   `bbdc3a4 feat: user profile settings form (round one)`

### Limitations
1.  **Fragile Validation**: The email check `!email.includes('@')` accepted invalid email addresses like `user@` or `@domain`.
2.  **No Test Coverage**: Any change to validation logic required manually reloading the page and retyping inputs to verify.
3.  **A11y Gaps**: Visual styles were basic, and form controls lacked ARIA connections, leaving screen reader users without context for validation errors.

---

## Round 2: The Precise/Test-Driven Approach

### Approach Overview
Round 2 used a disciplined, step-by-step approach. By using **Zod** for schema validation and **Vitest** for unit tests, the development process shifted from reactive debugging to proactive verification.

### Commit History
Round 2 shows the verification loop directly in the Git history:
1.  `Add settings form + zod validation schema` (schema structure and basic form setup)
2.  `Add unit tests for validation schema` (test suite implementation)
3.  `fix: payoutEmail regex missed the +alias case, test now passes` (bug fix caught by test)
4.  `Add inline error rendering + a11y labels, tests passing` (final accessible UI and polish)

### AI Mistake Caught During Testing
During the implementation of the validation schema in `src/schema.ts`, a custom email regex was used for `payoutEmail`:
```typescript
const PAYOUT_EMAIL_REGEX = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```
When the unit tests were added in `src/schema.test.ts`, they included a test case for standard subaddressing (email aliases):
```typescript
it('should validate payout email with subaddress alias (e.g., +alias)', () => {
  const payloadWithAlias = {
    username: 'creator123',
    email: 'creator@example.com',
    payoutEmail: 'creator+payout@example.com',
    bio: 'Supporting aliases',
    theme: 'dark' as const,
    newsletter: false,
  };
  const result = creatorSettingsSchema.safeParse(payloadWithAlias);
  expect(result.success).toBe(true);
});
```
Running `npx vitest run` threw an assertion failure:
```bash
AssertionError: expected false to be true
```
This revealed that the custom regex lacked the `+` character class in the local part of the email, which would have rejected valid creator emails with custom aliases (e.g. `creator+payout@gmail.com`). 

**Resolution**: The regex was corrected to:
```typescript
export const PAYOUT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```
Running the test suite again resulted in all tests passing. This demonstrates the "feeling slower but being faster end-to-end" mentor tip—catching this validation bug in a test took seconds, whereas finding it in production or QA would have required a long bug-reporting loop.

### Accessibility Enhancements
In the final commit of Round 2, the UI was enhanced to be fully accessible:
*   **Aria Roles & State**: Inputs bind `aria-invalid={!!errors.field}` dynamically based on the Zod validation output.
*   **Error Connections**: Form errors use `aria-describedby` referencing the specific ID of the inline error message, e.g., `aria-describedby="payoutEmail-error"`, allowing assistive technologies to announce the error when focusing the invalid input.
*   **Live Regions**: Success banners use `role="status"` and `aria-live="polite"` so they are announced upon successful submission.
*   **Labels**: Explicit `<label htmlFor="...">` binds cleanly to `<input id="...">`.
