"use client";

import * as React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star, StarOff } from "lucide-react";
import {
  computeZoneTime,
  countryNames,
  getStatus,
  TimeZone,
  timeZones,
} from "./constants";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Language = "en" | "zh" | "ja";

const translations: Record<Language, Record<string, string>> = {
  en: {
    country: "Country",
    timezone: "Time Zone",
    code: "Code",
    start: "Start Time",
    end: "End Time",
    current: "Current Time",
    title: "When They Work",
    enterTime: "Enter ISO Time",
    errorIsoTime:
      "Invalid ISO 8601 string. Please use a format like 2023-01-01T12:00:00Z or 2023-01-01T12:00:00+09:00.",
    scheduleProposals: "Meeting Proposals",
    showScheduler: "Show Schedule Planner",
    hideScheduler: "Hide Schedule Planner",
    noZonesSelected: "Select time zones to view schedule proposals",
    timelineLabel: "Explore dates up to 1 month ahead",
    daysAhead: "days from now",
  },
  zh: {
    country: "国家",
    timezone: "时区",
    code: "代码",
    start: "工作开始时间",
    end: "工作结束时间",
    current: "当前时间",
    title: "他们的工作时间",
    enterTime: "输入ISO时间",
    errorIsoTime:
      "无效的ISO 8601字符串。请使用类似 2023-01-01T12:00:00Z 或 2023-01-01T12:00:00+09:00 的格式。",
    scheduleProposals: "会议建议时间",
    showScheduler: "显示日程计划",
    hideScheduler: "隐藏日程计划",
    noZonesSelected: "选择时区以查看日程建议",
    timelineLabel: "探索未来一个月内的日期",
    daysAhead: "天后",
  },
  ja: {
    country: "国",
    timezone: "タイムゾーン",
    code: "コード",
    start: "勤務開始時間",
    end: "勤務終了時間",
    current: "現在の時間",
    title: "彼らの勤務時間",
    enterTime: "ISO時間を入力",
    errorIsoTime:
      "無効なISO 8601文字列です。例えば 2023-01-01T12:00:00Z または 2023-01-01T12:00:00+09:00 のような形式を使用してください。",
    scheduleProposals: "会議の提案時間",
    showScheduler: "スケジュールプランナーを表示",
    hideScheduler: "スケジュールプランナーを非表示",
    noZonesSelected: "スケジュール提案を見るにはタイムゾーンを選択してください",
    timelineLabel: "最大1か月先までの日付を探索",
    daysAhead: "日後",
  },
};

