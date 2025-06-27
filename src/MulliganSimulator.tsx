import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { DeckCard } from "./DeckExtractor";

interface Props {
  cardPool?: DeckCard[]; // [{cost,name,count}] が渡される
}

export default function MulliganSimulator({ cardPool }: Props) {
  /* -------------------------------------------------- fallback deck */
  const fallbackPool: DeckCard[] = [
    { cost: 1, name: "知恵の輝き", count: 3 },
    { cost: 1, name: "ストームブラスト", count: 3 },
    { cost: 2, name: "アドラブルティーチャー・ノノ", count: 3 },
    { cost: 2, name: "真理の召喚", count: 2 },
    { cost: 2, name: "虹の奇跡", count: 1 },
    { cost: 3, name: "熾天使の福音", count: 3 },
    { cost: 3, name: "理光の証明", count: 2 },
    { cost: 3, name: "宿題やるですぅ！", count: 3 },
    { cost: 5, name: "ワンダーウィッチ・エミル", count: 2 },
    { cost: 5, name: "マナリアフレンズ・アン＆グレア", count: 3 },
    { cost: 6, name: "マナリアの学徒・ウィリアム", count: 2 },
    { cost: 7, name: "五行の果て・クオン", count: 3 },
    { cost: 7, name: "鬼呼びの術", count: 3 },
    { cost: 10, name: "最果ての罪・サタン", count: 1 },
    { cost: 10, name: "ブレイズデストロイヤー", count: 3 },
    { cost: 18, name: "オーバーディメンション", count: 3 },
  ];

  const pool = cardPool && cardPool.length ? cardPool : fallbackPool;

  /* -------------------------------------------------- helpers */
  const buildDeck = () => {
    const deck: { cost: number; name: string }[] = [];
    pool.forEach((card) => {
      for (let i = 0; i < card.count; i++) deck.push({ cost: card.cost, name: card.name });
    });
    return deck;
  };
  const shuffle = <T,>(arr: T[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  /* -------------------------------------------------- state */
  const [deck, setDeck] = useState<{ cost: number; name: string }[]>([]);
  const [initialHand, setInitialHand] = useState<typeof deck>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [finalHand, setFinalHand] = useState<typeof deck>([]);

  useEffect(() => restart(), [pool]);

  /* -------------------------------------------------- actions */
  function restart() {
    const d = shuffle(buildDeck());
    setInitialHand(d.slice(0, 4));
    setDeck(d.slice(4));
    setSelected(new Set());
    setFinalHand([]);
  }
  function toggle(i: number) {
    const s = new Set(selected);
    s.has(i) ? s.delete(i) : s.add(i);
    setSelected(s);
  }
  function confirm() {
    if (finalHand.length) return;
    let tmp = [...deck];
    const kept = [...initialHand];
    [...selected]
      .sort((a, b) => b - a)
      .forEach((i) => tmp.push(kept.splice(i, 1)[0]));
    tmp = shuffle(tmp);
    const draw = tmp.slice(0, selected.size);
    setFinalHand([...kept, ...draw]);
    setDeck(tmp.slice(selected.size));
  }

  /* -------------------------------------------------- Card Component */
  function CardView({
    card,
    selectable = false,
    selected = false,
    onClick,
  }: {
    card: { cost: number; name: string };
    selectable?: boolean;
    selected?: boolean;
    onClick?: () => void;
  }) {
    return (
      <Card
        className={`relative h-32 w-full select-none rounded-lg bg-white ring-1 ring-slate-300/60 shadow-sm transition-all duration-150 hover:-translate-y-1 hover:ring-indigo-400/60 ${
          selectable ? "cursor-pointer" : ""
        } ${selected ? "ring-4 ring-indigo-500/90" : ""}`}
        onClick={selectable ? onClick : undefined}
      >
        {/* マナコストバッジ */}
        <span className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-300 text-xs font-bold shadow-md">
          {card.cost}
        </span>
        <CardContent className="flex h-full w-full items-center justify-center p-2 text-center text-sm font-semibold tracking-tight">
          {card.name}
          {selectable && (
            <RotateCcw className="absolute right-1 top-1 h-4 w-4 opacity-80 text-indigo-300" />
          )}
        </CardContent>
      </Card>
    );
  }

  /* -------------------------------------------------- JSX */
  return (
    <div className="mx-auto max-w-xl space-y-10 p-4">
      {/* CHANGE */}
      <section>
        <h2 className="mb-3 text-center text-xl font-bold tracking-wide text-slate-100">CHANGE</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {initialHand.map((c, i) => (
            <CardView key={i} card={c} selectable selected={selected.has(i)} onClick={() => toggle(i)} />
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-slate-300">交換したいカードをクリックしてください</p>
      </section>

      {/* controls */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          className="bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-40"
          onClick={restart}
        >
          引き直す
        </Button>
        <Button
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-40"
          onClick={confirm}
          disabled={!!finalHand.length}
        >
          決定
        </Button>
      </div>

      {/* RESULT */}
      <section>
        <h2 className="mb-3 text-center text-xl font-bold tracking-wide text-slate-100">マリガン結果</h2>
        <div className="grid min-h-[8rem] grid-cols-2 sm:grid-cols-4 gap-4">
          {finalHand.length ? (
            finalHand.map((c, i) => <CardView key={i} card={c} />)
          ) : (
            <p className="col-span-full self-center text-center text-sm text-slate-400">
              決定ボタンで手札が確定します
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
