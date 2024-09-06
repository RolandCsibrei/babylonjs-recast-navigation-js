import { Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Texture, Engine, ArcRotateCamera } from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

export class AppOne {
    engine: Engine;
    scene: Scene;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas)
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
        this.scene = createScene(this.engine, this.canvas)

    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this.scene.debugLayer.show({ overlay: true });
        } else {
            this.scene.debugLayer.hide();
        }
    }

    run() {
        this.debug(true);
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}

const createScene = function (engine: Engine, canvas: HTMLCanvasElement) {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("camera1", Math.PI / 3, Math.PI / 4, 30, new Vector3(0, 0, 0));
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    const sphere = MeshBuilder.CreateBox("box", { size: 6 }, scene);
    sphere.position.y = 4;

    const ground = MeshBuilder.CreateGround("ground", { width: 12, height: 12 }, scene);
    const groundMaterial = new StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
    ground.material = groundMaterial;
    groundMaterial.bumpTexture = new Texture("./normal.jpg", scene);


    const redMaterial = new StandardMaterial("redMaterial", scene);
    redMaterial.diffuseColor = new Color3(1, 0, 0);
    sphere.material = redMaterial;

    return scene;
};