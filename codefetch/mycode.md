Project Structure:
├── CODE_OF_CONDUCT.md
├── LICENSE
├── README.md
├── components.json
├── dist
│   ├── index.cjs.js
│   ├── index.cjs.js.map
│   ├── index.d.ts
│   ├── index.es.js
│   ├── index.es.js.map
│   ├── index.umd.js
│   ├── index.umd.js.map
│   └── styles.css
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── src
│   ├── index.ts
│   ├── tailwind-entry.css
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vite.config.ts.timestamp-1737279160654-7dcd7b48612c8.mjs


vite.config.ts
```
1 | import { defineConfig } from "vite";
2 | import react from "@vitejs/plugin-react";
3 | import { peerDependencies, name } from "./package.json";
4 | import path from "path";
5 | import dts from "vite-plugin-dts";
6 | 
7 | // https://vite.dev/config/
8 | export default defineConfig({
9 |   plugins: [
10 |     react(),
11 |     dts({
12 |       rollupTypes: true,
13 |       tsconfigPath: "./tsconfig.app.json",
14 |       exclude: ["**/*.stories.ts", "**/*.test.ts"],
15 |     }),
16 |   ],
17 |   optimizeDeps: {
18 |     exclude: ["lucide-react"],
19 |   },
20 |   resolve: {
21 |     alias: {
22 |       "@": path.resolve(__dirname, "./src"),
23 |     },
24 |   },
25 |   build: {
26 |     sourcemap: true,
27 |     emptyOutDir: true,
28 |     lib: {
29 |       entry: "./src/index.ts",
30 |       name: name,
31 |       fileName: (format) => `index.${format}.js`,
32 |       formats: ["es", "cjs", "umd"],
33 |     },
34 |     rollupOptions: {
35 |       external: Object.keys(peerDependencies),
36 |       output: { globals: { react: "React", "react-dom": "ReactDOM" } },
37 |     },
38 |   },
39 | });
```

.storybook/Theme.ts
```
1 | import { create } from "@storybook/theming/create";
2 | 
3 | export default create({
4 |   base: "dark",
5 |   brandTitle: "Custom Storybook",
6 |   brandUrl: "https://example.com",
7 |   brandImage: "https://fakeimg.pl/300x150/cccccc/909090?text=Your+Logo",
8 |   brandTarget: "_self",
9 | });
```

.storybook/main.ts
```
1 | import type { StorybookConfig } from "@storybook/react-vite";
2 | 
3 | const config: StorybookConfig = {
4 |   stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
5 |   addons: [
6 |     "@storybook/addon-onboarding",
7 |     "@storybook/addon-links",
8 |     "@storybook/addon-essentials",
9 |     "@chromatic-com/storybook",
10 |     "@storybook/addon-interactions",
11 |   ],
12 |   framework: {
13 |     name: "@storybook/react-vite",
14 |     options: {},
15 |   },
16 | };
17 | export default config;
```

.storybook/manager.ts
```
1 | import { addons } from "@storybook/manager-api";
2 | import theme from "./Theme";
3 | 
4 | addons.setConfig({
5 |   theme,
6 | });
```

.storybook/preview.tsx
```
1 | import type { Preview } from "@storybook/react";
2 | import "../src/index.css";
3 | import React from "react";
4 | const preview: Preview = {
5 |   parameters: {
6 |     controls: {
7 |       matchers: {
8 |         color: /(background|color)$/i,
9 |         date: /Date$/i,
10 |       },
11 |     },
12 |   },
13 |   decorators: [
14 |     // 👇 Defining the decorator in the preview file applies it to all stories
15 |     (Story) => {
16 |       return <Story />;
17 |     },
18 |   ],
19 | };
20 | 
21 | export default preview;
```

src/index.ts
```
1 | export { TimeZoneDataTable } from "@/lib/main";
```

src/vite-env.d.ts
```
1 | /// <reference types="vite/client" />
```

src/example/App.tsx
```
1 | import { TimeZoneDataTable } from "@/lib/main";
2 | import Header from "./Header";
3 | 
4 | function App() {
5 |   return (
6 |     <div className="min-h-screen flex flex-col bg-white dark:bg-gray-800 transition-colors duration-300">
7 |       <Header />
8 |       <TimeZoneDataTable />
9 |     </div>
10 |   );
11 | }
12 | 
13 | export default App;
```

src/example/DarkModeToggle.tsx
```
1 | // packages/component-library/src/components/DarkModeToggle.tsx
2 | 
3 | import React, { useEffect, useState } from "react";
4 | import { Sun, Moon } from "lucide-react"; // Using lucide-react for consistent icons
5 | import { cn } from "@/lib/utils"; // Ensure you have a utility for classNames
6 | 
7 | const DarkModeToggle: React.FC = () => {
8 |   const [isDark, setIsDark] = useState<boolean>(false);
9 | 
10 |   // On component mount, check for saved user preference or system preference
11 |   useEffect(() => {
12 |     const savedTheme = localStorage.getItem("theme");
13 |     if (savedTheme) {
14 |       setIsDark(savedTheme === "dark");
15 |       document.documentElement.classList.toggle("dark", savedTheme === "dark");
16 |     } else {
17 |       // If no saved preference, use system preference
18 |       const prefersDark = window.matchMedia(
19 |         "(prefers-color-scheme: dark)"
20 |       ).matches;
21 |       setIsDark(prefersDark);
22 |       document.documentElement.classList.toggle("dark", prefersDark);
23 |     }
24 |   }, []);
25 | 
26 |   // Toggle theme and save preference
27 |   const toggleTheme = () => {
28 |     const newIsDark = !isDark;
29 |     setIsDark(newIsDark);
30 |     document.documentElement.classList.toggle("dark", newIsDark);
31 |     localStorage.setItem("theme", newIsDark ? "dark" : "light");
32 |   };
33 | 
34 |   return (
35 |     <button
36 |       onClick={toggleTheme}
37 |       className={cn(
38 |         "p-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200",
39 |         "bg-gray-100 dark:bg-gray-700",
40 |         "hover:bg-gray-200 dark:hover:bg-gray-600"
41 |       )}
42 |       aria-label="Toggle Dark Mode"
43 |     >
44 |       {isDark ? (
45 |         // Sun Icon for Light Mode
46 |         <Sun className="h-5 w-5 text-yellow-500" aria-hidden="true" />
47 |       ) : (
48 |         // Moon Icon for Dark Mode
49 |         <Moon
50 |           className="h-5 w-5 text-gray-900 dark:text-gray-200"
51 |           aria-hidden="true"
52 |         />
53 |       )}
54 |     </button>
55 |   );
56 | };
57 | 
58 | DarkModeToggle.displayName = "DarkModeToggle";
59 | 
60 | export default DarkModeToggle;
```

src/example/Header.tsx
```
1 | // packages/component-library/src/components/Header.tsx
2 | 
3 | import React from "react";
4 | import DarkModeToggle from "./DarkModeToggle";
5 | 
6 | const Header: React.FC = () => {
7 |   return (
8 |     <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 shadow-md">
9 |       <h1 className="text-xl font-bold text-gray-800 dark:text-white">Demo</h1>
10 |       <DarkModeToggle />
11 |     </header>
12 |   );
13 | };
14 | 
15 | Header.displayName = "Header";
16 | 
17 | export default Header;
```

src/example/main.tsx
```
1 | import { StrictMode } from "react";
2 | import { createRoot } from "react-dom/client";
3 | import App from "./App";
4 | import "../tailwind-entry.css";
5 | 
6 | createRoot(document.getElementById("root")!).render(
7 |   <StrictMode>
8 |     <App />
9 |   </StrictMode>
10 | );
```

src/lib/biiz-utils.ts
```
1 | import { HolidayResult, TimeZone } from "./types";
2 | import Holidays from "date-holidays";
3 | 
4 | export const checkHoliday = (
5 |   date: Date,
6 |   countryCode: string
7 | ): HolidayResult => {
8 |   const hd = new Holidays(countryCode);
9 |   const holiday = hd.isHoliday(date);
10 | 
11 |   if (!holiday) {
12 |     return { isHoliday: false };
13 |   }
14 | 
15 |   return {
16 |     isHoliday: true,
17 |     name: holiday[0]?.name,
18 |     type: holiday[0]?.type,
19 |   };
20 | };
21 | export const updateTimeZonesWithHolidays = (
22 |   timeZones: TimeZone[],
23 |   date: Date
24 | ): TimeZone[] => {
25 |   return timeZones.map((timezone) => {
26 |     const countryCode = timezone.code.split("/")[0];
27 |     const holidayResult = checkHoliday(date, countryCode);
28 |     console.log(countryCode, holidayResult);
29 |     return {
30 |       ...timezone,
31 |       isHoliday: holidayResult.isHoliday,
32 |       holidayName: holidayResult.name,
33 |       holidayType: holidayResult.type,
34 |     };
35 |   });
36 | };
```

