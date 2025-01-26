// src/lib/main.tsx
import React, { useState, useEffect } from "react";
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
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Star, StarOff } from "lucide-react";
import {
  computeZoneTime,
  countryNames,
  getStatus,
  TimeZone,
  timeZones,
} from "../lib/constants";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import ScheduleProposal from "./components/ScheduleProposal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { toggleFavorite, loadFavorites } from "../store/slices/favoritesSlice";
import { setLanguage } from "../store/slices/languageSlice";
import { setReferenceDate, setIsoInput } from "../store/slices/timeZoneSlice";

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
    selectedMeetingTime: "Selected Meeting Time",
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
    selectedMeetingTime: "选定会议时间",
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
    selectedMeetingTime: "選択した会議時間",
  },
};

export const TimeZoneDataTable: React.FC = () => {
  const dispatch = useDispatch();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Redux state
  const { favorites } = useSelector((state: RootState) => state.favorites);
  const language = useSelector((state: RootState) => state.language.language);
  const { referenceDate: referenceDateISO, isoInput } = useSelector(
    (state: RootState) => state.timeZone
  );
  const referenceDate = React.useMemo(
    () => new Date(referenceDateISO),
    [referenceDateISO]
  );
  const selectedMeetingTime = useSelector(
    (state: RootState) => state.timeZone.selectedMeetingTime
  );

  // Local state for checkbox component
  const Checkbox = ({
    checked,
    indeterminate,
    onChange,
  }: {
    checked: boolean;
    indeterminate: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      checked={checked}
      ref={(el) => el && (el.indeterminate = indeterminate)}
      onChange={onChange}
      aria-label="Select row"
    />
  );

  // Load favorites on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      dispatch(loadFavorites(JSON.parse(storedFavorites)));
    }
  }, [dispatch]);

  // Save favorites on change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Update referenceDate every minute if no ISO input
  useEffect(() => {
    if (!isoInput) {
      const timer = setInterval(() => {
        dispatch(setReferenceDate(new Date()));
      }, 60000);
      return () => clearInterval(timer);
    }
  }, [isoInput, dispatch]);

  const t = translations[language];

  const columns = React.useMemo<ColumnDef<TimeZone>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={(e) => table.getToggleAllRowsSelectedHandler()(e)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 40,
      },
      {
        id: "favorite",
        header: "",
        cell: ({ row }) => {
          const zone = row.original;
          const isFav = favorites.includes(zone.id);
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleFavorite(zone.id));
              }}
              aria-label={isFav ? "Unfavorite" : "Favorite"}
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
          const date = computeZoneTime(zone.utc, referenceDate);

          if (isNaN(date.getTime())) return "Invalid time";

          return date.toLocaleTimeString(language, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: language === "en",
          });
        },
        enableSorting: true,
        enableFiltering: true,
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const zone = row.original;
          const status = getStatus(zone, referenceDate);
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
    [t, referenceDate, favorites, language, dispatch]
  );

  const table = useReactTable({
    data: timeZones,
    columns,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageSize: 15 },
    },
    state: {
      rowSelection,
      sorting,
      columnFilters,
      columnVisibility,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: true,
  });

  const selectedTimeZones = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

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
    dispatch(setIsoInput(isoTime));
    const parsedDate = new Date(isoTime);
    dispatch(setReferenceDate(parsedDate));
  }

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold">{t.title}</h1>
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={(e) => dispatch(setLanguage(e.target.value as Language))}
            className="border p-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            aria-label="Select Language"
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
          </select>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onIsoTimeSubmit)}
          className="w-full max-w-md space-y-6 mb-6"
        >
          <FormField
            control={form.control}
            name="isoTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.enterTime}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500 dark:text-gray-400">
                  {t.enterTime}
                </FormDescription>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Set Time
          </Button>
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
          aria-label="Filter Country"
        />
      </div>

      <div className="rounded-md border overflow-auto mb-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${
                    row.getIsSelected()
                      ? "bg-blue-50 dark:bg-gray-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
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
          aria-label="Previous Page"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Next Page"
        >
          Next
        </Button>
      </div>

      {selectedTimeZones.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">{t.scheduleProposals}</h2>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
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
          <ScheduleProposal
            timeZones={selectedTimeZones}
            referenceDate={referenceDate}
            language={language}
          />
          <div className="text-center text-lg font-medium text-gray-800 dark:text-gray-200 mt-4">
            {language === "en"
              ? `Selected Meeting Time: ${selectedMeetingTime}`
              : language === "zh"
              ? `选定会议时间：${selectedMeetingTime}`
              : `選択した会議時間：${selectedMeetingTime}`}
          </div>
        </div>
      )}
    </div>
  );
};
