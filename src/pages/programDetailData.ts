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
    philosophy: {
        quote: string;
        paragraphs: string[];
    };
    sections: Section[];
    impactTable?: {
        title: string;
        rows: ImpactRow[];
    };
    stats?: StatItem[];
    story?: StoryBlock;
    byTheNumbers?: string[];
    donationTiers?: { amount: string; description: string }[];
    closing: string[];
}

const RISE_ROOMS: ProgramDetail = {
    id: "rise-rooms",
    type: "program",
    title: "The Rise Room Initiative",
    heroSubtitle: "Safe Spaces for Healing",
    philosophy: {
        quote: "A girl who is safe in her own mind can be safe anywhere.",
        paragraphs: [
            "We believe that healing is the first step to rising. You cannot ask a girl to focus on algebra when she is carrying the weight of trauma, hunger, or fear.",
            "The Rise Room is our answer. It is a dedicated, school-based sanctuary where girls find the safety, support, and resources they need to heal and thrive.",
        ],
    },
    sections: [
        {
            title: "What is a Rise Room?",
            paragraphs: [
                "A Rise Room is more than just a physical space. It is a ecosystem of support designed specifically for the adolescent girl.",
            ],
            bullets: [
                "A sanctuary from the pressures of poverty and the risks of violence.",
                "A hub where mental health meets physical wellness.",
                "A bridge between the school, the home, and the legal system.",
            ],
        },
        {
            title: "Key Components",
            subsections: [
                {
                    title: "1. Mental Health & Counseling",
                    paragraphs: [
                        "Every Rise Room is staffed by or connected to trained counselors who understand adolescent trauma.",
                    ],
                    bullets: [
                        "One-on-one counseling sessions",
                        "Peer support circles (The \"Rise Sisters\" model)",
                        "Art and music therapy for trauma expression",
                    ],
                },
                {
                    title: "2. The Education Drive",
                    paragraphs: [
                        "We eliminate the physical barriers that keep girls out of class.",
                    ],
                    bullets: [
                        "Provision of high-quality reusable sanitary pads",
                        "Emergency school supplies (books, pens, uniforms)",
                        "Hygiene kits and soap",
                    ],
                },
                {
                    title: "3. Mentorship & Life Skills",
                    paragraphs: [
                        "Safe spaces for learning things the classroom doesn't always teach.",
                    ],
                    bullets: [
                        "Financial literacy and saving workshops",
                        "Reproductive health and rights education",
                        "Public speaking and leadership development",
                    ],
                },
            ],
        },
    ],
    closing: [
        "In a Rise Room, a girl is not a victim. She is not a statistic. She is a sister, a student, and a rising leader.",
        "When we heal the ground, the girl can finally grow.",
    ],
};

const ACADEMIC_RESCUE: ProgramDetail = {
    id: "academic-rescue",
    type: "program",
    title: "Academic Rescue Program",
    heroSubtitle: "Closing the Gap",
    philosophy: {
        quote: "Education is the only ladder strong enough to reach across poverty.",
        paragraphs: [
            "Dropout is not a choice for most girls in Uganda; it is a consequence. It is the consequence of being unable to afford a pen, or being too ashamed to go to school during a period.",
            "The Academic Rescue Program is designed to catch girls before they fall, and lift them back up if they already have.",
        ],
    },
    sections: [
        {
            title: "How We Rescue",
            subsections: [
                {
                    title: "1. The Education Drive Support",
                    paragraphs: [
                        "We provide the essentials that ensure school attendance is not a luxury.",
                    ],
                    bullets: [
                        "Sanitary pad distribution to end period poverty",
                        "Scholastic materials support",
                        "Payment of critical school fees for girls at high risk of dropout",
                    ],
                },
                {
                    title: "2. Tutoring & Academic Support",
                    paragraphs: [
                        "Poverty often means missed days. We help girls catch up.",
                    ],
                    bullets: [
                        "After-school literacy and numeracy circles",
                        "Exam preparation support for P7, S4, and S6 candidates",
                        "Peer tutoring networks where older girls help younger ones",
                    ],
                },
                {
                    title: "3. STEM for Girls",
                    paragraphs: [
                        "We break the myth that science and technology are not for girls.",
                    ],
                    bullets: [
                        "Basic computer literacy workshops",
                        "Introduction to coding and digital tools",
                        "Science-based mentorship with female professionals",
                    ],
                },
            ],
        },
    ],
    closing: [
        "A girl in school is a girl with a future. A girl with a future is a girl who cannot be easily exploited.",
        "Rescue the education, and you rescue the life.",
    ],
};

