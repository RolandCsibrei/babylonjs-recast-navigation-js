import { Node } from "@babylonjs/core/node";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { INavigationEnginePlugin } from "@babylonjs/core/Navigation/INavigationEngine";
import { Scene } from "@babylonjs/core/scene";

export function createDebugNavMesh(
    navigationPlugin: INavigationEnginePlugin,
    name: string,
    scene: Scene,
    parent?: Node
) {
    const navMeshDebug = navigationPlugin.createDebugNavMesh(scene);
    navMeshDebug.name = name;
    parent && (navMeshDebug.parent = parent);

    const matdebug = new StandardMaterial("mat-navmesh-debug", scene);
    matdebug.emissiveColor = new Color3(0, 0, 1);
    matdebug.backFaceCulling = false;
    matdebug.disableLighting = true;
    matdebug.alpha = 0.4;
    navMeshDebug.material = matdebug;

    return navMeshDebug;
}
