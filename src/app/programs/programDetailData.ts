/* ──────────────────────────────────────────────────────────────
   programDetailData.ts
   Full structured content for every program & pillar detail page
   ────────────────────────────────────────────────────────────── */

export interface SubSection {
    title: string;
    quote?: string;
    paragraphs?: string[];
    bullets?: string[];
    impact?: string[];
    checkmarks?: string[];
}

export interface Section {
    title: string;
    subtitle?: string;
    paragraphs?: string[];
    bullets?: string[];
    subsections?: SubSection[];
    checkmarks?: string[];
}

export interface ImpactRow {
    before: string;
    after: string;
}

export interface StatItem {
    number: string;
    label: string;
}

export interface StoryBlock {
    title: string;
    paragraphs: string[];
}

export interface ProgramDetail {
    id: string;
    type: "program" | "pillar";
    title: string;
    heroSubtitle: string;
    philosophy?: { quote: string; paragraphs: string[] };
    sections: Section[];
    impactTable?: { title: string; rows: ImpactRow[] };
    byTheNumbers?: string[];
    story?: StoryBlock;
    closing?: string[];
    donationTiers?: { amount: string; description: string }[];
}

/* =================================================================
   CORE PROGRAMS
   ================================================================= */

const RISE_ROOMS: ProgramDetail = {
    id: "rise-rooms",
    type: "program",
    title: "The Rise Room Initiative",
    heroSubtitle: "A sanctuary. A lifeline. A place where silence can finally break.",
    philosophy: {
        quote: "You cannot climb when you are bleeding. First, you must heal.",
        paragraphs: [
            "A Rise Room is a safe space — a dedicated room within a partner school where girls can come to heal, speak freely, and find support.",
            "It is not a classroom. There are no desks, no chalkboards, no pressure to perform. Instead, there are cushions, soft lighting, calming colors, and a circle of chairs where everyone sits as equals.",
        ],
    },
    sections: [
        {
            title: "Why Rise Rooms Exist",
            paragraphs: [
                "In Ibanda District, girls carry weights no child should carry:",
            ],
            bullets: [
                "Trauma from losing parents",
                "Grief from watching siblings go hungry",
                "Shame from abuse they did not cause",
                "Anxiety about being married off or dropping out",
                "Exhaustion from carrying adult responsibilities",
            ],
            subsections: [
                {
                    title: "",
                    paragraphs: [
                        "And they carry it all alone. In our communities, girls are taught to be strong, to endure, to suffer in silence.",
                        "Rise Rooms exist to say: You are not alone. Your feelings matter. You deserve to heal.",
                    ],
                },
            ],
        },
        {
            title: "What Happens Inside a Rise Room",
            subsections: [
                {
                    title: "Individual Counseling",
                    paragraphs: ["One-on-one sessions with trained counselors"],
                },
                {
                    title: "Group Circles",
                    paragraphs: ["Girls discover they are not alone in their struggles"],
                },
                {
                    title: "Peer Support",
                    paragraphs: ["Older girls trained to listen and guide"],
                },
                {
                    title: "Art Therapy",
                    paragraphs: ["Drawing, writing, creating to express what words cannot"],
                },
                {
                    title: "Quiet Space",
                    paragraphs: ["Sometimes a girl just needs to rest"],
                },
            ],
        },
    ],
    impactTable: {
        title: "The Impact",
        rows: [
            { before: "85% felt alone in their struggles", after: "75% know they are not alone" },
            { before: "20% could express their feelings", after: "75% can speak about their pain" },
            { before: "10% knew where to seek help", after: "90% know where to turn" },
            { before: "62% school attendance", after: "92% attendance" },
        ],
    },
    byTheNumbers: [
        "15 Rise Rooms established in schools across Ibanda District",
        "800+ girls reached",
        "42 peer counselors trained",
        "92% school retention among girls who use Rise Rooms",
    ],
    closing: [
        "A Rise Room Is Not Just a Room. It is:",
        "A place where trauma meets healing",
        "A place where silence finds voice",
        "A place where girls discover they are not alone",
        "A place where rising begins",
    ],
};

