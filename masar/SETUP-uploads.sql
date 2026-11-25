-- مسار التقدم: تفعيل رفع مشاريع الطلاب المتميزين (صور وملفات) — يُشغَّل مرة واحدة في Supabase > SQL Editor > Run
-- مخزن خاص (غير عام): الطالب يرفع فقط، والمعلم المسجل في masar_teachers وحده يعرض الملفات ويحذفها.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('masar-uploads', 'masar-uploads', false, 10485760,
  array['image/jpeg','image/png','image/webp','image/heic','image/heif','image/gif','application/pdf',
        'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "masar uploads student insert" on storage.objects;
create policy "masar uploads student insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'masar-uploads' and name like 't/%');

drop policy if exists "masar uploads teacher read" on storage.objects;
create policy "masar uploads teacher read" on storage.objects
  for select to authenticated
  using (bucket_id = 'masar-uploads' and exists (select 1 from public.masar_teachers t where t.user_id = auth.uid()));

drop policy if exists "masar uploads teacher delete" on storage.objects;
create policy "masar uploads teacher delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'masar-uploads' and exists (select 1 from public.masar_teachers t where t.user_id = auth.uid()));
