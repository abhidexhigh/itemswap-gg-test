import cache from "../../../src/utils/cache";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check cache first
  const cachedTweets = cache.get("tweets");
  if (cachedTweets) {
    return res.status(200).json({ tweets: cachedTweets });
  }

  let browser;
  try {
    let launchOptions;
    let puppeteerModule;

    if (process.env.NODE_ENV === "production") {
      // In production, use chrome-aws-lambda with puppeteer-core
      const chrome = await import("chrome-aws-lambda");
      puppeteerModule = (await import("puppeteer-core")).default;
      launchOptions = {
        args: chrome.args,
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      };
    } else {
      // In development, use full puppeteer
      puppeteerModule = (await import("puppeteer")).default;
      launchOptions = {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--disable-gpu",
          "--window-size=1920x1080",
        ],
      };
    }

    browser = await puppeteerModule.launch(launchOptions);
    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    // Set viewport dimensions
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to the target page
    await page.goto("https://nitter.net/abhishekmishr54", {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait for tweets to load
    await page.waitForSelector(".timeline-item", {
      timeout: 10000,
      visible: true,
    });

    // Extract the last 3 tweets
    const tweets = await page.evaluate(() => {
      const tweetElements = document.querySelectorAll(".timeline-item");
      const tweetTexts = [];

      for (let i = 0; i < Math.min(3, tweetElements.length); i++) {
        const tweet = tweetElements[i];
        const textElement = tweet.querySelector(".tweet-content");
        if (textElement) {
          const textNodes = Array.from(textElement.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim())
            .filter((text) => text.length > 0);

          const elementTexts = Array.from(
            textElement.querySelectorAll("span, p, div")
          )
            .map((el) => el.textContent.trim())
            .filter((text) => text.length > 0);

          const allText = Array.from(new Set([...textNodes, ...elementTexts]))
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();

          tweetTexts.push(allText);
        }
      }

      return tweetTexts;
    });

    if (tweets.length === 0) {
      throw new Error("No tweets found.");
    }

    // Cache the tweets before returning
    cache.set("tweets", tweets);

    return res.status(200).json({ tweets });
  } catch (error) {
    console.error("Error scraping tweets:", error);
    return res.status(500).json({
      error: "Failed to fetch tweets",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
