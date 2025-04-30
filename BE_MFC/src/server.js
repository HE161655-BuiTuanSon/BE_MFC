import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(
    `📚 API documentation is available at http://localhost:${PORT}/api-docs`
  );
});
