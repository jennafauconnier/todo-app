const tasks = require("./routes/tasks");
const cors = require("cors");
const express = require('express');
const app = express();


app.use((req, res, next) => {
    console.log(`${req.method} - ${req.originalUrl}`)
    next()
})

app.use(express.json());
app.use(cors());

app.use("/api/tasks", tasks);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`))