import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('[v0] Query executed', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('[v0] Database error:', error);
    throw error;
  }
}

export async function getUser(email: string) {
  const res = await query('SELECT * FROM profiles WHERE email = $1', [email]);
  return res.rows[0];
}

export async function getUserById(id: string) {
  const res = await query('SELECT * FROM profiles WHERE id = $1', [id]);
  return res.rows[0];
}

export async function getUserBooks(userId: string) {
  const res = await query('SELECT * FROM books WHERE user_id = $1 AND is_available = TRUE', [userId]);
  return res.rows;
}

export async function getApprovalRequest(email: string) {
  const res = await query('SELECT * FROM approval_requests WHERE email = $1', [email]);
  return res.rows[0];
}

export async function createApprovalRequest(email: string, firstName: string, lastName: string, grade: string) {
  const id = Math.random().toString(36).substr(2, 9);
  const res = await query(
    'INSERT INTO approval_requests (id, email, first_name, last_name, grade, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [id, email, firstName, lastName, grade, 'pending']
  );
  return res.rows[0];
}

export async function createUser(email: string, passwordHash: string, firstName: string, lastName: string, grade: string, role: string = 'user') {
  const id = Math.random().toString(36).substr(2, 9);
  const res = await query(
    'INSERT INTO profiles (id, email, password_hash, first_name, last_name, grade, role, is_approved) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, first_name, last_name, role',
    [id, email, passwordHash, firstName, lastName, grade, role, true]
  );
  return res.rows[0];
}

export async function getBooks(filters?: { subject?: string; level?: string; condition?: string }) {
  let query = 'SELECT b.*, p.first_name, p.last_name FROM books b JOIN profiles p ON b.user_id = p.id WHERE b.is_available = TRUE';
  const params: any[] = [];

  if (filters?.subject) {
    query += ` AND b.subject = $${params.length + 1}`;
    params.push(filters.subject);
  }
  if (filters?.level) {
    query += ` AND b.level = $${params.length + 1}`;
    params.push(filters.level);
  }
  if (filters?.condition) {
    query += ` AND b.condition = $${params.length + 1}`;
    params.push(filters.condition);
  }

  query += ' ORDER BY b.created_at DESC';
  const res = await query(query, params);
  return res.rows;
}

export async function addBook(userId: string, title: string, subject: string, level: string, condition: string, description: string) {
  const id = Math.random().toString(36).substr(2, 9);
  const res = await query(
    'INSERT INTO books (id, user_id, title, subject, level, condition, description, is_available) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [id, userId, title, subject, level, condition, description, true]
  );
  return res.rows[0];
}

export async function getNotifications(userId: string) {
  const res = await query(
    'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return res.rows;
}

export async function createSwapOffer(bookId: string, requesterId: string, requesterBookIds: string[]) {
  const id = Math.random().toString(36).substr(2, 9);
  const code = Math.random().toString(36).substr(2, 8).toUpperCase();
  
  const res = await query(
    'INSERT INTO swap_offers (id, book_id, requester_id, requester_book_ids, status, swap_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [id, bookId, requesterId, JSON.stringify(requesterBookIds), 'pending', code]
  );

  // Create notification for book owner
  const book = await query('SELECT user_id FROM books WHERE id = $1', [bookId]);
  if (book.rows[0]) {
    const notifId = Math.random().toString(36).substr(2, 9);
    await query(
      'INSERT INTO notifications (id, user_id, swap_offer_id, type, message) VALUES ($1, $2, $3, $4, $5)',
      [notifId, book.rows[0].user_id, id, 'swap_request', `New swap request for your book`]
    );
  }

  return res.rows[0];
}

export async function updateSwapOfferStatus(offerId: string, status: 'accepted' | 'declined' | 'pending') {
  const res = await query(
    'UPDATE swap_offers SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [status, offerId]
  );
  return res.rows[0];
}

export async function approveUser(email: string) {
  const res = await query(
    'UPDATE approval_requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING *',
    ['approved', email]
  );
  return res.rows[0];
}
