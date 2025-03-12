import { getDbInstance } from './connect';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';

export async function exportAllTablesToCSV(): Promise<void> {
    const db = await getDbInstance();
    const tables = ['transactions', 'match_rules', 'advanced_rules'];
    const exportDir = path.join(process.cwd(), 'exports', dayjs().format('YYYYMMDD-HHmm'));

    // 创建导出目录
    if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
    }

    for (const table of tables) {
        await exportTableToCSV(db, table, exportDir);
    }
}

async function exportTableToCSV(db: any, tableName: string, exportDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM ${tableName}`, (err: Error, rows: any[]) => {
            if (err) {
                reject(err);
                return;
            }

            if (!rows.length) {
                resolve();
                return;
            }

            // 获取列名
            const columns = Object.keys(rows[0]);
            
            // 创建 CSV 内容
            const csvContent = [
                // 添加表头
                columns.join(','),
                // 添加数据行
                ...rows.map(row => 
                    columns.map(col => {
                        const value = row[col];
                        // 处理特殊字符
                        if (typeof value === 'string') {
                            return `"${value.replace(/"/g, '""')}"`;
                        }
                        return value;
                    }).join(',')
                )
            ].join('\n');

            // 写入文件
            const filePath = path.join(exportDir, `${tableName}.csv`);
            fs.writeFileSync(filePath, csvContent, 'utf-8');
            resolve();
        });
    });
} 