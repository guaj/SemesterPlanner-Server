/**
 * Requires installing the tesseract-ocr package on your platform for proper functionality.
 * Installation guide: https://github.com/tesseract-ocr/tessdoc/blob/main/Installation.md
 * Requires restart of IDE!
 */

const tesseract = require("node-tesseract-ocr")
const router = require('express').Router();

const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}

/**
 * Route that obtains text from an image url
 * @param {String} url, url of image from which text will be extracted
 * @returns {String}, text from the image url provided
 */
router.route("/").post((req,res) => {
    const imgUrl = req.body.url;

    tesseract
        .recognize(imgUrl, config)
        .then((text) => {
            console.log("Result:", text);
            res.json(text).status(200);
        })
        .catch((error) => {
            console.log(error.message)
            res.json(error.message).status(400);
        })
})

module.exports = router;