src/lib/constants.ts
```
1 | // types.ts (or similar file for data definitions and utilities)
2 | export interface TimeZone {
3 |     country: string;
4 |     utc: string;
5 |     code: string;
6 |     startTime: string;
7 |     endTime: string;
8 |   }
9 |   
10 |   export const timeZones: TimeZone[] = [
11 |     { country: "美国",       utc: "UTC-05:00", code: "+1",   startTime: "20:00", endTime: "04:00" },
12 |     { country: "阿根廷",     utc: "UTC-03:00", code: "+54",  startTime: "02:00", endTime: "10:00" },
13 |     { country: "英国",       utc: "UTC+00:00", code: "+44",  startTime: "09:00", endTime: "17:00" },
14 |     { country: "德国",       utc: "UTC+01:00", code: "+49",  startTime: "09:00", endTime: "17:00" },
15 |     { country: "印度",       utc: "UTC+05:30", code: "+91",  startTime: "09:00", endTime: "17:00" },
16 |     { country: "日本",       utc: "UTC+09:00", code: "+81",  startTime: "09:00", endTime: "17:00" },
17 |     { country: "澳大利亚",   utc: "UTC+10:00", code: "+61",  startTime: "09:00", endTime: "17:00" },
18 |     { country: "巴西",       utc: "UTC-03:00", code: "+55",  startTime: "09:00", endTime: "17:00" },
19 |     { country: "俄罗斯",     utc: "UTC+03:00", code: "+7",   startTime: "09:00", endTime: "17:00" },
20 |     { country: "中国",       utc: "UTC+08:00", code: "+86",  startTime: "09:00", endTime: "17:00" },
21 |     { country: "法国",       utc: "UTC+01:00", code: "+33",  startTime: "09:00", endTime: "17:00" },
22 |     { country: "加拿大",     utc: "UTC-05:00", code: "+1",   startTime: "09:00", endTime: "17:00" },
23 |     { country: "墨西哥",     utc: "UTC-06:00", code: "+52",  startTime: "09:00", endTime: "17:00" },
24 |     { country: "南非",       utc: "UTC+02:00", code: "+27",  startTime: "09:00", endTime: "17:00" },
25 |     { country: "韩国",       utc: "UTC+09:00", code: "+82",  startTime: "09:00", endTime: "17:00" },
26 |     { country: "意大利",     utc: "UTC+01:00", code: "+39",  startTime: "09:00", endTime: "17:00" },
27 |     { country: "西班牙",     utc: "UTC+01:00", code: "+34",  startTime: "09:00", endTime: "17:00" },
28 |     { country: "瑞典",       utc: "UTC+01:00", code: "+46",  startTime: "09:00", endTime: "17:00" },
29 |     { country: "挪威",       utc: "UTC+01:00", code: "+47",  startTime: "09:00", endTime: "17:00" },
30 |     { country: "芬兰",       utc: "UTC+02:00", code: "+358", startTime: "09:00", endTime: "17:00" },
31 |     { country: "希腊",       utc: "UTC+02:00", code: "+30",  startTime: "09:00", endTime: "17:00" },
32 |     { country: "土耳其",     utc: "UTC+03:00", code: "+90",  startTime: "09:00", endTime: "17:00" },
33 |     { country: "以色列",     utc: "UTC+02:00", code: "+972", startTime: "09:00", endTime: "17:00" },
34 |     { country: "埃及",       utc: "UTC+02:00", code: "+20",  startTime: "09:00", endTime: "17:00" },
35 |     { country: "沙特阿拉伯", utc: "UTC+03:00", code: "+966", startTime: "09:00", endTime: "17:00" },
36 |     { country: "阿联酋",     utc: "UTC+04:00", code: "+971", startTime: "09:00", endTime: "17:00" },
37 |     { country: "新西兰",     utc: "UTC+12:00", code: "+64",  startTime: "09:00", endTime: "17:00" },
38 |     { country: "菲律宾",     utc: "UTC+08:00", code: "+63",  startTime: "09:00", endTime: "17:00" },
39 |     { country: "泰国",       utc: "UTC+07:00", code: "+66",  startTime: "09:00", endTime: "17:00" },
40 |     { country: "越南",       utc: "UTC+07:00", code: "+84",  startTime: "09:00", endTime: "17:00" },
41 |     { country: "马来西亚",   utc: "UTC+08:00", code: "+60",  startTime: "09:00", endTime: "17:00" },
42 |     { country: "印度尼西亚", utc: "UTC+07:00", code: "+62",  startTime: "09:00", endTime: "17:00" },
43 |     { country: "瑞士",       utc: "UTC+01:00", code: "+41",  startTime: "09:00", endTime: "17:00" },
44 |     { country: "比利时",     utc: "UTC+01:00", code: "+32",  startTime: "09:00", endTime: "17:00" },
45 |     { country: "荷兰",       utc: "UTC+01:00", code: "+31",  startTime: "09:00", endTime: "17:00" },
46 |     { country: "波兰",       utc: "UTC+01:00", code: "+48",  startTime: "09:00", endTime: "17:00" },
47 |     { country: "捷克",       utc: "UTC+01:00", code: "+420", startTime: "09:00", endTime: "17:00" },
48 |     { country: "奥地利",     utc: "UTC+01:00", code: "+43",  startTime: "09:00", endTime: "17:00" },
49 |     { country: "丹麦",       utc: "UTC+01:00", code: "+45",  startTime: "09:00", endTime: "17:00" },
50 |     { country: "葡萄牙",     utc: "UTC+00:00", code: "+351", startTime: "09:00", endTime: "17:00" },
51 |     { country: "冰岛",       utc: "UTC+00:00", code: "+354", startTime: "09:00", endTime: "17:00" },
52 |     // Add more time zones if needed...
53 |   ];
54 |   
55 |   export const countryNames: Record<string, { en: string; zh: string; ja: string }> = {
56 |     "美国": { en: "United States", zh: "美国", ja: "アメリカ" },
57 |     "阿根廷": { en: "Argentina", zh: "阿根廷", ja: "アルゼンチン" },
58 |     "英国": { en: "United Kingdom", zh: "英国", ja: "イギリス" },
59 |     "德国": { en: "Germany", zh: "德国", ja: "ドイツ" },
60 |     "印度": { en: "India", zh: "印度", ja: "インド" },
61 |     "日本": { en: "Japan", zh: "日本", ja: "日本" },
62 |     "澳大利亚": { en: "Australia", zh: "澳大利亚", ja: "オーストラリア" },
63 |     "巴西": { en: "Brazil", zh: "巴西", ja: "ブラジル" },
64 |     "俄罗斯": { en: "Russia", zh: "俄罗斯", ja: "ロシア" },
65 |     "中国": { en: "China", zh: "中国", ja: "中国" },
66 |     "法国": { en: "France", zh: "法国", ja: "フランス" },
67 |     "加拿大": { en: "Canada", zh: "加拿大", ja: "カナダ" },
68 |     "墨西哥": { en: "Mexico", zh: "墨西哥", ja: "メキシコ" },
69 |     "南非": { en: "South Africa", zh: "南非", ja: "南アフリカ" },
70 |     "韩国": { en: "South Korea", zh: "韩国", ja: "韓国" },
71 |     "意大利": { en: "Italy", zh: "意大利", ja: "イタリア" },
72 |     "西班牙": { en: "Spain", zh: "西班牙", ja: "スペイン" },
73 |     "瑞典": { en: "Sweden", zh: "瑞典", ja: "スウェーデン" },
74 |     "挪威": { en: "Norway", zh: "挪威", ja: "ノルウェー" },
75 |     "芬兰": { en: "Finland", zh: "芬兰", ja: "フィンランド" },
76 |     "希腊": { en: "Greece", zh: "希腊", ja: "ギリシャ" },
77 |     "土耳其": { en: "Turkey", zh: "土耳其", ja: "トルコ" },
78 |     "以色列": { en: "Israel", zh: "以色列", ja: "イスラエル" },
79 |     "埃及": { en: "Egypt", zh: "埃及", ja: "エジプト" },
80 |     "沙特阿拉伯": { en: "Saudi Arabia", zh: "沙特阿拉伯", ja: "サウジアラビア" },
81 |     "阿联酋": { en: "United Arab Emirates", zh: "阿联酋", ja: "アラブ首長国連邦" },
82 |     "新西兰": { en: "New Zealand", zh: "新西兰", ja: "ニュージーランド" },
83 |     "菲律宾": { en: "Philippines", zh: "菲律宾", ja: "フィリピン" },
84 |     "泰国": { en: "Thailand", zh: "泰国", ja: "タイ" },
85 |     "越南": { en: "Vietnam", zh: "越南", ja: "ベトナム" },
86 |     "马来西亚": { en: "Malaysia", zh: "马来西亚", ja: "マレーシア" },
87 |     "印度尼西亚": { en: "Indonesia", zh: "印度尼西亚", ja: "インドネシア" },
88 |     "瑞士": { en: "Switzerland", zh: "瑞士", ja: "スイス" },
89 |     "比利时": { en: "Belgium", zh: "比利时", ja: "ベルギー" },
90 |     "荷兰": { en: "Netherlands", zh: "荷兰", ja: "オランダ" },
91 |     "波兰": { en: "Poland", zh: "波兰", ja: "ポーランド" },
92 |     "捷克": { en: "Czech Republic", zh: "捷克", ja: "チェコ" },
93 |     "奥地利": { en: "Austria", zh: "奥地利", ja: "オーストリア" },
94 |     "丹麦": { en: "Denmark", zh: "丹麦", ja: "デンマーク" },
95 |     "葡萄牙": { en: "Portugal", zh: "葡萄牙", ja: "ポルトガル" },
96 |     "冰岛": { en: "Iceland", zh: "冰岛", ja: "アイスランド" },
97 |     // Add more country translations as needed...
98 |   };
99 |   
100 |   // Utility functions
101 |   export function parseUTCOffset(utc: string): { sign: number; hours: number; minutes: number } | null {
102 |     const match = utc.match(/UTC([+-])(\d{2}):(\d{2})/);
103 |     if (!match) return null;
104 |     const sign = match[1] === '+' ? 1 : -1;
105 |     const hours = parseInt(match[2], 10);
106 |     const minutes = parseInt(match[3], 10);
107 |     return { sign, hours, minutes };
108 |   }
109 |   
110 |   export function computeZoneTime(utc: string, referenceDate: Date): string {
111 |     const offset = parseUTCOffset(utc);
112 |     if (!offset) return 'Invalid UTC';
113 |     const utcTime = new Date(referenceDate.getTime() + referenceDate.getTimezoneOffset() * 60000);
114 |     utcTime.setHours(utcTime.getHours() + offset.sign * offset.hours);
115 |     utcTime.setMinutes(utcTime.getMinutes() + offset.sign * offset.minutes);
116 |     const hours = utcTime.getHours().toString().padStart(2, '0');
117 |     const minutes = utcTime.getMinutes().toString().padStart(2, '0');
118 |     return `${hours}:${minutes}`;
119 |   }
120 |   
121 |   export function parseTimeToMinutes(timeStr: string): number {
122 |     const [hours, minutes] = timeStr.split(':').map(Number);
123 |     return hours * 60 + minutes;
124 |   }
125 |   
126 |   export function getStatus(zone: TimeZone, current: string): { label: string; colorClass: string } {
127 |     const currentMinutes = parseTimeToMinutes(current);
128 |     const startMinutes = parseTimeToMinutes(zone.startTime);
129 |     const endMinutes = parseTimeToMinutes(zone.endTime);
130 |     let isWorking = false;
131 |     if (startMinutes < endMinutes) {
132 |       isWorking = currentMinutes >= startMinutes && currentMinutes < endMinutes;
133 |     } else {
134 |       isWorking = currentMinutes >= startMinutes || currentMinutes < endMinutes;
135 |     }
136 |     const aboutToStart = (startMinutes - currentMinutes >= 0 && startMinutes - currentMinutes <= 30) ||
137 |                          (startMinutes < endMinutes && currentMinutes < startMinutes && startMinutes - currentMinutes <= 30);
138 |     const aboutToFinish = (currentMinutes - endMinutes >= 0 && currentMinutes - endMinutes <= 30) ||
139 |                           (startMinutes > endMinutes && currentMinutes < endMinutes && endMinutes - currentMinutes <= 30);
140 |   
141 |     if (isWorking) {
142 |       if (aboutToFinish) {
143 |         return { label: 'About to finish', colorClass: 'bg-yellow-500 text-white' };
144 |       }
145 |       return { label: 'Working', colorClass: 'bg-green-500 text-white' };
146 |     } else {
147 |       if (aboutToStart) {
148 |         return { label: 'About to start', colorClass: 'bg-blue-500 text-white' };
149 |       }
150 |       return { label: 'Sleeping', colorClass: 'bg-gray-500 text-white' };
151 |     }
152 |   }
153 |   
```

