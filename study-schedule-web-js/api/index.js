const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Subjects ---
app.post('/api/study/subjects', async (req, res) => {
  const { name, color } = req.body;
  const { data, error } = await supabase
    .from('subjects')
    .insert([{ name, color }])
    .select()
    .single();

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.get('/api/study/subjects', async (req, res) => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*');

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.put('/api/study/subjects/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, color } = req.body;
  const { data, error } = await supabase
    .from('subjects')
    .update({ name, color })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.delete('/api/study/subjects/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json(error);
  res.status(200).send();
});

// --- Schedules ---
app.post('/api/study/schedules', async (req, res) => {
  const { subject_id, date, plan_content } = req.body;

  // Upsert pattern for schedules
  const { data, error } = await supabase
    .from('weekly_schedules')
    .upsert({ subject_id, date, plan_content }, { onConflict: 'subject_id,date' })
    .select()
    .single();

  if (error) {
    console.error('Supabase error (schedules):', error);
    return res.status(400).json(error);
  }
  res.json(data);
});

app.get('/api/study/schedules', async (req, res) => {
  const { weekStartDate } = req.query;
  const start = new Date(weekStartDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const { data, error } = await supabase
    .from('weekly_schedules')
    .select('*')
    .gte('date', start.toISOString().split('T')[0])
    .lte('date', end.toISOString().split('T')[0]);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// --- Achievements ---
app.post('/api/study/achievements', async (req, res) => {
  const { subject_id, date, achievement_rate, note } = req.body;

  const { data, error } = await supabase
    .from('daily_achievements')
    .upsert({ subject_id, date, achievement_rate, note }, { onConflict: 'subject_id,date' })
    .select()
    .single();

  if (error) {
    console.error('Supabase error (achievements):', error);
    return res.status(400).json(error);
  }
  res.json(data);
});

app.get('/api/study/achievements', async (req, res) => {
  const { startDate, endDate } = req.query;

  const { data, error } = await supabase
    .from('daily_achievements')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// --- Stats ---
app.get('/api/study/stats', async (req, res) => {
  const weeks = parseInt(req.query.weeks || 4);
  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
  currentWeekStart.setHours(0, 0, 0, 0);

  const stats = [];

  // Fetch all achievements in the required range to minimize DB calls
  const rangeStart = new Date(currentWeekStart);
  rangeStart.setDate(currentWeekStart.getDate() - ((weeks - 1) * 7));

  const { data: achievements, error: achError } = await supabase
    .from('daily_achievements')
    .select('*')
    .gte('date', rangeStart.toISOString().split('T')[0]);

  const { data: schedules, error: schError } = await supabase
    .from('weekly_schedules')
    .select('*')
    .gte('date', rangeStart.toISOString().split('T')[0]);

  if (achError || schError) return res.status(400).json({ achError, schError });

  for (let i = 0; i < weeks; i++) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() - (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const schedulesInWeek = (schedules || []).filter(s => {
      const d = new Date(s.date);
      return s.subject_id !== null && d >= weekStart && d <= weekEnd;
    });

    let totalRate = 0;
    let count = 0;

    schedulesInWeek.forEach(s => {
      const ach = (achievements || []).find(a => a.subject_id === s.subject_id && a.date === s.date);
      if (ach) {
        totalRate += (ach.achievement_rate || 0);
      }
      count++;
    });

    stats.push({
      weekStartDate: weekStart.toISOString().split('T')[0],
      averageAchievementRate: count > 0 ? totalRate / count : 0.0
    });
  }
  res.json(stats);
});

app.get('/api/study/today', async (req, res) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const { data: schedulesToday, error: schError } = await supabase
    .from('weekly_schedules')
    .select('*')
    .eq('date', todayStr);

  const { data: achievementsToday, error: achError } = await supabase
    .from('daily_achievements')
    .select('*')
    .eq('date', todayStr);

  if (schError || achError) return res.status(400).json({ schError, achError });

  let totalRate = 0;
  const validSchedules = (schedulesToday || []).filter(s => s.subject_id !== null);
  let count = validSchedules.length;

  validSchedules.forEach(s => {
    const ach = (achievementsToday || []).find(a => a.subject_id === s.subject_id && a.date === s.date);
    if (ach) {
      totalRate += (ach.achievement_rate || 0);
    }
  });

  res.json({
    date: todayStr,
    achievementRate: count > 0 ? totalRate / count : 0.0
  });
});

// --- Search ---
app.get('/api/study/search', async (req, res) => {
  const query = (req.query.query || '').toLowerCase();
  if (!query) return res.json([]);

  // In a real scenario, we'd use PostgreSQL full-text search or ILIKE
  // For simplicity here, we fetch and filter, though not ideal for large DBs

  const { data: subjects, error: subError } = await supabase.from('subjects').select('*');
  const { data: schedules, error: schError } = await supabase.from('weekly_schedules').select('*');
  const { data: achievements, error: achError } = await supabase.from('daily_achievements').select('*');

  if (subError || schError || achError) return res.status(400).json({ subError, schError, achError });

  const results = [];

  // Subject search
  (subjects || []).forEach(s => {
    if (s.name.toLowerCase().includes(query)) {
      results.push({
        type: 'SUBJECT',
        subjectName: s.name,
        subjectColor: s.color,
        content: `과목: ${s.name}`
      });
    }
  });

  // Plan search
  const planResults = [];
  (schedules || []).forEach(ps => {
    if (ps.plan_content && ps.plan_content.toLowerCase().includes(query)) {
      const sub = subjects.find(s => s.id === ps.subject_id);
      planResults.push({
        type: 'PLAN',
        date: ps.date,
        subjectName: sub ? sub.name : 'Unknown',
        subjectColor: sub ? sub.color : '#000',
        content: ps.plan_content
      });
    }
  });

  // Note search
  const noteResults = [];
  (achievements || []).forEach(da => {
    if (da.note && da.note.toLowerCase().includes(query)) {
      const sub = subjects.find(s => s.id === da.subject_id);
      noteResults.push({
        type: 'NOTE',
        date: da.date,
        subjectName: sub ? sub.name : 'Unknown',
        subjectColor: sub ? sub.color : '#000',
        content: da.note
      });
    }
  });

  const combined = [...planResults, ...noteResults].sort((a, b) => b.date.localeCompare(a.date));
  res.json([...results, ...combined]);
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}
