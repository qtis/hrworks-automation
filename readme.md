
# Playwright:

```
1. npm i -g @playwright
2. npx playwright install
3. ADD environment variables of HRWORKS_USERNAME and HRWORKS_PASS (or change log-work.test.js to hardcode)
```

Usage (run):
```
npx playwright test
```

# Puppeteer (if playwright is flaky):

```
1. npm i puppeteer
2. ADD environment variables of HRWORKS_USERNAME and HRWORKS_PASS (or change log-work.test.js to hardcode)
```

Usage (run):
```
npm run log-with-puppet
```