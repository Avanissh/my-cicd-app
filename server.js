const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send(`
    <h1 style="color: purple; font-family: Arial;">CI/CD Deployment Successful ✅</h1>
    <p>This app was deployed automatically using:</p>
    <ul>
      <li>Jenkins (CI)</li>
      <li>Docker (Containerization)</li>
      <li>AWS ECR (Registry)</li>
      <li>AWS ECS Fargate (Deployment)</li>
    </ul>
    <p><b>Created by:</b>AVANISSH GK <3</p>
    <p>sponsored by junaidh</p>
    <img src="https://play-lh.googleusercontent.com/7kNwdvndwJd-Gm-9aGLTDrVfG843u05It78G8JPBwLtEVfVpmOR_5EWr9EXOhaKRsAn_" width="350" />
  `);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});