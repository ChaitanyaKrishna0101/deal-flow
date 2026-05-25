// localStorage persistence for the multi-step form

const KEY = "fsv_form_data";

export function saveFormData(data: Record<string, unknown>): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadFormData(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export function clearFormData(): void {
  localStorage.removeItem(KEY);
}
