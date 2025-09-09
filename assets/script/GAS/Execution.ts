import { GASComponent } from "./GASComponent";

export type Execution = (source: GASComponent, target: GASComponent) => void;