src/lib/main.tsx
```
1 | "use client";
2 | 
3 | import * as React from "react";
4 | import { zodResolver } from "@hookform/resolvers/zod";
5 | import { useForm } from "react-hook-form";
6 | import { z } from "zod";
7 | import {
8 |   ColumnDef,
9 |   flexRender,
10 |   getCoreRowModel,
11 |   getFilteredRowModel,
12 |   getPaginationRowModel,
13 |   getSortedRowModel,
14 |   SortingState,
15 |   ColumnFiltersState,
16 |   VisibilityState,
17 |   useReactTable,
18 | } from "@tanstack/react-table";
19 | import {
20 |   Table,
21 |   TableBody,
22 |   TableCell,
23 |   TableHead,
24 |   TableHeader,
25 |   TableRow,
26 | } from "@/components/ui/table";
27 | import { Button } from "@/components/ui/button";
28 | import { Star, StarOff } from "lucide-react";
29 | import {
30 |   computeZoneTime,
31 |   countryNames,
32 |   getStatus,
33 |   TimeZone,
34 |   timeZones,
35 | } from "./constants";
36 | 
37 | import {
38 |   Form,
39 |   FormControl,
40 |   FormDescription,
41 |   FormField,
42 |   FormItem,
43 |   FormLabel,
44 |   FormMessage,
45 | } from "@/components/ui/form";
46 | import { Input } from "@/components/ui/input";
47 | 
48 | type Language = "en" | "zh" | "ja";
49 | 
50 | const translations: Record<Language, Record<string, string>> = {
51 |   en: {
52 |     country: "Country",
53 |     timezone: "Time Zone",
54 |     code: "Code",
55 |     start: "Start Time",
56 |     end: "End Time",
57 |     current: "Current Time",
58 |     title: "When They Work",
59 |     enterTime: "Enter ISO Time",
60 |     errorIsoTime:
61 |       "Invalid ISO 8601 string. Please use a format like 2023-01-01T12:00:00Z or 2023-01-01T12:00:00+09:00.",
62 |   },
63 |   zh: {
64 |     country: "国家",
65 |     timezone: "时区",
66 |     code: "代码",
67 |     start: "工作开始时间",
68 |     end: "工作结束时间",
69 |     current: "当前时间",
70 |     title: "他们的工作时间",
71 |     enterTime: "输入ISO时间",
72 |     errorIsoTime:
73 |       "无效的ISO 8601字符串。请使用类似 2023-01-01T12:00:00Z 或 2023-01-01T12:00:00+09:00 的格式。",
74 |   },
75 |   ja: {
76 |     country: "国",
77 |     timezone: "タイムゾーン",
78 |     code: "コード",
79 |     start: "勤務開始時間",
80 |     end: "勤務終了時間",
81 |     current: "現在の時間",
82 |     title: "彼らの勤務時間",
83 |     enterTime: "ISO時間を入力",
84 |     errorIsoTime:
85 |       "無効なISO 8601文字列です。例えば 2023-01-01T12:00:00Z または 2023-01-01T12:00:00+09:00 のような形式を使用してください。",
86 |   },
87 | };
88 | 
89 | export function TimeZoneDataTable() {
90 |   const [referenceDate, setReferenceDate] = React.useState<Date>(new Date());
91 |   const [language, setLanguage] = React.useState<Language>("en");
92 |   const [sorting, setSorting] = React.useState<SortingState>([]);
93 |   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
94 |     []
95 |   );
96 |   const [columnVisibility, setColumnVisibility] =
97 |     React.useState<VisibilityState>({});
98 |   const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
99 |   const [isoInput, setIsoInput] = React.useState<string>("");
100 | 
101 |   React.useEffect(() => {
102 |     const storedFavorites = localStorage.getItem("favorites");
103 |     if (storedFavorites) {
104 |       setFavorites(new Set(JSON.parse(storedFavorites)));
105 |     }
106 |   }, []);
107 | 
108 |   React.useEffect(() => {
109 |     localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
110 |   }, [favorites]);
111 | 
112 |   React.useEffect(() => {
113 |     if (!isoInput) {
114 |       const timer = setInterval(() => {
115 |         setReferenceDate(new Date());
116 |       }, 60000);
117 |       return () => clearInterval(timer);
118 |     }
119 |   }, [isoInput]);
120 | 
121 |   const t = translations[language];
122 | 
123 |   const toggleFavorite = (country: string) => {
124 |     setFavorites((prev) => {
125 |       const updated = new Set(prev);
126 |       if (updated.has(country)) {
127 |         updated.delete(country);
128 |       } else {
129 |         updated.add(country);
130 |       }
131 |       return updated;
132 |     });
133 |   };
134 | 
135 |   const columns = React.useMemo<ColumnDef<TimeZone>[]>(
136 |     () => [
137 |       {
138 |         id: "favorite",
139 |         header: "",
140 |         cell: ({ row }) => {
141 |           const zone = row.original;
142 |           const isFav = favorites.has(zone.country);
143 |           return (
144 |             <button onClick={() => toggleFavorite(zone.country)}>
145 |               {isFav ? (
146 |                 <Star className="text-yellow-500" />
147 |               ) : (
148 |                 <StarOff className="text-gray-400" />
149 |               )}
150 |             </button>
151 |           );
152 |         },
153 |         size: 50,
154 |         enableSorting: true,
155 |         enableFiltering: true,
156 |       },
157 |       {
158 |         id: "country",
159 |         header: t.country,
160 |         accessorFn: (row: TimeZone) => {
161 |           const info = countryNames[row.country];
162 |           return info ? info[language] || row.country : row.country;
163 |         },
164 |         enableSorting: true,
165 |         cell: ({ getValue }) => getValue(),
166 |         enableFiltering: true,
167 |       },
168 |       {
169 |         accessorKey: "utc",
170 |         header: t.timezone,
171 |         enableSorting: true,
172 |         enableFiltering: true,
173 |       },
174 |       {
175 |         accessorKey: "code",
176 |         header: t.code,
177 |         enableSorting: true,
178 |         enableFiltering: true,
179 |       },
180 |       {
181 |         accessorKey: "startTime",
182 |         header: t.start,
183 |         enableSorting: true,
184 |         enableFiltering: true,
185 |       },
186 |       {
187 |         accessorKey: "endTime",
188 |         header: t.end,
189 |         enableSorting: true,
190 |         enableFiltering: true,
191 |       },
192 |       {
193 |         id: "currentTime",
194 |         header: t.current,
195 |         cell: ({ row }) => {
196 |           const zone = row.original;
197 |           return computeZoneTime(zone.utc, referenceDate);
198 |         },
199 |         enableSorting: true,
200 |         enableFiltering: true,
201 |       },
202 |       {
203 |         id: "status",
204 |         header: "Status",
205 |         cell: ({ row }) => {
206 |           const zone = row.original;
207 |           const current = computeZoneTime(zone.utc, referenceDate);
208 |           const status = getStatus(zone, current);
209 |           return (
210 |             <span
211 |               className={`px-2 py-1 rounded-full text-sm ${status.colorClass}`}
212 |             >
213 |               {status.label}
214 |             </span>
215 |           );
216 |         },
217 |         enableSorting: true,
218 |         enableFiltering: true,
219 |       },
220 |     ],
221 |     [t, referenceDate, favorites, language]
222 |   );
223 | 
224 |   const table = useReactTable({
225 |     data: timeZones,
226 |     columns,
227 |     initialState: {
228 |       pagination: { pageSize: 15 }, // Set page size to 100
229 |     },
230 |     state: {
231 |       sorting,
232 |       columnFilters,
233 |       columnVisibility,
234 |     },
235 |     onSortingChange: setSorting,
236 |     onColumnFiltersChange: setColumnFilters,
237 |     onColumnVisibilityChange: setColumnVisibility,
238 |     getCoreRowModel: getCoreRowModel(),
239 |     getFilteredRowModel: getFilteredRowModel(),
240 |     getPaginationRowModel: getPaginationRowModel(),
241 |     getSortedRowModel: getSortedRowModel(),
242 |   });
243 | 
244 |   // Dynamically create Zod schema with localized error message based on language
245 |   const ISOTimeSchema = React.useMemo(() => {
246 |     return z.object({
247 |       isoTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
248 |         message: t.errorIsoTime,
249 |       }),
250 |     });
251 |   }, [t]);
252 | 
253 |   // Setup React Hook Form with dynamic resolver
254 |   const form = useForm<z.infer<typeof ISOTimeSchema>>({
255 |     resolver: zodResolver(ISOTimeSchema),
256 |     defaultValues: {
257 |       isoTime: new Date().toISOString(),
258 |     },
259 |   });
260 | 
261 |   function onIsoTimeSubmit(data: z.infer<typeof ISOTimeSchema>) {
262 |     const { isoTime } = data;
263 |     setIsoInput(isoTime);
264 |     const parsedDate = new Date(isoTime);
265 |     setReferenceDate(parsedDate);
266 |     form.reset();
267 |   }
268 | 
269 |   return (
270 |     <div className="container mx-auto p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
271 |       <div className="flex justify-between items-center mb-4">
272 |         <h1 className="text-2xl font-bold">{t.title}</h1>
273 |         <select
274 |           value={language}
275 |           onChange={(e) => setLanguage(e.target.value as Language)}
276 |           className="border p-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
277 |         >
278 |           <option value="en">English</option>
279 |           <option value="zh">中文</option>
280 |           <option value="ja">日本語</option>
281 |         </select>
282 |       </div>
283 | 
284 |       {/* ISO Time Form */}
285 |       <Form {...form}>
286 |         <form
287 |           onSubmit={form.handleSubmit(onIsoTimeSubmit)}
288 |           className="w-2/3 space-y-6 mb-4"
289 |         >
290 |           <FormField
291 |             control={form.control}
292 |             name="isoTime"
293 |             render={({ field }) => (
294 |               <FormItem>
295 |                 <FormLabel>{t.enterTime}</FormLabel>
296 |                 <FormControl>
297 |                   <Input {...field} />
298 |                 </FormControl>
299 |                 <FormDescription>{t.enterTime}</FormDescription>
300 |                 <FormMessage />
301 |               </FormItem>
302 |             )}
303 |           />
304 |           <Button type="submit">Set Time</Button>
305 |         </form>
306 |       </Form>
307 | 
308 |       <div className="flex items-center py-4">
309 |         <Input
310 |           placeholder="Filter country..."
311 |           value={(table.getColumn("country")?.getFilterValue() as string) ?? ""}
312 |           onChange={(e) =>
313 |             table.getColumn("country")?.setFilterValue(e.target.value)
314 |           }
315 |           className="max-w-sm"
316 |         />
317 |       </div>
318 |       <div className="rounded-md border overflow-auto">
319 |         <Table>
320 |           <TableHeader>
321 |             {table.getHeaderGroups().map((headerGroup) => (
322 |               <TableRow key={headerGroup.id}>
323 |                 {headerGroup.headers.map((header) => (
324 |                   <TableHead key={header.id} className="px-4 py-2">
325 |                     {flexRender(
326 |                       header.column.columnDef.header,
327 |                       header.getContext()
328 |                     )}
329 |                   </TableHead>
330 |                 ))}
331 |               </TableRow>
332 |             ))}
333 |           </TableHeader>
334 |           <TableBody>
335 |             {table.getRowModel().rows.length ? (
336 |               table.getRowModel().rows.map((row) => (
337 |                 <TableRow key={row.id}>
338 |                   {row.getVisibleCells().map((cell) => (
339 |                     <TableCell key={cell.id} className="px-4 py-2">
340 |                       {flexRender(
341 |                         cell.column.columnDef.cell,
342 |                         cell.getContext()
343 |                       )}
344 |                     </TableCell>
345 |                   ))}
346 |                 </TableRow>
347 |               ))
348 |             ) : (
349 |               <TableRow>
350 |                 <TableCell
351 |                   colSpan={columns.length}
352 |                   className="h-24 text-center"
353 |                 >
354 |                   No results.
355 |                 </TableCell>
356 |               </TableRow>
357 |             )}
358 |           </TableBody>
359 |         </Table>
360 |       </div>
361 |       <div className="flex items-center justify-end space-x-2 py-4">
362 |         <Button
363 |           variant="outline"
364 |           size="sm"
365 |           onClick={() => table.previousPage()}
366 |           disabled={!table.getCanPreviousPage()}
367 |         >
368 |           Previous
369 |         </Button>
370 |         <Button
371 |           variant="outline"
372 |           size="sm"
373 |           onClick={() => table.nextPage()}
374 |           disabled={!table.getCanNextPage()}
375 |         >
376 |           Next
377 |         </Button>
378 |       </div>
379 |     </div>
380 |   );
381 | }
```

