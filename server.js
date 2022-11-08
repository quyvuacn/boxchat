require("dotenv").config()
var express = require("express")
var app = express()
var session = require("express-session")
var path = require("path")
var port = process.env.PORT || 8080

var server = require("http").createServer(app)

var io = require("socket.io")(server)
//Public
app.use(express.static("public"))
//View engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }))

app.get("/", function (req, res) {
	res.render("index", { user: req.user })
})

io.of("/").on("connection", function (client) {
	console.log("Client connected...")
	client.on("join", function (data) {
		console.log(data + " Join")
	})
	client.on("messages", function (data) {
		client.emit("thread", data)
		client.broadcast.emit("thread", data)
	})
})

server.listen(port)
