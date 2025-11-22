export function successResponce({ res, status = 200,
    message = 'Success', data } = {}) {
    res.status(status).json({ message, data })
}