# Undertale 게임 구조 심층 조사

## 문서 상태

- 목적: UNDERFAIL에 대입하기 전에 Undertale의 맵·이벤트·등장·전투·루트 구조를 실제 작동 단위로 분해
- 적용 범위: 맵 그래프, 방 전환, NPC 등장, 지역 진행, 전투 진입·종료, SAVE, 재방문, 평화·중립·강경 루트
- 콘텐츠 원칙: 원작 대사·스크립트·맵·음악·공격 패턴을 복제하지 않고 구조와 기능만 분석
- UNDERFAIL 대입: 이 문서의 조사 결과를 [STORY_SCRIPT.md](./STORY_SCRIPT.md)와 구현 데이터의 기준으로 사용

## 1. 핵심 결론

### 1.1 Undertale은 “지역별 챕터”가 아니라 방 그래프다

플레이어가 경험하는 지역은 큰 맵 하나가 아니라 여러 개의 방(room)이 연결된 그래프다.

- 각 방은 입구·출구·충돌·NPC·상호작용·전투 발생 위치를 가진다.
- 같은 지역 안에서도 방에 들어오는 순서와 이전 행동에 따라 내용이 달라진다.
- 지역을 떠난 뒤에도 이전 방을 다시 방문할 수 있다.
- 전화, NPC 이동, SAVE Point, 방 진입 이벤트가 여러 지역에 걸쳐 같은 진행 상태를 읽는다.
- 따라서 “Snowdin에 들어가면 Papyrus가 등장한다”가 아니라 “특정 방·특정 진입·특정 plot 상태에서 Papyrus 이벤트가 실행된다”가 정확하다.

### 1.2 등장인물은 장면 하나에 고정되지 않는다

주요 인물은 다음 여러 층으로 등장한다.

1. 첫 시각적 등장
2. 추적·전화·원격 대화
3. 퍼즐 또는 일반 방의 반복 등장
4. 전투 진입
5. 전투 뒤 관계 이벤트
6. 다른 지역에서의 재등장
7. 최종장 또는 루트 전용 대사

UNDERFAIL도 인물을 한 번의 보스전으로 끝내면 안 된다. 각 인물에 `firstAppearance`, `ambientAppearance`, `encounter`, `relationshipEvent`, `returnVisit`, `routeVariant`를 별도로 둬야 한다.

### 1.3 루트는 엔딩 직전의 판정값이 아니라 방의 동작을 바꾼다

원작의 루트 차이는 다음에서 먼저 나타난다.

- 일반 전투가 계속 발생하는가
- 방의 퍼즐이 이미 해결된 상태인가
- NPC가 사라졌거나 대사가 달라졌는가
- SAVE Point가 다른 정보를 표시하는가
- 보스가 평소 형태인지 루트 전용 형태인지
- 이전에 살려 둔 인물의 관계 이벤트가 열리는가

따라서 UNDERFAIL은 엔딩 판정만 만들 것이 아니라, 방·전투·NPC가 현재 루트를 읽도록 해야 한다.

## 2. 맵 구조 분석

### 2.1 상위 그래프

원작의 큰 지역은 다음과 같은 그래프 역할을 한다.

```text
Ruins
  └─ Snowdin Forest ─ Snowdin Town
       └─ Waterfall ─ Garbage Dump / Quiet Area / Temmie Village
            └─ Hotland ─ MTT Resort ─ CORE
                                      ├─ New Home
                                      └─ True Lab (조건부 역행)
```

이 표는 지명 복제를 위한 것이 아니라, 다음 구조를 보여 주기 위한 것이다.

- 초반 보호자 지역
- 퍼즐·관계 지역
- 추격·역사·재방문 지역
- 기술·방송·상점 지역
- 핵심 시설
- 최종 통치 공간
- 본편 진행 후 다시 들어가는 조건부 연구 공간

### 2.2 방 그래프의 특징

#### Ruins

