/**
 * Requires installing the tesseract-ocr package on your platform for proper functionality.
 * Installation guide: https://github.com/tesseract-ocr/tessdoc/blob/main/Installation.md
 * Requires restart of IDE!
 */

const tesseract = require("node-tesseract-ocr");
const router = require('express').Router();
const fs = require('fs');
const Multer = require('multer');

// create multer instance
const multer = Multer({
    dest: "tmp/imgs",
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
        .recognize(img.path, config)
        .then((text) => {
            if (text && text.includes(":")) { // try to format the text extracted from the image into a json object
                try {
                    let formattedText = text.trim().split('\r\n').join(",");
                    JSON.parse(JSON.stringify(formattedText));
                    let temp = formattedText.split(',');
                    formattedText = {};
                    temp.map((item) => {
                        if (item.includes(":")) {
                            if (item.split(":")[0].toLowerCase().includes("name") && !formattedText.name)
                                formattedText.name = item.split(":")[1]
                            if (item.split(":")[0].toLowerCase().includes("description") && !formattedText.description)
                                formattedText.description = item.split(":")[1]
                            if (item.split(":")[0].toLowerCase().includes("date") && !formattedText.date)
                                formattedText.date = item.split(":")[1]
                        } else {
                            if (item.toLowerCase().includes("name") && !formattedText.name)
                                formattedText.name = item
                            if (item.toLowerCase().includes("description") && !formattedText.description)
                                formattedText.description = item
                            if (item.toLowerCase().includes("date") && !formattedText.date)
                                formattedText.date = item
                        }
                    })
                    res.json(formattedText).status(200);
                    return;
                } catch {
                }
            }

            const temp = text;
            text = {};
            text["description"] = temp.trim().split('\r\n').join(" ");
            res.json(text).status(200); // respond with image text as description if it does not seem to contain key value pairs
        })
        .catch((error) => {
            res.json(error.message).status(400);
        }).finally(() => {
        fs.unlink(img.path, (err) => {
            if (err)
                console.log(err);
        });
    })
})

module.exports = router;

