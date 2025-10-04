# Fandom API Access Permission Request

## Contact Information

### Primary Contact Methods:

1. **Business/Partnership Inquiries:**
   - Email: `[email protected]`
   - **Recommended for API access requests**

2. **Community/Technical Inquiries:**
   - Email: `Community@Fandom.com`

3. **General Support:**
   - Email: `support@fandom.com`
   - Phone: `1-415-762-0780`
   - Support Form: https://support.fandom.com/hc/en-us/requests/new

4. **Mailing Address:**
   ```
   Fandom, Inc.
   130 Sutter Street, 4th Floor
   San Francisco, California 94104
   United States
   ```

---

## Email Template for Permission Request

**Subject:** API Access Request - Survivor Fantasy League Application

---

**Email Body:**

```
Dear Fandom Business Development Team,

I am writing to request permission to programmatically access content from the Survivor Wiki
(https://survivor.fandom.com) for a non-commercial fantasy sports application.

PROJECT OVERVIEW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project Name: Survivor Fantasy League
Purpose: Non-commercial web application for Survivor fans to run fantasy leagues
Target Audience: CBS Survivor fans
Expected Users: Small community (initially < 1000 users)
Project Status: Development/Beta

REQUESTED ACCESS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API Endpoints:
- MediaWiki Parse API: /api.php?action=parse
- Fandom Articles API: /api/v1/Articles/Details

Content Accessed:
- Current season contestant information (names, tribes, elimination status)
- Season metadata (season number, location, logo)
- Episode summaries (optional)

Frequency:
- Weekly updates (after episode airings)
- Approximately 1-2 requests per week per season
- Rate limited to 1 request every 2 seconds minimum

Data Usage:
- Cached locally in PostgreSQL database
- Not redistributed or resold
- Used only to display information within our app
- Proper attribution to Survivor Wiki will be provided

TECHNICAL IMPLEMENTATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User-Agent: SurvivorFantasyApp/1.0 ([YOUR-EMAIL])
Rate Limiting: 1-2 second delay between requests
Caching: 24-hour minimum cache duration
Error Handling: Graceful failure without retry storms
Robots.txt Compliance: Full compliance with all directives

COMPLIANCE COMMITMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Respect all rate limits and robots.txt rules
✓ Provide proper attribution to Survivor Wiki on all pages
✓ Not redistribute or resell the data
✓ Use data only for display within our application
✓ Implement aggressive caching to minimize requests
✓ Respond promptly to any concerns or requests to modify access
✓ Cease access immediately if requested

ATTRIBUTION EXAMPLE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
We will include prominent attribution on all pages displaying Survivor data:

"Contestant information sourced from Survivor Wiki (survivor.fandom.com)
under Fandom's API access agreement. All content is property of their
respective owners."

ALTERNATIVES CONSIDERED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
We have explored:
1. Manual data entry - Not scalable for active development
2. Open source datasets (doehm/survivoR) - Only covers historical seasons
3. CBS official sources - No public API available

Fandom's Survivor Wiki is the most comprehensive and up-to-date source for
current season information, which is why we are requesting API access.

BENEFITS TO FANDOM:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Increased traffic and backlinks to Survivor Wiki
- Exposure to fantasy sports community
- Demonstration of API use case for other developers
- Proper attribution on all pages
- Potential future revenue through affiliate links or partnerships

CONTACT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Developer: [YOUR-NAME]
Email: [YOUR-EMAIL]
Project URL: [YOUR-APP-URL or GitHub repo]
Phone: [YOUR-PHONE] (optional)

I understand and acknowledge Fandom's Terms of Service and am committed to
full compliance with all requirements. I am happy to discuss any concerns,
modify our implementation, or provide additional information as needed.

Thank you for considering this request. I look forward to hearing from you.

Best regards,
[YOUR-NAME]
[YOUR-TITLE]
[YOUR-PROJECT-NAME]
```

---

## Alternative: Contact Survivor Wiki Admins

If Fandom corporate doesn't respond, you can reach out to Survivor Wiki administrators:

### Method 1: Wiki Community Portal
1. Visit: https://survivor.fandom.com/wiki/Survivor_Wiki:Community_Portal
2. Look for admin contact information
3. Post on community discussion page

### Method 2: Direct Admin Contact
1. Visit: https://survivor.fandom.com/wiki/Special:ListUsers/sysop
2. Find active administrators
3. Leave message on their talk page

### Sample Message for Wiki Admins:

```
Subject: API Access Request for Fantasy League Application

Hello [ADMIN-NAME],

I am developing a non-commercial Survivor fantasy league application and would
like to programmatically access contestant data from the Survivor Wiki using
Fandom's MediaWiki API.

I understand Fandom's TOS requires permission for automated access. I have
reached out to Fandom corporate but wanted to also notify the wiki community
and seek your guidance.

My application would:
- Access current season contestant data weekly
- Properly attribute all information to Survivor Wiki
- Implement rate limiting and caching
- Not redistribute or resell the data

Would the wiki community support this use case? Is there a formal process for
requesting API access at the wiki level?

Thank you for your time and for maintaining such a valuable resource for
Survivor fans.

Best regards,
[YOUR-NAME]
```

---

## Documentation to Attach

When sending your permission request, consider attaching:

