"""Editorial update in each of the site's sixteen existing languages."""
from pathlib import Path
import json

# Three genre / line / description groups, then overview, availability, platform, community.
content = {
'fr': [
 'Minecraft · Pirates & liberté', 'L’horizon n’est que le début.', 'Prenez le large, trouvez votre équipage et poursuivez vos rêves. Une aventure roleplay dans l’univers de One Piece se prépare, entre îles inconnues et destins à inventer.',
 'Minecraft · Survie & alliances', 'Ce qui nous reste, c’est nous.', 'Dans le monde de The Walking Dead, les rôdeurs ne sont pas la seule menace. Trouver un refuge, nouer des alliances et choisir à qui faire confiance : chaque rencontre peut changer votre histoire.',
 'Minecraft · Fantasy & exploration', 'De l’autre côté, tout commence.', 'Une porte s’ouvre sur Narnia. Des forêts anciennes, des royaumes oubliés et des rencontres extraordinaires : une nouvelle aventure roleplay se dessine, et votre histoire reste à écrire.',
 'Immersive Studio crée des univers Minecraft : magie, Pokémon, pirates, mythologie, héros et survie. Des mondes à explorer, des histoires à partager et des aventures dont vous êtes le personnage principal.',
 'L’Héritage de Poudlard est en développement. Les informations d’accès à Licaris sont sur son Discord. Les sept autres univers sont en préparation ; leurs dates et conditions d’accès seront annoncées sur les espaces officiels.',
 'Nos neuf projets sont créés pour Minecraft, autour du roleplay et de l’exploration. Licaris propose une aventure Pokémon avec Cobblemon. Les versions du jeu et les modalités d’accès sont précisées sur les espaces officiels des projets.',
 'Neuf projets Minecraft. Une même communauté.'
],
'en': [
 'Minecraft · Pirates & freedom', 'The horizon is only the beginning.', 'Set sail, find your crew and chase your dreams. A roleplay adventure in the world of One Piece is taking shape, with unknown islands and stories waiting to be written.',
 'Minecraft · Survival & alliances', 'What remains is each other.', 'In the world of The Walking Dead, walkers are not the only threat. Find shelter, build alliances and decide whom to trust. Every encounter can change your story.',
 'Minecraft · Fantasy & exploration', 'Beyond the door, it all begins.', 'A door opens into Narnia. Ancient forests, forgotten kingdoms and extraordinary encounters await in a new roleplay adventure. Your story is still unwritten.',
 'Immersive Studio creates Minecraft worlds of magic, Pokémon, pirates, mythology, heroes and survival. Explore new places, share stories and become the main character of your adventure.',
 'L’Héritage de Poudlard is in development. Access information for Licaris is on its Discord. The seven other worlds are in preparation; dates and access details will be announced through official channels.',
 'Our nine projects are built for Minecraft, around roleplay and exploration. Licaris brings Pokémon adventures through Cobblemon. Game versions and access details are shared through each project’s official channels.',
 'Nine Minecraft projects. One community.'
],
'de': [
 'Minecraft · Piraten & Freiheit', 'Der Horizont ist erst der Anfang.', 'Setze die Segel, finde deine Crew und folge deinen Träumen. Ein Rollenspielabenteuer in der Welt von One Piece entsteht, mit unbekannten Inseln und neuen Geschichten.',
 'Minecraft · Überleben & Bündnisse', 'Was uns bleibt, sind wir.', 'In der Welt von The Walking Dead sind Beißer nicht die einzige Gefahr. Finde Schutz, schließe Bündnisse und entscheide, wem du vertraust. Jede Begegnung kann deine Geschichte verändern.',
 'Minecraft · Fantasy & Entdeckung', 'Hinter der Tür beginnt alles.', 'Eine Tür öffnet sich nach Narnia. Uralte Wälder, vergessene Königreiche und außergewöhnliche Begegnungen: Ein neues Rollenspielabenteuer entsteht. Deine Geschichte wartet auf dich.',
 'Immersive Studio erschafft Minecraft-Welten voller Magie, Pokémon, Piraten, Mythologie, Helden und Überlebensabenteuer. Entdecke neue Orte und schreibe gemeinsam mit anderen deine Geschichte.',
 'L’Héritage de Poudlard ist in Entwicklung. Zugangsinformationen für Licaris findest du auf dessen Discord. Die sieben weiteren Welten sind in Vorbereitung; Termine und Zugang werden über offizielle Kanäle bekannt gegeben.',
 'Unsere neun Projekte entstehen in Minecraft und verbinden Rollenspiel mit Entdeckung. Licaris bietet Pokémon-Abenteuer mit Cobblemon. Spielversionen und Zugangsinformationen stehen auf den offiziellen Projektkanälen.',
 'Neun Minecraft-Projekte. Eine Gemeinschaft.'
],
'es': [
 'Minecraft · Piratas y libertad', 'El horizonte es solo el principio.', 'Zarpa, encuentra a tu tripulación y persigue tus sueños. Se prepara una aventura de rol en el universo de One Piece, entre islas desconocidas e historias por escribir.',
 'Minecraft · Supervivencia y alianzas', 'Lo que nos queda somos nosotros.', 'En el mundo de The Walking Dead, los caminantes no son la única amenaza. Busca refugio, forja alianzas y decide en quién confiar. Cada encuentro puede cambiar tu historia.',
 'Minecraft · Fantasía y exploración', 'Al otro lado, todo comienza.', 'Se abre una puerta hacia Narnia. Bosques antiguos, reinos olvidados y encuentros extraordinarios: una nueva aventura de rol toma forma y tu historia aún está por escribir.',
 'Immersive Studio crea universos de Minecraft con magia, Pokémon, piratas, mitología, héroes y supervivencia. Mundos que explorar e historias que compartir, contigo como protagonista.',
 'L’Héritage de Poudlard está en desarrollo. La información de acceso a Licaris está en su Discord. Los otros siete universos están en preparación; las fechas y condiciones se anunciarán en los canales oficiales.',
 'Nuestros nueve proyectos se crean para Minecraft y combinan rol y exploración. Licaris ofrece aventuras Pokémon con Cobblemon. Las versiones y condiciones de acceso se detallan en los canales oficiales de cada proyecto.',
 'Nueve proyectos de Minecraft. Una comunidad.'
],
'it': [
 'Minecraft · Pirati e libertà', 'L’orizzonte è solo l’inizio.', 'Salpa, trova la tua ciurma e insegui i tuoi sogni. Prende forma un’avventura di ruolo nell’universo di One Piece, tra isole sconosciute e storie da scrivere.',
 'Minecraft · Sopravvivenza e alleanze', 'Ci restiamo noi.', 'Nel mondo di The Walking Dead, i vaganti non sono l’unica minaccia. Trova un rifugio, stringi alleanze e scegli di chi fidarti. Ogni incontro può cambiare la tua storia.',
 'Minecraft · Fantasy ed esplorazione', 'Oltre la porta, tutto comincia.', 'Una porta si apre su Narnia. Foreste antiche, regni dimenticati e incontri straordinari: una nuova avventura di ruolo prende forma e la tua storia è ancora da scrivere.',
 'Immersive Studio crea universi Minecraft tra magia, Pokémon, pirati, mitologia, eroi e sopravvivenza. Mondi da esplorare, storie da condividere e avventure di cui sei protagonista.',
 'L’Héritage de Poudlard è in sviluppo. Le informazioni di accesso a Licaris sono sul suo Discord. Gli altri sette universi sono in preparazione; date e condizioni saranno annunciate sui canali ufficiali.',
 'I nostri nove progetti nascono in Minecraft, tra gioco di ruolo ed esplorazione. Licaris offre un’avventura Pokémon con Cobblemon. Versioni e modalità di accesso sono indicate sui canali ufficiali dei progetti.',
 'Nove progetti Minecraft. Una comunità.'
],
'pt': [
 'Minecraft · Piratas e liberdade', 'O horizonte é só o começo.', 'Iça as velas, encontra a tua tripulação e segue os teus sonhos. Prepara-se uma aventura de roleplay no universo de One Piece, entre ilhas desconhecidas e histórias por escrever.',
 'Minecraft · Sobrevivência e alianças', 'Restamos uns aos outros.', 'No mundo de The Walking Dead, os mortos-vivos não são a única ameaça. Encontra abrigo, forma alianças e escolhe em quem confiar. Cada encontro pode mudar a tua história.',
 'Minecraft · Fantasia e exploração', 'Do outro lado, tudo começa.', 'Uma porta abre-se para Narnia. Florestas antigas, reinos esquecidos e encontros extraordinários: uma nova aventura de roleplay ganha forma e a tua história está por escrever.',
 'Immersive Studio cria universos Minecraft de magia, Pokémon, piratas, mitologia, heróis e sobrevivência. Mundos para explorar e histórias para partilhar, contigo como protagonista.',
 'L’Héritage de Poudlard está em desenvolvimento. As informações de acesso a Licaris estão no seu Discord. Os outros sete universos estão em preparação; datas e condições serão anunciadas nos canais oficiais.',
 'Os nossos nove projetos são criados para Minecraft, em torno do roleplay e da exploração. Licaris oferece aventuras Pokémon com Cobblemon. As versões e condições de acesso são indicadas nos canais oficiais de cada projeto.',
 'Nove projetos Minecraft. Uma comunidade.'
],
'nl': [
 'Minecraft · Piraten & vrijheid', 'De horizon is pas het begin.', 'Hijs de zeilen, vind je bemanning en volg je dromen. Een roleplayavontuur in de wereld van One Piece krijgt vorm, met onbekende eilanden en verhalen om te schrijven.',
 'Minecraft · Overleven & bondgenoten', 'We hebben elkaar nog.', 'In de wereld van The Walking Dead zijn walkers niet het enige gevaar. Zoek onderdak, sluit bondgenootschappen en kies wie je vertrouwt. Elke ontmoeting kan je verhaal veranderen.',
 'Minecraft · Fantasy & ontdekking', 'Achter de deur begint het.', 'Een deur opent naar Narnia. Oude bossen, vergeten koninkrijken en bijzondere ontmoetingen: een nieuw roleplayavontuur krijgt vorm. Jouw verhaal moet nog worden geschreven.',
 'Immersive Studio creëert Minecraft-werelden vol magie, Pokémon, piraten, mythologie, helden en overleving. Ontdek nieuwe plekken en deel verhalen waarin jij de hoofdrol speelt.',
 'L’Héritage de Poudlard is in ontwikkeling. Toegangsinformatie voor Licaris staat op de eigen Discord. De zeven andere werelden zijn in voorbereiding; data en voorwaarden volgen via de officiële kanalen.',
 'Onze negen projecten worden gemaakt voor Minecraft, rond roleplay en ontdekking. Licaris biedt Pokémon-avonturen met Cobblemon. Spelversies en toegangsinformatie staan op de officiële projectkanalen.',
 'Negen Minecraft-projecten. Eén community.'
],
'pl': [
 'Minecraft · Piraci i wolność', 'Horyzont to dopiero początek.', 'Wypłyń w morze, znajdź załogę i podążaj za marzeniami. Powstaje przygoda roleplay w świecie One Piece, pełna nieznanych wysp i historii do napisania.',
 'Minecraft · Przetrwanie i sojusze', 'Zostaliśmy sobie nawzajem.', 'W świecie The Walking Dead szwendacze nie są jedynym zagrożeniem. Znajdź schronienie, zawieraj sojusze i zdecyduj, komu zaufać. Każde spotkanie może zmienić twoją historię.',
 'Minecraft · Fantasy i odkrywanie', 'Za drzwiami wszystko się zaczyna.', 'Otwierają się drzwi do Narnii. Pradawne lasy, zapomniane królestwa i niezwykłe spotkania: powstaje nowa przygoda roleplay, a twoja historia czeka na napisanie.',
 'Immersive Studio tworzy światy Minecraft pełne magii, Pokémonów, piratów, mitologii, bohaterów i walki o przetrwanie. Odkrywaj nowe miejsca i przeżywaj wspólne historie.',
 'L’Héritage de Poudlard jest w trakcie tworzenia. Informacje o dostępie do Licaris są na jego Discordzie. Siedem pozostałych światów jest w przygotowaniu; daty i warunki zostaną podane w oficjalnych kanałach.',
 'Nasze dziewięć projektów powstaje w Minecraft, wokół roleplay i odkrywania. Licaris oferuje przygody Pokémon z Cobblemon. Wersje gry i zasady dostępu są podawane w oficjalnych kanałach projektów.',
 'Dziewięć projektów Minecraft. Jedna społeczność.'
],
'ru': [
 'Minecraft · Пираты и свобода', 'Горизонт — лишь начало.', 'Поднимайте паруса, собирайте команду и следуйте за мечтой. Готовится ролевое приключение во вселенной One Piece: неизведанные острова и истории, которые предстоит написать.',
 'Minecraft · Выживание и союзы', 'У нас остаёмся мы.', 'В мире The Walking Dead ходячие — не единственная угроза. Найдите убежище, заключайте союзы и решайте, кому доверять. Каждая встреча может изменить вашу историю.',
 'Minecraft · Фэнтези и исследования', 'За дверью всё начинается.', 'Открывается дверь в Нарнию. Древние леса, забытые королевства и необыкновенные встречи: рождается новое ролевое приключение, а ваша история ещё впереди.',
 'Immersive Studio создаёт миры Minecraft: магия, Pokémon, пираты, мифология, герои и выживание. Исследуйте новые места и делитесь историями, в которых вы — главный герой.',
 'L’Héritage de Poudlard находится в разработке. Информация о доступе к Licaris есть в его Discord. Семь остальных миров готовятся; даты и условия объявят в официальных каналах.',
 'Наши девять проектов создаются для Minecraft и посвящены ролевой игре и исследованиям. Licaris предлагает приключения Pokémon с Cobblemon. Версии игры и условия доступа указаны в официальных каналах проектов.',
 'Девять проектов Minecraft. Одно сообщество.'
],
'tr': [
 'Minecraft · Korsanlar ve özgürlük', 'Ufuk sadece başlangıç.', 'Yelken aç, mürettebatını bul ve hayallerinin peşinden git. One Piece evreninde bilinmeyen adalar ve yazılacak hikâyelerle dolu bir rol yapma macerası hazırlanıyor.',
 'Minecraft · Hayatta kalma ve ittifaklar', 'Geriye birbirimiz kalırız.', 'The Walking Dead dünyasında tek tehdit aylaklar değil. Sığınak bul, ittifaklar kur ve kime güveneceğini seç. Her karşılaşma hikâyeni değiştirebilir.',
 'Minecraft · Fantastik dünya ve keşif', 'Kapının ötesinde her şey başlar.', 'Narnia’ya bir kapı açılıyor. Kadim ormanlar, unutulmuş krallıklar ve olağanüstü karşılaşmalar: yeni bir rol yapma macerası şekilleniyor, hikâyen yazılmayı bekliyor.',
 'Immersive Studio; büyü, Pokémon, korsanlar, mitoloji, kahramanlar ve hayatta kalma temalı Minecraft dünyaları yaratır. Yeni yerler keşfet, hikâyeler paylaş ve kendi maceranın başkahramanı ol.',
 'L’Héritage de Poudlard geliştirme aşamasında. Licaris erişim bilgileri kendi Discord’unda. Diğer yedi evren hazırlık aşamasında; tarihler ve koşullar resmî kanallarda duyurulacak.',
 'Dokuz projemiz Minecraft için rol yapma ve keşif odaklı hazırlanıyor. Licaris, Cobblemon ile Pokémon maceraları sunuyor. Oyun sürümleri ve erişim bilgileri projelerin resmî kanallarında belirtiliyor.',
 'Dokuz Minecraft projesi. Tek topluluk.'
],
'id': [
 'Minecraft · Bajak laut & kebebasan', 'Cakrawala hanyalah awal.', 'Berlayarlah, temukan kru dan kejar impianmu. Petualangan roleplay di dunia One Piece sedang disiapkan, dengan pulau tak dikenal dan kisah yang menunggu ditulis.',
 'Minecraft · Bertahan hidup & aliansi', 'Yang tersisa adalah kita.', 'Di dunia The Walking Dead, walker bukan satu-satunya ancaman. Temukan tempat berlindung, bangun aliansi dan pilih siapa yang bisa dipercaya. Setiap pertemuan bisa mengubah kisahmu.',
 'Minecraft · Fantasi & penjelajahan', 'Di balik pintu, semua dimulai.', 'Sebuah pintu menuju Narnia terbuka. Hutan purba, kerajaan terlupakan dan pertemuan luar biasa: petualangan roleplay baru mulai terbentuk, dan kisahmu belum ditulis.',
 'Immersive Studio menciptakan dunia Minecraft tentang sihir, Pokémon, bajak laut, mitologi, pahlawan dan bertahan hidup. Jelajahi tempat baru dan bagikan kisah dengan dirimu sebagai tokoh utama.',
 'L’Héritage de Poudlard sedang dikembangkan. Informasi akses Licaris tersedia di Discord-nya. Tujuh dunia lainnya sedang disiapkan; tanggal dan syarat akses akan diumumkan melalui kanal resmi.',
 'Sembilan proyek kami dibuat untuk Minecraft, dengan fokus roleplay dan penjelajahan. Licaris menghadirkan petualangan Pokémon melalui Cobblemon. Versi permainan dan akses dijelaskan di kanal resmi proyek.',
 'Sembilan proyek Minecraft. Satu komunitas.'
],
'zh': [
 'Minecraft · 海盗与自由', '地平线只是起点。', '扬帆起航，寻找伙伴，追逐梦想。One Piece 世界中的角色扮演冒险正在筹备，未知的岛屿和全新的故事等你探索。',
 'Minecraft · 生存与联盟', '我们还有彼此。', '在 The Walking Dead 的世界里，行尸并非唯一的威胁。寻找庇护所，建立联盟，决定信任谁。每次相遇都可能改变你的故事。',
 'Minecraft · 奇幻与探索', '门的另一边，一切开始。', '通往纳尼亚的大门正在开启。古老森林、遗忘的王国与奇妙邂逅：一段新的角色扮演冒险正在成形，你的故事仍待书写。',
 'Immersive Studio 打造充满魔法、宝可梦、海盗、神话、英雄与生存挑战的 Minecraft 世界。探索新天地，分享故事，成为自己冒险的主角。',
 'L’Héritage de Poudlard 正在开发中。Licaris 的加入信息请查看其 Discord。其余七个世界正在筹备，开放日期与加入条件将通过官方渠道公布。',
 '我们的九个项目均基于 Minecraft，围绕角色扮演与探索展开。Licaris 通过 Cobblemon 带来宝可梦冒险。游戏版本和加入方式请查看各项目官方渠道。',
 '九个 Minecraft 项目，一个共同的社区。'
],
'ja': [
 'Minecraft · 海賊と自由', '水平線は、まだ始まり。', '帆を上げ、仲間を見つけ、夢を追いかけよう。未知の島々と新たな物語が待つ、One Piece の世界を舞台にしたロールプレイの冒険を準備中です。',
 'Minecraft · 生存と同盟', '残されたのは、私たち。', 'The Walking Dead の世界では、ウォーカーだけが脅威ではありません。避難場所を探し、同盟を結び、誰を信じるかを選ぶ。出会いが物語を変えていきます。',
 'Minecraft · ファンタジーと探索', '扉の向こうで、すべてが始まる。', 'ナルニアへの扉が開きます。古い森、忘れられた王国、不思議な出会い。新しいロールプレイの冒険が形になり、あなたの物語を待っています。',
 'Immersive Studio は、魔法、ポケモン、海賊、神話、ヒーロー、サバイバルをテーマに Minecraft の世界を制作しています。新たな場所を探検し、あなたが主役の物語を分かち合いましょう。',
 'L’Héritage de Poudlard は開発中です。Licaris の参加情報は専用 Discord をご確認ください。他の7つの世界は準備中で、日程や参加条件は公式チャンネルで発表します。',
 '9つのプロジェクトは Minecraft 向けに制作し、ロールプレイと探索を中心としています。Licaris では Cobblemon によるポケモンの冒険を楽しめます。バージョンや参加方法は各公式チャンネルをご確認ください。',
 '9つの Minecraft プロジェクト。ひとつのコミュニティ。'
],
'ko': [
 'Minecraft · 해적과 자유', '수평선은 시작일 뿐.', '돛을 올리고 동료를 찾아 꿈을 향해 나아가세요. 미지의 섬과 새로운 이야기가 기다리는 One Piece 세계의 롤플레이 모험을 준비하고 있습니다.',
 'Minecraft · 생존과 동맹', '우리에게 남은 건 서로.', 'The Walking Dead 세계에서 워커만이 위협은 아닙니다. 피난처를 찾고, 동맹을 맺고, 누구를 믿을지 결정하세요. 모든 만남이 당신의 이야기를 바꿀 수 있습니다.',
 'Minecraft · 판타지와 탐험', '문 너머에서 모든 것이 시작됩니다.', '나니아로 향하는 문이 열립니다. 오래된 숲, 잊힌 왕국, 놀라운 만남. 새로운 롤플레이 모험이 만들어지고 있으며 당신의 이야기는 아직 시작되지 않았습니다.',
 'Immersive Studio는 마법, 포켓몬, 해적, 신화, 영웅과 생존을 주제로 Minecraft 세계를 만듭니다. 새로운 장소를 탐험하고 당신이 주인공인 이야기를 함께 나누세요.',
 'L’Héritage de Poudlard는 개발 중입니다. Licaris 참여 정보는 전용 Discord에서 확인하세요. 나머지 일곱 세계는 준비 중이며 일정과 참여 조건은 공식 채널에서 발표합니다.',
 '아홉 프로젝트는 Minecraft에서 롤플레이와 탐험을 중심으로 제작됩니다. Licaris는 Cobblemon을 통한 포켓몬 모험을 제공합니다. 게임 버전과 참여 방법은 각 프로젝트의 공식 채널을 확인하세요.',
 '아홉 Minecraft 프로젝트. 하나의 커뮤니티.'
],
'ar': [
 'Minecraft · قراصنة وحرية', 'الأفق ليس إلا البداية.', 'أبحر، واعثر على طاقمك، واتبع أحلامك. يجري إعداد مغامرة تقمص أدوار في عالم One Piece، بين جزر مجهولة وقصص تنتظر أن تُكتب.',
 'Minecraft · بقاء وتحالفات', 'ما تبقى لنا هو بعضنا.', 'في عالم The Walking Dead، ليس الموتى السائرون التهديد الوحيد. ابحث عن مأوى، وابنِ تحالفات، واختر من تثق به. كل لقاء قد يغير قصتك.',
 'Minecraft · خيال واستكشاف', 'خلف الباب تبدأ الحكاية.', 'يُفتح باب إلى نارنيا. غابات عتيقة، وممالك منسية، ولقاءات استثنائية: تتشكل مغامرة جديدة لتقمص الأدوار، وقصتك ما زالت تنتظر الكتابة.',
 'يصنع Immersive Studio عوالم Minecraft من السحر وPokémon والقراصنة والأساطير والأبطال والبقاء. استكشف أماكن جديدة وشارك قصصًا تكون أنت بطلها.',
 'مشروع L’Héritage de Poudlard قيد التطوير. معلومات الانضمام إلى Licaris متاحة على Discord الخاص به. العوالم السبعة الأخرى قيد الإعداد، وستُعلن المواعيد وشروط الدخول عبر القنوات الرسمية.',
 'مشاريعنا التسعة مصممة للعبة Minecraft وتركز على تقمص الأدوار والاستكشاف. يقدم Licaris مغامرة Pokémon باستخدام Cobblemon. إصدارات اللعبة وشروط الدخول موضحة في القنوات الرسمية لكل مشروع.',
 'تسعة مشاريع Minecraft. مجتمع واحد.'
],
'hi': [
 'Minecraft · समुद्री डाकू और आज़ादी', 'क्षितिज बस शुरुआत है।', 'समुद्र की ओर निकलें, अपने साथी खोजें और सपनों का पीछा करें। One Piece की दुनिया में अनजान द्वीपों और नई कहानियों से भरा रोलप्ले रोमांच तैयार हो रहा है।',
 'Minecraft · अस्तित्व और गठबंधन', 'हमारे पास एक-दूसरे हैं।', 'The Walking Dead की दुनिया में वॉकर ही अकेला खतरा नहीं हैं। आश्रय खोजें, गठबंधन बनाएँ और तय करें कि किस पर भरोसा करना है। हर मुलाकात आपकी कहानी बदल सकती है।',
 'Minecraft · कल्पना और खोज', 'दरवाज़े के पार सब शुरू होता है।', 'नार्निया का दरवाज़ा खुल रहा है। प्राचीन जंगल, भूले हुए राज्य और अद्भुत मुलाकातें: एक नया रोलप्ले रोमांच आकार ले रहा है और आपकी कहानी अभी लिखी जानी है।',
 'Immersive Studio जादू, Pokémon, समुद्री डाकुओं, पौराणिक कथाओं, नायकों और अस्तित्व पर आधारित Minecraft संसार बनाता है। नई जगहें खोजें और उन कहानियों को साझा करें जिनके मुख्य पात्र आप हैं।',
 'L’Héritage de Poudlard विकास में है। Licaris में प्रवेश की जानकारी उसके Discord पर है। बाकी सात संसार तैयारी में हैं; तारीखों और प्रवेश की शर्तों की घोषणा आधिकारिक माध्यमों पर होगी।',
 'हमारी नौ परियोजनाएँ Minecraft के लिए रोलप्ले और खोज पर केंद्रित हैं। Licaris में Cobblemon के साथ Pokémon रोमांच है। गेम संस्करण और प्रवेश की जानकारी हर परियोजना के आधिकारिक माध्यमों पर मिलती है।',
 'नौ Minecraft परियोजनाएँ। एक समुदाय।'
]
}
keys = [f'{project}{field}' for project in ['onepiece','walkingdead','narnia'] for field in ['Genre','Line','Text']]
for locale, values in content.items():
    path=Path(__file__).resolve().parents[1]/'app/locales'/f'{locale}.json'
    data=json.loads(path.read_text(encoding='utf-8'))
    data={key:value for key,value in data.items() if not key.startswith(('newgen','last'))}
    data.update(zip(keys,values[:9]))
    for key in ['heroText','studioText','worldsText','metadataDescription']: data[key]=values[9]
    data['faq2A'],data['faq5A'],data['discordTagline']=values[10:]
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Updated {len(content)} locales')
