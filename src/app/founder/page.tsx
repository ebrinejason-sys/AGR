import Image from 'next/image';
import styles from '../contact/page.module.css';

export default function FounderPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className="heading-xl">Meet the <span className="text-gradient">Founder</span></h1>
                <p className={styles.subtitle}>
                    &quot;I am simply a girl whose parents chose to break the cycle. That is the gift I want every girl to receive.&quot;
                </p>
            </div>

            <div className={styles.contentGrid}>
                <div className={`${styles.founderCard} ${styles.fullWidth}`}>
                    <div className={styles.founderImageContainer}>
                        <Image
                            src="/founder.jpg"
                            alt="Grace Akatwijuka"
                            width={200}
                            height={250}
                            priority
                            className={styles.founderImage}
                        />
                    </div>
                    <h2>Akatwijuka Grace</h2>
                    <p className={styles.role}>Founder &amp; Visionary Director</p>
                    <p className={styles.role}>African Girl Rise Initiative</p>

                    <div className={styles.bio}>
                        <p className={styles.founderQuote}>
                            &quot;My parents broke the cycle so I could rise. Now I help other girls do the same and raise daughters who will rise even higher.&quot;
                        </p>
                        <p>
                            Fourth-Year Law Student at Uganda Christian University. While pursuing her law degree, Grace founded the African Girl Rise Initiative, a registered Ugandan initiative dedicated to breaking cycles of poverty and empowering adolescent girls.
                        </p>
                        <p>
                            <strong>Core Belief:</strong> &quot;Your beginning does not define your becoming.&quot;
                        </p>
                        <p>
                            <strong>Life Motto:</strong> &quot;Rise. Then reach back.&quot;
                        </p>
                    </div>

                    <div className={styles.contactDetails}>
                        <h3>Direct Contact</h3>
                        <p><strong>Email:</strong> grace@africangirlrise.org</p>
                        <p><strong>Phone:</strong> 0763738733</p>
                        <p><strong>WhatsApp:</strong> +256703727965</p>
                        <p><strong>Website:</strong> africangirlriseltd.org</p>
                    </div>
                </div>
            </div>

            <div className={styles.fullStoryContainer}>
                <h2 className={styles.storyHeading}>AKATWIJUKA GRACE: FOUNDER & VISIONARY</h2>
                <h3 className={styles.storySubheading}>African Girl Rise Initiative</h3>

                <blockquote className={styles.mainQuote}>
                    &quot;My parents broke the cycle so I could rise. Now I help other girls do the same and raise daughters who will rise even higher.&quot;
                </blockquote>

                <section className={styles.storySection}>
                    <h3>Welcome</h3>
                    <p>Hello. I am Grace.</p>
                    <p>If you are reading this, you are someone who believes as I do that every girl deserves a chance to become who she was meant to be. You are someone who understands that a girl&apos;s beginning does not have to define her becoming.</p>
                    <p>This is my story. More importantly, this is the story of how we together can transform not just individual girls, but entire communities, one generation at a time.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>The Girl With Parents Who Refused to Pass On Their Suffering</h3>
                    <p>I grew up in Ibanda District, in the rolling hills of Western Uganda. It is a place of breathtaking beauty—green terraces, banana plantations, and skies that stretch forever. But beauty does not fill stomachs. Beauty does not pay school fees. Beauty does not protect a girl from the hard realities of poverty.</p>
                    <p>My family was not wealthy. We were, in fact, poor. But poverty was not the whole story.</p>
                    <p>The whole story is this: my parents refused to let their suffering become my inheritance.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>My Mother: The Girl Who Studied Through Everything</h3>
                    <p>My mother&apos;s life was hard from the very beginning.</p>
                    <p>She grew up in poverty so deep that she often walked to school hungry. She lacked proper uniforms, decent shoes, enough books. While other children had parents who could help with homework, she had no one—her own parents were uneducated and struggling simply to survive. There were days when studying felt impossible, when hunger made concentration a luxury she could not afford.</p>
                    <p>But she stayed in school.</p>
                    <p>She studied by kerosene lamp when there was kerosene. She walked kilometers on empty stomachs, determined that education would be her ladder out of poverty. She faced challenges I cannot fully imagine—and she kept going.</p>
                    <p>My mother completed her education despite everything.</p>
                    <p>That achievement—a girl from a poor village, with no resources, no connections, no safety net—is the foundation of everything I am. She proved that circumstances do not define destiny. She proved that determination, discipline, and faith can carry you through impossible odds.</p>
                    <p>And then she did something even more remarkable: she made sure my path would be easier than hers.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>My Father: The Boy Who Trusted God and Stayed in School</h3>
                    <p>My father&apos;s story is similar. He grew up with nothing. There was never enough money for school fees. There were days when studying felt impossible, when hunger gnawed at his belly while he tried to concentrate on his books.</p>
                    <p>But he had two things: discipline and faith.</p>
                    <p>He trusted God and kept going. He stayed in school when leaving would have been easier. He worked when there was work and prayed when there was none. He learned that education was the only inheritance he could ever give his children—and he was determined to give it.</p>
                    <p>My father completed his education through sheer stubborn faith.</p>
                    <p>He did not have an easy path. He did not have advantages. He had grit, prayer, and an unshakeable belief that tomorrow could be better than today.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>The Gift They Gave Me</h3>
                    <p>Here is what I need the world to understand:</p>
                    <p>My parents did not give me an easy life because they had easy lives. They gave me an easy life because they had hard lives and refused to pass that hardness on to me.</p>
                    <p className={styles.emphasis}>They broke the cycle.</p>
                    <p>My mother, who studied hungry, made sure I never knew hunger.</p>
                    <p>My father, who struggled for every term of school, made sure my fees were paid.</p>
                    <p>They worked. They sacrificed. They planned. They dreamed—not for themselves, but for me.</p>
                    <p>And because of them, I had something they never had: stability.</p>
                    <p>I did not have to worry about where my next meal would come from. I did not have to wonder if I would be pulled out of school. I did not have to carry the weight of survival while trying to learn. My parents carried that weight for me.</p>
                    <p>They created a good life for me so that I could focus on becoming who I was meant to be.</p>
                    <p>That is the greatest gift a parent can give a child. Not wealth. Not connections. Not privilege.</p>
                    <p className={styles.emphasis}>The gift of not having to fight the same battles they fought.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>The Girls Who Walked Beside Me</h3>
                    <p>I did not walk this path alone. I grew up with five girls who were my sisters in every way but blood—Annet, Grace, Mary, Robinah, and Sylvia.</p>
                    <p>We sat together on broken desks, sharing textbooks with missing pages. We walked the same dusty roads to school, our bare feet slapping against the red earth. We dreamed under the mango tree of the women we would become. When studying at Kiburara Primary school and Good Hope primary school.</p>
                    <p>Annet wanted to be a nurse. She could solve equations in her head faster than anyone.</p>
                    <p>Grace wanted to be a writer in the newspapers. She loved English so much and found pride in being well spoken person in English at our young age.</p>
                    <p>Mary wanted to be a teacher. She had the patience and kindness that children need.</p>
                    <p>Robinah wanted to be an artist. She could draw from nothing at all.</p>
                    <p>Sylvia wanted to travel the world. She dreamed beyond our village, beyond Uganda, beyond Africa.</p>
                    <p>We promised each other that we would all make it. We promised that we would rise together.</p>
                    <p>But life had different plans.</p>
                    <p>One by one, they fell away.</p>
                    <p>Annet was married at fifteen. Her father chose to educate her brothers instead. Her mathematics now calculates change at a market stall.</p>
                    <p>Grace dropped out when her father died and no relatives believed in girl education. Her notebooks gather dust somewhere, maybe burned, maybe lost.</p>
                    <p>Mary was told to stay home for her brother&apos;s secondary school to continue. She never became a teacher.</p>
                    <p>Robinah became pregnant. The teacher who promised to marry her disappeared. The school expelled her. He faced no consequences.</p>
                    <p>Sylvia was married at seventeen. A man old enough to be her grandfather paid her family a bride price. She became his third wife.</p>
                    <p>And I—I kept walking. I kept studying. I kept rising.</p>
                    <p>Why me? Why was I the one who made it while my friends were left behind?</p>
                    <p>The answer is simple: my parents chose differently.</p>
                    <p>They chose to break the cycle. They chose to give me a better life, not the same life they had lived. They chose to believe that their daughter was worth investing in, even when the world told them otherwise.</p>
                    <p>My friends&apos; parents loved their daughters. I know they did. But they had not yet learned that suffering does not have to be inherited.</p>
                    <p>That is the lesson I am determined to teach.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>What It Means to Break the Cycle</h3>
                    <p>When I say &quot;break the cycle,&quot; I mean something very specific.</p>
                    <p>I mean that a parent who grew up hungry chooses to feed their children, even if it means going without themselves.</p>
                    <p>I mean that a parent who was pulled out of school fights to keep their daughter in class, even when relatives question why they are &quot;wasting&quot; money on a girl.</p>
                    <p>I mean that a parent who was told they were not worth investing in looks at their daughter and says: &quot;You are worth everything.&quot;</p>
                    <p>Breaking the cycle is not easy. It requires sacrifice. It requires going against the grain of community expectations. It requires believing something that no one around you believes.</p>
                    <p>But it is possible. My parents proved it.</p>
                    <p>And here is the beautiful, transformative truth:</p>
                    <p>When a girl&apos;s parents break the cycle for her, she grows up knowing that things can be different. She grows up believing that her children do not have to struggle the way her parents struggled. And when she becomes a mother, she breaks the cycle for her own children.</p>
                    <p className={styles.emphasis}>This is how poverty ends. This is how communities transform. This is how nations rise.</p>
                    <p>One parent, one child, one generation at a time.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>The Ripple Effect: How One Girl Transforms Generations</h3>
                    <p>Imagine a girl named Brenda.</p>
                    <p>Brenda is fifteen. Her mother struggled—no education, early marriage, hard labour. But Brenda&apos;s mother heard our message and chose differently. She kept Brenda in school, even when it was hard.</p>
                    <p>Brenda receives counselling in a Rise Room. She heals from the trauma of poverty. She stays in school, passes her exams, graduates.</p>
                    <p>Brenda becomes a nurse. She earns an income. She marries a man who respects her—because she has learned to respect herself.</p>
                    <p>Brenda has a daughter. That daughter grows up with a mother who is educated, employed, and empowered. She never knows hunger. She never doubts that she will complete school. She never questions whether she is worth investing in.</p>
                    <p>That daughter becomes a doctor, a lawyer, an engineer, a teacher. She has children who have even more.</p>
                    <p className={styles.emphasis}>This is the ripple effect.</p>
                    <p>One girl, given a chance, transforms not just her own life but the lives of her children, her grandchildren, and generations yet unborn.</p>
                    <p>This is not charity. This is not pity. This is the most powerful investment any community can make.</p>
                    <p>This is what African Girl Rise Initiative is building.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>The Path to Law</h3>
                    <p>My parents supported every dream I ever had. When I wanted to be a Civil Engineer, they cheered. When I wanted to go to university, they sacrificed. When I discovered my calling in law, they said: &quot;Go. Become. We are with you.&quot;</p>
                    <p>I am currently in my fourth year of law school, pursuing a degree that I believe is essential to the work of breaking cycles and transforming communities. Now, through my law degree, I am equipping myself to fight for other girls to have the same chance.</p>
                    <p>I chose law because I understand that lasting change requires more than safe spaces and scholarships—it requires changing the systems that fail girls in the first place.</p>
                    <p>I did not choose law for prestige or wealth. I chose it because I have watched too many girls—my friends, my students, my community—fall through the gaps of a system that was never designed to catch them.</p>
                    <p>A lawyer has the power to change lives in moments where everything is on the line.</p>
                    <p>They stand as a shield between individuals and systems that are often cruel and unforgiving, giving strength to those who feel powerless and unheard. It&apos;s about choosing justice, even when the system is flawed.</p>
                    <p className={styles.emphasis}>That is what it truly means to be a lawyer.</p>
                    <p>I want to be the lawyer who:</p>
                    <ul>
                        <li>Stands between a girl and the teacher who would abuse her</li>
                        <li>Fights for policies that allow pregnant girls to return to school</li>
                        <li>Challenges discriminatory practices that favour boys over girls</li>
                        <li>Defends those who are punished for being victims</li>
                        <li>Uses the law as a tool for healing, not just punishment</li>
                    </ul>
                    <p>My law degree will serve my initiative. My initiative will serve my community. And my community—one girl at a time—will transform this nation.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>African Girl Rise Initiative: What We Do</h3>
                    <p>While studying law, I founded African Girl Rise Initiative—a registered Ugandan initiative dedicated to ensuring that no girl in my community walks the path my friends walked.</p>
                    <p>We are not an initiative that comes in from outside and tells communities what to do. We are of this community. We are from this community. We are for this community.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>What We Want Parents to Understand</h3>
                    <p>If you are a parent reading this, please hear me with your whole heart:</p>
                    <p className={styles.emphasis}>Your children do not have to suffer the way you suffered.</p>
                    <p>I know you love them. I know you want the best for them. But sometimes we carry a dangerous belief without even realizing it: &quot;I suffered, so my children must also suffer. That is how life is. That is how it has always been. That this is how they have to learn.&quot;</p>
                    <p>No.</p>
                    <p>That is not how life has to be. That is not how it should be. That is not how God intends it.</p>
                    <p>My parents proved that suffering does not have to be inherited. Struggle does not have to be a family tradition. Poverty does not have to pass from generation to generation.</p>
                    <p>The cycle can be broken. You have the power to break it.</p>
                    <p>When you keep your daughter in school—even when it&apos;s hard, even when relatives question you, even when the world tells you she&apos;s not worth it—you are not just educating a child.</p>
                    <p>You are changing your family&apos;s future for generations.</p>
                    <p>Your daughter will grow up and have children. Her children will have it easier because she had it easier. And their children will have it easier still.</p>
                    <p>This is how poverty ends. This is how communities transform. This is how nations rise.</p>
                    <p>It starts with one parent, one child, one impossible choice to do things differently.</p>
                    <p>My parents made that choice. I am the proof that it works.</p>
                    <p>You can be the proof for your daughter.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>What Happens When Girls Rise</h3>
                    <p>When a girl rises, she does not rise alone.</p>
                    <p>She rises, and her family rises with her. Her income lifts them from poverty. Her education ensures her children are educated. Her health protects her family&apos;s health. Her voice advocates for her community.</p>
                    <p>She rises, and her children rise higher. They grow up with a mother who believes in them, who models possibility, who has already proven that circumstances do not define destiny.</p>
                    <p>She rises, and her grandchildren rise higher still. By the third generation, poverty is a distant memory, a story their grandmother tells about &quot;the old days.&quot;</p>
                    <p>This is not speculation. This is evidence. Study after study shows that educating girls is the single highest-return investment available in the developing world.</p>
                    <p>And when that educated girl becomes a mother, she educates her own children. And her daughters educate theirs. And within two generations, a family moves from survival to thriving.</p>
                    <p>This is what African Girl Rise Initiative is building. Not quick fixes. Not temporary relief. Not charity that creates dependency.</p>
                    <p className={styles.emphasis}>Generational transformation. Cycle-breaking. Communities that heal themselves from within.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>The Vision</h3>
                    <p>My vision is simple and enormous:</p>
                    <p>I want every girl in Ibanda District—every girl in Uganda—every girl in Africa—to have the chance I had.</p>
                    <p>I want every girl to have parents who believe in her enough to break the cycle—parents who understand that their children do not have to suffer the way they suffered.</p>
                    <p>I want every girl to have a safe space to heal, a ladder to climb, and a community that celebrates her rising.</p>
                    <p>I want every girl who was left behind—every Annet, every Grace, every Mary, every Robinah, every Sylvia—to know that her life matters, that her dreams are valid, that her beginning does not define her becoming.</p>
                    <p>And I want every girl who rises to reach back and pull another up behind her.</p>
                    <p>This is not charity. This is not pity. This is justice.</p>
                    <p>This is what my parents taught me. This is what my friends sacrificed for. This is what I will spend my life building.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>How You Can Join This Movement</h3>
                    <p>You do not have to start an organization to change a girl&apos;s life. You do not have to be wealthy or powerful or famous. You simply have to do something.</p>
                    <p><strong>If you are a parent:</strong> Look at your daughter and ask yourself: Am I investing in her future the way my parents invested in mine? Am I breaking the cycle or passing it on? Choose differently. Choose her.</p>
                    <p><strong>If you are a teacher:</strong> Notice the quiet girls at the back of your classroom. The ones who are exhausted. The ones who never speak. They are carrying weights you cannot see. Be the person who asks: &quot;Are you okay?&quot; and means it.</p>
                    <p><strong>If you are a donor:</strong> Sponsor a girl. Fund a Rise Room. Support a scholarship. Your money, invested wisely, does not just change one life—it transforms generations.</p>
                    <p><strong>If you are a community leader:</strong> Advocate for girls&apos; education. Speak out against early marriage. Support policies that keep girls in school. Use your voice to amplify theirs.</p>
                    <p><strong>If you are a girl reading this:</strong> Hold on. I know you are tired. I know it feels impossible. But you are stronger than you know. Your beginning does not define your becoming. Find someone who believes in you. And when you rise—because you will—reach back.</p>
                </section>

                <section className={styles.storySection}>
                    <h3>In My Own Words</h3>
                    <blockquote className={styles.personalStatement}>
                        <p>&quot;I am not special. I am not unusually talented or unusually intelligent or unusually determined. I am simply a girl whose parents chose to break the cycle.</p>
                        <p>My mother studied hungry so I could study fed. My father struggled through school so my fees could be paid. They did not pass on their hardship. They passed on their hope.</p>
                        <p>That is the gift I want every girl to receive. Not wealth. Not privilege. Just parents who believe that their daughter&apos;s life can be better than their own.</p>
                        <p>And when that girl becomes a mother, she will give the same gift to her daughter. And her daughter to hers. And on and on, until poverty is nothing but a story we tell our grandchildren about the old days.</p>
                        <p>This is what African Girl Rise Initiative is about. This is what my law degree will serve. This is what I will spend my life doing.</p>
                        <p>Breaking cycles. One girl at a time. One family at a time. One generation at a time.</p>
                        <p>Rise. Then reach back. Always reach back.&quot;</p>
                        <p className={styles.signature}>— Akatwijuka Grace</p>
                    </blockquote>
                </section>

                <section className={styles.storySection}>
                    <h3>At a Glance</h3>
                    <div className={styles.atAGlance}>
                        <p><strong>Name:</strong> Akatwijuka Grace</p>
                        <p><strong>Role:</strong> Founder & Visionary Director</p>
                        <p><strong>Initiative:</strong> African Girl Rise Initiative (Registered)</p>
                        <p><strong>Location:</strong> Ibanda District, Western Uganda</p>
                        <p><strong>Education:</strong> Fourth-Year Law Student at Uganda Christian University</p>
                        <p><strong>Founded:</strong> African Girl Rise Initiative (Registered 2025)</p>
                        <p><strong>Rise Rooms:</strong> Across districts</p>
                        <p><strong>Girls Reached:</strong> 800+ through direct programs</p>
                        <p><strong>Core Belief:</strong> &quot;Your beginning does not define your becoming.&quot;</p>
                        <p><strong>Life Motto:</strong> &quot;Rise. Then reach back.&quot;</p>
                        <p><strong>Family Legacy:</strong> Daughter of parents who broke the cycle of poverty through education and faith</p>
                    </div>
                </section>

                <section className={styles.storySection}>
                    <h3>Connect With Grace</h3>
                    <p><strong>Email:</strong> grace@africangirlrise.org</p>
                    <p><strong>Phone:</strong> 0763738733</p>
                    <p><strong>WhatsApp:</strong> +256703727965</p>
                    <p><strong>Initiative Website:</strong> africangirlriseltd.org</p>
                </section>

                <section className={styles.closingSection}>
                    <p className={styles.closingText}>African Girl Rise Initiative</p>
                    <p className={styles.closingText}>Registered Ugandan Initiative</p>
                    <p className={styles.closingText}>Ibanda District, Western Uganda</p>
                    <p className={styles.emphasis}>&quot;Breaking cycles. One girl at a time. One generation at a time.&quot;</p>
                </section>
            </div>
        </div>
    );
}