
## 2026-03-12: OAuth Credential Creation

### Learning
OAuth credentials (Google, GitHub, etc.) **cannot be created via API alone**. They require:
1. Browser-based authorization flow
2. User login & consent
3. Callback redirect

### Rule
When user asks to create OAuth credential:
1. ❌ Don't try to automate fully
2. ✅ Ask user to complete in N8N UI
3. ✅ Provide step-by-step guidance for unfamiliar fields

### Common Confusing Fields

**Scope** = Permissions your app requests. Examples:
- `https://www.googleapis.com/auth/spreadsheets` → Read/write Google Sheets
- `https://www.googleapis.com/auth/gmail.send` → Send emails via Gmail
- `https://www.googleapis.com/auth/youtube` → Manage YouTube

**Client ID** = Your app's public identifier (safe to share)
**Client Secret** = Your app's password (NEVER share)
**Redirect URI** = Where Google sends user after login (N8N provides this)


## 2026-03-12: Google OAuth2 Valid Scopes

### Invalid Scopes (don't use)
- `https://www.googleapis.com/auth/meet.recordings` ❌
- `https://www.googleapis.com/auth/keep` ❌

### Working Scopes (28 total)
```
userinfo.email userinfo.profile drive drive.file spreadsheets documents presentations forms calendar calendar.events gmail.modify gmail.send gmail.compose youtube youtube.upload youtube.readonly contacts contacts.readonly tasks photoslibrary blogger analytics analytics.readonly webmasters cloud-platform firebase chat.messages classroom.courses
```

### Format
- Space-separated (not commas)
- Full URL format: `https://www.googleapis.com/auth/{scope}`
