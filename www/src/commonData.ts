interface IID<T> {
  id: T,
}

interface IEventCategoryRawData {
  name: string,
  description: string,
  colorHex: string,
  frozen: boolean,
}

interface IEventCategoryData extends IEventCategoryRawData, IID<number> {}
interface IEventCategory extends IEventCategoryRawData, IID<string> {}

/* eslint-disable object-curly-newline, max-len */
const eventCategoryListData: IEventCategoryData[] = [
  { id: 5, name: '정기 방송 일정', description: '정기적으로 진행하는 라디오 등의 방송 일정', colorHex: '#ad1457', frozen: false },
  { id: 1, name: '온라인 이벤트', description: '정기 방송은 아니지만 라디오, TV 방송 등 공개적으로 시청 가능한 유형의 이벤트', colorHex: '#e67c73', frozen: false },
  { id: 2, name: '오프라인 이벤트', description: '라이브/라이브 뷰잉, 팬미팅, 악수회 등 한정된 대상을 상대로 하는 유형의 이벤트', colorHex: '#f6bf26', frozen: false },
  { id: 3, name: '발매 일정', description: 'CD, BD, 피규어 등의 공식 굿즈 발매 일정 정보', colorHex: '#33b679', frozen: false },
  { id: 4, name: '예약/알림', description: 'eplus 선행권 신청 기간, 각종 공식 굿즈 예약 구매 기간 등 미리 알아야 하는 정보', colorHex: '#4285f4', frozen: false },
  { id: 99, name: '기타', description: '기타 일정', colorHex: '#a79b8e', frozen: false },
  // Frozen categories
  { id: 100, name: '생일', description: '캐스트 및 캐릭터의 생일', colorHex: '#9e69af', frozen: true },
];
/* eslint-enable object-curly-newline */

export const eventCategoryList: IEventCategory[] = eventCategoryListData.map((data) => ({
  ...data,
  id: `category.${data.id}`,
}));

interface IBirthdayRawData {
  name: string,
  birthMonth: number,
  birthDay: number,
  voiceActorId: string,
  isLoveLive: boolean,
}

interface IBirthdayData extends IBirthdayRawData, IID<number> {}
interface IBirthday extends IBirthdayRawData, IID<string> {}

