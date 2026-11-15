import Phaser from 'phaser';
import { openingDialogue, type DialogueBlock } from '../data/dialogue';

type NpcId = 'bully' | 'dormitoriel';

export class SchoolScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private prompt!: Phaser.GameObjects.Text;
  private dialoguePanel?: Phaser.GameObjects.Rectangle;
  private dialogueText?: Phaser.GameObjects.Text;
  private dialogueSpeaker?: Phaser.GameObjects.Text;
  private choiceTexts: Phaser.GameObjects.Text[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private dialogueKey!: Phaser.Input.Keyboard.Key;
  private choiceUpKey!: Phaser.Input.Keyboard.Key;
  private choiceDownKey!: Phaser.Input.Keyboard.Key;
  private selectedChoice = 0;
  private activeNpc?: NpcId;
  private activeBlock?: DialogueBlock;
  private lineIndex = 0;
  private choiceMode = false;
  private dialogueOpen = false;
  private nPcs: Record<NpcId, Phaser.GameObjects.Rectangle> = {} as Record<
    NpcId,
    Phaser.GameObjects.Rectangle
  >;

  constructor() {
    super('SchoolScene');
  }

  create(): void {
    this.drawSchool();
    this.createCharacters();
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.dialogueKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.choiceUpKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.choiceDownKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.prompt = this.add
      .text(480, 500, '화살표: 이동   Enter: 대화   Space: 다음', {
        color: '#cbd5e1',
        fontFamily: 'monospace',
        fontSize: '16px',
      })
      .setOrigin(0.5);
  }

  update(): void {
    if (this.dialogueOpen) {
      this.updateDialogue();
      return;
    }

    const speed = 2.5;
    if (this.cursors.left.isDown) this.player.x -= speed;
    if (this.cursors.right.isDown) this.player.x += speed;
    if (this.cursors.up.isDown) this.player.y -= speed;
    if (this.cursors.down.isDown) this.player.y += speed;
    this.player.x = Phaser.Math.Clamp(this.player.x, 70, 890);
    this.player.y = Phaser.Math.Clamp(this.player.y, 100, 430);

    const nearby = this.findNearbyNpc();
    this.prompt.setText(
      nearby
        ? `${nearby === 'bully' ? '불리' : '도미토리엘'}에게 Enter`
        : '화살표: 이동   Enter: 대화',
    );

    if (nearby && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.openDialogue(nearby);
    }
  }

  private drawSchool(): void {
    this.add.rectangle(480, 270, 960, 540, 0x10131c);
    this.add.rectangle(480, 285, 820, 330, 0x263244);
    this.add.rectangle(480, 120, 820, 70, 0x17202e);
    this.add
      .text(480, 55, '풍화양상 고등학교 — 교육복지반 입구', {
        color: '#f8fafc',
        fontFamily: 'monospace',
        fontSize: '24px',
      })
      .setOrigin(0.5);
    this.add
      .text(480, 120, '성적과 생활기록에 의해 배정된 학교. 아직 선택하지 않은 길이 남아 있다.', {
        color: '#94a3b8',
        fontFamily: 'monospace',
        fontSize: '14px',
      })
      .setOrigin(0.5);
    this.add.rectangle(480, 455, 820, 12, 0x0f172a);
    this.add.text(115, 150, '교문', {
      color: '#fbbf24',
      fontFamily: 'monospace',
      fontSize: '16px',
    });
    this.add.text(760, 150, '교육복지실', {
      color: '#86efac',
      fontFamily: 'monospace',
      fontSize: '16px',
    });
  }

  private createCharacters(): void {
    this.player = this.add.rectangle(480, 350, 22, 22, 0xf87171);
    this.add
      .text(480, 375, '주인공', {
        color: '#fecaca',
        fontFamily: 'monospace',
        fontSize: '13px',
      })
      .setOrigin(0.5);

    this.nPcs.bully = this.add.rectangle(190, 245, 34, 34, 0xc084fc);
    this.add
      .text(190, 280, '불리', {
        color: '#e9d5ff',
        fontFamily: 'monospace',
        fontSize: '14px',
      })
      .setOrigin(0.5);

    this.nPcs.dormitoriel = this.add.rectangle(770, 245, 34, 34, 0xfbbf24);
    this.add
      .text(770, 280, '도미토리엘', {
        color: '#fef3c7',
        fontFamily: 'monospace',
        fontSize: '14px',
      })
      .setOrigin(0.5);
  }

  private findNearbyNpc(): NpcId | undefined {
    const candidates: NpcId[] = ['bully', 'dormitoriel'];
    return candidates.find((id) => {
      const npc = this.nPcs[id];
      return Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y) < 70;
    });
  }

  private openDialogue(npc: NpcId): void {
    this.activeNpc = npc;
    this.activeBlock = openingDialogue[npc];
    this.lineIndex = 0;
    this.selectedChoice = 0;
    this.choiceMode = false;
    this.dialogueOpen = true;
    this.createDialoguePanel();
    this.renderDialogue();
  }

  private createDialoguePanel(): void {
    this.dialoguePanel = this.add.rectangle(480, 400, 760, 170, 0x0b1020).setStrokeStyle(3, 0xf8fafc);
    this.dialogueSpeaker = this.add
      .text(125, 330, '', {
        color: '#fde68a',
        fontFamily: 'monospace',
        fontSize: '20px',
      })
      .setOrigin(0, 0.5);
    this.dialogueText = this.add.text(125, 365, '', {
      color: '#f8fafc',
      fontFamily: 'monospace',
      fontSize: '18px',
      wordWrap: { width: 670 },
      lineSpacing: 8,
    });
  }

  private updateDialogue(): void {
    if (!this.activeBlock) return;

    if (this.activeBlock.choices && !this.choiceMode && Phaser.Input.Keyboard.JustDown(this.dialogueKey)) {
      this.choiceMode = true;
      this.renderChoices();
      return;
    }

    if (this.choiceMode) {
      if (Phaser.Input.Keyboard.JustDown(this.choiceUpKey)) {
        this.selectedChoice =
          (this.selectedChoice - 1 + this.activeBlock.choices!.length) %
          this.activeBlock.choices!.length;
        this.renderChoices();
      }
      if (Phaser.Input.Keyboard.JustDown(this.choiceDownKey)) {
        this.selectedChoice = (this.selectedChoice + 1) % this.activeBlock.choices!.length;
        this.renderChoices();
      }
      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        const nextId = this.activeBlock.choices![this.selectedChoice].next;
        this.activeBlock = openingDialogue[nextId];
        this.lineIndex = 0;
        this.choiceMode = false;
        this.renderDialogue();
      }
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.dialogueKey)) {
      this.lineIndex += 1;
      if (this.lineIndex >= this.activeBlock.lines.length) {
        this.closeDialogue();
      } else {
        this.renderDialogue();
      }
    }
  }

  private renderDialogue(): void {
    if (!this.activeBlock || !this.dialogueText || !this.dialogueSpeaker) return;
    this.dialogueSpeaker.setText(this.activeBlock.speaker);
    this.dialogueText.setText(this.activeBlock.lines[this.lineIndex]);
    this.clearChoices();
    if (this.activeBlock.choices) {
      this.dialogueText.setText(`${this.activeBlock.lines[this.lineIndex]}\n\nSpace: 선택지 열기`);
    }
  }

  private renderChoices(): void {
    if (!this.activeBlock?.choices) return;
    this.clearChoices();
    this.activeBlock.choices.forEach((choice, index) => {
      const marker = index === this.selectedChoice ? '▶ ' : '  ';
      this.choiceTexts.push(
        this.add.text(160, 410 + index * 26, `${marker}${choice.label}`, {
          color: index === this.selectedChoice ? '#fbbf24' : '#f8fafc',
          fontFamily: 'monospace',
          fontSize: '17px',
        }),
      );
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
    this.activeNpc = undefined;
    this.dialogueOpen = false;
  }
}
