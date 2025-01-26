Project Structure:
├── CODE_OF_CONDUCT.md
├── LICENSE
├── README.md
├── codefetch
│   └── mycode.md
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
1 | import i18n from "i18n-iso-countries";
2 | import iso_en from "i18n-iso-countries/langs/en.json";
3 | import iso_zh from "i18n-iso-countries/langs/zh.json";
4 | import iso_ja from "i18n-iso-countries/langs/ja.json";
5 | import { getAllCountries, getTimezone } from "countries-and-timezones";
6 | import { getCountryCallingCode } from "libphonenumber-js";
7 | import Holidays from "date-holidays";
8 | import { nanoid } from "nanoid";
9 | 
10 | // TypeScript interfaces
11 | export interface TimeZone {
12 |   id: string;
13 | 
14 |   country: string;
15 |   countryName: string;
16 |   utc: string;
17 |   code: string;
18 |   startTime: string;
19 |   endTime: string;
20 |   isHoliday?: boolean;
21 |   holidayName?: string;
22 | }
23 | 
24 | // Initialize i18n
25 | i18n.registerLocale(iso_en);
26 | i18n.registerLocale(iso_zh);
27 | i18n.registerLocale(iso_ja);
28 | 
29 | // Utility functions
30 | const getUtcOffsetString = (offsetMinutes: number): string => {
31 |   const sign = offsetMinutes >= 0 ? "+" : "-";
32 |   const absMinutes = Math.abs(offsetMinutes);
33 |   return `UTC${sign}${String(Math.floor(absMinutes / 60)).padStart(
34 |     2,
35 |     "0"
36 |   )}:${String(absMinutes % 60).padStart(2, "0")}`;
37 | };
38 | 
39 | // Country and timezone data initialization
40 | const countries = getAllCountries();
41 | export const countryNames: Record<
42 |   string,
43 |   { en: string; zh: string; ja: string }
44 | > = {};
45 | export const timeZones: TimeZone[] = [];
46 | 
47 | Object.values(countries).forEach((country) => {
48 |   const isoCode = country.id;
49 |   const names = {
50 |     en: i18n.getName(isoCode, "en") || country.name,
51 |     zh: i18n.getName(isoCode, "zh") || country.name,
52 |     ja: i18n.getName(isoCode, "ja") || country.name,
53 |   };
54 | 
55 |   countryNames[isoCode] = names;
56 | 
57 |   // Get calling code safely
58 |   let callingCode = "";
59 |   try {
60 |     callingCode = `+${getCountryCallingCode(isoCode)}`;
61 |   } catch (error) {
62 |     console.warn(`Failed to get calling code for ${isoCode}:`, error);
63 |   }
64 | 
65 |   // Process timezones
66 |   country.timezones.forEach((tzName: string) => {
67 |     const tz = getTimezone(tzName);
68 |     if (!tz) return;
69 | 
70 |     timeZones.push({
71 |       id: `${country.id}-${nanoid()}`, // Unique combination
72 |       country: isoCode,
73 |       countryName: names.zh,
74 |       utc: getUtcOffsetString(tz.utcOffset),
75 |       code: callingCode,
76 |       startTime: "09:00",
77 |       endTime: "17:00",
78 |     });
79 |   });
80 | });
81 | 
82 | // Date calculation functions
83 | export function parseUTCOffset(utc: string) {
84 |   const match = utc.match(/UTC([+-])(\d{2}):(\d{2})/);
85 |   if (!match) return null;
86 | 
87 |   return {
88 |     sign: match[1] === "+" ? 1 : -1,
89 |     hours: parseInt(match[2], 10),
90 |     minutes: parseInt(match[3], 10),
91 |   };
92 | }
93 | 
94 | export function computeZoneTime(utc: string, referenceDate: Date): Date {
95 |   const offset = parseUTCOffset(utc);
96 |   if (!offset) return new Date(NaN);
97 | 
98 |   const totalMinutes = (offset.hours * 60 + offset.minutes) * offset.sign;
99 |   const adjustedTime = new Date(referenceDate.getTime() + totalMinutes * 60000);
100 |   return adjustedTime;
101 | }
102 | 
103 | export function parseTimeToMinutes(timeStr: string): number {
104 |   const [hours, minutes] = timeStr.split(":").map(Number);
105 |   return hours * 60 + (minutes || 0);
106 | }
107 | 
108 | // Status calculation with proper type safety
109 | interface StatusResult {
110 |   label: string;
111 |   colorClass: string;
112 | }
113 | 
114 | export function getStatus(zone: TimeZone, referenceDate: Date): StatusResult {
115 |   try {
116 |     const localDate = computeZoneTime(zone.utc, referenceDate);
117 |     if (isNaN(localDate.getTime())) return invalidDateResult();
118 | 
119 |     const currentMinutes = localDate.getHours() * 60 + localDate.getMinutes();
120 |     const startMinutes = parseTimeToMinutes(zone.startTime);
121 |     const endMinutes = parseTimeToMinutes(zone.endTime);
122 | 
123 |     // Check weekend
124 |     const isWeekend = localDate.getDay() % 6 === 0;
125 | 
126 |     // Check holidays
127 |     const hd = new Holidays(zone.country);
128 |     const holidays = hd.getHolidays(localDate.getFullYear());
129 |     const isHoliday = holidays.some(
130 |       (h) => h.date === localDate.toISOString().split("T")[0]
131 |     );
132 | 
133 |     // Determine status
134 |     if (isHoliday) return holidayResult();
135 |     if (isWeekend) return weekendResult(localDate);
136 | 
137 |     return calculateWorkStatus(currentMinutes, startMinutes, endMinutes);
138 |   } catch (error) {
139 |     console.error("Error calculating status:", error);
140 |     return { label: "Error", colorClass: "bg-gray-500 text-white" };
141 |   }
142 | }
143 | 
144 | // Helper functions for status calculation
145 | function invalidDateResult(): StatusResult {
146 |   return { label: "Invalid Time", colorClass: "bg-gray-500 text-white" };
147 | }
148 | 
149 | function holidayResult(): StatusResult {
150 |   return { label: "Holiday", colorClass: "bg-purple-500 text-white" };
151 | }
152 | 
153 | function weekendResult(date: Date): StatusResult {
154 |   return {
155 |     label: date.getDay() === 0 ? "Sunday" : "Saturday",
156 |     colorClass: "bg-red-500 text-white",
157 |   };
158 | }
159 | 
160 | function calculateWorkStatus(
161 |   current: number,
162 |   start: number,
163 |   end: number
164 | ): StatusResult {
165 |   const isWorking =
166 |     start < end
167 |       ? current >= start && current < end
168 |       : current >= start || current < end;
169 | 
170 |   if (isWorking) {
171 |     const timeLeft = end - current;
172 |     return timeLeft <= 30
173 |       ? { label: "About to finish", colorClass: "bg-yellow-500 text-white" }
174 |       : { label: "Working", colorClass: "bg-green-500 text-white" };
175 |   }
176 | 
177 |   const timeUntil = start - current;
178 |   return timeUntil <= 30 && timeUntil > 0
179 |     ? { label: "About to start", colorClass: "bg-blue-500 text-white" }
180 |     : { label: "Closed", colorClass: "bg-gray-500 text-white" };
181 | }
```

src/lib/main.tsx
```
1 | // src/pages/TimeZoneDataTable.tsx
2 | 
3 | "use client";
4 | 
5 | import React, { useState, useEffect } from "react";
6 | import { zodResolver } from "@hookform/resolvers/zod";
7 | import { useForm } from "react-hook-form";
8 | import { z } from "zod";
9 | import {
10 |   ColumnDef,
11 |   flexRender,
12 |   getCoreRowModel,
13 |   getFilteredRowModel,
14 |   getPaginationRowModel,
15 |   getSortedRowModel,
16 |   SortingState,
17 |   ColumnFiltersState,
18 |   VisibilityState,
19 |   useReactTable,
20 | } from "@tanstack/react-table";
21 | import {
22 |   Table,
23 |   TableBody,
24 |   TableCell,
25 |   TableHead,
26 |   TableHeader,
27 |   TableRow,
28 | } from "../components/ui/table";
29 | import { Button } from "../components/ui/button";
30 | import { Star, StarOff } from "lucide-react";
31 | import {
32 |   computeZoneTime,
33 |   countryNames,
34 |   getStatus,
35 |   TimeZone,
36 |   timeZones,
37 | } from "../lib/constants";
38 | import {
39 |   Form,
40 |   FormControl,
41 |   FormDescription,
42 |   FormField,
43 |   FormItem,
44 |   FormLabel,
45 |   FormMessage,
46 | } from "../components/ui/form";
47 | import { Input } from "../components/ui/input";
48 | import ScheduleProposal from "./components/ScheduleProposal";
49 | 
50 | type Language = "en" | "zh" | "ja";
51 | 
52 | const translations: Record<Language, Record<string, string>> = {
53 |   en: {
54 |     country: "Country",
55 |     timezone: "Time Zone",
56 |     code: "Code",
57 |     start: "Start Time",
58 |     end: "End Time",
59 |     current: "Current Time",
60 |     title: "When They Work",
61 |     enterTime: "Enter ISO Time",
62 |     errorIsoTime:
63 |       "Invalid ISO 8601 string. Please use a format like 2023-01-01T12:00:00Z or 2023-01-01T12:00:00+09:00.",
64 |     scheduleProposals: "Meeting Proposals",
65 |     showScheduler: "Show Schedule Planner",
66 |     hideScheduler: "Hide Schedule Planner",
67 |     noZonesSelected: "Select time zones to view schedule proposals",
68 |     timelineLabel: "Explore dates up to 1 month ahead",
69 |     daysAhead: "days from now",
70 |     selectedMeetingTime: "Selected Meeting Time",
71 |   },
72 |   zh: {
73 |     country: "国家",
74 |     timezone: "时区",
75 |     code: "代码",
76 |     start: "工作开始时间",
77 |     end: "工作结束时间",
78 |     current: "当前时间",
79 |     title: "他们的工作时间",
80 |     enterTime: "输入ISO时间",
81 |     errorIsoTime:
82 |       "无效的ISO 8601字符串。请使用类似 2023-01-01T12:00:00Z 或 2023-01-01T12:00:00+09:00 的格式。",
83 |     scheduleProposals: "会议建议时间",
84 |     showScheduler: "显示日程计划",
85 |     hideScheduler: "隐藏日程计划",
86 |     noZonesSelected: "选择时区以查看日程建议",
87 |     timelineLabel: "探索未来一个月内的日期",
88 |     daysAhead: "天后",
89 |     selectedMeetingTime: "选定会议时间",
90 |   },
91 |   ja: {
92 |     country: "国",
93 |     timezone: "タイムゾーン",
94 |     code: "コード",
95 |     start: "勤務開始時間",
96 |     end: "勤務終了時間",
97 |     current: "現在の時間",
98 |     title: "彼らの勤務時間",
99 |     enterTime: "ISO時間を入力",
100 |     errorIsoTime:
101 |       "無効なISO 8601文字列です。例えば 2023-01-01T12:00:00Z または 2023-01-01T12:00:00+09:00 のような形式を使用してください。",
102 |     scheduleProposals: "会議の提案時間",
103 |     showScheduler: "スケジュールプランナーを表示",
104 |     hideScheduler: "スケジュールプランナーを非表示",
105 |     noZonesSelected: "スケジュール提案を見るにはタイムゾーンを選択してください",
106 |     timelineLabel: "最大1か月先までの日付を探索",
107 |     daysAhead: "日後",
108 |     selectedMeetingTime: "選択した会議時間",
109 |   },
110 | };
111 | 
112 | export const TimeZoneDataTable: React.FC = () => {
113 |   const [referenceDate, setReferenceDate] = useState<Date>(new Date());
114 |   const [language, setLanguage] = useState<Language>("en");
115 |   const [sorting, setSorting] = useState<SortingState>([]);
116 |   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
117 |   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
118 |   const [favorites, setFavorites] = useState<Set<string>>(new Set());
119 |   const [isoInput, setIsoInput] = useState<string>("");
120 |   const [selectedMeetingTime, setSelectedMeetingTime] =
121 |     useState<string>("12:00"); // Default meeting time
122 |   const [rowSelection, setRowSelection] = useState({});
123 | 
124 |   // Load favorites from localStorage
125 |   useEffect(() => {
126 |     const storedFavorites = localStorage.getItem("favorites");
127 |     if (storedFavorites) {
128 |       setFavorites(new Set(JSON.parse(storedFavorites)));
129 |     }
130 |   }, []);
131 | 
132 |   // Save favorites to localStorage
133 |   useEffect(() => {
134 |     localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
135 |   }, [favorites]);
136 | 
137 |   // Update referenceDate every minute if no ISO input
138 |   useEffect(() => {
139 |     if (!isoInput) {
140 |       const timer = setInterval(() => {
141 |         setReferenceDate(new Date());
142 |       }, 60000);
143 |       return () => clearInterval(timer);
144 |     }
145 |   }, [isoInput]);
146 | 
147 |   const t = translations[language];
148 | 
149 |   const toggleFavorite = (id: string) => {
150 |     setFavorites((prev) => {
151 |       const updated = new Set(prev);
152 |       if (updated.has(id)) {
153 |         updated.delete(id);
154 |       } else {
155 |         updated.add(id);
156 |       }
157 |       return updated;
158 |     });
159 |   };
160 | 
161 |   const Checkbox = ({
162 |     checked,
163 |     indeterminate,
164 |     onChange,
165 |   }: {
166 |     checked: boolean;
167 |     indeterminate: boolean;
168 |     onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
169 |   }) => (
170 |     <input
171 |       type="checkbox"
172 |       className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
173 |       checked={checked}
174 |       ref={(el) => el && (el.indeterminate = indeterminate)}
175 |       onChange={onChange}
176 |       aria-label="Select row"
177 |     />
178 |   );
179 | 
180 |   const columns = React.useMemo<ColumnDef<TimeZone>[]>(
181 |     () => [
182 |       // Selection column
183 |       {
184 |         id: "select",
185 |         header: ({ table }) => (
186 |           <Checkbox
187 |             checked={table.getIsAllRowsSelected()}
188 |             indeterminate={table.getIsSomeRowsSelected()}
189 |             onChange={(e) => table.getToggleAllRowsSelectedHandler()(e)}
190 |           />
191 |         ),
192 |         cell: ({ row }) => (
193 |           <Checkbox
194 |             checked={row.getIsSelected()}
195 |             indeterminate={row.getIsSomeSelected()}
196 |             onChange={row.getToggleSelectedHandler()}
197 |           />
198 |         ),
199 |         size: 40,
200 |       },
201 |       {
202 |         id: "favorite",
203 |         header: "",
204 |         cell: ({ row }) => {
205 |           const zone = row.original;
206 |           const isFav = favorites.has(zone.id);
207 |           return (
208 |             <button
209 |               onClick={(e) => {
210 |                 e.stopPropagation();
211 |                 toggleFavorite(zone.id);
212 |               }}
213 |               aria-label={isFav ? "Unfavorite" : "Favorite"}
214 |             >
215 |               {isFav ? (
216 |                 <Star className="text-yellow-500" />
217 |               ) : (
218 |                 <StarOff className="text-gray-400" />
219 |               )}
220 |             </button>
221 |           );
222 |         },
223 |         size: 50,
224 |         enableSorting: true,
225 |         enableFiltering: true,
226 |       },
227 |       {
228 |         id: "country",
229 |         header: t.country,
230 |         accessorFn: (row: TimeZone) => {
231 |           const info = countryNames[row.country];
232 |           return info ? info[language] || row.country : row.country;
233 |         },
234 |         enableSorting: true,
235 |         cell: ({ getValue }) => getValue(),
236 |         enableFiltering: true,
237 |       },
238 |       {
239 |         accessorKey: "utc",
240 |         header: t.timezone,
241 |         enableSorting: true,
242 |         enableFiltering: true,
243 |       },
244 |       {
245 |         accessorKey: "code",
246 |         header: t.code,
247 |         enableSorting: true,
248 |         enableFiltering: true,
249 |       },
250 |       {
251 |         accessorKey: "startTime",
252 |         header: t.start,
253 |         enableSorting: true,
254 |         enableFiltering: true,
255 |       },
256 |       {
257 |         accessorKey: "endTime",
258 |         header: t.end,
259 |         enableSorting: true,
260 |         enableFiltering: true,
261 |       },
262 |       {
263 |         id: "currentTime",
264 |         header: t.current,
265 |         cell: ({ row }) => {
266 |           const zone = row.original;
267 |           const date = computeZoneTime(zone.utc, referenceDate);
268 | 
269 |           // Return fallback if invalid date
270 |           if (isNaN(date.getTime())) return "Invalid time";
271 | 
272 |           // Format based on language
273 |           return date.toLocaleTimeString(language, {
274 |             hour: "2-digit",
275 |             minute: "2-digit",
276 |             hour12: language === "en", // Use AM/PM only for English
277 |           });
278 |         },
279 |         enableSorting: true,
280 |         enableFiltering: true,
281 |       },
282 |       {
283 |         id: "status",
284 |         header: "Status",
285 |         cell: ({ row }) => {
286 |           const zone = row.original;
287 |           const status = getStatus(zone, referenceDate);
288 |           return (
289 |             <span
290 |               className={`px-2 py-1 rounded-full text-sm ${status.colorClass}`}
291 |             >
292 |               {status.label}
293 |             </span>
294 |           );
295 |         },
296 |         enableSorting: true,
297 |         enableFiltering: true,
298 |       },
299 |     ],
300 |     [t, referenceDate, favorites, language]
301 |   );
302 | 
303 |   const table = useReactTable({
304 |     data: timeZones,
305 |     columns,
306 |     getRowId: (row) => row.id, // Use nanoid-generated ID
307 | 
308 |     initialState: {
309 |       pagination: { pageSize: 15 },
310 |     },
311 |     state: {
312 |       rowSelection,
313 | 
314 |       sorting,
315 |       columnFilters,
316 |       columnVisibility,
317 |     },
318 |     onRowSelectionChange: setRowSelection,
319 | 
320 |     onSortingChange: setSorting,
321 |     onColumnFiltersChange: setColumnFilters,
322 |     onColumnVisibilityChange: setColumnVisibility,
323 |     getCoreRowModel: getCoreRowModel(),
324 |     getFilteredRowModel: getFilteredRowModel(),
325 |     getPaginationRowModel: getPaginationRowModel(),
326 |     getSortedRowModel: getSortedRowModel(),
327 |     enableRowSelection: true,
328 |     enableMultiRowSelection: true,
329 |   });
330 | 
331 |   const selectedTimeZones = table
332 |     .getSelectedRowModel()
333 |     .rows.map((row) => row.original);
334 | 
335 |   const ISOTimeSchema = React.useMemo(() => {
336 |     return z.object({
337 |       isoTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
338 |         message: t.errorIsoTime,
339 |       }),
340 |     });
341 |   }, [t]);
342 | 
343 |   const form = useForm<z.infer<typeof ISOTimeSchema>>({
344 |     resolver: zodResolver(ISOTimeSchema),
345 |     defaultValues: {
346 |       isoTime: new Date().toISOString(),
347 |     },
348 |   });
349 | 
350 |   function onIsoTimeSubmit(data: z.infer<typeof ISOTimeSchema>) {
351 |     const { isoTime } = data;
352 |     setIsoInput(isoTime);
353 |     const parsedDate = new Date(isoTime);
354 |     setReferenceDate(parsedDate);
355 |   }
356 | 
357 |   return (
358 |     <div className="container mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
359 |       {/* Header */}
360 |       <div className="flex justify-between items-center mb-6">
361 |         <h1 className="text-3xl font-extrabold">{t.title}</h1>
362 |         <div className="flex items-center space-x-4">
363 |           <select
364 |             value={language}
365 |             onChange={(e) => setLanguage(e.target.value as Language)}
366 |             className="border p-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
367 |             aria-label="Select Language"
368 |           >
369 |             <option value="en">English</option>
370 |             <option value="zh">中文</option>
371 |             <option value="ja">日本語</option>
372 |           </select>
373 |         </div>
374 |       </div>
375 | 
376 |       {/* ISO Time Form */}
377 |       <Form {...form}>
378 |         <form
379 |           onSubmit={form.handleSubmit(onIsoTimeSubmit)}
380 |           className="w-full max-w-md space-y-6 mb-6"
381 |         >
382 |           <FormField
383 |             control={form.control}
384 |             name="isoTime"
385 |             render={({ field }) => (
386 |               <FormItem>
387 |                 <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
388 |                   {t.enterTime}
389 |                 </FormLabel>
390 |                 <FormControl>
391 |                   <Input
392 |                     {...field}
393 |                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
394 |                   />
395 |                 </FormControl>
396 |                 <FormDescription className="text-xs text-gray-500 dark:text-gray-400">
397 |                   {t.enterTime}
398 |                 </FormDescription>
399 |                 <FormMessage className="text-sm text-red-500" />
400 |               </FormItem>
401 |             )}
402 |           />
403 |           <Button
404 |             type="submit"
405 |             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
406 |           >
407 |             Set Time
408 |           </Button>
409 |         </form>
410 |       </Form>
411 | 
412 |       {/* Filter Input */}
413 |       <div className="flex items-center py-4">
414 |         <Input
415 |           placeholder="Filter country..."
416 |           value={(table.getColumn("country")?.getFilterValue() as string) ?? ""}
417 |           onChange={(e) =>
418 |             table.getColumn("country")?.setFilterValue(e.target.value)
419 |           }
420 |           className="max-w-sm"
421 |           aria-label="Filter Country"
422 |         />
423 |       </div>
424 | 
425 |       {/* Data Table */}
426 |       <div className="rounded-md border overflow-auto mb-6">
427 |         <Table>
428 |           <TableHeader>
429 |             {table.getHeaderGroups().map((headerGroup) => (
430 |               <TableRow key={headerGroup.id}>
431 |                 {headerGroup.headers.map((header) => (
432 |                   <TableHead
433 |                     key={header.id}
434 |                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
435 |                   >
436 |                     {flexRender(
437 |                       header.column.columnDef.header,
438 |                       header.getContext()
439 |                     )}
440 |                   </TableHead>
441 |                 ))}
442 |               </TableRow>
443 |             ))}
444 |           </TableHeader>
445 |           <TableBody>
446 |             {table.getRowModel().rows.length ? (
447 |               table.getRowModel().rows.map((row) => {
448 |                 return (
449 |                   <TableRow
450 |                     key={row.id}
451 |                     data-state={row.getIsSelected() && "selected"}
452 |                     className={`${
453 |                       row.getIsSelected()
454 |                         ? "bg-blue-50 dark:bg-gray-700"
455 |                         : "hover:bg-gray-100 dark:hover:bg-gray-800"
456 |                     }`}
457 |                   >
458 |                     {row.getVisibleCells().map((cell) => (
459 |                       <TableCell
460 |                         key={cell.id}
461 |                         className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
462 |                       >
463 |                         {flexRender(
464 |                           cell.column.columnDef.cell,
465 |                           cell.getContext()
466 |                         )}
467 |                       </TableCell>
468 |                     ))}
469 |                   </TableRow>
470 |                 );
471 |               })
472 |             ) : (
473 |               <TableRow>
474 |                 <TableCell
475 |                   colSpan={columns.length}
476 |                   className="px-6 py-4 text-center text-sm text-gray-500"
477 |                 >
478 |                   No results.
479 |                 </TableCell>
480 |               </TableRow>
481 |             )}
482 |           </TableBody>
483 |         </Table>
484 |       </div>
485 | 
486 |       {/* Pagination */}
487 |       <div className="flex items-center justify-end space-x-2 py-4">
488 |         <Button
489 |           variant="outline"
490 |           size="sm"
491 |           onClick={() => table.previousPage()}
492 |           disabled={!table.getCanPreviousPage()}
493 |           aria-label="Previous Page"
494 |         >
495 |           Previous
496 |         </Button>
497 |         <Button
498 |           variant="outline"
499 |           size="sm"
500 |           onClick={() => table.nextPage()}
501 |           disabled={!table.getCanNextPage()}
502 |           aria-label="Next Page"
503 |         >
504 |           Next
505 |         </Button>
506 |       </div>
507 | 
508 |       {/* Schedule Proposal Section */}
509 |       {selectedTimeZones.length > 0 && (
510 |         <div className="mt-8">
511 |           <h2 className="text-2xl font-bold mb-4">{t.scheduleProposals}</h2>
512 |           <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
513 |             <span>
514 |               {new Date(referenceDate).toLocaleDateString(language, {
515 |                 month: "short",
516 |                 day: "numeric",
517 |               })}
518 |             </span>
519 |             <span>
520 |               {new Date(
521 |                 referenceDate.getTime() + 30 * 86400000
522 |               ).toLocaleDateString(language, {
523 |                 month: "short",
524 |                 day: "numeric",
525 |               })}
526 |             </span>
527 |           </div>
528 |           <ScheduleProposal
529 |             timeZones={selectedTimeZones}
530 |             referenceDate={referenceDate}
531 |             language={language}
532 |             onTimeChange={(newTime) => setSelectedMeetingTime(newTime)}
533 |           />
534 |           {/* Display Selected Meeting Time */}
535 |           <div className="text-center text-lg font-medium text-gray-800 dark:text-gray-200 mt-4">
536 |             {language === "en"
537 |               ? `Selected Meeting Time: ${selectedMeetingTime}`
538 |               : language === "zh"
539 |               ? `选定会议时间：${selectedMeetingTime}`
540 |               : `選択した会議時間：${selectedMeetingTime}`}
541 |           </div>
542 |         </div>
543 |       )}
544 |     </div>
545 |   );
546 | };
547 | 
548 | export default TimeZoneDataTable;
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

