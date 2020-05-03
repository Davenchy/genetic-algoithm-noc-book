import module = require("p5");
import * as p5Global from "p5/global";

export = module;
export as namespace module;

declare global {
  interface Window {
    setup: () => void;
    draw: () => void;
    p5: typeof module;
  }
}
