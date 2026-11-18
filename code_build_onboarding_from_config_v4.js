const RU_CONFIG = {
  "steps": [
    {
      "prompt": "Представьте путь одного клиента: увидел рекламу → кликнул → открыл сайт → написал вам. Вы заплатили за каждый из этих шагов.\n\nПотерять его можно в двух местах. До заявки — когда реклама и сайт не убедили обратиться. И после — когда человек написал вечером, а ответ получил утром: он уже купил у других.\n\nКакая половина сильнее проседает у вас?",
      "question": "Какая половина пути клиента проседает",
      "buttons": [
        {
          "key": "a",
          "label": "Мало обращений",
          "reply": "Тогда смотреть нужно на связку «обещание → подтверждение»: что человек видит в рекламе и получает ли то же самое на сайте. Самая частая потеря именно тут: реклама обещает одно, страница говорит другое. Человек не «передумал» — он просто не нашёл то, за чем кликнул.",
          "profile": {
            "focus": "привлечение: мало обращений"
          }
        },
        {
          "key": "b",
          "label": "Не доходят до сделки",
          "reply": "Это самое недооценённое место. Скорость первого ответа влияет на закрытие сделки сильнее, чем текст объявления: ответ в первые минуты может удвоить шансы, ответ через день — почти обнуляет. И эту половину можно сильно усилить без найма новых людей.",
          "profile": {
            "focus": "обработка: заявки не доходят до сделки"
          }
        }
      ]
    },
    {
      "prompt": "Как обычно закрывают эти дыры? Нанимают по специалисту на каждую: таргетолог ведёт рекламу, сайт делал фрилансер, CRM настраивал знакомый айтишник.\n\nКаждый молодец в своей зоне. Но клиент идёт через все зоны подряд — а за весь его путь не отвечает никто.\n\nА как устроено у вас сейчас?",
      "question": "Кто сейчас ведёт маркетинг",
      "buttons": [
        {
          "key": "a",
          "label": "Ведут подрядчики",
          "reply": "Значит, база есть — уже плюс, с нуля начинать не придётся. В такой конфигурации самое ценное — пройти путь клиента насквозь и найти 2–3 стыка, где подрядчики «не виноваты», а клиенты всё равно теряются. Именно там обычно лежат самые быстрые деньги.",
          "profile": {
            "focus": "маркетинг ведут подрядчики"
          }
        },
        {
          "key": "b",
          "label": "Тяну своими силами",
          "reply": "Уважаю — так глубже всего понимаешь свой бизнес. Но у этого есть потолок: ваше время. Каждый час на настройки и переписки — час, отнятый у продукта и продаж. Хорошая новость: значительную часть можно снять с себя, не теряя контроль.",
          "profile": {
            "focus": "маркетинг своими силами"
          }
        }
      ]
    },
    {
      "prompt": "Я закрываю весь этот путь один — как агентство, но в одних руках: стратегия → креативы и реклама → сайт → бот, CRM и автоматизация. Всю картину видит один человек, и он же отвечает за общий результат, а не за свой кусочек.\n\nКстати, вы прямо сейчас внутри примера: этот бот я спроектировал и собрал сам — от сценария и текстов до интеграций.\n\nЧто вам сейчас важнее?",
      "question": "Что сейчас важнее",
      "buttons": [
        {
          "key": "a",
          "label": "Нужно под ключ",
          "reply": "Тогда порядок такой: сначала аналитика и маршрут клиента на бумаге — от первого касания до сделки. Потом под него собираются инструменты: оффер, креативы, реклама, посадочная, бот, CRM. Так каждый элемент усиливает соседний, а не живёт своей жизнью.",
          "profile": {
            "focus": "полный цикл под ключ",
            "interest": "разобрать воронку целиком",
            "potential_service": "аудит воронки + сборка связки: реклама, сайт, бот, CRM"
          }
        },
        {
          "key": "b",
          "label": "Усилить то, что есть",
          "reply": "Разумно: сносить работающее — дорогое удовольствие. Начинаем с аудита, находим слабые звенья и усиливаем точечно — от креативов и рекламы до обработки заявок. Часто пары недель хватает на первый заметный сдвиг.",
          "profile": {
            "focus": "точечное усиление существующего",
            "interest": "найти быстрые точки роста",
            "potential_service": "экспресс-аудит + точечные улучшения: оффер, скорость ответа, follow-up"
          }
        }
      ]
    }
  ],
  "aiBridge": "Теперь пара слов о вас: чем занимается бизнес и где, по ощущениям, теряется больше всего клиентов?\n\nМожно текстом или голосовым. Дальше на связи мой AI-ассистент — он ответит сразу и по делу: где видны основные потери и с чего начать.\n\nНе хочется писать? Нажмите кнопку ниже — ваши ответы придут мне как заявка на бесплатный аудит рекламы и воронки.",
  "resumeNote": "Продолжим с того места, где остановились."
};