- 초반 안내와 기본 퍼즐이 밀집한다.
- 보호자가 앞선 방과 다음 방 사이를 전화와 직접 등장으로 연결한다.
- 첫 지역의 일반 만남·비전투 해결·SAVE 학습이 여기서 반복된다.
- Ruins 안에서 Napstablook과의 첫 만남이 발생한다.
- 끝에는 보호자와의 대립이 있고, 이 대립이 지역 그래프의 출구를 연다.

#### Snowdin

- 숲의 방, 퍼즐 방, 마을, 상점·집, 개 전투 방이 이어진다.
- Sans와 Papyrus는 한 방에서만 활동하지 않고 다수의 퍼즐·길목에서 반복된다.
- Papyrus의 본격 대립 전까지 추적과 퍼즐이 교차한다.
- 전투 뒤 Papyrus와의 관계 이벤트가 별도의 방과 일정 조건으로 열린다.

#### Waterfall

- 긴 수평 탐색 구간, 역사 정보를 주는 공간, 물·어둠·소리 기반 상호작용이 섞인다.
- Undyne의 추격은 한 번의 컷신이 아니라 여러 방에서 반복된다.
- Monster Kid은 추격 그래프에 끼어들어 플레이어의 방향과 선택을 바꾼다.
- Mad Dummy, Napstablook의 집, Temmie Village, Gerson, 쓰레기 구역 등 선택적·재방문 공간이 있다.
- Undyne의 본 전투는 지역의 추격 그래프를 끝내는 관문이다.

#### Hotland·MTT Resort·CORE

- Hotland는 Alphys의 원격 안내, Mettaton의 방송, 퍼즐, 일반 전투, 상점·보스가 교차한다.
- MTT Resort는 길목이면서 NPC·상점·전화·재방문을 연결하는 허브 기능을 한다.
- CORE는 Hotland의 기술 구조를 더 큰 시설로 확장한다.
- Mettaton EX는 CORE의 끝에 배치되어 New Home으로 가는 길을 막는다.
- True Lab은 CORE를 단순히 통과한 뒤 자동으로 가는 지역이 아니라, 조건 충족 후 되돌아가 열리는 별도 그래프다.

#### New Home·Last Corridor

- New Home은 일반 탐색보다 기록·역사·최종 통치자의 생활 공간을 통과하는 비중이 크다.
- Last Corridor는 전투 전 누적 행동을 평가하는 짧은 공간이다.
- 최종 통치자 전투 뒤에는 일반 진행과 평화·강경 진행이 다른 최종 공간으로 갈라진다.

### 2.3 UNDERFAIL에 필요한 맵 대응 단위

UNDERFAIL의 “교실/복도/특별실”을 큰 장 하나로 만들지 않고 다음처럼 쪼갠다.

```text
school_gate
  ├─ welfare_hall_a
  ├─ welfare_hall_b
  ├─ welfare_storage
  └─ main_corridor_entrance

classroom_corridor
  ├─ puzzle_room_01
  ├─ puzzle_room_02
  ├─ paprika_route
  └─ snowdin_hub_equivalent

record_wing
  ├─ chase_corridor_01
  ├─ chase_corridor_02
  ├─ model_student_room
  ├─ nerd_room
  └─ banana_hidden_room

information_wing
  ├─ alpha_lab
  ├─ shop_room
  ├─ broadcast_rooms
  └─ network_core

principal_wing
  ├─ history_hall
  ├─ family_rooms
  ├─ last_corridor
  └─ final_room
```

이것은 최종 맵 확정안이 아니다. 중요한 것은 한 방마다 다음을 독립적으로 정의하는 것이다.

- 출구와 연결 방
- 첫 진입 이벤트
- 재진입 이벤트
- 일반 만남 테이블
- NPC 위치
- 퍼즐 상태
- SAVE/체크포인트
- 루트별 대체 이벤트

## 3. 이벤트 트리거 분석

### 3.1 방 진입 트리거

방 진입 이벤트는 단순히 `chapter === 2`로 실행하지 않는다.

```ts
type RoomEnterTrigger = {
  roomId: string;
  once?: boolean;
  requires?: Condition[];
  excludes?: Condition[];
  onEnter: EventId;
  onReturn?: EventId;
};
```

확인해야 할 조건:

