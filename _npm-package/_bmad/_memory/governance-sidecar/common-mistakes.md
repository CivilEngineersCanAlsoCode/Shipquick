# Governance Common Mistakes

Patterns of friction in audit and export workflows.

## Recent Mistakes

- **[Data Management]: File Overwrite during Validation**
  - **Context**: During "Completeness Validation" (step-v-12), `write_file` was used instead of appending, causing data loss.
  - **Correction**: Reconstructed report manually from logs.
  - **Prevention**: Always use `replace` or append protocols for cumulative reports. Double-check `write_file` usage.
