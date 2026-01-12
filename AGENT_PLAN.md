# Agent Implementation Plan: Multi-Area Quiz Support

## Phase 1: Sequential Question Order Option 
- [X] If sequential is selected, it must apply to all quiz modes (all, sections, questions) and be respected everywhere.

### Implementation Plan
- Refactor QuizApp logic so sequential order is always respected for all quiz modes.
- Ensure localStorage persistence and UI restoration after reload.
- Update Playwright tests if needed.

## Phase 3

- [x] Shorten status line for mobile: Update the quiz status line to be shorter and fit on mobile screens.

## Phase 4

- [x] Change 'Empezar quiz' label to 'Empezar': Update the button label from 'Empezar quiz' to 'Empezar' throughout the app. Ensure changes also in tests.
- [x] Remove 'Cambiar área' button from question view: Remove the 'Cambiar área' button from the question view to improve mobile layout. Now only present in the status/options page.
- [x] Rename 'Ver Estado' button to 'Options': Change the label of the 'Ver Estado' button to 'Options', reflecting its expanded functionality (restart, change area, etc.). All UI and Playwright tests updated accordingly.
- [x] Refactor localStorage to support multiple areas (quizStatusByArea)
- [x] Update quiz progress tracking to work per area
- [x] Ensure resume functionality works across different areas
- [x] Add buttons in status page to the bottom and to the top. Currently only at the bottom, and the page may be too long on mobile.
- [x] Remove the options button  from the status page, as it is the Options page now.
- [x] Add a button to Cambiar área at the bottom of the menu, becuase Volve a empezar is confusing, as it  may mean restart the area or change area.
- [x] Add the name "Área: " to every place we are showing it, so that user becomes familiar with the concept. 🎓 Lógica I becomes 🎓 Área: Lógica I
- [X] Test switching between areas without losing progress

## Phase 7: Documentation and Versioning
- [X] Update version history page with new feature description
- [X] Bump package.json version to 1.3.0
  
## Future <===============================================================================================================  #NEW#
- Remove console.log
- Package the application with webpack or similar for production deployment
- Separate application from files for better organization and ease of maintenance

## Playwright Test Execution Best Practices

- Always run Playwright tests with `--reporter=list` for clear output and easier cancellation.
- Set Playwright test timeout to 5 seconds for fast feedback. (See playwright.config.ts: `timeout: 3000`)
- Example: `npx playwright test tests/area-navigation.spec.ts --project=chromium --reporter=list`
- If a test run hangs, use Ctrl+C to cancel, then re-run with the correct reporter flag.

## Ongoing Process & Test Discipline

- Always add new feature suggestions to AGENT_PLAN before implementation
- Always write or update Playwright tests before implementing new features (TDD)
- Always update AGENT_PLAN after completing a feature or test
- Make all Playwright tests pass: Review and fix all failing Playwright E2E tests, focusing on area switching, persistence, and sequential order logic. Update code or tests as needed until all tests pass.