- 이 방을 처음 방문했는가
- 이전 방의 이벤트를 완료했는가
- 주요 인물이 살아 있는가
- 지역 일반 만남 조건이 끝났는가
- 관계 이벤트를 완료했는가
- 현재 루트가 강경으로 유지되고 있는가

### 3.2 상호작용 트리거

표지판, 물건, 문, 전화, SAVE Point, NPC는 방 진입과 별개로 작동한다.

```ts
type InteractionTrigger = {
  id: string;
  roomId: string;
  objectId: string;
  requires?: Condition[];
  firstUse?: EventId;
  repeatUse?: EventId;
  routeVariants?: Partial<Record<RouteHint, EventId>>;
};
```

원작식 효과:

- 같은 물건을 다시 조사하면 문장이 바뀐다.
- 보스전 전후로 같은 NPC의 위치와 말이 바뀐다.
- 특정 아이템을 가지고 있으면 상호작용 결과가 달라진다.
- 전화나 관계 이벤트 뒤에만 특정 방의 내용이 열린다.

### 3.3 전화·원격 이벤트

전화는 단순 대화창이 아니라 여러 방을 연결하는 이동형 이벤트다.

- 전화가 어느 방에서든 걸릴 수 있다.
- 전화 내용은 현재 지역뿐 아니라 이전 관계 이벤트를 읽는다.
- 전화가 끝난 뒤 NPC 위치나 다음 목표가 바뀐다.
- 같은 전화 기능이 Waterfall과 Hotland처럼 여러 지역에서 재사용된다.

UNDERFAIL:

- 도미토리엘의 연락은 초반 보호자 그래프를 연결한다.
- 파프리카·체임버쌤·알파이썬의 연락은 관계 이벤트 뒤 재방문 목표를 만든다.
- 연락은 새 사건을 설명하는 도구가 아니라, 이미 발생한 사건의 다음 방을 여는 도구로 사용한다.

### 3.4 진행 카운터

원작의 스토리 진행은 방 하나의 플래그만으로 설명되지 않는다. 공개된 스토리 단계 분석에서는 진행 카운터가 여러 방과 재사용 오브젝트에 의해 갱신되는 것으로 정리된다.

중요한 점:

- 하나의 진행 값이 여러 방에서 설정될 수 있다.
- SAVE Point와 전화 같은 재사용 오브젝트가 공통 진행을 갱신할 수 있다.
- 지역별로만 존재하는 단계와 여러 지역에 걸친 단계가 분리된다.
- 스토리 순서와 엔딩 루트 조건은 별도의 축이다.

UNDERFAIL:

```ts
type ProgressState = {
  spineStep: number;
  roomFlags: Record<string, boolean>;
  regionStates: Record<string, RegionState>;
  relationshipEvents: Record<string, string>;
};
```

`spineStep`는 장 번호가 아니라 “방금 끝난 사건의 순서”다. 루트 판정은 별도로 계산한다.

## 4. 캐릭터 등장 로직

### 4.1 등장 상태를 분리해야 하는 이유

캐릭터의 `alive` 하나만으로는 Undertale식 진행을 만들 수 없다. 다음 상태가 필요하다.

```ts
type CharacterPresence = {
  firstSeen: boolean;
  currentRoom?: string;
  canEncounter: boolean;
  encounterResolved: boolean;
  relationshipStage: number;
  routeVariant: 'normal' | 'peace' | 'neutral' | 'genocide';
  canReturn: boolean;
  witnessAvailable: boolean;
};
```

예시:

- Papyrus 기능 인물은 첫 등장, 퍼즐 동행, 보스전, 관계 이벤트, 후반 재등장이 각각 다르다.
- Undyne 기능 인물은 원격 추격, Monster Kid 관련 장면, 본 전투, 평화 관계 이벤트, 강경 전용 전투가 다르다.
- Alphys 기능 인물은 원격 안내, 방송 사건, 데이트/관계 조건, True Lab 진입, 진실 공개가 다르다.

### 4.2 등장 순서의 실제 구조

#### Flowey 기능

