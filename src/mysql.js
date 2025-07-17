const melovart = require('mysql2/promise');
require('dotenv').config();

const mysql = melovart.createPool({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USERNAME,
	database: process.env.DATABASE_NAME,
	password: "", //process.env.DATABASE_PASSWORD,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

mysql.getConnection()
	.then(conn => {
		console.log('[MYSQL] Successfully Connected');
		conn.release();
	})
	.catch(err => {
		console.error('[MYSQL] Connection Failed: ', err);
	})

module.exports = mysql;