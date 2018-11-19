/*DROP TABLE IF EXISTS
  "staff-army",
   "staff-work-exp" cascade;*/

/*это просто для наглядности*/
select 'Executing: DROP TABLE IF EXISTS "' || tablename || '" CASCADE'
from pg_tables
where tablename LIKE '%staff-%';

/* сначала зависимые */
DO $$ DECLARE
  r RECORD;
BEGIN
  -- if the schema you operate on is not "current", you will want to
  -- replace current_schema() in query with 'schematodeletetablesfrom'
  -- *and* update the generate 'DROP...' accordingly.
  FOR r IN (SELECT tablename FROM pg_tables WHERE tablename LIKE '%staff-%') LOOP
    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END $$;

DROP TABLE IF EXISTS "staff" cascade;