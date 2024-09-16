import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import {
    ICrowd,
    INavigationEnginePlugin,
    INavMeshParameters,
} from "@babylonjs/core/Navigation/INavigationEngine";

import { RecastNavigationJSPlugin } from "./plugin/RecastNavigationJSPlugin";
import { init as initRecast } from "recast-navigation";

export async function setupNavigationPlugin() {
    await initRecast();

    const navigationPlugin = new RecastNavigationJSPlugin();
    return navigationPlugin;
}

export function createNavMesh(
    navigationPlugin: INavigationEnginePlugin,
    meshes: Mesh[],
    parameters: INavMeshParameters
): void {
    if (meshes.length < 1) {
        throw new Error("Invalid staticNavMeshes.");
    }
    navigationPlugin.createNavMesh(meshes, parameters);
}

export function setupCrowd(
    navigationPlugin: RecastNavigationJSPlugin,
    crowdConfig: {
        maxAgents: number;
        maxAgentRadius: number;
    },
    scene: Scene
): ICrowd {
    return navigationPlugin.createCrowd(
        crowdConfig.maxAgents,
        crowdConfig.maxAgentRadius,
        scene
    );
}
