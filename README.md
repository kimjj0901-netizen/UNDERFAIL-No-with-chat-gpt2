# UNDERFAIL

학교를 배경으로 한 장편 2D 웹 RPG 기획 및 개발 저장소입니다.
현재 단계는 **교문 수직 슬라이스를 구현하며 스토리 텍스트를 검수하는 단계**이며, 승인되지 않은 창작 설정은 문서에서 `Proposal`로 표시합니다.

## 프로젝트 상태

- 현재 단계: Phaser 기반 교문 수직 슬라이스
- 실행 가능한 게임: 이동·NPC 상호작용·대화 선택지 프로토타입
- 확정된 핵심 콘셉트: [docs/GAME_OVERVIEW.md](docs/GAME_OVERVIEW.md)
- 스토리 진행 구조: [docs/STORY_OUTLINE.md](docs/STORY_OUTLINE.md)
- 캐릭터 및 관계: [docs/CHARACTER_DATABASE.md](docs/CHARACTER_DATABASE.md)
- 루트 설계: [docs/ROUTE_DESIGN.md](docs/ROUTE_DESIGN.md)
- 전투 설계: [docs/BATTLE_DESIGN.md](docs/BATTLE_DESIGN.md)
- 조사 및 설계 노트: [docs/RESEARCH_AND_DESIGN_NOTES.md](docs/RESEARCH_AND_DESIGN_NOTES.md)
- 인물·대사 심층 연구: [docs/UNDERTALE_CHARACTER_DIALOGUE_RESEARCH.md](docs/UNDERTALE_CHARACTER_DIALOGUE_RESEARCH.md)
- 본편 스토리 마스터 바이블: [docs/STORY_MASTER_BIBLE.md](docs/STORY_MASTER_BIBLE.md)
- 대본 제작 바이블: [docs/SCRIPT_BIBLE.md](docs/SCRIPT_BIBLE.md)
- 최신 정사 기준선: [docs/CURRENT_CANON_BASELINE.md](docs/CURRENT_CANON_BASELINE.md)
- 게임 로직·기술 심층 보고서: [docs/UNDERFAIL_SYSTEMS_TECHNICAL_REPORT.md](docs/UNDERFAIL_SYSTEMS_TECHNICAL_REPORT.md)
- 기술 선택 및 외부 소스 정책: [docs/TECHNOLOGY_DECISION.md](docs/TECHNOLOGY_DECISION.md)
- 본편 진행 대응 설계: [docs/STORY_PROGRESSION_MAPPING.md](docs/STORY_PROGRESSION_MAPPING.md)
- 본편 대본: [docs/STORY_SCRIPT.md](docs/STORY_SCRIPT.md)
- 구현 순서: [docs/IMPLEMENTATION_ROADMAP.md](docs/IMPLEMENTATION_ROADMAP.md)
- 실행 명령: `npm install` 후 `npm run dev`
- 스토리 결정표: [STORY_DECISIONS.md](STORY_DECISIONS.md)
- 창작 결정 워크북: [CREATIVE_DECISION_WORKBOOK.md](CREATIVE_DECISION_WORKBOOK.md)
- 제작자 개입 패널: [STORY_CONTROL_PANEL.md](STORY_CONTROL_PANEL.md)
- 등장인물 대응표: [docs/CHARACTER_ROLE_MAPPING.md](docs/CHARACTER_ROLE_MAPPING.md)

## 정사 관리

사용자가 명시했거나 승인한 설정만 정사(Canon)로 취급합니다. 새로 제안된 이름, 사건, 규칙, 결말은 승인 전까지 미승인 제안(Proposal)입니다. 문서 작성 및 구현 시 이 구분을 유지합니다.

## 개발 원칙

스토리와 시스템 설계를 문서로 유지하되, 먼저 플레이 가능한 수직 슬라이스를 만들고 게임 내부 텍스트를 검수합니다. 현재 구현은 TypeScript/Vite/Phaser 기반 웹 게임이며 외부 이미지·음악·원작 스크립트를 사용하지 않습니다. 원작의 디자인 원리는 연구하되, 캐릭터·대사·맵·그래픽·음악·스크립트는 독창적으로 제작합니다.

## 가장 빠른 스토리 진행 방법

긴 워크북을 모두 작성할 필요가 없습니다. [STORY_CONTROL_PANEL.md](STORY_CONTROL_PANEL.md)의 A1~A15만 결정하면 됩니다. 나머지 장별 사건, 인물 아크, 복선, 루트 변화, 대본은 기존 문서와 사용자의 결정에 맞춰 자동으로 작성합니다.

답변 예시:

```text
A1: 추천 기본값 채택
A2: 음악을 중심으로 하되 최종 주제는 자유로운 진로
A3: 추천 기본값 채택
...
```

## 다음 작업 요청 방법

[STORY_DECISIONS.md](STORY_DECISIONS.md)를 직접 수정해 주세요. 모든 항목을 완벽하게 정할 필요는 없으며, `추천안 채택`, `보류`, `수정`을 자유롭게 사용할 수 있습니다. 수정본을 기준으로 설정을 통합한 뒤 상세 대본과 첫 게임 프로젝트 생성을 시작합니다.