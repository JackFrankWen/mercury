import sqlite3 from 'sqlite3'
import path from 'path'

/**
 * SQLite数据库连接工具类
 * 
 * 使用示例:
 * ```typescript
 * // 获取数据库连接
 * const db = getConnection()
 * 
 * // 执行查询
 * db.all("SELECT * FROM rules", (err, rows) => {
 *   if(err) console.error(err)
 *   console.log(rows)
 * })
 * 
 * // 执行更新
 * db.run("UPDATE rules SET tag = ? WHERE id = ?", ['tag1', 1], (err) => {
 *   if(err) console.error(err)
 * })
 * ```
 */
export async function getConnection(): Promise<sqlite3.Database> {
  const dbPath = path.join(__dirname, '../../data/database.db')
  
  // 使用同步方式创建数据库连接
  try {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Could not connect to database:', err.message)
        throw err
      }
      console.log('Connected to database successfully')
    })

    // 启用外键约束
    db.run('PRAGMA foreign_keys = ON')
    
    // 设置繁忙超时时间为5000ms
    db.configure('busyTimeout', 5000)

    return db
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}
let dbInstance: sqlite3.Database | null = null;

/**
 * 获取数据库单例连接
 * 如果连接不存在则创建新连接,否则返回已存在的连接
 */
export async function getDbInstance(): Promise<sqlite3.Database> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await getConnection();
  return dbInstance;
}



/**
 * 关闭数据库连接
 * @param db 数据库连接实例
 * 
 * 使用示例:
 * ```typescript
 * const db = getConnection()
 * // ... 执行数据库操作 ...
 * closeConnection(db)
 * ```
 */
export function closeConnection(db: sqlite3.Database): void {
  db.close((err) => {
    if (err) {
      console.error('Error closing database', err)
    } else {
      console.log('Database connection closed')
    }
  })
}
