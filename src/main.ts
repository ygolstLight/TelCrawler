// For more information, see https://crawlee.dev/
import { PlaywrightCrawler } from 'crawlee';

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
    // Use the requestHandler to process each of the crawled pages.
    async requestHandler({ request, page, log }) {
        const title = await page.title();
        log.info(`Title of ${request.loadedUrl} is '${title}'`);

        // Save results as JSON to ./storage/datasets/default
        // await pushData({ title, url: request.loadedUrl });\

        const selectorResult = await page.textContent(
            "body > main > div > section > div:nth-child(21) > div.tgme_widget_message.text_not_supported_wrap.js-widget_message > div.tgme_widget_message_bubble"
        )

        console.dir(selectorResult, { "depth": null })

        // Extract links from the current page
        // and add them to the crawling queue.
        // await enqueueLinks();
    },
    // Uncomment this option to see the browser window.
    // headless: false,
});

// Add first URL to the queue and start the crawl.
await crawler.run(['https://t.me/s/gazaalannet']);