export function TimeZoneDataTable() {
  const [referenceDate, setReferenceDate] = React.useState<Date>(new Date());
  const [language, setLanguage] = React.useState<Language>("en");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
  const [isoInput, setIsoInput] = React.useState<string>("");
  const [selectedTimeZones, setSelectedTimeZones] = useState<TimeZone[]>([]);
  const [showScheduler, setShowScheduler] = useState(false);
  const [daysAhead, setDaysAhead] = React.useState(0);

  React.useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(new Set(JSON.parse(storedFavorites)));
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  React.useEffect(() => {
    if (!isoInput) {
      const timer = setInterval(() => {
        setReferenceDate(new Date());
      }, 60000);
      return () => clearInterval(timer);
    }
  }, [isoInput]);

  const t = translations[language];

  const toggleFavorite = (country: string) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (updated.has(country)) {
        updated.delete(country);
      } else {
        updated.add(country);
      }
      return updated;
    });
  };

  const handleRowClick = (zone: TimeZone) => {
    setSelectedTimeZones((prev) =>
      prev.some((z) => z.country === zone.country)
        ? prev.filter((z) => z.country !== zone.country)
        : [...prev, zone]
    );
  };

  const columns = React.useMemo<ColumnDef<TimeZone>[]>(
    () => [
      {
        id: "favorite",
        header: "",
        cell: ({ row }) => {
          const zone = row.original;
          const isFav = favorites.has(zone.country);
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(zone.country);
              }}
            >
              {isFav ? (
                <Star className="text-yellow-500" />
              ) : (
                <StarOff className="text-gray-400" />
              )}
            </button>
          );
        },
        size: 50,
        enableSorting: true,
        enableFiltering: true,
      },
      {
        id: "country",
        header: t.country,
        accessorFn: (row: TimeZone) => {
          const info = countryNames[row.country];
          return info ? info[language] || row.country : row.country;
        },
        enableSorting: true,
        cell: ({ getValue }) => getValue(),
        enableFiltering: true,
      },
      {
        accessorKey: "utc",
        header: t.timezone,
        enableSorting: true,
        enableFiltering: true,
      },
      {
        accessorKey: "code",
        header: t.code,
        enableSorting: true,
        enableFiltering: true,
      },
      {
        accessorKey: "startTime",
        header: t.start,
        enableSorting: true,
        enableFiltering: true,
      },
      {
        accessorKey: "endTime",
        header: t.end,
        enableSorting: true,
        enableFiltering: true,
      },
      {
        id: "currentTime",
        header: t.current,
        cell: ({ row }) => {
          const zone = row.original;
          return computeZoneTime(zone.utc, referenceDate);
        },
        enableSorting: true,
        enableFiltering: true,
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const zone = row.original;
          const current = computeZoneTime(zone.utc, referenceDate);
          const status = getStatus(zone, current, referenceDate);
          return (
            <span
              className={`px-2 py-1 rounded-full text-sm ${status.colorClass}`}
            >
              {status.label}
            </span>
          );
        },
        enableSorting: true,
        enableFiltering: true,
      },
    ],
    [t, referenceDate, favorites, language]
  );

  const table = useReactTable({
    data: timeZones,
    columns,
    initialState: {
      pagination: { pageSize: 15 },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const ISOTimeSchema = React.useMemo(() => {
    return z.object({
      isoTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: t.errorIsoTime,
      }),
    });
  }, [t]);

  const form = useForm<z.infer<typeof ISOTimeSchema>>({
    resolver: zodResolver(ISOTimeSchema),
    defaultValues: {
      isoTime: new Date().toISOString(),
    },
  });

  function onIsoTimeSubmit(data: z.infer<typeof ISOTimeSchema>) {
    const { isoTime } = data;
    setIsoInput(isoTime);
    const parsedDate = new Date(isoTime);
    setReferenceDate(parsedDate);
    form.reset();
  }

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="border p-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
        </select>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onIsoTimeSubmit)}
          className="w-2/3 space-y-6 mb-4"
        >
          <FormField
            control={form.control}
            name="isoTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.enterTime}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>{t.enterTime}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Set Time</Button>
        </form>
      </Form>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter country..."
          value={(table.getColumn("country")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("country")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 py-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const isSelected = selectedTimeZones.some(
                  (z) => z.country === row.original.country
                );
                return (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row.original)}
                    className={`cursor-pointer ${
                      isSelected ? "bg-blue-50 dark:bg-gray-700" : ""
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t.scheduleProposals}</h2>
          {selectedTimeZones.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowScheduler(!showScheduler)}
            >
              {showScheduler ? t.hideScheduler : t.showScheduler}
            </Button>
          )}
        </div>

        {selectedTimeZones.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {t.noZonesSelected}
          </div>
        ) : (
          showScheduler && (
            <div className="space-y-4">
              <div className="mb-4 space-y-2">
                <label className="block text-sm font-medium">
                  {t.timelineLabel} ({daysAhead} {t.daysAhead})
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={daysAhead}
                  onChange={(e) => setDaysAhead(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    {new Date(referenceDate).toLocaleDateString(language, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span>
                    {new Date(
                      referenceDate.getTime() + 30 * 86400000
                    ).toLocaleDateString(language, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
