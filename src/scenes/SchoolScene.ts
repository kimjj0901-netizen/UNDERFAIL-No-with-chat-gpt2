import Phaser from 'phaser';
import { openingDialogue, type DialogueBlock } from '../data/dialogue';
import { loadGameState, saveGameState, type GameState } from '../state/gameState';

type RoomId =
  | 'title'
  | 'prologue'
  | 'flower'
  | 'bully_room'
  | 'rescue'
  | 'gate'
  | 'welfare'
  | 'hallway'
  | 'nerd';
type NpcId = 'bully' | 'dormitoriel' | 'nerd';
type EncounterId = 'bully_tutorial' | 'nerd_first';

export class SchoolScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private prompt!: Phaser.GameObjects.Text;
  private dialoguePanel?: Phaser.GameObjects.Rectangle;
  private dialogueSpeaker?: Phaser.GameObjects.Text;
  private dialogueText?: Phaser.GameObjects.Text;
  private choiceTexts: Phaser.GameObjects.Text[] = [];
  private statusPanel?: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private confirmKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private cancelKey!: Phaser.Input.Keyboard.Key;
  private menuKey!: Phaser.Input.Keyboard.Key;
  private state: GameState = loadGameState();
  private room: RoomId = 'title';
  private activeBlock?: DialogueBlock;
  private lineIndex = 0;
  private choiceMode = false;
  private dialogueOpen = false;
  private statusOpen = false;
  private selectedChoice = 0;
  private nameBuffer = '';
  private nameText?: Phaser.GameObjects.Text;
  private prologueText?: Phaser.GameObjects.Text;
  private prologueIndex = 0;

  constructor() {
    super('SchoolScene');
  }

  create(): void {
    this.state = loadGameState();
    if (!this.state.playerName) {
      this.state.playerName = '';
      this.state.sceneId = 'title';
      this.state.prologueIndex = 0;
      saveGameState(this.state);
    }
    const savedRoom = this.state.sceneId as RoomId;
    this.room = this.validRoom(savedRoom) ? savedRoom : 'title';
    this.choiceTexts = [];
    this.nameBuffer = this.state.playerName || '';
    this.prologueIndex = this.state.prologueIndex || 0;

    const completed = this.registry.get('completedEncounter') as EncounterId | undefined;
    if (completed === 'bully_tutorial') {
      this.room = 'rescue';
      this.state.sceneId = 'rescue';
      saveGameState(this.state);
    }
    if (completed === 'nerd_first') {
      this.room = 'nerd';
      this.state.sceneId = 'nerd';
      saveGameState(this.state);
    }
    this.registry.set('completedEncounter', undefined);

    this.drawRoom();
    this.createPlayer();
    this.createNpc();
    this.bindKeys();
  }

  private validRoom(room: RoomId): boolean {
    return [
      'title',
      'prologue',
      'flower',
      'bully_room',
      'rescue',
      'gate',
      'welfare',
      'hallway',
      'nerd',
    ].includes(room);
  }

  private bindKeys(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.confirmKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.cancelKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.menuKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    this.input.keyboard!.on('keydown', this.handleNameKey, this);
    this.prompt = this.add.text(480, 510, '', {
      color: '#cbd5e1',
      backgroundColor: '#090d16',
      padding: { x: 12, y: 7 },
      fontFamily: 'monospace',
      fontSize: '15px',
    }).setOrigin(0.5);
  }

  private drawRoom(): void {
    this.cameras.main.setBackgroundColor('#111827');
    this.add.rectangle(480, 270, 960, 540, 0x111827);
    if (this.room !== 'title') {
      this.add.rectangle(480, 54, 860, 64, 0x1f2937).setStrokeStyle(2, 0x4b5563);
      this.add.text(480, 54, this.title(), {
        color: '#f8fafc',
        fontFamily: 'monospace',
        fontSize: '22px',
      }).setOrigin(0.5);
    }
    this.add.rectangle(480, 448, 860, 238, 0x263244).setStrokeStyle(2, 0x44546a);

    for (let y = 150; y <= 420; y += 36) {
      this.add.rectangle(480, y, 860, 1, 0x64748b, 0.18);
    }
    for (let x = 50; x <= 910; x += 36) {
      this.add.rectangle(x, 285, 1, 270, 0x64748b, 0.18);
    }

    if (this.room === 'title') this.drawTitle();
    if (this.room === 'prologue') this.drawPrologue();
    if (this.room === 'flower') this.drawFlower();
    if (this.room === 'bully_room') this.drawBullyRoom();
    if (this.room === 'rescue') this.drawRescue();
    if (this.room === 'gate') this.drawGate();
    if (this.room === 'welfare') this.drawWelfare();
    if (this.room === 'hallway') this.drawHallway();
  }

  private title(): string {
    const titles: Record<RoomId, string> = {
      title: 'UNDERFAIL',
      prologue: '풍화양상 중학교 배정',
      flower: '꽃밭',
      rescue: '도미토리엘의 구출',
      bully_room: '교문 복도',
      gate: '풍화양상 고등학교',
      welfare: '교육복지반',
      hallway: '기초학력동 복도',
      nerd: '기초학력동 복도',
    };
    return titles[this.room];
  }

  private drawTitle(): void {
    this.add.text(480, 180, 'UNDERFAIL', {
      color: '#f8fafc',
      fontFamily: 'monospace',
      fontSize: '44px',
    }).setOrigin(0.5);
    this.add.text(480, 250, '이름을 입력하세요', {
      color: '#cbd5e1',
      fontFamily: 'monospace',
      fontSize: '18px',
    }).setOrigin(0.5);
    this.nameText = this.add.text(480, 320, this.nameBuffer || '＿', {
      color: '#fde68a',
      fontFamily: 'monospace',
      fontSize: '28px',
    }).setOrigin(0.5);
    this.add.text(480, 390, 'Z / Enter · 결정   X · 지움', {
      color: '#94a3b8',
      fontFamily: 'monospace',
      fontSize: '15px',
    }).setOrigin(0.5);
  }

  private drawPrologue(): void {
    const panels = [
      '꿈을 향해 나아가는 학생이, 그 꿈 위에 함께하는 학교가 있었다.',
      '많은 학생의 꿈이 함께하는 합주곡 혼합고등학교.',
      '그러나 학적과 성적 부진이 학교의 문을 닫게 했다.',
      '202X년, 풍화양상 중학교의 배정 통지서가 펼쳐진다.',
    ];
    this.add.text(480, 115, '프롤로그', {
      color: '#94a3b8',
      fontFamily: 'monospace',
      fontSize: '16px',
    }).setOrigin(0.5);
    this.add.rectangle(480, 285, 780, 250, 0x1f2937).setStrokeStyle(3, 0x64748b);
    this.prologueText = this.add.text(480, 285, panels[this.prologueIndex] || panels[panels.length - 1], {
      color: '#f8fafc',
      fontFamily: 'monospace',
      fontSize: '22px',
      align: 'center',
      wordWrap: { width: 700 },
      lineSpacing: 10,
    }).setOrigin(0.5);
    this.add.text(480, 445, 'Z / Enter · 다음', {
      color: '#94a3b8',
      fontFamily: 'monospace',
      fontSize: '15px',
    }).setOrigin(0.5);
  }

  private drawFlower(): void {
    this.add.rectangle(480, 300, 860, 290, 0x202a38);
    for (let i = 0; i < 9; i += 1) {
      this.add.circle(240 + (i % 3) * 240, 210 + Math.floor(i / 3) * 90, 18, 0xfde68a);
    }
    this.drawNpc('bully', 480, 260, 0xc084fc, '불리');
  }

  private drawRescue(): void {
    this.add.rectangle(480, 300, 860, 290, 0x202a38);
    this.drawNpc('dormitoriel', 480, 260, 0xfbbf24, '도미토리엘');
  }

  private drawBullyRoom(): void {
    this.add.rectangle(480, 270, 860, 130, 0x202936);
  }

  private drawGate(): void {
    this.add.rectangle(480, 270, 180, 220, 0x182436).setStrokeStyle(5, 0x94a3b8);
  }

  private drawWelfare(): void {
    this.add.rectangle(210, 260, 128, 82, 0x7d6a50).setStrokeStyle(3, 0xb6a581);
    this.add.rectangle(720, 300, 100, 130, 0x283448).setStrokeStyle(3, 0x718096);
  }

  private drawHallway(): void {
    this.add.rectangle(480, 270, 860, 28, 0x94a3b8);
  }

  private createPlayer(): void {
    if (this.room === 'title' || this.room === 'prologue') return;
    const positions: Record<RoomId, { x: number; y: number }> = {
      title: { x: 480, y: 350 },
      prologue: { x: 480, y: 350 },
      flower: { x: 480, y: 390 },
      rescue: { x: 480, y: 390 },
      bully_room: { x: 480, y: 350 },
      gate: { x: 480, y: 390 },
      welfare: { x: 180, y: 350 },
      hallway: { x: 180, y: 350 },
      nerd: { x: 480, y: 350 },
    };
    const position = positions[this.room];
    this.player = this.add.rectangle(position.x, position.y, 22, 22, 0xf87171)
      .setStrokeStyle(2, 0xfecaca);
  }

  private createNpc(): void {
    if (this.room === 'bully_room') this.drawNpc('bully', 480, 250, 0xc084fc, '불리');
    if (this.room === 'welfare') this.drawNpc('dormitoriel', 720, 280, 0xfbbf24, '도미토리엘');
    if (this.room === 'nerd') this.drawNpc('nerd', 700, 270, 0x60a5fa, '너드스타블룩');
  }

  private drawNpc(id: NpcId, x: number, y: number, color: number, label: string): void {
    const body = this.add.rectangle(x, y, 36, 36, color).setStrokeStyle(2, 0xe5e7eb);
    const name = this.add.text(x, y + 38, label, {
      color: '#f8fafc',
      backgroundColor: '#111827',
      padding: { x: 6, y: 4 },
      fontFamily: 'monospace',
      fontSize: '13px',
    }).setOrigin(0.5);
    body.setData('npcId', id);
  }

  update(): void {
    if (this.room === 'title') {
      this.prompt?.setText('이름 입력 · Z / Enter 결정 · X 지움');
      if (this.confirmPressed()) {
        this.state.playerName = this.nameBuffer.trim() || '주인공';
        this.state.sceneId = 'prologue';
        saveGameState(this.state);
        this.changeRoom('prologue');
      }
      if (Phaser.Input.Keyboard.JustDown(this.cancelKey)) {
        this.nameBuffer = '';
        this.nameText?.setText('＿');
      }
      return;
    }
    if (this.room === 'prologue') {
      this.prompt?.setText('Z / Enter · 다음 장면');
      if (this.confirmPressed()) {
        this.prologueIndex += 1;
        if (this.prologueIndex >= 4) {
          this.state.prologueIndex = 4;
          this.state.sceneId = 'flower';
          saveGameState(this.state);
          this.changeRoom('flower');
        } else {
          this.state.prologueIndex = this.prologueIndex;
          saveGameState(this.state);
          const panels = [
            '꿈을 향해 나아가는 학생이, 그 꿈 위에 함께하는 학교가 있었다.',
            '많은 학생의 꿈이 함께하는 합주곡 혼합고등학교.',
            '그러나 학적과 성적 부진이 학교의 문을 닫게 했다.',
            '202X년, 풍화양상 중학교의 배정 통지서가 펼쳐진다.',
          ];
          this.prologueText?.setText(panels[this.prologueIndex]);
        }
      }
      return;
    }
    if (this.room === 'flower') {
      this.prompt?.setText('Z / Enter · 불리와 대화');
      if (this.confirmPressed()) this.startEncounter('bully_tutorial');
      return;
    }
    if (this.room === 'rescue') {
      this.prompt?.setText('Z / Enter · 도미토리엘과 대화');
      if (this.confirmPressed()) this.openDialogue('dormitoriel');
      return;
    }
    if (this.statusOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.cancelKey) ||
        Phaser.Input.Keyboard.JustDown(this.menuKey)) this.closeStatus();
      return;
    }
    if (this.dialogueOpen) {
      this.updateDialogue();
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.menuKey)) {
      this.openStatus();
      return;
    }

    if (this.cursors.left.isDown) this.move(-2.6, 0);
    if (this.cursors.right.isDown) this.move(2.6, 0);
    if (this.cursors.up.isDown) this.move(0, -2.6);
    if (this.cursors.down.isDown) this.move(0, 2.6);

    const npc = this.nearbyNpc();
    if (npc) {
      this.prompt.setText(`Z / Enter - ${this.npcName(npc)}와 대화`);
      if (this.confirmPressed()) this.openDialogue(npc);
      return;
    }

    if (this.room === 'bully_room') {
      this.prompt.setText('Z / Enter - 불리와 대화');
      if (this.player.y <= 150 && this.state.flags.bullyTutorial) {
        this.changeRoom('gate');
      }
    } else if (this.room === 'gate') {
      this.prompt.setText('Z / Enter - 조사 / 북쪽 복도');
      if (this.player.y <= 150 && this.state.flags.bullyTutorial) {
        this.changeRoom('welfare');
      }
    } else if (this.room === 'welfare') {
      this.prompt.setText('Z / Enter - 대화 / C - 상태');
      if (this.player.x >= 872 && this.state.flags.dormitorielReleased) {
        this.changeRoom('hallway');
      }
    } else if (this.room === 'hallway') {
      this.prompt.setText('동쪽 복도 진행');
      if (this.player.x >= 872) this.changeRoom('nerd');
    } else {
      this.prompt.setText('Z / Enter - 너드스타블룩과 대화');
    }
  }

  private move(dx: number, dy: number): void {
    this.player.x = Phaser.Math.Clamp(this.player.x + dx, 86, 874);
    this.player.y = Phaser.Math.Clamp(this.player.y + dy, 150, 418);
  }

  private confirmPressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.confirmKey) ||
      Phaser.Input.Keyboard.JustDown(this.enterKey);
  }

  private handleNameKey(event: KeyboardEvent): void {
    if (this.room !== 'title') return;
    if (event.key === 'z' || event.key === 'Z') return;
    if (event.key === 'Backspace') {
      this.nameBuffer = this.nameBuffer.slice(0, -1);
    } else if (event.key.length === 1 && /^[가-힣a-zA-Z0-9 ]$/.test(event.key)) {
      if (this.nameBuffer.length < 12) this.nameBuffer += event.key;
    } else {
      return;
    }
    this.nameText?.setText(this.nameBuffer || '＿');
  }

  private nearbyNpc(): NpcId | undefined {
    const positions: Partial<Record<NpcId, { x: number; y: number }>> = {
      bully: this.room === 'flower'
        ? { x: 480, y: 260 }
        : this.room === 'bully_room'
          ? { x: 480, y: 250 }
          : undefined,
      dormitoriel: this.room === 'rescue'
        ? { x: 480, y: 260 }
        : this.room === 'welfare'
          ? { x: 720, y: 280 }
          : undefined,
      nerd: this.room === 'nerd'
        ? { x: 700, y: 270 }
        : undefined,
    };
    for (const id of ['bully', 'dormitoriel', 'nerd'] as NpcId[]) {
      const position = positions[id];
      if (position && Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        position.x,
        position.y,
      ) < 82) return id;
    }
    return undefined;
  }

  private npcName(id: NpcId): string {
    if (id === 'bully') return '불리';
    if (id === 'dormitoriel') return '도미토리엘';
    return '너드스타블룩';
  }

  private openDialogue(npc: NpcId): void {
    this.activeBlock = openingDialogue[npc];
    this.lineIndex = 0;
    this.choiceMode = false;
    this.selectedChoice = 0;
    this.dialogueOpen = true;
    this.dialoguePanel = this.add.rectangle(480, 405, 780, 155, 0x0b1020, 0.98)
      .setStrokeStyle(3, 0xd8dee9);
    this.dialogueSpeaker = this.add.text(118, 342, '', {
      color: '#fde68a',
      fontFamily: 'monospace',
      fontSize: '20px',
    });
    this.dialogueText = this.add.text(118, 380, '', {
      color: '#f8fafc',
      fontFamily: 'monospace',
      fontSize: '17px',
      wordWrap: { width: 724 },
      lineSpacing: 7,
    });
    this.renderDialogue();
  }

  private updateDialogue(): void {
    if (!this.activeBlock) return;
    if (this.choiceMode) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up!) ||
        Phaser.Input.Keyboard.JustDown(this.cursors.left!)) {
        this.selectedChoice =
          (this.selectedChoice - 1 + this.activeBlock.choices!.length) %
          this.activeBlock.choices!.length;
        this.renderChoices();
      }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down!) ||
        Phaser.Input.Keyboard.JustDown(this.cursors.right!)) {
        this.selectedChoice =
          (this.selectedChoice + 1) % this.activeBlock.choices!.length;
        this.renderChoices();
      }
      if (this.confirmPressed()) this.handleChoice(
        this.activeBlock.choices![this.selectedChoice].next,
      );
      if (Phaser.Input.Keyboard.JustDown(this.cancelKey)) {
        this.choiceMode = false;
        this.renderDialogue();
      }
      return;
    }

    if (this.confirmPressed()) {
      if (this.lineIndex + 1 < this.activeBlock.lines.length) {
        this.lineIndex += 1;
        this.renderDialogue();
      } else if (this.activeBlock.choices) {
        this.choiceMode = true;
        this.renderChoices();
      } else {
        this.closeDialogue();
        if (this.room === 'bully_room') this.startEncounter('bully_tutorial');
        if (this.room === 'nerd') this.startEncounter('nerd_first');
        if (this.room === 'rescue') this.changeRoom('welfare');
      }
    }
  }

  private handleChoice(nextId: string): void {
    if (nextId === 'dormitoriel_dream') {
      this.state.dormitorielResolve = Math.min(3, this.state.dormitorielResolve + 1);
      saveGameState(this.state);
      if (this.state.dormitorielResolve >= 3) {
        this.state.sceneId = 'hallway';
        this.state.flags.dormitorielReleased = true;
        saveGameState(this.state);
        this.closeDialogue();
        this.changeRoom('hallway');
        return;
      }
    }
    this.activeBlock = openingDialogue[nextId];
    this.lineIndex = 0;
    this.choiceMode = false;
    this.renderDialogue();
  }

  private renderDialogue(): void {
    if (!this.activeBlock || !this.dialogueText || !this.dialogueSpeaker) return;
    this.dialogueSpeaker.setText(this.activeBlock.speaker);
    this.dialogueText.setText(this.activeBlock.lines[this.lineIndex]);
    this.clearChoices();
  }

  private renderChoices(): void {
    if (!this.activeBlock?.choices) return;
    this.clearChoices();
    this.activeBlock.choices.forEach((choice, index) => {
      const marker = index === this.selectedChoice ? '▶ ' : '  ';
      this.choiceTexts.push(this.add.text(150, 416 + index * 27,
        `${marker}${choice.label}`, {
          color: index === this.selectedChoice ? '#fbbf24' : '#f8fafc',
          backgroundColor: '#101827',
          padding: { x: 8, y: 4 },
          fontFamily: 'monospace',
          fontSize: '16px',
        }));
    });
  }

  private clearChoices(): void {
    this.choiceTexts.forEach((text) => text.destroy());
    this.choiceTexts = [];
  }

  private closeDialogue(): void {
    this.dialoguePanel?.destroy();
    this.dialogueSpeaker?.destroy();
    this.dialogueText?.destroy();
    this.clearChoices();
    this.dialoguePanel = undefined;
    this.dialogueSpeaker = undefined;
    this.dialogueText = undefined;
    this.activeBlock = undefined;
    this.dialogueOpen = false;
  }

  private changeRoom(room: RoomId): void {
    this.state.sceneId = room;
    saveGameState(this.state);
    this.registry.set('completedEncounter', undefined);
    this.scene.restart();
  }

  private startEncounter(id: EncounterId): void {
    this.registry.set('encounterId', id);
    this.scene.start('BattleScene');
  }

  private openStatus(): void {
    this.statusOpen = true;
    const panel = this.add.rectangle(480, 300, 440, 220, 0x090d16, 0.98)
      .setStrokeStyle(3, 0xf8fafc);
    const title = this.add.text(480, 230, '상태', {
      color: '#f8fafc',
      fontFamily: 'monospace',
      fontSize: '24px',
    }).setOrigin(0.5);
    const content = this.add.text(260, 280,
      `집중력 20/20\n기록 위험 ${this.state.recordRisk}`, {
        color: '#cbd5e1',
        fontFamily: 'monospace',
        fontSize: '18px',
        lineSpacing: 10,
      });
    this.statusPanel = this.add.container(0, 0, [panel, title, content]);
  }

  private closeStatus(): void {
    this.statusPanel?.destroy();
    this.statusPanel = undefined;
    this.statusOpen = false;
  }
}
