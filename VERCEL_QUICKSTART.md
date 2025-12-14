# NicãoFlix - Vercel Quick Start Guide

Get NicãoFlix deployed to Vercel in 5 minutes.

## 🚀 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/nicaoflix)

## 📋 Manual Deployment Steps

### 1. Prerequisites
- GitHub repository with NicãoFlix code
- Vercel account (sign up at [vercel.com](https://vercel.com))

### 2. Import Project to Vercel

**Via Dashboard:**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your NicãoFlix repository
4. Click "Import"

**Via CLI:**
```bash
npm i -g vercel
vercel login
vercel
```

### 3. Configure Environment Variables

In Vercel Dashboard, add these variables:

**Required:**
```
NEXT_PUBLIC_API_BASE_URL=https://superflixapi.run
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
NODE_ENV=production
```

**Optional (with defaults):**
```
NEXT_PUBLIC_SITE_NAME=NicãoFlix
NEXT_PUBLIC_ENABLE_SERVICE_WORKER=true
NEXT_PUBLIC_ENABLE_SYNC=true
NEXT_PUBLIC_SYNC_INTERVAL=3600000
NEXT_PUBLIC_IMAGE_QUALITY=85
NEXT_PUBLIC_PREFETCH_ENABLED=true
```

### 4. Deploy

Click "Deploy" and wait 2-3 minutes. Your site will be live!

## 🔧 Post-Deployment

### Update Site URL
After first deployment, update the environment variable:
```
NEXT_PUBLIC_SITE_URL=https://your-actual-domain.vercel.app
```

### Enable Analytics
Analytics are automatically enabled. View them at:
- Dashboard > Your Project > Analytics

### Custom Domain (Optional)
1. Go to Project Settings > Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

## ✅ Verification Checklist

After deployment, verify:

- [ ] Site loads at Vercel URL
- [ ] Home page displays content
- [ ] Search functionality works
- [ ] Category filters work
- [ ] Content details pages load
- [ ] Video player works
- [ ] Mobile responsive design works
- [ ] Service Worker registers (check DevTools > Application)
- [ ] Analytics tracking (check Vercel Dashboard)

## 🐛 Common Issues

### Build Fails
- Run `npm run build` locally first
- Check for TypeScript errors
- Verify all dependencies are in package.json

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing variables
- Check variable names match exactly

### Images Not Loading
- Verify image domains in `next.config.mjs`
- Check CORS settings
- Ensure image URLs are valid

### 404 Errors
- Verify route structure in `app/` directory
- Check dynamic route parameters
- Clear Vercel cache and redeploy

## 📊 Monitoring

### Performance
- View Core Web Vitals in Vercel Dashboard
- Target metrics:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

### Usage
- Monitor bandwidth in Vercel Dashboard
- Free tier: 100 GB/month
- Typical usage: 10-20 GB/month for personal use

### Errors
- Check Vercel Function Logs for errors
- Monitor build logs for warnings
- Set up error tracking if needed

## 🔄 Updates

### Automatic Deployments
- Push to `main` branch → Production deployment
- Push to any branch → Preview deployment
- Open PR → Preview deployment with unique URL

### Manual Deployment
```bash
vercel --prod
```

## 📚 Resources

- [Full Deployment Guide](./DEPLOYMENT.md)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## 🆘 Support

If you encounter issues:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
2. Review Vercel build logs
3. Check Vercel Status page
4. Contact Vercel support

---

**Estimated Deployment Time:** 5-10 minutes
**Estimated Build Time:** 2-3 minutes
**Free Tier Sufficient:** Yes ✅
