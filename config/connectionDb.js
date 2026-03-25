const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

let dbInstance = null;

async function getDb() {
    if (dbInstance) return dbInstance;

    dbInstance = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    })

    // Create tables if they do not exist
    await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        category TEXT,
        time TEXT,
        cookTime TEXT,
        servings TEXT,
        coverImage TEXT,
        createdBy INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(createdBy) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_recipes_search ON recipes(title, ingredients, category);
  `);

    // Ensure columns exist in case table was created before this update
    try {
        await dbInstance.exec(`ALTER TABLE recipes ADD COLUMN category TEXT`);
    } catch (e) { }
    try {
        await dbInstance.exec(`ALTER TABLE recipes ADD COLUMN cookTime TEXT`);
    } catch (e) { }
    try {
        await dbInstance.exec(`ALTER TABLE recipes ADD COLUMN servings TEXT`);
    } catch (e) { }

    return dbInstance;
}

module.exports = getDb;