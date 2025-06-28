import { useState } from "react";
import DeckFetcher from "./DeckFetcher";
import DeckExtractor, { type DeckCard } from "./DeckExtractor";
import MulliganSimulator from "./MulliganSimulator";
import "./App.css";

export default function App() {
  const [deckJson, setDeckJson] = useState<any | null>(null);
  const [deckCards, setDeckCards] = useState<DeckCard[] | null>(null);

  return (
    // 画面全体にグラデーション背景 ➜ slate-900→slate-800
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-800 text-slate-100 flex flex-col items-center">
      {/* -------------------------------------------------- HEADER */}
      <header className="w-full shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* 左上ロゴ */}
          <div className="leading-tight">
            <span className="text-lg font-bold tracking-wider">Shadowverse</span>
            <br />
            <span className="text-xs uppercase tracking-widest text-slate-300">Worlds&nbsp;Beyond</span>
          </div>

          {/* タイトル */}
          <h1 className="text-xl md:text-2xl font-bold tracking-wide text-center">
            &nbsp;マリガン&nbsp;シミュレーター
          </h1>

          {/* 右側の空スペースで中央寄せを維持 */}
          <div className="w-28 md:w-36" />
        </div>
      </header>

      {/* -------------------------------------------------- MAIN CONTENT */}
      <main className="w-full max-w-4xl flex-1 p-4 space-y-6 flex flex-col items-center">
        <DeckFetcher onDeckJson={setDeckJson} />

        {deckJson && (
          <DeckExtractor deckJson={deckJson} onDeckList={setDeckCards} />
        )}

        {deckCards && <MulliganSimulator cardPool={deckCards} />}
      </main>
    </div>
  );
}
