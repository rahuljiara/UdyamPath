# UdyamPath Backend REST API Documentation

**Base URL**: `http://localhost:5000/api`  
**Authentication**: `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Health & Status
### `GET /api/health`
- **Auth**: Public
- **Response**:
```json
{
  "success": true,
  "message": "UdyamPath API is running",
  "timestamp": "2025-03-10T12:00:00.000Z"
}
```

---

## 2. Authentication & Authorization
### `POST /api/auth/register`
- **Auth**: Public
- **Body**:
```json
{
  "name": "Prof. Ramesh K. Verma",
  "email": "tpo@college.edu.in",
  "password": "password123",
  "role": "TPO"
}
```
- **Response (201)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65e...",
      "name": "Prof. Ramesh K. Verma",
      "email": "tpo@college.edu.in",
      "role": "TPO"
    },
    "token": "eyJhbGciOi..."
  },
  "message": "User registered successfully"
}
```

### `POST /api/auth/login`
- **Auth**: Public
- **Body**:
```json
{
  "email": "tpo.director@college.edu.in",
  "password": "password123"
}
```
- **Response (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65e...",
      "name": "Dr. Rahul Deshmukh",
      "email": "tpo.director@college.edu.in",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOi..."
  },
  "message": "Login successful"
}
```

### `GET /api/auth/me`
- **Auth**: Bearer Token (Any authenticated user)
- **Response (200)**: Current user profile object without password.

---

## 3. Students
### `GET /api/students`
- **Auth**: Bearer Token (`ADMIN`, `TPO`, `HOD`)
- **Query Parameters**: `?page=1&limit=10&search=Rahul&department=CSE&batch=2021-2025&status=Placed`
- **Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "65e...",
      "studentId": "2021CSE084",
      "firstName": "Rahul",
      "lastName": "Sharma",
      "fullName": "Rahul Sharma",
      "email": "rahul.sharma21@college.edu.in",
      "department": "Computer Science & Engineering",
      "deptCode": "CSE",
      "course": "B.Tech",
      "batch": "2021-2025",
      "semester": 8,
      "cgpa": 8.92,
      "backlogs": 0,
      "skills": ["React.js", "Node.js", "MongoDB"],
      "placementStatus": "Placed",
      "placedCompany": "Microsoft India",
      "placedPackage": "44.0 LPA"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 10,
    "totalPages": 1
  }
}
```

### `GET /api/students/stats`
- **Auth**: Bearer Token (`ADMIN`, `TPO`, `HOD`)
- **Response (200)**:
```json
{
  "success": true,
  "data": {
    "total": 10,
    "placed": 6,
    "eligible": 9,
    "avgCgpa": "8.09",
    "placementRate": "60.0%"
  }
}
```

### `GET /api/students/:id`
- **Auth**: Bearer Token (Admin, TPO, HOD for dept, Student for own record)

### `POST /api/students`
- **Auth**: Bearer Token (`ADMIN`, `TPO`, `HOD`)
- **Body**: Complete student profile JSON.

### `PUT /api/students/:id`
- **Auth**: Bearer Token (`ADMIN`, `TPO`, `HOD`, or Student for own non-protected fields)

### `DELETE /api/students/:id`
- **Auth**: Bearer Token (`ADMIN`, `TPO`)

---

## 4. Companies
### `GET /api/companies`
- **Query Parameters**: `?page=1&limit=9&search=Microsoft&industry=Technology&status=Active`
- **Response (200)**: Paginated company list.

### `GET /api/companies/stats`
- **Response (200)**: `{ totalCompanies, activeCompanies, totalHires, activeDrivesCount }`

### `POST /api/companies`
- **Auth**: Bearer Token (`ADMIN`, `TPO`)

---

## 5. Placement Drives
### `GET /api/drives`
- **Query Parameters**: `?page=1&limit=8&search=Backend&status=Open&company=Microsoft`

### `POST /api/drives`
- **Auth**: Bearer Token (`ADMIN`, `TPO`, `RECRUITER`)
- **Body**:
```json
{
  "title": "Software Development Engineer - 1",
  "companyName": "Microsoft India",
  "ctc": "44.0 LPA",
  "applicationDeadline": "2025-03-25T23:59:59Z",
  "eligibility": {
    "minCgpa": 8.0,
    "maxBacklogs": 0,
    "departments": ["CSE", "IT"]
  }
}
```

### `POST /api/drives/:id/apply`
- **Auth**: Bearer Token (`STUDENT`)
- **Enforces**:
  - Verification that drive is Open
  - Verification that deadline has not passed
  - Verification that student meets CGPA, backlogs, and department criteria
  - Compound unique prevention of duplicate applications

---

## 6. Applications
### `GET /api/applications`
- **Auth**: Bearer Token (Role-scoped)
- **Query Parameters**: `?status=Shortlisted&stage=Technical Interview&page=1`

### `PUT /api/applications/:id/status`
- **Auth**: Bearer Token (`ADMIN`, `TPO`, `RECRUITER`)
- **Body**: `{ "status": "Shortlisted", "notes": "Cleared OA" }`

### `PUT /api/applications/:id/stage`
- **Auth**: Bearer Token (`ADMIN`, `TPO`, `RECRUITER`)
- **Body**: `{ "currentStage": "Technical Interview" }`

### `PUT /api/applications/:id/withdraw`
- **Auth**: Bearer Token (`STUDENT`)

---

## 7. Interviews & Offers
### `GET /api/interviews`, `POST /api/interviews`, `PUT /api/interviews/:id`
- Calendar-friendly interview scheduling with virtual meeting links and feedback.

### `GET /api/offers`, `POST /api/offers`, `PUT /api/offers/:id`
- When `status` is updated to `"Accepted"`, the student's `placementStatus` is automatically updated to `"Placed"` and a confirmed `Placement` record is created.

---

## 8. Analytics & Reports
### `GET /api/analytics/overview`
- Returns institute-wide placement rate, average CTC, highest CTC, and participation metrics.

### `GET /api/analytics/departments`
- Returns department-by-department enrolled vs placed and placement rates.

### `GET /api/reports/data`
- Query: `?reportType=summary|unplaced|company|department&department=CSE&batch=2021-2025&minCgpa=7.0`
- Returns formatted headers and tabular rows ready for PDF/Excel exports.
