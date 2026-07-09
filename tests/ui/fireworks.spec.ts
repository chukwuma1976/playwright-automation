import { test, expect } from '@playwright/test';
import { Fireworks } from 'fireworks-js'

test.describe("Playing with Fireworks", () => {
    test('Happy 4th of July!', async ({ page }) => {

        await page.setContent(`
        <html>
        <body style="
            margin:0;
            background:black;
            overflow:hidden;
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;">
            <div id="message"
                style="
                color:white;
                font-size:48px;
                font-family:Arial;">
                Happy 4th of July!
            </div>
        </body>
        </html>
    `);

        await expect(page.locator("#message"))
            .toBeVisible();

        await page.evaluate(() => {
            const fireworks = ["✨", "💥"]
            for (let i = 0; i < 40; i++) {
                const firework = document.createElement("div");
                firework.textContent = fireworks[Math.floor(Math.random() * fireworks.length)];
                firework.style.position = "absolute";
                firework.style.left = `${Math.random() * 95}%`;
                firework.style.top = `${Math.random() * 95}%`;
                firework.style.fontSize = `${30 + Math.random() * 40}px`;
                document.body.appendChild(firework);
            }
        });

        await expect(page.locator("text=✨").or(page.locator("text=💥")))
            .toHaveCount(40);

    });

    test('Fireworks on the 4th of July!', async ({ page }) => {
        await page.setContent(`
        <html>
        <body style="
            margin:0;
            background:black;
            overflow:hidden;
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;">
            <div id="message"
                style="
                color:white;
                font-size:48px;
                font-family:Arial;">
                Happy 4th of July!
            </div>
            <!-- jsDelivr  -->
            <script src="https://cdn.jsdelivr.net/npm/fireworks-js@2.x/dist/index.umd.js"></script>
        </body>
        </html>
    `);

        await page.evaluate(() => {
            const container = document.createElement("div");
            container.style.position = "fixed";
            container.style.top = "0";
            container.style.left = "0";
            container.style.width = "100vw";
            container.style.height = "100vh";
            document.body.appendChild(container);

            // @ts-ignore
            const fireworks = new window.Fireworks.default(container, {
                autoresize: true,
                opacity: 0.5,
                acceleration: 1.05,
                friction: 0.97,
                gravity: 1.5,
                particles: 120,
                explosion: 8,
            });

            fireworks.start();
        });

        await page.waitForTimeout(10000); // Wait for fireworks to display for 5 seconds

    })
})

