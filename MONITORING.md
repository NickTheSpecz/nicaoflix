# NicãoFlix - Monitoring & Analytics Guide

This document covers monitoring, analytics, and observability for NicãoFlix deployed on Vercel.

## Overview

NicãoFlix uses multiple monitoring solutions to ensure optimal performance and user experience:

- **Vercel Analytics**: Real User Monitoring (RUM) and traffic analytics
- **Vercel Speed Insights**: Core Web Vitals and performance metrics
- **Function Logs**: Server-side error tracking
- **Build Logs**: Deployment and build monitoring

## Vercel Analytics

### What It Tracks

Vercel Analytics automatically tracks:

- **Page Views**: All page visits and navigation
- **Unique Visitors**: Distinct users visiting the site
- **Top Pages**: Most visited pages
- **Referrers**: Traffic sources
- **Devices**: Desktop, mobile, tablet breakdown
- **Browsers**: Browser usage statistics
- **Countries**: Geographic distribution

### Accessing Analytics

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your NicãoFlix project
3. Click "Analytics" tab
4. View real-time and historical data

### Key Metrics to Monitor

| Metric | Target | Action If Below Target |
|--------|--------|------------------------|
| Page Views | Growing trend | Review content, improve SEO |
| Unique Visitors | Growing trend | Marketing, sharing |
| Bounce Rate | < 50% | Improve content, UX |
| Session Duration | > 5 minutes | Enhance engagement |

## Speed Insights

### Core Web Vitals

Speed Insights tracks the three Core Web Vitals:

#### 1. Largest Contentful Paint (LCP)
- **What**: Time to render largest content element
- **Target**: < 2.5 seconds
- **Good**: Green (< 2.5s)
- **Needs Improvement**: Yellow (2.5-4s)
- **Poor**: Red (> 4s)

**Optimization Tips:**
- Optimize images with Next.js Image
- Reduce server response time
- Implement proper caching
- Use CDN for static assets

#### 2. First Input Delay (FID)
- **What**: Time from user interaction to browser response
- **Target**: < 100 milliseconds
- **Good**: Green (< 100ms)
- **Needs Improvement**: Yellow (100-300ms)
- **Poor**: Red (> 300ms)

**Optimization Tips:**
- Minimize JavaScript execution
- Code split large bundles
- Use web workers for heavy tasks
- Defer non-critical JavaScript

#### 3. Cumulative Layout Shift (CLS)
- **What**: Visual stability during page load
- **Target**: < 0.1
- **Good**: Green (< 0.1)
- **Needs Improvement**: Yellow (0.1-0.25)
- **Poor**: Red (> 0.25)

**Optimization Tips:**
- Set image dimensions explicitly
- Reserve space for dynamic content
- Avoid inserting content above existing content
- Use CSS transforms for animations

### Additional Metrics

- **First Contentful Paint (FCP)**: < 1.5s
- **Time to First Byte (TTFB)**: < 600ms
- **Total Blocking Time (TBT)**: < 300ms

### Accessing Speed Insights

1. Go to Vercel Dashboard
2. Select your project
3. Click "Speed Insights" tab
4. View real-time performance data

## Function Logs

### What They Track

Function logs capture:

- Server-side errors
- API route execution
- Build-time errors
- Runtime exceptions
- Custom console.log statements

### Accessing Function Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Logs" tab
4. Filter by:
   - Time range
   - Log level (info, warn, error)
   - Function name

### Log Levels

```typescript
// Info - General information
console.log('User accessed home page');

// Warning - Potential issues
console.warn('API response slow:', responseTime);

// Error - Actual errors
console.error('Failed to fetch content:', error);
```

### Common Errors to Monitor

| Error Type | Cause | Solution |
|------------|-------|----------|
| 500 Internal Server Error | Server-side exception | Check function logs, fix code |
| 404 Not Found | Invalid route/resource | Verify route configuration |
| Timeout | Function execution > 10s | Optimize function, add caching |
| Memory Limit | Function uses > 1GB RAM | Optimize memory usage |

## Build Logs

### What They Track

Build logs show:

- Build start/completion
- Dependency installation
- TypeScript compilation
- Next.js build process
- Deployment status

### Accessing Build Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments" tab
4. Click on any deployment
5. View "Build Logs" section

### Build Warnings to Monitor

- Unused dependencies
- Large bundle sizes
- Slow build times
- TypeScript warnings
- ESLint warnings

## Custom Monitoring

### Web Vitals Reporting

The application includes custom Web Vitals reporting:

