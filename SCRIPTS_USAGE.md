# Quick Reference: Running Utility Scripts

## Where to Run Scripts From

**Always run scripts from the project root directory:**
```
/pythagora/pythagora-core/workspace/StreamRateHub-bced659/
```

## Quick Commands

### Check if your project is set up correctly:
```bash
node scripts/check-dependencies.js
```

### Test the API endpoints:
```bash
node scripts/test-api.js
```

### Test the CORS configuration:
```bash
node scripts/test-cors.js
```

## Common Question: What directory should I be in?

**Use `pwd` to check your current directory:**
```bash
pwd
```

**If you see:** `/pythagora/pythagora-core/workspace/StreamRateHub-bced659`
✅ You're in the right place! Run the scripts.

**If you see:** `/pythagora/pythagora-core/workspace/StreamRateHub-bced659/scripts`
❌ You're inside the scripts directory. Go back:
```bash
cd ..
node scripts/check-dependencies.js
```

## Expected Warnings

When running `check-dependencies.js`, these warnings are NORMAL and can be ignored:
- ⚠️ MONGODB_URI is not set
- ⚠️ SESSION_SECRET is not set

This app doesn't use a database - it fetches all data in real-time via web scraping.

## More Documentation

For detailed information about each script, see:
- `scripts/README.md` - Full documentation
- Comments at the top of each script file
