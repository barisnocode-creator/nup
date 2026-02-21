CREATE OR REPLACE FUNCTION public.get_domain_dns_instructions(domain_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  domain_record RECORD;
  user_id uuid;
BEGIN
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  SELECT cd.id, cd.domain, cd.verification_token, cd.status, p.user_id as owner_id
  INTO domain_record
  FROM public.custom_domains cd
  INNER JOIN public.projects p ON p.id = cd.project_id
  WHERE cd.id = domain_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Domain not found';
  END IF;
  
  IF domain_record.owner_id != user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  RETURN jsonb_build_object(
    'domain', domain_record.domain,
    'status', domain_record.status,
    'records', jsonb_build_array(
      jsonb_build_object(
        'type', 'A',
        'label', 'A Kaydı (Root Domain)',
        'host', '@',
        'value', '185.158.133.1'
      ),
      jsonb_build_object(
        'type', 'A', 
        'label', 'A Kaydı (WWW)',
        'host', 'www',
        'value', '185.158.133.1'
      ),
      jsonb_build_object(
        'type', 'TXT',
        'label', 'TXT Kaydı (Doğrulama)',
        'host', '_lovable',
        'value', 'lovable_verify=' || domain_record.verification_token
      )
    )
  );
END;
$function$;