ALTER TABLE projects
  RENAME COLUMN netlify_site_id TO vercel_project_id;
ALTER TABLE projects
  RENAME COLUMN netlify_url TO vercel_url;
ALTER TABLE projects
  RENAME COLUMN netlify_custom_domain TO vercel_custom_domain;