const ACADEMIC_RESCUE: ProgramDetail = {
    id: "academic-rescue",
    type: "program",
    title: "Academic Rescue Program",
    heroSubtitle: "Removing obstacles so no girl has to leave school.",
    philosophy: {
        quote: "No girl should leave school because the world made it too hard to stay.",
        paragraphs: [
            "Every day in Ibanda District, girls drop out of school. Not because they are lazy. Not because they lack intelligence. Not because they don't want to learn.",
            "They drop out because the world puts obstacle after obstacle in their path. The Academic Rescue Program exists to remove those obstacles — one girl at a time.",
        ],
    },
    sections: [
        {
            title: "The Reality We Address",
            paragraphs: [
                "In Uganda, 4 in 10 girls drop out before completing secondary school. They drop out because:",
            ],
            bullets: [
                "Uniforms wear out and cannot be replaced",
                "Exercise books run out and there is no money for more",
                "Sanitary pads are a luxury they cannot afford",
                "Exam fees come due and their families cannot pay",
                "They become pregnant and schools expel them",
                "They are needed at home to care for younger siblings",
            ],
            subsections: [
                {
                    title: "",
                    paragraphs: [
                        "These are not failures of effort. These are failures of circumstance.",
                    ],
                },
            ],
        },
        {
            title: "What We Do",
            paragraphs: [
                "The Academic Rescue Program keeps girls in school by addressing the practical barriers that push them out:",
            ],
            subsections: [
                {
                    title: "1. Uniforms and Shoes",
                    paragraphs: [
                        "A girl in a torn uniform is sent home. A girl without shoes is mocked. We provide complete uniforms and shoes so every girl can walk into school with dignity.",
                    ],
                },
                {
                    title: "2. Scholastic Materials",
                    paragraphs: [
                        "Exercise books, pens, pencils, geometry sets, textbooks. When a girl has the tools to learn, she can focus on learning — not on what she lacks.",
                    ],
                },
                {
                    title: "3. Sanitary Pads",
                    paragraphs: [
                        "1 in 10 girls misses school during her period. We provide reusable pad kits and training so no girl ever misses class again.",
                    ],
                },
                {
                    title: "4. Exam Fees",
                    paragraphs: [
                        "When national exams approach, many girls cannot afford the fees. We cover them so no girl is barred from sitting for her future.",
                    ],
                },
                {
                    title: "5. Emergency Support",
                    paragraphs: [
                        "When a crisis hits — a parent dies, a harvest fails, a family is displaced — we provide immediate support to keep the girl in school.",
                    ],
                },
                {
                    title: "6. Tutoring and Remedial Classes",
                    paragraphs: [
                        "For girls who have fallen behind due to absences or trauma, we provide after-school tutoring and exam preparation to help them catch up.",
                    ],
                },
            ],
        },
    ],
    impactTable: {
        title: "The Difference It Makes",
        rows: [
            { before: "Girl worried about torn uniform", after: "Girl walks tall, ready to learn" },
            { before: "Girl shares one book with five others", after: "Girl has her own materials" },
            { before: "Girl misses a week of school each month", after: "Girl attends every single day" },
            { before: "Girl cannot afford exam fees", after: "Girl sits for her exams" },
            { before: "Girl falls behind and gives up", after: "Girl catches up and believes again" },
        ],
    },
    byTheNumbers: [
        "92% of girls in our program stay in school — compared to 60% nationally",
    ],
};

