export const VARIABLE_VALUES = {
  result: "$result",
  item: "$item",
  index: "$index",
  askEachTime: "$ask_each_time",
  clipboard: "$clipboard",
  currentDate: "$current_date",
  deviceDetails: "$device_details",
} as const;

export function inputVariable(uuid: string, field: string): string {
  return `$input:${uuid}:${encodeURIComponent(field)}`;
}

export function parseInputVariable(value: unknown): { uuid: string; field: string } | undefined {
  if (typeof value !== "string") return;
  const match = /^\$input:([^:]+):(.+)$/.exec(value);
  if (!match) return;
  try {
    return { uuid: match[1], field: decodeURIComponent(match[2]) };
  } catch {
    return;
  }
}

export function isVariableValue(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (Object.values(VARIABLE_VALUES).includes(value as (typeof VARIABLE_VALUES)[keyof typeof VARIABLE_VALUES]) ||
      !!parseInputVariable(value))
  );
}
