import { Pool } from 'pg';

export interface Note {
    id: number;
    text: string;
    createdAt: Date;
}

const COLUMNS = 'id, text, created_at AS "createdAt"';

export class Notes {
    private constructor(private readonly pool: Pool) {}

    static async open(databaseUrl: string): Promise<Notes> {
        const pool = new Pool({ connectionString: databaseUrl, max: 5 });
        await pool.query(
            `CREATE TABLE IF NOT EXISTS notes (
                id serial PRIMARY KEY,
                text text NOT NULL,
                created_at timestamptz NOT NULL DEFAULT now()
            )`,
        );
        return new Notes(pool);
    }

    async list(): Promise<Note[]> {
        const { rows } = await this.pool.query<Note>(`SELECT ${COLUMNS} FROM notes ORDER BY id`);
        return rows;
    }

    async add(text: string): Promise<Note> {
        const { rows } = await this.pool.query<Note>(
            `INSERT INTO notes (text) VALUES ($1) RETURNING ${COLUMNS}`,
            [text],
        );
        return rows[0]!;
    }
}
