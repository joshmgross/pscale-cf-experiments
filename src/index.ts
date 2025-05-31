import { connect } from '@planetscale/database'
import { AutoRouter } from "itty-router";
import mysql from 'mysql2/promise';

const router = AutoRouter()

router.get('/hyperdrive', async (_request, env) => {
  // Start a timer
  const startTime = Date.now();

  const connection = await mysql.createConnection({
    host: env.HYPERDRIVE.host,
    user: env.HYPERDRIVE.user,
    password: env.HYPERDRIVE.password,
    database: env.HYPERDRIVE.database,
    port: env.HYPERDRIVE.port,

    // Required to enable mysql2 compatibility for Workers
    disableEval: true,
  });

  try {
    await connection.query('SELECT 1 + 1 AS `test`');
  } catch (error) {
    console.error('Database query error:', error);
    return new Response(`Error`, { status: 500 });
  } finally {
    await connection.end();
  }

  // Calculate elapsed time
  const elapsedTime = Date.now() - startTime;
  console.log(`Query executed in ${elapsedTime} ms`);
  return new Response(`Query executed successfully in ${elapsedTime} ms`, { status: 200 });
});

router.get('/http', async (_request, env) => {
  // Start a timer
  const startTime = Date.now();

  const config = {
    url: env.DATABASE_URL,
  }

  const connection = connect(config);

  try {
    await connection.execute('SELECT 1 + 1 AS `test`');
  } catch (error) {
    console.error('Database query error:', error);
    return new Response(`Error`, { status: 500 });
  }

  // Calculate elapsed time
  const elapsedTime = Date.now() - startTime;
  console.log(`Query executed in ${elapsedTime} ms`);
  return new Response(`Query executed successfully in ${elapsedTime} ms`, { status: 200 });
});

router.all('*', () => new Response("Not Found.", { status: 404 }));

export default {
  fetch: router.fetch,
} satisfies ExportedHandler<Env>;
