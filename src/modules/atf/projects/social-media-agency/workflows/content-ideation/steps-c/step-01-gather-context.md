# Step 1: Gather Context

## What to Do
1. Query Notion **Garden of Ideas** for existing ideas not yet used
2. Query Notion **Content Calendar** for recent posts (last 7 days) to avoid repetition
3. Ask user: "What's on your mind? Any topic you want to talk about this week?"
4. Check if there are trending topics in user's domain (product, startups, career)

## How
- Use Notion API to fetch from Garden of Ideas: `3f41482c-cd34-826e-8de1-01bb53f385df`
- Use Notion API to fetch recent from Content Calendar: `cc01482c-cd34-83ac-81a8-013e4d767924`
- Present a summary: "Here's what's in your idea bank, here's what you posted recently"

## Output
- List of unused ideas from Garden
- List of recent posts (to avoid overlap)
- User's current focus/mood

## Next Step
→ `step-02-brainstorm.md`
