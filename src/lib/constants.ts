// types.ts (or similar file for data definitions and utilities)
export interface TimeZone {
    country: string;
    utc: string;
    code: string;
    startTime: string;
    endTime: string;
  }
  
  export const timeZones: TimeZone[] = [
    { country: "美国",       utc: "UTC-05:00", code: "+1",   startTime: "20:00", endTime: "04:00" },
    { country: "阿根廷",     utc: "UTC-03:00", code: "+54",  startTime: "02:00", endTime: "10:00" },
    { country: "英国",       utc: "UTC+00:00", code: "+44",  startTime: "09:00", endTime: "17:00" },
    { country: "德国",       utc: "UTC+01:00", code: "+49",  startTime: "09:00", endTime: "17:00" },
    { country: "印度",       utc: "UTC+05:30", code: "+91",  startTime: "09:00", endTime: "17:00" },
    { country: "日本",       utc: "UTC+09:00", code: "+81",  startTime: "09:00", endTime: "17:00" },
    { country: "澳大利亚",   utc: "UTC+10:00", code: "+61",  startTime: "09:00", endTime: "17:00" },
    { country: "巴西",       utc: "UTC-03:00", code: "+55",  startTime: "09:00", endTime: "17:00" },
    { country: "俄罗斯",     utc: "UTC+03:00", code: "+7",   startTime: "09:00", endTime: "17:00" },
    { country: "中国",       utc: "UTC+08:00", code: "+86",  startTime: "09:00", endTime: "17:00" },
    { country: "法国",       utc: "UTC+01:00", code: "+33",  startTime: "09:00", endTime: "17:00" },
    { country: "加拿大",     utc: "UTC-05:00", code: "+1",   startTime: "09:00", endTime: "17:00" },
    { country: "墨西哥",     utc: "UTC-06:00", code: "+52",  startTime: "09:00", endTime: "17:00" },
    { country: "南非",       utc: "UTC+02:00", code: "+27",  startTime: "09:00", endTime: "17:00" },
    { country: "韩国",       utc: "UTC+09:00", code: "+82",  startTime: "09:00", endTime: "17:00" },
    { country: "意大利",     utc: "UTC+01:00", code: "+39",  startTime: "09:00", endTime: "17:00" },
    { country: "西班牙",     utc: "UTC+01:00", code: "+34",  startTime: "09:00", endTime: "17:00" },
    { country: "瑞典",       utc: "UTC+01:00", code: "+46",  startTime: "09:00", endTime: "17:00" },
    { country: "挪威",       utc: "UTC+01:00", code: "+47",  startTime: "09:00", endTime: "17:00" },
    { country: "芬兰",       utc: "UTC+02:00", code: "+358", startTime: "09:00", endTime: "17:00" },
    { country: "希腊",       utc: "UTC+02:00", code: "+30",  startTime: "09:00", endTime: "17:00" },
    { country: "土耳其",     utc: "UTC+03:00", code: "+90",  startTime: "09:00", endTime: "17:00" },
    { country: "以色列",     utc: "UTC+02:00", code: "+972", startTime: "09:00", endTime: "17:00" },
    { country: "埃及",       utc: "UTC+02:00", code: "+20",  startTime: "09:00", endTime: "17:00" },
    { country: "沙特阿拉伯", utc: "UTC+03:00", code: "+966", startTime: "09:00", endTime: "17:00" },
    { country: "阿联酋",     utc: "UTC+04:00", code: "+971", startTime: "09:00", endTime: "17:00" },
    { country: "新西兰",     utc: "UTC+12:00", code: "+64",  startTime: "09:00", endTime: "17:00" },
    { country: "菲律宾",     utc: "UTC+08:00", code: "+63",  startTime: "09:00", endTime: "17:00" },
    { country: "泰国",       utc: "UTC+07:00", code: "+66",  startTime: "09:00", endTime: "17:00" },
    { country: "越南",       utc: "UTC+07:00", code: "+84",  startTime: "09:00", endTime: "17:00" },
    { country: "马来西亚",   utc: "UTC+08:00", code: "+60",  startTime: "09:00", endTime: "17:00" },
    { country: "印度尼西亚", utc: "UTC+07:00", code: "+62",  startTime: "09:00", endTime: "17:00" },
    { country: "瑞士",       utc: "UTC+01:00", code: "+41",  startTime: "09:00", endTime: "17:00" },
    { country: "比利时",     utc: "UTC+01:00", code: "+32",  startTime: "09:00", endTime: "17:00" },
    { country: "荷兰",       utc: "UTC+01:00", code: "+31",  startTime: "09:00", endTime: "17:00" },
    { country: "波兰",       utc: "UTC+01:00", code: "+48",  startTime: "09:00", endTime: "17:00" },
    { country: "捷克",       utc: "UTC+01:00", code: "+420", startTime: "09:00", endTime: "17:00" },
    { country: "奥地利",     utc: "UTC+01:00", code: "+43",  startTime: "09:00", endTime: "17:00" },
    { country: "丹麦",       utc: "UTC+01:00", code: "+45",  startTime: "09:00", endTime: "17:00" },
    { country: "葡萄牙",     utc: "UTC+00:00", code: "+351", startTime: "09:00", endTime: "17:00" },
    { country: "冰岛",       utc: "UTC+00:00", code: "+354", startTime: "09:00", endTime: "17:00" },
    // Add more time zones if needed...
  ];
  
  export const countryNames: Record<string, { en: string; zh: string; ja: string }> = {
    "美国": { en: "United States", zh: "美国", ja: "アメリカ" },
    "阿根廷": { en: "Argentina", zh: "阿根廷", ja: "アルゼンチン" },
    "英国": { en: "United Kingdom", zh: "英国", ja: "イギリス" },
    "德国": { en: "Germany", zh: "德国", ja: "ドイツ" },
    "印度": { en: "India", zh: "印度", ja: "インド" },
    "日本": { en: "Japan", zh: "日本", ja: "日本" },
    "澳大利亚": { en: "Australia", zh: "澳大利亚", ja: "オーストラリア" },
    "巴西": { en: "Brazil", zh: "巴西", ja: "ブラジル" },
    "俄罗斯": { en: "Russia", zh: "俄罗斯", ja: "ロシア" },
    "中国": { en: "China", zh: "中国", ja: "中国" },
    "法国": { en: "France", zh: "法国", ja: "フランス" },
    "加拿大": { en: "Canada", zh: "加拿大", ja: "カナダ" },
    "墨西哥": { en: "Mexico", zh: "墨西哥", ja: "メキシコ" },
    "南非": { en: "South Africa", zh: "南非", ja: "南アフリカ" },
    "韩国": { en: "South Korea", zh: "韩国", ja: "韓国" },
    "意大利": { en: "Italy", zh: "意大利", ja: "イタリア" },
    "西班牙": { en: "Spain", zh: "西班牙", ja: "スペイン" },
    "瑞典": { en: "Sweden", zh: "瑞典", ja: "スウェーデン" },
    "挪威": { en: "Norway", zh: "挪威", ja: "ノルウェー" },
    "芬兰": { en: "Finland", zh: "芬兰", ja: "フィンランド" },
    "希腊": { en: "Greece", zh: "希腊", ja: "ギリシャ" },
    "土耳其": { en: "Turkey", zh: "土耳其", ja: "トルコ" },
    "以色列": { en: "Israel", zh: "以色列", ja: "イスラエル" },
    "埃及": { en: "Egypt", zh: "埃及", ja: "エジプト" },
    "沙特阿拉伯": { en: "Saudi Arabia", zh: "沙特阿拉伯", ja: "サウジアラビア" },
    "阿联酋": { en: "United Arab Emirates", zh: "阿联酋", ja: "アラブ首長国連邦" },
    "新西兰": { en: "New Zealand", zh: "新西兰", ja: "ニュージーランド" },
    "菲律宾": { en: "Philippines", zh: "菲律宾", ja: "フィリピン" },
    "泰国": { en: "Thailand", zh: "泰国", ja: "タイ" },
    "越南": { en: "Vietnam", zh: "越南", ja: "ベトナム" },
    "马来西亚": { en: "Malaysia", zh: "马来西亚", ja: "マレーシア" },
    "印度尼西亚": { en: "Indonesia", zh: "印度尼西亚", ja: "インドネシア" },
    "瑞士": { en: "Switzerland", zh: "瑞士", ja: "スイス" },
    "比利时": { en: "Belgium", zh: "比利时", ja: "ベルギー" },
    "荷兰": { en: "Netherlands", zh: "荷兰", ja: "オランダ" },
    "波兰": { en: "Poland", zh: "波兰", ja: "ポーランド" },
    "捷克": { en: "Czech Republic", zh: "捷克", ja: "チェコ" },
    "奥地利": { en: "Austria", zh: "奥地利", ja: "オーストリア" },
    "丹麦": { en: "Denmark", zh: "丹麦", ja: "デンマーク" },
    "葡萄牙": { en: "Portugal", zh: "葡萄牙", ja: "ポルトガル" },
    "冰岛": { en: "Iceland", zh: "冰岛", ja: "アイスランド" },
    // Add more country translations as needed...
  };
  
  // Utility functions
  export function parseUTCOffset(utc: string): { sign: number; hours: number; minutes: number } | null {
    const match = utc.match(/UTC([+-])(\d{2}):(\d{2})/);
    if (!match) return null;
    const sign = match[1] === '+' ? 1 : -1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);
    return { sign, hours, minutes };
  }
  
  export function computeZoneTime(utc: string, referenceDate: Date): string {
    const offset = parseUTCOffset(utc);
    if (!offset) return 'Invalid UTC';
    const utcTime = new Date(referenceDate.getTime() + referenceDate.getTimezoneOffset() * 60000);
    utcTime.setHours(utcTime.getHours() + offset.sign * offset.hours);
    utcTime.setMinutes(utcTime.getMinutes() + offset.sign * offset.minutes);
    const hours = utcTime.getHours().toString().padStart(2, '0');
    const minutes = utcTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  export function parseTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  export function getStatus(zone: TimeZone, current: string): { label: string; colorClass: string } {
    const currentMinutes = parseTimeToMinutes(current);
    const startMinutes = parseTimeToMinutes(zone.startTime);
    const endMinutes = parseTimeToMinutes(zone.endTime);
    let isWorking = false;
    if (startMinutes < endMinutes) {
      isWorking = currentMinutes >= startMinutes && currentMinutes < endMinutes;
    } else {
      isWorking = currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
    const aboutToStart = (startMinutes - currentMinutes >= 0 && startMinutes - currentMinutes <= 30) ||
                         (startMinutes < endMinutes && currentMinutes < startMinutes && startMinutes - currentMinutes <= 30);
    const aboutToFinish = (currentMinutes - endMinutes >= 0 && currentMinutes - endMinutes <= 30) ||
                          (startMinutes > endMinutes && currentMinutes < endMinutes && endMinutes - currentMinutes <= 30);
  
    if (isWorking) {
      if (aboutToFinish) {
        return { label: 'About to finish', colorClass: 'bg-yellow-500 text-white' };
      }
      return { label: 'Working', colorClass: 'bg-green-500 text-white' };
    } else {
      if (aboutToStart) {
        return { label: 'About to start', colorClass: 'bg-blue-500 text-white' };
      }
      return { label: 'Sleeping', colorClass: 'bg-gray-500 text-white' };
    }
  }
  