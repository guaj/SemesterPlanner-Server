const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const OpenDataCourseRepository = require("../../src/repository/conUOpenDataCourseRepository");
const supertest = require('supertest');
const request = supertest('https://opendata.concordia.ca');
const fs = require('fs')
let mongod;
/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    await mongoose.connect(uri, mongooseOpts);
}

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}

module.exports.refreshDatabase = async () => {
    console.log('e')
    await request.get('/API/v1/course/catalog/filter/*/*/*')
        .auth(process.env.OPEN_DATA_USERNAME, process.env.OPEN_DATA_PASSWORD)
        .expect(200)
        .then(async (res) => {
            await OpenDataCourseRepository.batchCreateCourse(JSON.parse(res.text));
        })

}