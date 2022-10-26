
import express from "express";

import createServer from "./utilis/server";

const port = process.env.PORT || ""

const app = createServer();

app.listen(port, async () => {
  console.log(`App is running at http://localhost:${port}`);

});

export default app