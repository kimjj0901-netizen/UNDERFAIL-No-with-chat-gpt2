# UNDERFAIL 기술 선택 기록

## 결정

현재 최적 경로는 **TypeScript + Vite + Phaser 3**다.

### 선택 이유

- 브라우저에서 바로 실행할 수 있다.
- 2D 맵, 키보드 입력, 대화창, 사용자 정의 전투를 직접 제어할 수 있다.
- 대사·장면·플래그를 TypeScript 데이터로 분리하기 쉽다.
- 사용자가 `src/data/`의 텍스트를 직접 수정하고 즉시 확인할 수 있다.
- GitHub Pages 같은 정적 호스팅으로 배포할 수 있다.
- 초기에는 외부 이미지·음악 없이 도형과 텍스트만으로 수직 슬라이스를 검증할 수 있다.

## 검토한 경로

| 경로 | 장점 | 이 프로젝트에서의 문제 | 판단 |
|---|---|---|---|
| Phaser + TypeScript + Vite | 웹 친화적, 코드로 전투·루트·데이터 구조를 통제, 정적 배포 | 맵 에디터와 기본 에셋을 직접 준비해야 함 | 채택 |
| Godot | 2D 도구와 씬 편집이 강력하고 대형 프로젝트에 적합 | 웹 export가 WebAssembly/WebGL 조건을 요구하고, 현재 저장소의 웹·텍스트 검수 흐름보다 무거움 | 보류 |
| RPG Maker MZ | 맵·이벤트·기본 RPG 기능을 빠르게 제작, 기본 에셋이 많음 | 커스텀 ACT/MERCY형 전투, 데이터 주도 루트, 웹 개발 협업을 플러그인에 의존 | 부적합 |
| Construct 3 | 브라우저 편집과 빠른 프로토타이핑, 여러 플랫폼 export | 장기적으로 복잡한 상태 타입·분기·테스트를 코드로 관리하기 불편하고 구독·export 조건을 확인해야 함 | 보류 |
| 순수 Canvas/Web API | 의존성이 적고 완전한 통제 가능 | 입력·씬·스케일링·전투 기반을 모두 직접 구현해야 해 시간 부족 상황에 불리 | 부적합 |

## 구현 순서

1. 교문 수직 슬라이스: 이동, 불리, 도미토리엘, 대화 선택
2. 대사 데이터를 `src/data/`에서 직접 검수할 수 있게 유지
3. 저장 가능한 `GameState` 추가
4. 첫 대응 심사 전투에 공격·행동·아이템·자비를 연결
5. 전투 결과를 교육복지반 재방문에 반영
6. 한 장이 완성된 뒤 같은 계약으로 지역을 확장

전체 스토리를 먼저 코드로 고정하지 않는다. 사용자가 플레이하면서 텍스트를 검수할 수 있는 작은 장면을 먼저 완성한다.

## 외부 소스·라이선스

현재 구현에서 사용하는 외부 소스:

- Phaser npm 패키지: 오픈 소스 라이브러리
- TypeScript, Vite npm 패키지: 개발 도구

현재 구현에서 사용하지 않는 외부 소스:

- Undertale의 대사·스크립트·음악·그래픽
- 외부 캐릭터 이미지·타일셋·폰트·음원

추후 외부 에셋을 사용할 경우 다음을 기록한 뒤 사용한다.

- 출처와 제작자
- 라이선스와 상업 이용 가능 여부
- 수정·재배포 가능 여부
- 저장소에 라이선스 파일 또는 출처 문서를 둘 위치

## 조사 출처

- [Phaser 공식 문서](https://phaser.io/oss/docs/): 브라우저용 HTML5 2D 프레임워크, Canvas/WebGL, JavaScript/TypeScript 사용
- [Godot 공식 Web export 문서](https://docs.godotengine.org/en/latest/learning/workflow/export/exporting_for_web.html): HTML5 export의 WebAssembly/WebGL 요구사항
- [RPG Maker MZ 공식 페이지](https://www.rpgmakerweb.com/products/rpg-maker-mz): 맵·기본 에셋·데이터베이스·플러그인 기능
- [Construct 3 공식 Publishing 문서](https://www.construct.net/en/make-games/manuals/construct-3/overview/publishing-projects): Web/모바일/데스크톱 export 범위
