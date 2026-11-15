# UNDERFAIL 게임 로직·기술 심층 보고서

## 상태

- 문서 상태: `Proposal`
- 목적: 원작의 구조적 장점을 UNDERFAIL의 독창적인 게임 시스템으로 번역하기 위한 기술 기준
- 구현 시점: 정사 기준선과 주요 장면 계약 승인 후

## 1. 원작에서 확인한 핵심 로직

공식 소개는 세 가지를 분명히 강조한다.

1. 적을 반드시 파괴하지 않고도 진행할 수 있다.
2. 적마다 다른 회피 패턴과 상호작용이 있다.
3. 유머, 캐릭터 대화, 플레이어 선택이 진행을 바꾼다.

이 구조를 UNDERFAIL에서는 `대응 심사`로 번역한다. 메뉴 이름만 바꾸지 않고, 각 인물의 직무와 욕망이 해결 조건과 회피 패턴을 결정하게 한다.

## 2. 권장 게임 상태 모델

```ts
type RouteHint = 'peace' | 'mixed' | 'violent' | 'hidden';

interface GameState {
  schemaVersion: number;
  chapterId: string;
  sceneId: string;
  playerName: string;
  focus: number;
  maxFocus: number;
  harmCount: number;
  resolveIntent: number;
  recordRisk: number;
  routeHint: RouteHint;
  truthFragments: string[];
  flags: Record<string, boolean>;
  relationships: Record<string, {
    trust: number;
    fear: number;
    respect: number;
  }>;
  survivors: Record<string, 'active' | 'removed' | 'unknown'>;
  inventory: string[];
}
```

`routeHint`는 현재 상태를 설명하는 값이지 결말을 즉시 고정하는 값이 아니다. 실제 결말 판정은 최종장 진입 시 관계·증거·생존·행동을 함께 평가한다.

## 3. 전투 상태와 해결 계약

```ts
interface EncounterDefinition {
  id: string;
  opponentId: string;
  locationId: string;
  entryConditions: Condition[];
  phases: BattlePhase[];
  nonviolentActions: ActionDefinition[];
  forceResolution: ResolutionDefinition;
  defeatResolution: ResolutionDefinition;
  returnVisit: ReturnVisitDefinition[];
}
```

각 전투는 반드시 다음을 명시한다.

- 시작 갈등
- 상대의 해결 가능한 요구
- 관찰로 얻는 정보
- 행동별 반응
- 회피 패턴의 의미
- 비전투 종료 조건
- 강제 제압 결과
- 주인공 패배 결과
- 재방문 변화

### 상태 구분

| 상태 | 의미 | 0 또는 실패 결과 |
|---|---|---|
| `focus` | 주인공이 심사를 계속할 수 있는 집중력 | 체크포인트 복귀 |
| `resolve` | 상대가 갈등을 다시 생각할 여지 | 비전투 종료 가능 |
| `pressure` | 현재 공격 패턴의 강도 | 패턴 완화 |
| `recordRisk` | 학교 기록에 남는 위험 | 지역·대사·통행 변화 |
| `harmCount` | 강제 제압·실제 살해 누적 | 루트 경향 변화 |

`focus`와 상대의 생존 상태를 같은 변수로 처리하지 않는다.

## 4. 루트 판정

### 공통 진행

모든 플레이어는 공통 장면을 통과하지만, 다음 값이 장면을 바꾼다.

- 일반 만남을 죽였는가
- 보스의 요구를 해결했는가
- 기록을 조사했는가
- 관계 인물의 증언을 보존했는가
- 재방문했는가
- 학교의 증거를 공개했는가

### 강경 루트의 조건 원칙

원작처럼 강경 루트는 단순히 “전투에서 공격 버튼을 많이 누름”이 아니라 의도적이고 누적된 행동이어야 한다. 지역별로:

1. 선택 가능한 일반 만남의 처리 상태를 추적한다.
2. 지역의 주요 대립 결과를 기록한다.
3. 지역 종료 이벤트 전에 조건을 검증한다.
4. 조건이 부족하면 강경 루트 전용 장면으로 넘어가지 않고 혼합 루트로 남긴다.

