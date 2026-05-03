const Express = require("express");
const app = Express();

const { readDataJson, writeDataJson } = require("./utility.js");

const PORT = process.env.PORT || 3000;

app.use(Express.json());

// -> http://localhost:3000/
app.get("/", async (req, res) => {
  const data = await readDataJson();
  res.status(200).json({
    message: "Request completed succesfully",
    content: data,
  });
});

// -> http://localhost:3000/new
app.post("/new", async (req, res) => {
  if (!req.body.user || !req.body.password || !req.body.address)
    return res.status(400).json({
      message: "Bad request missing body payload",
    });

  let data = await readDataJson();

  let nextId;

  if (!data) {
    nextId = 0;
    data = [];
  } else nextId = data[data.length - 1].id;

  nextId++;
  const newUser = {
    id: nextId++,
    username: req.body.user,
    password: req.body.password,
    address: req.body.address,
  };

  data.push(newUser);

  const dbWriteOperation = await writeDataJson(JSON.stringify(data).toString());

  if (dbWriteOperation instanceof Error) {
    console.log(
      "An error occurred during write operation" + dbWriteOperation.message
    );
    return res.status(500).json({
      message: dbWriteOperation.message,
    });
  }

  return res.status(201).json({
    message: dbWriteOperation.message,
    content: newUser,
  });
});

// -> http://localhost:3000/update/2
app.put("/update/:id", async (req, res) => {
  if (!req.body.user || !req.body.password || !req.body.address)
    return res.status(400).json({
      message: "Bad request missing body payload",
    });

  let data = await readDataJson();

  if (data.length == 0) {
    return res.status(404).json({
      message: "User doesn't exist",
    });
  }

  let userExist = false;
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == req.params.id) {
      userExist = true;
      data[i].username = req.body.username;
      data[i].password = req.body.password;
      data[i].address = req.body.address;
      break;
    }
  }

  if (!userExist) {
    return res.status(404).json({
      message: "User wasn't found",
    });
  }

  const dbWriteOperation = await writeDataJson(JSON.stringify(data).toString());

  if (dbWriteOperation instanceof Error) {
    console.log(
      "An error occurred during write operation" + dbWriteOperation.message
    );
    return res.status(500).json({
      message: dbWriteOperation.message,
    });
  }

  return res.status(201).json({
    message: dbWriteOperation.message,
  });
});

// -> http://localhost:3000/delete/3
app.delete("/delete/:id", async (req, res) => {
  let data = await readDataJson();

  if (data.length == 0) {
    return res.status(404).json({
      message: "User doesn't exist",
    });
  }

  let userExist = false;
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == req.params.id) {
      userExist = true;
      data.splice(i, 1);
      break;
    }
  }

  if (!userExist) {
    return res.status(404).json({
      message: "User wasn't found",
    });
  }

  const dbWriteOperation = await writeDataJson(JSON.stringify(data).toString());

  if (dbWriteOperation instanceof Error) {
    console.log(
      "An error occurred during write operation" + dbWriteOperation.message
    );
    return res.status(500).json({
      message: dbWriteOperation.message,
    });
  }

  return res.status(201).json({
    message: "User deleted succesfully",
  });
});

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