const EN_CONFIG = {
  "steps": [
    {
      "prompt": "Picture one client's journey: saw your ad → clicked → opened the site → messaged you. You paid for every one of those steps.\n\nYou can lose them in two places. Before the inquiry — when the ad and the site did not convince them to reach out. And after — when a person writes in the evening and gets a reply next morning: they have already bought elsewhere.\n\nWhich half sags more for you?",
      "question": "Which half of the client journey sags",
      "buttons": [
        {
          "key": "a",
          "label": "Few inquiries",
          "reply": "Then look at the \"promise → confirmation\" link: what a person sees in the ad and whether they get the same thing on the site. The most common loss is right here: the ad promises one thing, the page says another. The person did not \"change their mind\" — they simply did not find what they clicked for.",
          "profile": {
            "focus": "acquisition: few inquiries"
          }
        },
        {
          "key": "b",
          "label": "Deals don't close",
          "reply": "This is the most underrated spot. The speed of the first reply affects closing more than the ad copy: a reply within minutes can double the odds, a reply a day later almost cancels them. And this half can be strengthened a lot without hiring new people.",
          "profile": {
            "focus": "processing: inquiries do not reach the deal"
          }
        }
      ]
    },
    {
      "prompt": "How do people usually plug these holes? They hire one specialist per hole: a media buyer runs the ads, a freelancer built the site, a friendly IT guy set up the CRM.\n\nEach one is great in their own zone. But the client walks through all the zones in a row — and nobody owns the whole journey.\n\nHow does it work for you now?",
      "question": "Who runs marketing now",
      "buttons": [
        {
          "key": "a",
          "label": "Contractors run it",
          "reply": "So the base exists — that is already a plus, no need to start from scratch. In this setup the most valuable move is to walk the client journey end to end and find the 2–3 seams where the contractors are \"not to blame\", yet clients still get lost. That is usually where the fastest money sits.",
          "profile": {
            "focus": "marketing is run by contractors"
          }
        },
        {
          "key": "b",
          "label": "I do it myself",
          "reply": "Respect — that is how you understand your business at the deepest level. But it has a ceiling: your time. Every hour spent on settings and chats is an hour taken from the product and sales. Good news: a large part of it can be taken off your plate without losing control.",
          "profile": {
            "focus": "marketing done in-house by the owner"
          }
        }
      ]
    },
    {
      "prompt": "I cover this whole journey alone — like an agency, but in one pair of hands: strategy → creatives and ads → website → bot, CRM and automation. One person sees the whole picture and answers for the overall result, not for their own fragment.\n\nBy the way, you are inside an example right now: I designed and built this bot myself — from the scenario and texts to the integrations.\n\nWhat matters more to you now?",
      "question": "What matters more now",
      "buttons": [
        {
          "key": "a",
          "label": "Turnkey system",
          "reply": "Then the order is: first, analytics and the client route on paper — from the first touch to the deal. Then the tools are assembled around it: offer, creatives, ads, landing page, bot, CRM. That way each element reinforces the next instead of living its own life.",
          "profile": {
            "focus": "full cycle turnkey",
            "interest": "full funnel breakdown",
            "potential_service": "funnel audit + building the chain: ads, site, bot, CRM"
          }
        },
        {
          "key": "b",
          "label": "Strengthen existing",
          "reply": "Reasonable: tearing down what works is an expensive pleasure. We start with an audit, find the weak links and strengthen them point by point — from creatives and ads to inquiry processing. A couple of weeks is often enough for the first visible shift.",
          "profile": {
            "focus": "targeted strengthening of the existing system",
            "interest": "find quick growth points",
            "potential_service": "express audit + targeted improvements: offer, response speed, follow-up"
          }
        }
      ]
    }
  ],
  "aiBridge": "Now a couple of words about you: what does the business do, and where, by gut feeling, do you lose the most clients?\n\nText or voice — both work. From here my AI assistant takes over: it will answer right away and to the point — where the main losses are and what to start with.\n\nDon't feel like typing? Tap the button below — your answers will reach me as a request for a free audit of your ads and funnel.",
  "resumeNote": "Let's continue from where we stopped."
};