const LEADERSHIP_LIFE_SKILLS: ProgramDetail = {
    id: "leadership-life-skills",
    type: "program",
    title: "Leadership & Life Skills",
    heroSubtitle: "Building the Inner Strength",
    philosophy: {
        quote: "Your beginning does not define your becoming.",
        paragraphs: [
            "We do not just want girls to survive; we want them to lead. Leadership starts with the self—having the confidence to speak, the skills to earn, and the wisdom to plan.",
            "Our Leadership & Life Skills curriculum is the toolkit every girl needs to build her own future.",
        ],
    },
    sections: [
        {
            title: "Curriculum Pillars",
            subsections: [
                {
                    title: "1. Financial Literacy & Entrepreneurship",
                    paragraphs: [
                        "Financial independence is the greatest protection against abuse.",
                    ],
                    bullets: [
                        "Basic bookkeeping and saving strategies",
                        "Micro-enterprise development (making liquid soap, crafts)",
                        "Village Savings and Loan Association (VSLA) models for older girls",
                    ],
                },
                {
                    title: "2. Public Speaking & Advocacy",
                    paragraphs: [
                        "A girl who can find her voice can change her world.",
                    ],
                    bullets: [
                        "Debate and public speaking workshops",
                        "Self-advocacy: Learning how to say 'No' and how to ask for help",
                        "Community leadership projects",
                    ],
                },
                {
                    title: "3. Digital Citizenship",
                    paragraphs: [
                        "Preparing girls for a digital world while keeping them safe online.",
                    ],
                    bullets: [
                        "Safe social media usage",
                        "Using digital tools for research and learning",
                        "Digital storytelling",
                    ],
                },
            ],
        },
    ],
    closing: [
        "A leader is not someone who stands above. A leader is someone who rises and reaches back.",
        "We are building a generation of girls who reach back.",
    ],
};

const HEALTH_WELLNESS: ProgramDetail = {
    id: "health-wellness",
    type: "program",
    title: "Health & Wellness",
    heroSubtitle: "Total Body & Mind Care",
    philosophy: {
        quote: "A healthy girl is a powerful girl.",
        paragraphs: [
            "Health is not just the absence of disease; it is the presence of dignity. For adolescent girls, health includes understanding their bodies, managing their cycles with pride, and knowing their reproductive rights.",
        ],
    },
    sections: [
        {
            title: "Our Health Focus",
            subsections: [
                {
                    title: "1. Menstrual Health Management (MHM)",
                    paragraphs: [
                        "Period shame is one of the biggest drivers of school dropout. We end it.",
                    ],
                    bullets: [
                        "Reusable pad-making workshops (skill-building + utility)",
                        "Reproductive system education",
                        "Destigmatization campaigns in schools",
                    ],
                },
                {
                    title: "2. Sexual & Reproductive Health & Rights (SRHR)",
                    paragraphs: [
                        "Knowledge is protection. We provide age-appropriate, rights-based health education.",
                    ],
                    bullets: [
                        "Prevention of early pregnancy and STIs",
                        "Understanding consent and bodily autonomy",
                        "Access to health referrals and youth-friendly services",
                    ],
                },
                {
                    title: "3. Nutrition & Self-Care",
                    paragraphs: [
                        "Strong bodies support strong minds.",
                    ],
                    bullets: [
                        "Nutrition workshops for families",
                        "Stress management and self-care techniques",
                        "Personal hygiene education",
                    ],
                },
            ],
        },
    ],
    closing: [
        "When a girl understands her body, she understands her power.",
        "Health is the foundation of every rise.",
    ],
};

