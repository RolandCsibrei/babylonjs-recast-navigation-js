import {
    Scene,
    Vector3,
    HemisphericLight,
    Engine,
    ArcRotateCamera,
    Tools,
} from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

// examples
// import { NavigationSingleThread as NavigationExample } from "./examples/index.single-thread";
import { NavigationCrowd as NavigationExample } from "./examples/index.navmesh-crowd";

export class AppOne {
    private _engine: Engine;
    private _scene: Scene;

    constructor(readonly canvas: HTMLCanvasElement) {
        this._engine = new Engine(canvas);
        window.addEventListener("resize", () => {
            this._engine.resize();
        });
        this._scene = this.createScene(this._engine, this.canvas);

        this._start();
    }

    private _start() {
        const navigation = new NavigationExample(this._scene);
        this._scene.onReadyObservable.addOnce(() => {
            void navigation.init();
        });
    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this._scene.debugLayer.show({ overlay: true });
        } else {
            this._scene.debugLayer.hide();
        }
    }

    run() {
        this.debug(false);

        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
    }

    createScene(engine: Engine, canvas: HTMLCanvasElement) {
        const scene = new Scene(engine);

        const camera = new ArcRotateCamera(
            "camera",
            Tools.ToRadians(180),
            Tools.ToRadians(57.3),
            14,
            Vector3.Zero(),
            scene
        );

        camera.attachControl(canvas, true);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, true);

        const light = new HemisphericLight(
            "light1",
            new Vector3(0, 1, 0),
            scene
        );
        light.intensity = 0.7;

        return scene;
    }
}