/* eslint-disable object-curly-newline */
export const birthdayListData: IBirthdayData[] = [
  { id: 1, name: '코사카 호노카', birthMonth: 8, birthDay: 3, voiceActorId: 'va.1', isLoveLive: true },
  { id: 2, name: '아야세 에리', birthMonth: 10, birthDay: 21, voiceActorId: 'va.2', isLoveLive: true },
  { id: 3, name: '미나미 코토리', birthMonth: 9, birthDay: 12, voiceActorId: 'va.3', isLoveLive: true },
  { id: 4, name: '소노다 우미', birthMonth: 3, birthDay: 15, voiceActorId: 'va.4', isLoveLive: true },
  { id: 5, name: '호시조라 린', birthMonth: 11, birthDay: 1, voiceActorId: 'va.5', isLoveLive: true },
  { id: 6, name: '니시키노 마키', birthMonth: 4, birthDay: 19, voiceActorId: 'va.6', isLoveLive: true },
  { id: 7, name: '토죠 노조미', birthMonth: 6, birthDay: 9, voiceActorId: 'va.7', isLoveLive: true },
  { id: 8, name: '코이즈미 하나요', birthMonth: 1, birthDay: 17, voiceActorId: 'va.8', isLoveLive: true },
  { id: 9, name: '야자와 니코', birthMonth: 7, birthDay: 22, voiceActorId: 'va.9', isLoveLive: true },
  { id: 11, name: '닛타 에미', birthMonth: 12, birthDay: 10, voiceActorId: 'va.1', isLoveLive: false },
  { id: 12, name: '난죠 요시노', birthMonth: 7, birthDay: 12, voiceActorId: 'va.2', isLoveLive: false },
  { id: 13, name: '우치다 아야', birthMonth: 7, birthDay: 23, voiceActorId: 'va.3', isLoveLive: false },
  { id: 14, name: '미모리 스즈코', birthMonth: 6, birthDay: 28, voiceActorId: 'va.4', isLoveLive: false },
  { id: 15, name: '이이다 리호', birthMonth: 10, birthDay: 26, voiceActorId: 'va.5', isLoveLive: false },
  { id: 16, name: 'Pile', birthMonth: 5, birthDay: 2, voiceActorId: 'va.6', isLoveLive: false },
  { id: 17, name: '쿠스다 아이나', birthMonth: 2, birthDay: 1, voiceActorId: 'va.7', isLoveLive: false },
  { id: 18, name: '쿠보 유리카', birthMonth: 5, birthDay: 19, voiceActorId: 'va.8', isLoveLive: false },
  { id: 19, name: '토쿠이 소라', birthMonth: 12, birthDay: 26, voiceActorId: 'va.9', isLoveLive: false },
  { id: 21, name: '타카미 치카', birthMonth: 8, birthDay: 1, voiceActorId: 'va.11', isLoveLive: true },
  { id: 22, name: '사쿠라우치 리코', birthMonth: 9, birthDay: 19, voiceActorId: 'va.12', isLoveLive: true },
  { id: 23, name: '마츠우라 카난', birthMonth: 2, birthDay: 10, voiceActorId: 'va.13', isLoveLive: true },
  { id: 24, name: '쿠로사와 다이아', birthMonth: 1, birthDay: 1, voiceActorId: 'va.14', isLoveLive: true },
  { id: 25, name: '와타나베 요우', birthMonth: 4, birthDay: 17, voiceActorId: 'va.15', isLoveLive: true },
  { id: 26, name: '츠시마 요시코', birthMonth: 7, birthDay: 13, voiceActorId: 'va.16', isLoveLive: true },
  { id: 27, name: '쿠니키다 하나마루', birthMonth: 3, birthDay: 4, voiceActorId: 'va.17', isLoveLive: true },
  { id: 28, name: '오하라 마리', birthMonth: 6, birthDay: 13, voiceActorId: 'va.18', isLoveLive: true },
  { id: 29, name: '쿠로사와 루비', birthMonth: 9, birthDay: 21, voiceActorId: 'va.19', isLoveLive: true },
  { id: 31, name: '이나미 안쥬', birthMonth: 2, birthDay: 7, voiceActorId: 'va.11', isLoveLive: false },
  { id: 32, name: '아이다 리카코', birthMonth: 8, birthDay: 8, voiceActorId: 'va.12', isLoveLive: false },
  { id: 33, name: '스와 나나카', birthMonth: 11, birthDay: 2, voiceActorId: 'va.13', isLoveLive: false },
  { id: 34, name: '코미야 아리사', birthMonth: 2, birthDay: 5, voiceActorId: 'va.14', isLoveLive: false },
  { id: 35, name: '사이토 슈카', birthMonth: 8, birthDay: 16, voiceActorId: 'va.15', isLoveLive: false },
  { id: 36, name: '코바야시 아이카', birthMonth: 10, birthDay: 23, voiceActorId: 'va.16', isLoveLive: false },
  { id: 37, name: '타카츠키 카나코', birthMonth: 9, birthDay: 25, voiceActorId: 'va.17', isLoveLive: false },
  { id: 38, name: '스즈키 아이나', birthMonth: 7, birthDay: 23, voiceActorId: 'va.18', isLoveLive: false },
  { id: 39, name: '후리하타 아이', birthMonth: 2, birthDay: 19, voiceActorId: 'va.19', isLoveLive: false },
  { id: 41, name: '우에하라 아유무', birthMonth: 3, birthDay: 1, voiceActorId: 'va.21', isLoveLive: true },
  { id: 42, name: '나카스 카스미', birthMonth: 1, birthDay: 23, voiceActorId: 'va.22', isLoveLive: true },
  { id: 43, name: '오사카 시즈쿠', birthMonth: 4, birthDay: 3, voiceActorId: 'va.23', isLoveLive: true },
  { id: 44, name: '아사카 카린', birthMonth: 6, birthDay: 29, voiceActorId: 'va.24', isLoveLive: true },
  { id: 45, name: '미야시타 아이', birthMonth: 5, birthDay: 30, voiceActorId: 'va.25', isLoveLive: true },
  { id: 46, name: '코노에 카나타', birthMonth: 12, birthDay: 16, voiceActorId: 'va.26', isLoveLive: true },
  { id: 47, name: '유키 세츠나', birthMonth: 8, birthDay: 8, voiceActorId: 'va.27', isLoveLive: true },
  { id: 48, name: '엠마 베르데', birthMonth: 2, birthDay: 5, voiceActorId: 'va.28', isLoveLive: true },
  { id: 49, name: '텐노지 리나', birthMonth: 11, birthDay: 13, voiceActorId: 'va.29', isLoveLive: true },
  { id: 51, name: '오오니시 아구리', birthMonth: 5, birthDay: 2, voiceActorId: 'va.21', isLoveLive: false },
  { id: 52, name: '사가라 마유', birthMonth: 4, birthDay: 17, voiceActorId: 'va.22', isLoveLive: false },
  { id: 53, name: '마에다 카오리', birthMonth: 4, birthDay: 25, voiceActorId: 'va.23', isLoveLive: false },
  { id: 54, name: '쿠보타 미유', birthMonth: 1, birthDay: 31, voiceActorId: 'va.24', isLoveLive: false },
  { id: 55, name: '무라카미 나츠미', birthMonth: 9, birthDay: 7, voiceActorId: 'va.25', isLoveLive: false },
  { id: 56, name: '키토 아카리', birthMonth: 10, birthDay: 16, voiceActorId: 'va.26', isLoveLive: false },
  { id: 57, name: '쿠스노키 토모리', birthMonth: 12, birthDay: 22, voiceActorId: 'va.27', isLoveLive: false },
  { id: 58, name: '사시데 마리아', birthMonth: 9, birthDay: 20, voiceActorId: 'va.28', isLoveLive: false },
  { id: 59, name: '타나카 치에미', birthMonth: 10, birthDay: 6, voiceActorId: 'va.29', isLoveLive: false },
  { id: 61, name: '사쿠라가와 메구', birthMonth: 10, birthDay: 24, voiceActorId: 'va.31', isLoveLive: false },
  { id: 62, name: '오오하시 아유루', birthMonth: 4, birthDay: 28, voiceActorId: 'va.32', isLoveLive: false },
  { id: 63, name: '마츠나가 마호', birthMonth: 1, birthDay: 23, voiceActorId: 'va.33', isLoveLive: false },
  { id: 71, name: '타노 아사미', birthMonth: 2, birthDay: 12, voiceActorId: 'va.41', isLoveLive: false },
  { id: 72, name: '사토 히나타', birthMonth: 12, birthDay: 23, voiceActorId: 'va.42', isLoveLive: false },
  { id: 73, name: '카즈노 세이라', birthMonth: 5, birthDay: 4, voiceActorId: 'va.41', isLoveLive: true },
  { id: 74, name: '카즈노 리아', birthMonth: 12, birthDay: 12, voiceActorId: 'va.42', isLoveLive: true },
];
/* eslint-enable object-curly-newline */

