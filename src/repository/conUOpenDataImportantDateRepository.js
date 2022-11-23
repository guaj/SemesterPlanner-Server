const {createOpenDataImportantDate} = require("../factory/conUOpenDataImportantDateFactory");
const OpenDataImportantDate = require('../models/conUOpenDataImportantDate.model');
const got = require('got');
const cheerio = require("cheerio");

module.exports = class openDataImportantDateRepository {
    /**
     * Create an important date record.
     * @param {*} data The body/params of the request. It should contain: date, description.
     * @returns [{ImportantDate}] Returns a promise. Resolves with the ImportantDate record added.
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const newOpenDataImportantDate = createOpenDataImportantDate(data)
            newOpenDataImportantDate.save((err, importantDate) => {
                if (err) {
                    reject(err);
                }
                resolve(importantDate);
            })
        })
    }

    /**
     * Get a list of all important dates.
     * @returns [{ImportantDate}] Returns a promise. Resolves with the ImportantDate records.
     */
    static getAllImportantDates() {
        return new Promise((resolve, reject) => {
            OpenDataImportantDate.find()
                .then((result) => {
                    resolve(result);
                })
                .catch(err => reject(err))
        })
    }

    /**
     * Get text description of a text node on Concordia's Academic Dates webpage.
     * @param {div} textNode The text node for which the description text needs to be extracted.
     * @returns {string} Returns a string containing the text inside the textNode of interest (passed in params).
     */
    static getText(textNode) {
        let string = "";

        textNode.children.forEach((item) => {
            if (item.data) {
                string += item.data.trim() + " ";
            } else if (item.children[0])
                if (item.children[0].data)
                    string += item.children[0].data.trim() + " ";
        })
        return string.trim();
    }

    /**
     * Get a list of important dates from Concordia's Academic Dates webpage.
     * @returns [{ImportantDate}] Returns a list containing ImportantDate records.
     */
    static getImportantDates() {
        let isCurrentYear = true;
        const currentYear = new Date().getFullYear();
        let importantDates = [];

        // get html text from concordia academic dates
        const vgmUrl = 'https://www.concordia.ca/academics/graduate/calendar/current/academic-calendar/current-academic-calendar-dates.html';

        return new Promise((resolve, reject) => {
            got(vgmUrl).then(response => {
                const $ = cheerio.load(response.body);
                $('div.date').each((i, element) => {
                    if (element.children[0].data.trim().includes("Jan.")) {
                        isCurrentYear = false;
                    }
                    const string = element.children[0].data.trim() + ", " + (isCurrentYear ? currentYear : currentYear + 1) + " : " + this.getText($('div.text')[i]);
                    const date = new Date(string.split(":")[0]);
                    const description = string.split(":")[1].trim().split(' ,').join(',');
                    const importantDate = {
                        'date': date.toLocaleDateString(),
                        'description': description
                    };
                    importantDates.push(importantDate);
                })
                resolve(importantDates);
            }).catch(err => {
                reject(err);
            });
        });
    };

    /**
     * Drops the opendataimportantdates table
     * @returns boolean, returns true if the table is dropped, returns false if the table is not dropped
     */
    static dropTable() {
        return new Promise((resolve, reject) => {
            OpenDataImportantDate.collection.drop().then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    /**
     * Creates table of ImportantDate records using an array of ImportantDate records.
     * @returns [{ImportantDate}] Returns a promise. Resolves with an array of ImportantDate added to the table.
     */
    static batchCreateImportantDate(importantDateData) {
        return new Promise((resolve, reject) => {
            OpenDataImportantDate.collection.insertMany(importantDateData, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            })
        })
    }

    /**
     * Refreshes ImportantDate data in the openadataimportantdates table using the important dates on Concordia's Academic Dates webpage
     */
    static refreshImportantDateData() {
        this.getImportantDates().then((result) => {
            console.info("Origin OpenData Important Dates Courses size: " + result.length);

            this.dropTable().then((res) => {
                console.info("opendataimportantcourses collection dropped: " + res);
                this.batchCreateImportantDate(result).then((res) => {
                    console.info('%d courses were successfully added to opendataimportantdates collection.', res.insertedCount);
                }).catch((err) => {
                    console.error(err);
                });
            }).catch((err) => {
                console.error(err);
            });
        })
    }
}