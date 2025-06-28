import { useState, useEffect } from "react";

export interface DeckCard {
  cost: number;
  name: string;
  count: number;
}

/**
 * DeckExtractor
 * --------------------------------------------------------------------
 * Props:
 *   deckJson?: any                        // DeckFetcher から渡された生 JSON
 *   onDeckList?: (list: DeckCard[]) => void // 解析済み [{cost,name,count}] を親へ通知
 *
 * 1. deckJson が来たら解析→表示→onDeckList コールバック
 */
export default function DeckExtractor({
  deckJson,
  onDeckList,
}: {
  deckJson?: any;
  onDeckList?: (list: DeckCard[]) => void;
}) {
  const [deck, setDeck] = useState<DeckCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------------------
   * deckJson が props で渡ってきた場合の処理
   * ------------------------------------------------------------------*/
  useEffect(() => {
    if (!deckJson) return;
    try {
      const list = extractDeckList(deckJson);
      setDeck(list);
      onDeckList?.(list); // 親へ通知
    } catch (e: any) {
      setError(e.message);
    }
  }, [deckJson]);

  /* ------------------------------------------------------------------
   * 共通ユーティリティ
   * ------------------------------------------------------------------*/
  function stripHtml(text: string): string {
    const tmp = document.createElement("div");
    tmp.innerHTML = text;
    return tmp.textContent?.trim() ?? text;
  }

  function extractDeckList(json: any): DeckCard[] {
    const cardDetails = json["data"]["card_details"];
    const deckCounts = json["data"]["deck_card_num"];

    const list: DeckCard[] = Object.entries(deckCounts).map(([cardId, count]) => {
      const common = cardDetails[String(cardId)]["common"];
      return {
        cost: common["cost"],
        name: stripHtml(common["name"]),
        count: count as number,
      };
    });

    return list.sort((a, b) => (a.cost - b.cost) || a.name.localeCompare(b.name));
  }

  /* ------------------------------------------------------------------
   * JSX
   * 
  return (
    <Card className="p-4 space-y-4 w-full">
      <CardContent className="space-y-4">
        {error && <p className="text-red-600">Error: {error}</p>}

        {deck.length > 0 && (
          <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded max-h-96 overflow-auto text-sm">
            {deck
              .map(
                (c) =>
                  `{ cost: ${c.cost}, name: "${c.name}", count: ${c.count} },`
              )
              .join("\n")}
          </pre>
        )}
      </CardContent>
    </Card>
  );
  ------------------------------------------------------------------*/
}
