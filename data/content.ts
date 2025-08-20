import { type AppData } from '../types';
import { levelOneData } from './levels/level_1';

export const appData: AppData = {
  app: {
    name: "من أرحنا منها إلى أرحنا بها",
    locale: "ar",
    rtl: true,
  },
  levels: [
    levelOneData,
    {
      level_id: 2,
      title: "أداءٌ صحيح ظاهرًا مع شرود القلب",
      is_unlocked: false,
      teaser: "هنا، ستنتقل من صحة الأداء الظاهري إلى تنظيم شرود ذهنك خطوة بخطوة.",
      units: [],
    },
    {
      level_id: 3,
      title: "مجاهدة الوساوس مع تقلّب الحضور",
      is_unlocked: false,
      teaser: "هنا ستتعلم أدوات عملية للتعامل مع الوساوس والأفكار المقتحمة أثناء صلاتك.",
      units: [],
    },
    {
      level_id: 4,
      title: "التركيز على إتمام الصلاة ظاهرًا وباطنًا",
      is_unlocked: false,
      teaser: "هذه مرحلة بناء تركيزك المستمر، من التكبير إلى التسليم.",
      units: [],
    },
    {
      level_id: 5,
      title: "حضور القلب وفهم معاني الأقوال",
      is_unlocked: false,
      teaser: "ستغوص في معاني الفاتحة والأذكار، وتحولها من مجرد كلمات إلى مشاعر حية.",
      units: [],
    },
    {
      level_id: 6,
      title: "التأثر والوجدان الروحي بمعاني الصلاة",
      is_unlocked: false,
      teaser: "هنا يتجاوز حضورك الذهني إلى التأثر القلبي وبداية استشعار لذة المناجاة.",
      units: [],
    },
    {
      level_id: 7,
      title: "التعظيم والهيبة وإجلال مقام الله",
      is_unlocked: false,
      teaser: "كيف تستشعر عظمة من تقف أمامه، مما يورث قلبك هيبة وسكينة.",
      units: [],
    },
    {
      level_id: 8,
      title: "الرجاء والتعلق برحمة الله وشوق ثوابه",
      is_unlocked: false,
      teaser: "ستتحول صلاتك إلى لحظة رجاء وشوق لما عند <strong>الله</strong> من فضل ورحمة.",
      units: [],
    },
    {
      level_id: 9,
      title: "الأنس والطمأنينة بلقاء الله في الصلاة",
      is_unlocked: false,
      teaser: "ستصبح الصلاة واحة روحك ومصدر أنسك الذي تهرب إليه من شتات الدنيا.",
      units: [],
    },
    {
      level_id: 10,
      title: "المحبة والشوق إلى الله ولقائه",
      is_unlocked: false,
      teaser: "هذا مقام المحبين الذين يشتاقون للصلاة كما يشتاق المحب للقاء حبيبه.",
      units: [],
    },
    {
      level_id: 11,
      title: "مرتبة المراقبة",
      is_unlocked: false,
      teaser: "ستستشعر أن <strong>الله</strong> يراك في كل لحظة من صلاتك، مما يورثك كمال الإحسان.",
      units: [],
    },
    {
      level_id: 12,
      title: "مقام المشاهدة",
      is_unlocked: false,
      teaser: "أعلى المراتب، حيث يكاد قلبك يرى بنور بصيرته عظمة <strong>الله</strong> وجلاله.",
      units: [],
    },
  ],
};
