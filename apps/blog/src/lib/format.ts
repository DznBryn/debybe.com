export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateISO(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toISOString();
}
