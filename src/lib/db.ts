/** Postgres (DATABASE_URL). Les tables sont créées au premier appel. */
import pg from 'pg';
import { env } from './env';

let pool: pg.Pool | undefined;
let ready: Promise<void> | undefined;

export const hasDb = () => Boolean(env('DATABASE_URL'));

/**
 * Certificat de l'autorité de la base (DATABASE_CA, au format PEM ou en base64) : la connexion est alors
 * chiffrée ET vérifiée. `sslmode` est retiré de l'URL, sinon il prime sur l'option ssl.
 */
function poolConfig(): pg.PoolConfig {
  const raw = env('DATABASE_URL');
  const caValue = env('DATABASE_CA');
  if (!caValue) return { connectionString: raw, max: 5 };
  const ca = caValue.includes('BEGIN CERTIFICATE') ? caValue.replace(/\\n/g, '\n') : Buffer.from(caValue, 'base64').toString('utf8');
  const url = new URL(raw);
  url.searchParams.delete('sslmode');
  return { connectionString: url.toString(), ssl: { ca, rejectUnauthorized: true }, max: 5 };
}

export function db() {
  pool ??= new pg.Pool(poolConfig());
  return pool;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  session_id text UNIQUE NOT NULL,
  payment_intent text,
  product text NOT NULL,
  lang text NOT NULL DEFAULT 'fr',
  email text,
  name text,
  amount integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'eur',
  status text NOT NULL DEFAULT 'pending',
  refunded integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);
CREATE INDEX IF NOT EXISTS orders_payment_intent ON orders (payment_intent);
CREATE TABLE IF NOT EXISTS answers (
  order_id integer PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
  data jsonb NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS stripe_events (
  id text PRIMARY KEY,
  type text NOT NULL,
  object_id text,
  payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now()
);
`;

export function ensureSchema() {
  ready ??= db()
    .query(SCHEMA)
    .then(() => undefined)
    .catch((e) => {
      ready = undefined;
      throw e;
    });
  return ready;
}
