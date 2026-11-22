# UNDERFAIL

학교를 배경으로 한 장편 2D 웹 RPG 기획 및 개발 저장소입니다.
현재 단계는 **교문 수직 슬라이스를 구현하며 스토리 텍스트를 검수하는 단계**이며, 승인되지 않은 창작 설정은 문서에서 `Proposal`로 표시합니다.

## 프로젝트 상태

- 현재 단계: Phaser 기반 초반 수직 슬라이스
- 주요 스토리 기준서: [docs/UNDERFAIL_INTEGRATED_STORY_CANON.md](docs/UNDERFAIL_INTEGRATED_STORY_CANON.md)
- 원작 장면·분기·대화 기능 기준: [undertale_start_to_undyne_dialogue_index_ko.md](undertale_start_to_undyne_dialogue_index_ko.md)
- 창작 결정 워크북: [CREATIVE_DECISION_WORKBOOK.md](CREATIVE_DECISION_WORKBOOK.md)
- 제작자 개입 및 직접 결정: [STORY_CONTROL_PANEL.md](STORY_CONTROL_PANEL.md)
- 실행 가능한 게임: 이동·NPC 상호작용·대화 선택지·초반 전투 프로토타입
- 게임 로직·기술 심층 보고서: [docs/UNDERFAIL_SYSTEMS_TECHNICAL_REPORT.md](docs/UNDERFAIL_SYSTEMS_TECHNICAL_REPORT.md)
- 기술 선택 및 외부 소스 정책: [docs/TECHNOLOGY_DECISION.md](docs/TECHNOLOGY_DECISION.md)
- 구현 순서: [docs/IMPLEMENTATION_ROADMAP.md](docs/IMPLEMENTATION_ROADMAP.md)
- 실행 명령: `npm install` 후 `npm run dev`
- 창작 결정 워크북: [CREATIVE_DECISION_WORKBOOK.md](CREATIVE_DECISION_WORKBOOK.md)
- 제작자 개입 패널: [STORY_CONTROL_PANEL.md](STORY_CONTROL_PANEL.md)

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

[CREATIVE_DECISION_WORKBOOK.md](CREATIVE_DECISION_WORKBOOK.md) 또는 [STORY_CONTROL_PANEL.md](STORY_CONTROL_PANEL.md)에 직접 결정한 내용을 기준으로 작업합니다. 나머지 장별 세부는 승인된 Canon과 원작 대화·분기 구조만을 사용해 작성합니다.