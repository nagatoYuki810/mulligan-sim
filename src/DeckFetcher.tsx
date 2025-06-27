import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * DeckFetcher
 * --------------------------------------------------------------------
 * デッキコードを入力すると Shadowverse WB API から JSON を取得し、
 * 親コンポーネントへコールバックで渡す。ブラウザ直接 fetch は CORS
 * で弾かれるため https://corsproxy.io/ を経由。
 *
 * Props:
 *   onDeckJson?: (json: any) => void  // 取得成功時に呼び出される
 */
export default function DeckFetcher({
  onDeckJson,
}: {
  onDeckJson?: (json: any) => void;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  const API =
    "https://corsproxy.io/?https://shadowverse-wb.com/web/DeckCode/getDeck";

  async function fetchDeck() {
    const deckCode = code.trim();
    if (!deckCode) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const params = new URLSearchParams({ deck_code: deckCode });
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: params.toString(),
      });

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const json = await res.json();
      setData(json);
      onDeckJson?.(json); // 親へ通知
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-4 space-y-4 max-w-xl mx-auto">
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="デッキコードを入力"
            className="flex-1 border rounded px-2 py-1 dark:bg-zinc-900"
          />
          <Button onClick={fetchDeck} disabled={loading}>
            {loading ? "Loading…" : "決定"}
          </Button>
        </div>

        {error && <p className="text-red-600">Error: {error}</p>}

        {false && data && (
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 dark:bg-zinc-800 p-2 rounded max-h-96 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
