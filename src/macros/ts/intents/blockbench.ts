/// <reference types="blockbench-types" />

import { Intent, IntentParameterTypes as Type, IntentParameters, IntentResult } from "../intent";

const text = (value: IntentResult) => String(value ?? "").trim();
const field = (name: string, type: Type = Type.Text) => ({ name, type });
const animationClass = () => (globalThis as any).Animation as { new (data?: AnimationOptions): _Animation; all: _Animation[] };

function selectedProject(params: IntentParameters): ModelProject {
  const key = text(params.project);
  const project = key ? ModelProject.all.find((item) => item.uuid === key || item.name === key) : Project;
  if (!project) throw new Error(key ? `Project not found: ${key}` : "No project is open");
  if (project !== Project && !project.select()) throw new Error(`Could not select project: ${key}`);
  return project;
}

function find<T extends { uuid?: string; name?: string }>(items: T[], value: IntentResult, kind: string): T {
  const key = text(value);
  if (!key) throw new Error(`${kind} is required`);
  const item = items.find((entry) => entry.uuid === key || entry.name === key);
  if (!item) throw new Error(`${kind} not found: ${key}`);
  return item;
}

function codec(value: IntentResult): Codec {
  const key = text(value) || "project";
  const selected = Codecs[key];
  if (!selected) throw new Error(`Codec not found: ${key}`);
  return selected;
}

function vector(value: IntentResult, fallback: [number, number, number]): [number, number, number] {
  if (value == null || value === "") return fallback;
  const parts = (Array.isArray(value) ? value : text(value).split(/[\s,]+/)).map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) throw new Error("Expected three coordinates");
  return parts as [number, number, number];
}

function editableElement(value: IntentResult): Cube | Group {
  if (!Project) throw new Error("No project is open");
  const key = text(value);
  if (!key) throw new Error("Element is required");
  const element = [...Cube.all, ...Group.all].find((item) => item.uuid === key || item.name === key);
  if (!element) throw new Error(`Cube or group not found: ${key}`);
  return element;
}

function elementProperty(element: Cube | Group, property: string): IntentResult {
  switch (property) {
    case "name": return element.name;
    case "visibility": return element.visibility;
    case "rotation": return [...element.rotation];
    case "pivot": return [...element.origin];
    case "position": return [...(element instanceof Cube ? element.from : element.origin)];
    case "size":
      if (element instanceof Cube) return element.to.map((value, index) => value - element.from[index]);
      throw new Error("Size is only available for cubes");
    default: throw new Error(`Unknown element property: ${property}`);
  }
}

function booleanValue(value: IntentResult): boolean {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  throw new Error("Visibility must be true or false");
}

const modelReadType = (path: string): "text" | "buffer" => /\.(glb|bin)$/i.test(path) ? "buffer" : "text";

new Intent("add_flag", {
  category: "blockbench", parameters: [field("flag")],
  perform(params) { const flag = text(params.flag); if (!flag) throw new Error("Flag is required"); Blockbench.addFlag(flag); return flag; },
});
new Intent("remove_flag", {
  category: "blockbench", parameters: [field("flag")],
  perform(params) { const flag = text(params.flag); if (!flag) throw new Error("Flag is required"); Blockbench.removeFlag(flag); return flag; },
});
new Intent("get_flags", {
  category: "blockbench", perform() { return [...Blockbench.flags].map(String); },
});

new Intent("get_setting_value", {
  category: "blockbench", parameters: [field("setting")],
  perform(params) { const setting = settings[text(params.setting)]; if (!setting) throw new Error(`Setting not found: ${params.setting}`); return setting.value; },
});
new Intent("set_setting_value", {
  category: "blockbench", parameters: [field("setting"), field("value")],
  perform(params) {
    const setting = settings[text(params.setting)];
    if (!setting) throw new Error(`Setting not found: ${params.setting}`);
    const original = setting.value;
    const value = typeof original === "boolean" ? params.value === true || params.value === "true" : typeof original === "number" ? Number(params.value) : text(params.value);
    if (typeof value === "number" && !Number.isFinite(value)) throw new Error("Setting value must be a number");
    setting.set(value);
    return setting.value;
  },
});

