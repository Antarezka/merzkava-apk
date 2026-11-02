import type { AppLanguage } from "../i18n";

type LetterCopy = { title: string; opening: string; memory: string; gratitude: string; care: string; hope: string; signoff: string; farewell: string };
const copies: Record<AppLanguage, LetterCopy> = {
  en: {
    title:"To My Creations, If These Words Find You",
    opening:"This is what I have to leave behind in my final moments.",
    memory:"If you happen to stumble upon these creations and find even a little joy in them, please remember this: I made them for no grand purpose. They were simply something to hold on to during my humble, little, and sometimes unfortunate life.",
    gratitude:"And even if, by the time you read this, I am already gone—or perhaps no longer here to see you enjoy them—I want you to know that I was grateful for every moment I spent creating them. Thank you for being here, and for finding something to love in the little world I made.",
    care:"Please, take care of yourself. Be gentle with your heart. Never hurt yourself, not even when it feels as though no one is standing beside you, or when even faith itself seems to have turned away. You deserve kindness. You deserve to keep going. You deserve to love yourself, even on the days when that feels impossible.",
    hope:"I hope these creations bring you a little warmth, a little wonder, or simply a place to rest for a while.",
    signoff:"With all the gratitude I have,",
    farewell:"Farewell, and take care."
  },
  id: {
    title:"Untuk Ciptaanku, Jika Kata-Kata Ini Menemukanmu",
    opening:"Inilah sesuatu yang ingin kutinggalkan pada saat-saat terakhirku.",
    memory:"Jika suatu hari kamu menemukan karya-karya ini dan merasakan sedikit kebahagiaan darinya, ingatlah: aku membuat semuanya bukan untuk tujuan besar. Ini hanyalah sesuatu yang bisa kugenggam selama menjalani hidupku yang sederhana, kecil, dan terkadang kurang beruntung.",
    gratitude:"Jika saat kamu membacanya aku sudah pergi—atau tak lagi ada untuk melihatmu menikmatinya—ketahuilah bahwa aku bersyukur atas setiap saat yang kuhabiskan untuk menciptakannya. Terima kasih sudah datang dan menemukan sesuatu untuk disayangi dalam dunia kecil yang kubuat.",
    care:"Tolong jaga dirimu. Berbaik hatilah pada hatimu sendiri. Jangan pernah menyakiti dirimu, bahkan ketika rasanya tak ada seorang pun di sisimu, atau bahkan iman terasa berpaling. Kamu pantas menerima kebaikan. Kamu pantas terus melangkah. Kamu pantas menyayangi dirimu sendiri, bahkan pada hari-hari ketika itu terasa mustahil.",
    hope:"Semoga karya-karya ini memberimu sedikit kehangatan, keajaiban, atau sekadar tempat untuk beristirahat sejenak.",
    signoff:"Dengan seluruh rasa syukur yang kumiliki,",
    farewell:"Selamat tinggal, dan jaga dirimu."
  },
  pt: {
    title:"Às Minhas Criações, Se Estas Palavras Chegarem Até Você",
    opening:"Estas são as palavras que deixo para trás nos meus últimos momentos.",
    memory:"Se algum dia encontrar estas criações e sentir nelas um pouco de alegria, lembre-se: não as fiz por um grande propósito. Foram apenas algo a que me agarrar durante uma vida humilde, pequena e, por vezes, desafortunada.",
    gratitude:"E mesmo que, quando ler isto, eu já tenha partido — ou talvez já não esteja aqui para ver você apreciá-las — quero que saiba que fui grato por cada instante dedicado a criá-las. Obrigado por estar aqui e por encontrar algo para amar no pequeno mundo que fiz.",
    care:"Por favor, cuide de si. Seja gentil com o próprio coração. Nunca se machuque, nem mesmo quando parecer que ninguém está ao seu lado, ou quando até a fé parecer ter se afastado. Você merece bondade. Merece continuar. Merece amar a si mesmo, até nos dias em que isso parecer impossível.",
    hope:"Espero que estas criações lhe tragam um pouco de calor, encanto ou simplesmente um lugar para descansar por algum tempo.",
    signoff:"Com toda a gratidão que tenho,",
    farewell:"Adeus, e cuide-se."
  },
  fr: {
    title:"À Mes Créations, Si Ces Mots Vous Parviennent",
    opening:"Voici ce que je laisse derrière moi en ces derniers instants.",
    memory:"Si vous découvrez un jour ces créations et qu'elles vous apportent ne serait-ce qu'un peu de joie, souvenez-vous que je ne les ai pas faites pour une grande cause. Elles étaient simplement quelque chose à quoi me raccrocher durant ma vie humble, modeste et parfois malheureuse.",
    gratitude:"Même si, au moment où vous lirez ces lignes, je suis déjà parti — ou peut-être plus là pour vous voir les apprécier — sachez que j'ai été reconnaissant pour chaque instant passé à les créer. Merci d'être ici et d'avoir trouvé quelque chose à aimer dans le petit monde que j'ai façonné.",
    care:"Prenez soin de vous. Soyez doux avec votre cœur. Ne vous faites jamais de mal, même lorsque personne ne semble être à vos côtés, ou lorsque même la foi paraît vous avoir abandonné. Vous méritez la bonté. Vous méritez de continuer. Vous méritez de vous aimer, même les jours où cela semble impossible.",
    hope:"J'espère que ces créations vous offriront un peu de chaleur, d'émerveillement, ou simplement un endroit où vous reposer un moment.",
    signoff:"Avec toute ma gratitude,",
    farewell:"Adieu, et prenez soin de vous."
  },
  ru: {
    title:"Моим творениям, если эти слова найдут вас",
    opening:"Это то, что я оставляю после себя в последние мгновения.",
    memory:"Если однажды вы случайно наткнётесь на эти творения и найдёте в них хоть немного радости, помните: я создавал их не ради великой цели. Они были просто тем, за что можно было держаться в моей скромной, маленькой и порой несчастливой жизни.",
    gratitude:"И даже если к тому времени, когда вы прочтёте это, меня уже не будет — или я не смогу увидеть, как вы ими наслаждаетесь, — знайте: я был благодарен за каждое мгновение, проведённое за их созданием. Спасибо, что вы здесь и нашли что-то дорогое в маленьком мире, который я создал.",
    care:"Пожалуйста, берегите себя. Будьте добры к своему сердцу. Никогда не причиняйте себе вреда, даже когда кажется, что рядом никого нет или даже вера отвернулась от вас. Вы заслуживаете доброты. Вы заслуживаете идти дальше. Вы заслуживаете любить себя, даже в те дни, когда это кажется невозможным.",
    hope:"Надеюсь, эти творения подарят вам немного тепла, удивления или просто место, где можно ненадолго отдохнуть.",
    signoff:"Со всей моей благодарностью,",
    farewell:"Прощайте и берегите себя."
  },
  ja: {
    title:"私の創作物へ、この言葉があなたに届くなら",
    opening:"これが、最期の時に私が残していく言葉です。",
    memory:"もし偶然この創作物を見つけ、ほんの少しでも楽しんでもらえたなら、覚えていてください。私は大それた目的のために作ったのではありません。ささやかで、小さく、ときに不運だった人生の中で、ただ心の支えにできるものが欲しかったのです。",
    gratitude:"あなたがこれを読む頃、私がもういなくなっていたとしても、あるいは楽しむ姿を見届けられなくても、創作に費やした一瞬一瞬に感謝していたことを知っていてください。ここにいてくれて、私の小さな世界に愛せるものを見つけてくれて、ありがとう。",
    care:"どうか自分を大切にしてください。自分の心に優しくしてください。誰もそばにいないと感じる時も、信じる心さえ離れてしまったように思える時も、自分を傷つけないでください。あなたは優しさを受け取る価値があります。歩み続ける価値があります。難しい日であっても、自分を愛する価値があります。",
    hope:"この創作物が、少しの温もりや驚き、あるいはひと休みできる場所を届けられますように。",
    signoff:"心からの感謝を込めて、",
    farewell:"さようなら。どうかお元気で。"
  },
  "zh-CN": {
    title:"致我的创作：如果这些文字恰好被你读到",
    opening:"这是我想在最后时刻留下的话。",
    memory:"如果你偶然发现这些作品，并从中得到哪怕一点快乐，请记住：我创作它们并非为了什么宏大的目的。它们只是我在平凡、渺小、有时也不太幸运的人生里，用来支撑自己的东西。",
    gratitude:"即使你读到这些时，我已经离开，或许再也无法看到你享受它们，也请知道：创作它们的每一刻，我都心怀感激。谢谢你来到这里，也谢谢你在我创造的小小世界里找到值得喜爱的东西。",
    care:"请照顾好自己，温柔地对待自己的心。即使感觉身边空无一人，甚至连信念都似乎转身离去，也不要伤害自己。你值得被善待，值得继续走下去，也值得爱自己——即使有些日子，这一切看起来都难以做到。",
    hope:"愿这些作品带给你一点温暖、一点惊喜，或只是一个可以暂时歇息的地方。",
    signoff:"带着我全部的感激，",
    farewell:"再见，请一定照顾好自己。"
  },
  ko: {
    title:"나의 창작물에게, 이 글이 당신에게 닿는다면",
    opening:"이것은 마지막 순간에 내가 남기고 싶은 말입니다.",
    memory:"우연히 이 창작물들을 발견하고 그 안에서 작은 기쁨이라도 얻었다면 기억해 주세요. 나는 거창한 목적을 위해 이것들을 만든 것이 아닙니다. 소박하고 작으며 때로는 불운했던 삶 속에서 붙잡을 무언가가 필요했을 뿐입니다.",
    gratitude:"당신이 이 글을 읽을 때 내가 이미 떠났거나, 더는 당신이 즐기는 모습을 볼 수 없더라도, 이것들을 만들며 보낸 모든 순간에 감사했다는 것을 알아주세요. 이곳에 와 주어서, 내가 만든 작은 세계에서 사랑할 무언가를 찾아 주어서 고맙습니다.",
    care:"부디 자신을 잘 돌봐 주세요. 자신의 마음에 다정해져 주세요. 곁에 아무도 없는 것처럼 느껴질 때에도, 믿음마저 등을 돌린 듯한 순간에도 자신을 해치지 마세요. 당신은 친절을 받을 자격이 있고, 계속 나아갈 자격이 있으며, 스스로를 사랑할 자격이 있습니다. 그게 불가능하게 느껴지는 날에도요.",
    hope:"이 창작물들이 당신에게 작은 온기와 경이로움, 혹은 잠시 쉬어 갈 곳이 되기를 바랍니다.",
    signoff:"진심 어린 감사를 담아,",
    farewell:"안녕히, 부디 몸과 마음을 잘 돌봐 주세요."
  }
};
function escapeHtml(value:string):string {
  return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]??char));
}
export function dustyLetterMarkup(language:AppLanguage,version:string):string {
  const letter=copies[language];
  return '<article class="dusty-letter" aria-label="'+escapeHtml(letter.title)+'"><div class="dusty-letter-dust" aria-hidden="true"></div><div class="dusty-letter-topline"><span>MERZKAVA UNIVERSE · APK '+escapeHtml(version)+' · PRIVATE ARCHIVE</span><span>UNSEALED MEMORY</span></div><div class="dusty-letter-heading"><div><span class="dusty-letter-kicker">A LETTER LEFT BEHIND</span><h2>'+escapeHtml(letter.title)+'</h2></div><div class="kitty-wax-seal" role="img" aria-label="Kitty wax seal"><img src="/kitty/shadow/kitty-shadow.png" alt="" /><img src="/kitty/ekor/kitty-tail.png" alt="" /><img src="/kitty/body/kitty-body.png" alt="" /><img src="/kitty/kepala/kitty-head.png" alt="" /></div></div><p>'+escapeHtml(letter.opening)+'</p><p>'+escapeHtml(letter.memory)+'</p><p>'+escapeHtml(letter.gratitude)+'</p><p>'+escapeHtml(letter.care)+'</p><p>'+escapeHtml(letter.hope)+'</p><p class="dusty-letter-signoff">'+escapeHtml(letter.signoff)+'</p><strong class="dusty-letter-author">Antarezka</strong><em class="dusty-letter-title">The Unfortunate Sleeping God</em><span class="dusty-letter-farewell">'+escapeHtml(letter.farewell)+'</span><div class="dusty-letter-foot"><span>神Neru | Eru</span><span>MERZKAVA</span></div></article>';
}
