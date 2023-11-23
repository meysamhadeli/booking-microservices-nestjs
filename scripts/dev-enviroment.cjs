const { join } = require('node:path');
const { execSync } = require('node:child_process');
const dotenv = require('dotenv');

dotenv.config();

const directoryToWork = `${join(__dirname, '..')}`;

execSync(`cp ${directoryToWork}/.env.example ${directoryToWork}/.env`);

execSync(
    `docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.10-management`,
);
