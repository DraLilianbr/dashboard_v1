import { sql } from '@vercel/postgres';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    switch (request.method) {
      case 'GET':
        const result = await sql`SELECT * FROM patients ORDER BY created_at DESC`;
        return response.status(200).json(result.rows);

      case 'POST':
        const { name, email, phone, birth_date } = request.body;
        const inserted = await sql`
          INSERT INTO patients (name, email, phone, birth_date)
          VALUES (${name}, ${email}, ${phone}, ${birth_date})
          RETURNING *
        `;
        return response.status(201).json(inserted.rows[0]);

      case 'PUT':
        const { id, ...updates } = request.body;
        const fields = Object.keys(updates)
          .map(key => `${key} = ${updates[key]}`)
          .join(', ');
        
        const updated = await sql`
          UPDATE patients
          SET ${sql(fields)}
          WHERE id = ${id}
          RETURNING *
        `;
        return response.status(200).json(updated.rows[0]);

      case 'DELETE':
        const { id: deleteId } = request.query;
        await sql`DELETE FROM patients WHERE id = ${deleteId}`;
        return response.status(204).end();

      default:
        return response.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return response.status(500).json({ error: error.message });
  }
}