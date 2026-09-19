create policy "officers upload own evidence" on storage.objects for insert to authenticated
with check (bucket_id = 'inspection-evidence' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "officers read own evidence" on storage.objects for select to authenticated
using (bucket_id = 'inspection-evidence' and (storage.foldername(name))[1] = auth.uid()::text);