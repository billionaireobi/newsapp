-- Insert sample bookmarks for testing
INSERT INTO public.bookmarks (
  user_id, 
  article_title, 
  article_url, 
  article_image_url, 
  article_description, 
  article_source, 
  article_published_at, 
  collection_name
)
SELECT 
  auth.users.id,
  'Sample Bookmark Article 1',
  'https://example.com/article1',
  'https://picsum.photos/800/400',
  'This is a sample bookmark article for testing purposes.',
  'Example News',
  NOW() - INTERVAL '2 days',
  'Technology'
FROM auth.users
LIMIT 1;

INSERT INTO public.bookmarks (
  user_id, 
  article_title, 
  article_url, 
  article_image_url, 
  article_description, 
  article_source, 
  article_published_at, 
  collection_name
)
SELECT 
  auth.users.id,
  'Sample Bookmark Article 2',
  'https://example.com/article2',
  'https://picsum.photos/800/401',
  'Another sample bookmark article for testing.',
  'Example News',
  NOW() - INTERVAL '1 day',
  'Science'
FROM auth.users
LIMIT 1;

INSERT INTO public.bookmarks (
  user_id, 
  article_title, 
  article_url, 
  article_image_url, 
  article_description, 
  article_source, 
  article_published_at, 
  collection_name
)
SELECT 
  auth.users.id,
  'Sample Bookmark Article 3',
  'https://example.com/article3',
  'https://picsum.photos/800/402',
  'A third sample bookmark article for testing.',
  'Example News',
  NOW() - INTERVAL '3 days',
  'Default'
FROM auth.users
LIMIT 1;

-- Insert sample comments for testing
INSERT INTO public.comments (
  user_id, 
  article_url, 
  content
)
SELECT 
  auth.users.id,
  'https://example.com/article1',
  'This is a great article! Very informative.'
FROM auth.users
LIMIT 1;

INSERT INTO public.comments (
  user_id, 
  article_url, 
  content
)
SELECT 
  auth.users.id,
  'https://example.com/article1',
  'I disagree with some points, but overall it was a good read.'
FROM auth.users
LIMIT 1;

INSERT INTO public.comments (
  user_id, 
  article_url, 
  content
)
SELECT 
  auth.users.id,
  'https://example.com/article2',
  'Looking forward to more articles like this one!'
FROM auth.users
LIMIT 1;
