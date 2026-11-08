import app from "./app";
import datasource from "./datasource";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function startApp() {
  console.log(`⏳ starting server!`);

  try {
    await datasource.initialize();
    console.log(`✅ connected to PgSQL db`);

    app.listen(port, (err) => {
      if (err) {
        console.error(`🚨 unable to start server on port ${port}`);
      } else {
        console.log(`🚀 server started on port ${port}`);
      }
    });
  } catch (err) {
    console.error(
      `🚨 unable to connect to db: ${err?.message || JSON.stringify(err)}`,
    );
    process.exit(1);
  }
}

startApp();
