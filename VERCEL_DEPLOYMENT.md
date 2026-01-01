# Vercel Deployment Guide for Admin Web

This guide covers deploying the `admin-web` frontend to Vercel from the monorepo.

## Prerequisites

- Vercel account connected to your Git repository
- Push all changes to your repository

## Vercel Project Configuration

### Important: Set Root Directory

In your Vercel project settings, you **MUST** set the Root Directory:

1. Go to your Vercel project
2. Navigate to **Settings** → **General**
3. Find **Root Directory** section
4. Click **Edit**
5. Set it to: `apps/admin-web`
6. Click **Save**

### Build & Development Settings

These should be automatically detected from `vercel.json`, but verify:

- **Framework Preset**: Other (or Vite)
- **Build Command**: Will be overridden by `vercel.json`
- **Output Directory**: Will be overridden by `vercel.json`
- **Install Command**: Will be overridden by `vercel.json`

## How It Works

The build process:
1. Changes to `apps/admin-web` directory (via Root Directory setting)
2. Runs install command: `cd ../.. && pnpm install --frozen-lockfile`
   - Goes to monorepo root
   - Installs all workspace dependencies
3. Runs build command:
   - `cd ../.. && pnpm --filter @grow-fitness/shared-types build`
   - `pnpm --filter @grow-fitness/shared-schemas build`
   - `pnpm --filter @grow-fitness/admin-web build`
4. Output directory: `dist` (relative to Root Directory = `apps/admin-web/dist`)

## Environment Variables

Add any required environment variables in Vercel:

- `VITE_API_BASE_URL` - Your API endpoint URL

## Troubleshooting

### Error: No Output Directory found

- **Cause**: Root Directory not set in Vercel project settings
- **Solution**: Set Root Directory to `apps/admin-web` (see above)

### Error: Cannot find module '@grow-fitness/shared-...'

- **Cause**: Workspace packages not built before admin-web
- **Solution**: Ensure build command builds packages in order (already configured in `vercel.json`)

### Build succeeds but app doesn't work

- **Cause**: Missing environment variables
- **Solution**: Add `VITE_API_BASE_URL` in Vercel project settings

## Files Involved

- `/vercel.json` - Build configuration (in monorepo root)
- `apps/admin-web/vercel.json` - Local config (if Root Directory is set to `apps/admin-web`)
- `package.json` - Workspace configuration with pnpm

## Deploy

Once configured, simply push to your repository. Vercel will automatically build and deploy.

