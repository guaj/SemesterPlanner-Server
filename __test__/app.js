
const supertest = require('supertest');
const app = require("../src/server");
const { response } = require("../src/server");
const request = supertest(app)
const assert = require('assert');



module.exports = { request, assert }