const LEADERSHIP_LIFE_SKILLS: ProgramDetail = {
    id: "leadership-life-skills",
    type: "program",
    title: "Leadership & Life Skills Program",
    heroSubtitle: "Equipping girls to stand on their own, lead, and lift others.",
    philosophy: {
        quote: "A girl who can provide for herself will never be trapped. A girl who can lead will change the world.",
        paragraphs: [
            "Healing gives a girl back her voice. Education keeps her in school. But leadership and life skills give her something more: the ability to stand on her own, to earn her own money, to make her own decisions, and to lift others as she rises.",
        ],
    },
    sections: [
        {
            title: "Life Skills Training — What Girls Learn",
            subsections: [
                { title: "Reusable Pad Making", paragraphs: ["Never miss school again. Never be ashamed."] },
                { title: "Liquid Soap Making", paragraphs: ["Hygiene for family. Income from selling."] },
                { title: "Vaseline & Body Lotion", paragraphs: ["Skin care on a budget. Products to sell."] },
                { title: "Tailoring & Repairs", paragraphs: ["Mend uniforms. Make clothes. Earn income."] },
                { title: "Notebook Making", paragraphs: ["Always have books for class. Sell to others."] },
                { title: "Financial Literacy", paragraphs: ["Save money. Track profits. Grow businesses."] },
                { title: "Entrepreneurship", paragraphs: ["Turn skills into income. Become self-sufficient."] },
            ],
        },
        {
            title: "The Enterprise Group Model",
            paragraphs: [
                "Girls form small groups (5–10 members) to:",
            ],
            checkmarks: [
                "Buy materials in bulk (cheaper together)",
                "Make products together (faster together)",
                "Sell at markets, schools, and events (stronger together)",
                "Save money together (village savings model)",
                "Support each other through challenges (sisterhood)",
            ],
            subsections: [
                {
                    title: "Example: \"Rise Sisters\"",
                    paragraphs: [
                        "The \"Rise Sisters\" group makes soap, lotion, and pads together. Each girl earns 10,000–20,000 UGX per month — enough for school supplies and helping family.",
                    ],
                },
            ],
        },
        {
            title: "Leadership Development",
            subsections: [
                { title: "Stage 1: Discovery", paragraphs: ["Girls identify problems in their community"] },
                { title: "Stage 2: Planning", paragraphs: ["They design solutions and make a plan"] },
                { title: "Stage 3: Action", paragraphs: ["They lead projects that create change"] },
                { title: "Stage 4: Reflection", paragraphs: ["They learn from successes and challenges"] },
                { title: "Stage 5: Mentoring", paragraphs: ["They teach younger girls to do the same"] },
            ],
        },
        {
            title: "Community Projects Led by Girls",
            paragraphs: ["Girls in our program have:"],
            bullets: [
                "Taught 50 primary school girls to make reusable pads",
                "Started a \"youth helping elders\" program fetching water for grandmothers",
                "Organized community legal awareness sessions",
                "Planted 200 trees in their villages",
                "Created a \"buddy system\" to protect younger students from bullying",
            ],
            subsections: [
                {
                    title: "",
                    paragraphs: [
                        "A girl who has led one project will lead again. A girl who has changed one thing will try to change more.",
                    ],
                },
            ],
        },
        {
            title: "The Ripple Effect",
            paragraphs: [
                "One girl learns to make soap.",
                "She teaches her mother. Mother saves money. She teaches her sister. Sister starts a business. She teaches her friend. Friend earns her own income. She teaches her daughter someday. The cycle continues.",
                "This is not charity. This is multiplication.",
            ],
        },
    ],
    closing: [
        "Every girl who completes our program pledges: \"I will reach back. I will mentor at least one girl each year. I will prove that her beginning does not define her becoming.\"",
    ],
};

const HEALTH_WELLNESS: ProgramDetail = {
    id: "health-wellness",
    type: "program",
    title: "Health & Wellness Program",
    heroSubtitle: "Because a girl who is sick, hungry, or ashamed cannot rise.",
    philosophy: {
        quote: "A healthy girl is a rising girl.",
        paragraphs: [
            "At African Girl Rise, we understand that a girl cannot learn, cannot lead, cannot dream — if her body is failing her. Health is not a luxury. It is the foundation upon which everything else is built.",
            "We address the whole girl: her physical health, her menstrual health, her nutrition, and her access to healthcare.",
        ],
    },
    sections: [
        {
            title: "The Reality We Address",
            paragraphs: [
                "In Ibanda District, girls face daily health challenges that keep them from school and from thriving:",
            ],
            bullets: [
                "1 in 10 girls misses school during her period because she has no sanitary pads",
                "Malnutrition affects concentration, energy, and growth",
                "Infections go untreated because clinics are far and money is scarce",
                "Pregnancy ends education for thousands of girls each year",
                "HIV and sexual health risks are high, but knowledge is low",
                "Stigma around menstruation and reproductive health keeps girls silent and suffering",
            ],
            subsections: [
                { title: "", paragraphs: ["These are not small problems. They are barriers that steal futures."] },
            ],
        },
        {
            title: "What We Do",
            subsections: [
                {
                    title: "1. Menstrual Health Management",
                    quote: "No girl should miss school because of her period.",
                    paragraphs: [
                        "We tackle period poverty through reusable pad training, pad distribution, and menstrual health education.",
                    ],
                    bullets: [
                        "Every girl learns to make her own reusable pads (lasts 6–12 months)",
                        "Starter kits for girls who cannot afford materials",
                        "Girls learn about their bodies without shame",
                        "Breaking the silence around menstruation",
                    ],
                    impact: [
                        "Girls who never miss school again",
                        "Girls who feel confident instead of ashamed",
                        "Girls who can teach their mothers and sisters",
                    ],
                },
                {
                    title: "2. Nutrition and Food Security",
                    quote: "A hungry girl cannot learn.",
                    paragraphs: [
                        "We address nutrition through school meal support, nutrition education, and growing small vegetable gardens at home.",
                    ],
                    impact: [
                        "Girls who can concentrate in class",
                        "Girls with energy to learn and play",
                        "Girls who grow into strong women",
                    ],
                },
                {
                    title: "3. Sexual and Reproductive Health Education",
                    quote: "Knowledge is protection.",
                    bullets: [
                        "Understanding puberty and body changes",
                        "Contraception and family planning",
                        "Preventing HIV and STIs",
                        "Consent and healthy relationships",
                        "Dangers of early pregnancy",
                        "Where to access health services",
                    ],
                    impact: [
                        "Girls who can make informed choices",
                        "Girls who know how to protect themselves",
                        "Girls who avoid early pregnancy and stay in school",
                    ],
                },
                {
                    title: "4. Access to Healthcare",
                    quote: "No girl should suffer because help is too far or too expensive.",
                    bullets: [
                        "Local health centers and clinics",
                        "HIV testing and counseling services",
                        "Family planning services",
                        "Antenatal care for pregnant girls",
                        "Emergency medical support",
                    ],
                    impact: [
                        "Girls who get treatment when they are sick",
                        "Girls who know where to go for help",
                    ],
                },
                {
                    title: "5. Physical Wellness",
                    quote: "Strong bodies, strong minds.",
                    bullets: [
                        "Sports and recreation activities",
                        "Basic exercise and movement",
                        "Understanding the connection between physical and mental health",
                        "Rest and sleep education",
                    ],
                    impact: [
                        "Girls who feel strong in their bodies",
                        "Girls who understand self-care",
                    ],
                },
                {
                    title: "6. Mental Health Integration",
                    quote: "You cannot separate the body from the mind.",
                    paragraphs: [
                        "Our Health and Wellness Program works hand-in-hand with our Healing the Ground pillar. Health issues often cause or worsen mental distress, and mental distress affects physical health. We address both, always, together.",
                    ],
                    impact: [
                        "Holistic healing. Whole girls. Complete wellness.",
                    ],
                },
            ],
        },
    ],
};

