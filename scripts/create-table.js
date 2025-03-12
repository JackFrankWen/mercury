/* eslint-disable */
const path = require('path');
const { createRuleTable, createTransactionTable, checkTableExists, db, createRuleAutoTable, createAdvancedRuleTable } = require('./utils/import-table');
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
        // 检查并创建高级规则表
        const advancedRuleTableExists = await checkTableExists('advanced_rules');
        if (!advancedRuleTableExists) {
            await createAdvancedRuleTable();
            console.log('高级规则表创建成功');
        } else {
            console.log('高级规则表已存在');
        }

        // 检查并创建交易表
        const transTableExists = await checkTableExists('transactions');
        if (!transTableExists) {
            await createTransactionTable();
            console.log('交易表创建成功');
        } else {
            console.log('交易表已存在');
        }
        // 检查规则表是否存在
        const autoRuleTableExists = await checkTableExists('match_rules_auto');
        if (!autoRuleTableExists) {
            await createRuleAutoTable();
            console.log('自动规则表创建成功');
        } else {
            console.log('自动规则表已存在');
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
