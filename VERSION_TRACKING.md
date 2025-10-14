# Version Tracking

This project includes automatic version tracking that displays build information in the footer of every page.

## What's Displayed

The footer shows:
- **Version**: From `package.json` (semantic versioning)
- **Build Date**: When the application was last built
- **Commit Hash**: Short git commit hash
- **Environment**: Development or Production

Example: `v0.1.0 • Built: Oct 14, 2025 • 1be0904 • Production`

## How It Works

1. **Build Script**: `scripts/generate-build-info.js`
   - Automatically runs before each build via `prebuild` script
   - Extracts version from `package.json`
   - Gets git commit hash and branch
   - Captures current timestamp
   - Writes to both `/lib/build-info.json` (server) and `/public/build-info.json` (client)

2. **Footer Component**: `components/Footer.tsx`
   - Client-side component that fetches `/build-info.json`
   - Displays version info in a subtle, fixed position at bottom-right
   - Color-coded environment indicator (green for production, blue for development)

3. **Auto-generated Files**:
   - `/lib/build-info.json` - For server-side usage
   - `/public/build-info.json` - For client-side usage (served statically)
   - Both files are gitignored as they're generated at build time

## Updating the Version

To update the application version:

```bash
npm version patch  # 0.1.0 -> 0.1.1 (bug fixes)
npm version minor  # 0.1.0 -> 0.2.0 (new features)
npm version major  # 0.1.0 -> 1.0.0 (breaking changes)
```

Or manually edit the `version` field in `package.json`.

## Build Commands

```bash
# Development (build info generated but NODE_ENV=development)
npm run dev

# Production build (generates fresh build info with timestamp)
npm run build
npm start
```

## Customizing the Footer

The footer styling can be customized in `components/Footer.tsx`:
- Position: Currently `fixed bottom-2 right-2`
- Appearance: Subtle with backdrop blur and border
- Colors: Can be adjusted via Tailwind classes

## CI/CD Integration

The build info is automatically generated during deployment:
1. CI/CD runs `npm run build`
2. `prebuild` script executes first
3. Build info is generated with current timestamp and commit hash
4. Next.js build includes the generated files
5. Footer displays the deployment information

## Troubleshooting

**Footer not appearing:**
- Check that `/public/build-info.json` exists after build
- Verify fetch is succeeding in browser DevTools Network tab

**Wrong commit hash:**
- Ensure git is available in build environment
- Check that `.git` directory exists

**Build info not updating:**
- Run `npm run build` to trigger `prebuild` script
- Check that `scripts/generate-build-info.js` has execute permissions
