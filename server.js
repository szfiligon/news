const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// // job for loading news
// const loadingNewsJob = require('./src/loadingNewsJob');

// // Schedule a task to run every minute
// cron.schedule('*/10 * * * * *', () => {
//     loadingNewsJob()
// });