const FUTURE_PATHWAYS: ProgramDetail = {
    id: "future-pathways",
    type: "program",
    title: "Future Pathways",
    heroSubtitle: "Connecting Dreams to Reality",
    philosophy: {
        quote: "You cannot become what you cannot imagine.",
        paragraphs: [
            "Many of the girls we work with have never met a female doctor, lawyer, or business owner. Their dreams are often limited by what they see in their immediate surroundings.",
            "Future Pathways expands their horizons, showing them that their potential is limitless.",
        ],
    },
    sections: [
        {
            title: "Pathways to Success",
            subsections: [
                {
                    title: "1. Career Exposure & Mentorship",
                    paragraphs: [
                        "We connect girls with professionals who have already walked the path.",
                    ],
                    bullets: [
                        "Career days with female professionals",
                        "Field trips to universities and workplaces",
                        "One-on-one mentorship matching",
                    ],
                },
                {
                    title: "2. Vocational Linkages",
                    paragraphs: [
                        "For girls who cannot continue with formal academics, we provide a different ladder.",
                    ],
                    bullets: [
                        "Partnerships with vocational training centers",
                        "Apprenticeship placements in tailoring, catering, and hair-dressing",
                        "Startup support for small businesses",
                    ],
                },
                {
                    title: "3. Higher Education Guidance",
                    paragraphs: [
                        "Supporting the transition from secondary school to the world beyond.",
                    ],
                    bullets: [
                        "University application support",
                        "Scholarship opportunity tracking",
                        "Bridge-to-university mentorship",
                    ],
                },
            ],
        },
    ],
    closing: [
        "A dream without a path is just a wish. We provide the map.",
        "From the village to the world—there is no limit to where they can go.",
    ],
};

    const RISE_BROTHERS: ProgramDetail = {
        id: "rise-brothers",
        type: "program",
        title: "Rise Brothers",
        heroSubtitle: "Building allies, breaking cycles, and helping boys rise alongside girls.",
        philosophy: {
            quote: "Strong boys support strong girls. Together, we rise.",
            paragraphs: [
                "At African Girl Rise, we believe sustainable change requires everyone — not just girls and women, but boys and men too.",
                "When boys understand the struggles girls face, they become protectors instead of bystanders. When boys learn to manage their own emotions, they break the cycle of toxic masculinity. When boys are equipped with empathy and practical skills, they rise alongside their sisters.",
            ],
        },
        sections: [
            {
                title: "Program Objectives",
                subsections: [
                    {
                        title: "Educate",
                        paragraphs: [
                            "Teach boys about gender equality, consent, and girls' rights so they understand the realities girls face and the role they can play in changing them.",
                        ],
                    },
                    {
                        title: "Empower",
                        paragraphs: [
                            "Give boys the language and tools to manage their own mental health, emotions, and pressure without shame.",
                        ],
                    },
                    {
                        title: "Engage",
                        paragraphs: [
                            "Turn boys into active allies who stand up against abuse, harassment, discrimination, and silence.",
                        ],
                    },
                    {
                        title: "Equip",
                        paragraphs: [
                            "Provide practical life skills such as sewing, hygiene, entrepreneurship, and household care so boys can be self-sufficient and supportive.",
                        ],
                    },
                ],
            },
            {
                title: "Program Components",
                subsections: [
                    {
                        title: "1. Mental Health and Emotional Literacy",
                        paragraphs: [
                            "Boys are often told to be strong, not cry, and man up. This silence destroys them. Rise Brothers creates safe spaces where boys can talk about their feelings without shame.",
                        ],
                        bullets: [
                            "Learn that vulnerability is not weakness",
                            "Recognize signs of depression, anxiety, and trauma in themselves and peers",
                            "Know where to seek help when they need support",
                        ],
                        impact: [
                            "Healthier boys who become healthier men",
                        ],
                    },
                    {
                        title: "2. Gender Equality and Allyship Workshops",
                        paragraphs: [
                            "We teach boys why girls miss school during their periods, what consent means in age-appropriate language, and how to recognize and interrupt abusive behavior among peers.",
                        ],
                        bullets: [
                            "Understand why early marriage and defilement are crimes",
                            "Practice speaking up when they witness harassment or harm",
                            "Learn to be active allies instead of passive observers",
                        ],
                        impact: [
                            "Boys who protect, not harm",
                        ],
                    },
                    {
                        title: "3. Pad-Making and Menstrual Health Education",
                        paragraphs: [
                            "Yes, boys can learn to make pads too. When boys understand how pads work and why girls need them, they stop teasing girls and grow up without shame around menstruation.",
                        ],
                        bullets: [
                            "Help sisters or friends in need",
                            "Join girls in joint pad-making workshops",
                            "Normalize periods and end stigma in school spaces",
                        ],
                        impact: [
                            "Normalizing periods and ending the stigma",
                        ],
                    },
                    {
                        title: "4. Life Skills for Self-Sufficiency",
                        paragraphs: [
                            "Just like girls, boys need practical skills they can use in daily life and for income generation.",
                        ],
                        bullets: [
                            "Soap-making, tailoring, and basic repairs",
                            "Financial literacy and entrepreneurship",
                            "Cooking and household management to break the idea that care work is women's work",
                        ],
                        impact: [
                            "Boys who can care for themselves and contribute to their families",
                        ],
                    },
                    {
                        title: "5. Peer Advocacy Network",
                        paragraphs: [
                            "Selected boys are trained as Rise Brothers Advocates who become a student-led safety net within their schools and communities.",
                        ],
                        bullets: [
                            "Educate other boys about gender equality",
                            "Identify peers who may be experiencing abuse or distress",
                            "Refer girls and boys to counselors, teachers, authorities, or other help",
                            "Lead school campaigns against bullying and gender-based violence",
                        ],
                        impact: [
                            "A student-led safety net",
                        ],
                    },
                    {
                        title: "6. Joint Activities with Girls",
                        paragraphs: [
                            "Some sessions bring Rise Brothers and Rise Girls together so both groups can understand each other's struggles and work side by side.",
                        ],
                        bullets: [
                            "Mixed mental health circles",
                            "Pad-making workshops with questions, learning, and cooperation",
                            "Community projects such as tree planting and clean-ups",
                            "Debates on what real strength and partnership look like",
                        ],
                        impact: [
                            "Building mutual respect and partnership from a young age",
                        ],
                    },
                ],
            },
            {
                title: "Program Structure",
                bullets: [
                    "Weekly — Boys-only mental health circles (1 hour)",
                    "Bi-weekly — Allyship and gender equality workshops (1 hour)",
                    "Monthly — Joint sessions with Rise Girls (2 hours)",
                    "Termly — Life skills training such as soap-making, tailoring, and practical care work (full day)",
                    "Annually — Rise Brothers Summit for leadership and advocacy training (weekend)",
                ],
            },
            {
                title: "What Rise Brothers Graduates With",
                checkmarks: [
                    "Certificate of completion",
                    "Deep understanding of gender equality and consent",
                    "Practical life skills including soap-making, basic sewing, and financial literacy",
                    "Mental health first aid knowledge",
                    "Membership in the Rise Brothers alumni network",
                    "A commitment to be an ally for life",
                ],
            },
            {
                title: "Why This Matters for African Girl Rise",
                paragraphs: [
                    "We cannot empower girls in isolation. Boys grow up to be fathers, husbands, teachers, police officers, and judges. If we change boys today, we change the system tomorrow.",
                    "A boy who learns empathy will raise daughters who are free. A boy who learns skills will never be trapped by toxic masculinity. A boy who becomes an ally will break cycles for generations.",
                ],
            },
        ],
        impactTable: {
            title: "Expected Impact",
            rows: [
                { before: "Boys tease girls about periods", after: "Boys support girls and defend them" },
                { before: "Boys bully weaker peers", after: "Boys intervene when they see bullying" },
                { before: "Boys are silent about their feelings", after: "Boys seek help and support each other" },
                { before: "Boys believe household work is for girls", after: "Boys cook, clean, and sew without shame" },
                { before: "Boys grow into men who perpetuate abuse", after: "Boys become men who protect and advocate" },
            ],
        },
        closing: [
            "Rise Brothers is about building a generation of boys who know that care, courage, empathy, and accountability belong to them too.",
            "When boys rise alongside girls, families change. Schools change. Communities change.",
            "Your beginning does not define your becoming.",
        ],
    };

