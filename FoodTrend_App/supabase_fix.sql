-- FIX for "handle_new_user" function
-- The previous version caused a 500 Error because it had a "VALUES" clause but no "INSERT INTO".

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    new.email
  );
  RETURN new;
END;
$$;
