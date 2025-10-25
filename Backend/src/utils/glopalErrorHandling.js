export const glopalErrorHandling = (error, req, res, next) => {
        res.status(error.cause || 500).send({message: error.name, info: error.message, stack: error.stack})
    }