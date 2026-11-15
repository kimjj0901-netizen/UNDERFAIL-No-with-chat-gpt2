export type DialogueChoice = {
  label: string;
  next: string;
};

export type DialogueBlock = {
  speaker: string;
  lines: string[];
  choices?: DialogueChoice[];
};

export const openingDialogue: Record<string, DialogueBlock> = {
  bully: {
    speaker: '불리',
    lines: [
      '여기가 네가 배정된 학교야.',
      '이런 곳에서는 정해진 길보다 다른 선택이 더 재미있을지도 모르지.',
      '이거 받아. 좋은 거야.',
    ],
    choices: [
      { label: '받는다', next: 'accept' },
      { label: '거절한다', next: 'refuse' },
      { label: '어디서 났는지 묻는다', next: 'ask' },
    ],
  },
  accept: {
    speaker: '불리',
    lines: [
      '좋아. 그럼 네가 고른 거야.',
      '이제 네가 어떤 학생인지 알겠네.',
    ],
  },
  refuse: {
    speaker: '불리',
    lines: [
      '거절한다고 선택이 사라지는 건 아니야.',
      '학교는 네 대신 고를 테니까.',
    ],
  },
  ask: {
    speaker: '불리',
    lines: [
      '질문부터 하는구나.',
      '그럼 아직 네 선택을 정하지 않은 거네.',
    ],
  },
  dormitoriel: {
    speaker: '도미토리엘',
    lines: [
      '괜찮니? 이곳은 네가 잠시 쉬어 갈 수 있는 곳이란다.',
      '하지만 바깥으로 나가는 길은 안전하지 않아.',
      '돌아가서 수업을 받으렴.',
    ],
  },
};