```typescript
// In app/layout.tsx or _app.tsx
import { reportWebVitals } from 'next/web-vitals';

export function reportWebVitals(metric) {
  // Automatically sent to Vercel Analytics
  console.log(metric);
}
```

### Error Boundaries

Error boundaries catch React errors:

```typescript
// components/ui/ErrorBoundary.tsx
// Logs errors and displays fallback UI
```

### API Error Tracking

API errors are tracked in:

```typescript
// lib/utils/api-error-handler.ts
// Logs API failures and retry attempts
```

## Monitoring Dashboard

### Daily Checks (5 minutes)

- [ ] Check Vercel Analytics for traffic
- [ ] Review Speed Insights for performance
- [ ] Scan Function Logs for errors
- [ ] Verify latest deployment succeeded

### Weekly Review (30 minutes)

- [ ] Analyze traffic trends
- [ ] Review Core Web Vitals trends
- [ ] Identify slow pages
- [ ] Check error patterns
- [ ] Review bandwidth usage

### Monthly Analysis (1-2 hours)

- [ ] Comprehensive performance audit
- [ ] User behavior analysis
- [ ] Optimization opportunities
- [ ] Capacity planning
- [ ] Cost analysis

## Alerts & Notifications

### Vercel Notifications

Configure notifications in Vercel Dashboard:

1. Go to Project Settings
2. Click "Notifications"
3. Enable:
   - Deployment failures
   - Build errors
   - Domain issues
   - Quota warnings

### Email Notifications

Set up email alerts for:

- Failed deployments
- Build errors
- Performance degradation
- Quota exceeded

## Performance Benchmarks

### Target Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| LCP | < 2.5s | - | 🟢 |
| FID | < 100ms | - | 🟢 |
| CLS | < 0.1 | - | 🟢 |
| FCP | < 1.5s | - | 🟢 |
| TTFB | < 600ms | - | 🟢 |

### Page Load Times

| Page | Target | Current | Status |
|------|--------|---------|--------|
| Home | < 2s | - | 🟢 |
| Category | < 2s | - | 🟢 |
| Details | < 2.5s | - | 🟢 |
| Player | < 3s | - | 🟢 |

## Bandwidth & Usage

### Free Tier Limits

- **Bandwidth**: 100 GB/month
- **Build Minutes**: 6,000/month
- **Serverless Function Execution**: 100 GB-hours/month

### Typical Usage (Personal Use)

- **Bandwidth**: 10-20 GB/month
- **Build Minutes**: 50-100/month
- **Function Execution**: 5-10 GB-hours/month

### Monitoring Usage

1. Go to Vercel Dashboard
2. Click "Usage" tab
3. Monitor:
   - Bandwidth consumption
   - Build minutes used
   - Function execution time

### Optimization Tips

If approaching limits:

1. **Reduce Bandwidth**:
   - Optimize images further
   - Implement aggressive caching
   - Use smaller image sizes
   - Enable compression

2. **Reduce Build Time**:
   - Cache dependencies
   - Optimize build scripts
   - Reduce unnecessary builds

3. **Reduce Function Execution**:
   - Implement caching
   - Optimize API calls
   - Use static generation where possible

## Troubleshooting

### High Error Rate

1. Check Function Logs for error patterns
2. Review recent deployments
3. Check API status
4. Verify environment variables
5. Test locally to reproduce

### Poor Performance

1. Run Lighthouse audit
2. Check Speed Insights
3. Identify slow pages
4. Review network requests
5. Optimize identified issues

### High Bandwidth Usage

1. Check Analytics for traffic spikes
2. Review image optimization
3. Verify caching headers
4. Check for bot traffic
5. Implement rate limiting if needed

## Best Practices

### Monitoring

- ✅ Check analytics daily
- ✅ Review logs weekly
- ✅ Run performance audits monthly
- ✅ Set up alerts for critical issues
- ✅ Document incidents and solutions

### Performance

- ✅ Maintain Core Web Vitals in green
- ✅ Keep bundle sizes small
- ✅ Optimize images aggressively
- ✅ Implement proper caching
- ✅ Monitor and fix regressions

### Reliability

- ✅ Monitor error rates
- ✅ Set up error boundaries
- ✅ Implement retry logic
- ✅ Have rollback plan ready
- ✅ Test before deploying

## Resources

- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [Speed Insights Docs](https://vercel.com/docs/speed-insights)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)

## Support

For monitoring issues:

1. Check Vercel Status: https://www.vercel-status.com/
2. Review documentation
3. Contact Vercel Support
4. Check community forums

---

**Last Updated**: December 2024
**Monitoring Version**: 1.0
