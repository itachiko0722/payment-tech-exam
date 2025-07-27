# Payment Tech Exam

支払い技術に関する知識を楽しく学べるクイズ形式の学習アプリケーションです。

## 機能

- **カテゴリ別学習**: 決済システム、セキュリティ、法規制、フィンテックの4カテゴリ
- **難易度選択**: 初級・中級・上級の3段階
- **リアルタイムスコアリング**: 正答率と解答時間に基づくスコア計算
- **進捗管理**: 学習履歴とカテゴリ別の成績を記録
- **アチーブメント機能**: 目標達成でバッジを獲得
- **レスポンシブデザイン**: PC・スマートフォンに対応

## 使い方

1. `index.html`をブラウザで開く
2. カテゴリ、難易度、問題数を選択
3. 「検定を開始」ボタンをクリック
4. 制限時間内に問題に回答
5. 結果確認と学習進捗の確認

## ファイル構成

```
payment-tech-exam/
├── index.html      # メインHTML
├── styles.css      # カスタムスタイル
├── questions.js    # 問題データベース
├── game.js         # ゲームロジック
└── README.md       # このファイル
```

## 技術スタック

- HTML5
- CSS3 (Tailwind CSS via CDN)
- JavaScript (ES6+)
- LocalStorage (データ永続化)

## カスタマイズ

### 問題の追加

`questions.js`の`questionsDatabase`配列に以下の形式で問題を追加できます：

```javascript
{
    id: "unique_id",
    type: "multiple_choice",
    category: "payment_systems", // payment_systems, security, regulations, fintech
    difficulty: "basic",          // basic, intermediate, advanced
    question: "問題文",
    options: ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
    correctAnswer: "正解の選択肢",
    explanation: "解説文",
    points: 10,
    timeLimit: 60
}
```

### スタイルのカスタマイズ

- `styles.css`でアニメーションやカスタムスタイルを変更
- `index.html`のTailwind CSSクラスで見た目を調整

## ライセンス

このプロジェクトはMITライセンスで公開されています。