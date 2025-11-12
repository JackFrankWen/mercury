import puppeteer from 'puppeteer'
import dayjs from 'dayjs'
import chalk from 'chalk'

let responseData = [];
let count = 0;
let hasMoreOrders = true;
async function getOrderData(page) {
    try {
        // 等待订单列表加载
        await page.waitForSelector('.deal-list-status-new');
        // 延迟2秒,确保数据完全加载
        await new Promise(resolve => setTimeout(resolve, 2000));
        // 打印加载完成提示
        console.log(chalk.blue('ℹ'), '订单列表加载完成');

        // 滚动到底部加载所有订单
        await scrollToBottom(page);
        // 提取并返回订单数据
        return await extractOrderData(page);
    } catch (error) {
        // 出错时打印错误信息并返回空数组
        console.error(chalk.red('✗'), chalk.red('获取订单数据失败:'), error);
        return [];
    }
}
/**
 * 滚动到页面底部直到加载完所有订单
 * @param {Page} page - Puppeteer页面实例
 */
async function scrollToBottom(page) {
    while (hasMoreOrders) {
        await page.evaluate(() => {
            window.scrollTo(0, document.documentElement.scrollHeight);
        });

        console.log(chalk.yellow('⟳'), '滚动加载中...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const isBottom = await page.evaluate(() => {
            const noMoreText = document.querySelector('.loading-text');
            return noMoreText && noMoreText.textContent.includes('您已经没有更多的订单了');
        });

        if (isBottom) {
            hasMoreOrders = false;
            console.log(chalk.green('✓'), '已到达底部，数据加载完成');
        }
    }
}

/**
 * 提取页面中的订单数据
 * @param {Page} page - Puppeteer页面实例
 * @returns {Promise<Array>} 订单数据数组
 */
async function extractOrderData(page) {
    return await page.evaluate(() => {
        const listElement = document.querySelector('.react-base-list');
        const orders = [];

        // 循环获取列表中的数据
        for (const item of listElement.children) {
            try {
                // 通过层级关系定位价格元素: 第4个div下的第2个div下的第2个p的内容
                const priceElement = item.children[2].children[1].querySelectorAll('p')[1];
                const statusElement = item.querySelector('p[data-test="订单状态"]');
                const nameElement = item.querySelector('span[data-test="商品名称"]');

                if (!statusElement || !nameElement) {
                    console.log('某些元素未找到，跳过此订单');
                    continue;
                }

                orders.push({
                    totalPrice: priceElement.textContent.trim().replace('¥', '') || '',
                    status: statusElement.textContent.trim(),
                    name: nameElement.textContent.trim()
                });
            } catch (error) {
                console.log('处理订单时出错:', error);
                continue;
            }
        }
        return orders;
    });
}