const FUTURE_PATHWAYS: ProgramDetail = {
    id: "future-pathways",
    type: "program",
    title: "Future Pathways Program",
    heroSubtitle: "Bridging the gap between dreaming and doing.",
    philosophy: {
        quote: "A girl with a vision for her future will never settle for less.",
        paragraphs: [
            "Healing gives her back her voice. Education keeps her in school. Skills make her self-sufficient. Leadership teaches her to guide others.",
            "But none of it matters if she cannot see where she is going. The Future Pathways Program ensures that every girl leaves African Girl Rise with a clear vision for her future — and a concrete plan to get there.",
        ],
    },
    sections: [
        {
            title: "The Reality We Address",
            paragraphs: [
                "In Ibanda District, girls grow up surrounded by limited examples of what they can become. They rarely see female doctors, lawyers, engineers, business owners, or leaders.",
                "You cannot become what you cannot imagine. Many girls have dreams, but they do not know how to reach them. The Future Pathways Program bridges that gap.",
            ],
        },
        {
            title: "What We Do",
            subsections: [
                {
                    title: "1. Career Exposure",
                    quote: "Show her what is possible, and she will believe it is possible for her.",
                    bullets: [
                        "Career Days: Professionals visit our girls to share their journeys",
                        "Exposure Tours: Visits to universities and vocational institutes",
                        "Job Shadowing: Selected girls spend a day with a professional",
                    ],
                    impact: [
                        "Girls who know what is possible",
                        "Girls who can picture themselves in careers they never knew existed",
                    ],
                },
                {
                    title: "2. Mentorship",
                    quote: "Every girl needs someone who has walked the path before her.",
                    bullets: [
                        "Professional Mentors: Women in careers our girls dream of",
                        "Near-Peer Mentors: Slightly older girls who recently completed our program",
                        "Lifetime Connection: Mentors commit to long-term relationships",
                    ],
                    impact: [
                        "Girls with guides",
                        "Girls who know someone believes in their future",
                    ],
                },
                {
                    title: "3. University and Vocational Preparation",
                    quote: "The path to higher education should be clear, not confusing.",
                    bullets: [
                        "Subject guidance: What subjects lead to which careers",
                        "Application support: Personal statements and interview prep",
                        "Scholarship connections: Identifying and supporting applications",
                        "Exam preparation: Intensive support for national exams",
                    ],
                    impact: [
                        "Girls who know how to apply",
                        "Girls who can access higher education",
                    ],
                },
                {
                    title: "4. Vocational Training Pathways",
                    quote: "Not every girl wants university. Every girl deserves a skill.",
                    bullets: [
                        "Tailoring and Fashion Design",
                        "Catering and Hotel Management",
                        "Hairdressing and Cosmetology",
                        "Agriculture and Animal Husbandry",
                        "Construction and Carpentry",
                        "Information Technology",
                    ],
                    impact: [
                        "Girls with marketable skills",
                        "Girls who can earn from day one",
                    ],
                },
                {
                    title: "5. The \"My Rise Plan\" Process",
                    quote: "A dream without a plan is just a wish.",
                    paragraphs: [
                        "Every girl creates her own \"My Rise Plan\" — a personalized roadmap for her future:",
                    ],
                    bullets: [
                        "Step 1: Vision — Where do I want to be in 5 years? 10 years?",
                        "Step 2: Goals — What education and skills do I need?",
                        "Step 3: Timeline — When will I complete each step?",
                        "Step 4: Resources — What do I already have? What do I still need?",
                        "Step 5: Review — How will I track my progress?",
                    ],
                    impact: [
                        "Girls with clarity and direction",
                        "Girls who can see the path ahead",
                    ],
                },
                {
                    title: "6. Alumni Network",
                    quote: "She rises. She reaches back. The cycle continues.",
                    bullets: [
                        "Ongoing mentorship opportunities",
                        "Access to job and training opportunities",
                        "Connection to a sisterhood that lasts forever",
                        "Mentor at least one current girl each year",
                    ],
                    impact: [
                        "A self-sustaining cycle of rising and reaching back",
                    ],
                },
            ],
        },
    ],
    byTheNumbers: [
        "200+ girls participated in career exposure events",
        "50+ professionals connected as mentors",
        "100+ girls supported with application and scholarship guidance",
        "15 girls currently in university or vocational training",
        "40% of alumni actively mentoring current participants",
    ],
};

