/// <reference types="blockbench-types"/>

declare module "blockbench-types" {
  interface ModelProject {
    notes?: string;
    pinned?: boolean;

    close(force: boolean, unpin?: boolean): Promise<void>;
  }
}

declare global {
  interface BlockbenchEventMap {
    show_dialog: { dialog: Dialog };
    hide_dialog: { dialog: Dialog };
    select_cube: Cube[];
    unselect_cube: Cube[];
    profile_changed: any;
  }
}

export {};
