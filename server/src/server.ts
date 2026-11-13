import app     from './app';
import { ENV } from './config/env';
import db      from './db/database';

const server = app.listen(ENV.PORT, () => {
  console.log(\`Server running on http://localhost:\${ENV.PORT}\`);
});

const shutdown = (): void => { server.close(() => { db.close(); process.exit(0); }); };
process.on('SIGTERM', shutdown);
process.on('SIGINT',  shutdown);