1. 최초 접근
2. 튜토리얼
3. 배신·공격
4. 초반 이후의 짧은 재등장
5. 지역 진행 중 간접 개입
6. 최종 통치자 이후 전면 개입
7. 평화·중립·강경별 최종 기능 분기

UNDERFAIL:

- 불리는 교문 튜토리얼과 탄막 전투로 시작한다.
- 이후 재등장 방과 최종 기능은 보류된 사용자 설정을 침범하지 않는다.

#### Toriel 기능

1. 구조
2. 초반 퍼즐 안내
3. 전화와 방 이동
4. 주인공을 붙잡는 대립
5. 초반 지역 종료
6. 엔딩별 후속 반응

UNDERFAIL:

- 도미토리엘의 교육복지반, 보호, 반복 설득형 대립에 대응한다.

#### Papyrus 기능

1. 형제와 함께 첫 등장
2. 주인공 추적
3. 반복 퍼즐
4. 지역 일반 NPC의 화제
5. 보스전
6. 친구 이벤트
7. 평화 후 후반 지원

UNDERFAIL:

- 파프리카에게 가정 교사·퍼즐·첫 주요 보스·관계 이벤트를 대응한다.

#### Sans 기능

1. 초반 가벼운 관찰
2. Papyrus와의 반복 등장
3. 전화·방 대화
4. 행동 누적의 관찰
5. Last Corridor의 강경 심판

UNDERFAIL:

- SANZ는 초반부터 후반 기능을 공개하지 않는다.
- 강경 보스 기능을 방 진입·일반 만남 소진·누적 행동과 연결한다.

#### Undyne 기능

1. 원거리에서 주인공을 인지
2. 여러 방에서 추격
3. Monster Kid과의 관계 장면
4. Waterfall 최종 대립
5. 평화 관계 이벤트
6. 강경 전용 형태

UNDERFAIL:

- 체임버쌤과 포테이티드의 등장 순서를 이 구조로 설계한다.

#### Alphys/Mettaton 기능

1. Alphys의 원격 안내
2. Mettaton의 공개 방송
3. 퍼즐과 방송이 교차
4. 상점·보스·기술실
5. CORE의 최종 방송형
6. 관계 조건 이후 True Lab

UNDERFAIL:

- 알파이썬과 크롬북 계열을 하나의 직선 보스전으로 합치지 않는다.
- 기본형·EX형·NEO형은 등장 조건과 루트 결과가 다르다.

## 5. 전투 진입 구조

### 5.1 일반 만남

일반 만남은 무작위 전투 버튼 하나가 아니다.

1. 플레이어가 조작 가능한 방에 들어간다.
2. 특정 이동량·시간·지역 조건이 누적된다.
3. 지역별 일반 만남 테이블에서 적이 선택된다.
4. 전투 후 방 상태와 지역 카운터가 갱신된다.
5. 특정 조건에서는 더 이상 적이 등장하지 않는다.

강경 루트에서는 이 일반 만남 소진이 지역 진행의 핵심이다. 보스를 공격한 횟수만으로는 같은 구조가 되지 않는다.

### 5.2 주요 전투

주요 전투는 방 진입 컷신과 전투 상태가 연결된다.

```ts
type EncounterEntry = {
  triggerRoom: string;
  trigger: 'touch' | 'interact' | 'cutscene' | 'pursuit';
  requires: Condition[];
  beforeBattle: EventId;
  battleId: string;
  afterBattle: {
    peace: EventId;
    force: EventId;
    defeat: EventId;
  };
};
```

UNDERFAIL:

- 불리: 교문 접근 → 튜토리얼 전투 → 도미토리엘 개입
- 도미토리엘: 교육복지반 출구 조건 → 반복 설득 전투 → 진로 의지 확인
- 파프리카: Snowdin 기능 구간의 추적·퍼즐 종료 → 첫 주요 보스
- 체임버쌤: Waterfall 기능 구간의 다중 추격 종료 → 본 대립
- 모델스 튜던트: 사용자 지정 교육복지반 선행 등장 → 원작 Mad Dummy 기능의 특수 전투
- 크롬북: Hotland/CORE 기능의 방송 상태와 루트 조건에 따른 형태 전환
- 아스도어: New Home 기능 구간의 최종 대립