const SR_CONFIG = {
  "steps": [
    {
      "prompt": "Zamislite put jednog klijenta: video je oglas → kliknuo → otvorio sajt → pisao vam. Platili ste svaki od tih koraka.\n\nMožete ga izgubiti na dva mesta. Pre upita — kada ga oglas i sajt nisu ubedili da se javi. I posle — kada čovek piše uveče, a odgovor dobije ujutru: već je kupio kod drugih.\n\nKoja polovina kod vas više propada?",
      "question": "Koja polovina puta klijenta propada",
      "buttons": [
        {
          "key": "a",
          "label": "Malo upita",
          "reply": "Onda treba gledati vezu „obećanje → potvrda\": šta čovek vidi u oglasu i da li isto to dobija na sajtu. Najčešći gubitak je baš tu: oglas obećava jedno, stranica priča drugo. Čovek se nije „predomislio\" — prosto nije našao ono zbog čega je kliknuo.",
          "profile": {
            "focus": "privlačenje: malo upita"
          }
        },
        {
          "key": "b",
          "label": "Ne završe prodajom",
          "reply": "To je najpotcenjenije mesto. Brzina prvog odgovora utiče na prodaju jače od teksta oglasa: odgovor u prvim minutima može da udvostruči šanse, odgovor sutradan — skoro da ih poništi. A ta polovina se može znatno pojačati bez zapošljavanja novih ljudi.",
          "profile": {
            "focus": "obrada: upiti ne stižu do prodaje"
          }
        }
      ]
    },
    {
      "prompt": "Kako se ove rupe obično krpe? Angažuje se po jedan specijalista za svaku: jedan vodi oglase, sajt je radio frilenser, CRM je podesio poznanik iz IT-ja.\n\nSvako je odličan u svojoj zoni. Ali klijent prolazi kroz sve zone redom — a za ceo njegov put ne odgovara niko.\n\nKako je to kod vas sada uređeno?",
      "question": "Ko sada vodi marketing",
      "buttons": [
        {
          "key": "a",
          "label": "Vode saradnici",
          "reply": "Znači, baza postoji — to je već plus, ne kreće se od nule. U takvoj postavci najvrednije je proći put klijenta od početka do kraja i naći 2–3 spoja gde saradnici „nisu krivi\", a klijenti se ipak gube. Upravo tamo obično leži najbrži novac.",
          "profile": {
            "focus": "marketing vode spoljni saradnici"
          }
        },
        {
          "key": "b",
          "label": "Radim sam",
          "reply": "Svaka čast — tako se najdublje razume sopstveni biznis. Ali to ima plafon: vaše vreme. Svaki sat na podešavanjima i prepiskama je sat oduzet proizvodu i prodaji. Dobra vest: veliki deo toga možete skinuti sa sebe, a da ne izgubite kontrolu.",
          "profile": {
            "focus": "marketing sopstvenim snagama"
          }
        }
      ]
    },
    {
      "prompt": "Ja ceo taj put zatvaram sam — kao agencija, ali u jednim rukama: strategija → kreative i oglasi → sajt → bot, CRM i automatizacija. Celu sliku vidi jedan čovek i on odgovara za ukupan rezultat, a ne za svoj deo.\n\nUzgred, upravo ste unutar primera: ovog bota sam projektovao i napravio sâm — od scenarija i tekstova do integracija.\n\nŠta vam je sada važnije?",
      "question": "Šta je sada važnije",
      "buttons": [
        {
          "key": "a",
          "label": "Sve pod ključ",
          "reply": "Onda je redosled ovakav: prvo analitika i ruta klijenta na papiru — od prvog kontakta do prodaje. Zatim se oko toga slažu alati: ponuda, kreative, oglasi, lending, bot, CRM. Tako svaki element pojačava susedni, umesto da živi svoj život.",
          "profile": {
            "focus": "ceo ciklus pod ključ",
            "interest": "analiza celog levka",
            "potential_service": "revizija levka + izgradnja lanca: oglasi, sajt, bot, CRM"
          }
        },
        {
          "key": "b",
          "label": "Pojačati postojeće",
          "reply": "Razumno: rušiti ono što radi — skupo je zadovoljstvo. Krećemo od revizije, nalazimo slabe karike i pojačavamo ciljano — od kreativa i oglasa do obrade upita. Često je par nedelja dovoljno za prvi vidljiv pomak.",
          "profile": {
            "focus": "ciljano pojačavanje postojećeg",
            "interest": "naći brze tačke rasta",
            "potential_service": "ekspres revizija + ciljana poboljšanja: ponuda, brzina odgovora, follow-up"
          }
        }
      ]
    }
  ],
  "aiBridge": "Sada par reči o vama: čime se biznis bavi i gde, po osećaju, gubite najviše klijenata?\n\nMože tekstom ili glasovnom porukom. Dalje je na vezi moj AI asistent — odgovoriće odmah i konkretno: gde su glavni gubici i odakle krenuti.\n\nNe piše vam se? Pritisnite dugme ispod — vaši odgovori stižu meni kao zahtev za besplatan audit reklama i levka.",
  "resumeNote": "Nastavljamo tamo gde smo stali."
};