src/lib/types.ts
```
1 | // types.ts (or similar file for data definitions and utilities)
2 | export interface TimeZone {
3 |   country: string;
4 |   utc: string;
5 |   code: string;
6 |   startTime: string;
7 |   endTime: string;
8 | }
9 | 
10 | export interface HolidayResult {
11 |   isHoliday: boolean;
12 |   name?: string;
13 |   type?: string;
14 | }
```

src/lib/utils.ts
```
1 | import { clsx, type ClassValue } from "clsx"
2 | import { twMerge } from "tailwind-merge"
3 | 
4 | export function cn(...inputs: ClassValue[]) {
5 |   return twMerge(clsx(inputs))
6 | }
```

src/utils/DateUtils.ts
```
1 | import { format } from "date-fns";
2 | 
3 | // utils/dateUtils.ts
4 | export const getDaysOfWeek = (weekStartsOn: "monday" | "sunday"): string[] => {
5 |   return weekStartsOn === "monday"
6 |     ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
7 |     : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
8 | };
9 | 
10 | export const formatMonthYear = (date: Date): string => {
11 |   return date.toLocaleString("default", { month: "long", year: "numeric" });
12 | };
13 | export const formatWeekNumber = (date: Date): number => {
14 |   const onejan = new Date(date.getFullYear(), 0, 1);
15 |   const millisecsInDay = 86400000;
16 |   return Math.ceil(
17 |     ((date.getTime() - onejan.getTime()) / millisecsInDay +
18 |       onejan.getDay() +
19 |       1) /
20 |       7
21 |   );
22 | };
23 | export const formatWeekYear = (date: Date): string => {
24 |   return `${formatWeekNumber(date)} of ${date.getFullYear()}`;
25 | };
26 | export const getStartOffset = (
27 |   date: Date,
28 |   weekStartsOn: "monday" | "sunday"
29 | ): number => {
30 |   const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
31 |   return weekStartsOn === "monday"
32 |     ? firstDay === 0
33 |       ? 6
34 |       : firstDay - 1
35 |     : firstDay;
36 | };
37 | export const calculateDaysInMonth = (month: number, year: number) => {
38 |   return Array.from(
39 |     { length: new Date(year, month + 1, 0).getDate() },
40 |     (_, index) => ({
41 |       day: index + 1,
42 |       events: [],
43 |     })
44 |   );
45 | };
46 | /**
47 |  * Helper function to check if a date is valid
48 |  */
49 | export const isValidDate = (d?: Date) =>
50 |   d instanceof Date && !isNaN(d.getTime());
51 | 
52 | export const calculateDaysInWeek = (
53 |   weekStartsOn: string,
54 |   week: number,
55 |   year: number
56 | ) => {
57 |   // Determine if the week should start on Sunday (0) or Monday (1)
58 |   const startDay = weekStartsOn === "sunday" ? 0 : 1;
59 |   // Get January 1st of the year
60 |   const janFirst = new Date(year, 0, 1);
61 | 
62 |   // Calculate how many days we are offsetting from January 1st
63 |   const janFirstDayOfWeek = janFirst.getDay();
64 | 
65 |   // Calculate the start of the week by finding the correct day in the year
66 |   const weekStart = new Date(janFirst);
67 |   weekStart.setDate(
68 |     janFirst.getDate() +
69 |       (week - 1) * 7 +
70 |       ((startDay - janFirstDayOfWeek + 7) % 7)
71 |   );
72 | 
73 |   // Generate the week’s days
74 |   const days = [];
75 |   for (let i = 0; i < 7; i++) {
76 |     const day = new Date(weekStart);
77 |     day.setDate(day.getDate() + i);
78 |     days.push(day);
79 |   }
80 | 
81 |   return days;
82 | };
83 | 
84 | export const calculateWeekNumber = (date: Date) => {
85 |   const d = new Date(
86 |     Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
87 |   );
88 |   d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
89 |   const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
90 |   const weekNo = Math.ceil(
91 |     ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
92 |   );
93 |   return weekNo;
94 | };
95 | /**
96 |  * Utility function to format Date objects into "MMM dd, yyyy" format.
97 |  * @param {Date} date - The date to format.
98 |  * @returns {string} - Formatted date string.
99 |  */
100 | export function getFormattedDate(date: Date): string {
101 |   return format(date, "LLL dd, yyyy");
102 | }
103 | 
104 | export const formatDate = (date: Date): string => {
105 |   return date.toDateString();
106 | };
```

