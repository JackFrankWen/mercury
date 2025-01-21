import sqlite3 from 'sqlite3';

// 1. 打开数据库连接
async function connectToDB() {
    const db = new sqlite3.Database('./database.sqlite');

    console.log('成功连接到 SQLite 数据库');
    return db;
}

// 2. 执行查询或操作
async function executeQuery() {
    const db = await connectToDB();

    try {
        const rows = await db.all('SELECT * FROM your_table'); // 替换为实际表名
        rows.forEach((row) => {
            console.log(row);
        });
    } catch (err) {
        console.error('查询错误: ', err.message);
    } finally {
        // 3. 关闭数据库连接
        await db.close();
        console.log('成功关闭数据库连接');
    }
}
interface MercuryEnv {
    db: any;
    connectToDB(): Promise<void>;
    executeQuery(): Promise<void>;
    closeDB(): Promise<void>;
}
class MercuryEnv {
    constructor() {
        this.db = null;

    }
    connectToDB = async () => {
        this.db = await open({
            filename: './database.sqlite',
            driver: sqlite3.Database
        });
        console.log('成功连接到 SQLite 数据库');
    }
    executeQuery = async () => {
        try {
            const rows = await this.db.all('SELECT * FROM your_table');
            rows.forEach((row) => {
                console.log(row);
            });
        } catch (err) {
            console.error('查询错误: ', err.message);
        }

    }
    closeDB = async () => {
        await this.db.close();
        console.log('成功关闭数据库连接');
    }

}