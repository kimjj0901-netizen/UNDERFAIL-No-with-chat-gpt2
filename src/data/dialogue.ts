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
      '교문은 열렸지만 너는 아직 아무것도 정하지 않았어.',
      '이 학교에서 정해진 길 말고도 시험할 수 있는 길이 있어.',
      '지금은 그 길이 어떤 방식으로 맞서는지 확인해 보자.',
    ],
  },
  dormitoriel: {
    speaker: '도미토리엘',
    lines: [
      '여기까지는 내가 지켜볼 수 있는 곳이란다.',
      '바깥 복도는 너를 분류하고 가려낼 것이다.',
      '돌아가 수업을 받는 편이 안전할 수도 있어.',
    ],
    choices: [
      { label: '돌아갈 준비를 한다', next: 'dormitoriel_return' },
      { label: '자신의 꿈을 말한다', next: 'dormitoriel_dream' },
      { label: '위험한 이유를 묻는다', next: 'dormitoriel_reason' },
    ],
  },
  dormitoriel_return: {
    speaker: '도미토리엘',
    lines: [
      '그 선택은 이해한다.',
      '다만 선택을 미뤘다는 이유로 길이 닫히지는 않았어.',
    ],
  },
  dormitoriel_dream: {
    speaker: '도미토리엘',
    lines: [
      '꿈을 말할 수 있다는 것은 스스로 살피고 있다는 뜻이구나.',
      '하지만 바깥은 너에게서 그 꿈을 가려내려 할 것이다.',
    ],
  },
  dormitoriel_reason: {
    speaker: '도미토리엘',
    lines: [
      '학교는 시험과 기록을 늘리고, 그 기록을 학생의 미래로 대신한다.',
      '내가 막는 이유는 그 대체가 너를 지우기 때문이란다.',
    ],
  },
  nerd: {
    speaker: '너드스타블룩',
    lines: [
      '어… 잠깐만.',
      '이 복도는 내가 막고 있어.',
      '내가 보는 만화 이야기를 들으면 길을 줄까.',
    ],
  },
};
