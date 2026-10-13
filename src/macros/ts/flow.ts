import type { IntentData } from "./intent";

export type FlowNode =
  | { kind: "action"; step: IntentData }
  | { kind: "if"; step: IntentData; yes: FlowNode[]; no: FlowNode[] }
  | { kind: "try"; step: IntentData; body: FlowNode[]; onError: FlowNode[] }
  | { kind: "repeat" | "repeat_each"; step: IntentData; children: FlowNode[] };

export const BLOCK_END: Record<string, string> = {
  if: "end_if",
  repeat: "end_repeat",
  repeat_each: "end_repeat_each",
  try: "end_try",
};

export const BLOCK_MARKERS = new Set(["otherwise", "on_error", ...Object.values(BLOCK_END)]);

export function matchingEnd(steps: IntentData[], start: number): number {
  const end = BLOCK_END[steps[start]?.type];
  if (!end) return start;
  const stack = [end];
  for (let index = start + 1; index < steps.length; index++) {
    const type = steps[index].type;
    if (BLOCK_END[type]) stack.push(BLOCK_END[type]);
    else if (type === stack[stack.length - 1]) {
      stack.pop();
      if (!stack.length) return index;
    }
  }
  return start;
}

export function blockDepths(steps: IntentData[]): number[] {
  const stack: string[] = [];
  return steps.map((step) => {
    const type = step.type;
    if (type === stack[stack.length - 1]) stack.pop();
    const depth = type === "otherwise" || type === "on_error" ? Math.max(0, stack.length - 1) : stack.length;
    if (BLOCK_END[type]) stack.push(BLOCK_END[type]);
    return depth;
  });
}

export function parseFlow(steps: IntentData[]): FlowNode[] {
  let index = 0;
  function sequence(stops: Set<string>): FlowNode[] {
    const nodes: FlowNode[] = [];
    while (index < steps.length && !stops.has(steps[index].type)) {
      const step = steps[index++];
      if (BLOCK_MARKERS.has(step.type)) throw new Error(`Unexpected ${step.type.replace(/_/g, " ")}`);
      if (step.type === "try" && matchingEnd(steps, index - 1) === index - 1) throw new Error("Try is missing End Try");
      if (!BLOCK_END[step.type] || matchingEnd(steps, index - 1) === index - 1) {
        nodes.push({ kind: "action", step });
        continue;
      }
      if (step.type === "if") {
        const yes = sequence(new Set(["otherwise", "end_if"]));
        let no: FlowNode[] = [];
        if (steps[index]?.type === "otherwise") {
          index++;
          no = sequence(new Set(["end_if"]));
        }
        if (steps[index]?.type !== "end_if") throw new Error("If is missing End If");
        index++;
        nodes.push({ kind: "if", step, yes, no });
      } else if (step.type === "try") {
        const body = sequence(new Set(["on_error", "end_try"]));
        if (steps[index]?.type !== "on_error") throw new Error("Try is missing On Error");
        index++;
        const onError = sequence(new Set(["end_try"]));
        if (steps[index]?.type !== "end_try") throw new Error("Try is missing End Try");
        index++;
        nodes.push({ kind: "try", step, body, onError });
      } else {
        const children = sequence(new Set([BLOCK_END[step.type]]));
        if (steps[index]?.type !== BLOCK_END[step.type]) throw new Error(`${step.type} is missing its end marker`);
        index++;
        nodes.push({ kind: step.type as "repeat" | "repeat_each", step, children });
      }
    }
    return nodes;
  }
  return sequence(new Set());
}

export function expandLegacyBlocks(steps: IntentData[], id: () => string): IntentData[] {
  const output: IntentData[] = [];
  const parse = (value: unknown): IntentData[] | undefined => {
    if (Array.isArray(value)) return value as IntentData[];
    if (typeof value !== "string") return [];
    try {
      const parsed = JSON.parse(value || "[]");
      return Array.isArray(parsed) ? (parsed as IntentData[]) : undefined;
    } catch {
      return undefined;
    }
  };
  for (let index = 0; index < steps.length; index++) {
    const step = steps[index];
    if (!BLOCK_END[step.type] || matchingEnd(steps, index) > index) {
      output.push(step);
      continue;
    }
    const children = parse(step.params?.actions);
    const otherwise = step.type === "if" ? parse(step.params?.otherwise) : [];
    if (!children || !otherwise) {
      output.push(step);
      continue;
    }
    output.push({ ...step, params: { ...step.params, actions: "", otherwise: "" } });
    output.push(...expandLegacyBlocks(children, id));
    if (step.type === "if") {
      output.push({ type: "otherwise", uuid: id(), params: {} });
      output.push(...expandLegacyBlocks(otherwise, id));
    }
    output.push({ type: BLOCK_END[step.type], uuid: id(), params: {} });
  }
  return output;
}