/* =================================================================
   PILLARS
   ================================================================= */

const HEALING_THE_GROUND: ProgramDetail = {
    id: "healing-the-ground",
    type: "pillar",
    title: "Healing the Ground",
    heroSubtitle: "Mental Health & Trauma Recovery",
    philosophy: {
        quote: "You cannot climb when you are bleeding.",
        paragraphs: [
            "This is the truth at the heart of everything we do at African Girl Rise. Before a girl can learn, before she can lead, before she can rise — she must first heal.",
            "In Ibanda District and across Uganda, girls carry weights no child should carry. They carry the trauma of losing parents. They carry the grief of watching siblings go hungry. They carry the shame of abuse they did not cause.",
            "And they carry it all in silence. Because in our communities, girls are taught to be strong. They are taught to endure. They are taught that their pain is private. We are changing that.",
        ],
    },
    sections: [
        {
            title: "What We Do: Healing the Ground",
            subsections: [
                {
                    title: "1. Rise Rooms — Safe Spaces for Healing",
                    paragraphs: [
                        "At the heart of Healing the Ground are our Rise Rooms — dedicated, confidential spaces within partner schools where girls can come exactly as they are.",
                        "A Rise Room is not a classroom. Instead, there are cushions, soft lighting, calming colors, and a circle of chairs where everyone sits as equals.",
                    ],
                    bullets: [
                        "Speak without fear of judgment",
                        "Cry without being told to stop",
                        "Sit in silence if she has no words yet",
                        "Draw, write, or create to express what she cannot say",
                        "Simply rest, for the first time in perhaps years",
                    ],
                },
                {
                    title: "2. Professional Counseling",
                    paragraphs: [
                        "We provide trained counselors who visit partner schools regularly:",
                    ],
                    bullets: [
                        "Individual Counseling: One-on-one sessions with trauma-informed care",
                        "Group Counseling: Girls come together and discover they are not alone",
                        "Crisis Intervention: Immediate support and referral for girls in acute distress",
                    ],
                },
                {
                    title: "3. Peer Support Circles",
                    paragraphs: [
                        "We train senior girls as Peer Counselors — young women who learn to listen, validate, and guide their peers toward help. Because sometimes, the first person a girl tells is her friend.",
                    ],
                    bullets: [
                        "Listen without judgment",
                        "Recognize signs of distress",
                        "Maintain confidentiality",
                        "Know when and how to refer to professional help",
                        "Create a culture of openness and support",
                    ],
                    impact: [
                        "42 peer counselors trained to date, each a lifeline for the girls around them",
                    ],
                },
                {
                    title: "4. Mental Health Awareness",
                    bullets: [
                        "School-wide Mental Health Assemblies: Normalizing conversations about feelings and well-being",
                        "Teacher Training: Equipping teachers to recognize and respond to trauma with compassion",
                        "Community Dialogues: Engaging parents, elders, and leaders to break stigma",
                    ],
                },
                {
                    title: "5. Expressive Healing",
                    paragraphs: [
                        "Not every girl can speak her pain. Some need other ways to express what is inside:",
                    ],
                    bullets: [
                        "Art Therapy: Drawing, painting, and collage",
                        "Journaling: Private notebooks for free writing",
                        "Dance and Movement: Using the body to release what words cannot hold",
                        "Music: Singing together, listening to healing music, even writing songs",
                    ],
                },
                {
                    title: "6. Referral and Follow-Up",
                    paragraphs: [
                        "Some girls need more support than we can provide within our Rise Rooms. We maintain a network of clinical psychologists, health centers, child protection services, and legal aid.",
                        "We do not abandon a girl when her needs exceed our capacity. We walk with her to the next level of care, and we follow up to ensure she receives it.",
                    ],
                },
            ],
        },
    ],
    impactTable: {
        title: "The Impact of Healing the Ground",
        rows: [
            { before: "85% feel alone in their struggles", after: "25% feel alone (75% healed)" },
            { before: "20% can name and express their feelings", after: "75% can express their feelings" },
            { before: "10% know where to seek help", after: "90% know where to seek help" },
            { before: "62% school attendance", after: "92% school attendance" },
        ],
    },
    story: {
        title: "A Story of Healing",
        paragraphs: [
            "Brenda came to our Rise Room unable to speak. Not because she was shy. Because trauma had stolen her voice.",
            "Her mother had died. Her father drank. She was caring for younger brothers alone, waking at 4 a.m., falling asleep in class, carrying weights no child should carry.",
            "She came to our Rise Room every week. She sat in silence for six weeks.",
            "And then, one day, she whispered: \"No one has ever said they're glad I'm here.\"",
            "That whisper became words. Those words became healing. That healing became strength.",
            "Today, Brenda is in nursing school. And every holiday, she returns to Ibanda to sit in that same Rise Room — now on the other side of the circle.",
            "She tells the girls: \"I was you. I was so tired I thought I couldn't continue. But someone held space for me until I could hold myself. Now I am holding space for you.\"",
        ],
    },
    closing: [
        "Healing is not separate from education. It is the prerequisite for education.",
        "That is why Healing the Ground is the first pillar of African Girl Rise. It is not the only thing we do — but nothing else we do can succeed without it.",
    ],
};

