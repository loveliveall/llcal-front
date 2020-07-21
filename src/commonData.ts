import blue from '@material-ui/core/colors/blue';

interface IID<T> {
  id: T,
}

interface IEventCategoryRaw {
  name: string,
  description: string,
  colorHex: string,
  groupId: number | null,
  frozen: boolean,
}

interface IEventCategory extends IEventCategoryRaw, IID<number> {}

/* eslint-disable object-curly-newline, max-len */
export const eventCategoryList: IEventCategory[] = [
  { id: 1, name: '방송(TV/라디오 등)', description: '방송 출연 정보', colorHex: '#d81b60', groupId: null, frozen: false },
  { id: 101, name: '이벤트', description: '캐스트가 참여하는 이벤트', colorHex: '#f4511e', groupId: null, frozen: false },
  { id: 201, name: '발매 일정', description: '공식 굿즈 관련 발매 정보', colorHex: '#7cb342', groupId: null, frozen: false },

  { id: 301, name: '굿즈 예약', description: '공식 굿즈 예약 기간 정보', colorHex: blue[500], groupId: 1, frozen: false },
  { id: 302, name: '선행권 정보', description: '선행권 기간과 관련된 정보', colorHex: blue[400], groupId: 1, frozen: false },
  { id: 399, name: '기타 알림', description: '어느 분류에도 속하지 않는 알림 정보', colorHex: blue[200], groupId: 1, frozen: false },

  { id: 1001, name: '기타', description: '기타 일정', colorHex: '#a79b8e', groupId: null, frozen: false },
  // Frozen categories
  { id: 10000, name: '생일', description: '캐스트 및 캐릭터의 생일', colorHex: '#9e69af', groupId: null, frozen: true },
];
/* eslint-enable object-curly-newline */

export const categoryGroupList = [
  { id: 1, name: '예약/알림' },
];

interface IBirthdayRaw {
  name: string,
  birthMonth: number,
  birthDay: number,
  voiceActorId: number,
  isLoveLive: boolean,
}

interface IBirthday extends IBirthdayRaw, IID<number> {}

