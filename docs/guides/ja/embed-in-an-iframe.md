---
title: iframeで埋め込む
section: how-to
order: 12
description: iframe 1つ、スクリプトなしで、カレンダーアイコンや月間カレンダーをどのページにも置き、何を出すかはアドレスで決めます。
---

[English](../embed-in-an-iframe.md)

デモサイトには、枠に入れるためのページ`embed.html`があります。アドレスに書かれたものを描き、自分のファイルしか読み込まないので、こちら側にスクリプトも、ビルドも、パッケージも要りません。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Koyomi Calendars in an iframe</title>
  </head>
  <body>
    <iframe
      src="https://johnmorrisdotca.github.io/koyomi-calendars/embed.html?theme=squircle&date=2026-11-03&scheme=light&preset=disc-ringed"
      title="A calendar page for 3 November 2026"
      width="240"
      height="240"
      loading="lazy"
      style="border: 0"
    ></iframe>
  </body>
</html>
```

絵は枠の真ん中に、入る最大の大きさで置かれます。背景は透明なので、ページの色がそのまま出ます。

## アドレスに書けること

| パラメーター | 値 | 初期値 |
|---|---|---|
| `date` | 日付、`2026-11-03` | 今日 |
| `theme` | 18のデザインのひとつ。たとえば`squircle`、`badge`、`sun` | `pins` |
| `scheme` | `light`または`dark` | `light` |
| `preset` | `flat`、`disc`、`ringed`、`tilted`、`disc-ringed` | なし |
| `housing`、`rings`、`turn` | `circle`、`1`、角度（−45から45）。`preset`より優先されます。 | なし |
| `locale` | 言語。たとえば`ja` | `en` |
| `japanese` | `1`にすると、横の列のあるデザイン（`sun`、`roll`）に、日本の祝日、旧暦、六曜が入ります | オフ |
| `month` | `1`にすると、日ではなく、`date`の月全体を描きます | オフ |
| `design`、`week` | `month=1`のとき、`poster`、`board`、`wall`、`desk`。週の始まりを月曜にするなら`monday` | `poster`、日曜 |

知らない言葉は無視され、枠は初期値に戻ります。月が1から12の外、日が1から31の外の日付は、何も描きません。

## 大きさを決める

iframeに`width`と`height`を付けます。絵は、短いほうに合わせて拡大縮小されるので、正方形の枠なら、アイコンが全体で見えます。

## 公開する前に

- **枠に`title`を付ける。** 画面読み上げソフトに、枠の中身を伝えます。中の絵には、日付を示す`aria-label`が付いています。
- **リリースのアドレスを使う。** 埋め込みページはデモサイトの一部で、最新のリリースに追従します。書いたアドレスが約束で、あとから増えるパラメーターが、すでに動くアドレスを変えることはありません。
- **もっと細かく決めたいとき。** パッケージを読み込んで、SVGを自分で描きます。[フレームワークとサーバー](frameworks.md)を参照してください。
