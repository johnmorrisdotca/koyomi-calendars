---
title: ふつうのHTMLとCDN
section: how-to
order: 10
description: ビルドなしでページにアイコンを描きます。jsDelivrやunpkgから読み込み、デザインを1つだけ読み込み、ボタンでページをめくります。
---

[English](../html-and-cdn.md)

バンドラーのないページでも、パッケージのESモジュールをCDNから直接読み込めます。jsDelivrもunpkgも、npmパッケージのファイルをそのまま配信します。そのため、下のアドレスはどれも、パッケージの`dist`フォルダーの中のファイルです。

## ライブラリ全体を、jsDelivrから

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>A calendar icon from jsDelivr</title>
  </head>
  <body>
    <div id="today"></div>
    <script type="module">
      import { calendarIcon } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/koyomi-calendars/dist/index.js";

      const now = new Date();
      document.querySelector("#today").innerHTML = calendarIcon({ theme: "squircle", month: now.getMonth() + 1, day: now.getDate(), year: now.getFullYear() });
    </script>
  </body>
</html>
```

`calendarIcon`が返すのは文字列で、ライブラリが描いたものを`innerHTML`に入れても安全です。メモと祝日の文字は、エスケープされます。日付は自分のコードで1回だけ読み取って渡します。ライブラリは時計を読みません。このページは18のデザインをすべて読み込むので、圧縮して約49 kBです。

## デザインを1つだけ、unpkgから

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>One calendar design from unpkg</title>
  </head>
  <body>
    <div id="today"></div>
    <script type="module">
      import { calendarIcon } from "https://unpkg.com/@johnmorrisdotca/koyomi-calendars/dist/themes/badge.js";

      const now = new Date();
      document.querySelector("#today").innerHTML = calendarIcon({ month: now.getMonth() + 1, day: now.getDate(), year: now.getFullYear() });
    </script>
  </body>
</html>
```

`dist/themes/<名前>.js`を読み込めば、残りの17のデザインはページに届きません。デザイン1つは、圧縮して約9 kB（gzipで4 kB）です。このファイルの`calendarIcon`には`theme`オプションがありません。デザインがファイルそのものだからです。

## ボタンでページをめくる

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Turning the page, from jsDelivr</title>
  </head>
  <body>
    <div id="today"></div>
    <button type="button" id="next">Next day</button>
    <script type="module">
      import { calendarIcon } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/koyomi-calendars/dist/themes/squircle.js";
      import { flipCalendar, nextDay } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/koyomi-calendars/dist/animate.js";

      const host = document.querySelector("#today");
      const now = new Date();
      let shown = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
      host.innerHTML = calendarIcon(shown);

      document.querySelector("#next").addEventListener("click", async () => {
        shown = await flipCalendar(host, { render: (date) => calendarIcon(date), from: shown, to: nextDay(shown), animation: "fly-up" });
      });
    </script>
  </body>
</html>
```

`flipCalendar`は、ページを下へ破る、上へ飛ばす、角から破る、下へめくる、のどれかをして、いま表示している日付を返します。必要なのはブラウザーだけです。読む人が動きを減らす設定にしているときは、新しい日付がそのまま現れます。

## 公開する前に

- **バージョンを固定する。** `@johnmorrisdotca/koyomi-calendars@0.2.0/dist/...`と書けば、新しいリリースでページが変わりません。バージョンを書かないと、CDNは最新版を返します。
- **CDNを許可する。** コンテンツセキュリティポリシーのあるページは、`script-src`にCDNのホストを入れます。
- **`mark`をユーザーの入力から作らない。** ページにそのまま書き出されるのは、このオプションだけです。
- **ビルドがあるなら、バンドラーを使う。** [Viteとwebpack](bundlers.md)は、読み込んだものだけを残します。
