import puppeteer from './node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'
import { existsSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const OUT_DIR = './temporary screenshots'

const url    = process.argv[2] || 'http://localhost:5173'
const label  = process.argv[3] || ''
const scroll = parseInt(process.argv[4] || '0')   // scroll % (0-100)

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const existing = readdirSync(OUT_DIR).map(f => {
  const m = f.match(/^screenshot-(\d+)/)
  return m ? parseInt(m[1]) : 0
})
const next = existing.length ? Math.max(...existing) + 1 : 1
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`
const outPath = join(OUT_DIR, filename)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
})

const page = await browser.newPage()
page.on('console', msg => {
  if (msg.type() === 'error' || msg.text().includes('warn') || msg.text().includes('font') || msg.text().includes('Font')) {
    console.log(`[PAGE ${msg.type()}]`, msg.text())
  }
})
page.on('pageerror', err => console.log('[PAGE ERROR]', err.message))
await page.setViewport({ width: 1440, height: 900 })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise(r => setTimeout(r, 7000))  // wait for WebGL + CDN fonts

if (scroll > 0) {
  await page.evaluate((pct) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo(0, max * pct / 100)
  }, scroll)
  await new Promise(r => setTimeout(r, 1500))
}

await page.screenshot({ path: outPath, fullPage: false })
await browser.close()
console.log(`Saved: ${outPath}`)
