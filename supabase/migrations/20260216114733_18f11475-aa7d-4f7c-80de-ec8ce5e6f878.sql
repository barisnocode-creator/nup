
-- Add new columns to custom_domains for automatic DNS configuration
ALTER TABLE public.custom_domains
  ADD COLUMN IF NOT EXISTS dns_provider text,
  ADD COLUMN IF NOT EXISTS auto_configured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS dns_snapshot jsonb,
  ADD COLUMN IF NOT EXISTS action_fingerprint text;

-- Add index for idempotency lookups
CREATE INDEX IF NOT EXISTS idx_custom_domains_fingerprint ON public.custom_domains (action_fingerprint) WHERE action_fingerprint IS NOT NULL;