src/components/ui/badge.tsx
```
1 | import * as React from "react"
2 | import { cva, type VariantProps } from "class-variance-authority"
3 | 
4 | import { cn } from "@/lib/utils"
5 | 
6 | const badgeVariants = cva(
7 |   "inline-flex items-center rounded-md border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-300",
8 |   {
9 |     variants: {
10 |       variant: {
11 |         default:
12 |           "border-transparent bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/80 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/80",
13 |         secondary:
14 |           "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
15 |         destructive:
16 |           "border-transparent bg-red-500 text-zinc-50 shadow hover:bg-red-500/80 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/80",
17 |         outline: "text-zinc-950 dark:text-zinc-50",
18 |       },
19 |     },
20 |     defaultVariants: {
21 |       variant: "default",
22 |     },
23 |   }
24 | )
25 | 
26 | export interface BadgeProps
27 |   extends React.HTMLAttributes<HTMLDivElement>,
28 |     VariantProps<typeof badgeVariants> {}
29 | 
30 | function Badge({ className, variant, ...props }: BadgeProps) {
31 |   return (
32 |     <div className={cn(badgeVariants({ variant }), className)} {...props} />
33 |   )
34 | }
35 | 
36 | export { Badge, badgeVariants }
```

src/components/ui/button.tsx
```
1 | import * as React from "react"
2 | import { Slot } from "@radix-ui/react-slot"
3 | import { cva, type VariantProps } from "class-variance-authority"
4 | 
5 | import { cn } from "@/lib/utils"
6 | 
7 | const buttonVariants = cva(
8 |   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-zinc-300",
9 |   {
10 |     variants: {
11 |       variant: {
12 |         default:
13 |           "bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90",
14 |         destructive:
15 |           "bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90",
16 |         outline:
17 |           "border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
18 |         secondary:
19 |           "bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
20 |         ghost: "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
21 |         link: "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50",
22 |       },
23 |       size: {
24 |         default: "h-9 px-4 py-2",
25 |         sm: "h-8 rounded-md px-3 text-xs",
26 |         lg: "h-10 rounded-md px-8",
27 |         icon: "h-9 w-9",
28 |       },
29 |     },
30 |     defaultVariants: {
31 |       variant: "default",
32 |       size: "default",
33 |     },
34 |   }
35 | )
36 | 
37 | export interface ButtonProps
38 |   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
39 |     VariantProps<typeof buttonVariants> {
40 |   asChild?: boolean
41 | }
42 | 
43 | const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
44 |   ({ className, variant, size, asChild = false, ...props }, ref) => {
45 |     const Comp = asChild ? Slot : "button"
46 |     return (
47 |       <Comp
48 |         className={cn(buttonVariants({ variant, size, className }))}
49 |         ref={ref}
50 |         {...props}
51 |       />
52 |     )
53 |   }
54 | )
55 | Button.displayName = "Button"
56 | 
57 | export { Button, buttonVariants }
```

src/components/ui/calendar.tsx
```
1 | import * as React from "react";
2 | import { ChevronLeft, ChevronRight } from "lucide-react";
3 | import { DayPicker } from "react-day-picker";
4 | 
5 | import { cn } from "@/lib/utils";
6 | import { buttonVariants } from "@/components/ui/button";
7 | 
8 | export type CalendarProps = React.ComponentProps<typeof DayPicker>;
9 | 
10 | function Calendar({
11 |   className,
12 |   classNames,
13 |   showOutsideDays = true,
14 |   ...props
15 | }: CalendarProps) {
16 |   return (
17 |     <DayPicker
18 |       showOutsideDays={showOutsideDays}
19 |       className={cn("p-3", className)}
20 |       classNames={{
21 |         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
22 |         month: "space-y-4",
23 |         caption: "flex justify-center pt-1 relative items-center",
24 |         caption_label: "text-sm font-medium",
25 |         nav: "space-x-1 flex items-center",
26 |         nav_button: cn(
27 |           buttonVariants({ variant: "outline" }),
28 |           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
29 |         ),
30 |         nav_button_previous: "absolute left-1",
31 |         nav_button_next: "absolute right-1",
32 |         table: "w-full border-collapse space-y-1",
33 |         head_row: "flex",
34 |         head_cell:
35 |           "text-zinc-500 rounded-md w-8 font-normal text-[0.8rem] dark:text-zinc-400",
36 |         row: "flex w-full mt-2",
37 |         cell: cn(
38 |           "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-zinc-100 [&:has([aria-selected].day-outside)]:bg-zinc-100/50 [&:has([aria-selected].day-range-end)]:rounded-r-md dark:[&:has([aria-selected])]:bg-zinc-800 dark:[&:has([aria-selected].day-outside)]:bg-zinc-800/50",
39 |           props.mode === "range"
40 |             ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
41 |             : "[&:has([aria-selected])]:rounded-md"
42 |         ),
43 |         day: cn(
44 |           buttonVariants({ variant: "ghost" }),
45 |           "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
46 |         ),
47 |         day_range_start: "day-range-start",
48 |         day_range_end: "day-range-end",
49 |         day_selected:
50 |           "bg-zinc-900 text-zinc-50 hover:bg-zinc-900 hover:text-zinc-50 focus:bg-zinc-900 focus:text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50 dark:hover:text-zinc-900 dark:focus:bg-zinc-50 dark:focus:text-zinc-900",
51 |         day_today:
52 |           "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50",
53 |         day_outside:
54 |           "day-outside text-zinc-500 aria-selected:bg-zinc-100/50 aria-selected:text-zinc-500 dark:text-zinc-400 dark:aria-selected:bg-zinc-800/50 dark:aria-selected:text-zinc-400",
55 |         day_disabled: "text-zinc-500 opacity-50 dark:text-zinc-400",
56 |         day_range_middle:
57 |           "aria-selected:bg-zinc-100 aria-selected:text-zinc-900 dark:aria-selected:bg-zinc-800 dark:aria-selected:text-zinc-50",
58 |         day_hidden: "invisible",
59 |         ...classNames,
60 |       }}
61 |       components={{
62 |         IconLeft: () => <ChevronLeft className="h-4 w-4" />,
63 |         IconRight: () => <ChevronRight className="h-4 w-4" />,
64 |       }}
65 |       {...props}
66 |     />
67 |   );
68 | }
69 | Calendar.displayName = "Calendar";
70 | 
71 | export { Calendar };
```

