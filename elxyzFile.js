const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const https = require("https"); // Tambahin ini

async function elxyzFile(Path) {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(Path)) return reject(new Error("File not Found"));

        try {
            const form = new FormData();
            form.append("file", fs.createReadStream(Path));

            const response = await axios.post("https://cdn.bgs.ct.ws/index.php", form, {
                headers: form.getHeaders(),
                httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Fix SSL
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.lengthComputable) {
                        console.log(`Upload Progress: ${(progressEvent.loaded * 100) / progressEvent.total}%`);
                    }
                }
            });

            resolve(response.data);
        } catch (error) {
            console.error("Upload Failed:", error);
            reject(error);
        }
    });
}

module.exports = elxyzFile;
