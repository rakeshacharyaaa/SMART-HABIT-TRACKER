-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  color VARCHAR(20) DEFAULT 'primary',
  category VARCHAR(100),
  target_value INTEGER DEFAULT 1,
  target_unit VARCHAR(50) DEFAULT 'times',
  frequency VARCHAR(20) DEFAULT 'daily', -- daily, weekly, monthly
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create habit_completions table to track daily progress
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  completion_date DATE NOT NULL,
  value INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, completion_date)
);

-- Create habit_streaks table to track streaks
CREATE TABLE IF NOT EXISTS habit_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completion_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions(completion_date);
CREATE INDEX IF NOT EXISTS idx_habit_streaks_habit_id ON habit_streaks(habit_id);

-- Insert sample data for demo purposes
INSERT INTO users (id, email, name, bio) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'alex@example.com', 'Alex Johnson', 'Building better habits one day at a time. Passionate about personal growth and mindfulness.')
ON CONFLICT (email) DO NOTHING;

-- Insert sample habits
INSERT INTO habits (id, user_id, name, description, icon, color, category, target_value, target_unit) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Morning Meditation', '10 minutes of mindfulness', '🧘‍♂️', 'primary', 'Wellness', 10, 'minutes'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Drink Water', '8 glasses throughout the day', '💧', 'accent', 'Health', 8, 'glasses'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Read Books', '30 minutes of reading', '📚', 'secondary', 'Learning', 30, 'minutes'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Exercise', '45 minutes workout', '💪', 'primary', 'Fitness', 45, 'minutes'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Gratitude Journal', 'Write 3 things I am grateful for', '📝', 'secondary', 'Mindfulness', 3, 'items'),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Learn Spanish', '15 minutes language practice', '🇪🇸', 'accent', 'Learning', 15, 'minutes')
ON CONFLICT (id) DO NOTHING;

-- Insert sample habit streaks
INSERT INTO habit_streaks (habit_id, user_id, current_streak, longest_streak, last_completion_date) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 12, 15, CURRENT_DATE),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 8, 12, CURRENT_DATE - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 15, 20, CURRENT_DATE),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 5, 8, CURRENT_DATE - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 20, 25, CURRENT_DATE),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 7, 10, CURRENT_DATE - INTERVAL '1 day')
ON CONFLICT (habit_id, user_id) DO NOTHING;

-- Insert some sample completions for today
INSERT INTO habit_completions (habit_id, user_id, completion_date, value) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 10),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 5),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 45),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 3)
ON CONFLICT (habit_id, completion_date) DO NOTHING;
