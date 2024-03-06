import redis from "redis"

//Create a Redis client
const client = redis.createClient();

/**
 * 
 * @param {string} key 
 * @param {any} value 
 * @param {number} expiryInSec
 * 
 * @returns {Promise<void>} 
 */

export async function setEx(key, value, expiryInSec){
    return new Promise((resolve, reject) => {
        client.setEx(key, expiryInSec, JSON.stringify(value), (err, reply) => {
            if(err){
                reject(err);
            }else{
                resolve();
            }
        });
    });
}