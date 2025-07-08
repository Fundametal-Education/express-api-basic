import { Router, Response } from 'express';
import pool from '../database';
import { AuthRequest } from '../types';
import { authenticateToken } from '../middleware';

const router = Router();

// Get all todos for user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user?.id]
    );

    res.json({ todos: result.rows });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new todo
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      'INSERT INTO todos (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description || null, req.user?.id]
    );

    res.status(201).json({
      message: 'Todo created successfully',
      todo: result.rows[0]
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single todo
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ todo: result.rows[0] });
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update todo
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    // Check if todo exists and belongs to user
    const existingTodo = await pool.query(
      'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (existingTodo.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const result = await pool.query(
      'UPDATE todos SET title = $1, description = $2, completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND user_id = $5 RETURNING *',
      [
        title || existingTodo.rows[0].title,
        description !== undefined ? description : existingTodo.rows[0].description,
        completed !== undefined ? completed : existingTodo.rows[0].completed,
        id,
        req.user?.id
      ]
    );

    res.json({
      message: 'Todo updated successfully',
      todo: result.rows[0]
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete todo
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
