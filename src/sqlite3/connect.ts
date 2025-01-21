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
export function getConnection(): sqlite3.Database {
  const dbPath = path.join(__dirname, '../../data/database.db')
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Could not connect to database', err)
    } else {
      console.log('Connected to database')
    }
  })
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
