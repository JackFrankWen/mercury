import {  ipcMain} from "electron";
import { getAllMatchRules, addMatchRule, updateMatchRule, deleteMatchRule } from "../sqlite3/match-rules";


export function handleMatchRules(){

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
            return {code: 200}
        } catch (error) {
            console.error('Error adding match rule:', error);
            throw error;
            return {code: 500, error: error}
        }
    });

    ipcMain.handle('match-rules:update', async (event, id, rule) => {
        try {
            await updateMatchRule(id, rule);
            return {code: 200}
        } catch (error) {
            console.error('Error updating match rule:', error);
            throw error;
            return {code: 500, error: error}

        }
    });

    ipcMain.handle('match-rules:delete', async (event, id) => {
        try {
            await deleteMatchRule(id);
            return {code: 200}
        } catch (error) {
            console.error('Error deleting match rule:', error);
            throw error;
            return {code: 500, error: error}

        }
    });
}
