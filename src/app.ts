import { PLATFORM } from "aurelia-pal";
import { Router, RouterConfiguration } from "aurelia-router";

export class App {
  constructor() {}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = "Oileain";
    config.map([
      {
        route: [""],
        moduleId: PLATFORM.moduleName("./components/home"),
        title: "All Islands"
      },
      {
        route: "poi",
        moduleId: PLATFORM.moduleName("./components/poi-detail"),
        name: "pois",
        title: "Island"
      },
      {
        route: "navigator",
        moduleId: PLATFORM.moduleName("./components/navigator"),
        name: "navigator",
        title: "Navigtor"
      }
    ]);
  }
}
