CREATE OR REPLACE FUNCTION increment_downloads (post_slug_text TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  new_downloads_count BIGINT;
BEGIN
  INSERT INTO post_downloads (post_slug, downloads)
  VALUES (post_slug_text, 1)
  ON CONFLICT (post_slug)
  DO UPDATE SET downloads = post_downloads.downloads + 1
  RETURNING downloads INTO new_downloads_count;

  RETURN new_downloads_count;
END;
$$;