UNDERFAIL에서는 이 로직을 그대로 복제하지 않고 `recordRisk`, `survivors`, `truthFragments`를 추가해 학교 기록과 증언의 손실을 반영한다. 모델스 튜던트의 비공격 해결이 강경 진행을 흔드는 설정은 캐릭터별 예외 플래그로만 둔다.

## 5. 저장·재방문

### 저장 데이터

- 저장은 현재 단계에서 게임 시스템으로만 취급한다.
- 세계관의 초능력, 시간 여행, 평행세계로 확정하지 않는다.
- 저장 실패는 UI에 명시하고, 성공으로 오인되는 기본값을 만들지 않는다.
- `schemaVersion`을 저장해 이후 데이터 구조 변경을 대비한다.

### 재방문

지역 완료 시 `returnVisit` 이벤트를 예약한다. 재방문 이벤트는 아이템 보상보다 다음을 우선한다.

- 살려 둔 인물의 태도
- 사라진 인물의 빈자리
- 기록 공개·검열 결과
- 이전 선택을 기억하는 농담과 침묵
- 새로 열린 조사 대상

## 6. 장면·데이터·실행 로직 분리

```text
src/
  data/
    characters/
    encounters/
    scenes/
    items/
  state/
    game-state.ts
    route-evaluator.ts
    save-schema.ts
  systems/
    dialogue-system.ts
    encounter-system.ts
    relationship-system.ts
    save-system.ts
  scenes/
  ui/
tests/
```

대사는 실행 코드에 하드코딩하지 않는다. 장면 데이터는 조건과 효과를 선언하고, 시스템이 이를 실행한다.

## 7. 검증해야 할 테스트

### 상태 테스트

- `focus = 0`이 상대 사망으로 처리되지 않는가
- 강제 제압이 정확히 `harmCount`와 관계·재방문에 반영되는가
- 비전투 해결이 보스별 조건을 모두 요구하는가
- 조건 미충족 장면이 조용한 성공으로 변하지 않는가
- 저장·불러오기가 관계, 증거, 생존 상태를 보존하는가

### 루트 테스트

- 아무도 죽이지 않았지만 관계·재방문 조건이 부족한 경우
- 일부 강제 제압 후 평화적 해결을 이어 가는 경우
- 지역 강경 조건이 부족해 혼합 루트로 떨어지는 경우
- 모델스 튜던트 예외로 강경 진행이 중단되는 경우
- 기록을 공개했지만 증언자가 제거된 경우

### 대본 검증

- 미승인 이름이 코드 데이터에 들어가지 않는가
- 원작 고유 대사와 유사한 문장이 없는가
- 모든 `requires`에 성공·실패 경로가 있는가
- 모든 주요 인물의 첫 등장·갈등·변화·재방문이 연결되는가

## 8. 구현 우선순위

1. 정사 기준선과 플래그 목록 확정
2. 장면 데이터 스키마와 상태 저장
3. 프롤로그 이동·조사·대화
4. 파프리카 한 전투의 비전투·강제 해결 양쪽 구현
5. 재방문과 저장/불러오기
6. 같은 계약으로 2장 이후 콘텐츠 확장

전체 게임을 먼저 만들지 않는다. 하나의 장면 계약이 데이터·실행·저장·재방문까지 닫힌 뒤 복제한다.

## 9. 조사 출처와 적용 범위

- [UNDERTALE 공식 About 페이지](https://undertale.com/about/): 비살상 해결, 고유 회피 패턴, 유머·대화·선택의 결합 확인
- [나무위키 언더테일/등장인물](https://namu.wiki/w/%EC%96%B8%EB%8D%94%ED%85%8C%EC%9D%BC/%EB%93%B1%EC%9E%A5%EC%9D%B8%EB%AC%BC): 캐릭터 관계와 한국어 자료 대조
- [나무위키 언더테일](https://namu.wiki/w/%EC%96%B8%EB%8D%94%ED%85%8C%EC%9D%BC): 전체 진행과 루트 자료 대조

원작의 대사와 스크립트는 복제하지 않고, 기능과 상태 설계만 사용한다.
