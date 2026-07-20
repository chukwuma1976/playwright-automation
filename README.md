# Playwright Automation Framework

An enterprise-style automation framework built with **Playwright + TypeScript** demonstrating modern QA automation practices including UI, API, Integration, Performance, Accessibility, Visual Regression, and CI/CD automation.

---

# Tech Stack

- Playwright
- TypeScript
- Node.js
- REST API Testing
- GraphQL Testing
- GitHub Actions
- k6
- Artillery
- Playwright Snapshot Testing
- Axe Accessibility Testing

---

# Framework Features

## UI Automation

- Cross-browser automation
- Page Object Model
- Fixtures
- Parallel execution
- Multi-page testing
- File Upload / Download
- iFrames
- Shadow DOM
- Drag and Drop
- Alerts / Popups
- Hover interactions
- Service Workers
- WebSockets
- Network interception
- Mock APIs
- Authentication workflows

---

## API Automation

Over **130 API tests** covering multiple public and demo APIs.

Includes:

- REST APIs
- GraphQL
- JWT Authentication
- CRUD Operations
- Status Code Validation
- JSONPlaceholder
- Restful Booker
- Pet Store API
- Practice Automation APIs

---

## Integration Testing

End-to-end integration scenarios including:

- API → UI workflows
- API-created data validated in UI
- User CRUD validation
- Task creation through APIs
- Full business workflow validation

---

## Performance Testing

### k6

- Smoke Testing
- Load Testing
- Spike Testing

### Artillery

- Load simulation
- API performance validation

---

## Accessibility Testing

Automated accessibility validation using:

- Axe

---

## Visual Regression Testing

Visual comparison testing using:

- Playwright Screenshots
- Applitools

---

## CI/CD

GitHub Actions pipeline includes:

- Automated test execution
- Parallel test execution
- Test sharding
- HTML reports
- Failure screenshots
- Artifact publishing

---

## Parallel Execution

Framework supports:

- Playwright Sharding
- Multi-worker execution
- Browser isolation
- Parallel API execution

---

# Project Structure

```
tests/
│
├── api/
│   ├── REST APIs
│   ├── GraphQL
│   ├── JWT Authentication
│   ├── CRUD
│   └── Status Code Validation
│
├── integration/
│   ├── API + UI Integration
│   ├── CRUD Workflows
│   └── End-to-End Business Scenarios
│
├── performance/
│   ├── k6
│   └── Artillery
│
├── ui/
│   ├── Playwright Feature Tests
│   ├── Network Interception
│   ├── Shadow DOM
│   ├── WebSockets
│   ├── Service Workers
│   ├── Accessibility
│   └── Authentication
│
└── visual/
    ├── Applitools
    ├── Playwright
    ├── Canvas
```

---

# Sample Metrics

Current Framework Size

- **283 automated tests**
- **139 API tests**
- UI, API, Integration, Performance, Accessibility, and Visual Regression coverage

Recent CI Results

- **279 Passed**
- **1 Failed**
- **3 Flaky**
- **5 Intentionally Skipped**

Execution Time (GitHub Actions with Sharding)

- **~5 minutes**

---

# Goals

This project is intended to demonstrate production-ready automation practices including:

- Maintainable Page Object Model
- API-first testing strategy
- End-to-End Integration Testing
- CI/CD Automation
- Parallel Execution
- Performance Testing
- Accessibility Testing
- Visual Regression Testing
- Modern Playwright capabilities

                GitHub Actions
                       │
        ┌──────────────┼──────────────┐
        │              │              │
      UI Tests     API Tests    Performance
        │              │              │
        └─────── Integration Tests ───┘
                       │
              Accessibility Tests
                       │
             Visual Regression Tests
