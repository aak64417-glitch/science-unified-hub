-- مسار التقدم: صلاحيات لوحة التحكم (إضافة الطلاب وحذفهم من لوحة المعلم)
-- يُشغَّل مرة واحدة في Supabase > SQL Editor. يمنح الصلاحية فقط لحسابات المعلمين المسجلة في masar_teachers.

create policy "masar teachers insert students" on public.masar_students
  for insert to authenticated
  with check (exists (select 1 from public.masar_teachers t where t.user_id = auth.uid()));

create policy "masar teachers delete students" on public.masar_students
  for delete to authenticated
  using (exists (select 1 from public.masar_teachers t where t.user_id = auth.uid()));

create policy "masar teachers delete assignments" on public.masar_assignments
  for delete to authenticated
  using (exists (select 1 from public.masar_teachers t where t.user_id = auth.uid()));

-- إن كان جدول النتائج يمنع حذف طالب له نتائج (مفتاح أجنبي)، فاستخدم «إنهاء الخطة» أو الأرشفة بدل الحذف.