const BUILDING_THE_LADDER: ProgramDetail = {
    id: "building-the-ladder",
    type: "pillar",
    title: "Building the Ladder",
    heroSubtitle: "Practical Skills for Self-Sufficiency",
    philosophy: {
        quote: "You cannot rise without rungs to hold.",
        paragraphs: [
            "At African Girl Rise, we believe that healing is essential — but healing alone is not enough. A girl who has begun to heal must also have practical tools to build her future.",
            "We do not give girls fish. We teach them to fish — and to make their own nets.",
        ],
    },
    sections: [
        {
            title: "The Reality We Address",
            paragraphs: [
                "In Ibanda District, families struggle to afford basic necessities. Soap is a luxury. Vaseline is a treat. Sanitary pads are out of reach for most.",
                "Poverty is expensive. It forces families to buy things they could make themselves — if only they knew how. We are changing that.",
            ],
        },
        {
            title: "Our Response: Skills, Not Handouts",
            paragraphs: [
                "We do not give girls money. We do not create dependency. We equip them with skills so they never need to depend on anyone.",
            ],
            checkmarks: [
                "The ability to make her own sanitary pads",
                "The ability to make her own soap",
                "The ability to make her own Vaseline and lotion",
                "The ability to repair her own clothes",
                "The ability to earn her own money",
                "The ability to teach these skills to others",
            ],
        },
        {
            title: "What We Teach",
            subsections: [
                {
                    title: "1. Reusable Sanitary Pad Making",
                    paragraphs: [
                        "1 in 10 girls in Uganda misses school during her period. A girl who can make her own pads will never miss school again.",
                    ],
                    bullets: [
                        "High-quality, comfortable reusable pads",
                        "Sourcing and cutting locally available materials",
                        "Sewing techniques for durability",
                        "Proper washing and drying to prevent infection",
                        "Pads that last 6–12 months",
                    ],
                },
                {
                    title: "2. Liquid Soap Making",
                    paragraphs: [
                        "Soap is essential for hygiene, but many families cannot afford enough. A girl who can make her own soap will never be without cleanliness.",
                    ],
                    bullets: [
                        "Making liquid soap from simple, affordable ingredients",
                        "Safety in handling chemicals",
                        "Mixing ratios and quality control",
                        "Cost calculation and pricing for sale",
                    ],
                },
                {
                    title: "3. Vaseline/Petroleum Jelly Making",
                    paragraphs: [
                        "Commercial Vaseline is expensive. A girl who can make her own will never have dry, cracked skin.",
                    ],
                },
                {
                    title: "4. Body Lotion Making",
                    paragraphs: [
                        "A girl who can make her own lotion will never feel less than. Affordable self-care, dignity, and an income-generating skill.",
                    ],
                },
                {
                    title: "5. Hair Care Products",
                    paragraphs: [
                        "Making simple hair oils and conditioners using natural ingredients like coconut oil, shea butter, and herbs.",
                    ],
                },
                {
                    title: "6. Tailoring and Basic Repairs",
                    paragraphs: [
                        "A torn uniform can lead to being sent home from school. A girl who can mend her own clothes will never be sent home.",
                    ],
                },
                {
                    title: "7. Basic Bookbinding and Notebook Making",
                    paragraphs: [
                        "Exercise books are expensive. A girl who can make her own notebooks will never run out of pages.",
                    ],
                },
                {
                    title: "8. Entrepreneurship and Financial Literacy",
                    paragraphs: [
                        "A girl who can sell what she makes will never be trapped. We teach cost calculation, pricing, bookkeeping, saving strategies, and customer service.",
                    ],
                },
                {
                    title: "9. Group Enterprise and Collective Selling",
                    paragraphs: [
                        "Girls form enterprise groups (5–10 members) to buy materials in bulk, sell together at markets, and save together through a village savings model.",
                    ],
                    impact: [
                        "Example: The \"Rise Sisters\" group — each girl earns 10,000–20,000 UGX per month",
                    ],
                },
            ],
        },
    ],
    impactTable: {
        title: "The Impact of Building the Ladder",
        rows: [
            { before: "5% can make reusable pads", after: "95% can make reusable pads" },
            { before: "2% can make liquid soap", after: "85% can make liquid soap" },
            { before: "0% can make Vaseline/lotion", after: "80% can make Vaseline/lotion" },
            { before: "10% can repair own clothes", after: "75% can repair own clothes" },
            { before: "0 UGX monthly income", after: "15,000–50,000 UGX monthly income" },
            { before: "15% feel capable & independent", after: "90% feel capable & independent" },
        ],
    },
    donationTiers: [
        { amount: "$10 (35,000 UGX)", description: "Life skills starter kit for one girl" },
        { amount: "$25 (90,000 UGX)", description: "Full life skills workshop for 20 girls" },
        { amount: "$50 (180,000 UGX)", description: "Startup materials for one enterprise group" },
        { amount: "$70 (250,000 UGX)", description: "Complete skills training for one school" },
        { amount: "$135 (500,000 UGX)", description: "Skills training for 50 girls" },
        { amount: "$270 (1,000,000 UGX)", description: "Permanent skills training corner in a Rise Room" },
    ],
    closing: [
        "A girl who can make her own pads will never be ashamed.",
        "A girl who can make her own soap will never be dirty.",
        "A girl who can make her own lotion will never feel less than.",
        "A girl who can earn her own money will never be trapped.",
        "This is true empowerment.",
    ],
};