### 5.3 전투 턴

원작의 기본 턴은 네 메뉴와 상대 턴의 회피로 구성된다.

```text
플레이어 턴
  ├─ FIGHT: 피해·처치 경로
  ├─ ACT: 상대 상태·대화·해결 조건 변경
  ├─ ITEM: 회복·조건·상호작용
  └─ MERCY: 조건 충족 후 비폭력 종료

상대 턴
  ├─ 대사/상태 표시
  ├─ 고유 공격 패턴
  ├─ 회피
  └─ 상태 갱신
```

UNDERFAIL은 사용자 워크북에 따라:

- `FIGHT` 기능: 공격·강제 제압·실제 살해
- `ACT` 기능: 대응·관찰·대화·전용 행동
- `ITEM` 기능: 장비·회복·선배 물품·거래 물품
- `MERCY` 기능: 최종 명칭은 보류된 비공격 해결
- 상대 턴: 직무·감정·목표를 시각화한 학교식 탄막

메뉴 이름과 UI는 바꿀 수 있지만, 한 턴의 정보 구조는 유지해야 한다.

### 5.4 ACT와 비폭력 종료

원작에서 ACT는 단순 대화 버튼이 아니다.

- 적의 상태를 조사한다.
- 특정 행동 순서를 요구한다.
- 상대의 감정·약점·관계를 바꾼다.
- 일부 전투는 이름이 평화 종료 가능 상태로 바뀐 뒤에도 추가 행동이 필요하다.
- 일부 보스는 단순히 `MERCY`를 누르는 것만으로 끝나지 않는다.

UNDERFAIL:

- 도미토리엘: 꿈을 가고 싶다는 의지의 반복
- 모델스 튜던트: 팬클럽 공격을 역이용하고 너드스타블룩의 개입으로 종료
- 파프리카: 가정 교사로서의 목표와 주인공의 진로 충돌을 행동으로 해소
- 체임버쌤: 추격·보호·질서의 우선순위를 행동으로 바꿈
- 알파이썬: 강화 프로토콜과 책임 회피를 조사·대화로 드러냄

각 보스의 해결 조건은 공통 정답 하나가 아니라 인물별 행동 순서여야 한다.

## 6. 전투 종료와 지역 상태

### 6.1 평화 종료

평화 종료 후 반드시 바뀌어야 하는 것:

- 전투 적의 현재 상태
- 해당 방의 NPC 위치
- 재방문 대사
- 지역 완료 플래그
- 후속 관계 이벤트 조건
- 최종 지원 가능성

### 6.2 강제 종료

강제 제압·사망·전투 승리는 같은 상태가 아니다.

```ts
type EncounterResolution =
  | { kind: 'spared'; survivor: true; relationship: 'changed' }
  | { kind: 'forced'; survivor: 'unknown'; recordRisk: number }
  | { kind: 'killed'; survivor: false; harm: number }
  | { kind: 'defeated'; playerReturnsToCheckpoint: true };
```

UNDERFAIL은 사용자가 실제 살해 가능한 세계를 설정했지만, 실제 사망 처리의 루트별 방법은 보류 상태다. 그러므로 코드에서 `force = death`로 고정하지 않는다.

### 6.3 패배

원작식 패배의 기능:

- 플레이어는 전투를 다시 시도한다.
- SAVE/체크포인트 이후의 학습 기회를 얻는다.
- 특정 인물은 실패 횟수나 이전 진행을 간접적으로 반영할 수 있다.

UNDERFAIL 대입:

- HP/집중력 고갈
- 의지·체크포인트 계열 문구
- 수업에 갇히거나 학교 공간에 붙잡힌 듯한 연출
- 패배 자체를 상대 사망으로 기록하지 않음

## 7. SAVE·체크포인트·재시작

### 7.1 원작 SAVE Point의 기능

공개 자료 기준 SAVE Point는 단순 저장 버튼이 아니다.

