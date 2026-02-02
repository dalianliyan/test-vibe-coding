const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// 配置JSON解析，支持POST请求
app.use(express.json());

// 1. 连接SQLite数据库（项目目录生成demo.db文件，文件型数据库核心）
const db = new sqlite3.Database('./demo.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('成功连接SQLite数据库（demo.db）');
});

// 2. 初始化表（用户表），不存在则创建
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER
)`);

// 3. 编写接口（动态站核心，测试数据库读写）
// 查：获取所有用户
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ code: 200, data: rows });
  });
});

// 增：添加用户
app.post('/api/user', (req, res) => {
  const { name, age } = req.body;
  db.run(`INSERT INTO users (name, age) VALUES (?, ?)`, [name, age], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ code: 200, msg: '添加成功', id: this.lastID });
  });
});

// 测试静态页面（可选，证明同时支持接口+静态页）
app.get('/', (req, res) => {
  res.send('<h1>Node.js+SQLite动态站部署成功（GitHub Workspaces）</h1><p>测试接口：/api/users（GET）、/api/user（POST）</p>');
});

// 启动服务
app.listen(port, () => {
  console.log(`Node.js服务运行在端口${port}：http://localhost:${port}`);
});