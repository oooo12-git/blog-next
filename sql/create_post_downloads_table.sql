CREATE TABLE
  post_downloads (
    post_slug TEXT PRIMARY KEY,
    downloads BIGINT DEFAULT 0
  );

-- RLS (Row Level Security) 정책 설정
ALTER TABLE post_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on post_downloads" ON post_downloads
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on post_downloads" ON post_downloads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on post_downloads" ON post_downloads
    FOR UPDATE USING (true);
