# 📡 API Reference

Complete documentation for all backend API endpoints.

---

## 🔗 Base URL

**Development:** `http://localhost:5000/api`  
**Production:** `https://your-backend-domain.com/api`

---

## 🔐 Authentication

### Google OAuth Login

**Endpoint:** `GET /auth/google`

Redirects to Google OAuth consent screen.

**Usage:**
```javascript
window.location.href = `${API_URL}/auth/google`;
```

**Success Response:**
- Redirects to: `/?token=JWT_TOKEN`
- Store token in localStorage

### Google OAuth Callback

**Endpoint:** `GET /auth/google/callback`

Automatically called by Google after authentication.

### Logout

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## 🏠 Home Section

### Get Home Data

**Endpoint:** `GET /home`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "heroTitle": "Welcome to Asian Responsible Enterprise",
  "heroDescription": "Leading sustainable development...",
  "heroImage": "data:image/jpeg;base64,/9j/4AAQ...",
  "sdgHighlights": [
    {
      "id": 1,
      "title": "No Poverty",
      "description": "End poverty in all its forms..."
    }
  ],
  "statistics": {
    "projectsCompleted": 150,
    "peopleImpacted": 10000,
    "partnersWorldwide": 50
  },
  "updatedAt": "2024-12-14T10:30:00.000Z"
}
```

### Update Home Data

**Endpoint:** `PUT /home`

**Request Body:**
```json
{
  "heroTitle": "New Title",
  "heroDescription": "New description...",
  "heroImage": "base64_string_or_url",
  "sdgHighlights": [/* array */]
}
```

**Response:**
```json
{
  "message": "Home data updated successfully",
  "data": {/* updated object */}
}
```

---

## 🏆 Awards Section

### Get All Awards

**Endpoint:** `GET /awards`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Best Sustainability Initiative 2024",
    "organization": "UN Global Compact",
    "year": 2024,
    "description": "Awarded for outstanding...",
    "image": "url_or_base64",
    "category": "Environment",
    "createdAt": "2024-12-14T10:30:00.000Z"
  }
]
```

### Get Single Award

**Endpoint:** `GET /awards/:id`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Award Title",
  /* ... */
}
```

### Create Award

**Endpoint:** `POST /awards`

**Request Body:**
```json
{
  "title": "Award Title",
  "organization": "Organization Name",
  "year": 2024,
  "description": "Description...",
  "image": "url_or_base64",
  "category": "Environment"
}
```

**Response:**
```json
{
  "message": "Award created successfully",
  "data": {/* created award */}
}
```

### Update Award

**Endpoint:** `PUT /awards/:id`

**Request Body:** Same as Create

**Response:**
```json
{
  "message": "Award updated successfully",
  "data": {/* updated award */}
}
```

### Delete Award

**Endpoint:** `DELETE /awards/:id`

**Response:**
```json
{
  "message": "Award deleted successfully"
}
```

---

## 🎯 Mission Section

### Get Mission Data

**Endpoint:** `GET /mission`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "vision": "Our vision statement...",
  "mission": "Our mission statement...",
  "values": [
    {
      "id": "1",
      "title": "Integrity",
      "description": "We uphold the highest standards..."
    }
  ],
  "approach": "Our approach to sustainability...",
  "images": {
    "main": "url_or_base64",
    "gallery": ["url1", "url2", "url3"]
  }
}
```

### Update Mission Data

**Endpoint:** `PUT /mission`

**Request Body:**
```json
{
  "vision": "Updated vision...",
  "mission": "Updated mission...",
  "values": [/* array */],
  "approach": "Updated approach...",
  "images": {/* object */}
}
```

**Response:**
```json
{
  "message": "Mission data updated successfully",
  "data": {/* updated object */}
}
```

---

## 📰 News Section

### Get All News Articles

**Endpoint:** `GET /news`

**Query Parameters:**
- `limit` (optional): Number of articles (default: 50)
- `offset` (optional): Skip articles (default: 0)
- `category` (optional): Filter by category
- `tag` (optional): Filter by tag

**Example:** `GET /news?category=Environment&limit=10`

**Response:**
```json
{
  "total": 50,
  "articles": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Inspiring Sustainability Story",
      "content": "Full article content...",
      "excerpt": "Short excerpt...",
      "image": "url_or_base64",
      "video": "cloudinary_url",
      "author": "John Doe",
      "date": "2024-12-14",
      "category": "Environment",
      "tags": ["sustainability", "climate"],
      "featured": false,
      "views": 1250,
      "createdAt": "2024-12-14T10:30:00.000Z",
      "updatedAt": "2024-12-14T15:45:00.000Z"
    }
  ]
}
```

### Get Single News Article

