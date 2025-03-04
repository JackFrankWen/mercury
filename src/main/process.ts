import { ipcMain } from "electron";
import {
    getAllMatchRules,
    addMatchRule,
    updateMatchRule,
    deleteMatchRule,
} from "./sqlite3/match-rules";
import {
    getAllTransactions,
    deleteTransactions,
    updateTransactions,
    batchInsertTransactions, 
    getCategoryTotal,
    insertTransaction,
    getTransactionsByMonth,
    getConsumerTotal,
    getAccountPaymentTotal
} from "./sqlite3/transactions";
import { transferCategory, sortByValue } from "./controller/transController";
import { generateRule } from "./controller/matchAutoRulesController";
import { batchInsertAutoRule, getAllMatchAutoRules, deleteMatchAutoRule } from "./sqlite3/match-auto-rules";


export function handleProcessApi() {

    // Match rules API handlers
    ipcMain.handle('match-rules:getAll', async () => {
        try {
            const rules = await getAllMatchRules();
            return rules;
        } catch (error) {
            console.error('Error getting match rules:', error);
            throw error;
        }
    });

    ipcMain.handle('match-rules:add', async (event, rule) => {
        try {
            await addMatchRule(rule);
            return { code: 200 }
        } catch (error) {
            console.error('Error adding match rule:', error);
            return { code: 500, error: error }
            throw error;
        }
    });

    ipcMain.handle('match-rules:update', async (event, id, rule) => {
        try {
            await updateMatchRule(id, rule);
            return { code: 200 }
        } catch (error) {
            console.error('Error updating match rule:', error);
            throw error;
            return { code: 500, error: error }

        }
    });

    ipcMain.handle('match-rules:delete', async (event, id) => {
        try {
            await deleteMatchRule(id);
            return { code: 200 }
        } catch (error) {
            console.error('Error deleting match rule:', error);
            throw error;
            return { code: 500, error: error }

        }
    });

    ipcMain.handle('transactions:getAll', async (event, params) => {
        try {
            const transactions = await getAllTransactions(params);
            return transactions;
        } catch (error) {
            console.error('Error getting transactions:', error);
            throw error;
        }
    });

    ipcMain.handle('transactions:delete', async (event, ids) => {
        try {
            await deleteTransactions(ids);
            return { code: 200 }
        } catch (error) {
            console.error('Error deleting transactions:', error);
            throw error;
        }
    });

    ipcMain.handle('transactions:update', async (event, ids, params) => {
        try {
            await updateTransactions(ids, params);
            return { code: 200 }
        } catch (error) {
            console.error('Error updating transactions:', error);
            throw error;
        }
    });

    ipcMain.handle('transactions:batchInsert', async (event, list) => {
        try {
            await batchInsertTransactions(list);
            return { code: 200 }
        } catch (error) {
            console.error('Error batch inserting transactions:', error);
            throw error;
        }
    });

    ipcMain.handle('transactions:getCategoryTotalByDate', async (event, params) => {
        try {
            const result = await getCategoryTotal(params);
            return sortByValue(transferCategory(result));
        } catch (error) {
            console.error('Error getting category total by date:', error);
            throw error;
        }
    });

    ipcMain.handle('transactions:insert', async (event, transaction) => {
        try {
            await insertTransaction(transaction);
            return { code: 200 };
        } catch (error) {
            console.error('Error inserting transaction:', error);
            return { code: 500, error: error.message };
        }
    });

    ipcMain.handle('match-rules:generate', async (event, params) => {
        try {
            const result = await generateRule(params);
            return result;
        } catch (error) {
            console.error('Error generating rule:', error);
            throw error;
        }
    });

    ipcMain.handle('match-rules:batchInsertAuto', async (event, list) => {
        try {
            await batchInsertAutoRule(list);
            return { code: 200 }
        } catch (error) {
            console.error('Error batch inserting auto rules:', error);
            throw error;
        }
    });

    ipcMain.handle('match-rules:getAllAuto', async () => {
        try {
            const rules = await getAllMatchAutoRules();
            return rules;
        } catch (error) {
            console.error('Error getting match rules:', error);
            throw error;
        }
    });

    ipcMain.handle('match-rules:deleteAuto', async (event, id) => {
        try {
            await deleteMatchAutoRule(id);
            return { code: 200 }
        } catch (error) {
            console.error('Error deleting auto rules:', error);
            throw error;
        }
    });

    ipcMain.handle('transactions:getTransactionsByMonth', async (event, param) => {
        
        try {
            const result = await getTransactionsByMonth(param);
            return result;
        } catch (error) {
            console.error('Error getting transactions by month:', error);
            throw error;
        }
    });

    ipcMain.handle('transactions:getConsumerTotal', async (event, params) => {
        try {
            const result = await getConsumerTotal(params);
            return result;
        } catch (error) {
            console.error('Error getting consumer total:', error);
            throw error;
        }
    });

    ipcMain.handle('transactions:getAccountPaymentTotal', async (event, params) => {
        try {
            const result = await getAccountPaymentTotal(params);
            return result;
        } catch (error) {
            console.error('Error getting account payment total:', error);
            throw error;
        }
    }); 
}

