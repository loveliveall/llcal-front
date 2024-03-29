import blue from '@mui/material/colors/blue';

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
  { id: 101, name: '이벤트', description: '캐스트가 참여하는 유료 이벤트', colorHex: '#f4511e', groupId: 3, frozen: false },
  { id: 102, name: '러브 라이브', description: '러브라이브 공식 라이브', colorHex: '#f6bf26', groupId: 3, frozen: false },
  { id: 201, name: '발매 일정', description: '공식 굿즈 관련 발매 정보', colorHex: '#7cb342', groupId: null, frozen: false },

  { id: 301, name: '굿즈 예약', description: '공식 굿즈 예약 기간 정보', colorHex: blue[500], groupId: 1, frozen: false },
  { id: 302, name: '선행권/티켓 정보', description: '선행권 및 티켓 구매와 관련된 정보', colorHex: blue[400], groupId: 1, frozen: false },
  { id: 399, name: '기타 알림', description: '어느 분류에도 속하지 않는 알림 정보', colorHex: blue[200], groupId: 1, frozen: false },

  { id: 1001, name: '기타', description: '기타 일정', colorHex: '#a79b8e', groupId: null, frozen: false },
  { id: 1002, name: '물갤 이벤', description: '러브라이브 선샤인 갤러리 내부 이벤트', colorHex: '#616161', groupId: 2, frozen: false },
  // Frozen categories
  { id: 10000, name: '생일', description: '캐스트 및 캐릭터의 생일', colorHex: '#9e69af', groupId: null, frozen: true },
];
/* eslint-enable object-curly-newline */