src/components/ui/card.tsx
```
1 | import * as React from "react"
2 | 
3 | import { cn } from "@/lib/utils"
4 | 
5 | const Card = React.forwardRef<
6 |   HTMLDivElement,
7 |   React.HTMLAttributes<HTMLDivElement>
8 | >(({ className, ...props }, ref) => (
9 |   <div
10 |     ref={ref}
11 |     className={cn(
12 |       "rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
13 |       className
14 |     )}
15 |     {...props}
16 |   />
17 | ))
18 | Card.displayName = "Card"
19 | 
20 | const CardHeader = React.forwardRef<
21 |   HTMLDivElement,
22 |   React.HTMLAttributes<HTMLDivElement>
23 | >(({ className, ...props }, ref) => (
24 |   <div
25 |     ref={ref}
26 |     className={cn("flex flex-col space-y-1.5 p-6", className)}
27 |     {...props}
28 |   />
29 | ))
30 | CardHeader.displayName = "CardHeader"
31 | 
32 | const CardTitle = React.forwardRef<
33 |   HTMLDivElement,
34 |   React.HTMLAttributes<HTMLDivElement>
35 | >(({ className, ...props }, ref) => (
36 |   <div
37 |     ref={ref}
38 |     className={cn("font-semibold leading-none tracking-tight", className)}
39 |     {...props}
40 |   />
41 | ))
42 | CardTitle.displayName = "CardTitle"
43 | 
44 | const CardDescription = React.forwardRef<
45 |   HTMLDivElement,
46 |   React.HTMLAttributes<HTMLDivElement>
47 | >(({ className, ...props }, ref) => (
48 |   <div
49 |     ref={ref}
50 |     className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)}
51 |     {...props}
52 |   />
53 | ))
54 | CardDescription.displayName = "CardDescription"
55 | 
56 | const CardContent = React.forwardRef<
57 |   HTMLDivElement,
58 |   React.HTMLAttributes<HTMLDivElement>
59 | >(({ className, ...props }, ref) => (
60 |   <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
61 | ))
62 | CardContent.displayName = "CardContent"
63 | 
64 | const CardFooter = React.forwardRef<
65 |   HTMLDivElement,
66 |   React.HTMLAttributes<HTMLDivElement>
67 | >(({ className, ...props }, ref) => (
68 |   <div
69 |     ref={ref}
70 |     className={cn("flex items-center p-6 pt-0", className)}
71 |     {...props}
72 |   />
73 | ))
74 | CardFooter.displayName = "CardFooter"
75 | 
76 | export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

src/components/ui/dialog.tsx
```
1 | import * as React from "react"
2 | import * as DialogPrimitive from "@radix-ui/react-dialog"
3 | import { X } from "lucide-react"
4 | 
5 | import { cn } from "@/lib/utils"
6 | 
7 | const Dialog = DialogPrimitive.Root
8 | 
9 | const DialogTrigger = DialogPrimitive.Trigger
10 | 
11 | const DialogPortal = DialogPrimitive.Portal
12 | 
13 | const DialogClose = DialogPrimitive.Close
14 | 
15 | const DialogOverlay = React.forwardRef<
16 |   React.ElementRef<typeof DialogPrimitive.Overlay>,
17 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
18 | >(({ className, ...props }, ref) => (
19 |   <DialogPrimitive.Overlay
20 |     ref={ref}
21 |     className={cn(
22 |       "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
23 |       className
24 |     )}
25 |     {...props}
26 |   />
27 | ))
28 | DialogOverlay.displayName = DialogPrimitive.Overlay.displayName
29 | 
30 | const DialogContent = React.forwardRef<
31 |   React.ElementRef<typeof DialogPrimitive.Content>,
32 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
33 | >(({ className, children, ...props }, ref) => (
34 |   <DialogPortal>
35 |     <DialogOverlay />
36 |     <DialogPrimitive.Content
37 |       ref={ref}
38 |       className={cn(
39 |         "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-zinc-800 dark:bg-zinc-950",
40 |         className
41 |       )}
42 |       {...props}
43 |     >
44 |       {children}
45 |       <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-zinc-100 data-[state=open]:text-zinc-500 dark:ring-offset-zinc-950 dark:focus:ring-zinc-300 dark:data-[state=open]:bg-zinc-800 dark:data-[state=open]:text-zinc-400">
46 |         <X className="h-4 w-4" />
47 |         <span className="sr-only">Close</span>
48 |       </DialogPrimitive.Close>
49 |     </DialogPrimitive.Content>
50 |   </DialogPortal>
51 | ))
52 | DialogContent.displayName = DialogPrimitive.Content.displayName
53 | 
54 | const DialogHeader = ({
55 |   className,
56 |   ...props
57 | }: React.HTMLAttributes<HTMLDivElement>) => (
58 |   <div
59 |     className={cn(
60 |       "flex flex-col space-y-1.5 text-center sm:text-left",
61 |       className
62 |     )}
63 |     {...props}
64 |   />
65 | )
66 | DialogHeader.displayName = "DialogHeader"
67 | 
68 | const DialogFooter = ({
69 |   className,
70 |   ...props
71 | }: React.HTMLAttributes<HTMLDivElement>) => (
72 |   <div
73 |     className={cn(
74 |       "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
75 |       className
76 |     )}
77 |     {...props}
78 |   />
79 | )
80 | DialogFooter.displayName = "DialogFooter"
81 | 
82 | const DialogTitle = React.forwardRef<
83 |   React.ElementRef<typeof DialogPrimitive.Title>,
84 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
85 | >(({ className, ...props }, ref) => (
86 |   <DialogPrimitive.Title
87 |     ref={ref}
88 |     className={cn(
89 |       "text-lg font-semibold leading-none tracking-tight",
90 |       className
91 |     )}
92 |     {...props}
93 |   />
94 | ))
95 | DialogTitle.displayName = DialogPrimitive.Title.displayName
96 | 
97 | const DialogDescription = React.forwardRef<
98 |   React.ElementRef<typeof DialogPrimitive.Description>,
99 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
100 | >(({ className, ...props }, ref) => (
101 |   <DialogPrimitive.Description
102 |     ref={ref}
103 |     className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)}
104 |     {...props}
105 |   />
106 | ))
107 | DialogDescription.displayName = DialogPrimitive.Description.displayName
108 | 
109 | export {
110 |   Dialog,
111 |   DialogPortal,
112 |   DialogOverlay,
113 |   DialogTrigger,
114 |   DialogClose,
115 |   DialogContent,
116 |   DialogHeader,
117 |   DialogFooter,
118 |   DialogTitle,
119 |   DialogDescription,
120 | }
```

src/components/ui/form.tsx
```
1 | import * as React from "react"
2 | import * as LabelPrimitive from "@radix-ui/react-label"
3 | import { Slot } from "@radix-ui/react-slot"
4 | import {
5 |   Controller,
6 |   ControllerProps,
7 |   FieldPath,
8 |   FieldValues,
9 |   FormProvider,
10 |   useFormContext,
11 | } from "react-hook-form"
12 | 
13 | import { cn } from "@/lib/utils"
14 | import { Label } from "@/components/ui/label"
15 | 
16 | const Form = FormProvider
17 | 
18 | type FormFieldContextValue<
19 |   TFieldValues extends FieldValues = FieldValues,
20 |   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
21 | > = {
22 |   name: TName
23 | }
24 | 
25 | const FormFieldContext = React.createContext<FormFieldContextValue>(
26 |   {} as FormFieldContextValue
27 | )
28 | 
29 | const FormField = <
30 |   TFieldValues extends FieldValues = FieldValues,
31 |   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
32 | >({
33 |   ...props
34 | }: ControllerProps<TFieldValues, TName>) => {
35 |   return (
36 |     <FormFieldContext.Provider value={{ name: props.name }}>
37 |       <Controller {...props} />
38 |     </FormFieldContext.Provider>
39 |   )
40 | }
41 | 
42 | const useFormField = () => {
43 |   const fieldContext = React.useContext(FormFieldContext)
44 |   const itemContext = React.useContext(FormItemContext)
45 |   const { getFieldState, formState } = useFormContext()
46 | 
47 |   const fieldState = getFieldState(fieldContext.name, formState)
48 | 
49 |   if (!fieldContext) {
50 |     throw new Error("useFormField should be used within <FormField>")
51 |   }
52 | 
53 |   const { id } = itemContext
54 | 
55 |   return {
56 |     id,
57 |     name: fieldContext.name,
58 |     formItemId: `${id}-form-item`,
59 |     formDescriptionId: `${id}-form-item-description`,
60 |     formMessageId: `${id}-form-item-message`,
61 |     ...fieldState,
62 |   }
63 | }
64 | 
65 | type FormItemContextValue = {
66 |   id: string
67 | }
68 | 
69 | const FormItemContext = React.createContext<FormItemContextValue>(
70 |   {} as FormItemContextValue
71 | )
72 | 
73 | const FormItem = React.forwardRef<
74 |   HTMLDivElement,
75 |   React.HTMLAttributes<HTMLDivElement>
76 | >(({ className, ...props }, ref) => {
77 |   const id = React.useId()
78 | 
79 |   return (
80 |     <FormItemContext.Provider value={{ id }}>
81 |       <div ref={ref} className={cn("space-y-2", className)} {...props} />
82 |     </FormItemContext.Provider>
83 |   )
84 | })
85 | FormItem.displayName = "FormItem"
86 | 
87 | const FormLabel = React.forwardRef<
88 |   React.ElementRef<typeof LabelPrimitive.Root>,
89 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
90 | >(({ className, ...props }, ref) => {
91 |   const { error, formItemId } = useFormField()
92 | 
93 |   return (
94 |     <Label
95 |       ref={ref}
96 |       className={cn(error && "text-red-500 dark:text-red-900", className)}
97 |       htmlFor={formItemId}
98 |       {...props}
99 |     />
100 |   )
101 | })
102 | FormLabel.displayName = "FormLabel"
103 | 
104 | const FormControl = React.forwardRef<
105 |   React.ElementRef<typeof Slot>,
106 |   React.ComponentPropsWithoutRef<typeof Slot>
107 | >(({ ...props }, ref) => {
108 |   const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
109 | 
110 |   return (
111 |     <Slot
112 |       ref={ref}
113 |       id={formItemId}
114 |       aria-describedby={
115 |         !error
116 |           ? `${formDescriptionId}`
117 |           : `${formDescriptionId} ${formMessageId}`
118 |       }
119 |       aria-invalid={!!error}
120 |       {...props}
121 |     />
122 |   )
123 | })
124 | FormControl.displayName = "FormControl"
125 | 
126 | const FormDescription = React.forwardRef<
127 |   HTMLParagraphElement,
128 |   React.HTMLAttributes<HTMLParagraphElement>
129 | >(({ className, ...props }, ref) => {
130 |   const { formDescriptionId } = useFormField()
131 | 
132 |   return (
133 |     <p
134 |       ref={ref}
135 |       id={formDescriptionId}
136 |       className={cn("text-[0.8rem] text-zinc-500 dark:text-zinc-400", className)}
137 |       {...props}
138 |     />
139 |   )
140 | })
141 | FormDescription.displayName = "FormDescription"
142 | 
143 | const FormMessage = React.forwardRef<
144 |   HTMLParagraphElement,
145 |   React.HTMLAttributes<HTMLParagraphElement>
146 | >(({ className, children, ...props }, ref) => {
147 |   const { error, formMessageId } = useFormField()
148 |   const body = error ? String(error?.message) : children
149 | 
150 |   if (!body) {
151 |     return null
152 |   }
153 | 
154 |   return (
155 |     <p
156 |       ref={ref}
157 |       id={formMessageId}
158 |       className={cn("text-[0.8rem] font-medium text-red-500 dark:text-red-900", className)}
159 |       {...props}
160 |     >
161 |       {body}
162 |     </p>
163 |   )
164 | })
165 | FormMessage.displayName = "FormMessage"
166 | 
167 | export {
168 |   useFormField,
169 |   Form,
170 |   FormItem,
171 |   FormLabel,
172 |   FormControl,
173 |   FormDescription,
174 |   FormMessage,
175 |   FormField,
176 | }
```

src/components/ui/input.tsx
```
1 | import * as React from "react"
2 | 
3 | import { cn } from "@/lib/utils"
4 | 
5 | const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
6 |   ({ className, type, ...props }, ref) => {
7 |     return (
8 |       <input
9 |         type={type}
10 |         className={cn(
11 |           "flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-950 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-zinc-800 dark:file:text-zinc-50 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
12 |           className
13 |         )}
14 |         ref={ref}
15 |         {...props}
16 |       />
17 |     )
18 |   }
19 | )
20 | Input.displayName = "Input"
21 | 
22 | export { Input }
```

src/components/ui/label.tsx
```
1 | import * as React from "react"
2 | import * as LabelPrimitive from "@radix-ui/react-label"
3 | import { cva, type VariantProps } from "class-variance-authority"
4 | 
5 | import { cn } from "@/lib/utils"
6 | 
7 | const labelVariants = cva(
8 |   "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
9 | )
10 | 
11 | const Label = React.forwardRef<
12 |   React.ElementRef<typeof LabelPrimitive.Root>,
13 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
14 |     VariantProps<typeof labelVariants>
15 | >(({ className, ...props }, ref) => (
16 |   <LabelPrimitive.Root
17 |     ref={ref}
18 |     className={cn(labelVariants(), className)}
19 |     {...props}
20 |   />
21 | ))
22 | Label.displayName = LabelPrimitive.Root.displayName
23 | 
24 | export { Label }
```

src/components/ui/popover.tsx
```
1 | import * as React from "react"
2 | import * as PopoverPrimitive from "@radix-ui/react-popover"
3 | 
4 | import { cn } from "@/lib/utils"
5 | 
6 | const Popover = PopoverPrimitive.Root
7 | 
8 | const PopoverTrigger = PopoverPrimitive.Trigger
9 | 
10 | const PopoverAnchor = PopoverPrimitive.Anchor
11 | 
12 | const PopoverContent = React.forwardRef<
13 |   React.ElementRef<typeof PopoverPrimitive.Content>,
14 |   React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
15 | >(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
16 |   <PopoverPrimitive.Portal>
17 |     <PopoverPrimitive.Content
18 |       ref={ref}
19 |       align={align}
20 |       sideOffset={sideOffset}
21 |       className={cn(
22 |         "z-50 w-72 rounded-md border border-zinc-200 bg-white p-4 text-zinc-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
23 |         className
24 |       )}
25 |       {...props}
26 |     />
27 |   </PopoverPrimitive.Portal>
28 | ))
29 | PopoverContent.displayName = PopoverPrimitive.Content.displayName
30 | 
31 | export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
```

src/components/ui/select.tsx
```
1 | import * as React from "react"
2 | import * as SelectPrimitive from "@radix-ui/react-select"
3 | import { Check, ChevronDown, ChevronUp } from "lucide-react"
4 | 
5 | import { cn } from "@/lib/utils"
6 | 
7 | const Select = SelectPrimitive.Root
8 | 
9 | const SelectGroup = SelectPrimitive.Group
10 | 
11 | const SelectValue = SelectPrimitive.Value
12 | 
13 | const SelectTrigger = React.forwardRef<
14 |   React.ElementRef<typeof SelectPrimitive.Trigger>,
15 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
16 | >(({ className, children, ...props }, ref) => (
17 |   <SelectPrimitive.Trigger
18 |     ref={ref}
19 |     className={cn(
20 |       "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:border-zinc-800 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus:ring-zinc-300",
21 |       className
22 |     )}
23 |     {...props}
24 |   >
25 |     {children}
26 |     <SelectPrimitive.Icon asChild>
27 |       <ChevronDown className="h-4 w-4 opacity-50" />
28 |     </SelectPrimitive.Icon>
29 |   </SelectPrimitive.Trigger>
30 | ))
31 | SelectTrigger.displayName = SelectPrimitive.Trigger.displayName
32 | 
33 | const SelectScrollUpButton = React.forwardRef<
34 |   React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
35 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
36 | >(({ className, ...props }, ref) => (
37 |   <SelectPrimitive.ScrollUpButton
38 |     ref={ref}
39 |     className={cn(
40 |       "flex cursor-default items-center justify-center py-1",
41 |       className
42 |     )}
43 |     {...props}
44 |   >
45 |     <ChevronUp className="h-4 w-4" />
46 |   </SelectPrimitive.ScrollUpButton>
47 | ))
48 | SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName
49 | 
50 | const SelectScrollDownButton = React.forwardRef<
51 |   React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
52 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
53 | >(({ className, ...props }, ref) => (
54 |   <SelectPrimitive.ScrollDownButton
55 |     ref={ref}
56 |     className={cn(
57 |       "flex cursor-default items-center justify-center py-1",
58 |       className
59 |     )}
60 |     {...props}
61 |   >
62 |     <ChevronDown className="h-4 w-4" />
63 |   </SelectPrimitive.ScrollDownButton>
64 | ))
65 | SelectScrollDownButton.displayName =
66 |   SelectPrimitive.ScrollDownButton.displayName
67 | 
68 | const SelectContent = React.forwardRef<
69 |   React.ElementRef<typeof SelectPrimitive.Content>,
70 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
71 | >(({ className, children, position = "popper", ...props }, ref) => (
72 |   <SelectPrimitive.Portal>
73 |     <SelectPrimitive.Content
74 |       ref={ref}
75 |       className={cn(
76 |         "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white text-zinc-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
77 |         position === "popper" &&
78 |           "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
79 |         className
80 |       )}
81 |       position={position}
82 |       {...props}
83 |     >
84 |       <SelectScrollUpButton />
85 |       <SelectPrimitive.Viewport
86 |         className={cn(
87 |           "p-1",
88 |           position === "popper" &&
89 |             "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
90 |         )}
91 |       >
92 |         {children}
93 |       </SelectPrimitive.Viewport>
94 |       <SelectScrollDownButton />
95 |     </SelectPrimitive.Content>
96 |   </SelectPrimitive.Portal>
97 | ))
98 | SelectContent.displayName = SelectPrimitive.Content.displayName
99 | 
100 | const SelectLabel = React.forwardRef<
101 |   React.ElementRef<typeof SelectPrimitive.Label>,
102 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
103 | >(({ className, ...props }, ref) => (
104 |   <SelectPrimitive.Label
105 |     ref={ref}
106 |     className={cn("px-2 py-1.5 text-sm font-semibold", className)}
107 |     {...props}
108 |   />
109 | ))
110 | SelectLabel.displayName = SelectPrimitive.Label.displayName
111 | 
112 | const SelectItem = React.forwardRef<
113 |   React.ElementRef<typeof SelectPrimitive.Item>,
114 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
115 | >(({ className, children, ...props }, ref) => (
116 |   <SelectPrimitive.Item
117 |     ref={ref}
118 |     className={cn(
119 |       "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50",
120 |       className
121 |     )}
122 |     {...props}
123 |   >
124 |     <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
125 |       <SelectPrimitive.ItemIndicator>
126 |         <Check className="h-4 w-4" />
127 |       </SelectPrimitive.ItemIndicator>
128 |     </span>
129 |     <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
130 |   </SelectPrimitive.Item>
131 | ))
132 | SelectItem.displayName = SelectPrimitive.Item.displayName
133 | 
134 | const SelectSeparator = React.forwardRef<
135 |   React.ElementRef<typeof SelectPrimitive.Separator>,
136 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
137 | >(({ className, ...props }, ref) => (
138 |   <SelectPrimitive.Separator
139 |     ref={ref}
140 |     className={cn("-mx-1 my-1 h-px bg-zinc-100 dark:bg-zinc-800", className)}
141 |     {...props}
142 |   />
143 | ))
144 | SelectSeparator.displayName = SelectPrimitive.Separator.displayName
145 | 
146 | export {
147 |   Select,
148 |   SelectGroup,
149 |   SelectValue,
150 |   SelectTrigger,
151 |   SelectContent,
152 |   SelectLabel,
153 |   SelectItem,
154 |   SelectSeparator,
155 |   SelectScrollUpButton,
156 |   SelectScrollDownButton,
157 | }
```

src/components/ui/table.tsx
```
1 | import * as React from "react"
2 | 
3 | import { cn } from "@/lib/utils"
4 | 
5 | const Table = React.forwardRef<
6 |   HTMLTableElement,
7 |   React.HTMLAttributes<HTMLTableElement>
8 | >(({ className, ...props }, ref) => (
9 |   <div className="relative w-full overflow-auto">
10 |     <table
11 |       ref={ref}
12 |       className={cn("w-full caption-bottom text-sm", className)}
13 |       {...props}
14 |     />
15 |   </div>
16 | ))
17 | Table.displayName = "Table"
18 | 
19 | const TableHeader = React.forwardRef<
20 |   HTMLTableSectionElement,
21 |   React.HTMLAttributes<HTMLTableSectionElement>
22 | >(({ className, ...props }, ref) => (
23 |   <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
24 | ))
25 | TableHeader.displayName = "TableHeader"
26 | 
27 | const TableBody = React.forwardRef<
28 |   HTMLTableSectionElement,
29 |   React.HTMLAttributes<HTMLTableSectionElement>
30 | >(({ className, ...props }, ref) => (
31 |   <tbody
32 |     ref={ref}
33 |     className={cn("[&_tr:last-child]:border-0", className)}
34 |     {...props}
35 |   />
36 | ))
37 | TableBody.displayName = "TableBody"
38 | 
39 | const TableFooter = React.forwardRef<
40 |   HTMLTableSectionElement,
41 |   React.HTMLAttributes<HTMLTableSectionElement>
42 | >(({ className, ...props }, ref) => (
43 |   <tfoot
44 |     ref={ref}
45 |     className={cn(
46 |       "border-t bg-zinc-100/50 font-medium [&>tr]:last:border-b-0 dark:bg-zinc-800/50",
47 |       className
48 |     )}
49 |     {...props}
50 |   />
51 | ))
52 | TableFooter.displayName = "TableFooter"
53 | 
54 | const TableRow = React.forwardRef<
55 |   HTMLTableRowElement,
56 |   React.HTMLAttributes<HTMLTableRowElement>
57 | >(({ className, ...props }, ref) => (
58 |   <tr
59 |     ref={ref}
60 |     className={cn(
61 |       "border-b transition-colors hover:bg-zinc-100/50 data-[state=selected]:bg-zinc-100 dark:hover:bg-zinc-800/50 dark:data-[state=selected]:bg-zinc-800",
62 |       className
63 |     )}
64 |     {...props}
65 |   />
66 | ))
67 | TableRow.displayName = "TableRow"
68 | 
69 | const TableHead = React.forwardRef<
70 |   HTMLTableCellElement,
71 |   React.ThHTMLAttributes<HTMLTableCellElement>
72 | >(({ className, ...props }, ref) => (
73 |   <th
74 |     ref={ref}
75 |     className={cn(
76 |       "h-10 px-2 text-left align-middle font-medium text-zinc-500 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] dark:text-zinc-400",
77 |       className
78 |     )}
79 |     {...props}
80 |   />
81 | ))
82 | TableHead.displayName = "TableHead"
83 | 
84 | const TableCell = React.forwardRef<
85 |   HTMLTableCellElement,
86 |   React.TdHTMLAttributes<HTMLTableCellElement>
87 | >(({ className, ...props }, ref) => (
88 |   <td
89 |     ref={ref}
90 |     className={cn(
91 |       "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
92 |       className
93 |     )}
94 |     {...props}
95 |   />
96 | ))
97 | TableCell.displayName = "TableCell"
98 | 
99 | const TableCaption = React.forwardRef<
100 |   HTMLTableCaptionElement,
101 |   React.HTMLAttributes<HTMLTableCaptionElement>
102 | >(({ className, ...props }, ref) => (
103 |   <caption
104 |     ref={ref}
105 |     className={cn("mt-4 text-sm text-zinc-500 dark:text-zinc-400", className)}
106 |     {...props}
107 |   />
108 | ))
109 | TableCaption.displayName = "TableCaption"
110 | 
111 | export {
112 |   Table,
113 |   TableHeader,
114 |   TableBody,
115 |   TableFooter,
116 |   TableHead,
117 |   TableRow,
118 |   TableCell,
119 |   TableCaption,
120 | }
```

src/components/ui/tabs.tsx
```
1 | import * as React from "react"
2 | import * as TabsPrimitive from "@radix-ui/react-tabs"
3 | 
4 | import { cn } from "@/lib/utils"
5 | 
6 | const Tabs = TabsPrimitive.Root
7 | 
8 | const TabsList = React.forwardRef<
9 |   React.ElementRef<typeof TabsPrimitive.List>,
10 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
11 | >(({ className, ...props }, ref) => (
12 |   <TabsPrimitive.List
13 |     ref={ref}
14 |     className={cn(
15 |       "inline-flex h-9 items-center justify-center rounded-lg bg-zinc-100 p-1 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
16 |       className
17 |     )}
18 |     {...props}
19 |   />
20 | ))
21 | TabsList.displayName = TabsPrimitive.List.displayName
22 | 
23 | const TabsTrigger = React.forwardRef<
24 |   React.ElementRef<typeof TabsPrimitive.Trigger>,
25 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
26 | >(({ className, ...props }, ref) => (
27 |   <TabsPrimitive.Trigger
28 |     ref={ref}
29 |     className={cn(
30 |       "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=active]:bg-zinc-950 dark:data-[state=active]:text-zinc-50",
31 |       className
32 |     )}
33 |     {...props}
34 |   />
35 | ))
36 | TabsTrigger.displayName = TabsPrimitive.Trigger.displayName
37 | 
38 | const TabsContent = React.forwardRef<
39 |   React.ElementRef<typeof TabsPrimitive.Content>,
40 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
41 | >(({ className, ...props }, ref) => (
42 |   <TabsPrimitive.Content
43 |     ref={ref}
44 |     className={cn(
45 |       "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300",
46 |       className
47 |     )}
48 |     {...props}
49 |   />
50 | ))
51 | TabsContent.displayName = TabsPrimitive.Content.displayName
52 | 
53 | export { Tabs, TabsList, TabsTrigger, TabsContent }
```

src/components/ui/textarea.tsx
```
1 | import * as React from "react"
2 | 
3 | import { cn } from "@/lib/utils"
4 | 
5 | const Textarea = React.forwardRef<
6 |   HTMLTextAreaElement,
7 |   React.ComponentProps<"textarea">
8 | >(({ className, ...props }, ref) => {
9 |   return (
10 |     <textarea
11 |       className={cn(
12 |         "flex min-h-[60px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
13 |         className
14 |       )}
15 |       ref={ref}
16 |       {...props}
17 |     />
18 |   )
19 | })
20 | Textarea.displayName = "Textarea"
21 | 
22 | export { Textarea }
```
