import { MongoClient, Db } from 'mongodb';

let db: Db | null = null;

// Database connection function
export const connect = async (mongoUrl: string): Promise<void> => {
    try {
        const client: MongoClient = new MongoClient(mongoUrl);
        await client.connect();
        db = client.db(); // Assign the connected database to the 'db' variable
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
    return;
};


export const getDb = (): Db => {
    if (!db) { throw new Error('Database connection not established'); }
    return db;
}