let browser
export async function crawlPDDOrders() {
    // 获取命令行参数
    const years = 1; // 默认获取1年的数据

    console.log(chalk.blue('ℹ'), chalk.blue(`准备获取最近 ${years} 年的订单数据`));

    try {

        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            devtools: true,
            executablePath: process.platform === 'darwin'
                ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
                : process.platform === 'win32'
                    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                    : '/usr/bin/google-chrome'
        });

        const page = await browser.newPage();

        // Improved request/response handling
        await page.setRequestInterception(true);
        page.on('request', request => request.continue());

        page.on('response', async response => {
            const url = response.url();
            if (url.includes('/proxy/api/api/aristotle/order_list_v4')) {
                try {
                    const responseBody = await response.json();
                    if (responseBody?.orders) {
                        count++;
                        console.log(chalk.blue(`获取第${count}页数据`));
                        // 获取最后一条数据的时间 格式为YYYY-MM-DD HH:mm:ss
                        const lastOrderTime = responseBody.orders[responseBody.orders.length - 1].order_time;
                        console.log(chalk.blue(`最后一条数据的时间: ${dayjs(lastOrderTime * 1000).format('YYYY-MM-DD HH:mm:ss')}`));
                        // 如果最后一条数据小于一年前
                        if (dayjs(lastOrderTime * 1000).isBefore(dayjs().subtract(1, 'year'))) {
                            console.log(chalk.blue('最后一条数据的时间小于一年前 停止爬取'));
                            hasMoreOrders = false;
                        }
                        responseData = responseData.concat(responseBody.orders);
                    }
                } catch (error) {
                    console.error('Failed to parse response:', error);
                }
            }
        });

        // Improved login handling with timeout
        await page.goto('https://mobile.yangkeduo.com/login.html');
        console.log(chalk.yellow('⚠'), chalk.yellow('请手动登录...'));

        await waitForLogin(page);
        console.log(chalk.green('✓'), chalk.green('登录成功'));

        try {
            // 等待页面跳转完成
            await page.waitForNavigation({
                waitUntil: 'domcontentloaded',
                timeout: 3000
            });
        } catch (error) {
            console.log('等待页面跳转完成失败');
        }

        console.log('加载完成');
        try {
            // promise.race 等待3秒
            await page.waitForSelector('.footer-items')
            await page.evaluate(() => {
                const footerItems = document.querySelectorAll('.footer-item');
                footerItems.forEach((item, index) => {
                    if (index === 4) { // 个人中心是第5个item
                        item.click();
                    }
                });
            });
        } catch (error) {
            console.log('没有找到.footer-items元素 个人中心');
        }


        // 检查是否有取消按钮 如果有则点击
        // try {
        //     const cancelBtn = await page.waitForSelector('.alert-goto-app-cancel', { timeout: 5000 });
        //     if (cancelBtn) {
        //         await cancelBtn.click();
        //     }
        // } catch (error) {
        //     console.log('没有找到取消按钮,继续执行...');
        // }

        // 检查是否成功跳转到订单页面，如果没有则重试点击
        let retryCount = 0;
        const maxRetries = 3;

        while (!page.url().includes('orders.html') && retryCount < maxRetries) {
            console.log(`尝试跳转到订单页面，第 ${retryCount + 1} 次`);
            try {
                await page.waitForSelector('.others');
                await page.evaluate(() => {
                    const othersElement = document.querySelector('.others');
                    if (othersElement) {
                        othersElement.click();
                    }
                });

            } catch (error) {
                console.log('点击全部订单按钮失败:', error.message);
            }
            retryCount++;
            // 短暂等待后再次尝试
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (!page.url().includes('orders.html')) {
            console.log('无法跳转到订单页面，请检查页面状态');
        } else {
            console.log('成功跳转到订单页面');
            // 等待页面加载完成
            try {
                await page.waitForNavigation({
                    waitUntil: 'domcontentloaded',
                    timeout: 5000
                });
            } catch (error) {
                console.log('orders.html加载失败');
            }
            // 写个方法 监控当前window中dom是否在变化
        }

        // Improved order data processing
        if (page.url().includes('orders.html')) {
            const rawData = await page.evaluate(() => window.rawData || {});
            const newOrders = rawData.ordersStore?.orders || [];


            const ordersList = newOrders.map(order => ({
                totalPrice: order.orderAmount.replace('¥', ''),
                status: order.orderStatusPrompt,
                name: order.orderGoods.map(goods => goods.goodsName).join(','),
                orderTime: order.orderTime ? dayjs(order.orderTime * 1000).format('YYYY-MM-DD HH:mm:ss') : '',
                orderId: order.trackingNumber
            }));


            const htmlOrders = await getOrderData(page);

            console.log(chalk.blue('ℹ'), `总订单数: ${htmlOrders.length}`);
            // responseData= responseData.filter(order => order.order_status_prompt.includes('交易成功'));
            responseData = responseData.map(order => {
                const orderGoods = order.order_goods || [];
                const orderTime = order.order_time ? dayjs(order.order_time * 1000).format('YYYY-MM-DD HH:mm:ss') : '';
                if (orderGoods.length > 0) {
                    const orderName = orderGoods.map(goods => goods.goods_name).join(',');
                    const orderId = orderGoods.map(goods => goods.goods_id).join(',');
                    const priceElement = htmlOrders.find(o => o.name === orderName);
                    return {
                        totalPrice: priceElement?.totalPrice.replace('¥', ''),
                        status: order.order_status_prompt,
                        name: orderName,
                        orderTime: orderTime,
                        orderId: orderId
                    };
                } else {
                    // Handle case where order_goods does not exist
                    return {
                        totalPrice: '0',
                        status: order.order_status_prompt,
                        name: 'No goods',
                        orderTime: orderTime,
                        orderId: ''
                    };
                }

            })
            // 过滤掉未发货，退款成功的订单
            responseData = responseData.filter(order =>
                !order.status.includes('拼单未成功')
            );

            // 根据年份过滤订单
            const startDate = dayjs().subtract(years, 'year').format('YYYY-MM-DD HH:mm:ss');
            const endDate = dayjs().format('YYYY-MM-DD HH:mm:ss');

            responseData = responseData.filter(order =>
                order.orderTime >= startDate &&
                order.orderTime <= endDate
            );

            console.log(chalk.blue('ℹ'), `过滤后的订单数: ${responseData.length}`);
            console.log(chalk.blue('ℹ'), `时间范围: ${startDate} 至 ${endDate}`);

            const finalData = [...ordersList, ...responseData];
            return finalData;
            // console.log(chalk.blue('ℹ'), `最终数据: ${finalData.length} 条`);
            // const csvContent = generateCSV(finalData);
            // const filePath = saveToCSV(csvContent);
            // console.log(chalk.green('✓'), `订单数据已保存到: ${filePath}`);
        }
    } catch (error) {
        console.error(chalk.red('✗'), chalk.red('爬取失败:'), error);
    } finally {
        if (browser) {
            await browser.close();
            console.log(chalk.green('✓'), '浏览器已关闭');
        }
    }
}

// Helper function for login waiting
async function waitForLogin(page, timeout = 300000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('Login timeout'));
        }, timeout);

        const checkLogin = async () => {
            if (!page.url().includes('login.html')) {
                clearTimeout(timer);
                resolve();
                return;
            }
            setTimeout(checkLogin, 1000);
        };

        checkLogin();
    });
}