/* =================================================================
   PILLARS DATA
   ================================================================= */

const HEALING_THE_GROUND: ProgramDetail = {
    id: "healing-the-ground",
    type: "pillar",
    title: "Healing the Ground",
    heroSubtitle: "Mental Health & Trauma Recovery",
    philosophy: {
        quote: "You cannot rise from broken ground.",
        paragraphs: [
            "Most girls in our communities are navigating silent crises. They have survived abuse, lived through extreme poverty, and carried the weight of adult responsibilities since childhood.",
            "If we don't address the trauma, any other support is temporary. Healing the Ground is about making sure a girl's foundation is strong enough to hold her future.",
        ],
    },
    sections: [
        {
            title: "Why \"The Ground\"?",
            paragraphs: [
                "In our agricultural communities, everyone knows that a seed won't grow in hard, rocky, or poisoned soil. You must till the land, remove the rocks, and nourish the earth first.",
                "Trauma is the 'poisoned soil'. Healing is the 'tilling'.",
            ],
        },
        {
            title: "What We Do: Healing the Ground",
            subsections: [
                {
                    title: "1. Safe Space Sanctuaries (Rise Rooms)",
                    paragraphs: [
                        "We establish dedicated physical rooms in schools where a girl can go just to 'be'. No judgment, no noise, no fear.",
                    ],
                    bullets: [
                        "Equipped with comfortable seating, art supplies, and calming resources",
                        "Staffed by trained peer supporters and adult counselors",
                        "Open for both scheduled therapy and emergency retreat",
                    ],
                },
                {
                    title: "2. Trauma-Informed Counseling",
                    paragraphs: [
                        "Standard counseling doesn't always work for deep-seated community trauma. We use specialized approaches:",
                    ],
                    bullets: [
                        "Narrative Therapy: Helping girls reclaim their story",
                        "Cognitive Behavioral Tools: Managing triggers and anxiety",
                        "Play and Art Therapy: For when words are too hard to find",
                    ],
                },
                {
                    title: "3. Peer Support Circles (Rise Sisters)",
                    paragraphs: [
                        "The most powerful healer for a girl is often another girl who understands.",
                    ],
                    bullets: [
                        "Weekly small-group circles led by trained older girls",
                        "A curriculum of shared vulnerability and resilience-building",
                        "Creating a 'sisterhood safety net' that exists outside the meetings",
                    ],
                },
                {
                    title: "4. Crisis Response & Stabilization",
                    paragraphs: [
                        "When a girl is in immediate danger (abuse, homelessness, acute distress), we act immediately.",
                    ],
                    bullets: [
                        "Emergency counseling and safe-placement support",
                        "Legal and medical referrals",
                        "Family mediation where safe and appropriate",
                    ],
                },
            ],
        },
    ],
    impactTable: {
        title: "The Impact of Healing",
        rows: [
            { before: "80% feel alone in their struggles", after: "15% feel alone" },
            { before: "60% experience frequent trauma triggers", after: "25% (with tools to manage them)" },
            { before: "10% have a trusted adult to talk to", after: "95% have a trusted adult" },
            { before: "Low self-worth and agency", after: "High sense of 'Becoming'" },
        ],
    },
    closing: [
        "Healing is not a one-time event; it is a lifestyle.",
        "When a girl heals, her family heals. When a family heals, a village rises.",
    ],
};

