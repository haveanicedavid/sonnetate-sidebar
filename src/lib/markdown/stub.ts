export const MARKDOWN_STUB = `# [[Testing Guide]]

This document outlines the steps and components required to thoroughly test the application.

## [[Installation]]

Follow these steps to install the application:

1. Clone the repository
2. Navigate to the project directory
3. Run \`npm install\` to install dependencies

## [[Features to Test/slash|alias]]

### [[User Authentication]]

1. **Sign Up**:
    - Verify that a new user can create an account with valid credentials.
    - Ensure that appropriate error messages are shown for invalid input.

2. **Login**:
    - Test login functionality with valid credentials.
    - Verify that incorrect credentials show proper error messages.

3. **Password Reset**:
    - Check the process for resetting the password.
    - Ensure that the reset link is sent to the user's email.

### User Interface

#### Navigation Bar

- Ensure all links in the navigation bar are working.
- Check the responsiveness of the navigation bar on different devices.

#### Home Page

- Verify that the home page loads correctly.
- Ensure that all elements are aligned properly.
- Test the responsiveness of the home page.

### Performance

- Load Testing:
    - Simulate multiple users accessing the app simultaneously.
    - Measure the response time of the app.

- Stress Testing:
    - Increase the load to find the breaking point of the app.
    - Verify the app's behavior under extreme conditions.

## Bug Tracking

- Create a detailed report of any bugs found.
- Use the following format for reporting bugs:

\`\`\`markdown

### Bug Report

**Description**: A brief description of the bug.

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Result**: What you expected to happen.
**Actual Result**: What actually happened.

**Screenshot**: Attach a screenshot if applicable.
\`\`\``