export const birthdayList: IBirthday[] = birthdayListData.map((data) => ({
  ...data,
  id: `birthday.${data.id}`,
}));

interface IVoiceActorRawData {
  name: string,
  character: string,
  groupId: string,
  colorHex: string,
}

interface IVoiceActorData extends IVoiceActorRawData, IID<number> {}
interface IVoiceActor extends IVoiceActorRawData, IID<string> {}

// Color code from https://lovelive-as.bushimo.jp/member/
/* eslint-disable object-curly-newline */
const voiceActorListData: IVoiceActorData[] = [
  { id: 1, name: '닛타 에미', character: '코사카 호노카', groupId: 'group.1', colorHex: '#ffa400' },
  { id: 2, name: '난죠 요시노', character: '아야세 에리', groupId: 'group.1', colorHex: '#41b6e6' },
  { id: 3, name: '우치다 아야', character: '미나미 코토리', groupId: 'group.1', colorHex: '#b2b4b2' },
  { id: 4, name: '미모리 스즈코', character: '소노다 우미', groupId: 'group.1', colorHex: '#003da5' },
  { id: 5, name: '이이다 리호', character: '호시조라 린', groupId: 'group.1', colorHex: '#fedd00' },
  { id: 6, name: 'Pile', character: '니시키노 마키', groupId: 'group.1', colorHex: '#ee2737' },
  { id: 7, name: '쿠스다 아이나', character: '토죠 노조미', groupId: 'group.1', colorHex: '#84329b' },
  { id: 8, name: '쿠보 유리카', character: '코이즈미 하나요', groupId: 'group.1', colorHex: '#00ab84' },
  { id: 9, name: '토쿠이 소라', character: '야자와 니코', groupId: 'group.1', colorHex: '#e31c79' },
  { id: 11, name: '이나미 안쥬', character: '타카미 치카', groupId: 'group.2', colorHex: '#ff7f32' },
  { id: 12, name: '아이다 리카코', character: '사쿠라우치 리코', groupId: 'group.2', colorHex: '#fb637e' },
  { id: 13, name: '스와 나나카', character: '마츠우라 카난', groupId: 'group.2', colorHex: '#00c7b1' },
  { id: 14, name: '코미야 아리사', character: '쿠로사와 다이아', groupId: 'group.2', colorHex: '#e4002b' },
  { id: 15, name: '사이토 슈카', character: '와타나베 요우', groupId: 'group.2', colorHex: '#00b5e2' },
  { id: 16, name: '코바야시 아이카', character: '츠시마 요시코', groupId: 'group.2', colorHex: '#b1b3b3' },
  { id: 17, name: '타카츠키 카나코', character: '쿠니키다 하나마루', groupId: 'group.2', colorHex: '#ffcd00' },
  { id: 18, name: '스즈키 아이나', character: '오하라 마리', groupId: 'group.2', colorHex: '#9b26b6' },
  { id: 19, name: '후리하타 아이', character: '쿠로사와 루비', groupId: 'group.2', colorHex: '#e93cac' },
  { id: 21, name: '오오니시 아구리', character: '우에하라 아유무', groupId: 'group.3', colorHex: '#ed7d95' },
  { id: 22, name: '사가라 마유', character: '나카스 카스미', groupId: 'group.3', colorHex: '#e7d600' },
  { id: 23, name: '마에다 카오리', character: '오사카 시즈쿠', groupId: 'group.3', colorHex: '#3fa4c6' },
  { id: 24, name: '쿠보타 미유', character: '아사카 카린', groupId: 'group.3', colorHex: '#495ec6' },
  { id: 25, name: '무라카미 나츠미', character: '미야시타 아이', groupId: 'group.3', colorHex: '#ff5800' },
  { id: 26, name: '키토 아카리', character: '코노에 카나타', groupId: 'group.3', colorHex: '#b365ae' },
  { id: 27, name: '쿠스노키 토모리', character: '유키 세츠나', groupId: 'group.3', colorHex: '#d81c2f' },
  { id: 28, name: '사시데 마리아', character: '엠마 베르데', groupId: 'group.3', colorHex: '#7dc62b' },
  { id: 29, name: '타나카 치에미', character: '텐노지 리나', groupId: 'group.3', colorHex: '#969fb5' },
  { id: 31, name: '사쿠라가와 메구', character: '키라 츠바사', groupId: 'group.4', colorHex: '#9a9a9a' }, // Colorhex unknown
  { id: 32, name: '오오하시 아유루', character: '유키 안쥬', groupId: 'group.4', colorHex: '#9a9a9a' }, // Colorhex unknown
  { id: 33, name: '마츠나가 마호', character: '토도 에레나', groupId: 'group.4', colorHex: '#9a9a9a' }, // Colorhex unknown
  { id: 41, name: '타노 아사미', character: '카즈노 세이라', groupId: 'group.5', colorHex: '#87ceeb' },
  { id: 42, name: '사토 히나타', character: '카즈노 리아', groupId: 'group.5', colorHex: '#eeede6' },
];
/* eslint-enable object-curly-newline */

export const voiceActorList: IVoiceActor[] = voiceActorListData.map((data) => ({
  ...data,
  id: `va.${data.id}`,
}));

interface IGroupInfoRawData {
  name: string,
}

interface IGroupInfoData extends IGroupInfoRawData, IID<number> {}
interface IGroupInfo extends IGroupInfoRawData, IID<string> {}

const groupInfoListData: IGroupInfoData[] = [
  { id: 1, name: 'µ\'s' },
  { id: 2, name: 'Aqours' },
  { id: 3, name: '니지동' },
  { id: 4, name: 'A-RISE' },
  { id: 5, name: 'Saint Snow' },
];

export const groupInfoList: IGroupInfo[] = groupInfoListData.map((data) => ({
  ...data,
  id: `group.${data.id}`,
}));

export const LOVELIVE_ID = 'll';
export const NON_LOVELIVE_ID = `no-${LOVELIVE_ID}`;
