import dotenv from "dotenv";

// load dotenv
dotenv.config();

import { web } from "./application/web";
import { config } from "./config/index";

web.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
