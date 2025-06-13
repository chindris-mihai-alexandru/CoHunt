# Firecrawl Job Search Integration

This document explains the Firecrawl integration for live job search functionality in the CoHunt app.

## What's Been Implemented

### 1. **Firecrawl Service** (`src/lib/jobs/firecrawl-service.ts`)
- Real-time job search using Firecrawl API
- Intelligent URL filtering to ensure only job postings are returned
- Job data extraction from various job sites
- Error handling and timeout management

### 2. **Enhanced Job Scraper** (`src/lib/jobs/scraper.ts`)
- Primary: Firecrawl API for live job search
- Fallback: Traditional web scraping (Indeed)
- Automatic conversion between data formats

### 3. **Caching System** (`src/lib/cache/job-cache.ts`)
- 15-minute cache for search results
- Reduces API calls and improves performance
- Memory-based caching with automatic cleanup

### 4. **Improved API Route** (`src/app/api/search-jobs/route.ts`)
- Multi-layer search strategy:
  1. Check cache first
  2. Check database for recent jobs (2 hours)
  3. Trigger new Firecrawl search if needed
- Rate limiting for OpenAI match score calculations
- Comprehensive error handling with specific error messages

## How It Works

### Search Flow
1. **User submits search** → Check cache
2. **Cache miss** → Check database for recent jobs
3. **Insufficient recent jobs** → Trigger Firecrawl search
4. **Process results** → Calculate match scores (if user has resume)
5. **Cache and return** → Store results for future requests

### Job Sources
Firecrawl searches these job sites:
- Indeed.com (verified job URLs only)
- Workatastartup.com
- Wellfound.com (AngelList)
- RemoteOK, WeWorkRemotely
- Company career pages

### URL Filtering
The service automatically filters out:
- Search result pages
- Salary information pages
- Job listing aggregators
- LinkedIn jobs (restricted)
- Outdated postings

## Configuration

### Environment Variables
```env
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
```

### Rate Limits
- **Firecrawl**: 15 results per search (configurable)
- **OpenAI**: 10 match scores per search with 100ms delays
- **Cache**: 15-minute expiration, 50 max entries

## Error Handling

### Graceful Degradation
1. **Firecrawl fails** → Fall back to traditional scraping
2. **All scraping fails** → Return cached/database results
3. **No results** → User-friendly error message

### Error Types
- **503**: Service temporarily unavailable
- **429**: Rate limit exceeded
- **408**: Search timeout
- **500**: Unexpected errors

## Performance Optimizations

### Caching Strategy
- **Level 1**: In-memory cache (15 minutes)
- **Level 2**: Database cache (2 hours)
- **Level 3**: Fresh scraping

### Cost Management
- Limited to 15 results per Firecrawl search
- OpenAI match scoring limited to 10 jobs
- Timeout after 30 seconds

## Testing

### Manual Testing
```bash
# Test with a simple query
curl -X POST http://localhost:3000/api/search-jobs \
  -H "Content-Type: application/json" \
  -d '{"query": "software engineer", "location": "San Francisco"}'
```

### Expected Response
```json
{
  "jobs": [
    {
      "id": "job_id",
      "title": "Software Engineer",
      "company": "Tech Company",
      "location": "San Francisco, CA",
      "description": "Job description...",
      "url": "https://company.com/jobs/123",
      "salary": "$120k - $160k",
      "source": "firecrawl",
      "matchScore": 85
    }
  ]
}
```

## Monitoring

### Logs to Watch
- `"Starting Firecrawl job search..."` - Search initiated
- `"Successfully extracted X job listings"` - Results processed
- `"Firecrawl failed, falling back..."` - Fallback triggered
- `"Cache hit for query"` - Cache working

### Key Metrics
- Search success rate
- Average response time
- Cache hit ratio
- Firecrawl API usage

## Troubleshooting

### Common Issues

**1. No jobs returned**
- Check Firecrawl API key
- Verify network connectivity
- Check API rate limits

**2. Slow responses**
- Check Firecrawl timeout settings
- Verify cache is working
- Monitor OpenAI API performance

**3. Cache not working**
- Check memory usage
- Verify cache key generation
- Check timeout settings

### Debug Commands
```bash
# Check cache status
# Add endpoint: GET /api/debug/cache-status

# Test Firecrawl directly
# Add endpoint: GET /api/debug/firecrawl-test
```

## Future Enhancements

### Planned Features
1. **Database caching** - Persistent cache with Redis
2. **Job alerts** - Email notifications for new matches
3. **Advanced filtering** - Salary range, experience level
4. **More job sites** - GitHub Jobs, Stack Overflow Jobs
5. **Analytics** - Search trending, success metrics

### API Improvements
1. **Streaming responses** - Return jobs as they're found
2. **Batch processing** - Handle multiple queries
3. **Background jobs** - Pre-populate popular searches
4. **Rate limiting** - Per-user limits

## Cost Estimates

### Firecrawl API
- **Free tier**: 500 credits/month
- **Pro tier**: $29/month for 2,000 credits
- **Cost per search**: ~3-5 credits (15 results)

### OpenAI API
- **Match scoring**: ~$0.001 per job
- **Monthly estimate**: $10-50 (depending on usage)

### Total Monthly Cost
- **Low usage**: $0 (free tiers)
- **Medium usage**: $40-80
- **High usage**: $100-200