new Intent("select_project", {
  category: "blockbench", parameters: [field("project")],
  perform(params) { return selectedProject(params).name; },
});
new Intent("close_project", {
  category: "blockbench", parameters: [field("project")],
  async perform(params) { return selectedProject(params).close(); },
});
new Intent("export_project", {
  category: "blockbench", parameters: [field("project"), field("export")],
  perform(params) { selectedProject(params); codec(params.export).export(); return true; },
});
new Intent("import_project", {
  category: "blockbench", parameters: [field("file")],
  async perform(params) {
    const path = text(params.file);
    if (path && Blockbench.isWeb) throw new Error("Importing a file path requires desktop Blockbench");
    if (path) {
      return new Promise((resolve, reject) => Blockbench.read([path], { readtype: modelReadType(path) }, (files) => {
        try { if (!files?.length) throw new Error(`Could not read: ${path}`); loadModelFile(files[0], {}); resolve(files[0].name); }
        catch (error) { reject(error); }
      }));
    }
    return new Promise((resolve, reject) => Blockbench.import({ type: "Model", extensions: ["bbmodel", "json", "obj", "gltf", "glb"], readtype: modelReadType }, (files) => {
      try { if (!files?.length) return resolve(undefined); loadModelFile(files[0], {}); resolve(files[0].name); }
      catch (error) { reject(error); }
    }));
  },
});
new Intent("convert_format", {
  category: "blockbench", parameters: [field("project"), field("format")],
  perform(params) {
    selectedProject(params);
    const format = Formats[text(params.format)];
    if (!format) throw new Error(`Format not found: ${params.format}`);
    format.convertTo();
    return format.id;
  },
});
new Intent("run_blockbench_action", {
  category: "blockbench", parameters: [field("action")],
  perform(params) {
    const id = text(params.action);
    const action = BarItems[id];
    if (!(action instanceof Action)) throw new Error(`Action not found: ${id}`);
    return action.trigger();
  },
});

new Intent("add_animation", {
  category: "blockbench", parameters: [field("project"), field("animation")],
  perform(params) { selectedProject(params); const animation = new (animationClass())({ name: text(params.animation) || "animation" }).add(true); return animation.uuid; },
});
new Intent("remove_animation", {
  category: "blockbench", parameters: [field("project"), field("animation")],
  perform(params) { selectedProject(params); const animation = find(animationClass().all, params.animation, "Animation"); animation.remove(true); return animation.uuid; },
});

new Intent("add_cube", {
  category: "blockbench", parameters: [field("project"), field("cube"), field("from"), field("to"), field("group")],
  perform(params) {
    selectedProject(params);
    const parent = text(params.group) ? find(Group.all, params.group, "Group") : undefined;
    Undo.initEdit({ elements: [] });
    const cube = new Cube({ name: text(params.cube) || "cube", from: vector(params.from, [0, 0, 0]), to: vector(params.to, [1, 1, 1]) }).addTo(parent).init();
    Undo.finishEdit("Add cube", { elements: [cube] });
    return cube.uuid;
  },
});
new Intent("remove_cube", {
  category: "blockbench", parameters: [field("project"), field("cube")],
  perform(params) {
    selectedProject(params);
    const cube = find(Cube.all, params.cube, "Cube");
    Undo.initEdit({ elements: [cube] });
    cube.remove();
    Undo.finishEdit("Remove cube", { elements: [] });
    return cube.uuid;
  },
});
new Intent("add_group", {
  category: "blockbench", parameters: [field("project"), field("group"), field("parent")],
  perform(params) {
    selectedProject(params);
    const parent = text(params.parent) ? find(Group.all, params.parent, "Parent group") : undefined;
    Undo.initEdit({ outliner: true });
    const group = new Group({ name: text(params.group) || "group" }).addTo(parent).init();
    Undo.finishEdit("Add group", { outliner: true });
    return group.uuid;
  },
});
new Intent("remove_group", {
  category: "blockbench", parameters: [field("project"), field("group")],
  perform(params) { selectedProject(params); const group = find(Group.all, params.group, "Group"); const id = group.uuid; group.remove(true); return id; },
});
new Intent("open_group", {
  category: "blockbench", parameters: [field("project"), field("group")],
  perform(params) { selectedProject(params); const group = find(Group.all, params.group, "Group"); group.openUp(); return group.uuid; },
});

new Intent("on_event", {
  category: "blockbench", parameters: [field("event")],
  perform(params) {
    const event = text(params.event);
    if (!event) throw new Error("Event name is required");
    return new Promise((resolve) => Blockbench.once(event as any, (data: any) => resolve(data ?? true)));
  },
});
new Intent("show_preview_scene", {
  category: "blockbench", parameters: [field("preview")],
  perform(params) {
    const id = text(params.preview);
    if (!id) { PreviewScene.active?.unselect(); return ""; }
    const scene = PreviewScene.scenes[id];
    if (!scene) throw new Error(`Preview scene not found: ${id}`);
    scene.select();
    return scene.id;
  },
});