export const categoryGroupList = [
  { id: 3, name: '이벤트' },
  { id: 1, name: '예약/알림' },
  { id: 2, name: '비공식 일정' },
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
  { id: 410, name: '미후네 시오리코', birthMonth: 10, birthDay: 5, voiceActorId: 210, isLoveLive: true },
  // Add you takasaki's birthday
  { id: 412, name: '미아 테일러', birthMonth: 12, birthDay: 6, voiceActorId: 212, isLoveLive: true },
  { id: 413, name: '쇼우 란쥬', birthMonth: 2, birthDay: 15, voiceActorId: 213, isLoveLive: true },
  { id: 51, name: '오오니시 아구리', birthMonth: 5, birthDay: 2, voiceActorId: 21, isLoveLive: false },
  { id: 52, name: '사가라 마유', birthMonth: 4, birthDay: 17, voiceActorId: 22, isLoveLive: false },
  { id: 53, name: '마에다 카오리', birthMonth: 4, birthDay: 25, voiceActorId: 23, isLoveLive: false },
  { id: 54, name: '쿠보타 미유', birthMonth: 1, birthDay: 31, voiceActorId: 24, isLoveLive: false },
  { id: 55, name: '무라카미 나츠미', birthMonth: 9, birthDay: 7, voiceActorId: 25, isLoveLive: false },
  { id: 56, name: '키토 아카리', birthMonth: 10, birthDay: 16, voiceActorId: 26, isLoveLive: false },
  { id: 57, name: '쿠스노키 토모리', birthMonth: 12, birthDay: 22, voiceActorId: 27, isLoveLive: false },
  { id: 58, name: '사시데 마리아', birthMonth: 9, birthDay: 20, voiceActorId: 28, isLoveLive: false },
  { id: 59, name: '타나카 치에미', birthMonth: 10, birthDay: 6, voiceActorId: 29, isLoveLive: false },
  { id: 510, name: '코이즈미 모에카', birthMonth: 2, birthDay: 27, voiceActorId: 210, isLoveLive: false },
  { id: 511, name: '야노 히나키', birthMonth: 3, birthDay: 5, voiceActorId: 211, isLoveLive: false },
  { id: 512, name: '우치다 슈우', birthMonth: 5, birthDay: 24, voiceActorId: 212, isLoveLive: false },
  { id: 513, name: '호모토 아키나', birthMonth: 8, birthDay: 5, voiceActorId: 213, isLoveLive: false },
  { id: 61, name: '사쿠라가와 메구', birthMonth: 10, birthDay: 24, voiceActorId: 31, isLoveLive: false },
  { id: 62, name: '오오하시 아유루', birthMonth: 4, birthDay: 28, voiceActorId: 32, isLoveLive: false },
  { id: 63, name: '마츠나가 마호', birthMonth: 1, birthDay: 23, voiceActorId: 33, isLoveLive: false },
  { id: 71, name: '타노 아사미', birthMonth: 2, birthDay: 12, voiceActorId: 41, isLoveLive: false },
  { id: 72, name: '사토 히나타', birthMonth: 12, birthDay: 23, voiceActorId: 42, isLoveLive: false },
  { id: 73, name: '카즈노 세이라', birthMonth: 5, birthDay: 4, voiceActorId: 41, isLoveLive: true },
  { id: 74, name: '카즈노 리아', birthMonth: 12, birthDay: 12, voiceActorId: 42, isLoveLive: true },
  { id: 801, name: '시부야 카논', birthMonth: 5, birthDay: 1, voiceActorId: 501, isLoveLive: true },
  { id: 802, name: '탕 쿠쿠', birthMonth: 7, birthDay: 17, voiceActorId: 502, isLoveLive: true },
  { id: 803, name: '아라시 치사토', birthMonth: 2, birthDay: 25, voiceActorId: 503, isLoveLive: true },
  { id: 804, name: '헤안나 스미레', birthMonth: 9, birthDay: 28, voiceActorId: 504, isLoveLive: true },
  { id: 805, name: '하즈키 렌', birthMonth: 11, birthDay: 24, voiceActorId: 505, isLoveLive: true },
  { id: 806, name: '사쿠라코지 키나코', birthMonth: 4, birthDay: 10, voiceActorId: 506, isLoveLive: true },
  { id: 807, name: '요네메 메이', birthMonth: 10, birthDay: 29, voiceActorId: 507, isLoveLive: true },
  { id: 808, name: '와카나 시키', birthMonth: 6, birthDay: 17, voiceActorId: 508, isLoveLive: true },
  { id: 809, name: '오니츠카 나츠미', birthMonth: 8, birthDay: 7, voiceActorId: 509, isLoveLive: true },
  { id: 901, name: '다테 사유리', birthMonth: 9, birthDay: 30, voiceActorId: 501, isLoveLive: false },
  { id: 902, name: 'Liyuu', birthMonth: 1, birthDay: 9, voiceActorId: 502, isLoveLive: false },
  { id: 903, name: '미사키 나코', birthMonth: 3, birthDay: 8, voiceActorId: 503, isLoveLive: false },
  { id: 904, name: '페이튼 나오미', birthMonth: 7, birthDay: 1, voiceActorId: 504, isLoveLive: false },
  { id: 905, name: '아오야마 나기사', birthMonth: 5, birthDay: 16, voiceActorId: 505, isLoveLive: false },
  { id: 906, name: '스즈하라 노조미', birthMonth: 11, birthDay: 1, voiceActorId: 506, isLoveLive: false },
  { id: 907, name: '야부시마 아카네', birthMonth: 7, birthDay: 18, voiceActorId: 507, isLoveLive: false },
  { id: 908, name: '오오쿠마 와카나', birthMonth: 4, birthDay: 13, voiceActorId: 508, isLoveLive: false },
  { id: 909, name: '에모리 아야', birthMonth: 2, birthDay: 23, voiceActorId: 509, isLoveLive: false },
  // Add mao & yuuna birthday
  { id: 1101, name: '유우키 유나', birthMonth: 6, birthDay: 9, voiceActorId: 601, isLoveLive: false },
  { id: 1102, name: '요시타케 치하야', birthMonth: 3, birthDay: 28, voiceActorId: 602, isLoveLive: false },
  // Add wein birthday
  { id: 1301, name: '유이나', birthMonth: 9, birthDay: 27, voiceActorId: 701, isLoveLive: false },
  // Add musical character birthday
  { id: 1501, name: '호리우치 마리나', birthMonth: 4, birthDay: 29, voiceActorId: 801, isLoveLive: false },
  { id: 1502, name: '아사이 나나미', birthMonth: 5, birthDay: 20, voiceActorId: 802, isLoveLive: false },
  { id: 1503, name: '안 줄리아', birthMonth: 1, birthDay: 15, voiceActorId: 803, isLoveLive: false },
  { id: 1504, name: '코야마 리나', birthMonth: 3, birthDay: 4, voiceActorId: 804, isLoveLive: false },
  { id: 1505, name: '사토 미나미', birthMonth: 8, birthDay: 3, voiceActorId: 805, isLoveLive: false },
  { id: 1506, name: '세키네 유우나', birthMonth: 9, birthDay: 28, voiceActorId: 806, isLoveLive: false },
  { id: 1507, name: '사이바 미즈키', birthMonth: 4, birthDay: 27, voiceActorId: 807, isLoveLive: false },
  { id: 1508, name: '호시모리 사나', birthMonth: 1, birthDay: 21, voiceActorId: 808, isLoveLive: false },
  { id: 1509, name: '미타 이부키', birthMonth: 7, birthDay: 19, voiceActorId: 809, isLoveLive: false },
  { id: 1510, name: '아오야마 루리', birthMonth: 1, birthDay: 31, voiceActorId: 810, isLoveLive: false },
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
// https://lovelive-as.bushimo.jp/assets/css/llas.member.css - p-member_detail__name
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
  { id: 210, name: '코이즈미 모에카', character: '미후네 시오리코', groupId: 3, colorHex: '#36b482' },
  { id: 211, name: '야노 히나키', character: '타카사키 유우', groupId: 3, colorHex: '#000000' },
  { id: 212, name: '우치다 슈우', character: '미아 테일러', groupId: 3, colorHex: '#a9a89a' },
  { id: 213, name: '호모토 아키나', character: '쇼우 란쥬', groupId: 3, colorHex: '#f69992' },
  { id: 31, name: '사쿠라가와 메구', character: '키라 츠바사', groupId: 4, colorHex: '' }, // Colorhex unknown
  { id: 32, name: '오오하시 아유루', character: '유키 안쥬', groupId: 4, colorHex: '' }, // Colorhex unknown
  { id: 33, name: '마츠나가 마호', character: '토도 에레나', groupId: 4, colorHex: '' }, // Colorhex unknown
  { id: 41, name: '타노 아사미', character: '카즈노 세이라', groupId: 5, colorHex: '#87ceeb' },
  { id: 42, name: '사토 히나타', character: '카즈노 리아', groupId: 5, colorHex: '#eeede6' },
  // Hex color from https://lovelive-anime.jp/yuigaoka/member/contents.css
  { id: 501, name: '다테 사유리', character: '시부야 카논', groupId: 6, colorHex: '#ff7f27' },
  { id: 502, name: 'Liyuu', character: '탕 쿠쿠', groupId: 6, colorHex: '#a0fff9' },
  { id: 503, name: '미사키 나코', character: '아라시 치사토', groupId: 6, colorHex: '#ff6e90' },
  { id: 504, name: '페이튼 나오미', character: '헤안나 스미레', groupId: 6, colorHex: '#74f466' },
  { id: 505, name: '아오야마 나기사', character: '하즈키 렌', groupId: 6, colorHex: '#0000a0' },
  { id: 506, name: '스즈하라 노조미', character: '사쿠라코지 키나코', groupId: 6, colorHex: '#fff442' },
  { id: 507, name: '야부시마 아카네', character: '요네메 메이', groupId: 6, colorHex: '#ff3535' },
  { id: 508, name: '오오쿠마 와카나', character: '와카나 시키', groupId: 6, colorHex: '#b2ffdd' },
  { id: 509, name: '에모리 아야', character: '오니츠카 나츠미', groupId: 6, colorHex: '#ff51c4' },
  { id: 601, name: '유우키 유나', character: '히이라기 마오', groupId: 7, colorHex: '' }, // Colorhex unknown
  { id: 602, name: '요시타케 치하야', character: '히지리사와 유우나', groupId: 7, colorHex: '' }, // Colorhex unknown
  { id: 701, name: '유이나', character: '빈 마르가레테', groupId: 8, colorHex: '' }, // Colorhex unknown
  { id: 801, name: '호리우치 마리나', character: '츠바키 루리카', groupId: 9, colorHex: '' }, // Colorhex unknown
  { id: 802, name: '아사이 나나미', character: '스메라기 유즈하', groupId: 9, colorHex: '' }, // Colorhex unknown
  { id: 803, name: '안 줄리아', character: '호조 유키노', groupId: 9, colorHex: '' }, // Colorhex unknown
  { id: 804, name: '코야마 리나', character: '아마쿠사 히카루', groupId: 9, colorHex: '' }, // Colorhex unknown
  { id: 805, name: '사토 미나미', character: '미카사 마야', groupId: 9, colorHex: '' }, // Colorhex unknown
  { id: 806, name: '세키네 유우나', character: '타키자와 안즈', groupId: 9, colorHex: '' }, // Colorhex unknown
  { id: 807, name: '사이바 미즈키', character: '와카츠키 미스즈', groupId: 9, colorHex: '' }, // Colorhex unknown
  { id: 808, name: '호시모리 사나', character: '쿠루스 토아', groupId: 9, colorHex: '' }, // Colorhex unknown
  { id: 809, name: '미타 이부키', character: '스즈카 레나', groupId: 9, colorHex: '' }, // Colorhex unknown
  { id: 810, name: '아오야마 루리', character: '하루카제 사야카', groupId: 9, colorHex: '' }, // Colorhex unknown
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
  { id: 6, name: 'Liella!', colorHex: '#0cd20c' }, // Colorhex from http://www.lovelive-anime.jp/yuigaoka/, will may change
  { id: 9, name: '러브라이브 뮤지컬', colorHex: '' }, // Colorhex unknown
  { id: 4, name: 'A-RISE', colorHex: '' }, // Colorhex unknown
  { id: 5, name: 'Saint Snow', colorHex: '' }, // Colorhex unknown
  { id: 7, name: 'Sunny Passion', colorHex: '' }, // Colorhex unknown
  { id: 8, name: '무소속', colorHex: '' }, // Colorhex unknown
];
