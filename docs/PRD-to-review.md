# PRD Review

## 📝 Instructions
Review the following PRD and identify **3 critical issues**.

## Example PRD
### Feature: User Profile Management
1. Users should be able to update their name and email.
2. There is no authentication mechanism specified.
3. No mention of error handling.

## ✏️ Your Review

- Issue 1: Incomplete User Requirements
  The PRD only mentions updating name and email, but fails to define other critical aspects of profile management:
  - What other profile fields exist beyond name and email?
  - Are there validation requirements for email format and uniqueness?
  - Are there any restrictions on name formats (length, allowed characters, etc.)?
  - Does the system need to handle profile pictures, user preferences, privacy settings, etc.?
  - Is there any approval flow needed for changes (e.g., email verification)?

- Issue 2: Missing Technical Requirements and Implementation Details
  The PRD lacks critical technical specifications:
  - How should changes be persisted (database requirements)?
  - What API endpoints are needed for these operations?
  - Are there performance requirements (response time, concurrent users)?
  - What about data security and privacy compliance (GDPR, etc.)?
  - How should the feature integrate with existing systems?
  - What are the browser/device compatibility requirements?

- Issue 3: Lack of Success Metrics and Acceptance Criteria
  The PRD fails to define:
  - How will we measure the success of this feature?
  - What are the specific acceptance criteria for considering this feature complete?
  - What test cases should QA focus on?
  - Are there specific user journeys or flows that need to be supported?
  - What error states need to be handled and how should they be presented to users?
  - Is there a rollout strategy or phased approach for this feature?