const REACHING_NEW_ALTITUDES: ProgramDetail = {
    id: "reaching-new-altitudes",
    type: "pillar",
    title: "Reaching New Altitudes",
    heroSubtitle: "Leadership & Legacy",
    philosophy: {
        quote: "Rising is not the destination. Reaching back is.",
        paragraphs: [
            "At African Girl Rise, we do not measure success by how many girls complete our program. We measure success by what those girls do next.",
            "A girl who heals but stays silent has not fully risen. A girl who learns skills but keeps them to herself has not fully risen. True rising means reaching back.",
        ],
    },
    sections: [
        {
            title: "What We Mean by \"Altitudes\"",
            paragraphs: [
                "Rising is not a single event. It is a continuous journey. There is always higher to go.",
            ],
            bullets: [
                "First altitude: Healing — A girl learns she is not alone",
                "Second altitude: Skills — A girl learns she can provide for herself",
                "Third altitude: Rights — A girl learns she is protected by law",
                "Fourth altitude: Leadership — A girl learns she can change her community",
                "Fifth altitude: Legacy — A girl learns she can lift generations",
            ],
        },
        {
            title: "What We Do: Reaching New Altitudes",
            subsections: [
                {
                    title: "1. Leadership Training",
                    paragraphs: [
                        "We believe every girl is a leader — she just needs to discover it.",
                    ],
                    bullets: [
                        "Public speaking workshops and self-advocacy skills",
                        "Critical thinking: Analyzing and solving community problems",
                        "Teamwork, conflict resolution, building consensus",
                        "Project management: Setting goals, managing resources, evaluating outcomes",
                    ],
                },
                {
                    title: "2. Mentorship Program",
                    paragraphs: [
                        "Every girl needs someone who has walked the path before her.",
                    ],
                    bullets: [
                        "Local mentors: Teachers, nurses, businesswomen, community leaders",
                        "Professional mentors: Lawyers, doctors, entrepreneurs, activists",
                        "Peer mentors: Slightly older girls who recently completed our program",
                    ],
                    impact: [
                        "The mentor relationship is often the first time a girl has had an adult who believes in her unconditionally",
                    ],
                },
                {
                    title: "3. Career Exposure",
                    paragraphs: [
                        "You cannot become what you cannot imagine. Many girls have never met a female doctor, lawyer, or business owner.",
                    ],
                    bullets: [
                        "Career Days: Professionals visit to share their journeys",
                        "Exposure Tours: Visits to universities and organizations",
                        "Job Shadowing: A day with a professional",
                    ],
                },
                {
                    title: "4. Community Projects",
                    paragraphs: [
                        "Leadership is not theoretical. It is practiced. Every girl designs and implements a community project before she graduates.",
                    ],
                    impact: [
                        "A girl who has led one project will lead again",
                        "A girl who has changed one thing will try to change more",
                    ],
                },
                {
                    title: "5. The Rise Alumni Network",
                    paragraphs: [
                        "Our girls do not graduate and disappear. They become part of the Rise Alumni Network — a lifelong community.",
                    ],
                    bullets: [
                        "Ongoing mentorship opportunities",
                        "Access to job and training opportunities",
                        "Mentor at least one current girl each year",
                        "Live the motto: \"Rise. Then reach back. Always.\"",
                    ],
                },
                {
                    title: "6. Advanced Leadership Intensives",
                    paragraphs: [
                        "For girls with exceptional leadership potential:",
                    ],
                    bullets: [
                        "Week-long residential camps during school holidays",
                        "In-depth training on advocacy, organizing, and systems change",
                        "Exposure to national and regional leaders",
                        "Special projects with greater scope and visibility",
                    ],
                    impact: [
                        "These girls become our \"Rise Champions\" — leading the next generation of the movement",
                    ],
                },
                {
                    title: "7. Storytelling and Voice",
                    paragraphs: [
                        "A leader must be able to tell her story. She must advocate for herself and others.",
                    ],
                    bullets: [
                        "Telling their own stories with power and purpose",
                        "Speaking to different audiences (community, donors, media)",
                        "Advocating for issues affecting girls and women",
                        "Representing themselves and their communities with dignity",
                    ],
                },
            ],
        },
    ],
    impactTable: {
        title: "The Impact of Reaching New Altitudes",
        rows: [
            { before: "10% in leadership positions", after: "45% in leadership positions" },
            { before: "15% believe they can change community", after: "85% believe they can change community" },
            { before: "0% have led a community project", after: "100% have led a community project" },
            { before: "10% can speak publicly with confidence", after: "70% can speak publicly with confidence" },
            { before: "20% have a clear vision for their future", after: "90% have a clear vision" },
        ],
    },
    closing: [
        "Our ultimate goal is not to run programs forever.",
        "Our ultimate goal is to create so many leaders that the community no longer needs us.",
        "When every village has women who mentor girls. When every school has alumni who return to teach. When every girl knows she can rise because she has seen it happen.",
        "That is the altitude we are reaching for.",
    ],
};

/* =================================================================
   LOOKUP MAP
   ================================================================= */

export const PROGRAM_DETAIL_MAP: Record<string, ProgramDetail> = {
    "rise-rooms": RISE_ROOMS,
    "academic-rescue": ACADEMIC_RESCUE,
    "leadership-life-skills": LEADERSHIP_LIFE_SKILLS,
    "health-wellness": HEALTH_WELLNESS,
    "future-pathways": FUTURE_PATHWAYS,
    "healing-the-ground": HEALING_THE_GROUND,
    "building-the-ladder": BUILDING_THE_LADDER,
    "reaching-new-altitudes": REACHING_NEW_ALTITUDES,
};