**Endpoint:** `GET /news/:id`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Article Title",
  /* full article data */
}
```

### Create News Article

**Endpoint:** `POST /news`

**Request Body:**
```json
{
  "title": "Article Title",
  "content": "Full article content...",
  "excerpt": "Short excerpt...",
  "image": "url_or_base64",
  "video": "cloudinary_url (optional)",
  "author": "Author Name",
  "date": "2024-12-14",
  "category": "Environment",
  "tags": ["tag1", "tag2"],
  "featured": false
}
```

**Response:**
```json
{
  "message": "News article created successfully",
  "data": {/* created article */}
}
```

### Update News Article

**Endpoint:** `PUT /news/:id`

**Request Body:** Same as Create

**Response:**
```json
{
  "message": "News article updated successfully",
  "data": {/* updated article */}
}
```

### Delete News Article

**Endpoint:** `DELETE /news/:id`

**Response:**
```json
{
  "message": "News article deleted successfully"
}
```

### Increment Views

**Endpoint:** `POST /news/:id/view`

Increments the view counter for analytics.

**Response:**
```json
{
  "views": 1251
}
```

---

## 📅 Events Section

### Get All Events

**Endpoint:** `GET /events`

**Query Parameters:**
- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)
- `category` (optional): Filter by category
- `upcoming` (optional): Only future events (true/false)

**Example:** `GET /events?upcoming=true&category=Workshop`

**Response:**
```json
{
  "total": 25,
  "events": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Annual Sustainability Summit",
      "description": "Join us for...",
      "date": "2024-12-20T09:00:00.000Z",
      "endDate": "2024-12-20T17:00:00.000Z",
      "location": "Singapore Convention Centre",
      "address": "1 Raffles Boulevard...",
      "image": "url_or_base64",
      "gallery": ["url1", "url2", "url3"],
      "category": "Conference",
      "registrationLink": "https://register.example.com",
      "capacity": 500,
      "registered": 342,
      "organizer": "ARE Team",
      "contact": "events@are.org",
      "agenda": [
        {
          "time": "09:00",
          "title": "Opening Ceremony",
          "speaker": "CEO Name"
        }
      ]
    }
  ]
}
```

### Get Single Event

**Endpoint:** `GET /events/:id`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  /* full event data */
}
```

### Create Event

**Endpoint:** `POST /events`

**Request Body:**
```json
{
  "title": "Event Title",
  "description": "Event description...",
  "date": "2024-12-20T09:00:00.000Z",
  "endDate": "2024-12-20T17:00:00.000Z",
  "location": "Venue Name",
  "address": "Full address...",
  "image": "url_or_base64",
  "gallery": ["url1", "url2"],
  "category": "Conference",
  "registrationLink": "https://...",
  "capacity": 500,
  "organizer": "Organizer Name",
  "contact": "email@example.com"
}
```

**Response:**
```json
{
  "message": "Event created successfully",
  "data": {/* created event */}
}
```

### Update Event

**Endpoint:** `PUT /events/:id`

**Request Body:** Same as Create

**Response:**
```json
{
  "message": "Event updated successfully",
  "data": {/* updated event */}
}
```

### Delete Event

**Endpoint:** `DELETE /events/:id`

**Response:**
```json
{
  "message": "Event deleted successfully"
}
```

### Register for Event

**Endpoint:** `POST /events/:id/register`

**Request Body:**
```json
{
  "name": "Participant Name",
  "email": "participant@example.com",
  "phone": "+65 1234 5678",
  "organization": "Company Name (optional)"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "confirmationCode": "ABC123XYZ"
}
```

---

## 📚 Publications Section

### Get All Publications

**Endpoint:** `GET /publications`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 6)
- `category` (optional): Filter by category
- `year` (optional): Filter by year

**Example:** `GET /publications?category=Report&year=2024`

**Response:**
```json
{
  "total": 50,
  "page": 1,
  "totalPages": 9,
  "publications": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Sustainability Report 2024",
      "description": "Comprehensive report on...",
      "cover": "url_or_base64",
      "category": "Report",
      "year": 2024,
      "author": "ARE Research Team",
      "pages": 150,
      "language": "English",
      "isbn": "978-XXX-XXX-XXX-X",
      "downloadUrl": "url_to_pdf",
      "featured": true,
      "downloads": 5432,
      "publishedDate": "2024-01-15"
    }
  ]
}
```

### Get Single Publication

