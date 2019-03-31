require("ts-node").register();
require("dotenv").config();
require("./src/index").start(process.env);
