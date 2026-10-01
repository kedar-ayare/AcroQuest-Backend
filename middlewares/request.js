async function RequestId(req, res, next) {
    req.requestId = new Date().getTime()
    return next()
}

module.exports = RequestId