**Endpoint:** `GET /publications/:id`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  /* full publication data */
}
```

### Create Publication

**Endpoint:** `POST /publications`

**Request Body:**
```json
{
  "title": "Publication Title",
  "description": "Description...",
  "cover": "url_or_base64",
  "category": "Report",
  "year": 2024,
  "author": "Author Name",
  "pages": 150,
  "language": "English",
  "isbn": "978-XXX-XXX-XXX-X",
  "downloadUrl": "url_to_pdf",
  "featured": false
}
```

**Response:**
```json
{
  "message": "Publication created successfully",
  "data": {/* created publication */}
}
```

### Update Publication

**Endpoint:** `PUT /publications/:id`

**Request Body:** Same as Create

**Response:**
```json
{
  "message": "Publication updated successfully",
  "data": {/* updated publication */}
}
```

### Delete Publication

**Endpoint:** `DELETE /publications/:id`

**Response:**
```json
{
  "message": "Publication deleted successfully"
}
```

### Increment Downloads

**Endpoint:** `POST /publications/:id/download`

Increments the download counter for analytics.

**Response:**
```json
{
  "downloads": 5433
}
```

---

## 👥 Community Section

### Get All Community Members

**Endpoint:** `GET /community`

**Query Parameters:**
- `type` (optional): Filter by type (member/partner/volunteer)
- `featured` (optional): Only featured members (true/false)

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "role": "Sustainability Consultant",
    "bio": "John has 15 years of experience...",
    "image": "url_or_base64",
    "email": "john@example.com",
    "linkedin": "https://linkedin.com/in/johndoe",
    "twitter": "https://twitter.com/johndoe",
    "type": "member",
    "featured": true,
    "joinedDate": "2020-01-15",
    "contributions": [
      {
        "title": "Led 5 sustainability workshops",
        "year": 2024
      }
    ]
  }
]
```

### Get Single Community Member

**Endpoint:** `GET /community/:id`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  /* full member data */
}
```

### Create Community Member

**Endpoint:** `POST /community`

**Request Body:**
```json
{
  "name": "Member Name",
  "role": "Role/Position",
  "bio": "Biography...",
  "image": "url_or_base64",
  "email": "email@example.com",
  "linkedin": "url (optional)",
  "twitter": "url (optional)",
  "type": "member",
  "featured": false
}
```

**Response:**
```json
{
  "message": "Community member created successfully",
  "data": {/* created member */}
}
```

### Update Community Member

**Endpoint:** `PUT /community/:id`

**Request Body:** Same as Create

**Response:**
```json
{
  "message": "Community member updated successfully",
  "data": {/* updated member */}
}
```

### Delete Community Member

**Endpoint:** `DELETE /community/:id`

**Response:**
```json
{
  "message": "Community member deleted successfully"
}
```

---

## 📞 Contact Section

### Get Contact Information

**Endpoint:** `GET /contact`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "organizationName": "Asian Responsible Enterprise",
  "email": "info@are.org",
  "phone": "+65 1234 5678",
  "address": {
    "street": "123 Main Street",
    "city": "Singapore",
    "state": "",
    "postalCode": "123456",
    "country": "Singapore"
  },
  "socials": {
    "facebook": "https://facebook.com/are",
    "twitter": "https://twitter.com/are",
    "linkedin": "https://linkedin.com/company/are",
    "instagram": "https://instagram.com/are"
  },
  "hours": {
    "weekdays": "9:00 AM - 6:00 PM",
    "weekends": "Closed"
  },
  "mapEmbedUrl": "https://maps.google.com/..."
}
```

### Update Contact Information

**Endpoint:** `PUT /contact`

**Request Body:**
```json
{
  "organizationName": "Updated Name",
  "email": "newemail@are.org",
  "phone": "+65 9876 5432",
  "address": {/* object */},
  "socials": {/* object */},
  "hours": {/* object */}
}
```

**Response:**
```json
{
  "message": "Contact information updated successfully",
  "data": {/* updated object */}
}
```

### Submit Contact Form

**Endpoint:** `POST /contact/submit`

**Request Body:**
```json
{
  "name": "Sender Name",
  "email": "sender@example.com",
  "subject": "Inquiry about...",
  "message": "Full message text...",
  "phone": "+65 1234 5678 (optional)"
}
```

**Response:**
```json
{
  "message": "Message sent successfully",
  "ticketId": "TICKET-123456"
}
```

---

## 🎨 Theme Section

### Get Theme Settings

