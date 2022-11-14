const mongoose = require('mongoose');
const { expect, test } = require('@jest/globals');

// Allows us to include environment variables in .env file
require('dotenv').config();

test('Test should be able to connect to mongoDB', async () => {
    let connection;
    const uri = process.env.ATLAS_URI;
    connection = await mongoose.connect(uri, { useNewUrlParser: true });
    expect(connection.connections.length).toBeGreaterThan(0);
    // Connection to Mongo killed.
    await mongoose.disconnect();
});