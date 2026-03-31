# DANZA Onboarding Questionnaire

Tony Danza asks these questions when initializing a new project. Record every answer in `.danza/onboarding-answers.md`. This becomes the project's source of truth.

This questionnaire EVOLVES. When agents encounter gaps during development, new questions get added under "Evolved Questions" at the end.

---

## How to Run Onboarding

1. Ask each question one section at a time
2. Wait for the user to answer before moving on
3. Clarify vague answers — push for specifics
4. After all sections, ask: **"Have we covered everything?"**
5. If they say no, keep asking until they say yes
6. Ask one final time: **"Is there ANYTHING else I should know?"**
7. Record all answers to `.danza/onboarding-answers.md`

---

## Section 1: The Idea

1. **What does your app do?** (One sentence — the elevator pitch)
2. **Who is the target user?** (Be specific — age, role, problem they have)
3. **What is the ONE core action a user takes in this app?** (The single most important thing they DO)
4. **What problem does this solve for them?**
5. **Is this a new project or do you have existing code?**
6. **If existing code — where is the repo?** (GitHub URL or local path)

## Section 2: Features

7. **List every major feature the app needs.** (Brain dump — we'll organize later)
8. **What are all the pages or screens?** (List every one)
9. **Does the app need user accounts?** (If yes: email/password? OAuth? Magic link? Social login?)
10. **Does the app need payments?** (If yes: one-time? subscription? marketplace? What prices?)
11. **Does the app connect to external services?** (List every API, platform, or service)
12. **Does the app need real-time features?** (Chat, live updates, notifications, WebSockets?)
13. **Does the app store user-generated content?** (Files, images, audio, video? Where stored?)
14. **Does the app need an admin panel?**
15. **What are the user roles?** (Just users? Users + admins? Multiple tiers? Different permissions?)
16. **Are there any scheduled/automated jobs?** (Daily tasks, cron jobs, background processing?)

## Section 3: Technical Preferences

17. **Do you have a preferred tech stack?** (Frontend framework, backend language, database? Or should we recommend?)
18. **Do you have cloud accounts set up?** (AWS, Vercel, GCP, Heroku, etc. — list what's ready)
19. **What AI environments do you have access to?** (Claude Code, Gemini CLI, Grok, ChatGPT, Cursor, etc.)
20. **Do you have a domain name?**
21. **Mobile app, web app, or both?**
22. **Any specific hosting requirements?** (Serverless, VPS, specific provider, cost constraints?)

## Section 4: Design

23. **Describe the visual style you want.** (Dark, light, minimal, bold, corporate, playful, luxury, brutalist, etc.)
24. **Any specific colors, fonts, or brand guidelines?**
25. **Any apps or websites you want it to look/feel like?** (References help enormously)
26. **Responsive? Desktop-first or mobile-first?**

## Section 5: Constraints & Priorities

27. **Any technologies you explicitly DON'T want?** (e.g., "no PHP", "no Firebase")
28. **Any features you explicitly DON'T want?** (e.g., "no social login", "no dark mode")
29. **What's your budget for infrastructure?** (Free tier only? $50/mo? Unlimited?)
30. **What's the timeline?** (When do you need this working? MVP date?)
31. **What's the #1 priority?** (Speed to launch? Code quality? Scalability? Design polish?)

## Section 6: Final Confirmation

32. **Have we covered everything?** (Keep asking until YES)
33. **Is there ANYTHING else I should know?** (Last chance)

---

## After Onboarding

1. Organize all features into a logical build order
2. Group related features into compartments
3. Create the complete feature list in `.danza/feature-list.md`
4. If existing project: run Spaghetti for full codebase scan
5. Present the feature list and build plan to the user for approval
6. Begin the first 2-feature cycle

---

## Evolved Questions
(Agents add new questions here when they discover onboarding gaps during development. Include the date and what triggered the addition.)

[This section grows over time as the system learns]
