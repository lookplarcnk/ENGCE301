const mysql = require('mysql2/promise'); // ใช้ mysql2/promise แทน mysql
const env = process.env.NODE_ENV || 'development';
const config = require('../dbconfig.js')[env];

async function getMovieList() {
    const pool = await mysql.createPool(config);

    try {
        const [rows] = await pool.query('SELECT * FROM movies');
        if (rows.length > 0) {
            return rows;
        } else {
            return {
                statusCode: 404,
                returnCode: 11,
                message: 'No movie found',
            };
        }
    } catch (error) {
        throw error;
    } finally {
        await pool.end(); // ปิดการเชื่อมต่อหลังจากเสร็จสิ้น
    }
}

async function getMovieSearch(search_text) {
    const pool = await mysql.createPool(config);

    try {
        const [rows] = await pool.query('SELECT * FROM movies WHERE title LIKE ?', [`%${search_text}%`]);
        if (rows.length > 0) {
            return {
                statusCode: 200,
                returnCode: 1,
                data: rows,
            };
        } else {
            return {
                statusCode: 404,
                returnCode: 11,
                message: 'No movie found',
            };
        }
    } catch (error) {
        throw error;
    } finally {
        await pool.end(); // ปิดการเชื่อมต่อหลังจากเสร็จสิ้น
    }
}

async function postMovie(title, genre, director, release_year) {
    const pool = await mysql.createPool(config);

    try {
        const post = { title, genre, director, release_year };
        const [result] = await pool.query('INSERT INTO movies SET ?', post);
        return {
            statusCode: 200,
            returnCode: 1,
            message: 'Movie was inserted',
        };
    } catch (error) {
        throw error;
    } finally {
        await pool.end(); // ปิดการเชื่อมต่อหลังจากเสร็จสิ้น
    }
}

async function insertMovie(title, genre, director, release_year) {
    const pool = await mysql.createPool(config);

    try {
        const [result] = await pool.query('INSERT INTO movies SET ?', movieData);
        return {
            statusCode: 200,
            returnCode: 1,
            message: 'Movie was inserted',
            data: result,
        };
    } catch (error) {
        throw error;
    } finally {
        await pool.end(); // ปิดการเชื่อมต่อหลังจากเสร็จสิ้น
    }
}

async function deleteMovie(delete_movie) {
    const pool = await mysql.createPool(config); // สร้าง pool ใหม่ทุกครั้ง

    try {
        const query = 'DELETE FROM movies WHERE title LIKE ?'; // ใช้ placeholder เพื่อป้องกัน SQL Injection
        const [result] = await pool.query(query, [`%${delete_movie}%`]); // ใช้ query กับ parameterized value

        if (result.affectedRows > 0) {
            return {
                statusCode: 200,
                returnCode: 1,
                message: 'Movie was deleted',
                affectedRows: result.affectedRows,
            };
        } else {
            return {
                statusCode: 404,
                returnCode: 11,
                message: 'No movie found with the given title',
            };
        }
    } catch (error) {
        console.error('Error occurred in deleteMovie function:', error); // บันทึกข้อผิดพลาด
        throw error;
    } finally {
        await pool.end(); // ปิดการเชื่อมต่อหลังจากเสร็จสิ้น
    }
}



module.exports.MovieRepo = {
    getMovieList: getMovieList,
    getMovieSearch: getMovieSearch,
    postMovie: postMovie,
    deleteMovie: deleteMovie,
};