- 진행을 저장한다.
- HP를 회복한다.
- 주인공의 현재 상태와 결의를 짧게 표시한다.
- 강경 루트에서는 지역 처치 카운터를 표시할 수 있다.
- 지역 카운터가 소진되면 일반 저장 문구가 다른 상태 문구로 바뀐다.
- 강경 루트가 중단되면 표시도 일반 상태로 돌아간다.

### 7.2 UNDERFAIL 대입

초기 구현에서는 저장을 세계관 능력으로 확정하지 않는다.

- 저장소: 브라우저 `localStorage`
- 저장 시점: SAVE Point 또는 명시적 체크포인트
- 저장 데이터: 방, 플레이어 상태, 인벤토리, 관계, 생존, 지역 만남 상태, 루트 진행
- 표시: 현재 학교 공간의 분위기와 진행 상태
- 강경 루트: 지역 일반 만남 잔여 수를 표시할 수 있으나 UI 문구는 새로 작성

### 7.3 재방문

재방문은 엔딩 보상용 장면이 아니라 진행의 일부다.

```ts
type ReturnVisit = {
  roomId: string;
  after: EventId;
  requires: Condition[];
  effects: Effect[];
};
```

확인할 변화:

- 구한 인물의 위치와 일상
- 사라진 인물의 빈자리
- 이전 아이템을 기억하는 NPC
- 이미 해결한 퍼즐의 새 반응
- 전화·관계 이벤트의 후속 대화

## 8. 루트 구조의 실제 대입

### 8.1 중립

- 지역 만남을 일부 처리하고 일부는 남긴다.
- 주요 인물의 생존과 관계가 섞인다.
- True Lab 같은 조건부 구역은 열리지 않을 수 있다.
- 최종 결과는 처치한 인물과 남은 인물에 따라 달라진다.

### 8.2 진정한 평화

- 주요 인물을 처치하지 않는다.
- Papyrus·Undyne·Alphys 기능 인물의 관계 이벤트를 모두 진행한다.
- Hotland 이후 되돌아가 True Lab 기능 구역을 연다.
- 최종 통치자 대립 전에 관계 인물의 도움 조건이 충족된다.

UNDERFAIL:

- 도미토리엘의 설득·관계
- 파프리카의 친구 이벤트
- 체임버쌤과 포테이티드의 관계 이벤트
- 알파이썬과 크롬북 문제의 관계 이벤트
- 모델스 튜던트의 사용자 지정 예외

### 8.3 강경

강경 루트는 다음 네 조건의 결합이다.

1. 지역 일반 만남을 계속 소진한다.
2. 주요 전투를 강제로 끝낸다.
3. 지역 종료 전에 소진 조건을 충족한다.
4. 조건을 충족하지 못하면 강경 루트가 중단되거나 혼합 루트로 돌아간다.

주요 효과:

- 일반 만남이 더 이상 발생하지 않음
- 퍼즐이나 NPC가 비정상적으로 조용해짐
- 지역 음악·대사·SAVE 표시의 기능 변화
- 보스 형태와 전투 진입 변화
- 최종 심판 기능의 전면화

UNDERFAIL의 강경 주제는 사용자 워크북의 “게임일 뿐이라고 여긴 플레이어가 그들의 세상을 무너뜨린다”를 기준으로 하며, 이를 단순한 악성 수치로 축소하지 않는다.

## 9. UNDERFAIL의 올바른 대입 골격

현재까지의 “지역별 대응”을 다음 구조로 교체해야 한다.

### 9.1 학교 입구·교육복지반

```text
room_gate
  ├─ 불리 첫 접근
  ├─ 튜토리얼 탄막
  ├─ 도미토리엘 구조
  └─ welfare_room_01
       ├─ 기본 조사
       ├─ 일반 대응
       ├─ 선배 예체능 장비
       ├─ 모델스 튜던트 선행 등장
       └─ 도미토리엘 출구 대립
```

원작 기능:

- Flowey 튜토리얼·배신
- Toriel 보호·퍼즐
- Ruins 일반 만남
- Toriel 종료 대립

### 9.2 일반 교실·복도

