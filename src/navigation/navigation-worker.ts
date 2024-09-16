import { Mesh } from "@babylonjs/core/Meshes/mesh";
import {
    INavigationEnginePlugin,
    INavMeshParameters,
} from "@babylonjs/core/Navigation/INavigationEngine";

import { RecastNavigationJSPlugin } from "./plugin/RecastNavigationJSPlugin";
import { init as initRecast } from "recast-navigation";

import RecastWorker from "../navmesh-worker?worker&inline";

export async function setupNavigation() {
    await initRecast();

    return new RecastNavigationJSPlugin();
}

export type INavigationEnginePluginV2 = INavigationEnginePlugin & {
    setWorker: (worker: Worker) => void;
};

export async function createNavMesh(
    navigationPlugin: INavigationEnginePluginV2,
    meshes: Mesh[],
    parameters: INavMeshParameters
) {
    if (meshes.length < 1) {
        throw new Error("Invalid staticNavMeshes.");
    }

    const navMeshCreatedCallback = (data?: Uint8Array) => {
        Promise.resolve();
    };

    navigationPlugin.setWorker(new RecastWorker());

    (navigationPlugin as any).createNavMesh(
        meshes,
        parameters,
        navMeshCreatedCallback
    );
}