new Intent("add_texture_group", {
  category: "blockbench", parameters: [field("project"), field("group")],
  perform(params) { selectedProject(params); const group = new TextureGroup({ name: text(params.group) || "group" }).add(); return group.uuid; },
});
new Intent("remove_texture_group", {
  category: "blockbench", parameters: [field("project"), field("group")],
  perform(params) { selectedProject(params); const group = find(TextureGroup.all, params.group, "Texture group"); const id = group.uuid; group.remove(); return id; },
});
new Intent("add_texture_layer", {
  category: "blockbench", parameters: [field("project"), field("texture"), field("layer")],
  perform(params) {
    selectedProject(params);
    const texture = find(Texture.all, params.texture, "Texture");
    const layer = new TextureLayer({ name: text(params.layer) || "layer" }, texture);
    layer.addForEditing();
    return layer.uuid;
  },
});
new Intent("remove_texture_layer", {
  category: "blockbench", parameters: [field("project"), field("texture"), field("layer")],
  perform(params) {
    selectedProject(params);
    const texture = find(Texture.all, params.texture, "Texture");
    const layer = find(texture.layers, params.layer, "Texture layer");
    const id = layer.uuid;
    layer.remove(true);
    return id;
  },
});

new Intent("get_project_items", {
  category: "blockbench", parameters: [field("items", Type.Enum)],
  perform(params) {
    switch (params.items) {
      case "projects": return ModelProject.all.map((item) => item.uuid);
      case "selected_cubes": return Cube.selected.map((item) => item.uuid);
      case "selected_elements": return OutlinerElement.selected.map((item) => item.uuid);
      default: throw new Error(`Unknown item collection: ${params.items}`);
    }
  },
}).addEnum("items", ["projects", "selected_cubes", "selected_elements"]);

new Intent("select_elements", {
  category: "blockbench",
  description: "Select outliner elements or groups by UUID or name. Accepts a list, or comma-separated or newline-separated names. Leave Elements empty to use the previous action's output.",
  parameters: [field("elements"), field("mode", Type.Enum)],
  perform(params, _macro, result) {
    if (!Project) throw new Error("No project is open");
    const mode = text(params.mode) || "replace";
    if (mode !== "replace" && mode !== "add") throw new Error(`Unknown selection mode: ${mode}`);
    const input = params.elements === "" || params.elements == null ? result : params.elements;
    const keys = (Array.isArray(input) ? input : text(input).split(/[,\r\n]+/))
      .map(text).filter(Boolean);
    const nodes = [...new Set(keys.map((key) => {
      const node = Outliner.nodes.find((item) => item.uuid === key || item.name === key);
      if (!node) throw new Error(`Outliner element not found: ${key}`);
      if (node.locked) throw new Error(`Outliner element is locked: ${key}`);
      return node;
    }))];
    Undo.initSelection();
    if (mode === "replace") unselectAll();
    for (const node of nodes) node.select({ ctrlOrCmd: true } as Event);
    Undo.finishSelection("Select elements");
    return nodes.map((node) => node.uuid);
  },
}).addEnum("mode", ["replace", "add"]);

new Intent("filter_project_items", {
  category: "blockbench",
  description: "Find cubes, groups, textures, or animations by name, visibility, and parent group. Returns their UUIDs.",
  parameters: [field("items", Type.Enum), field("name"), field("visibility", Type.Enum), field("parent")],
  perform(params) {
    if (!Project) throw new Error("No project is open");
    const collection = text(params.items);
    const items = collection === "cubes" ? Cube.all
      : collection === "groups" ? Group.all
      : collection === "textures" ? Texture.all
      : collection === "animations" ? animationClass().all
      : undefined;
    if (!items) throw new Error(`Unknown project item collection: ${collection}`);
    const name = text(params.name).toLowerCase();
    const visibility = text(params.visibility);
    const parent = text(params.parent);
    if (visibility && !["visible", "hidden"].includes(visibility)) throw new Error(`Unknown visibility filter: ${visibility}`);
    if (visibility && collection === "animations") throw new Error("Animations do not support a visibility filter");
    if (parent && collection === "animations") throw new Error("Animations do not have a parent group");
    const textureGroup = parent && collection === "textures"
      ? TextureGroup.all.find((entry) => entry.uuid === parent || entry.name === parent)
      : undefined;
    const matches = items.filter((item) => {
      if (name && !item.name.toLowerCase().includes(name)) return false;
      const visible = collection === "textures" ? (item as Texture).visible : (item as Cube | Group).visibility;
      if (visibility && visible !== (visibility === "visible")) return false;
      if (parent) {
        if (collection === "textures") {
          if (!textureGroup || (item as Texture).group !== textureGroup.uuid) return false;
        } else {
          const group = (item as Cube | Group).parent;
          if (parent === "root" ? group !== "root" : group === "root" || (group.uuid !== parent && group.name !== parent)) return false;
        }
      }
      return true;
    });
    return matches.map((item) => item.uuid);
  },
}).addEnum("items", ["cubes", "groups", "textures", "animations"])
  .addEnum("visibility", ["", "visible", "hidden"]);

