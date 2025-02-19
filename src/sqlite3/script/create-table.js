/* eslint-disable */
const path = require('path');
const { createRuleTable, createTransactionTable, checkTableExists, db } = require('../import-table');
/* eslint-enable */

async function main() {
    try {
        // 检查并创建规则表
        const ruleTableExists = await checkTableExists('match_rules');
        if (!ruleTableExists) {
            await createRuleTable();
            console.log('规则表创建成功');
        } else {
            console.log('规则表已存在');
        }

        // 检查并创建交易表
        const transTableExists = await checkTableExists('transactions');
        if (!transTableExists) {
            await createTransactionTable();
            console.log('交易表创建成功');
        } else {
            console.log('交易表已存在');
        }

        console.log('所有表创建完成！');
    } catch (error) {
        console.error('创建表失败:', error);
        process.exit(1);
    } finally {
        db.close();
    }
}

main();