```text
classroom_hub
  ├─ 파프리카 첫 등장
  ├─ 반복 퍼즐
  ├─ SANZ 초기 관찰
  ├─ 일반 만남 테이블
  ├─ 파프리카 대립
  └─ 관계 이벤트
```

원작 기능:

- Snowdin 입장
- Sans·Papyrus 첫 등장
- 형제 퍼즐
- Papyrus 대립
- 친구 이벤트

### 9.3 기록 복도·구관

```text
record_wing
  ├─ 체임버쌤 원거리 감지
  ├─ 포테이티드 반복 등장
  ├─ 추격 방들
  ├─ 너드스타블룩 첫/재방문 방
  ├─ 모델스 튜던트 본 전투
  ├─ 빠나!! 숨은 공간
  └─ 체임버쌤 대립
```

원작 기능:

- Waterfall 추격
- Monster Kid 동행
- Mad Dummy 특수 전투
- Napstablook 재방문
- Temmie Village
- Undyne 대립

### 9.4 정보실·방송실·핵심 네트워크

```text
information_wing
  ├─ 알파이썬 원격 안내
  ├─ Lenovo 기본형
  ├─ 머핀 거래
  ├─ 방송형 크롬북
  ├─ 일반 시설 전투
  ├─ 핵심 네트워크
  └─ Samsung EX / MSI NEO 조건 분기
```

원작 기능:

- Alphys 안내·비밀
- Mettaton 방송·형태 변화
- Muffet 거래·전투
- Royal Guards 및 CORE 일반 진행

Royal Guards에 대응하는 사용자의 확정 인물이 없으므로, 현재는 신규 인물을 만들지 않는다.

### 9.5 폐쇄 정보실·교장동

```text
closed_information
  ├─ 알파이썬 과거
  ├─ 디버그 스톤
  ├─ True Lab 조건
  └─ principal_wing
       ├─ 학교 역사
       ├─ 아스도어 가족 공간
       ├─ Last Corridor 기능
       └─ 최종 대립
```

원작 기능:

- True Lab
- New Home
- Last Corridor
- Asgore·Flowey·Asriel 최종 기능

## 10. 기존 UNDERFAIL 설계의 오류 진단

### 오류 1: 지역을 장 번호로만 옮김

기존 방식:

```text
1장 = 일반 교실
2장 = 기록 복도
3장 = 정보실
```

문제:

- 방 사이의 순환과 재방문이 없다.
- NPC가 왜 그 방에 등장하는지 설명하지 못한다.
- 전화·SAVE·방 진입 이벤트가 사라진다.

수정:

- 장은 큰 영역 이름일 뿐이다.
- 실제 구현은 여러 방과 이벤트 ID로 나눈다.

### 오류 2: 보스만 대응하고 주변 방을 만들지 않음

문제:

- Papyrus, Undyne, Alphys 기능은 보스전만으로 성립하지 않는다.
- 원작에서는 퍼즐, 전화, 일반 NPC, 관계 이벤트가 보스의 의미를 만든다.

수정:

- 모든 주요 인물에 첫 등장·반복 등장·전투·관계·재방문을 만든다.

### 오류 3: 강경 루트를 공격 횟수로 단순화

문제:

- 원작 강경 루트는 지역 일반 만남 소진과 보스 진입 조건을 함께 요구한다.
- 조건을 놓치면 루트가 중단된다.

수정:

- 지역별 `encounterRemaining`과 `routeCheckpoint`를 둔다.
- 보스 시작 시점에 지역 조건을 검증한다.

### 오류 4: 전투를 대화 선택지로만 처리

문제:

- 원작 전투는 ACT 순서, 상대 상태, 상대 턴의 고유 패턴, 아이템 조건이 연결된다.

수정:

- 각 전투를 `entry → playerTurn → enemyTurn → stateChange → resolution` 상태 머신으로 만든다.

### 오류 5: True Lab을 다음 지역으로 직선 배치

문제:

- True Lab은 본편 진행 후 조건을 만족해 되돌아가는 숨은 구역이다.

수정:

