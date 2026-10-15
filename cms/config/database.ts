import path from "path";

export default ({ env }: { env: any }) => {
  const client = env("DATABASE_CLIENT", "sqlite");
  
  if (client === "sqlite") {
    return {
      connection: {
        client: "sqlite",
        connection: {
          filename: path.join(__dirname, "..", "..", env("DATABASE_FILENAME", ".tmp/data.db")),
        },
        useNullAsDefault: true,
      },
    };
  }

  const isMysql = client === "mysql";
  return {
    connection: {
      client,
      connection: {
        host: env("DATABASE_HOST", "127.0.0.1"),
        port: env.int("DATABASE_PORT", isMysql ? 3306 : 5432),
        database: env("DATABASE_NAME", "event_discovery"),
        user: env("DATABASE_USERNAME", isMysql ? "root" : "postgres"),
        password: env("DATABASE_PASSWORD", ""),
        ssl: env.bool("DATABASE_SSL", false)
          ? { rejectUnauthorized: env.bool("DATABASE_SSL_REJECT_UNAUTHORIZED", true) }
          : false,
      },
    },
  };
};