new Intent("get_element_property", {
  category: "blockbench",
  description: "Read a cube or group property. Vectors are returned as three numbers.",
  parameters: [field("element"), field("property", Type.Enum)],
  perform(params) { return elementProperty(editableElement(params.element), text(params.property)); },
}).addEnum("property", ["name", "visibility", "position", "rotation", "size", "pivot"]);

new Intent("set_element_property", {
  category: "blockbench",
  description: "Set a cube or group property. Enter vectors as x,y,z. Position moves a cube without changing its size; size applies to cubes only.",
  parameters: [field("element"), field("property", Type.Enum), field("value")],
  perform(params) {
    const element = editableElement(params.element);
    const property = text(params.property);
    if (!["name", "visibility", "position", "rotation", "size", "pivot"].includes(property)) throw new Error(`Unknown element property: ${property}`);
    if (property === "size" && !(element instanceof Cube)) throw new Error("Size is only available for cubes");
    const value = property === "name" ? text(params.value)
      : property === "visibility" ? booleanValue(params.value)
      : vector(params.value, [0, 0, 0]);
    if (property === "name" && !value) throw new Error("Element name is required");
    if (property === "size" && (value as number[]).some((part) => part < 0)) throw new Error("Cube size cannot be negative");
    Undo.initEdit({ outliner: true, elements: element instanceof Cube ? [element] : [] });
    switch (property) {
      case "name": element.name = value as string; break;
      case "visibility": element.visibility = value as boolean; break;
      case "rotation": element.rotation = value as [number, number, number]; break;
      case "pivot": element.origin = value as [number, number, number]; break;
      case "position": {
        const position = value as [number, number, number];
        if (element instanceof Cube) {
          const offset = position.map((part, index) => part - element.from[index]);
          element.from = position;
          element.to = element.to.map((part, index) => part + offset[index]) as [number, number, number];
          element.origin = element.origin.map((part, index) => part + offset[index]) as [number, number, number];
        } else element.origin = position;
        break;
      }
      case "size": {
        const cube = element as Cube;
        cube.to = (value as number[]).map((part, index) => cube.from[index] + part) as [number, number, number];
        break;
      }
    }
    Canvas.updateAll();
    Undo.finishEdit(`Set element ${property}`);
    return elementProperty(element, property);
  },
}).addEnum("property", ["name", "visibility", "position", "rotation", "size", "pivot"]);

new Intent("set_cube_dimension", {
  category: "blockbench", parameters: [field("cube"), field("axis", Type.Enum), field("size", Type.Number)],
  perform(params) {
    if (!Project) throw new Error("No project is open");
    const cube = find(Cube.all, params.cube, "Cube");
    const axis = { x: 0, y: 1, z: 2 }[text(params.axis) as "x" | "y" | "z"];
    const size = Number(params.size);
    if (axis === undefined || !Number.isFinite(size) || size < 0) throw new Error("Invalid cube dimension");
    Undo.initEdit({ elements: [cube] });
    cube.to[axis] = cube.from[axis] + size;
    Canvas.updateView({ elements: [cube], element_aspects: { geometry: true } });
    Undo.finishEdit("Set cube dimension");
    return cube.uuid;
  },
}).addEnum("axis", ["x", "y", "z"]);

let previousVisibility: Map<string, boolean> | undefined;
new Intent("set_element_visibility", {
  category: "blockbench", parameters: [field("element"), field("mode", Type.Enum)],
  perform(params) {
    if (!Project) throw new Error("No project is open");
    const mode = text(params.mode);
    if (mode === "restore") {
      for (const element of OutlinerElement.all) {
        const visible = previousVisibility?.get(element.uuid);
        if (visible !== undefined) element.scene_object.visible = visible;
      }
      previousVisibility = undefined;
      return true;
    }
    const item = find(OutlinerElement.all, params.element, "Element");
    if (mode === "isolate") {
      previousVisibility ??= new Map(OutlinerElement.all.map((element) => [element.uuid, element.scene_object.visible]));
      for (const element of OutlinerElement.all) element.scene_object.visible = element === item;
    } else if (mode === "show" || mode === "hide") item.scene_object.visible = mode === "show";
    else throw new Error(`Unknown visibility mode: ${mode}`);
    return item.uuid;
  },
}).addEnum("mode", ["show", "hide", "isolate", "restore"]);
