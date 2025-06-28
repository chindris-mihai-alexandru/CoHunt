# CoHunt Platform Roadmap 🗺️

## Current Issues & Immediate Fixes

### 1. Email Confirmation System 📧
**Problem**: Users don't receive confirmation emails after signup  
**Solution**: Integrate Resend for transactional emails
- [ ] Set up Resend account and API keys
- [ ] Implement email templates (welcome, confirmation, password reset)
- [ ] Configure Supabase Auth to use Resend SMTP
- [ ] Add email verification flow to signup process

### 2. Live Job Search Integration 🔍
**Problem**: Job search fails - currently using mock data instead of real jobs  
**Solution**: Implement real Firecrawl API integration
- [ ] Add Firecrawl API key to environment variables
- [ ] Update job scraper to use actual Firecrawl endpoints
- [ ] Implement error handling and rate limiting
- [ ] Cache job results to minimize API calls
- [ ] Add fallback to database for recent searches

## New Features Pipeline

### 3. Monetization Support - Buy Me A Coffee ☕
**Implementation Plan**:

#### Platform Integration
- [ ] Add Buy Me A Coffee widget to website footer
- [ ] Create dedicated "Support Us" page
- [ ] Add donation progress bar showing API costs coverage
- [ ] Implement "Supporter" badges for donors

#### Transparency Dashboard
- [ ] Show real-time API usage statistics
- [ ] Display monthly costs breakdown
- [ ] List recent supporters (with permission)

## Future Enhancements

### Q1 2025
- [ ] Mobile app (React Native)
- [ ] Browser extension for quick job saves
- [ ] AI-powered cover letter generation
- [ ] Interview preparation assistant

### Q2 2025
- [ ] Company reviews integration
- [ ] Salary insights and negotiation tips
- [ ] Remote work filter improvements
- [ ] Multi-language support

### Technical Debt
- [ ] Add comprehensive test suite
- [ ] Implement proper logging and monitoring
- [ ] Set up CI/CD pipeline
- [ ] Add API rate limiting per user
- [ ] Implement job alert notifications

## Cloud Infrastructure Migration 🌩️

**Status**: Planning Phase  
**Timeline**: To begin after core features are stable

See [Cloud Implementation Roadmap](docs/CLOUD_IMPLEMENTATION_ROADMAP.md) for detailed plans including:
- AWS Activate application strategy ($1K-$100K credits)
- Serverless architecture with AWS Lambda
- CDN implementation for global performance
- Microservices migration path
- Cost optimization strategies

### Key Milestones
- [ ] Apply for AWS Activate Founders tier
- [ ] Migrate to serverless functions (FaaS)
- [ ] Implement CloudFront CDN
- [ ] Set up monitoring and QoS logging
- [ ] Design horizontal scaling architecture

## Resource Requirements

### Monthly Costs Estimate
- **Firecrawl API**: $50-200 (based on usage)
- **Supabase**: $25 (Pro tier)
- **Resend Email**: $20 (10k emails/month)
- **Vercel Hosting**: $20 (Pro tier)
- **Total**: ~$115-265/month

### Donation Goals
- **Phase 1**: Cover basic API costs ($100/month)
- **Phase 2**: Enable premium features ($250/month)
- **Phase 3**: Full-time development ($1000/month)

---

*Last updated: June 2025*