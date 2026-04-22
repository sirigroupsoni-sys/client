const db = require('../config/db');

exports.getMyTasks = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const [tasks] = await db.execute(
      `SELECT t.*, b.booking_id as event_id, b.location, b.event_date 
       FROM tasks t 
       JOIN bookings b ON t.booking_id = b.id 
       WHERE t.employee_id = ?`,
      [employeeId]
    );
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.execute('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    res.status(200).json({ success: true, message: 'Task status updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