/* eslint-disable object-curly-newline */
export const birthdayList: IBirthday[] = [
  { id: 1, name: '코사카 호노카', birthMonth: 8, birthDay: 3, voiceActorId: 1, isLoveLive: true },
  { id: 2, name: '아야세 에리', birthMonth: 10, birthDay: 21, voiceActorId: 2, isLoveLive: true },
  { id: 3, name: '미나미 코토리', birthMonth: 9, birthDay: 12, voiceActorId: 3, isLoveLive: true },
  { id: 4, name: '소노다 우미', birthMonth: 3, birthDay: 15, voiceActorId: 4, isLoveLive: true },
  { id: 5, name: '호시조라 린', birthMonth: 11, birthDay: 1, voiceActorId: 5, isLoveLive: true },
  { id: 6, name: '니시키노 마키', birthMonth: 4, birthDay: 19, voiceActorId: 6, isLoveLive: true },
  { id: 7, name: '토죠 노조미', birthMonth: 6, birthDay: 9, voiceActorId: 7, isLoveLive: true },
  { id: 8, name: '코이즈미 하나요', birthMonth: 1, birthDay: 17, voiceActorId: 8, isLoveLive: true },
  { id: 9, name: '야자와 니코', birthMonth: 7, birthDay: 22, voiceActorId: 9, isLoveLive: true },
  { id: 11, name: '닛타 에미', birthMonth: 12, birthDay: 10, voiceActorId: 1, isLoveLive: false },
  { id: 12, name: '난죠 요시노', birthMonth: 7, birthDay: 12, voiceActorId: 2, isLoveLive: false },
  { id: 13, name: '우치다 아야', birthMonth: 7, birthDay: 23, voiceActorId: 3, isLoveLive: false },
  { id: 14, name: '미모리 스즈코', birthMonth: 6, birthDay: 28, voiceActorId: 4, isLoveLive: false },
  { id: 15, name: '이이다 리호', birthMonth: 10, birthDay: 26, voiceActorId: 5, isLoveLive: false },
  { id: 16, name: 'Pile', birthMonth: 5, birthDay: 2, voiceActorId: 6, isLoveLive: false },
  { id: 17, name: '쿠스다 아이나', birthMonth: 2, birthDay: 1, voiceActorId: 7, isLoveLive: false },
  { id: 18, name: '쿠보 유리카', birthMonth: 5, birthDay: 19, voiceActorId: 8, isLoveLive: false },
  { id: 19, name: '토쿠이 소라', birthMonth: 12, birthDay: 26, voiceActorId: 9, isLoveLive: false },
  { id: 21, name: '타카미 치카', birthMonth: 8, birthDay: 1, voiceActorId: 11, isLoveLive: true },
  { id: 22, name: '사쿠라우치 리코', birthMonth: 9, birthDay: 19, voiceActorId: 12, isLoveLive: true },
  { id: 23, name: '마츠우라 카난', birthMonth: 2, birthDay: 10, voiceActorId: 13, isLoveLive: true },
  { id: 24, name: '쿠로사와 다이아', birthMonth: 1, birthDay: 1, voiceActorId: 14, isLoveLive: true },
  { id: 25, name: '와타나베 요우', birthMonth: 4, birthDay: 17, voiceActorId: 15, isLoveLive: true },
  { id: 26, name: '츠시마 요시코', birthMonth: 7, birthDay: 13, voiceActorId: 16, isLoveLive: true },
  { id: 27, name: '쿠니키다 하나마루', birthMonth: 3, birthDay: 4, voiceActorId: 17, isLoveLive: true },
  { id: 28, name: '오하라 마리', birthMonth: 6, birthDay: 13, voiceActorId: 18, isLoveLive: true },
  { id: 29, name: '쿠로사와 루비', birthMonth: 9, birthDay: 21, voiceActorId: 19, isLoveLive: true },
  { id: 31, name: '이나미 안쥬', birthMonth: 2, birthDay: 7, voiceActorId: 11, isLoveLive: false },
  { id: 32, name: '아이다 리카코', birthMonth: 8, birthDay: 8, voiceActorId: 12, isLoveLive: false },
  { id: 33, name: '스와 나나카', birthMonth: 11, birthDay: 2, voiceActorId: 13, isLoveLive: false },
  { id: 34, name: '코미야 아리사', birthMonth: 2, birthDay: 5, voiceActorId: 14, isLoveLive: false },
  { id: 35, name: '사이토 슈카', birthMonth: 8, birthDay: 16, voiceActorId: 15, isLoveLive: false },
  { id: 36, name: '코바야시 아이카', birthMonth: 10, birthDay: 23, voiceActorId: 16, isLoveLive: false },
  { id: 37, name: '타카츠키 카나코', birthMonth: 9, birthDay: 25, voiceActorId: 17, isLoveLive: false },
  { id: 38, name: '스즈키 아이나', birthMonth: 7, birthDay: 23, voiceActorId: 18, isLoveLive: false },
  { id: 39, name: '후리하타 아이', birthMonth: 2, birthDay: 19, voiceActorId: 19, isLoveLive: false },
  { id: 41, name: '우에하라 아유무', birthMonth: 3, birthDay: 1, voiceActorId: 21, isLoveLive: true },
  { id: 42, name: '나카스 카스미', birthMonth: 1, birthDay: 23, voiceActorId: 22, isLoveLive: true },
  { id: 43, name: '오사카 시즈쿠', birthMonth: 4, birthDay: 3, voiceActorId: 23, isLoveLive: true },
  { id: 44, name: '아사카 카린', birthMonth: 6, birthDay: 29, voiceActorId: 24, isLoveLive: true },
  { id: 45, name: '미야시타 아이', birthMonth: 5, birthDay: 30, voiceActorId: 25, isLoveLive: true },
  { id: 46, name: '코노에 카나타', birthMonth: 12, birthDay: 16, voiceActorId: 26, isLoveLive: true },
  { id: 47, name: '유키 세츠나', birthMonth: 8, birthDay: 8, voiceActorId: 27, isLoveLive: true },
  { id: 48, name: '엠마 베르데', birthMonth: 2, birthDay: 5, voiceActorId: 28, isLoveLive: true },
  { id: 49, name: '텐노지 리나', birthMonth: 11, birthDay: 13, voiceActorId: 29, isLoveLive: true },
  { id: 51, name: '오오니시 아구리', birthMonth: 5, birthDay: 2, voiceActorId: 21, isLoveLive: false },
  { id: 52, name: '사가라 마유', birthMonth: 4, birthDay: 17, voiceActorId: 22, isLoveLive: false },
  { id: 53, name: '마에다 카오리', birthMonth: 4, birthDay: 25, voiceActorId: 23, isLoveLive: false },
  { id: 54, name: '쿠보타 미유', birthMonth: 1, birthDay: 31, voiceActorId: 24, isLoveLive: false },
  { id: 55, name: '무라카미 나츠미', birthMonth: 9, birthDay: 7, voiceActorId: 25, isLoveLive: false },
  { id: 56, name: '키토 아카리', birthMonth: 10, birthDay: 16, voiceActorId: 26, isLoveLive: false },
  { id: 57, name: '쿠스노키 토모리', birthMonth: 12, birthDay: 22, voiceActorId: 27, isLoveLive: false },
  { id: 58, name: '사시데 마리아', birthMonth: 9, birthDay: 20, voiceActorId: 28, isLoveLive: false },
  { id: 59, name: '타나카 치에미', birthMonth: 10, birthDay: 6, voiceActorId: 29, isLoveLive: false },
  { id: 61, name: '사쿠라가와 메구', birthMonth: 10, birthDay: 24, voiceActorId: 31, isLoveLive: false },
  { id: 62, name: '오오하시 아유루', birthMonth: 4, birthDay: 28, voiceActorId: 32, isLoveLive: false },
  { id: 63, name: '마츠나가 마호', birthMonth: 1, birthDay: 23, voiceActorId: 33, isLoveLive: false },
  { id: 71, name: '타노 아사미', birthMonth: 2, birthDay: 12, voiceActorId: 41, isLoveLive: false },
  { id: 72, name: '사토 히나타', birthMonth: 12, birthDay: 23, voiceActorId: 42, isLoveLive: false },
  { id: 73, name: '카즈노 세이라', birthMonth: 5, birthDay: 4, voiceActorId: 41, isLoveLive: true },
  { id: 74, name: '카즈노 리아', birthMonth: 12, birthDay: 12, voiceActorId: 42, isLoveLive: true },
];
/* eslint-enable object-curly-newline */

