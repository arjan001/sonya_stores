-- Create page_views table for tracking website traffic
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  browser_name TEXT,
  browser_version TEXT,
  device_type TEXT,
  country TEXT DEFAULT 'KE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create traffic_sources table
CREATE TABLE IF NOT EXISTS traffic_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  page_path TEXT,
  page_views INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create browser_stats table
CREATE TABLE IF NOT EXISTS browser_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  browser_name TEXT NOT NULL,
  page_views INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_traffic_sources_source ON traffic_sources(source);
