# AI Prompt Logging

## 📝 AI Usage Summary
- **Did AI help you solve any problems? If so, how?**
Yes, AI helped me understand the tasks and also break down tasks into step by step implementation. It also helped me identify all the requirements in one go rather than me spending time on researching, analysing and defining the requirements, which would have taken more time.
- **What parts were 100% human-driven?**
Code Reviews, GIT commands
- **Did AI generate incorrect/misleading answers? How did you correct them?**
Yes, AI generated few inccorect tests, but when I asked it to correct it, and add more tests, it did that successfully. Also, I think the right way to use AI is not by giving it too many instructions at the same time, because then there will be too much code to review in one go and also there might be a possibility of AI not handling all aspects of every feature completely and correctly. So, I prefer dividing a task into sub tasks(with AI's help) and then asking AI to help develop those sub-tasks one by one. It helps me focus on one sub-task at a time, and code review is more accurate and quick.
- **Which AI-powered IDE tools did you use? (e.g., GitHub Copilot, Cursor, ChatGPT in VS Code, etc.)**
I used Cursor AI IDE and Claude.

---

## 📜 AI Prompts Used
**- Prompt 1:**
First I used Claude to understand the tasks and what all requirements I need to keep in mind while completing these tasks.
Prompt: "Can you please analyse the below mentioned tasks and suggest the requirements and Step by Step Implementation Plan?" 
+ I copy pasted the tasks mentioned in Github readme file.
Claude gave me a list of requirements and also a step by step implementation plan.

***
**- Prompt 2:**
I then shared Task 1 - "Javascript/TypeScript Performance Task" requirements (from readme) and suggestions from Claude regarding requirements and implementation of Task 1, and asked cursor AI to verify the suggestions given by Claude and then implement the changes required for the Task 1.
Prompt: "Here is the Task: <Copy Paste Task 1 requirements from Readme>.
Here is the suggestion from Claude: <Copy Paste Task 1 suggestions by Claude>.
Can you please check and verify the solution suggested by Claude and implement it?"

Cursor confirmed that the solution suggested by Claude looked good and addressed the key requirements. And it implemented the solution in the file.
- Deduplication of users: used a Map with email as key to store unique users
- Parallel processing of API calls in batches: Instead of making sequential API calls, now it is collecting all users that need enrichment and processes them in batcked of 100 (BATCH_SIZE), and uses Promise.all to make parallel API calls within each batch.
- Efficient error handling: Uses temporary keys for users without emails. and updating the map when emails are enriched. Also, handles edge cases where users might not be found.
- Memory optimization using Map: Better than Array searches. Only stores unique users and processes data in batches to prevent memory overload.

I was happy with the solution and accepted the changes.

***
**- Prompt 3:**
"I want you to test it with some sample data"
Cursor created a test file test-processor.js

Then I ran the test file and the results were good. Here are the results:

1- Performance: The solution processed 1000 users in just 0.001 seconds, which is very efficient.

2- Deduplication:
- Input size: 1000 users
- Output size: 667 users
- This shows that about 1/3 of the users were duplicates (as expected from our test data generation)

3- Email Enrichment:
- 134 users had missing emails initially
- All 667 users in the final result have valid emails
- All emails follow the expected format (ending with '@email.com')

4- Data Integrity:
- The number of unique emails (667) matches the output size, confirming proper deduplication
- The sample output shows correctly formatted user objects

The test demonstrates that our optimized solution successfully:
- Handles large datasets efficiently
- Properly deduplicates users
- Enriches missing email data
- Maintains data integrity

***
**- Prompt 4:**
I shared Task 2 - "Express.js Rate Limiter Middleware" requirements (from readme) and suggestions from Claude regarding requirements and implementation of Task 2, and asked cursor AI to verify the suggestions given by Claude and then implement the changes required for the Task 2.
Prompt: "Here is the Task: <Copy Paste Task 2 requirements from Readme>.
Here is the suggestion from Claude: <Copy Paste Task 2 suggestions by Claude>.
Can you please check and verify the solution suggested by Claude and implement it?"

Cursor confirmed that the solution suggested by Claude looked good and addressed the key requirements. And it implemented the solution in the rate-limiter.js file. The new solution:
- Uses sliding window algorithm for more accurate rate limiting
- Provides better error messages and headers
- Uses Map for better performance
- Includes retry-after information
- Adds rate limit headers

Also, cursor created test-rate-limiter.js file for testing the solution.

After reviewing the changes done by Cursor, I accepted the changes.


***
**- Prompt 5:**
The test cases didn't run successfully because of missing express and node-fetch dependencies. So, installed the required dependencies:
npm init -y && npm install express node-fetch

Then I asked Cursor " Please modify the tests to use the correct import for fetch."

There was still an issue with test execution, because of wrong handling of fetch import and insufficient error handling.

***
**- Prompt 6:** "Please fix fetch import handling and error handling in the tests."
I ran the tests again:

The tests ran successfully. Here are the test results:
1- Test 1: Basic Rate Limiting (tenant1)
- Successfully made 5 requests
- Each request decreased the remaining limit
- Headers showed correct limits (100 total, decreasing remaining)
- All requests succeeded (200 status)

2- Test 2: Rate Limit Exceeded (tenant2)
- First 100 requests succeeded (200 status)
- Remaining count decreased from 99 to 0
- Requests 101-105 were rejected (429 status)
- Error message included retry information
- Proper rate limit exceeded message

3- Test 3: Different Tenants (tenant3)
- 5 requests for tenant3 succeeded
- Independent limit from other tenants
- Started with fresh 100 limit
- Proper headers and counts

4- Test 4: Missing Tenant ID
- Correctly rejected with 400 status
- Clear error message about missing tenant ID
- Proper validation message

***
**- Prompt 7:**
"Please add more test cases for concurrent requests, sliding window behaviour and burst handling(rapid bursts of multiple requests)."

Cusror made more changes to the test file. and the tests ran successsfully.

***
**- Prompt 8:**
I wanted to make sure that all tests are now working fine, so, I asked cursor: "Can you please run all 7 tests once again?"
Cursor ran all tests successfully:

Test 1: Basic Rate Limiting
- All 5 requests successful
- Rate limit counter decreased correctly (99 → 95)
- No rate limiting occurred

Test 2: Rate Limit Exceeded
- First 100 requests successful
- Requests 101-105 properly rate limited
- Correct error messages with retry information
- Counter decreased from 99 → 0 correctly

Test 3: Different Tenants
- All 5 requests successful
- Independent limit from other tenants (started at 99)
- No rate limiting occurred

Test 4: Missing Tenant ID
- Request properly rejected
- Clear error message provided
- Proper validation message

Test 5: Concurrent Requests
- All 50 concurrent requests successful
- Rate limit counter decreased consistently
- No race conditions observed
- Proper handling of simultaneous requests

Test 6: Sliding Window Behavior
- Batch 1: All 40 requests successful
- Batch 2: All 40 requests successful
- Batch 3: First 20 requests successful, then rate limited
- Window properly slid between batches
- Rate limit properly enforced across window

Test 7: Burst Handling
First Burst:
- All 60 requests successful
- Counter decreased from 99 → 40
Second Burst (1 second later):
- First 40 requests successful
- Remaining 20 properly rate limited
- Proper error messages with retry information


****
**- Prompt 9:**
I shared Task 3 - "Vue.js Drag and Drop Component" requirements (from readme) and suggestions from Claude regarding requirements and implementation of Task 2, and asked cursor AI to verify the suggestions given by Claude and then implement the changes required for the Task 2.
Prompt: "Here is the Task: <Copy Paste Task 3 requirements from Readme>.
Here is the suggestion from Claude: <Copy Paste Task 3 suggestions by Claude>.
Can you please check and verify the solution suggested by Claude and implement it?"

Cursor verified the suggestion by Claude and implemented the changes.
Here's a summary of the enhancements:
1- Improved UI/UX:
- Added a proper page builder layout with component panel and preview area
- Included icons for each component type
- Added visual feedback during drag operations
- Implemented empty state messaging
- Added hover effects and transitions

2- Enhanced Functionality:
- Added precise positioning of components using x,y coordinates
- Implemented the ability to move existing components
- Added component removal functionality
- Added a new Image component type
- Improved drag and drop handling with proper event handling

3- Better Component Rendering:
- Created a dedicated ComponentRenderer component
- Added proper styling for each component type
- Implemented proper component controls (remove button)

4- Improved Styling:
- Added scoped styles to prevent CSS conflicts
- Implemented a modern, clean design
- Added proper spacing and layout
- Included hover states and transitions
- Added proper shadows and borders



