const express = require("express");
const morgan = require("morgan");
const db = require("./database");
const seed = require("./seed");
const html = require("html-template-tag");

// Create an Express application instance
const app = express();

// Apply Body Parsing Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Apply Logging Middleware
app.use(morgan("dev"));

// GET / -> homepage with a form to create a new pet
app.get("/", async (req, res, next) => {
  const result = await db.query("SELECT * FROM cats");
  const cats = result.rows;
  res.send(html`
    <div style="text-align: center">
      <h2>Add a New Pet:</h2>
      <form action="/" method="POST">
        <input name="name" type="text" placeholder="Name" />
        <button type="submit">Submit</button>
      </form>
      <h1>Look at all these pets!</h1>
      <div style="display: flex; flex-wrap: wrap;">
        ${cats.map(
          (cat) => html`
            <div>
              <div>${cat.name}</div>
              <img
                src="https://robohash.org/${cat.name}?set=set4"
                height="100"
                width="100"
              />
            </div>
          `
        )}
      </div>
    </div>
  `);
});

// POST / -> create new pet and then redirect to homepage
app.post("/", async (req, res, next) => {
  const { name } = req.body;
  await db.query("INSERT INTO cats (name) VALUES ($1)", [name]);
  res.redirect("/");
});

const PORT = 3030;
const startServer = async () => {
  await db.connect();
  await seed();
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};
startServer();
