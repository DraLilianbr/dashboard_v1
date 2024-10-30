import { sql } from '@vercel/postgres';
import { Database } from '../types/database';

export const db = {
  async query<T>(
    query: string,
    values?: any[]
  ): Promise<T[]> {
    try {
      const result = await sql.query(query, values);
      return result.rows as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  async queryOne<T>(
    query: string,
    values?: any[]
  ): Promise<T | null> {
    const results = await this.query<T>(query, values);
    return results[0] || null;
  }
};