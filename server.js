const app = require("./app");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log("server is running and database connect")
    )
  );
