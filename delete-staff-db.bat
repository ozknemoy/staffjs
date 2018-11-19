chcp 1251
set client_encoding='win1251';
psql -U postgres -f %~dp0delete-staff.sql staffjs

::psql  -U postgres -d staffjs;
:: psql DROP TABLE public."staff-army" cascade;   & ::  for inline commenttttttttttt
:: select 'drop table "staffjs-army" cascade;' from staffjs;
:: psql  -U postgres -d staffjs -c 'DROP TABLE public."staff-army"'
:: echo "select 'DROP TABLE public."staff-army", public."staff-vacation";' from staffjs
pause