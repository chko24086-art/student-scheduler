"use client";

import { useState } from "react";

type ClassEvent = {
  id: string;
  day: "月" | "火" | "水" | "木" | "金";
  period: number;
  title: string;
  room: string;
};

type TaskItem = {
  id: string;
  title: string;
  course: string;
  deadline: string;
  estimatedMinutes: number;
  completed: boolean;
};

const INITIAL_CLASSES: ClassEvent[] = [
  { id: "c1", day: "月", period: 2, title: "ソフトウェア開発演習", room: "情報棟301" },
  { id: "c2", day: "火", period: 1, title: "アルゴリズムとデータ構造", room: "本館204" },
  { id: "c3", day: "水", period: 3, title: "データベース論", room: "オンライン" },
  { id: "c4", day: "木", period: 2, title: "人工知能概論", room: "情報棟102" },
  { id: "c5", day: "金", period: 4, title: "英語コミュニケーション", room: "語学棟405" },
];

const INITIAL_TASKS: TaskItem[] = [
  { id: "t1", title: "Week 1 環境構築＆デプロイ報告", course: "ソフトウェア開発演習", deadline: "2026-11-16 23:59", estimatedMinutes: 60, completed: true },
  { id: "t2", title: "ソートアルゴリズム計算量レポート", course: "アルゴリズムとデータ構造", deadline: "2026-11-18 17:00", estimatedMinutes: 120, completed: false },
  { id: "t3", title: "SQL正規化演習プリント提出", course: "データベース論", deadline: "2026-11-20 23:59", estimatedMinutes: 90, completed: false },
];

const DAYS: ("月" | "火" | "水" | "木" | "金")[] = ["月", "火", "水", "木", "金"];
const PERIODS = [1, 2, 3, 4, 5];

export default function Home() {
  const [pasteText, setPasteText] = useState("");
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-indigo-700">CampusFlow AI</h1>
            <p className="text-sm text-slate-500">シラバス・講義連絡コピペで自動整理する学生向けスケジューラー（Week 1 MVP）</p>
          </div>
          <span className="mt-2 md:mt-0 inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
            2026年度 秋学期 モード
          </span>
        </header>

        {/* シラバス・講義連絡コピペエリア（Week 3でAI連携） */}
        <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-base font-bold mb-2 flex items-center gap-2">
            <span>📋</span> シラバス・講義アナウンスを貼り付け
          </h2>
          <textarea
            className="w-full h-24 p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="例：第4回レポート課題「ER図の作成」を11月25日23:59までにLMSへ提出してください（目安作業時間：2時間）"
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-400">※ Week 3 でここに Gemini AI 解析エンジンを接続します</p>
            <button
              onClick={() => alert("Week 3 でAI自動抽出機能が有効になります！\n入力内容: " + (pasteText || "(未入力)"))}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              AIでスケジュール化（準備中）
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 週間時間割グリッド */}
          <section className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            <h2 className="text-base font-bold mb-4">📅 週間時間割（固定授業・空きコマ可視化）</h2>
            <table className="w-full border-collapse text-sm min-w-[500px]">
              <thead>
                <tr className="bg-slate-100 text-slate-600">
                  <th className="border border-slate-200 p-2 w-14">時限</th>
                  {DAYS.map((day) => (
                    <th key={day} className="border border-slate-200 p-2">{day}曜</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((period) => (
                  <tr key={period}>
                    <td className="border border-slate-200 p-2 text-center font-semibold bg-slate-50">
                      {period}限
                    </td>
                    {DAYS.map((day) => {
                      const cls = INITIAL_CLASSES.find((c) => c.day === day && c.period === period);
                      return (
                        <td key={day} className="border border-slate-200 p-2 h-20 align-top">
                          {cls ? (
                            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-2 rounded h-full">
                              <div className="font-bold text-indigo-900 text-xs">{cls.title}</div>
                              <div className="text-[11px] text-indigo-600 mt-1">{cls.room}</div>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-300 text-center pt-5">空きコマ</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 課題・タスク一覧 */}
          <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-base font-bold mb-4">✅ 課題・デッドライン一覧</h2>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    task.completed
                      ? "bg-slate-50 border-slate-200 opacity-60"
                      : "bg-amber-50/50 border-amber-200 hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="mt-1 accent-indigo-600"
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${task.completed ? "line-through text-slate-500" : "text-slate-800"}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{task.course}</p>
                      <div className="flex items-center justify-between mt-2 text-[11px]">
                        <span className="text-rose-600 font-medium">締切: {task.deadline}</span>
                        <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded">約{task.estimatedMinutes}分</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}