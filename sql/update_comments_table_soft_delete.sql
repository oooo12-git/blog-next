-- 기존 comments 테이블을 소프트 삭제 구조로 업데이트

-- 1. author와 content 컬럼을 nullable로 변경
ALTER TABLE comments ALTER COLUMN author DROP NOT NULL;
ALTER TABLE comments ALTER COLUMN content DROP NOT NULL;

-- 2. 기존 CASCADE 제약조건 제거 및 새로운 제약조건 추가
-- 먼저 기존 외래키 제약조건 이름 확인 후 삭제
-- (실제 제약조건 이름은 데이터베이스에서 확인 필요)
-- ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_parent_id_fkey;

-- 새로운 외래키 제약조건 추가 (CASCADE 없이)
-- ALTER TABLE comments ADD CONSTRAINT comments_parent_id_fkey 
--   FOREIGN KEY (parent_id) REFERENCES comments(id);

-- 3. 소프트 삭제를 위한 함수 생성 (선택사항)
CREATE OR REPLACE FUNCTION soft_delete_comment(comment_id UUID, user_email VARCHAR)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) AS $$
BEGIN
  -- 댓글 존재 여부와 이메일 일치 확인
  IF NOT EXISTS (
    SELECT 1 FROM comments 
    WHERE id = comment_id 
    AND email = user_email 
    AND author IS NOT NULL 
    AND content IS NOT NULL
  ) THEN
    RETURN QUERY SELECT FALSE, '댓글을 찾을 수 없거나 이메일이 일치하지 않습니다.'::TEXT;
    RETURN;
  END IF;

  -- 소프트 삭제 실행
  UPDATE comments 
  SET author = NULL, content = NULL, updated_at = NOW()
  WHERE id = comment_id;

  RETURN QUERY SELECT TRUE, '댓글이 삭제되었습니다.'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- 4. 삭제되지 않은 댓글만 조회하는 뷰 생성 (선택사항)
CREATE OR REPLACE VIEW active_comments AS
SELECT * FROM comments
WHERE author IS NOT NULL AND content IS NOT NULL;

-- 업데이트 완료 확인
SELECT 'comments 테이블이 소프트 삭제 구조로 업데이트되었습니다.' as message; 