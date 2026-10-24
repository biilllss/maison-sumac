import type { Lang } from "./translations";

/* ------------------------------------------------------------------ */
/*  Menu data — 4 categories × 5 items, fully bilingual.               */
/*  `favorite` renders the terracotta "House favorite" badge.          */
/*  `tags` feeds the dietary filter chips (Vegetarian / Vegan / GF).   */
/*  Prices are USD.                                                    */
/* ------------------------------------------------------------------ */

export type DietaryTag = "vegetarian" | "vegan" | "glutenFree";

export type MenuItem = {
  id: string;
  name: Record<Lang, string>;
  desc: Record<Lang, string>;
  price: number;
  favorite?: boolean;
  tags?: DietaryTag[];
};

export type MenuCategory = {
  id: "breakfast" | "coffee" | "mains" | "desserts";
  items: MenuItem[];
};

/**
 * Menu revision stamp. Bump this whenever dishes, prices or stories
 * change — the menu section compares it against the copy stored in
 * localStorage and greets returning visitors with a "the menu changed"
 * nudge (dismissed once, then the new version is remembered).
 */
export const MENU_VERSION = "2026-10-r13";

export const MENU: MenuCategory[] = [
  {
    id: "breakfast",
    items: [
      {
        id: "labneh-toast",
        name: { en: "Za'atar & Labneh Toast", ar: "توست اللبنة والزعتر" },
        desc: {
          en: "Grilled sourdough, strained labneh, cold-pressed olive oil, wild za'atar.",
          ar: "خبز محمص، لبنة بلدية مصفّاة، زيت زيتون بارد، وزعتر بري.",
        },
        story: {
          en: "Our labneh travels from a small Beqaa dairy and gets one extra night of straining here, until it stands like soft snow. The za'atar is wild-picked and mixed with sesame at the shop — the toast gets pressed until the edges crackle.",
          ar: "لبنتنا بتيجي من موزعة صغيرة بالبقاع ومنصفّيها هون ليلة زيادة لوقت بوقف متل الثلج الناعم. الزعتر بري ومنخلطو بالسمسم عندنا، والخبز بنتصوصو لوقت أطرافو تعقرق.",
        },
        price: 7.0,
        favorite: true,
        tags: ["vegetarian"],
      },
      {
        id: "akkawi-manakish",
        name: { en: "Akkawi Cheese Manakish", ar: "منقوشة جبنة عكاوي" },
        desc: {
          en: "Straight from the wood oven, with tomato and fresh mint.",
          ar: "من الفرن على طول، مع طماطم ونعناع طازة.",
        },
        story: {
          en: "The cheese is desalted here overnight, stretched over our 24-hour dough by hand, then straight into the wood oven for ninety seconds. Tomato and fresh mint after the bake — never before.",
          ar: "الجبنة مننقّيها هون ليلة كاملة، منبسطها يدوي عالعجينة اللي راقدة يوم كامل، ومنخبّطها عالفرن تسعين ثانية. الطماطم والنعناع بعد الفرن — عمرنا قبلو.",
        },
        price: 6.5,
        tags: ["vegetarian"],
      },
      {
        id: "shakshuka",
        name: { en: "Shakshuka Sumac", ar: "شكشوكة سماق" },
        desc: {
          en: "Eggs in sumac-spiced tomato, sesame flatbread for dipping.",
          ar: "بيض بصوص طماطم بالسماق، مع خبز سمسم للغمس.",
        },
        story: {
          en: "Slow-cooked tomatoes with a spoon of our sumac blend, then the eggs go in and cook in the same pan. Order it with extra sesame flatbread — you will want to wipe the pan clean.",
          ar: "طماطم مطبوخة على مهل مع معلقة خلطة السماق تبعنا، وبعدين البيض بيدخل بنفس المقلة. اطلبها بخبز سمسم زيادة — رح بدك تمسح المقلة كاملة.",
        },
        price: 9.0,
        favorite: true,
        tags: ["vegetarian"],
      },
      {
        id: "pancakes",
        name: { en: "Ricotta & Honey Pancakes", ar: "بانكيك ريكوتا وعسل" },
        desc: {
          en: "Cloud-light stacks, thyme honey, toasted walnuts, seasonal fruit.",
          ar: "بانكيك خفيف، عسل الزعتر، جوز محمّص، وفواكه الموسم.",
        },
        story: {
          en: "Ricotta folded into the batter keeps them cloud-light, and the thyme honey comes from a beekeeper we visit every October. Walnuts are toasted each morning; fruit is whatever the market had at 6am.",
          ar: "الريكوتا منطويها بالعجينة لتضل خفيفة متل الغيمة، وعسل الزعتر من نحّال منزورو كل تشرين. الجوز منحمصو كل صبح، والفواكه اللي تكون بالسوق الساعة ستة.",
        },
        price: 9.5,
        tags: ["vegetarian"],
      },
      {
        id: "granola",
        name: { en: "Sumac Granola Bowl", ar: "غرانيولا سماق" },
        desc: {
          en: "House granola, labneh yogurt, orange-blossom water, berries.",
          ar: "غرانيولا بتاعتنا، زبادي، ماء زهر الليمون، وبيري.",
        },
        story: {
          en: "We bake trays of it twice a week — oats, honey, olive oil and a handful of sumac berries. The labneh yogurt on top is strained here, and the orange-blossom water is from our neighbor's still.",
          ar: "منعملها بصينيتين بالأسبوع — شوفان، عسل، زيت زيتون، وحبة سماق. الزبادي اللي فوق منصفّيه عندنا، وماء زهر الليمون من مقطّع جيرانا.",
        },
        price: 7.5,
        tags: ["vegetarian"],
      },
    ],
  },
  {
    id: "coffee",
    items: [
      {
        id: "turkish",
        name: { en: "Turkish Coffee", ar: "قهوة تركية" },
        desc: {
          en: "Slow-brewed on hot sand, served with a piece of Turkish delight.",
          ar: "مطبوخة عالرمل، مع قطعة راحة الحلقوم.",
        },
        story: {
          en: "Ground fine as flour, brewed on hot sand the old way — never rushed, never boiled over. Your fortune is in the cup, if you believe in that. We do.",
          ar: "مطحونة ناعمة متل الدقيق ومطبوخة عالرمل عالأصول — بلا استعجال وبلا تغليان. حظك بالفنجان إذا بتفاول — نحنا منفاول.",
        },
        price: 3.5,
        tags: ["vegan", "glutenFree"],
      },
      {
        id: "flat-white",
        name: { en: "Flat White", ar: "فلات وايت" },
        desc: {
          en: "Double shot, silky micro-foam, beans roasted up the coast.",
          ar: "شوت دوبل، رغوة ناعمة، وحبوب محمّصة قريب منّا.",
        },
        story: {
          en: "A double shot of our seasonal espresso, cut with steamed milk at exactly 55 degrees. The beans roast 40 minutes up the coast and land with us the same week.",
          ar: "شوت دوبل من الإسبريسو الموسمي، مع حليب مبخّر على خمسة وخمسين درجة بالظبط. الحبوب بتنحمص أربعين دقيقة عالساحل وبتوصلنا بنفس الأسبوع.",
        },
        price: 4.0,
        tags: ["vegetarian", "glutenFree"],
      },
      {
        id: "cardamom-latte",
        name: { en: "Cardamom Latte", ar: "لاتيه بالهال" },
        desc: {
          en: "Our signature: espresso, steamed milk, crushed green cardamom.",
          ar: "تخصصنا: إسبريسو، حليب مبخّر، وهال أخضر مدقوق.",
        },
        story: {
          en: "Green cardamom pods crushed in a brass mortar every morning — the smell alone brings people in. Silky steamed milk over a double shot, dusted with a whisper of ground cardamom.",
          ar: "حبات الهال الأخضر مندقّها بالمهبش النحاس كل صبح — الريحة لحالها بتجيب الناس. حليب مبخّر ناعم فوق شوت دوبل، ورشة هال مطحون فوقها.",
        },
        price: 4.5,
        favorite: true,
        tags: ["vegetarian", "glutenFree"],
      },
      {
        id: "sumac-lemonade",
        name: { en: "Iced Sumac Lemonade", ar: "ليموناضة سماق مثلّجة" },
        desc: {
          en: "Squeezed to order, sumac syrup, mint from the terrace pots.",
          ar: "معصورة وقت الطلب، شراب سماق، ونعناع من أصص التراس.",
        },
        story: {
          en: "Sumac steeped like tea, sweetened lightly, then poured over hand-squeezed lemon juice and ice. The mint comes from the pots on the terrace — literally picked to order.",
          ar: "السماق مننقعه متل الشاي، منحلّيه خفيف، ومنصبّه فوق ليمون معصور يدوي مع الثلج. النعناع من أصص التراس — منقطفها وقت الطلب صراحة.",
        },
        price: 4.5,
        favorite: true,
        tags: ["vegan", "glutenFree"],
      },
      {
        id: "jallab",
        name: { en: "Jallab or Mint Lemonade", ar: "جلاب أو ليموناضة بالنعناع" },
        desc: {
          en: "Old-school jallab with pine nuts, or lemonade blended with ice.",
          ar: "جلاب على الأصول مع صنوبر، أو ليموناضة مضروبة مع الثلج.",
        },
        story: {
          en: "Jallab the old-school way: date molasses and carob, rose water, pine nuts floating on top. Or the mint lemonade — blended with so much ice it comes out like snow.",
          ar: "الجلاب عالأصول: دبس تمر وخروب، ماء ورد، وصنوبر عا وجه. أو الليموناضة بالنعناع — منضربها بثلج كتير لوقت بتيجي متل الثلج.",
        },
        price: 4.0,
        tags: ["vegan", "glutenFree"],
      },
    ],
  },
  {
    id: "mains",
    items: [
      {
        id: "shawarma",
        name: { en: "Chicken Shawarma Wrap", ar: "شاورما دجاج" },
        desc: {
          en: "Garlic toum, pickles, sumac onions, hand-cut fries inside.",
          ar: "ثوم، مخلل، بصل بالسماق، وصاص مقطّع يدوي جوّا.",
        },
        story: {
          en: "Chicken marinated overnight in yogurt, sumac and garlic, stacked on the vertical spit at dawn. Toum is whipped fresh daily; the fries go inside the wrap — yes, inside.",
          ar: "الدجاج بينقل باللبن والسماق والثوم طول الليل، وبينرص عالسيخ الفجر. الثوم منضربو طازة كل يوم، والصاص بيروح جوّا باللفة — إيه، جوّا.",
        },
        price: 9.0,
        favorite: true,
      },
      {
        id: "halloumi",
        name: { en: "Halloumi & Za'atar Sandwich", ar: "ساندويش حلوم وزعتر" },
        desc: {
          en: "Grilled halloumi, za'atar oil, tomato, in folded markouk bread.",
          ar: "حلوم مشوي، زيت زعتر، طماطم، بخبز مرقوق.",
        },
        story: {
          en: "Halloumi from the Moukhtara hills, grilled until it squeaks, then tucked into folded markouk bread with za'atar oil and ripe tomato. Pressed on the plancha so the bread turns golden.",
          ar: "حلوم من تلال المغتارة، منشويه لوقت بطقطق، ومنلفّه بخبز مرقوق مع زيت زعتر وطماطم مية. منصوصو عالصاج ليصير الخبز دهبي.",
        },
        price: 8.5,
        tags: ["vegetarian"],
      },
      {
        id: "falafel",
        name: { en: "Falafel Pocket", ar: "جيب فلافل" },
        desc: {
          en: "Herby falafel, tahini, tomato, pickled turnip — fried to order.",
          ar: "فلافل بالأعشاب، طحينة، طماطم، ولفت مخلل — مقلية وقت الطلب.",
        },
        story: {
          en: "Chickpeas soaked with fava and a fistful of parsley and coriander, ground daily and fried to order — never reheated. The pickled turnip is our own, and it stains everything pink.",
          ar: "الحمّص بينقع مع الفول وحبقة بقدوس وكزبرة، منطحنو كل يوم ومنقليه وقت الطلب — عمرنا بنسخنو. اللفت المخلل تبعنا عندنا، وبوحّر كل شي وردي.",
        },
        price: 7.5,
        tags: ["vegan"],
      },
      {
        id: "sumac-chicken",
        name: { en: "Sumac Chicken Plate", ar: "صحن دجاج بالسماق" },
        desc: {
          en: "Charred sumac chicken over smoky freekeh, garlic yogurt.",
          ar: "دجاج مشوي بالسماق عالفريكة، مع لبن بالثوم.",
        },
        story: {
          en: "Chicken under a crust of sumac and onion, charred over charcoal, laid on freekeh that has been smoked with wood chips. Garlic yogurt on the side — non-negotiable.",
          ar: "دجاج بقشرة سماق وبصل، مشوي عالفحم، مرصوص عالفريكة اللي منفحمها بالحطب. لبن بالثوم عالجنب — ما منتناقش بها.",
        },
        price: 13.0,
      },
      {
        id: "freekeh-bowl",
        name: { en: "Roasted Veggie Freekeh Bowl", ar: "بول فريكة بخضار مشوية" },
        desc: {
          en: "Freekeh, roasted squash, pomegranate, tahini drizzle, dukkah.",
          ar: "فريكة، قرع مشوي، رمّان، طحينة، ودقّة.",
        },
        story: {
          en: "Young green freekeh, roasted squash, pomegranate seeds from the North, a tahini drizzle and a spoon of dukkah. Vegan without trying to be — it is just how we cook.",
          ar: "فريكة خضرا صغيرة، قرع مشوي، رمّان من الشمال، طحينة، ومعلقة دقّة. نباتي بلا قصد — هيك طبخنا من أول.",
        },
        price: 11.0,
        tags: ["vegan"],
      },
    ],
  },
  {
    id: "desserts",
    items: [
      {
        id: "knefe",
        name: { en: "Mini Knefe", ar: "كنافة صغيرة" },
        desc: {
          en: "Sweet cheese, semolina crust, orange-blossom syrup, sesame bread.",
          ar: "جبنة حلوة، عجلة سميد، قطر بزهر الليمون، وخبز سمسم.",
        },
        story: {
          en: "Sweet melted cheese under a golden semolina crust, soaked in orange-blossom syrup and pressed into sesame bread. Cut to order — the cheese must still stretch.",
          ar: "جبنة حلوة مذوبة تحت قشرة سميد دهبية، مبلولة بقطر زهر الليمون ومضغوطة بخبز سمسم. منقطعها وقت الطلب — لازم الجبنة لسا بتشد.",
        },
        price: 6.0,
        favorite: true,
        tags: ["vegetarian"],
      },
      {
        id: "baklava",
        name: { en: "Baklava Trio", ar: "بقلاوة" },
        desc: {
          en: "Pistachio, walnut and cashew pieces, from the Bashoura counter.",
          ar: "فستق، جوز، وكاجو، من عند حلو الباشورة.",
        },
        story: {
          en: "Forty layers of filo brushed with clarified butter, filled with pistachio from the South and walnuts from the Beqaa. From the same Bashoura counter every morning, before six.",
          ar: "أربعين طبقة رقاق بمسحة سمنة مصفّاة، مع فستق من الجنوب وجوز من البقاع. من نفس كونتر حلو الباشورة كل صبح، قبل السادسة.",
        },
        price: 5.5,
        tags: ["vegetarian"],
      },
      {
        id: "date-cookie",
        name: { en: "Date & Tahini Cookie", ar: "كوك التمر والطحينة" },
        desc: {
          en: "Soft-baked, kneaded with molasses dates — vegan, actually great.",
          ar: "طري، معجون بتمر الديبس — نباتي وصراحة بينسى.",
        },
        story: {
          en: "Soft-baked with date molasses kneaded right into the dough, plus a little tahini for depth. Vegan — and honestly nobody notices until we tell them.",
          ar: "طري، معجون بديبس التمر من جوّا العجينة، وشوية طحينة لتعمّق الطعم. نباتي — وبصراحة حدا ما بيلاحظ لوقت منحكي.",
        },
        price: 3.5,
        tags: ["vegan"],
      },
      {
        id: "sahlab",
        name: { en: "Sahlab Cream Cup", ar: "كوب صهلاب" },
        desc: {
          en: "Warm winter drink, topped with pistachio, cinnamon and coconut.",
          ar: "مشروب شتوي دافي، مع فستق، قرفة، وجوز هند.",
        },
        story: {
          en: "The winter cup: warm milk thickened until it coats the spoon, topped with pistachio, cinnamon and coconut. Beirut winters are short — we serve it while it lasts.",
          ar: "كوب الشتا: حليب دافي منثخن لوقت يغطي المعالقة، وفوقه فستق وقرفة وجوز هند. الشتا بيروت قصير — منقدمو ما دام في.",
        },
        price: 5.0,
        tags: ["vegetarian", "glutenFree"],
      },
      {
        id: "basbousa",
        name: { en: "Pistachio Basbousa", ar: "بسيمة بالفستق" },
        desc: {
          en: "Semolina cake soaked in light syrup, a blanket of pistachio.",
          ar: "كيك سميد مبلول بقطر خفيف، وغطا فستق.",
        },
        story: {
          en: "Coarse semolina, yogurt, a brush of light syrup — never soggy — and a blanket of pistachio on top. Cut into diamonds, like every Lebanese grandmother insists.",
          ar: "سميد خشين، زبادي، ومسحة قطر خفيف — عمرنا بنبلّلو — وغطا فستق فوق. منقطعها معين، متل ما كل تيكة لبنانية بتفرض.",
        },
        price: 4.5,
        tags: ["vegetarian"],
      },
    ],
  },
];
