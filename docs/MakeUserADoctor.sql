CREATE OR REPLACE FUNCTION public.MakeUserADoctor(ID int, speciality int, experience int, information TEXT DEFAULT NULL) RETURNS void
LANGUAGE plpgsql
AS $plpgsql$
DECLARE 
  vxActive bool;
  vxType Text;
  vxRc int;
BEGIN
  Select type into vxType from public.users where user_id = ID;
  if vxType = 'user' then
  UPDATE public.users SET type = 'doctor' WHERE user_id = ID;  
  Select active into vxActive from public.doctors where doctor_id=ID and speciality_id = speciality;
  GET DIAGNOSTICS vxRc = ROW_COUNT;
  if vxRc = 0 Then 
  INSERT INTO public.doctors VALUES
    (ID, speciality, experience, information, true);
  end if;
if  vxActive !=true then
  UPDATE public.doctors SET active = true WHERE doctor_id = ID and speciality_id = speciality;
end if; 
end if;
END;
$plpgsql$;