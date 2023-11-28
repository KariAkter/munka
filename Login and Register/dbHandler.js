const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Volt',
}).promise()

async function getUserByName(name){
    try {
        const [result] = await pool.query('SELECT * FROM user_info WHERE username LIKE ?', [name])
        return result[0]
        
    } catch (error) {
        console.log(error);
    }
}

async function getUserById(id){
    try {
        const [result] = await pool.query('SELECT * FROM user_info WHERE id LIKE ?', [id])
        return result[0]
        
    } catch (error) {
        console.log(error);
    }
}

async function addUser(username, email, pwd)
{
    try {
        const [result] = await pool.query('INSERT INTO user_info (username, email, pwd) VALUES (?, ?, ?);', [username, email, pwd])
        return result[0]
        
    } catch (error) {
        console.log(error);
    }
}

async function getLeaderboard()
{
    try {
        const [result] = await pool.query('SELECT user_info.username, highscores.highscore_value FROM user_info JOIN highscores ON user_info.id = highscores.user_id ORDER BY highscores.highscore_value DESC;')
        return result
    } catch (error) {
        console.log(error)
    }
}

//test
async function addToLeaderboard(id, value)
{
    try {
        const [result] = await pool.query('INSERT INTO highscores (user_id, highscore_value) VALUES (?, ?)',[id, value])
        return result
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getUserByName,
    getUserById,
    addUser,
    getLeaderboard,
    addToLeaderboard
}
