// This file is ONLY for running the server on your local machine.
const app = require('./server'); // Import the app from our main server.js file

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ LOCAL development server is running on port ${PORT}`);
});