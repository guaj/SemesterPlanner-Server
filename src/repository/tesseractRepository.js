module.exports = class TesseractRepository {
    /**
     * Method that creates a json from text obtained through OCR
     * @param {String} text, text string obtained from tesseract OCR
     * @returns {{}}, json of formatted text if it was parse-able, original text as a one-element json otherwise
     */
    static imageToJson(text) {
        if (text && text.includes(":")) { // attempt to format the text extracted from the image into a json object
            try {
                let formattedText = text.trim().split('\r\n').join(",");
                let temp = formattedText.split(',');
                formattedText = {};
                temp.map((item) => {
                    if (item.includes(":")) {
                        if (item.split(":")[0].toLowerCase().includes("name") && !formattedText.name)
                            formattedText.name = item.split(":")[1].trim();
                        if (item.split(":")[0].toLowerCase().includes("description") && !formattedText.description)
                            formattedText.description = item.split(":")[1].trim();
                        if (item.split(":")[0].toLowerCase().includes("date") && !formattedText.date)
                            formattedText.date = item.split(":")[1].trim();

                        // parses first recognized time as start time, second recognized time as end time
                        if (item.split(":")[0].toLowerCase().includes("time") && !formattedText.startTime) {
                            let startTime = new Date();
                            startTime.setHours(Number(item.split(':')[1]), Number(item.split(':')[2]));
                            formattedText.startTime = startTime;
                        } else if (item.split(":")[0].toLowerCase().includes("time") && !formattedText.endTime) {
                            let endTime = new Date();
                            endTime.setHours(Number(item.split(':')[1]), Number(item.split(':')[2]));
                            formattedText.endTime = endTime;
                        }
                    } else { // includes entire string without attempting to remove the 'key' from original text
                        if (item.toLowerCase().includes("name") && !formattedText.name)
                            formattedText.name = item
                        if (item.toLowerCase().includes("description") && !formattedText.description)
                            formattedText.description = item
                        if (item.toLowerCase().includes("date") && !formattedText.date)
                            formattedText.date = item
                    }

                    return null;
                })
                return formattedText;
            } catch {
            }
        }

        const temp = text;
        text = {};
        text["description"] = temp.trim().split('\r\n').join(" ");
        return text; // respond with image text as description if it does not seem to contain key value pairs
    }
}