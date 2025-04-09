# AI Prompt Logging

## 📝 AI Usage Summary
- **Did AI help you solve any problems? If so, how?**
- **What parts were 100% human-driven?**
- **Did AI generate incorrect/misleading answers? How did you correct them?**
- **Which AI-powered IDE tools did you use? (e.g., GitHub Copilot, Cursor, ChatGPT in VS Code, etc.)**
I used Cursor AI IDE and Claude.

---

## 📜 AI Prompts Used
- Prompt 1:
First I used Claude to understand the tasks and what all requirements I need to keep in mind while completing these tasks.
Prompt: "Can you please analyse the below mentioned tasks and suggest the requirements and Step by Step Implementation Plan?" 
+ I copy pasted the tasks mentioned in Github readme file.
Claude gave me a list of requirements and also a step by step implementation plan.

***
- Prompt 2:
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
- Prompt 3:
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


- ...