src/components/ui/checkbox.tsx
```
1 | import * as React from "react"
2 | import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
3 | import { Check } from "lucide-react"
4 | 
5 | import { cn } from "@/lib/utils"
6 | 
7 | const Checkbox = React.forwardRef<
8 |   React.ElementRef<typeof CheckboxPrimitive.Root>,
9 |   React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
10 | >(({ className, ...props }, ref) => (
11 |   <CheckboxPrimitive.Root
12 |     ref={ref}
13 |     className={cn(
14 |       "peer h-4 w-4 shrink-0 rounded-sm border border-zinc-200 border-zinc-900 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-zinc-900 data-[state=checked]:text-zinc-50 dark:border-zinc-800 dark:border-zinc-50 dark:focus-visible:ring-zinc-300 dark:data-[state=checked]:bg-zinc-50 dark:data-[state=checked]:text-zinc-900",
15 |       className
16 |     )}
17 |     {...props}
18 |   >
19 |     <CheckboxPrimitive.Indicator
20 |       className={cn("flex items-center justify-center text-current")}
21 |     >
22 |       <Check className="h-4 w-4" />
23 |     </CheckboxPrimitive.Indicator>
24 |   </CheckboxPrimitive.Root>
25 | ))
26 | Checkbox.displayName = CheckboxPrimitive.Root.displayName
27 | 
28 | export { Checkbox }
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

src/lib/components/ScheduleProposal.tsx
```
1 | // src/components/ScheduleProposal.tsx
2 | 
3 | import React, { useState, useRef, useEffect, useCallback } from "react";
4 | import {
5 |   DndContext,
6 |   PointerSensor,
7 |   useSensor,
8 |   useSensors,
9 |   useDraggable,
10 |   DragEndEvent,
11 | } from "@dnd-kit/core";
12 | import { TimeZone, computeZoneTime, countryNames } from "../constants";
13 | 
14 | interface ScheduleProposalProps {
15 |   timeZones: TimeZone[];
16 |   referenceDate?: Date; // Made optional to default to local time
17 |   language: "en" | "zh" | "ja";
18 |   onTimeChange?: (newTime: string) => void;
19 | }
20 | 
21 | const ScheduleProposal: React.FC<ScheduleProposalProps> = ({
22 |   timeZones,
23 |   referenceDate = new Date(), // Default to current local time
24 |   language,
25 |   onTimeChange,
26 | }) => {
27 |   const [selectedTime, setSelectedTime] = useState<string>("12:00"); // Default selected time
28 |   const timelineRef = useRef<HTMLDivElement>(null);
29 | 
30 |   const sensors = useSensors(useSensor(PointerSensor));
31 | 
32 |   // Obtain user's local time zone
33 |   const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
34 | 
35 |   // Calculate the position for the draggable marker
36 |   const calculateMarkerPosition = useCallback(() => {
37 |     if (timelineRef.current) {
38 |       const timelineWidth = timelineRef.current.offsetWidth;
39 |       const [hours, minutes] = selectedTime.split(":").map(Number);
40 |       const totalMinutes = hours * 60 + minutes;
41 |       const position = (totalMinutes / (24 * 60)) * timelineWidth;
42 |       return position;
43 |     }
44 |     return 0;
45 |   }, [selectedTime]);
46 | 
47 |   const [markerX, setMarkerX] = useState<number>(calculateMarkerPosition());
48 | 
49 |   useEffect(() => {
50 |     setMarkerX(calculateMarkerPosition());
51 |   }, [selectedTime, referenceDate, calculateMarkerPosition]);
52 | 
53 |   const handleDragEnd = (event: DragEndEvent) => {
54 |     if (timelineRef.current) {
55 |       const timelineWidth = timelineRef.current.offsetWidth;
56 |       let newMarkerX = markerX + event.delta.x;
57 | 
58 |       // Clamp the marker's position within the timeline
59 |       newMarkerX = Math.max(0, Math.min(newMarkerX, timelineWidth));
60 | 
61 |       // Calculate the new time based on the clamped position
62 |       const newTotalMinutes = Math.round(
63 |         (newMarkerX / timelineWidth) * 24 * 60
64 |       );
65 |       const newHours = Math.floor(newTotalMinutes / 60);
66 |       const newMinutes = newTotalMinutes % 60;
67 |       const newTime = `${newHours.toString().padStart(2, "0")}:${newMinutes
68 |         .toString()
69 |         .padStart(2, "0")}`;
70 | 
71 |       setSelectedTime(newTime);
72 |       if (onTimeChange) onTimeChange(newTime);
73 |     }
74 |   };
75 | 
76 |   useEffect(() => {
77 |     if (onTimeChange) {
78 |       onTimeChange(selectedTime);
79 |     }
80 |   }, [selectedTime, onTimeChange]);
81 | 
82 |   // Draggable Marker using @dnd-kit
83 |   const DraggableMarker = () => {
84 |     const { attributes, listeners, setNodeRef, transform } = useDraggable({
85 |       id: "draggable-marker",
86 |     });
87 | 
88 |     const timelineWidth = timelineRef.current?.offsetWidth || 0;
89 |     const currentMarkerX = transform ? markerX + transform.x : markerX;
90 | 
91 |     // Clamp the marker's position within the timeline
92 |     const clampedX = Math.max(0, Math.min(currentMarkerX, timelineWidth));
93 | 
94 |     return (
95 |       <div
96 |         ref={setNodeRef}
97 |         style={{
98 |           transform: `translateX(${clampedX}px)`,
99 |         }}
100 |         className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 cursor-pointer"
101 |         aria-valuemin={0}
102 |         aria-valuemax={24}
103 |         aria-valuenow={parseInt(selectedTime.split(":")[0])}
104 |         aria-label="Selected Meeting Time"
105 |         {...listeners}
106 |         {...attributes}
107 |       >
108 |         {/* Inverted Triangle Handle */}
109 |         <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
110 |           <div
111 |             className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-red-500"
112 |             style={{ transform: "rotate(180deg)" }}
113 |           ></div>
114 |         </div>
115 |       </div>
116 |     );
117 |   };
118 | 
119 |   return (
120 |     <div className="relative overflow-x-auto pb-4">
121 |       {/* Timeline Header with Time Zone Label */}
122 |       <div className="flex items-center justify-between mb-2">
123 |         <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
124 |           {language === "en"
125 |             ? `Timeline (${userTimeZone})`
126 |             : language === "zh"
127 |             ? `时间线 (${userTimeZone})`
128 |             : `タイムライン (${userTimeZone})`}
129 |         </span>
130 |       </div>
131 |       <div className="w-full" ref={timelineRef}>
132 |         {/* Horizontal Timeline */}
133 |         <div className="flex items-center border-b bg-gray-50 dark:bg-gray-800 relative">
134 |           <div className="w-32 flex-shrink-0"></div>
135 |           {Array.from({ length: 24 }).map((_, i) => (
136 |             <div
137 |               key={i}
138 |               className="flex-1 text-center p-2 border-l text-xs text-gray-500 truncate"
139 |             >
140 |               {`${i.toString().padStart(2, "0")}:00`}
141 |             </div>
142 |           ))}
143 |         </div>
144 | 
145 |         {/* Time Zones Columns */}
146 |         <div className="flex">
147 |           <div className="w-32 flex-shrink-0"></div>
148 |           {timeZones.map((zone) => {
149 |             const [hours, minutes] = selectedTime.split(":").map(Number);
150 |             const localDate = computeZoneTime(zone.utc, referenceDate);
151 |             localDate.setHours(hours, minutes);
152 | 
153 |             const formattedTime = localDate.toLocaleTimeString(language, {
154 |               hour: "2-digit",
155 |               minute: "2-digit",
156 |               hour12: language === "en",
157 |               timeZone: zone.timeZone || "UTC", // Ensure computeZoneTime considers timeZone
158 |             });
159 | 
160 |             return (
161 |               <div
162 |                 key={zone.id}
163 |                 className="flex-1 border-l dark:border-gray-700 relative"
164 |               >
165 |                 {/* Time Zone Label */}
166 |                 <div className="absolute top-0 left-0 w-full text-center p-2 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
167 |                   {countryNames[zone.country]?.[language] || zone.country}
168 |                 </div>
169 | 
170 |                 {/* Local Time Display */}
171 |                 <div className="mt-8 text-center text-sm text-gray-800 dark:text-gray-200">
172 |                   {formattedTime} ({zone.countryCode})
173 |                 </div>
174 |               </div>
175 |             );
176 |           })}
177 |         </div>
178 |       </div>
179 | 
180 |       {/* Draggable Timeline Marker using @dnd-kit */}
181 |       <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
182 |         <DraggableMarker />
183 |       </DndContext>
184 | 
185 |       {/* Legend */}
186 |       <div className="mt-4 flex gap-4 text-sm">
187 |         <div className="flex items-center gap-1">
188 |           <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
189 |           <span className="text-gray-700 dark:text-gray-300">
190 |             {language === "en"
191 |               ? "Selected Time"
192 |               : language === "zh"
193 |               ? "选定时间"
194 |               : "選択した時間"}
195 |           </span>
196 |         </div>
197 |       </div>
198 |     </div>
199 |   );
200 | };
201 | 
202 | export default ScheduleProposal;
```