**Endpoint:** `GET /theme`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "colors": {
    "primaryGold": "#fbbf24",
    "primaryYellow": "#fef3c7",
    "primaryBlue": "#3b82f6",
    "lightBlue": "#93c5fd",
    "primaryGreen": "#10b981",
    "darkGreen": "#047857"
  },
  "designMode": "playful",
  "defaultThemeMode": "light",
  "fonts": {
    "heading": "Inter",
    "body": "Inter"
  },
  "animations": {
    "particles": true,
    "cursorGlow": true,
    "pageTransitions": true
  }
}
```

### Update Theme Settings

**Endpoint:** `PUT /theme`

**Request Body:**
```json
{
  "colors": {/* color object */},
  "designMode": "corporate",
  "defaultThemeMode": "dark",
  "fonts": {/* font object */},
  "animations": {/* animations object */}
}
```

**Response:**
```json
{
  "message": "Theme updated successfully",
  "data": {/* updated theme */}
}
```

---

## 📤 File Upload

### Upload File

**Endpoint:** `POST /upload`

**Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData with:
- file: File object
- folder: "news" | "events" | "publications" | etc.
```

**Response:**
```json
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "sdg-website/news/abc123",
  "format": "jpg",
  "size": 1234567,
  "width": 1920,
  "height": 1080
}
```

**Size Limits:**
- Images: 10MB max
- Videos: 100MB max
- PDFs: 25MB max

### Upload Multiple Files

**Endpoint:** `POST /upload/multiple`

**Request Body:**
```
FormData with:
- files: Array of File objects
- folder: Target folder name
```

**Response:**
```json
{
  "files": [
    {
      "url": "https://...",
      "publicId": "...",
      "format": "jpg"
    }
  ]
}
```

---

## ❌ Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "details": "Detailed error information (optional)",
  "code": "ERROR_CODE"
}
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

---

## 🔒 Rate Limiting

**Limits:**
- 100 requests per 15 minutes per IP
- 1000 requests per hour per IP

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1639584000
```

**Exceeded Response:**
```json
{
  "error": "Too many requests",
  "retryAfter": 900
}
```

---

## 🧪 Testing Endpoints

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-14T10:30:00.000Z",
  "mongodb": "connected",
  "uptime": 123456
}
```

### Database Status

**Endpoint:** `GET /health/db`

**Response:**
```json
{
  "status": "connected",
  "collections": 10,
  "totalDocuments": 1523,
  "databaseSize": "45.2 MB"
}
```

---

## 📝 Usage Examples

### JavaScript/TypeScript

```typescript
const API_URL = 'https://your-backend.com/api';

// Get all news articles
const response = await fetch(`${API_URL}/news`);
const data = await response.json();

// Create news article
const response = await fetch(`${API_URL}/news`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'New Article',
    content: 'Article content...',
    /* ... */
  }),
});

// Upload file
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('folder', 'news');

const response = await fetch(`${API_URL}/upload`, {
  method: 'POST',
  body: formData,
});
```

### cURL

```bash
# Get all news
curl https://your-backend.com/api/news

# Create news article
curl -X POST https://your-backend.com/api/news \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Article",
    "content": "Content...",
    "author": "John Doe"
  }'

# Upload file
curl -X POST https://your-backend.com/api/upload \
  -F "file=@image.jpg" \
  -F "folder=news"
```

---

## 🔗 Webhooks (Future Enhancement)

Webhooks for real-time updates:

**Endpoint:** `POST /webhooks/register`

**Request:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["news.created", "event.updated"]
}
```

**Webhook Payload:**
```json
{
  "event": "news.created",
  "timestamp": "2024-12-14T10:30:00.000Z",
  "data": {/* created object */}
}
```

---

## 📊 API Statistics

Get API usage statistics:

**Endpoint:** `GET /stats` (Admin only)

**Response:**
```json
{
  "totalRequests": 123456,
  "requestsByEndpoint": {
    "/news": 45000,
    "/events": 30000
    /* ... */
  },
  "averageResponseTime": 45,
  "errorRate": 0.02
}
```

---

## 🎯 Best Practices

1. **Always handle errors:**
   ```typescript
   try {
     const data = await api.news.getAll();
   } catch (error) {
     console.error('Failed to load news:', error);
     // Show user-friendly message
   }
   ```

2. **Use pagination for large datasets:**
   ```typescript
   const data = await api.news.getAll({ limit: 20, offset: 0 });
   ```

3. **Validate data before sending:**
   ```typescript
   if (!title || !content) {
     throw new Error('Title and content are required');
   }
   ```

4. **Optimize images before uploading:**
   ```typescript
   // Compress to < 1MB for best performance
   ```

5. **Use appropriate HTTP methods:**
   - GET: Retrieve data
   - POST: Create new resources
   - PUT: Update existing resources
   - DELETE: Remove resources

---

## 🔐 Security Notes

- Always use HTTPS in production
- Store JWT tokens securely (httpOnly cookies)
- Validate all user input
- Rate limit requests
- Use CORS properly
- Keep dependencies updated
- Never expose API keys in frontend
- Use environment variables for secrets

---

**Last Updated:** December 14, 2024  
**API Version:** 1.0.0  
**Status:** Production Ready ✅
