const UserFileType = require('../models').UserFileType;

FileTypeController = {
    index(req, res) {
        return UserFileType.findAll({
            attributes: ['Oid', 'Source', 'User', 'FileType']
        })
        .then(files => res.status(200).json({ Files: files }))
        .catch(error => res.status(400).send(error));
    },

    filesByUser(req, res) {
        const oid = req.params.User;
        return UserFileType.findAll({
            attributes: ['Oid', 'Source', 'User', 'FileType'],
            where: {
                User: oid
            }
        })
        .then(files => res.status(200).json({ Files: files }))
        .catch(error => res.status(400).send(error));
    }
};

module.exports = FileTypeController;
