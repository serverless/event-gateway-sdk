/* eslint-disable node/no-unsupported-features */

// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const puppeteer = require('puppeteer')
const path = require('path')

const command = `
const eventGateway = new EventGateway({
  url: 'http://localhost',
})
`

let browser
let page

beforeEach(async () => {
  browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  page = await browser.newPage()
})

afterEach(() => {
  browser.close()
})

test('instantiate the event gateway', async () => {
  expect.assertions(1)
  const htmlPath = path.join(__dirname, 'index.html')
  const url = `file://${htmlPath}`
  await page.goto(url)
  // if this command succeeds the SDK is available on window
  await page.evaluate(command)
  expect(true).toBe(true)
})
