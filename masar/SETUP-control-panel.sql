-- مسار التقدم: صلاحيات لوحة التحكم (إضافة الطلاب وحذفهم من لوحة المعلم — للخطة العلاجية والخطة الإثرائية)
-- يُشغَّل مرة واحدة في Supabase > SQL Editor > New query > Run. يمكن تشغيله أكثر من مرة دون ضرر.
-- يمنح الصلاحية فقط لحسابات المعلمين المسجلة في masar_teachers.

drop policy if exists "masar teachers insert students" on public.masar_students;
create policy "masar teachers insert students" on public.masar_students
  for insert to authenticated
  with check (exists (select 1 from public.masar_teachers t where t.user_id = auth.uid()));

drop policy if exists "masar teachers delete students" on public.masar_students;
create policy "masar teachers delete students" on public.masar_students
  for delete to authenticated
  using (exists (select 1 from public.masar_teachers t where t.user_id = auth.uid()));

drop policy if exists "masar teachers delete assignments" on public.masar_assignments;
create policy "masar teachers delete assignments" on public.masar_assignments
  for delete to authenticated
  using (exists (select 1 from public.masar_teachers t where t.user_id = auth.uid()));

-- إن كان جدول النتائج يمنع حذف طالب له نتائج (مفتاح أجنبي)، فاستخدم «إنهاء الخطة» أو الأرشفة بدل الحذف.