- 알파이썬 관계·평화 조건·Hotland 이후 재방문 트리거로 연다.

## 11. 구현용 최소 데이터 계약

```ts
type RoomDefinition = {
  id: string;
  region: string;
  exits: Record<string, string>;
  firstEnter?: EventId;
  returnEnter?: EventId;
  interactions: InteractionDefinition[];
  encounterTable?: EncounterTableId;
  savePoint?: SavePointDefinition;
};

type EventDefinition = {
  id: string;
  requires?: Condition[];
  once?: boolean;
  steps: EventStep[];
  effects?: Effect[];
};

type EncounterTable = {
  id: string;
  region: string;
  enabledWhen: Condition[];
  remaining?: number;
  encounters: EncounterWeight[];
  exhaustedEvent?: EventId;
};

type CharacterArc = {
  characterId: string;
  firstAppearance: EventId;
  recurringAppearances: EventId[];
  encounter?: string;
  relationshipEvents: EventId[];
  returnVisits: EventId[];
  routeVariants: Partial<Record<RouteHint, EventId[]>>;
};
```

## 12. 조사 출처

- [UNDERTALE 공식 About 페이지](https://undertale.com/about/): 비살상 해결, 적별 회피 패턴, 유머·대화·플레이어 선택
- [Undertale Wiki — Undertale](https://undertale.wiki/w/Undertale): 전체 세계·전투·줄거리 개요
- [Undertale Wiki — Category:Maps](https://undertale.wiki/w/Category:Maps): 지역별 방 그래프와 맵 목록
- [Undertale Wiki — Walkthrough: Every Story Step in Order](https://undertale.wiki.fextralife.com/Walkthrough:_Every_Story_Step_in_Order): 방 오브젝트·전화·SAVE Point에 걸친 스토리 진행 단계 분석
- [Undertale Wiki — Story Steps](https://undertale.wiki.fextralife.com/Story_Steps): 스토리 순서와 루트 조건을 분리하는 분석
- [Undertale Wiki — Encounter](https://undertale.wiki/w/Encounter): FIGHT·ACT·ITEM·MERCY, 상대 턴, 노란 이름, 비폭력 종료
- [Undertale Wiki — SAVE Point](https://undertale.wiki/w/SAVE_Point): 저장·회복·결의 문구·강경 지역 카운터
- [Undertale Wiki — Genocide Route](https://undertale.wiki/w/Genocide_Route): 지역별 만남 소진, “아무도 오지 않았다” 상태, 강경 루트 중단 조건
- [Undertale Wiki — Ruins](https://undertale.wiki/w/Ruins): Ruins 퍼즐·Napstablook·Toriel 진행
- [Undertale Wiki — Snowdin](https://undertale.wiki/w/Snowdin): Sans·Papyrus·퍼즐·마을·Papyrus 진행
- [Undertale Wiki — Waterfall](https://undertale.wiki/w/Waterfall): Undyne·Monster Kid·Mad Dummy·Napstablook·Temmie 진행
- [Undertale Wiki — Hotland](https://undertale.wiki/w/Hotland): Alphys·Mettaton·Muffet·CORE 연결
- [Undertale Wiki — Hotland Puzzles](https://undertale.wiki/w/Hotland/Puzzles): CORE와 True Lab 조건·방 연결
- [Undertale Wiki — Alphys date](https://undertale.wiki/w/Alphys_date): 관계 이벤트 이후 재방문과 True Lab 진입 흐름

## 13. 결론

UNDERFAIL이 먼저 만들어야 할 것은 전체 장편 대본이 아니다.

1. 방 그래프
2. 방 진입 이벤트
3. NPC 등장 상태
4. 일반 만남 테이블
5. 주요 전투 상태 머신
6. SAVE·재방문
7. 지역별 강경 소진 조건

이 일곱 가지를 교문·교육복지반·도미토리엘 대립에 먼저 적용한 뒤, 같은 구조를 파프리카와 체임버쌤으로 확장해야 한다. 현재의 직선형 장 대본을 그대로 코드화하면 Undertale식 구조가 아니라 대화 이벤트 모음이 된다.