const BUILDING_THE_LADDER: ProgramDetail = {
    id: "building-the-ladder",
    type: "pillar",
    title: "Building the Ladder",
    heroSubtitle: "Practical Skills for Self-Sufficiency",
    philosophy: {
        quote: "Rising requires tangible steps.",
        paragraphs: [
            "Hope alone cannot pay school fees. Empathy alone cannot buy a sanitary pad. For a girl to stay in school and stay safe, she needs tools.",
            "Building the Ladder is about providing the practical, hands-on resources and skills that make education possible and independence reachable.",
        ],
    },
    sections: [
        {
            title: "What Is The \"Ladder\"?",
            paragraphs: [
                "The ladder is made of two things: Scholastic Support (what she needs to stay in school) and Economic Skills (what she needs to stand on her own).",
            ],
        },
        {
            title: "What We Do: Building the Ladder",
            subsections: [
                {
                    title: "1. The Education Drive Support",
                    paragraphs: [
                        "We remove the small barriers that cause big dropouts.",
                    ],
                    bullets: [
                        "Reusable sanitary pad kits for every girl",
                        "Basic scholastic materials (books, pens, mathematical sets)",
                        "Support for girls at risk of being sent home for missing supplies",
                    ],
                },
                {
                    title: "2. Menstrual Health Management (MHM) Training",
                    paragraphs: [
                        "We don't just give pads; we teach girls how to make them.",
                    ],
                    bullets: [
                        "Sewing and maintenance of high-quality reusable pads",
                        "Biological education to end period shame",
                        "Teaching girls to train others, creating a ripple effect",
                    ],
                },
                {
                    title: "3. Academic Rescue Centers",
                    paragraphs: [
                        "School isn't just about attending; it's about succeeding.",
                    ],
                    bullets: [
                        "Holiday revision camps for candidate classes",
                        "Weekend literacy and numeracy support",
                        "Digital literacy training in basic computer skills",
                    ],
                },
                {
                    title: "4. Liquid Soap & Detergent Making",
                    paragraphs: [
                        "A simple, high-demand skill that generates immediate income.",
                    ],
                },
                {
                    title: "5. Hairdressing & Braiding",
                    paragraphs: [
                        "Training in professional styles to enable girls to work within their communities.",
                    ],
                },
                {
                    title: "6. Tailoring and Fabric Arts",
                    paragraphs: [
                        "From basic repairs to making clothes—a lifelong trade.",
                    ],
                },
                {
                    title: "7. Vaseline and Lotion Production",
                    paragraphs: [
                        "Teaching girls to create personal care products for use and sale.",
                    ],
                },
                {
                    title: "8. Financial Literacy & Bookkeeping",
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
    "rise-brothers": RISE_BROTHERS,
    "healing-the-ground": HEALING_THE_GROUND,
    "building-the-ladder": BUILDING_THE_LADDER,
    "reaching-new-altitudes": REACHING_NEW_ALTITUDES,
};
