import { Pool, PoolClient, QueryResult } from "pg";

interface RunQueryResult {
  rows: any[];
}

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  port: number;
  database: string;
}

type QueryValues = Array<string | number | boolean | bigint | null>;

class Database {
  private pool: Pool;

  constructor(config: DatabaseConfig) {
    this.pool = new Pool({
      host: config.host,
      user: config.user,
      password: config.password,
      port: Number(config.port),
      database: config.database,
      ssl: {
        rejectUnauthorized: false, // for dev only, remove it in prod
      },
    });    
  }

  async runQuery(
    query: string,
    values: QueryValues,
    queryFunction: string
  ): Promise<QueryResult<RunQueryResult>> {
    const startTime = Date.now();
    if (!query || !values) {
      throw new Error(`Invalid query or values: ${query}, ${values}`);
    }
    
    const client: PoolClient = await this.pool.connect();
    if (!client) {
      throw new Error("Error connecting to the database");
    }
    
    try {
      const result: QueryResult<any> = await client.query(query, values);
      const endTime = Date.now();
      console.log(
        "INFO",
        `Time taken to query ${queryFunction} : ${endTime - startTime}ms`
      );
      return result;
    } catch (err) {
      console.log("ERROR", "Error executing query:", err as Error);
      throw err;
    } finally {
      client.release();
    }
    
  }

  async checkAndInsertInterviewId(interview_id: string) {    
    const checkQuery = 'SELECT * FROM interview WHERE interview_id = $1';
    const checkResult = await this.runQuery(checkQuery, [interview_id], 'checkAndInsertInterviewId');

    if (checkResult.rows.length > 0) {
      return 'Interview ID already present in the database';
    } else {
      const insertQuery = `
        INSERT INTO interview (company_id, interview_id, creator_email, access)
        VALUES ($1, $2, $3, $4)
      `;
      await this.runQuery(insertQuery, ["company_id", interview_id, "example@autcast.com", "full"], 'checkAndInsertInterviewId');
      return 'Interview ID successfully inserted';
    }
  }

  async insertUsers(name: string, email: string){
    const insertQuery = `
    INSERT INTO users (company_domain, email, name, created_ts)
    VALUES ($1, $2, $3, $4)
    `;
    await this.runQuery(insertQuery, ['company_domain', email, name, Date.now()], 'insertUsers')
    return 'Inserted Users Successfully'
  }
}

export default Database