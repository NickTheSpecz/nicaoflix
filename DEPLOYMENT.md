# NicãoFlix - Deployment Guide

This guide covers deploying NicãoFlix to Vercel with all necessary configurations.

## Prerequisites

- GitHub account with the NicãoFlix repository
- Vercel account (free tier is sufficient)
- Node.js 18+ installed locally for testing

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Select your NicãoFlix repository
   - Vercel will auto-detect Next.js configuration

3. **Configure Environment Variables**
   - Add the following environment variables:
     ```
     NEXT_PUBLIC_API_BASE_URL=https://superflixapi.run
     NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
     NEXT_PUBLIC_SITE_NAME=NicãoFlix
     NEXT_PUBLIC_ENABLE_SERVICE_WORKER=true
     NEXT_PUBLIC_ENABLE_SYNC=true
     NEXT_PUBLIC_SYNC_INTERVAL=3600000
     NEXT_PUBLIC_IMAGE_QUALITY=85
     NEXT_PUBLIC_PREFETCH_ENABLED=true
     NODE_ENV=production
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Configuration Details

### Build Settings

The project uses the following build configuration (auto-detected by Vercel):

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x (specified in package.json engines)

### Environment Variables

#### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://superflixapi.run` | SuperFlixAPI base URL |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL | Full site URL for metadata |
| `NODE_ENV` | `production` | Environment mode |

#### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SITE_NAME` | `NicãoFlix` | Site name for metadata |
| `NEXT_PUBLIC_ENABLE_SERVICE_WORKER` | `true` | Enable offline support |
| `NEXT_PUBLIC_ENABLE_SYNC` | `true` | Enable content sync |
| `NEXT_PUBLIC_SYNC_INTERVAL` | `3600000` | Sync interval (1 hour) |
| `NEXT_PUBLIC_IMAGE_QUALITY` | `85` | Image optimization quality |
| `NEXT_PUBLIC_PREFETCH_ENABLED` | `true` | Enable link prefetching |

### Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` environment variable

## Deployment Features

### Automatic Deployments

- **Production**: Automatic deployment on push to `main` branch
- **Preview**: Automatic preview deployments for all branches and PRs
- **Rollback**: Instant rollback to any previous deployment

### Performance Optimizations

The deployment includes:

- ✅ Automatic image optimization via Next.js Image
- ✅ Edge caching for static assets
- ✅ Gzip/Brotli compression
- ✅ Code splitting and lazy loading
- ✅ Service Worker for offline support
- ✅ ISR (Incremental Static Regeneration)

### Security Headers

Configured in `vercel.json`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Caching Strategy

| Resource Type | Cache Duration | Strategy |
|---------------|----------------|----------|
| Static Assets | 1 year | Immutable |
| Pages | 1 hour | Stale-while-revalidate |
| API Routes | 30 minutes | Stale-while-revalidate |
| Service Worker | 0 | Must revalidate |

## Analytics & Monitoring

### Vercel Analytics (Built-in)

Vercel Analytics is automatically enabled for all deployments:

- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Page performance metrics
- No configuration needed

To view analytics:
1. Go to your project dashboard
2. Click "Analytics" tab
3. View real-time and historical data

### Speed Insights

Vercel Speed Insights provides detailed performance data:

1. Install package (already included):
   ```bash
   npm install @vercel/speed-insights
   ```

2. Component is integrated in `app/layout.tsx`

3. View insights in Vercel Dashboard > Speed Insights

### Web Vitals Monitoring

The application tracks Core Web Vitals:

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.5s
- **TTFB** (Time to First Byte): < 600ms

Metrics are automatically sent to Vercel Analytics.

## Preview Deployments

Every branch and PR gets a unique preview URL:

- Automatic deployment on push
- Unique URL: `https://nicaoflix-git-branch-name-username.vercel.app`
- Perfect for testing before merging
- Shareable with team members

### Preview Deployment Workflow

1. Create a new branch
2. Make changes and push
3. Vercel automatically deploys preview
4. Test on preview URL
5. Merge to main for production deployment

## Troubleshooting

### Build Failures

**Issue**: Build fails with "Module not found"
- **Solution**: Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Issue**: Build fails with TypeScript errors
- **Solution**: Run `npm run build` locally first
- Fix all TypeScript errors before deploying

**Issue**: Build exceeds time limit
- **Solution**: Optimize build process
- Remove unused dependencies
- Check for infinite loops in build scripts

### Runtime Errors

**Issue**: 404 errors on dynamic routes
- **Solution**: Verify route structure matches Next.js conventions
- Check `app/` directory structure

**Issue**: API calls failing
- **Solution**: Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check CORS settings if applicable

**Issue**: Images not loading
- **Solution**: Verify image domains in `next.config.mjs`
- Check image paths are correct

### Performance Issues

**Issue**: Slow page loads
- **Solution**: Enable ISR for static pages
- Implement proper caching headers
- Optimize images with Next.js Image

**Issue**: High bandwidth usage
- **Solution**: Reduce image quality setting
- Implement lazy loading
- Enable compression

## Vercel Free Tier Limits

The free tier includes:

- ✅ 100 GB bandwidth per month
- ✅ 100 GB-hours serverless function execution
- ✅ 6,000 build minutes per month
- ✅ Unlimited preview deployments
- ✅ Automatic HTTPS
- ✅ DDoS protection
- ✅ Analytics (basic)

**Estimated Usage for NicãoFlix:**
- Bandwidth: ~10-20 GB/month (for personal use)
- Build time: ~2-3 minutes per deployment
- Serverless functions: Minimal (mostly static)

## Production Checklist

Before going live, verify:

- [ ] All environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled and working
- [ ] Service Worker functioning correctly
- [ ] All pages load without errors
- [ ] Images optimized and loading
- [ ] Mobile responsiveness verified
- [ ] Performance metrics meet targets
- [ ] Error tracking configured
- [ ] Security headers applied

## Maintenance

### Updating the Application

1. Make changes locally
2. Test thoroughly: `npm run dev`
3. Build locally: `npm run build`
4. Push to GitHub
5. Vercel automatically deploys

### Monitoring

Regular checks:

- **Weekly**: Review analytics for errors
- **Monthly**: Check bandwidth usage
- **Quarterly**: Review and optimize performance

### Rollback Procedure

If issues occur after deployment:

1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find last working deployment
4. Click "..." menu
5. Select "Promote to Production"

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)

## Additional Resources

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel Analytics Guide](https://vercel.com/docs/analytics)
- [Custom Domains Guide](https://vercel.com/docs/custom-domains)
