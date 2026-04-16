const jwt = require("jsonwebtoken")

const AuthMiddleware = (req, res, next) => {
    try {
       
        const token = req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({ message: "No token" })
        }

        const decoded = jwt.verify(token, "secret")

        req.user = decoded   // ✅ store user in request

        next()

    } catch (err) {
        res.status(401).json({ message: "Invalid token" })
    }
}

module.exports = AuthMiddleware