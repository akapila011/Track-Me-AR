import mongodb from 'mongodb'
import mongoose from 'mongoose';
import {makeUsersDb} from "./users-db";
import {makeUsersTempDb} from "./users-temp-db";

const MongoClient = mongodb.MongoClient
const url = process.env.DB_URL
const dbName = process.env.DB_NAME
const client = new MongoClient(url, { useNewUrlParser: true })

export async function makeDb () {
    if (!client.isConnected()) {
        await client.connect()
    }
    return client.db(dbName)
}

export const usersDb = makeUsersDb({makeDb});
export const usersTempDb = makeUsersTempDb({makeDb});

