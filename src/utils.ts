export function isEven(num: number): boolean {
  return num % 2 === 0;
}

export function formatUser(name: string, role: string): string {
  if (!name) return 'Guest';
  return `${name} (${role})`;
}