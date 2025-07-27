// 問題データベース
const questionsDatabase = [
    // 決済システム - 初級
    {
        id: "ps_basic_001",
        type: "multiple_choice",
        category: "payment_systems",
        difficulty: "basic",
        question: "クレジットカード決済において、カード会社が加盟店に代金を支払うまでの期間を何というか？",
        options: ["決済サイクル", "入金サイクル", "キャッシュフロー", "売上確定期間"],
        correctAnswer: "入金サイクル",
        explanation: "入金サイクルとは、クレジットカード決済において、カード会社が加盟店に売上代金を支払うまでの期間のことです。通常、決済から数日〜1ヶ月程度かかります。",
        points: 10,
        timeLimit: 60
    },
    {
        id: "ps_basic_002",
        type: "multiple_choice",
        category: "payment_systems",
        difficulty: "basic",
        question: "オンライン決済で最も一般的に使用される暗号化プロトコルは？",
        options: ["HTTP", "SSL/TLS", "FTP", "SMTP"],
        correctAnswer: "SSL/TLS",
        explanation: "SSL/TLSは、インターネット上でデータを暗号化して送受信するプロトコルです。オンライン決済では必須のセキュリティ技術です。",
        points: 10,
        timeLimit: 60
    },
    {
        id: "ps_basic_003",
        type: "multiple_choice",
        category: "payment_systems",
        difficulty: "basic",
        question: "QRコード決済の主な利点として適切でないものは？",
        options: ["導入コストが低い", "非接触で決済可能", "オフラインでも利用可能", "スマートフォンで利用可能"],
        correctAnswer: "オフラインでも利用可能",
        explanation: "QRコード決済は基本的にインターネット接続が必要です。オフラインでの利用は一般的にできません。",
        points: 10,
        timeLimit: 60
    },

    // 決済システム - 中級
    {
        id: "ps_inter_001",
        type: "multiple_choice",
        category: "payment_systems",
        difficulty: "intermediate",
        question: "3Dセキュア2.0において、リスクベース認証で考慮される要素でないものは？",
        options: ["デバイス情報", "購入履歴", "位置情報", "カードの色"],
        correctAnswer: "カードの色",
        explanation: "3Dセキュア2.0のリスクベース認証では、デバイス情報、購入履歴、位置情報などを総合的に判断しますが、物理的なカードの色は関係ありません。",
        points: 15,
        timeLimit: 90
    },
    {
        id: "ps_inter_002",
        type: "multiple_choice",
        category: "payment_systems",
        difficulty: "intermediate",
        question: "トークナイゼーションの主な目的は？",
        options: ["決済速度の向上", "カード情報の保護", "手数料の削減", "国際決済の簡素化"],
        correctAnswer: "カード情報の保護",
        explanation: "トークナイゼーションは、実際のカード番号を別の値（トークン）に置き換えることで、カード情報を保護する技術です。",
        points: 15,
        timeLimit: 90
    },

    // 決済システム - 上級
    {
        id: "ps_adv_001",
        type: "multiple_choice",
        category: "payment_systems",
        difficulty: "advanced",
        question: "EMVCoが定めるQRコード決済の規格において、動的QRコードの有効期限として推奨される時間は？",
        options: ["30秒", "1分", "5分", "15分"],
        correctAnswer: "5分",
        explanation: "EMVCo規格では、セキュリティの観点から動的QRコードの有効期限を5分程度に設定することが推奨されています。",
        points: 20,
        timeLimit: 120
    },

    // セキュリティ - 初級
    {
        id: "sec_basic_001",
        type: "multiple_choice",
        category: "security",
        difficulty: "basic",
        question: "PCI DSSとは何の略称か？",
        options: [
            "Payment Card Industry Data Security Standard",
            "Personal Card Information Data Safety Standard",
            "Payment Credit Industry Digital Security Standard",
            "Private Card Industry Data Safety Standard"
        ],
        correctAnswer: "Payment Card Industry Data Security Standard",
        explanation: "PCI DSSは、クレジットカード情報を安全に取り扱うための国際的なセキュリティ基準です。",
        points: 10,
        timeLimit: 60
    },
    {
        id: "sec_basic_002",
        type: "multiple_choice",
        category: "security",
        difficulty: "basic",
        question: "二要素認証に含まれない要素は？",
        options: ["知識情報（パスワード）", "所持情報（スマートフォン）", "生体情報（指紋）", "購入履歴"],
        correctAnswer: "購入履歴",
        explanation: "二要素認証は、知識情報、所持情報、生体情報の3つの要素から2つを組み合わせる認証方式です。購入履歴は認証要素には含まれません。",
        points: 10,
        timeLimit: 60
    },

    // セキュリティ - 中級
    {
        id: "sec_inter_001",
        type: "multiple_choice",
        category: "security",
        difficulty: "intermediate",
        question: "カード情報非保持化において、訂正対象とならない情報は？",
        options: ["カード番号", "有効期限", "セキュリティコード", "カード会社名"],
        correctAnswer: "カード会社名",
        explanation: "カード情報非保持化では、カード番号、有効期限、セキュリティコードの保持が制限されますが、カード会社名は機密情報に該当しません。",
        points: 15,
        timeLimit: 90
    },

    // 法規制 - 初級
    {
        id: "reg_basic_001",
        type: "multiple_choice",
        category: "regulations",
        difficulty: "basic",
        question: "日本における電子マネーの供託金制度で、前払式支払手段発行者が供託すべき金額の割合は？",
        options: ["発行残高の25%以上", "発行残高の50%以上", "発行残高の75%以上", "発行残高の100%"],
        correctAnswer: "発行残高の50%以上",
        explanation: "資金決済法により、前払式支払手段発行者は発行残高の50%以上を供託する義務があります。",
        points: 10,
        timeLimit: 60
    },
    {
        id: "reg_basic_002",
        type: "multiple_choice",
        category: "regulations",
        difficulty: "basic",
        question: "割賦販売法における加盟店の実行計画策定義務の対象となる事業者は？",
        options: ["すべての事業者", "カード情報を保持する事業者", "年商1億円以上の事業者", "上場企業のみ"],
        correctAnswer: "カード情報を保持する事業者",
        explanation: "割賦販売法では、カード情報を保持する事業者に対して実行計画の策定が義務付けられています。",
        points: 10,
        timeLimit: 60
    },

    // 法規制 - 中級
    {
        id: "reg_inter_001",
        type: "multiple_choice",
        category: "regulations",
        difficulty: "intermediate",
        question: "EUのPSD2（決済サービス指令2）で導入された強力な顧客認証（SCA）が免除される取引の上限額は？",
        options: ["30ユーロ", "50ユーロ", "100ユーロ", "250ユーロ"],
        correctAnswer: "30ユーロ",
        explanation: "PSD2では、30ユーロ以下の低額取引についてはSCAを免除することができます。",
        points: 15,
        timeLimit: 90
    },

    // フィンテック - 初級
    {
        id: "fin_basic_001",
        type: "multiple_choice",
        category: "fintech",
        difficulty: "basic",
        question: "ブロックチェーン技術の特徴として適切でないものは？",
        options: ["分散型台帳", "改ざん困難", "中央管理者が必要", "透明性が高い"],
        correctAnswer: "中央管理者が必要",
        explanation: "ブロックチェーンは分散型の技術であり、中央管理者を必要としないことが大きな特徴です。",
        points: 10,
        timeLimit: 60
    },
    {
        id: "fin_basic_002",
        type: "multiple_choice",
        category: "fintech",
        difficulty: "basic",
        question: "APIエコノミーにおいて、金融機関がAPIを公開する主な目的は？",
        options: ["システムの複雑化", "セキュリティの向上", "外部サービスとの連携", "コストの増加"],
        correctAnswer: "外部サービスとの連携",
        explanation: "APIを公開することで、外部のサービスやアプリケーションと連携し、新たな価値を創出することができます。",
        points: 10,
        timeLimit: 60
    },

    // フィンテック - 中級
    {
        id: "fin_inter_001",
        type: "multiple_choice",
        category: "fintech",
        difficulty: "intermediate",
        question: "組込型金融（Embedded Finance）の例として適切でないものは？",
        options: ["ECサイトでの後払い決済", "配車アプリ内での決済", "銀行窓口での預金", "会計ソフト内での融資申込"],
        correctAnswer: "銀行窓口での預金",
        explanation: "組込型金融は、非金融サービスの中に金融サービスを組み込むことを指します。銀行窓口での預金は従来型の金融サービスです。",
        points: 15,
        timeLimit: 90
    },
    {
        id: "fin_inter_002",
        type: "multiple_choice",
        category: "fintech",
        difficulty: "intermediate",
        question: "BNPL（Buy Now Pay Later）サービスの一般的な収益モデルは？",
        options: ["利用者からの金利収入のみ", "加盟店手数料のみ", "加盟店手数料と遅延損害金", "政府補助金"],
        correctAnswer: "加盟店手数料と遅延損害金",
        explanation: "BNPLサービスは主に加盟店からの手数料と、支払い遅延時の遅延損害金で収益を得ています。",
        points: 15,
        timeLimit: 90
    },

    // フィンテック - 上級
    {
        id: "fin_adv_001",
        type: "multiple_choice",
        category: "fintech",
        difficulty: "advanced",
        question: "CBDCにおけるホールセール型とリテール型の主な違いは？",
        options: ["発行主体", "利用者の範囲", "技術基盤", "法的位置づけ"],
        correctAnswer: "利用者の範囲",
        explanation: "ホールセール型CBDCは金融機関間の決済に限定され、リテール型は一般消費者も利用可能という違いがあります。",
        points: 20,
        timeLimit: 120
    },

    // 追加問題 - 決済システム初級
    {
        id: "ps_basic_004",
        type: "multiple_choice",
        category: "payment_systems",
        difficulty: "basic",
        question: "日本で最も利用されている電子マネーの規格は？",
        options: ["NFC-A", "NFC-B", "FeliCa", "QRコード"],
        correctAnswer: "FeliCa",
        explanation: "日本では、SuicaやPASMO、楽天Edyなど、多くの電子マネーがFeliCa規格を採用しています。",
        points: 10,
        timeLimit: 60
    },
    {
        id: "ps_basic_005",
        type: "multiple_choice",
        category: "payment_systems",
        difficulty: "basic",
        question: "コンビニ決済の仕組みとして正しいものは？",
        options: ["前払い方式のみ", "後払い方式のみ", "代金引換方式", "収納代行方式"],
        correctAnswer: "収納代行方式",
        explanation: "コンビニ決済は、コンビニエンスストアが事業者に代わって代金を収納する収納代行方式です。",
        points: 10,
        timeLimit: 60
    },
    {
        id: "ps_basic_006",
        type: "multiple_choice",
        category: "payment_systems",
        difficulty: "basic",
        question: "デビットカードの特徴として正しいものは？",
        options: ["利用と同時に口座から引き落とし", "翌月一括払い", "分割払いが可能", "与信審査が必要"],
        correctAnswer: "利用と同時に口座から引き落とし",
        explanation: "デビットカードは、利用と同時に銀行口座から即座に代金が引き落とされる仕組みです。",
        points: 10,
        timeLimit: 60
    },

    // 追加問題 - 決済システム中級
    {
        id: "ps_inter_003",
        type: "multiple_choice",
        category: "payment_systems",
        difficulty: "intermediate",
        question: "オーソリゼーションとクリアリングの違いとして正しいものは？",
        options: ["同じ処理を指す", "オーソリは承認、クリアリングは売上確定", "オーソリは売上確定、クリアリングは承認", "処理のタイミングが違うだけ"],
        correctAnswer: "オーソリは承認、クリアリングは売上確定",
        explanation: "オーソリゼーションは利用可能枠の確認と承認、クリアリングは実際の売上データの送信と確定処理です。",
        points: 15,
        timeLimit: 90
    },
    {
        id: "ps_inter_004",
        type: "multiple_choice",
        category: "payment_systems",
        difficulty: "intermediate",
        question: "PSP（Payment Service Provider）の主な役割でないものは？",
        options: ["複数の決済手段の提供", "決済データの管理", "カード発行", "不正検知"],
        correctAnswer: "カード発行",
        explanation: "PSPは決済サービスを提供する事業者で、カード発行はイシュアー（カード発行会社）の役割です。",
        points: 15,
        timeLimit: 90
    },

    // 追加問題 - 決済システム上級
    {
        id: "ps_adv_002",
        type: "multiple_choice",
        category: "payment_systems",
        difficulty: "advanced",
        question: "ISO20022における決済メッセージの構造として正しいものは？",
        options: ["固定長フォーマット", "CSV形式", "XML形式", "バイナリ形式"],
        correctAnswer: "XML形式",
        explanation: "ISO20022は、金融メッセージングの国際標準で、XML形式を採用して柔軟性と拡張性を実現しています。",
        points: 20,
        timeLimit: 120
    },

    // 追加問題 - セキュリティ初級
    {
        id: "sec_basic_003",
        type: "multiple_choice",
        category: "security",
        difficulty: "basic",
        question: "フィッシング詐欺の手口として一般的でないものは？",
        options: ["偽のメールを送信", "偽のWebサイトに誘導", "電話で直接情報を聞き出す", "ウイルスでPCを破壊"],
        correctAnswer: "ウイルスでPCを破壊",
        explanation: "フィッシング詐欺は個人情報を盗むことが目的で、PCを破壊することは一般的ではありません。",
        points: 10,
        timeLimit: 60
    },
    {
        id: "sec_basic_004",
        type: "multiple_choice",
        category: "security",
        difficulty: "basic",
        question: "CVVコードの保存について正しいものは？",
        options: ["暗号化すれば保存可能", "一時的なら保存可能", "いかなる場合も保存禁止", "加盟店の判断で保存可能"],
        correctAnswer: "いかなる場合も保存禁止",
        explanation: "PCI DSSでは、CVV（セキュリティコード）の保存は、いかなる場合も禁止されています。",
        points: 10,
        timeLimit: 60
    },

    // 追加問題 - セキュリティ中級
    {
        id: "sec_inter_002",
        type: "multiple_choice",
        category: "security",
        difficulty: "intermediate",
        question: "EMV 3DSにおけるフリクションレス認証の条件でないものは？",
        options: ["低リスク取引", "信頼できる受益者", "少額取引", "初回利用"],
        correctAnswer: "初回利用",
        explanation: "初回利用は通常リスクが高いと判断され、フリクションレス認証の対象にはなりません。",
        points: 15,
        timeLimit: 90
    },
    {
        id: "sec_inter_003",
        type: "multiple_choice",
        category: "security",
        difficulty: "intermediate",
        question: "不正利用検知システムで使用される機械学習の手法として適切でないものは？",
        options: ["異常検知", "分類", "回帰分析", "画像認識"],
        correctAnswer: "画像認識",
        explanation: "不正検知では主に異常検知、分類、回帰分析が使われ、画像認識は一般的ではありません。",
        points: 15,
        timeLimit: 90
    },

    // 追加問題 - セキュリティ上級
    {
        id: "sec_adv_001",
        type: "multiple_choice",
        category: "security",
        difficulty: "advanced",
        question: "ゼロトラストセキュリティモデルの決済システムへの適用で重要でない要素は？",
        options: ["継続的な認証", "最小権限の原則", "境界防御の強化", "デバイス信頼性の検証"],
        correctAnswer: "境界防御の強化",
        explanation: "ゼロトラストモデルは境界防御に依存せず、すべてのアクセスを信頼しないことが前提です。",
        points: 20,
        timeLimit: 120
    },

    // 追加問題 - 法規制初級
    {
        id: "reg_basic_003",
        type: "multiple_choice",
        category: "regulations",
        difficulty: "basic",
        question: "特定商取引法でクーリングオフが適用されない取引は？",
        options: ["訪問販売", "電話勧誘販売", "通信販売", "連鎖販売取引"],
        correctAnswer: "通信販売",
        explanation: "通信販売（ECサイトなど）には、法定のクーリングオフ制度は適用されません。",
        points: 10,
        timeLimit: 60
    },
    {
        id: "reg_basic_004",
        type: "multiple_choice",
        category: "regulations",
        difficulty: "basic",
        question: "本人確認法（犯罪収益移転防止法）で必要な確認事項でないものは？",
        options: ["氏名", "住所", "生年月日", "年収"],
        correctAnswer: "年収",
        explanation: "本人確認では氏名、住所、生年月日、職業などの確認が必要ですが、年収は必須ではありません。",
        points: 10,
        timeLimit: 60
    },

    // 追加問題 - 法規制中級
    {
        id: "reg_inter_002",
        type: "multiple_choice",
        category: "regulations",
        difficulty: "intermediate",
        question: "GDPRにおける個人データの域外移転で認められない方法は？",
        options: ["十分性認定", "標準契約条項（SCC）", "拘束的企業準則（BCR）", "個人の暗黙の同意"],
        correctAnswer: "個人の暗黙の同意",
        explanation: "GDPRでは域外移転には明示的な同意が必要で、暗黙の同意は認められません。",
        points: 15,
        timeLimit: 90
    },
    {
        id: "reg_inter_003",
        type: "multiple_choice",
        category: "regulations",
        difficulty: "intermediate",
        question: "日本の資金決済法における暗号資産交換業者の分別管理義務として正しいものは？",
        options: ["自己資産との分別管理のみ", "コールドウォレット保管95%以上", "信託による保全", "銀行預金での管理"],
        correctAnswer: "コールドウォレット保管95%以上",
        explanation: "暗号資産交換業者は、顧客の暗号資産の95%以上をコールドウォレットで管理する義務があります。",
        points: 15,
        timeLimit: 90
    },

    // 追加問題 - 法規制上級
    {
        id: "reg_adv_001",
        type: "multiple_choice",
        category: "regulations",
        difficulty: "advanced",
        question: "バーゼルⅢにおける流動性カバレッジ比率（LCR）の最低水準は？",
        options: ["80%", "90%", "100%", "110%"],
        correctAnswer: "100%",
        explanation: "バーゼルⅢでは、30日間のストレス下での資金流出に対応できる高品質流動資産を100%以上保有することが求められます。",
        points: 20,
        timeLimit: 120
    },

    // 追加問題 - フィンテック初級
    {
        id: "fin_basic_003",
        type: "multiple_choice",
        category: "fintech",
        difficulty: "basic",
        question: "ロボアドバイザーの主な機能は？",
        options: ["融資審査", "自動資産運用", "決済処理", "本人確認"],
        correctAnswer: "自動資産運用",
        explanation: "ロボアドバイザーは、AIやアルゴリズムを使って自動的に資産運用を行うサービスです。",
        points: 10,
        timeLimit: 60
    },
    {
        id: "fin_basic_004",
        type: "multiple_choice",
        category: "fintech",
        difficulty: "basic",
        question: "P2P送金サービスの特徴として正しくないものは？",
        options: ["個人間送金が簡単", "手数料が安い", "銀行口座が不要", "即時送金が可能"],
        correctAnswer: "銀行口座が不要",
        explanation: "多くのP2P送金サービスは、銀行口座やカードとの連携が必要です。",
        points: 10,
        timeLimit: 60
    },

    // 追加問題 - フィンテック中級
    {
        id: "fin_inter_003",
        type: "multiple_choice",
        category: "fintech",
        difficulty: "intermediate",
        question: "DeFi（分散型金融）の特徴として適切でないものは？",
        options: ["スマートコントラクトの活用", "中央管理者の不在", "KYC/AMLの徹底", "24時間365日取引可能"],
        correctAnswer: "KYC/AMLの徹底",
        explanation: "DeFiは分散型で匿名性が高く、従来の金融のようなKYC/AMLは一般的に実施されません。",
        points: 15,
        timeLimit: 90
    },
    {
        id: "fin_inter_004",
        type: "multiple_choice",
        category: "fintech",
        difficulty: "intermediate",
        question: "レグテック（RegTech）の主な活用分野でないものは？",
        options: ["コンプライアンス自動化", "リスク管理", "マーケティング最適化", "規制報告"],
        correctAnswer: "マーケティング最適化",
        explanation: "レグテックは規制対応技術で、コンプライアンス、リスク管理、規制報告などに活用されます。",
        points: 15,
        timeLimit: 90
    },

    // 追加問題 - フィンテック上級
    {
        id: "fin_adv_002",
        type: "multiple_choice",
        category: "fintech",
        difficulty: "advanced",
        question: "ステーブルコインの担保方式で、アルゴリズム型の課題として最も重要なものは？",
        options: ["スケーラビリティ", "相互運用性", "価格安定性の維持", "規制対応"],
        correctAnswer: "価格安定性の維持",
        explanation: "アルゴリズム型ステーブルコインは、市場の急変時に価格安定性を維持することが最大の課題です。",
        points: 20,
        timeLimit: 120
    },
    {
        id: "fin_adv_003",
        type: "multiple_choice",
        category: "fintech",
        difficulty: "advanced",
        question: "量子コンピュータが決済システムに与える影響として最も懸念されるものは？",
        options: ["処理速度の低下", "暗号技術の脆弱化", "電力消費の増大", "互換性の喪失"],
        correctAnswer: "暗号技術の脆弱化",
        explanation: "量子コンピュータは現在の暗号技術を破る可能性があり、量子耐性暗号への移行が必要とされています。",
        points: 20,
        timeLimit: 120
    }
];

// 問題管理クラス
class QuestionManager {
    constructor(questions) {
        this.questions = questions;
    }

    // カテゴリと難易度でフィルタリング
    filterQuestions(category, difficulty) {
        return this.questions.filter(q => {
            const categoryMatch = category === 'all' || q.category === category;
            const difficultyMatch = q.difficulty === difficulty;
            return categoryMatch && difficultyMatch;
        });
    }

    // ランダムに問題を選択
    selectRandomQuestions(category, difficulty, count) {
        const filtered = this.filterQuestions(category, difficulty);
        const shuffled = this.shuffle([...filtered]);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    // 配列をシャッフル
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // カテゴリ名を日本語に変換
    getCategoryName(category) {
        const names = {
            'payment_systems': '決済システム',
            'security': 'セキュリティ',
            'regulations': '法規制',
            'fintech': 'フィンテック'
        };
        return names[category] || category;
    }

    // 難易度名を日本語に変換
    getDifficultyName(difficulty) {
        const names = {
            'basic': '初級',
            'intermediate': '中級',
            'advanced': '上級'
        };
        return names[difficulty] || difficulty;
    }
}