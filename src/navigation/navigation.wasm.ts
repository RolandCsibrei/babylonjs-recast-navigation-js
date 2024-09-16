import { Mesh } from "@babylonjs/core/Meshes/mesh";
import {
    INavigationEnginePlugin,
    INavMeshParameters,
} from "@babylonjs/core/Navigation/INavigationEngine";

import { RecastNavigationJSPlugin } from "./plugin/RecastNavigationJSPlugin";
import { init as initRecast } from "recast-navigation";
import RecastWasm from "@recast-navigation/wasm/wasm";

export async function setupNavigation() {
    await initRecast(RecastWasm);

    return new RecastNavigationJSPlugin();
}

export function createNavMesh(
    navigationPlugin: INavigationEnginePlugin,
    meshes: Mesh[],
    parameters: INavMeshParameters
) {
    if (meshes.length < 1) {
        throw new Error("Invalid staticNavMeshes.");
    }
    navigationPlugin.createNavMesh(meshes, parameters);
}
