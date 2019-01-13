CREATE OR REPLACE FUNCTION public.RemoveDoctor(ID int) RETURNS void
LANGUAGE plpgsql
AS $plpgsql$
DECLARE 
  vxType Text;
  vxRc int;
BEGIN
  Select type into vxType from public.users where user_id = ID;
  if vxType = 'doctor' then
  UPDATE public.users SET type = 'user' WHERE user_id = ID;
  GET DIAGNOSTICS vxRc = ROW_COUNT;
  if vxRc = 0 Then 
  return;
  end if;
  UPDATE public.doctors SET active = false WHERE doctor_id = ID;
  GET DIAGNOSTICS vxRc = ROW_COUNT;
  if vxRc = 0 Then 
  return;
  end if; 
end if;
END;
$plpgsql$;