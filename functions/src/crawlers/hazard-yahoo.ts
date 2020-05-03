import { chromium } from 'playwright'
import { Region, blankRegion } from '../services/models/region'

const feedHazard = async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  const url: string = 'https://hazard.yahoo.co.jp/article/20200207'
  await page.goto(url)
  const mapSel = '#map .table .table__section div'
  const items = await page.$$(mapSel)
  let feedData: Region[] = []

  for await (const [index, item] of items.entries()) {
    const regionName = await item.$eval('dt', el => el.textContent)
    const todayValue = await item.$eval('dd', el => el.textContent)

    if (regionName && todayValue && index !== 0) {
      const todayNumber = parseInt(todayValue, 10) || 0
      feedData.push({
        ...blankRegion,
        id: index,
        name: regionName,
        todayInfection: todayNumber
      })
    }
  }

  await browser.close()

  return feedData
}

export default feedHazard