interface IVoiceActorRaw {
  name: string,
  character: string,
  groupId: number,
  colorHex: string,
}

interface IVoiceActor extends IVoiceActorRaw, IID<number> {}

// Color code from https://lovelive-as.bushimo.jp/member/
/* eslint-disable object-curly-newline */
export const voiceActorList: IVoiceActor[] = [
  { id: 1, name: '닛타 에미', character: '코사카 호노카', groupId: 1, colorHex: '#ffa400' },
  { id: 2, name: '난죠 요시노', character: '아야세 에리', groupId: 1, colorHex: '#41b6e6' },
  { id: 3, name: '우치다 아야', character: '미나미 코토리', groupId: 1, colorHex: '#b2b4b2' },
  { id: 4, name: '미모리 스즈코', character: '소노다 우미', groupId: 1, colorHex: '#003da5' },
  { id: 5, name: '이이다 리호', character: '호시조라 린', groupId: 1, colorHex: '#fedd00' },
  { id: 6, name: 'Pile', character: '니시키노 마키', groupId: 1, colorHex: '#ee2737' },
  { id: 7, name: '쿠스다 아이나', character: '토죠 노조미', groupId: 1, colorHex: '#84329b' },
  { id: 8, name: '쿠보 유리카', character: '코이즈미 하나요', groupId: 1, colorHex: '#00ab84' },
  { id: 9, name: '토쿠이 소라', character: '야자와 니코', groupId: 1, colorHex: '#e31c79' },
  { id: 11, name: '이나미 안쥬', character: '타카미 치카', groupId: 2, colorHex: '#ff7f32' },
  { id: 12, name: '아이다 리카코', character: '사쿠라우치 리코', groupId: 2, colorHex: '#fb637e' },
  { id: 13, name: '스와 나나카', character: '마츠우라 카난', groupId: 2, colorHex: '#00c7b1' },
  { id: 14, name: '코미야 아리사', character: '쿠로사와 다이아', groupId: 2, colorHex: '#e4002b' },
  { id: 15, name: '사이토 슈카', character: '와타나베 요우', groupId: 2, colorHex: '#00b5e2' },
  { id: 16, name: '코바야시 아이카', character: '츠시마 요시코', groupId: 2, colorHex: '#b1b3b3' },
  { id: 17, name: '타카츠키 카나코', character: '쿠니키다 하나마루', groupId: 2, colorHex: '#ffcd00' },
  { id: 18, name: '스즈키 아이나', character: '오하라 마리', groupId: 2, colorHex: '#9b26b6' },
  { id: 19, name: '후리하타 아이', character: '쿠로사와 루비', groupId: 2, colorHex: '#e93cac' },
  { id: 21, name: '오오니시 아구리', character: '우에하라 아유무', groupId: 3, colorHex: '#ed7d95' },
  { id: 22, name: '사가라 마유', character: '나카스 카스미', groupId: 3, colorHex: '#e7d600' },
  { id: 23, name: '마에다 카오리', character: '오사카 시즈쿠', groupId: 3, colorHex: '#3fa4c6' },
  { id: 24, name: '쿠보타 미유', character: '아사카 카린', groupId: 3, colorHex: '#495ec6' },
  { id: 25, name: '무라카미 나츠미', character: '미야시타 아이', groupId: 3, colorHex: '#ff5800' },
  { id: 26, name: '키토 아카리', character: '코노에 카나타', groupId: 3, colorHex: '#b365ae' },
  { id: 27, name: '쿠스노키 토모리', character: '유키 세츠나', groupId: 3, colorHex: '#d81c2f' },
  { id: 28, name: '사시데 마리아', character: '엠마 베르데', groupId: 3, colorHex: '#7dc62b' },
  { id: 29, name: '타나카 치에미', character: '텐노지 리나', groupId: 3, colorHex: '#969fb5' },
  { id: 31, name: '사쿠라가와 메구', character: '키라 츠바사', groupId: 4, colorHex: '' }, // Colorhex unknown
  { id: 32, name: '오오하시 아유루', character: '유키 안쥬', groupId: 4, colorHex: '' }, // Colorhex unknown
  { id: 33, name: '마츠나가 마호', character: '토도 에레나', groupId: 4, colorHex: '' }, // Colorhex unknown
  { id: 41, name: '타노 아사미', character: '카즈노 세이라', groupId: 5, colorHex: '#87ceeb' },
  { id: 42, name: '사토 히나타', character: '카즈노 리아', groupId: 5, colorHex: '#eeede6' },
];
/* eslint-enable object-curly-newline */

interface IGroupInfoRaw {
  name: string,
  colorHex: string,
}

interface IGroupInfo extends IGroupInfoRaw, IID<number> {}

// Color code from https://lovelive-as.bushimo.jp/member/
export const groupInfoList: IGroupInfo[] = [
  { id: 1, name: 'µ\'s', colorHex: '#e93398' },
  { id: 2, name: 'Aqours', colorHex: '#019fe8' },
  { id: 3, name: '니지동', colorHex: '#ffc94a' },
  { id: 4, name: 'A-RISE', colorHex: '' }, // Colorhex unknown
  { id: 5, name: 'Saint Snow', colorHex: '' }, // Colorhex unknown
];
