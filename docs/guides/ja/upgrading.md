---
title: アップグレード
section: upgrading
order: 13
description: 各バージョンで対応が必要な変更、meigen-sportsのカレンダーアイコンからの移行、今も使える名前をまとめます。
---

[English](../upgrading.md)

Koyomi Calendarsは初期開発中（0.x）なので、マイナーバージョンでインターフェースが増えることがあります。このページには、対応が必要な変更だけを書きます。日付つきの完全な記録は、[変更履歴](../../../CHANGELOG.md)にあります。

## 0.3.0へ

対応が必要なことはありません。描画は変わらず、オプションの追加も削除もありません。デモの「コードをコピー」とビルダーのコードの部分が、ファミリー共通の埋め込みパネルになりました。そのため、ふつうのHTML、React、Vue、Angular、Svelte、埋め込みページのiframe用のコードも書かれ、横に絵も出ます。

## 0.2.0へ

対応が必要なことはありません。描画は変わらず、オプションの追加も削除もありません。すべてのエクスポートに、動く例つきのページが[ドキュメントサイト](https://johnmorrisdotca.github.io/koyomi-calendars/docs/)にできました。iframe用の埋め込みページ（デモサイトの`embed.html`）もあります。ガイドも4つ増えました。Viteとwebpack、CDNを使うふつうのページ、iframe、TypeScriptとNodeです。デモサイトにあった古いドキュメントのページ（`docs/icons.html`など）は、ドキュメントサイトのガイドに変わりました。Markdownのファイルは、リポジトリに残っています。

## 0.1.1へ

ひとつのデザインが、レイアウトの理由で変わりました。年があるとき、`squircle`のアイコンの年は、ページの下端から4.5（幅256に対して）の位置にありました。全デザイン共通の決まりでは、幅の3%（7.7）を空けることになっています。年を表示するとき、日付は90ではなく80で描かれ（年がなければ90）、年の下端はページの下端から8.4の位置になります。`squircle`の出力をバイト単位で比べている場合（スナップショットテストなど）は、スナップショットを更新してください。ほかのデザインは変わらず、最初の17デザインは、今もmeigen-sports 0.19.2とバイト単位で同じに保たれています。

## meigen-sportsから

カレンダーアイコンは、meigen-sports 0.19.2からここへ移り、同じオプションで、同じ入力に対してバイト単位で同じ出力です。2,704の絵を、meigen-sports自身のものとハッシュで比べるテストがあります。移るには、meigen-sportsのカレンダーアイコンのインポートを、このパッケージのインポート（`import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars"`）に置き換えます。呼び出しは、ほかに何も変わりません。

日本の祝日、旧暦、六曜の関数も、同じ名前でいっしょに移っており、`@johnmorrisdotca/koyomi-calendars/japanese`だけからも使えます。meigen-sports 0.12の10個のテーマ名も使えます。次の節を参照してください。

## 今も使える名前

最初のデザインの10個の名前（`classic`、`outline`、`spiral`、`bold`、`tent`、`curl`、`pad`、`minimal`、`fold`、`tile`）は、それぞれ置き換わったデザインとして読み替えられるので、テーマの文字列を変える必要はありません。

```js
import { CALENDAR_THEME_ALIASES, calendarThemeOf } from "@johnmorrisdotca/koyomi-calendars";

console.log(Object.keys(CALENDAR_THEME_ALIASES).join(" "));
console.log(calendarThemeOf("classic"), calendarThemeOf("tile"));
// classic outline spiral bold tent curl pad minimal fold tile
// pins badge
```

## 最初のリリースで加わったもの

次はすべて0.1.0で加わったもので、対応は不要です。18番目のデザイン`squircle`、オプション`housing`、`rings`、`turn`と5つのプリセット、`/animate`（`flipCalendar`と日付の補助関数）、`/month`（`monthCalendar`、`monthGrid`、`daysInMonth`）、そして単独のインポートとしての各デザインです。

## 追従するには

1.0までは、テストしたマイナーバージョンに固定し（`~0.1.1`）、アップグレードのたびにこのページと変更履歴を読んでください。新しいオプションは、それを使わないアイコンの出力を変えません。絵が変わるときは変更履歴に書かれ、最初の17のデザインはゴールデンテストが守っています。
