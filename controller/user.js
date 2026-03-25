const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const getDb = require("../config/connectionDb")

const userSignUp = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }
    const db = await getDb()
    let user = await db.get(`SELECT * FROM users WHERE email = ?`, [email])
    if (user) {
        return res.status(400).json({ error: "Email already exists" })
    }
    const hashPwd = await bcrypt.hash(password, 10)

    const result = await db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashPwd])
    let token = jwt.sign({ email, id: result.lastID }, process.env.SECRET_KEY)

    // Return same structure as login to allow immediate redirect/login
    return res.status(200).json({
        token,
        user: { id: result.lastID, email: email }
    })
}

const userLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }
    const db = await getDb()
    let user = await db.get(`SELECT * FROM users WHERE email = ?`, [email])

    if (user && await bcrypt.compare(password, user.password)) {
        let token = jwt.sign({ email, id: user.id }, process.env.SECRET_KEY)
        return res.status(200).json({
            token,
            user: { id: user.id, email: user.email }
        })
    }
    else {
        return res.status(400).json({ error: "Invalid credentials" })
    }
}

const getUser = async (req, res) => {
    const db = await getDb()
    const user = await db.get(`SELECT * FROM users WHERE id = ?`, [req.params.id])
    if (user) {
        res.json({ email: user.email })
    } else {
        res.status(404).json({ message: "User not found" })
    }
}

module.exports = { userLogin, userSignUp, getUser }