const {google} = require('googleapis');
const {Readable} = require('stream')


const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

class FileController {
    async uploadFile(filePath, fileName, type) {
        try {
            const response = await drive.files.create({
                requestBody: {
                    name: fileName,
                    mimeType: type,
                },
                // resource: {
                //     parents: [process.env.GOOGLE_PARRENT_FOLDER]
                // },
                media: {
                    mimeType: type,
                    body: Readable.from(filePath),
                }
            });
            return response.data;
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteFile(fileId) {
        try {
            const response = await drive.files.delete({
                fileId: fileId,
            });
            console.log(response.data, response.status);
        } catch (error) {
            console.log(error.message);
        }
    }
    async generatePublicUrl(fileId) {
        try {
            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            const result = await drive.files.get({
                fileId: fileId,
                fields: 'webViewLink, webContentLink',
            });
            return result.data;
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new FileController();