const CONFIG = {
  v3: {
    ru: RU_CONFIG,
    en: EN_CONFIG,
    sr: SR_CONFIG
  }
};
const DEFAULT_VARIANT = 'v3';
// A second tap on the same button within this window is treated as a double tap and ignored.
const DOUBLE_TAP_MS = 20000;

const buildStepState = (variant, index) => `onb_${variant}_s${index}`;
const parseCallback = (value) => {
  const m = String(value || '').match(/^onb_([a-zA-Z0-9]+)_s(\d+)_([ab])$/);
  if (!m) return null;
  return { variant: m[1], step: Number(m[2]), button: m[3] };
};
const parseState = (value) => {
  const m = String(value || '').match(/^onb_([a-zA-Z0-9]+)_s(\d+)$/);
  if (!m) return null;
  return { variant: m[1], step: Number(m[2]) };
};
const parseProfile = (value) => {
  if (value && typeof value === 'object') return value;
  if (!value) return {};
  try {
    const parsed = JSON.parse(String(value));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};
const clone = (value) => JSON.parse(JSON.stringify(value || {}));
const sortedAnswers = (profile) => Object.entries(profile.answers || {})
  .sort((a, b) => Number(a[1].step || 0) - Number(b[1].step || 0))
  .map(([, value]) => value);
const deriveProfileSummary = (profile) => {
  const answers = sortedAnswers(profile);
  const pick = (field) => [...answers].reverse().find((answer) => answer.profile?.[field])?.profile?.[field] || '';
  profile.focus = pick('focus') || profile.focus || 'не определен';
  profile.interest = pick('interest') || profile.interest || 'не определен';
  profile.potential_service = pick('potential_service') || profile.potential_service || 'аудит воронки + автоматизация обработки заявок';
  return profile;
};
const buildLeadProfileText = (profile, userText = '') => {
  const summary = deriveProfileSummary(clone(profile));
  const lines = [
    'Новый лид прошел онбординг.',
    '',
    `Интерес: ${summary.interest}`,
    `Потенциальная услуга: ${summary.potential_service}`,
    '',
    'Ответы на вопросы:'
  ];
  for (const answer of sortedAnswers(summary)) {
    lines.push(`${answer.step}. ${answer.question} — ${answer.label}`);
  }
  const cleanUserText = String(userText || '').trim();
  if (cleanUserText) {
    lines.push('', 'Ответ пользователя:', `"${cleanUserText}"`);
  }
  return lines.join('\n');
};

const out = [];
for (const item of items) {
  const language = String(item.json.language || 'ru');
  const requestedVariant = String(item.json.onboarding_variant || DEFAULT_VARIANT);
  const variant = CONFIG[requestedVariant] ? requestedVariant : DEFAULT_VARIANT;
  const locale = CONFIG[variant][language] || CONFIG[variant].ru;
  const callback = String(item.json.callback_data || '');
  const intentKey = String(item.json.intent_key || '');
  const currentState = String(item.json.current_state || 'new');
  const parsed = parseCallback(callback);
  const stateInfo = parseState(currentState);
  const storedProfile = parseProfile(item.json.onboarding_profile_json);

  const isStartRequest = /^onb_(?:[a-zA-Z0-9]+_)?start$/.test(callback);
  // A step button from a retired chain version, pressed while the user is still inside that old chain.
  const isRetiredChain = !!parsed && !!stateInfo && !CONFIG[stateInfo.variant];
  const isStartFlow = !!item.json.is_new_user || intentKey === 'start' || isStartRequest || isRetiredChain;

  const result = {
    ...item.json,
    onboarding_should_send: false,
    onboarding_text: '',
    onboarding_btn1_text: '',
    onboarding_btn1_callback: 'main_menu',
    onboarding_btn2_text: '',
    onboarding_btn2_callback: 'main_menu',
    onboarding_next_state: currentState,
    onboarding_next_funnel_stage: String(item.json.funnel_stage || 'onboarding'),
    onboarding_status_next: String(item.json.onboarding_status || 'not_started'),
    onboarding_completed: false,
    onboarding_reset_profile: false,
    onboarding_profile_json_string: String(item.json.onboarding_profile_json || '{}'),
    onboarding_lead_profile_text: String(item.json.onboarding_lead_profile_text || ''),
    onboarding_event_kind: '',
    onboarding_event_step: 0,
    onboarding_event_answer_key: '',
    onboarding_event_answer_label: ''
  };

  const showStep = (stepNumber, prefix) => {
    const step = locale.steps[stepNumber - 1];
    result.onboarding_should_send = true;
    result.onboarding_text = prefix ? `${prefix}\n\n${step.prompt}` : step.prompt;
    result.onboarding_btn1_text = step.buttons[0].label;
    result.onboarding_btn1_callback = `onb_${variant}_s${stepNumber}_a`;
    result.onboarding_btn2_text = step.buttons[1].label;
    result.onboarding_btn2_callback = `onb_${variant}_s${stepNumber}_b`;
    result.onboarding_next_state = buildStepState(variant, stepNumber);
    result.onboarding_next_funnel_stage = 'onboarding';
    result.onboarding_status_next = 'in_progress';
  };

  if (isStartFlow) {
    const profile = {
      variant,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      answers: {}
    };
    // A phone number the user shared earlier survives a restart of the chain.
    if (storedProfile.contact_phone) profile.contact_phone = storedProfile.contact_phone;
    showStep(1, '');
    result.onboarding_reset_profile = true;
    result.onboarding_profile_json_string = JSON.stringify(profile);
    result.onboarding_lead_profile_text = '';
    result.onboarding_event_kind = 'start';
    result.onboarding_event_step = 1;
    out.push({ json: result });
    continue;
  }

  if (!parsed) {
    out.push({ json: result });
    continue;
  }

  const expectedState = buildStepState(parsed.variant, parsed.step);
  if (currentState !== expectedState || parsed.variant !== variant) {
    // Double tap: the same step was answered a moment ago and the next message is already on screen.
    const previous = storedProfile.answers && storedProfile.answers[`step_${parsed.step}`];
    const answeredAt = previous && previous.answered_at ? Date.parse(previous.answered_at) : NaN;
    if (parsed.variant === variant && Number.isFinite(answeredAt) && Date.now() - answeredAt < DOUBLE_TAP_MS) {
      continue;
    }
    // An old button pressed while the chain is still in progress: show the current step again.
    if (stateInfo && stateInfo.variant === variant && locale.steps[stateInfo.step - 1]) {
      showStep(stateInfo.step, locale.resumeNote);
      result.onboarding_event_kind = 'resume';
      result.onboarding_event_step = stateInfo.step;
      out.push({ json: result });
      continue;
    }
    // The chain is already finished: the fallback node answers with a soft notice.
    out.push({ json: result });
    continue;
  }

  const stepIndex = parsed.step - 1;
  const step = locale.steps[stepIndex];
  const selected = step ? step.buttons.find((button) => button.key === parsed.button) : null;
  if (!selected) {
    out.push({ json: result });
    continue;
  }

  const profile = storedProfile;
  profile.variant = variant;
  profile.status = 'in_progress';
  profile.answers = profile.answers && typeof profile.answers === 'object' ? profile.answers : {};
  profile.answers[`step_${parsed.step}`] = {
    step: parsed.step,
    key: selected.key,
    label: selected.label,
    question: step.question,
    profile: selected.profile || {},
    answered_at: new Date().toISOString()
  };
  deriveProfileSummary(profile);

  result.onboarding_event_kind = 'answer';
  result.onboarding_event_step = parsed.step;
  result.onboarding_event_answer_key = selected.key;
  result.onboarding_event_answer_label = selected.label;

  if (parsed.step < locale.steps.length) {
    showStep(parsed.step + 1, selected.reply);
    result.onboarding_profile_json_string = JSON.stringify(profile);
    out.push({ json: result });
    continue;
  }

  profile.status = 'completed';
  profile.completed_at = new Date().toISOString();

  result.onboarding_should_send = true;
  result.onboarding_text = `${selected.reply}\n\n${locale.aiBridge}`;
  result.onboarding_next_state = 'ai_entry';
  result.onboarding_next_funnel_stage = 'consultation';
  result.onboarding_status_next = 'completed';
  result.onboarding_completed = true;
  result.onboarding_event_kind = 'complete';
  result.onboarding_profile_json_string = JSON.stringify(profile);
  result.onboarding_lead_profile_text = buildLeadProfileText(profile);
  out.push({ json: result });
}
return out;
