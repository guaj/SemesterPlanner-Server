/**
 * Requires installing the tesseract-ocr package on your platform for proper functionality.
 * Installation guide: https://github.com/tesseract-ocr/tessdoc/blob/main/Installation.md
 * Requires restart of IDE!
 */

const tesseract = require("node-tesseract-ocr")
const router = require('express').Router();

const Multer = require('multer');
// create multer instance
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 8000000
    }
});

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
router.route("/url/").post((req, res) => {
    const imgUrl = req.body.url;

    tesseract
        .recognize(imgUrl, config)
        .then((text) => {
            res.json(text).status(200);
        })
        .catch((error) => {
            console.log(error.message)
            res.json(error.message).status(400);
        })
})

/**
 * Route that obtains text from an image file
 * @param {file} img, image file from which text will be extracted; pass the image under the field name 'img'
 * as **form-data**, NOT x-www-form-urlencoded
 * @returns {String}, text from the image url provided
 */
router.route("/img/").post(multer.single("img"), (req, res) => {
    const img = req.file;

    tesseract
        .recognize(img.buffer, config)
        .then((text) => {
            res.json(text).status(200);
        })
        .catch((error) => {
            console.log(error.message)
            res.json(error.message).status(400);
        })
})

module.exports = router;

