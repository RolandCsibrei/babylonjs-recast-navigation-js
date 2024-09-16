import { Scene } from "@babylonjs/core/scene";
import {
    INavigationEnginePlugin,
    INavMeshParameters,
} from "@babylonjs/core/Navigation/INavigationEngine";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import {
    createNavMesh,
    setupNavigationPlugin,
} from "../navigation/navigation.single-thread";
import { createDebugNavMesh } from "../navigation/navigation-common";

export class NavigationSingleThread {
    private _navigationPlugin?: INavigationEnginePlugin;

    constructor(private _scene: Scene) {
        this.init();
    }

    public async init() {
        this._navigationPlugin = await setupNavigationPlugin();
        if (!this._navigationPlugin) {
            throw new Error("Unable to setupNavigationPlugin");
        }

        // create navmesh
        const navMeshParameters: INavMeshParameters = {
            cs: 0.2,
            ch: 0.2,
            walkableSlopeAngle: 90,
            walkableHeight: 1.0,
            walkableClimb: 1,
            walkableRadius: 1,
            maxEdgeLen: 4,
            maxSimplificationError: 1.3,
            minRegionArea: 8,
            mergeRegionArea: 20,
            maxVertsPerPoly: 6,
            detailSampleDist: 6,
            detailSampleMaxError: 1,
            borderSize: 0,
        };

        createNavMesh(
            this._navigationPlugin,
            this._getStaticNavMeshes(),
            navMeshParameters
        );

        createDebugNavMesh(
            this._navigationPlugin,
            "nav-mesh-debug",
            this._scene
        );
    }

    private _getStaticNavMeshes() {
        const ground = CreateBox(
            "ground1",
            { width: 10, height: 1, depth: 10 },
            this._scene
        );

        ground.position.set(0, -0.5, 0);

        const boxOne = CreateBox(
            "boxOne",
            { width: 8, height: 2, depth: 1 },
            this._scene
        );
        boxOne.rotation.y = Math.PI / 4;
        boxOne.position.set(-2, 1, 0);

        const boxTwo = CreateBox(
            "boxOne",
            { width: 8, height: 2, depth: 1 },
            this._scene
        );
        boxTwo.rotation.y = Math.PI / 4;
        boxTwo.position.set(2, 1, 0);

        return [ground, boxOne, boxTwo];
    }
}
