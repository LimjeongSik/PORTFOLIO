import { ProjectAnatomy } from "@/components/project/ProjectAnatomy";
import { ProjectBridge } from "@/components/project/ProjectBridge";
import { ProjectGate } from "@/components/project/ProjectGate";
import { ProjectKeyring } from "@/components/project/ProjectKeyring";
import { ProjectRuntime } from "@/components/project/ProjectRuntime";
import { ProjectSystem } from "@/components/project/ProjectSystem";

import type { Project } from "@/types/content";

interface ProjectSignatureProps {
    project: Project;
}

/**
 * 그 프로젝트만의 그림.
 *
 * 지면의 문법(표지 · 읽는 구간 · 화면 전시 · 사례 대장)은 세 프로젝트가 똑같이 쓰지만,
 * **여기 하나만은 프로젝트마다 다르다** — SafeOps는 좌표 한 건이 지나는 관문, 침례교는
 * 화면 해부와 런타임 지도, 아이머그는 열쇠 넷의 시계와 웹↔앱 통로다. 이 그림이 그 프로젝트를
 * 다른 프로젝트와 가르는 것이므로 하나로 합치지 않는다.
 *
 * 무대의 `system` 자리는 **첫 그림**이 연다. 둘 이상 있어도 카메라 경로는 하나여야 한다.
 */
export function ProjectSignature({ project }: ProjectSignatureProps) {
    const blocks: React.ReactNode[] = [];

    if (project.pipeline) {
        blocks.push(
            <ProjectSystem
                key="pipeline"
                label="Pipeline"
                title={project.pipeline.title}
                lede={project.pipeline.lede}
                note={project.pipeline.note}
                zone={blocks.length === 0}
            >
                <ProjectGate pipeline={project.pipeline} />
            </ProjectSystem>,
        );
    }

    if (project.anatomy) {
        blocks.push(
            <ProjectSystem
                key="anatomy"
                label="Anatomy"
                title={project.anatomy.title}
                lede={project.anatomy.lede}
                zone={blocks.length === 0}
            >
                <ProjectAnatomy anatomy={project.anatomy} />
            </ProjectSystem>,
        );
    }

    if (project.runtime) {
        blocks.push(
            <ProjectSystem
                key="runtime"
                label="Runtime"
                title={project.runtime.title}
                lede={project.runtime.lede}
                zone={blocks.length === 0}
            >
                <ProjectRuntime runtime={project.runtime} />
            </ProjectSystem>,
        );
    }

    if (project.keyring) {
        blocks.push(
            <ProjectSystem
                key="keyring"
                label="Keyring"
                title={project.keyring.title}
                lede={project.keyring.lede}
                zone={blocks.length === 0}
            >
                <ProjectKeyring keyring={project.keyring} />
            </ProjectSystem>,
        );
    }

    if (project.bridge) {
        blocks.push(
            <ProjectSystem
                key="bridge"
                label="Bridge"
                title={project.bridge.title}
                lede={project.bridge.lede}
                zone={blocks.length === 0}
            >
                <ProjectBridge bridge={project.bridge} />
            </ProjectSystem>,
        );
    }

    return <>{blocks}</>;
}
