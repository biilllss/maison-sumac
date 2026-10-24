/* ------------------------------------------------------------------ */
/*  Translations — ONE object for every word on the page.              */
/*  English is the source; Arabic is written as natural, simple        */
/*  Levantine-flavoured copy for Lebanese customers — never a literal  */
/*  translation of the English strings.                                */
/* ------------------------------------------------------------------ */

export type Lang = "en" | "ar";

export const translations = {
  /* ============================== EN ============================== */
  en: {
    meta: { htmlLang: "en", dir: "ltr" as const },

    brand: {
      name: "Maison Sumac",
      arabicName: "ميزون سماق",
      tagline: "Café & brunch · Gemmayzeh, Beirut",
    },

    nav: {
      story: "Our story",
      menu: "Menu",
      gallery: "Gallery",
      reviews: "Reviews",
      visit: "Find us",
      reserve: "Reserve",
      openMenu: "Open navigation menu",
      closeMenu: "Close navigation menu",
      skipToContent: "Skip to content",
    },

    langToggle: {
      label: "Switch language",
      en: "EN",
      ar: "AR",
    },

    conceptBadge: {
      en: "Concept project by Mawqe3 Studio",
      ar: "مشروع تصوري من ستوديو موقع",
    },

    sound: {
      label: "Terrace ambience",
      enable: "Play the terrace sounds",
      disable: "Stop the terrace sounds",
    },

    hero: {
      overline: "Specialty café & brunch — Beirut",
      title: "Slow mornings,",
      titleAccent: "Lebanese style.",
      sub: "Wood-oven manakish, specialty coffee and a sun-washed terrace in the heart of Gemmayzeh. Come hungry, leave slowly.",
      reserveCta: "Reserve on WhatsApp",
      menuCta: "See the menu",
      openBadge:
        "Open daily from 7:30 on weekdays, 8:00 on weekends",
      phase: {
        day: "Sun-washed terrace right now",
        night: "Lantern-lit terrace right now",
      },
      picks: {
        label: "The kitchen recommends right now",
        with: "with",
        addBoth: "Add both",
        added: "Both in your order",
      },
      imageAlt: "Sunlit café interior at Maison Sumac with wooden tables and plants",
      imageAltNight: "Maison Sumac terrace glowing with warm lantern light in the evening",
      imageAltSecondary: "Flat white with latte art on a wooden table",
    },

    story: {
      overline: "Our story",
      title: "A wood oven, a terrace, and no rush at all",
      body: "Maison Sumac started with a wood-fired oven, a courtyard of bougainvillea, and one simple idea: Beirut deserves a café where time moves a little slower. Every morning we bake our manakish fresh, brew beans roasted just up the coast, and squeeze lemonade to order. Come for breakfast — stay for the light.",
      imageAlt: "Barista preparing coffee behind the counter at Maison Sumac",
      caption: "The counter, most mornings before 8am",
      stats: [
        { value: "2019", label: "est. in Gemmayzeh" },
        { value: "40+", label: "terrace & indoor seats" },
        { value: "12", label: "coffee origins on the shelf" },
      ],
    },

    menu: {
      overline: "The menu",
      title: "Made this morning, priced in kindness",
      sub: "Everything is prepared in-house daily. Prices in USD — we also take liras at the day's rate.",
      orderCta: "Order on WhatsApp",
      favorite: "House favorite",
      note: "Baked and brewed in-house, every day.",
      categories: {
        breakfast: "Breakfast",
        coffee: "Coffee & Drinks",
        mains: "Sandwiches & Mains",
        desserts: "Desserts",
      },
      filters: {
        label: "Filter the menu",
        all: "Everything",
        vegetarian: "Vegetarian",
        vegan: "Vegan",
        glutenFree: "Gluten-free",
        empty:
          "Nothing here matches — but we can probably still make it. Ask us on WhatsApp.",
      },
      search: {
        label: "Search the menu",
        placeholder: "Search dishes — try “manakish”",
        clear: "Clear search",
        found: (n: number) => (n === 1 ? "1 dish found" : `${n} dishes found`),
        empty: (q: string) =>
          `Nothing matches “${q}” — ask us on WhatsApp, we love a challenge.`,
      },
      popular: "Popular now",
      recent: {
        label: "Recently viewed",
        clear: "Clear recently viewed",
      },
      printCta: "Print the menu",
      details: {
        storyTitle: "The story",
        close: "Close dish details",
        inGallery: "See it in the gallery",
        share: "Share this dish",
        copied: "Link copied",
      },
      dishNav: {
        prev: "Previous dish",
        next: "Next dish",
        inOrder: "in your order",
      },
      changed: {
        body: "Our menu changed since your last visit — the kitchen's been busy.",
        dismiss: "Dismiss",
        prices: "Prices that changed:",
        news: "New on the menu:",
        more: (n: number) => `+${n} more`,
      },
      now: {
        label: "Right now",
        seeNow: "Show them",
        breakfast: "Breakfast hour — the wood oven is at its best.",
        coffee: "Coffee-run o'clock — the second machine just hummed on.",
        mains: "Lunch hour — the grill is firing again.",
        desserts: "Sweet hour — today's knefe is still warm.",
      },
    },

    sumac: {
      overline: "The name on the door",
      word: "سماق",
      wordLabel: "The word sumac (سماق) drawn in Arabic calligraphy",
      translit: "sam·aq — noun · a red berry, a tree, a house",
      sub: "We took our name from the little red berry that seasons everything we love.",
      meanings: [
        {
          ar: "بهارة",
          title: "The spice",
          body:
            "Crimson and lemony, ground fresh every week and dusted over eggs, fries and salads — never missing from our tables.",
        },
        {
          ar: "شجرة",
          title: "The tree",
          body:
            "Wild across Lebanese hillsides, rust-red every autumn. There's one in our courtyard, older than the lease.",
        },
        {
          ar: "دار",
          title: "The house",
          body:
            "The spirit we borrowed the name for: sharp, warm and unhurried — Beirut hospitality with a lemony edge.",
        },
      ],
    },

    gallery: {
      overline: "Gallery",
      title: "A regular morning, in pictures",
      viewDish: "View dish — opens the menu story",
      captions: [
        "Za'atar & labneh toast",
        "The terrace at 9am",
        "Flat white, always",
        "Fresh manakish batch",
        "Mezze for sharing",
        "Knefe, cut to order",
      ],
      alts: [
        "Toasted sourdough with labneh, olive oil and za'atar",
        "Shaded café terrace with wooden chairs and plants",
        "Flat white coffee with latte art on a wooden table",
        "Freshly baked manakish flatbreads on a tray",
        "Colourful mezze plates spread across a table",
        "Slice of knefe dessert drizzled with syrup",
      ],
    },

    features: {
      overline: "Why people love it",
      title: "Three reasons mornings end up here",
      items: [
        {
          title: "Fresh, every day",
          body: "Manakish, knefe and pastries leave the oven each morning. Nothing sits overnight — ever.",
        },
        {
          title: "A cozy terrace",
          body: "A shaded courtyard with olive pots and birdsong. The quietest corner of Gemmayzeh, honestly.",
        },
        {
          title: "Work-friendly",
          body: "Fast Wi-Fi, plugs at most tables, and coffee that politely refills itself.",
        },
      ],
    },

    reviews: {
      overline: "Reviews",
      title: "What the regulars say",
      items: [
        {
          quote:
            "The labneh toast and cardamom latte are unreal. I've officially moved my entire morning routine here.",
          name: "Nour K.",
          place: "Mar Mikhael",
        },
        {
          quote:
            "Best terrace in Gemmayzeh. Fast Wi-Fi, calm playlist, and nobody ever rushes you. My office away from office.",
          name: "Jad A.",
          place: "Achrafieh",
        },
        {
          quote:
            "Came for the knefe, stayed for the people. It feels like breakfast at a friend's place — if your friend could actually cook.",
          name: "Maya S.",
          place: "Hamra",
        },
      ],
    },

    visit: {
      overline: "Location & hours",
      title: "Find us in Gemmayzeh",
      addressLabel: "Address",
      hoursLabel: "Opening hours",
      directionsCta: "Get directions",
      whatsappLabel: "WhatsApp",
      mapPreview: "Map preview",
      mapNote: "Two minutes from the Gemmayzeh stairs — look for the olive-green door.",
      mapAlt: "Map placeholder — Maison Sumac location in Gemmayzeh",
      mapStreets: ["GEMMAYZE ST.", "RUE GOURAUD", "RUE DU LIBAN"],
      hours: [
        { day: "Monday – Friday", time: "7:30 — 18:00" },
        { day: "Saturday – Sunday", time: "8:00 — 19:00" },
        { day: "Kitchen closes", time: "30 min before" },
      ],
    },

    status: {
      openNow: "Open now — closes {time}",
      closedNow: "Closed — opens {time}",
    },

    orderTray: {
      label: "Your order",
      empty: "Nothing here yet — add something delicious from the menu.",
      clear: "Clear all",
      send: "Send order on WhatsApp",
      total: "Total",
      note: "Pay at the counter or on delivery.",
      pairingChip: "kitchen's pairing",
      pairingNote: "(the kitchen's pairing — as recommended today)",
      detailsToggle: "Add your name or a note",
      nameLabel: "Your name",
      namePlaceholder: "Layla",
      noteLabel: "A note for the kitchen",
      notePlaceholder: "Extra za'atar, well-done…",
      seeYou: "See you soon!",
      add: "Add to order",
      addItem: (name: string) => `Add ${name} to your order`,
      incItem: "Add one more",
      decItem: "Remove one",
      close: "Close order summary",
    },

    booking: {
      title: "Pick your moment",
      when: "Day",
      today: "Today",
      tomorrow: "Tomorrow",
      time: "Time",
      guests: "Guests",
      guestWord: (n: number) => (n === 1 ? "guest" : "guests"),
      nameLabel: "Your name",
      namePlaceholder: "Layla",
      nameHint: "The same name signs your orders — we keep it on file.",
      slotsGone:
        "Today's times have all passed — showing the next day with free slots.",
    },

    cta: {
      overline: "Reservations",
      title: "Book your table",
      body: "Terrace seats go fast on weekends. Send us a message and we'll keep one for you — with the morning sun, if you like.",
      button: "Book on WhatsApp",
      note: "Replies within minutes, every day we're open.",
      disclaimer:
        "This is a request — we confirm your table on WhatsApp within minutes.",
    },

    footer: {
      tagline: "Slow mornings & warm mezze in Gemmayzeh.",
      copyright: "Maison Sumac. All rights reserved.",
      credit: "Concept design by",
      creditStudio: "Mawqe3 Studio",
      followUs: "Follow us",
      lightboxClose: "Close image view",
      backToTop: "Back to top",
    },
  },

  /* ============================== AR ============================== */
  ar: {
    meta: { htmlLang: "ar", dir: "rtl" as const },

    brand: {
      name: "ميزون سماق",
      arabicName: "Maison Sumac",
      tagline: "كافي وفطور · الجميزة، بيروت",
    },

    nav: {
      story: "حكايتنا",
      menu: "المنيو",
      gallery: "الصور",
      reviews: "آراء الزبائن",
      visit: "وين منوجدين",
      reserve: "احجز",
      openMenu: "افتح القائمة",
      closeMenu: "سكّر القائمة",
      skipToContent: "تجاوز إلى المحتوى",
    },

    langToggle: {
      label: "غيّر اللغة",
      en: "EN",
      ar: "AR",
    },

    conceptBadge: {
      en: "Concept project by Mawqe3 Studio",
      ar: "مشروع تصوري من ستوديو موقع",
    },

    sound: {
      label: "أصوات التراس",
      enable: "شغّل أصوات التراس",
      disable: "طفي أصوات التراس",
    },

    hero: {
      overline: "قهوة مختصة وفطور — بيروت",
      title: "صباحات على مهل،",
      titleAccent: "عالطريقة اللبنانية.",
      sub: "ماناقيش من فرن الحطب، قهوة مختصة، وتراس شمسي بقلب الجميزة. اجا جوعان، واضل على راحتك.",
      reserveCta: "احجز على واتساب",
      menuCta: "شوف المنيو",
      openBadge: "منفتحين كل يوم — ٧:٣٠ أيام الأسبوع، ٨:٠٠ بالويكند",
      phase: {
        day: "التراس بالشمس هلأ",
        night: "التراس بالفوانيس هلأ",
      },
      picks: {
        label: "المطبخ بنصح فيهلأ",
        with: "مع",
        addBoth: "ضيف الاثنين",
        added: "الاثنين صاروا بطلبك",
      },
      imageAlt: "داخل كافي ميزون سماق الشمسي مع طاولات خشب ونباتات",
      imageAltNight: "تراس ميزون سماق منوّر بأضواء دافية بالمسا",
      imageAltSecondary: "فلات وايت برسمة لاتيه على طاولة خشب",
    },

    story: {
      overline: "حكايتنا",
      title: "فرن حطب، وتراس، وولا استعجال",
      body: "بدأت حكاية ميزون سماق بفرن حطب، وفناء مليان دغماء، وفكرة وحدة بسيطة: بيروت بتستاهل كافي الوقت فيه بيمشي على مهل. كل صباح منعمل ماناقيش طازة، ومنحمص قهوة محمّصة قريب منّا، ومنعصر الليموناضة وقت الطلب. اِجا عالفطور — واقعد عالشمس.",
      imageAlt: "باريستا بتعدي القهوة ورا الكاونتر بميزون سماق",
      caption: "الكاونتر، أغلب الصباحات قبل الثامنة",
      stats: [
        { value: "٢٠١٩", label: "تأسس بالجميزة" },
        { value: "٤٠+", label: "مقعد بالتراس والداخل" },
        { value: "١٢", label: "أصل قهوة عالرف" },
      ],
    },

    menu: {
      overline: "المنيو",
      title: "منعملو هالصبح، وبأسعار تفتح القلب",
      sub: "كل شي منعملو عنا يومياً. الأسعار بالدولار، ومنقبل الليرات على سعر اليوم كمان.",
      orderCta: "اطلب على واتساب",
      favorite: "أكتر طلب",
      note: "كل شي منفرن ومنحمص عنا — كل يوم.",
      categories: {
        breakfast: "الفطور",
        coffee: "قهوة ومشروبات",
        mains: "سندويشات وأطباق",
        desserts: "الحلو",
      },
      filters: {
        label: "فلتر المنيو",
        all: "الكل",
        vegetarian: "نباتي",
        vegan: "نباتي صرف",
        glutenFree: "بدون غلوتين",
        empty: "ما في شي مطابق هون — بس غالباً منقدر نعملو. اسألنا عالواتساب.",
      },
      search: {
        label: "دوّر بالمنيو",
        placeholder: "دوّر عا طبق — مثلاً «منقوشة»",
        clear: "فضّي البحث",
        found: (n: number) =>
          n === 1 ? "لقينا طبق وحدة" : `لقينا ${n.toLocaleString("ar-LB")} أطباق`,
        empty: (q: string) =>
          `ما في شي مضابق مع «${q}» — اسألنا عالواتساب، منحب التحدي.`,
      },
      popular: "مطلوب هلأ",
      recent: {
        label: "آخر اللي شفتو",
        clear: "امسح آخر الأطباق",
      },
      printCta: "اطبع المنيو",
      details: {
        storyTitle: "الحكاية",
        close: "سكّر تفاصيل الطبق",
        inGallery: "شوفها بالصور",
        share: "شارك الطبق",
        copied: "اننسخ الرابط",
      },
      dishNav: {
        prev: "الطبق اللي قبله",
        next: "الطبق اللي بعده",
        inOrder: "بالطلب تبعك",
      },
      changed: {
        body: "المنيو تغيّر من آخر مرة اجيتها — المطبخ كان شغال.",
        dismiss: "سكّر التنبيه",
        prices: "الأسعار اللي تغيّرت:",
        news: "جديد عالمنيو:",
        more: (n: number) => `+${n.toLocaleString("ar-LB")} كمان`,
      },
      now: {
        label: "هلأ هلأ",
        seeNow: "شوفها",
        breakfast: "وقت الفطور — الفرن عأحلى حرارة لهلأ.",
        coffee: "وقت القهوة — الماكينة التانية شغّالة من جديد.",
        mains: "وقت الغدا — المشواة ولعت من جديد.",
        desserts: "وقت الحلو — كنافة اليوم لسا دافية.",
      },
    },

    sumac: {
      overline: "الاسم عالباب",
      word: "سماق",
      wordLabel: "كلمة سماق مرسومة بالخط العربي",
      translit: "سماق — اسم بحبة حمرا، وشجرة، وبيت",
      sub: "خدّينا اسمنا من الحبة الحمرا الصغيرة اللي بتنكّه كل شي منحبه.",
      meanings: [
        {
          ar: "بهارة",
          title: "البهارة",
          body:
            "حمرا وحامضة، منطحنها طازة كل أسبوع ومنرشها عالبيض، عالصاص، وعالسلطة — ما بتغيب عن طاولتنا.",
        },
        {
          ar: "شجرة",
          title: "الشجرة",
          body:
            "عليكة عالتلال اللبنانية وبتحمرّ كل خريف. وحدة منّا عاقدة بفنّا، أكبر من عقد الإيجار.",
        },
        {
          ar: "دار",
          title: "الدار",
          body:
            "الروح اللي استلفينا الاسم منّا: ناشطة، دافية، ومطلقة الاستعجال — ضيافة بيروت بلمسة حامضة.",
        },
      ],
    },

    gallery: {
      overline: "الصور",
      title: "صباح عادي عندنا",
      viewDish: "شوف الطبق — بيفتح حكايتو بالمنيو",
      captions: [
        "توست لبنة وزعتر",
        "التراس الساعة ٩",
        "فلات وايت، دايماً",
        "ماناقيش طازة",
        "مقبلات للشبابيك",
        "كنافة، منقطعة وقت الطلب",
      ],
      alts: [
        "خبز محمص مع لبنة وزيت زيتون وزعتر",
        "تراس مظلل بكراسي خشب ونباتات",
        "قهوة فلات وايت برسمة لاتيه على طاولة خشب",
        "صينية مناقيش طازة من الفرن",
        "أطباق مقبلات ملونة على الطاولة",
        "قطعة كنافة مع القطر",
      ],
    },

    features: {
      overline: "ليش الناس بتحبنا",
      title: "ثلاث أسباب بيخلص فيها الصبح عندنا",
      items: [
        {
          title: "طازة كل يوم",
          body: "الماناقيش والكنافة والحلو بخرجوا من فرننا كل صباح. ما منخلي شي من مبارح — عمرنا.",
        },
        {
          title: "تراس دافي",
          body: "فناء مظلل، أصص زيتون، وصوت عصافير. أهدأ زاوية بالجميزة، بصراحة.",
        },
        {
          title: "منيح للشغل",
          body: "واي فاي سريع، بريزة على أغلب الطاولات، وقهوة بتنعملي حالها لما تخلص.",
        },
      ],
    },

    reviews: {
      overline: "آراء الزبائن",
      title: "شو عم يحكوا الزبائن الدائمين",
      items: [
        {
          quote:
            "توست اللبنة واللاتيه بالهال مضرب. صرت يومي كله بلّش هون رسمياً.",
          name: "نور ك.",
          place: "المار ميخائيل",
        },
        {
          quote:
            "أحلى تراس بالجميزة. واي فاي سريع، موسيقى هادية، وما حدا بيستعجلك. مكتبي التاني.",
          name: "جاد أ.",
          place: "الأشرفية",
        },
        {
          quote:
            "اجيت عالكنافة وضليت عالناس. حاسس حالي متل فطور عند صاحبتي — بس صاحبتي بتعتي طيب.",
          name: "مايا س.",
          place: "الحمرا",
        },
      ],
    },

    visit: {
      overline: "الموقع وساعات الشغل",
      title: "لقينا بالجميزة",
      addressLabel: "العنوان",
      hoursLabel: "ساعات الشغل",
      directionsCta: "افتح الخريطة",
      whatsappLabel: "واتساب",
      mapPreview: "معاينة الخريطة",
      mapNote: "دقيقتين من درج الجميزة — دوّر عالباب الزيتي.",
      mapAlt: "موقع ميزون سماق بالجميزة على الخريطة",
      mapStreets: ["شارع الجميزة", "شارع غورو", "شارع دو ليبان"],
      hours: [
        { day: "الاثنين – الجمعة", time: "٧:٣٠ — ١٨:٠٠" },
        { day: "السبت – الأحد", time: "٨:٠٠ — ١٩:٠٠" },
        { day: "المطبخ بسكر", time: "٣٠ دقيقة قبل" },
      ],
    },

    status: {
      openNow: "منفتحين هلأ — لحد {time}",
      closedNow: "مسكرين — منفتحين {time}",
    },

    orderTray: {
      label: "طلبك",
      empty: "ما في شي بالطلب بعد — ضيف شي طيب من المنيو.",
      clear: "امسح الكل",
      send: "ابعت الطلب على واتساب",
      total: "المجموع",
      note: "الدفع عالكاونتر أو عند التوصيل.",
      pairingChip: "ترشيح المطبخ",
      pairingNote: "(عن طريقة ترشيح المطبخ — زي ما بنصحوا هلأ)",
      detailsToggle: "ضيف اسمك أو ملاحظة",
      nameLabel: "اسمك",
      namePlaceholder: "ليلى",
      noteLabel: "ملاحظة للمطبخ",
      notePlaceholder: "زعتر زيادة، منيح متحمّص…",
      seeYou: "نشوفك قريباً!",
      add: "ضيف عالطلب",
      addItem: (name: string) => `ضيف ${name} عالطلب`,
      incItem: "زيد واحد",
      decItem: "نقص واحد",
      close: "سكّر ملخص الطلب",
    },

    booking: {
      title: "اختار وقتك",
      when: "اليوم",
      today: "اليوم",
      tomorrow: "بكرا",
      time: "الساعة",
      guests: "عدد الأشخاص",
      guestWord: (n: number) => (n === 1 ? "شخص" : "أشخاص"),
      nameLabel: "اسمك",
      namePlaceholder: "ليلى",
      nameHint: "نفس اسم طلباتك — منحفظه عندنا.",
      slotsGone:
        "أوقات اليوم كلها مرّت — عمورّج على اليوم الجاي اللي فيو أوقات فاضية.",
    },

    cta: {
      overline: "الحجوزات",
      title: "احجز طاولتك",
      body: "طاولات التراس بتروح بسرعة بنهاية الأسبوع. ابعتلنا رسالة ومنحجزلك وحدة — مع شمس الصبح إذا بدك.",
      button: "احجز على واتساب",
      note: "منرد خلال دقائق، كل يوم منفتحين فيه.",
      disclaimer: "هاد طلب مبدئي — منأكدلك الحجز عالواتساب خلال دقائق.",
    },

    footer: {
      tagline: "صباحات على مهل ومقبلات سخنة بالجميزة.",
      copyright: "ميزون سماق. كل الحقوق محفوظة.",
      credit: "تصميم مفهوم من",
      creditStudio: "Mawqe3 Studio",
      followUs: "تابعنا",
      lightboxClose: "سكّر الصورة",
      backToTop: "إرجع للفوق",
    },
  },
} as const;

export type Dictionary = (typeof translations)["en"];