1. **Technical Specification** (see below)
2. **Privacy Policy** (if applicable)
3. **Attribution Examples** (mockups showing how you'll credit Fandom)
4. **Rate Limiting Implementation** (code snippet)

### Technical Specification Document

```markdown
# Survivor Fantasy League - API Access Technical Specification

## API Endpoints Used

### 1. MediaWiki Parse API
- **Endpoint:** /api.php?action=parse&page=PAGENAME&format=json&prop=text
- **Purpose:** Fetch parsed HTML for current season pages
- **Frequency:** 1 request per week per season
- **Example:** /api.php?action=parse&page=Survivor_49&format=json&prop=text

### 2. Fandom Articles API (Optional)
- **Endpoint:** /api/v1/Articles/Details?titles=PAGENAME
- **Purpose:** Fetch season metadata and thumbnails
- **Frequency:** 1 request per week per season

## Data Extracted

- Contestant names
- Tribe assignments
- Elimination status
- Elimination day/episode
- Season metadata (name, logo, abstract)

## Rate Limiting Implementation

```python
import asyncio
from datetime import datetime, timedelta

class RateLimiter:
    def __init__(self, min_delay_seconds=2):
        self.min_delay = min_delay_seconds
        self.last_request = None

    async def wait(self):
        if self.last_request:
            elapsed = (datetime.now() - self.last_request).total_seconds()
            if elapsed < self.min_delay:
                await asyncio.sleep(self.min_delay - elapsed)
        self.last_request = datetime.now()
```

## Caching Implementation

- **Cache Duration:** 24 hours minimum
- **Cache Store:** PostgreSQL database with timestamp
- **Cache Invalidation:** Manual or after 24 hours
- **No cache busting:** Will not bypass cache with query parameters

## User-Agent

```
User-Agent: SurvivorFantasyApp/1.0 (Non-commercial; contact@example.com)
```

## Error Handling

- **429 Too Many Requests:** Exponential backoff, max 3 retries
- **404 Not Found:** Log and skip, no retries
- **500 Server Error:** Wait 60 seconds, max 2 retries
- **Connection Errors:** Fail gracefully, notify admin

## Monitoring

- Log all API requests with timestamps
- Track error rates
- Monitor response times
- Alert on rate limit hits

## Data Storage

- Cached in PostgreSQL database
- Not redistributed via API
- Not sold or licensed to third parties
- Only displayed within our application UI

## Attribution

All pages displaying Survivor data will include:

```html
<div class="attribution">
  Data sourced from <a href="https://survivor.fandom.com">Survivor Wiki</a>
  (Fandom). Last updated: [TIMESTAMP]
</div>
```
```

---

## Follow-Up Timeline

1. **Day 1:** Send initial email to `[email protected]`
2. **Day 3:** Send follow-up to `Community@Fandom.com` if no response
3. **Day 7:** Contact Survivor Wiki admins via wiki
4. **Day 14:** Send polite follow-up email
5. **Day 21:** Consider alternative data sources

---

## If Permission is Denied

### Alternative Options:

1. **Manual Data Entry**
   - Create admin panel for weekly updates
   - Hire volunteer contributors from Survivor fan community
   - Set up simple CSV import

2. **Partner with Survivor Wiki**
   - Offer to contribute improvements to wiki
   - Propose official partnership/integration
   - Offer revenue sharing if app monetizes

3. **Use Historical Data Only**
   - Stick with doehm/survivoR dataset
   - Only support past seasons
   - Wait for current season to complete

4. **Community Sourcing**
   - Allow users to submit contestant updates
   - Implement voting/verification system
   - Crowdsource data accuracy

5. **Wait for Official CBS API**
   - Monitor for official Survivor data sources
   - Partner with CBS/Paramount if possible

---

## Legal Considerations

### Before Requesting Permission:

- [ ] Register a business entity (if monetizing)
- [ ] Create privacy policy
- [ ] Create terms of service
- [ ] Obtain liability insurance (if high traffic expected)
- [ ] Consult with a lawyer if handling user data

### After Receiving Permission:

- [ ] Save permission email/letter
- [ ] Document all agreed-upon terms
- [ ] Implement required attribution
- [ ] Set up monitoring for compliance
- [ ] Schedule periodic compliance reviews

---

## Quick Checklist

Before sending permission request:

- [ ] Fill in all [YOUR-X] placeholders in email template
- [ ] Attach technical specification document
- [ ] Prepare attribution mockups/screenshots
- [ ] Set up professional email address
- [ ] Create project landing page or GitHub repo
- [ ] Draft privacy policy and terms of service
- [ ] Test scraper to ensure it works as described
- [ ] Document rate limiting implementation
- [ ] Prepare to answer questions about monetization plans
- [ ] Have backup plan if permission is denied

---

## Sample Response Scenarios

### If Approved:
1. Thank them promptly
2. Request written confirmation
3. Ask about any specific requirements
4. Implement exactly as described
5. Send confirmation when live
6. Provide regular updates on usage

### If Denied:
1. Thank them for consideration
2. Ask if there are conditions under which approval would be possible
3. Request feedback on concerns
4. Pivot to alternative data sources
5. Maintain relationship for future opportunities

### If No Response After 30 Days:
1. Assume permission is not granted
2. Use alternative data sources
3. Document your attempt to obtain permission
4. Revisit request in 6-12 months

---

## Success Tips

1. **Be Professional:** Use business email, proper grammar, clear formatting
2. **Be Specific:** Exactly what you need, how often, for what purpose
3. **Be Transparent:** Honest about monetization, user numbers, use case
4. **Be Respectful:** Acknowledge their rules, commit to compliance
5. **Be Patient:** Corporate responses can take 2-4 weeks
6. **Be Flexible:** Open to their terms and modifications
7. **Show Value:** Explain how this benefits Fandom and Survivor community

---

## Additional Resources

- **Fandom Developer Wiki:** https://dev.fandom.com/
- **MediaWiki API Docs:** https://www.mediawiki.org/wiki/API:Main_page
- **Survivor Wiki Community:** https://survivor.fandom.com/wiki/Survivor_Wiki:Community_Portal

---

**Good luck with your permission request! Remember: it's always better to ask for permission than to beg for forgiveness when it comes to Terms of Service.**
