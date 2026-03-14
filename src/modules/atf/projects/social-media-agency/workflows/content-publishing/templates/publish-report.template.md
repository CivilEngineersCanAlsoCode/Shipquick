# Publish Report

**Generated:** {{generated_at}}

---

## Post Details

| Field | Value |
|-------|-------|
| Post ID | {{post_id}} |
| Title | {{title}} |
| Published At | {{published_at}} |
| LinkedIn Post URN | {{linkedin_post_urn}} |
| LinkedIn URL | https://www.linkedin.com/feed/update/{{linkedin_post_urn}} |
| Delay Applied (minutes) | {{delay_applied_minutes}} |
| Status | {{status}} |

---

## Execution Summary

| Step | Result | Notes |
|------|--------|-------|
| D.1 Fetch Ready Posts | {{d1_result}} | {{d1_notes}} |
| D.2 Publish to LinkedIn | {{d2_result}} | {{d2_notes}} |
| D.3 Update Status | {{d3_result}} | {{d3_notes}} |
| D.4 Telegram Notification | {{d4_result}} | {{d4_notes}} |

---

## Checklist Summary

- Pre-Publish: {{pre_publish_pass_count}}/7 passed
- Publish: {{publish_pass_count}}/4 passed
- Post-Publish: {{post_publish_pass_count}}/5 passed
- **Overall: {{overall_status}}**
