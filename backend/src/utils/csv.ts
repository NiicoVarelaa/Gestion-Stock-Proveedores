const escapeCsv = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export interface CsvColumn {
  header: string;
  value: (row: Record<string, unknown>) => unknown;
}

export const toCsv = (columns: CsvColumn[], rows: Record<string, unknown>[]): string => {
  const header = columns.map((c) => escapeCsv(c.header)).join(',');
  const body = rows.map((row) => columns.map((c) => escapeCsv(c.value(row))).join(','));
  return [header, ...body].join('\r\n');
};