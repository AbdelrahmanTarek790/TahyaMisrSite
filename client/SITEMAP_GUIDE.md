# Sitemap Management Guide

Your site now has a comprehensive sitemap management system that keeps your sitemap.xml automatically updated with the latest content.

## Features

✅ **Automatic Sitemap Generation**

-   Includes all static pages
-   Dynamically fetches news articles and events from your API
-   Google News and Image sitemaps support
-   Proper lastmod dates for better SEO

✅ **Webhook Integration**

-   Automatic regeneration when content changes
-   RESTful API endpoints for sitemap management

✅ **Error Handling & Validation**

-   Retry logic for API failures
-   Sitemap size validation
-   Comprehensive logging

✅ **Multiple Update Methods**

-   Manual generation
-   Webhook triggers
-   Scheduled updates (cron)

## Usage

### Manual Sitemap Generation

```bash
# Generate sitemap manually
npm run sitemap:generate

# Generate and validate
npm run sitemap:update

# Just validate existing sitemap
npm run sitemap:validate
```

### Automatic Updates via Webhook

Your SSR server now includes sitemap webhook endpoints:

**Regenerate Sitemap:**

```bash
POST http://localhost:5173/api/sitemap/regenerate
```

**Check Sitemap Status:**

```bash
GET http://localhost:5173/api/sitemap/status
```

### Integration with Your CMS

Add this webhook URL to your content management system to automatically update the sitemap when content changes:

```
https://your-domain.com/api/sitemap/regenerate
```

### Scheduled Updates

For periodic updates, you can set up a cron job:

```bash
# Run every hour
0 * * * * cd /path/to/your/project && node scripts/sitemap-cron.js

# Run daily at 2 AM
0 2 * * * cd /path/to/your/project && node scripts/sitemap-cron.js

# Run every 30 minutes
*/30 * * * * cd /path/to/your/project && node scripts/sitemap-cron.js
```

## Configuration

### Environment Variables

```bash
# Your site URL (required)
SITE_URL=https://tahyamisryu.com

# Optional webhook to notify after sitemap generation
SITEMAP_WEBHOOK_URL=https://your-cms.com/api/webhooks/sitemap-updated
```

### Sitemap Structure

Your sitemap includes:

1. **Static Pages** (with priorities)

    - Homepage (priority: 1.0)
    - About, News, Events (priority: 0.9)
    - Contact, Join (priority: 0.8)
    - Other pages (0.5-0.7)

2. **Dynamic Content**

    - News articles (`/news/[slug]`) - priority: 0.6
    - Events (`/events/[slug]`) - priority: 0.7

3. **Enhanced Metadata**
    - Google News (for recent articles)
    - Image sitemaps
    - Proper lastmod dates
    - Change frequencies

## Monitoring

### Check Sitemap Status

```bash
curl http://localhost:5173/api/sitemap/status
```

### View Sitemap

Your sitemap is available at:

-   Development: `http://localhost:5173/sitemap.xml`
-   Production: `https://your-domain.com/sitemap.xml`

### Logs

The sitemap generator provides detailed logs:

-   ✅ Success indicators
-   ⚠️ Warnings for issues
-   ❌ Errors with details
-   📊 Statistics (URLs, generation time)

## Best Practices

1. **Update Frequency**

    - News sites: Every 1-4 hours
    - Event sites: Daily
    - Static sites: Weekly/Monthly

2. **Content Priority**

    - Homepage: 1.0
    - Main sections: 0.8-0.9
    - Content pages: 0.6-0.7
    - Utility pages: 0.5

3. **Monitoring**
    - Check sitemap status regularly
    - Monitor generation logs
    - Validate sitemap after updates

## Troubleshooting

### Common Issues

**API Not Responding:**

-   Check your API endpoints are accessible
-   Verify network connectivity
-   Review retry logic in logs

**Large Sitemap Size:**

-   Consider splitting into multiple sitemaps
-   Use sitemap index files for >50,000 URLs

**Missing Content:**

-   Verify API responses include required fields
-   Check slug generation logic
-   Review filtering conditions

### Debug Commands

```bash
# Test API connectivity
curl https://form.codepeak.software/api/v1/news
curl https://form.codepeak.software/api/v1/events

# Check sitemap file
ls -la public/sitemap.xml
head -20 public/sitemap.xml

# Validate XML format
xmllint --noout public/sitemap.xml
```

## SEO Benefits

This sitemap system improves your SEO by:

-   🔍 Helping search engines discover all your content
-   📰 Supporting Google News for recent articles
-   🖼️ Including image metadata for rich results
-   ⏰ Providing accurate lastmod dates
-   🎯 Setting appropriate content priorities
-   🔄 Keeping content fresh and updated

Your sitemap is now production-ready and will automatically stay updated with your latest content!
