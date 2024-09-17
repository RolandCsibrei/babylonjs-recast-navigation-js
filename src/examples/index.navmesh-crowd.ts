// https://playground.babylonjs.com/#KVQP83#0

import { Scene } from "@babylonjs/core/scene";
import {
    INavigationEnginePlugin,
    INavMeshParameters,
} from "@babylonjs/core/Navigation/INavigationEngine";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { CreateGreasedLine } from "@babylonjs/core/Meshes/Builders/greasedLineBuilder";

import {
    createNavMesh,
    setupNavigationPlugin,
} from "../navigation/navigation.single-thread";
import { createDebugNavMesh } from "../navigation/navigation-common";

export class NavigationCrowd {
    private _navigationPlugin?: INavigationEnginePlugin;

    private _agents: {
        idx: number;
        trf: TransformNode;
        mesh: Mesh;
        target: Mesh;
    }[] = [];

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

        this._setupCrowd();
    }

    private _getStaticNavMeshes() {
        const ground = CreateGround(
            "ground",
            { width: 6, height: 6, subdivisions: 2 },
            this._scene
        );

        const mat1 = new StandardMaterial("mat1", this._scene);
        mat1.diffuseColor = new Color3(1, 1, 1);

        const sphere = CreateSphere(
            "sphere",
            { diameter: 2, segments: 16 },
            this._scene
        );
        sphere.material = mat1;
        sphere.position.y = 1;

        const cube = CreateBox("cube", { size: 1, height: 3 }, this._scene);
        cube.position = new Vector3(1, 1.5, 0);

        return [sphere, cube, ground];
    }

    private _setupCrowd(agentCount = 10) {
        if (!this._navigationPlugin) {
            return;
        }

        // crowd
        const crowd = this._navigationPlugin.createCrowd(
            agentCount,
            0.1,
            this._scene
        );

        const agentParams = {
            radius: 0.1,
            height: 0.2,
            maxAcceleration: 4.0,
            maxSpeed: 1.0,
            collisionQueryRange: 0.5,
            pathOptimizationRange: 0.0,
            separationWeight: 1.0,
        };

        const targetCube = CreateBox(
            "target-cube",
            { size: 0.1, height: 0.1 },
            this._scene
        );

        // create agents
        for (let i = 0; i < agentCount; i++) {
            const agentCube = CreateBox("agent", { size: 0.2 }, this._scene);

            const matAgent = new StandardMaterial("mat2", this._scene);
            const variation = Math.random();

            matAgent.diffuseColor = new Color3(
                0.4 + variation * 0.6,
                0.3,
                1.0 - variation * 0.3
            );
            agentCube.material = matAgent;

            const randomPos = this._navigationPlugin.getRandomPointAround(
                new Vector3(-2.0, 0.1, -1.8),
                0.5
            );

            const transform = new TransformNode("agent-parent");
            const agentIndex = crowd.addAgent(
                randomPos,
                agentParams,
                transform
            );
            this._agents.push({
                idx: agentIndex,
                trf: transform,
                mesh: agentCube,
                target: targetCube,
            });
        }

        let startingPoint;

        const getGroundPosition = () => {
            const pickinfo = this._scene.pick(
                this._scene.pointerX,
                this._scene.pointerY
            );
            if (pickinfo.hit) {
                return pickinfo.pickedPoint;
            }

            return null;
        };

        const pointerHit = () => {
            if (!this._navigationPlugin) {
                return;
            }

            const pathPoints = [];

            startingPoint = getGroundPosition();
            if (startingPoint) {
                const agents = crowd.getAgents();
                for (let i = 0; i < agents.length; i++) {
                    crowd.agentGoto(
                        agents[i],
                        this._navigationPlugin.getClosestPoint(startingPoint)
                    );

                    pathPoints.push(
                        this._navigationPlugin.computePath(
                            crowd.getAgentPosition(agents[i]),
                            this._navigationPlugin.getClosestPoint(
                                startingPoint
                            )
                        )
                    );
                }

                this._scene.getMeshByName("path-line")?.dispose();

                const pathLine = CreateGreasedLine(
                    "path-line",
                    {
                        points: pathPoints,
                    },
                    {
                        width: 0.01,
                    }
                );
            }
        };

        this._scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERDOWN:
                    if (pointerInfo.pickInfo?.hit) {
                        pointerHit();
                    }
                    break;
            }
        });

        const rotateAgent = (agentIdx: number) => {
            const agent = this._agents[agentIdx];

            agent.mesh.position = crowd.getAgentPosition(agent.idx);
            crowd.getAgentNextTargetPathToRef(agent.idx, agent.target.position);

            const vel = crowd.getAgentVelocity(agent.idx);
            if (vel.length() > 0.2) {
                vel.normalize();
                const desiredRotation = Math.atan2(vel.x, vel.z);
                agent.mesh.rotation.y =
                    agent.mesh.rotation.y +
                    (desiredRotation - agent.mesh.rotation.y) * 0.05;
            }
        };

        this._scene.onBeforeRenderObservable.add(() => {
            const agentCount = this._agents.length;
            for (let i = 0; i < agentCount; i++) {
                rotateAgent(i);
            }
        });
    }
}
