const express = require('express');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const secretsClient = new SecretsManagerClient({ region: process.env.AWS_REGION });

async function getSecrets() {
  const command = new GetSecretValueCommand({ SecretId: process.env.SECRETS_ARN });
  const data = await secretsClient.send(command);
  return JSON.parse(data.SecretString);
}

let dbClient;
async function initDb() {
  const secrets = await getSecrets();
  dbClient = new Pool({
    host: process.env.RDS_ENDPOINT.split(':')[0],
    port: 5432,
    user: 'admin',
    password: secrets.DB_PASSWORD,
    database: 'postgres'
  });
}

app.get('/health', async (req, res) => {
  try {
    await dbClient.query('SELECT 1');
    res.status(200).send('OK');
  } catch (err) {
    res.status(500).send('Database error');
  }
});

app.get('/', async (req, res) => {
  const secrets = await getSecrets();
  res.send(`Hello from Node.js! API Key: ${secrets.API_KEY}`);
});

app.listen(port, async () => {
  await initDb();
  console.log(`App running on port ${port}`);
});