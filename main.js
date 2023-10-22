const { argv } = require("process");
const assert = require("assert");
const { Client } = require("pg");
require("dotenv").config();

argv.splice(0, 2);
assert(
  argv.length == 1 || argv.length == 2,
  "no of input args must be less than 2"
);

//db
const client = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});
console.log(`client made`);

const logAllOptions = () => {
  console.log(`Options:
    --new to add a new todo item
    --list [all|pending|done] to list the todo items
    --done [id] to update a todo item
    --delete [id] to delete a todo item
    --help to list all the available options
    --version to print the version of the application`);
};

const logAppVersion = () => {
  const ver = require("./package.json").version;
  console.log(ver);
};

//   db funcs
const insertItem = async (todoItem) => {
  await client.connect();
  console.log(`client connected`);

  try {
    const res = await client.query(
      `INSERT INTO todos (todo, status) VALUES ($1, $2);`,
      [todoItem, "pending"]
    );
    console.log(`added the todo - ${todoItem}`);
  } catch (e) {
    console.log("db insertion error", e);
  } finally {
    await client.end();
  }
};

const init = async () => {
  console.log(`init started`);

  switch (argv[0]) {
    case "--new":
      console.log(`inserting item ${argv[1]}`);
      await insertItem(argv[1]);
      break;
    case "--list":
      console.log(`listing todos acc to format - ${argv[1]}`);
      //may need to check for format
      logTodosAccToFormat(argv[1]);
      break;
    case "--done":
      console.log(`updating a todo item as done - id: ${argv[1]}`);
      updateTodoAsDone(argv[1]);
      break;
    case "--delete":
      console.log(`deleting a todo item -id: ${argv[1]}`);
      deleteTodo(argv[1]);
      break;
    case "--help":
      logAllOptions();
      break;
    case "--version":
      logAppVersion();
      break;
    default:
      console.log(`Pls enter a valid command - not doing anything`);
  }
};

init();