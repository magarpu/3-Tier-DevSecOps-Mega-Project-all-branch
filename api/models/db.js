require('dotenv').config();
const mysql = require('mysql2');

const resolveDbHosts = (env = process.env) => {
  const configuredHost = (env.DB_HOST || '127.0.0.1').trim();
  const hostCandidates = [configuredHost, 'localhost', '127.0.0.1', 'host.docker.internal'];

  return Array.from(new Set(hostCandidates.filter(Boolean)));
};

const getDbConfig = (env = process.env) => ({
  host: resolveDbHosts(env)[0],
  port: Number(env.DB_PORT || 3306),
  user: env.DB_USER || 'root',
  password: env.DB_PASSWORD || '',
  database: env.DB_NAME || 'crud_app',
  connectTimeout: 5000,
  multipleStatements: false
});

const createDbConnection = () => {
  const hostCandidates = resolveDbHosts();
  let attemptIndex = 0;

  const connect = () => {
    const config = { ...getDbConfig(), host: hostCandidates[attemptIndex] };

    const connection = mysql.createConnection(config);

    connection.connect((err) => {
      if (!err) {
        console.log(`MySQL Connected to ${config.host}`);
        return;
      }

      const message = err && err.message ? err.message : String(err);
      console.error(`MySQL connection attempt ${attemptIndex + 1}/${hostCandidates.length} failed for ${config.host}: ${message}`);

      if (attemptIndex < hostCandidates.length - 1) {
        attemptIndex += 1;
        console.log(`Retrying MySQL connection to ${hostCandidates[attemptIndex]}...`);
        setTimeout(connect, 1000);
        return;
      }

      console.error('MySQL is unavailable. API requests that need the database will fail until the connection is restored.');
    });

    connection.on('error', (err) => {
      const message = err && err.message ? err.message : String(err);
      console.error(`MySQL connection error: ${message}`);
      if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
        console.warn('Reconnecting to MySQL...');
        setTimeout(connect, 1000);
      }
    });

    return connection;
  };

  return connect();
};

const db = createDbConnection();

module.exports = db;
module.exports.resolveDbHosts = resolveDbHosts;
