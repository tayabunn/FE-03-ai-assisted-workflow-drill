# Project Rules & Conventions

This project follows strict development rules to ensure correctness, testability, and accessibility (a11y).

## Rules

### 1. Form Validation Rule
*   **Rule**: All forms MUST use a validation schema library (specifically **Zod**) to parse and validate input data before processing or submitting. Ad-hoc, custom string checks (such as `email.includes('@')` or nested `if-else` presence checks) are prohibited for form validation.
*   **Verification**: Ensure a schema is defined via `z.object(...)` and is processed using `.safeParse()` or `.parse()` on form submission.

### 2. Automated Test Rule
*   **Rule**: Every validation schema must have associated unit tests (using **Vitest**) under `<filename>.test.ts`. Tests must explicitly assert both successful validations for valid payloads and validation errors for invalid payloads, including common edge cases (such as subaddressing email aliases containing `+` signs).
*   **Verification**: Run `npx vitest run` and confirm that all unit test files execute successfully and pass with 0 failures.

### 3. Form Accessibility (a11y) Rule
*   **Rule**: Form inputs must be fully accessible to screen readers and assistive technologies. Every input must have:
    1.  An explicit `<label>` element with `htmlFor` referencing the input's `id`.
    2.  An `aria-invalid` property dynamically set to `"true"` or `"false"` based on the presence of validation errors.
    3.  An `aria-describedby` property referencing the ID of the inline error message element when an error is active.
*   **Verification**: Check JSX markup for corresponding bindings and verify that error IDs match their `aria-describedby` attributes exactly.
