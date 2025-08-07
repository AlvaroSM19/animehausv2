// AnimeHaus - One Piece Characters Database

export interface AnimeCharacter {
  id: string;
  name: string;
  crew: string | null;
  imageUrl: string;
  haki: boolean | null; // Made nullable to match database
  bounty: number | null;
  origin: string | null; // Made nullable to match database
  hakiTypes: string[];
  devilFruit: string | null;
  features?: string[]; // Made optional since not all characters have this
}

// One Piece Characters - First 20 from Database
export const ANIME_CHARACTERS: AnimeCharacter[] = [
{"id":"op-absalom","name":"Absalom","crew":"Thriller Bark Pirates","imageUrl":"/images/characters/op-absalom.webp","haki":false,"bounty":null,"origin":"Grand Line","hakiTypes":[],"devilFruit":"Clear-Clear Fruit","features":["animal-theme"]},
{"id":"op-ace","name":"Ace","crew":"Whitebeard Pirates","imageUrl":"/images/characters/op-ace.webp","haki":true,"bounty":550000000,"origin":"Baterilla","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":"Flame-Flame Fruit","features":["wears-hat","black-hair","scars"]},
{"id":"op-akainu","name":"Akainu","crew":"Marines","imageUrl":"/images/characters/op-akainu.webp","haki":true,"bounty":null,"origin":"North Blue","hakiTypes":["Armament","Observation"],"devilFruit":"Magma-Magma Fruit","features":["black-hair","scars"]},
{"id":"op-alvida","name":"Alvida","crew":"Buggy's Delivery","imageUrl":"/images/characters/op-alvida.webp","haki":false,"bounty":5000000,"origin":"East Blue","hakiTypes":[],"devilFruit":"Slip-Slip Fruit","features":["female"]},
{"id":"op-aokiji","name":"Aokiji","crew":"Blackbeard Pirates","imageUrl":"/images/characters/op-aokiji.webp","haki":true,"bounty":null,"origin":"South Blue","hakiTypes":["Armament","Observation"],"devilFruit":"Ice-Ice Fruit","features":["wears-glasses","scars"]},
{"id":"op-apoo","name":"Apoo","crew":"On Air Pirates","imageUrl":"/images/characters/op-apoo.webp","haki":false,"bounty":350000000,"origin":"Grand Line","hakiTypes":[],"devilFruit":"Tone-Tone Fruit","features":["musician"]},
{"id":"op-arlong","name":"Arlong","crew":"Arlong Pirates","imageUrl":"/images/characters/op-arlong.webp","haki":false,"bounty":20000000,"origin":"Fish-Man Island","hakiTypes":[],"devilFruit":null,"features":["animal-theme"]},
{"id":"op-augur","name":"Van Augur","crew":"Blackbeard Pirates","imageUrl":"/images/characters/op-augur.webp","haki":true,"bounty":64000000,"origin":"Unknown","hakiTypes":["Observation"],"devilFruit":"Wapu Wapu no Mi","features":["wears-glasses"]},
{"id":"op-bellamy","name":"Bellamy","crew":"Bellamy Pirates","imageUrl":"/images/characters/op-bellamy.webp","haki":false,"bounty":195000000,"origin":"North Blue","hakiTypes":[],"devilFruit":"Bane Bane no Mi","features":["blonde"]},
{"id":"op-bellemere","name":"Bell-mère","crew":"Marines","imageUrl":"/images/characters/op-bellemere.webp","haki":false,"bounty":null,"origin":"Cocoyasi Village","hakiTypes":[],"devilFruit":null,"features":["female"]},
{"id":"op-ben","name":"Ben Beckman","crew":"Red Hair Pirates","imageUrl":"/images/characters/op-ben.webp","haki":true,"bounty":null,"origin":"North Blue","hakiTypes":["Armament","Observation"],"devilFruit":null,"features":["smoker"]},
{"id":"op-bepo","name":"Bepo","crew":"Heart Pirates","imageUrl":"/images/characters/op-bepo.webp","haki":false,"bounty":500,"origin":"Zou","hakiTypes":[],"devilFruit":null,"features":["animal-theme","white-fur"]},
{"id":"op-bigmom","name":"Big Mom","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-bigmom.webp","haki":true,"bounty":4388000000,"origin":"Elbaf","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":"Soru Soru no Mi","features":["female"]},
{"id":"op-blackbeard","name":"Blackbeard","crew":"Blackbeard Pirates","imageUrl":"/images/characters/op-blackbeard.webp","haki":true,"bounty":3996000000,"origin":"Banaro Island","hakiTypes":["Armament","Observation"],"devilFruit":"Yami Yami no Mi, Gura Gura no Mi","features":["beard"]},
{"id":"op-blueno","name":"Blueno","crew":"World Government","imageUrl":"/images/characters/op-blueno.webp","haki":false,"bounty":null,"origin":"Water 7","hakiTypes":[],"devilFruit":"Door-Door Fruit","features":["wears-mustache"]},
{"id":"op-bonclay","name":"Bon Clay","crew":"Newkama Land","imageUrl":"/images/characters/op-bonclay.webp","haki":false,"bounty":32000000,"origin":"Momoiro","hakiTypes":[],"devilFruit":"Clone-Clone Fruit","features":["ballet","makeup"]},
{"id":"op-bonney","name":"Jewelry Bonney","crew":"Bonney Pirates","imageUrl":"/images/characters/op-bonney.webp","haki":false,"bounty":320000000,"origin":"Sorbet Kingdom","hakiTypes":[],"devilFruit":"Toshi Toshi no Mi","features":["female","pink-hair"]},
{"id":"op-brogy","name":"Brogy","crew":"Giant Warrior Pirates","imageUrl":"/images/characters/op-brogy.webp","haki":false,"bounty":100000000,"origin":"Elbaf","hakiTypes":[],"devilFruit":null,"features":["giant","helmet"]},
{"id":"op-brook","name":"Brook","crew":"Straw Hat Pirates","imageUrl":"/images/characters/op-brook.webp","haki":false,"bounty":383000000,"origin":"West Blue","hakiTypes":[],"devilFruit":"Revive-Revive Fruit","features":["musician","skeleton"]},
{"id":"op-brulee","name":"Brûlée","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-brulee.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":"Mirror-Mirror Fruit","features":["female","scars"]},
{"id":"op-buffalo","name":"Buffalo","crew":"Donquixote Pirates","imageUrl":"/images/characters/op-buffalo.webp","haki":false,"bounty":32000000,"origin":"North Blue","hakiTypes":[],"devilFruit":"Spin-Spin Fruit","features":["spins","round-hat"]},
{"id":"op-buggy","name":"Buggy","crew":"Cross Guild","imageUrl":"/images/characters/op-buggy.webp","haki":false,"bounty":3189000000,"origin":"Grand Line","hakiTypes":[],"devilFruit":"Chop-Chop Fruit","features":["red-nose","clown","wears-hat"]},
{"id":"op-burgess","name":"Jesus Burgess","crew":"Blackbeard Pirates","imageUrl":"/images/characters/op-burgess.webp","haki":true,"bounty":20000000,"origin":"North Blue","hakiTypes":["Armament","Observation"],"devilFruit":"Riki Riki no Mi","features":["wrestler","mask"]},
{"id":"op-caesar","name":"Caesar Clown","crew":null,"imageUrl":"/images/characters/op-caesar.webp","haki":false,"bounty":300000000,"origin":"South Blue","hakiTypes":[],"devilFruit":"Gas-Gas Fruit","features":["scientist","long-hair"]},
{"id":"op-caribou","name":"Caribou","crew":"Caribou Pirates","imageUrl":"/images/characters/op-caribou.webp","haki":false,"bounty":210000000,"origin":"East Blue","hakiTypes":[],"devilFruit":"Numa Numa no Mi","features":["long-tongue"]},
{"id":"op-carrot","name":"Carrot","crew":"Mink Tribe","imageUrl":"/images/characters/op-carrot.webp","haki":false,"bounty":null,"origin":"Zou","hakiTypes":[],"devilFruit":null,"features":["rabbit-ears","white-fur","female"]},
{"id":"op-cavendish","name":"Cavendish","crew":"Beautiful Pirates","imageUrl":"/images/characters/op-cavendish.webp","haki":true,"bounty":330000000,"origin":"Rommel Kingdom","hakiTypes":["Armament","Observation"],"devilFruit":null,"features":["blonde","sword","prince"]},
{"id":"op-charlos","name":"Charlos","crew":"World Government","imageUrl":"/images/characters/op-charlos.webp","haki":false,"bounty":null,"origin":"Mary Geoise","hakiTypes":[],"devilFruit":null,"features":["noble","wears-bubble"]},
{"id":"op-chinjao","name":"Don Chinjao","crew":"Happo Navy","imageUrl":"/images/characters/op-chinjao.webp","haki":true,"bounty":542000000,"origin":"Kano Country","hakiTypes":["Armament","Conqueror"],"devilFruit":null,"features":["pointed-head","old-man"]},
{"id":"op-chopper","name":"Chopper","crew":"Straw Hat Pirates","imageUrl":"/images/characters/op-chopper.webp","haki":false,"bounty":1000,"origin":"Drum Kingdom","hakiTypes":[],"devilFruit":"Human-Human Fruit","features":["antlers","blue-nose","small","wears-hat"]},
{"id":"op-cindry","name":"Cindry","crew":"Thriller Bark Pirates","imageUrl":"/images/characters/op-cindry.webp","haki":false,"bounty":null,"origin":"Saint Poplar","hakiTypes":[],"devilFruit":null,"features":["maid"]},
{"id":"op-cobra","name":"Cobra","crew":"Arabasta","imageUrl":"/images/characters/op-cobra.webp","haki":false,"bounty":null,"origin":"Arabasta","hakiTypes":[],"devilFruit":null,"features":["king","beard"]},
{"id":"op-corazon","name":"Donquixote Rosinante","crew":"Marines","imageUrl":"/images/characters/op-corazon.webp","haki":false,"bounty":null,"origin":"Mary Geoise","hakiTypes":[],"devilFruit":"Nagi Nagi no Mi","features":["coat","cigarette"]},
{"id":"op-cracker","name":"Charlotte Cracker","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-cracker.webp","haki":true,"bounty":860000000,"origin":"Totto Land","hakiTypes":["Armament","Observation"],"devilFruit":"Biscuit-Biscuit Fruit","features":["armor","sword"]},
{"id":"op-crocodile","name":"Crocodile","crew":"Cross Guild","imageUrl":"/images/characters/op-crocodile.webp","haki":false,"bounty":1965000000,"origin":"Arabasta","hakiTypes":[],"devilFruit":"Sand-Sand Fruit","features":["hook","scar","smokes"]},
{"id":"op-dadan","name":"Curly Dadan","crew":null,"imageUrl":"/images/characters/op-dadan.webp","haki":false,"bounty":null,"origin":"Goa Kingdom","hakiTypes":[],"devilFruit":null,"features":["big-woman","curly-hair"]},
{"id":"op-dalton","name":"Dalton","crew":"Sakura","imageUrl":"/images/characters/op-dalton.webp","haki":true,"bounty":null,"origin":"Drum Kingdom","hakiTypes":["Armament"],"devilFruit":"Uma Uma no Mi modelo bisonte","features":["horns","leader"]},
{"id":"op-denjiro","name":"Denjiro","crew":"Wano","imageUrl":"/images/characters/op-denjiro.webp","haki":true,"bounty":null,"origin":"Wano Country","hakiTypes":["Armament","Observation"],"devilFruit":null,"features":["samurai","ponytail"]},
{"id":"op-docq","name":"Doc Q","crew":"Blackbeard Pirates","imageUrl":"/images/characters/op-docq.webp","haki":false,"bounty":72000000,"origin":"North Blue","hakiTypes":[],"devilFruit":"Shiku Shiku no Mi","features":["sickly","horse"]},
{"id":"op-dochiriluk","name":"Hiriluk","crew":null,"imageUrl":"/images/characters/op-dochiriluk.webp","haki":false,"bounty":null,"origin":"Drum Kingdom","hakiTypes":[],"devilFruit":null,"features":["hat","beard"]},
{"id":"op-doflamingo","name":"Doflamingo","crew":"Donquixote Pirates","imageUrl":"/images/characters/op-doflamingo.webp","haki":true,"bounty":340000000,"origin":"North Blue","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":"String-String Fruit"},
{"id":"op-dorry","name":"Dorry","crew":"Giant Warrior Pirates","imageUrl":"/images/characters/op-dorry.webp","haki":false,"bounty":100000000,"origin":"Elbaf","hakiTypes":[],"devilFruit":null},
{"id":"op-drake","name":"X Drake","crew":"Drake Pirates","imageUrl":"/images/characters/op-drake.webp","haki":true,"bounty":222000000,"origin":"North Blue","hakiTypes":["Armament"],"devilFruit":"Ryu Ryu no Mi model Allosaurus"},
{"id":"op-enel","name":"Enel","crew":"Priests of Skypiea","imageUrl":"/images/characters/op-enel.webp","haki":true,"bounty":null,"origin":"Birka","hakiTypes":["Observation"],"devilFruit":"Goro Goro no Mi"},
{"id":"op-franky","name":"Franky","crew":"Straw Hat Pirates","imageUrl":"/images/characters/op-franky.webp","haki":false,"bounty":394000000,"origin":"Water 7","hakiTypes":[],"devilFruit":null},
{"id":"op-fujitora","name":"Fujitora","crew":"Marines","imageUrl":"/images/characters/op-fujitora.webp","haki":true,"bounty":null,"origin":"Desconocido","hakiTypes":["Armament","Observation"],"devilFruit":"Press-Press Fruit"},
{"id":"op-fukuro","name":"Fukuro","crew":"World Government","imageUrl":"/images/characters/op-fukuro.webp","haki":false,"bounty":null,"origin":"Desconocido","hakiTypes":[],"devilFruit":null},
{"id":"op-gaban","name":"Scopper Gaban","crew":"Roger Pirates","imageUrl":"/images/characters/op-gaban.webp","haki":true,"bounty":null,"origin":"Desconocido","hakiTypes":["Armament","Observation"],"devilFruit":null},
{"id":"op-gaimon","name":"Gaimon","crew":null,"imageUrl":"/images/characters/op-gaimon.webp","haki":false,"bounty":null,"origin":"East Blue","hakiTypes":[],"devilFruit":null},
{"id":"op-garling","name":"Garling","crew":"World Government","imageUrl":"/images/characters/op-garling.webp","haki":true,"bounty":null,"origin":"Mary Geoise","hakiTypes":[],"devilFruit":null},
{"id":"op-garp","name":"Garp","crew":"Marines","imageUrl":"/images/characters/op-garp.webp","haki":true,"bounty":null,"origin":"Goa Kingdom","hakiTypes":["Armament","Conqueror"],"devilFruit":null},
{"id":"op-hancock","name":"Boa Hancock","crew":"Kuja Pirates","imageUrl":"/images/characters/op-hancock.webp","haki":true,"bounty":1659000000,"origin":"Amazon Lily","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":"Mero Mero no Mi"},
{"id":"op-hatchan","name":"Hatchan","crew":"Ryugu","imageUrl":"/images/characters/op-hatchan.webp","haki":false,"bounty":8000000,"origin":"Fish-Man Island","hakiTypes":[],"devilFruit":null},
{"id":"op-hattor","name":"Hattori","crew":"World Government","imageUrl":"/images/characters/op-hattor.webp","haki":false,"bounty":null,"origin":"Desconocido","hakiTypes":[],"devilFruit":null},
{"id":"op-hawkins","name":"Basil Hawkins","crew":"Hawkins Pirates","imageUrl":"/images/characters/op-hawkins.webp","haki":true,"bounty":320000000,"origin":"North Blue","hakiTypes":["Observation"],"devilFruit":"Wara Wara no Mi"},
{"id":"op-helmeppo","name":"Helmeppo","crew":"Marines","imageUrl":"/images/characters/op-helmeppo.webp","haki":true,"bounty":null,"origin":"Shells Town","hakiTypes":["Observation"],"devilFruit":null},
{"id":"op-hiyori","name":"Hiyori","crew":"Wano","imageUrl":"/images/characters/op-hiyori.webp","haki":false,"bounty":null,"origin":"Wano","hakiTypes":[],"devilFruit":null},
{"id":"op-hodi","name":"Hody Jones","crew":"New Fish-Man Pirates","imageUrl":"/images/characters/op-hodi.webp","haki":false,"bounty":null,"origin":"Fish-Man Island","hakiTypes":[],"devilFruit":null},
{"id":"op-hogback","name":"Hogback","crew":"Thriller Bark Pirates","imageUrl":"/images/characters/op-hogback.webp","haki":false,"bounty":null,"origin":"West Blue","hakiTypes":[],"devilFruit":null},
{"id":"op-iceburg","name":"Iceburg","crew":"Galley-La Company","imageUrl":"/images/characters/op-iceburg.webp","haki":false,"bounty":null,"origin":"Water 7","hakiTypes":[],"devilFruit":null},
{"id":"op-igaram","name":"Igaram","crew":"Arabasta","imageUrl":"/images/characters/op-igaram.webp","haki":false,"bounty":null,"origin":"Arabasta","hakiTypes":[],"devilFruit":null},
{"id":"op-imu","name":"Imu","crew":"World Government","imageUrl":"/images/characters/op-imu.webp","haki":true,"bounty":null,"origin":"Desconocido","hakiTypes":[],"devilFruit":null},
{"id":"op-inuarashi","name":"Inuarashi","crew":"Wano","imageUrl":"/images/characters/op-inuarashi.webp","haki":true,"bounty":null,"origin":"Zou","hakiTypes":["Armament","Observation"],"devilFruit":null},
{"id":"op-ivankov","name":"Emporio Ivankov","crew":"Revolutionary Army","imageUrl":"/images/characters/op-ivankov.webp","haki":true,"bounty":null,"origin":"Kamabakka Kingdom","hakiTypes":["Armament"],"devilFruit":"Hormone-Hormone Fruit"},
{"id":"op-izo","name":"Izo","crew":"Whitebeard Pirates","imageUrl":"/images/characters/op-izo.webp","haki":true,"bounty":null,"origin":"Wano","hakiTypes":["Armament","Observation"],"devilFruit":null},
{"id":"op-jabra","name":"Jabra","crew":"World Government","imageUrl":"/images/characters/op-jabra.webp","haki":true,"bounty":null,"origin":"Desconocido","hakiTypes":["Armament"],"devilFruit":"Inu Inu no Mi Model Wolf"},
{"id":"op-jinbei","name":"Jinbe","crew":"Straw Hat Pirates","imageUrl":"/images/characters/op-jinbei.webp","haki":true,"bounty":1100000000,"origin":"Fish-Man Island","hakiTypes":["Armament","Observation"],"devilFruit":null},
{"id":"op-jupeter","name":"Jupeter","crew":"World Government","imageUrl":"/images/characters/op-jupeter.webp","haki":true,"bounty":null,"origin":"Mary Geoise","hakiTypes":[],"devilFruit":null},
{"id":"op-kaido","name":"Kaido","crew":"Beast Pirates","imageUrl":"/images/characters/op-kaido.webp","haki":true,"bounty":4611100000,"origin":"Vodka Kingdom","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":"Uo Uo no Mi Model Seiryu"},
{"id":"op-kaku","name":"Kaku","crew":"World Government","imageUrl":"/images/characters/op-kaku.webp","haki":true,"bounty":null,"origin":"Water 7","hakiTypes":["Armament","Observation"],"devilFruit":"Ushi Ushi no Mi Model Giraffe"},
{"id":"op-kalifa","name":"Kalifa","crew":"World Government","imageUrl":"/images/characters/op-kalifa.webp","haki":false,"bounty":null,"origin":"Water 7","hakiTypes":[],"devilFruit":"Bubble-Bubble Fruit"},
{"id":"op-kanjuro","name":"Kanjuro","crew":"Wano","imageUrl":"/images/characters/op-kanjuro.webp","haki":true,"bounty":null,"origin":"Wano","hakiTypes":["Armament"],"devilFruit":"Fude Fude no Mi"},
{"id":"op-katakuri","name":"Katakuri","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-katakuri.webp","haki":true,"bounty":1057000000,"origin":"Totto Land","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":"Mochi-Mochi Fruit"},
{"id":"op-kaya","name":"Kaya","crew":null,"imageUrl":"/images/characters/op-kaya.webp","haki":false,"bounty":null,"origin":"Syrup Village","hakiTypes":[],"devilFruit":null},
{"id":"op-kid","name":"Kid","crew":"Kid Pirates","imageUrl":"/images/characters/op-kid.webp","haki":true,"bounty":3000000000,"origin":"South Blue","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":"Jiki Jiki no Mi"},
{"id":"op-kikunojo","name":"Kikunojo","crew":"Wano","imageUrl":"/images/characters/op-kikunojo.webp","haki":true,"bounty":null,"origin":"Wano","hakiTypes":["Armament"],"devilFruit":null},
{"id":"op-killer","name":"Killer","crew":"Kid Pirates","imageUrl":"/images/characters/op-killer.webp","haki":true,"bounty":600000000,"origin":"South Blue","hakiTypes":["Armament","Observation"],"devilFruit":"Failed SMILE"},
{"id":"op-kinemon","name":"Kinemon","crew":"Wano","imageUrl":"/images/characters/op-kinemon.webp","haki":true,"bounty":null,"origin":"Wano","hakiTypes":["Armament","Observation"],"devilFruit":"Fuku Fuku no Mi"},
{"id":"op-king","name":"King","crew":"Beast Pirates","imageUrl":"/images/characters/op-king.webp","haki":true,"bounty":1390000000,"origin":"Lunaria Nation","hakiTypes":["Armament","Observation"],"devilFruit":"Ryu Ryu no Mi Model Pteranodon"},
{"id":"op-kizaru","name":"Kizaru","crew":"Marines","imageUrl":"/images/characters/op-kizaru.webp","haki":true,"bounty":null,"origin":"North Blue","hakiTypes":["Armament","Observation"],"devilFruit":"Glint-Glint Fruit"},
{"id":"op-koby","name":"Koby","crew":"Marines","imageUrl":"/images/characters/op-koby.webp","haki":true,"bounty":null,"origin":"East Blue","hakiTypes":["Observation"],"devilFruit":null},
{"id":"op-koza","name":"Koza","crew":null,"imageUrl":"/images/characters/op-koza.webp","haki":false,"bounty":null,"origin":"Arabasta","hakiTypes":[],"devilFruit":null},
{"id":"op-kuina","name":"Kuina","crew":null,"imageUrl":"/images/characters/op-kuina.webp","haki":false,"bounty":null,"origin":"Shimotsuki Village","hakiTypes":[],"devilFruit":null},
{"id":"op-kuma","name":"Bartholomew Kuma","crew":"Revolutionary Army","imageUrl":"/images/characters/op-kuma.webp","haki":false,"bounty":296000000,"origin":"Sorbet Kingdom","hakiTypes":[],"devilFruit":"Paw-Paw Fruit"},
{"id":"op-kureha","name":"Kureha","crew":null,"imageUrl":"/images/characters/op-kureha.webp","haki":false,"bounty":null,"origin":"Drum Kingdom","hakiTypes":[],"devilFruit":null},
{"id":"op-kuro","name":"Kuro","crew":null,"imageUrl":"/images/characters/op-kuro.webp","haki":false,"bounty":16000000,"origin":"Syrup Village","hakiTypes":[],"devilFruit":null},
{"id":"op-kyros","name":"Kyros","crew":null,"imageUrl":"/images/characters/op-kyros.webp","haki":true,"bounty":null,"origin":"Dressrosa","hakiTypes":["Armament"],"devilFruit":null},
{"id":"op-laboon","name":"Laboon","crew":null,"imageUrl":"/images/characters/op-laboon.webp","haki":false,"bounty":null,"origin":"West Blue","hakiTypes":[],"devilFruit":null},
{"id":"op-lafitte","name":"Lafitte","crew":"Blackbeard Pirates","imageUrl":"/images/characters/op-lafitte.webp","haki":true,"bounty":42200000,"origin":"West Blue","hakiTypes":["Observation"],"devilFruit":"Unknown"},
{"id":"op-law","name":"Law","crew":"Heart Pirates","imageUrl":"/images/characters/op-law.webp","haki":true,"bounty":3000000000,"origin":"Flevance","hakiTypes":["Armament","Observation"],"devilFruit":"Op-Op Fruit"},
{"id":"op-leo","name":"Leo","crew":"Tontatta Pirates","imageUrl":"/images/characters/op-leo.webp","haki":false,"bounty":null,"origin":"Tontatta Kingdom","hakiTypes":[],"devilFruit":null},
{"id":"op-lola","name":"Lola","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-lola.webp","haki":false,"bounty":24000000,"origin":"Totto Land","hakiTypes":[],"devilFruit":null},
{"id":"op-lucci","name":"Rob Lucci","crew":"World Government","imageUrl":"/images/characters/op-lucci.webp","haki":true,"bounty":null,"origin":"East Blue","hakiTypes":["Armament","Observation"],"devilFruit":"Neko Neko no Mi Model Leopard"},
{"id":"op-luckyroux","name":"Lucky Roux","crew":"Red Hair Pirates","imageUrl":"/images/characters/op-luckyroux.webp","haki":true,"bounty":null,"origin":"East Blue","hakiTypes":["Armament","Observation"],"devilFruit":null},
{"id":"op-luffy","name":"Luffy","crew":"Straw Hat Pirates","imageUrl":"/images/characters/op-luffy.webp","haki":true,"bounty":3000000000,"origin":"Foosha Village","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":"Hito Hito no Mi Model Nika"},
{"id":"op-magellan","name":"Magellan","crew":null,"imageUrl":"/images/characters/op-magellan.webp","haki":true,"bounty":null,"origin":"Grand Line","hakiTypes":["Armament"],"devilFruit":"Doku Doku no Mi"},
{"id":"op-makino","name":"Makino","crew":null,"imageUrl":"/images/characters/op-makino.webp","haki":false,"bounty":null,"origin":"Foosha Village","hakiTypes":[],"devilFruit":null},
{"id":"op-mansherry","name":"Mansherry","crew":null,"imageUrl":"/images/characters/op-mansherry.webp","haki":false,"bounty":null,"origin":"Dressrosa","hakiTypes":[],"devilFruit":"Chiyu Chiyu no Mi"},
{"id":"op-marco","name":"Marco","crew":"Whitebeard Pirates","imageUrl":"/images/characters/op-marco.webp","haki":true,"bounty":1374000000,"origin":"Sphinx Village","hakiTypes":["Armament","Observation"],"devilFruit":"Tori Tori no Mi Model Phoenix"},
{"id":"op-marcusmars","name":"Marcus Mars","crew":"World Government","imageUrl":"/images/characters/op-marcusmars.webp","haki":true,"bounty":null,"origin":"Mary Geoise","hakiTypes":[],"devilFruit":null},
{"id":"op-merry","name":"Merry","crew":null,"imageUrl":"/images/characters/op-merry.webp","haki":false,"bounty":null,"origin":"Syrup Village","hakiTypes":[],"devilFruit":null},
{"id":"op-momonga","name":"Momonga","crew":"Marines","imageUrl":"/images/characters/op-momonga.webp","haki":true,"bounty":null,"origin":"Desconocido","hakiTypes":["Armament","Observation"],"devilFruit":null},
{"id":"op-momonosuke","name":"Momonosuke","crew":"Wano","imageUrl":"/images/characters/op-momonosuke.webp","haki":true,"bounty":null,"origin":"Wano","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":"Uo Uo no Mi Model Seiryu (Artificial)"},
{"id":"op-monet","name":"Monet","crew":"Donquixote Pirates","imageUrl":"/images/characters/op-monet.webp","haki":false,"bounty":null,"origin":"Grand Line","hakiTypes":[],"devilFruit":"Snow-Snow Fruit"},
{"id":"op-morgans","name":"Morgans","crew":null,"imageUrl":"/images/characters/op-morgans.webp","haki":false,"bounty":null,"origin":"Grand Line","hakiTypes":[],"devilFruit":"Albatross-Human Fruit"},
{"id":"op-moria","name":"Gecko Moria","crew":"Thriller Bark Pirates","imageUrl":"/images/characters/op-moria.webp","haki":false,"bounty":320000000,"origin":"West Blue","hakiTypes":[],"devilFruit":"Shadow-Shadow Fruit"},
{"id":"op-nami","name":"Nami","crew":"Straw Hat Pirates","imageUrl":"/images/characters/op-nami.webp","haki":false,"bounty":366000000,"origin":"Cocoyasi Village","hakiTypes":[],"devilFruit":null,"features":["orange-hair","navigator"]},
{"id":"op-neptune","name":"Neptune","crew":"Ryugu","imageUrl":"/images/characters/op-neptune.webp","haki":false,"bounty":null,"origin":"Fish-Man Island","hakiTypes":[],"devilFruit":null},
{"id":"op-nojiko","name":"Nojiko","crew":null,"imageUrl":"/images/characters/op-nojiko.webp","haki":false,"bounty":null,"origin":"Cocoyasi Village","hakiTypes":[],"devilFruit":null},
{"id":"op-nusjuro","name":"Nusjuro","crew":"World Government","imageUrl":"/images/characters/op-nusjuro.webp","haki":true,"bounty":null,"origin":"Mary Geoise","hakiTypes":["Armament","Observation"],"devilFruit":null},
{"id":"op-oars","name":"Oars","crew":"Thriller Bark Pirates","imageUrl":"/images/characters/op-oars.webp","haki":false,"bounty":null,"origin":"Ancient Giant","hakiTypes":[],"devilFruit":null,"features":["giant"]},
{"id":"op-oden","name":"Oden","crew":"Wano","imageUrl":"/images/characters/op-oden.webp","haki":true,"bounty":null,"origin":"Wano","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":null},
{"id":"op-orochi","name":"Orochi","crew":"Wano","imageUrl":"/images/characters/op-orochi.webp","haki":false,"bounty":null,"origin":"Wano","hakiTypes":[],"devilFruit":"Hebi Hebi no Mi Model Yamata no Orochi"},
{"id":"op-paulie","name":"Paulie","crew":null,"imageUrl":"/images/characters/op-paulie.webp","haki":false,"bounty":null,"origin":"Water 7","hakiTypes":[],"devilFruit":null},
{"id":"op-pedro","name":"Pedro","crew":"Mink Tribe","imageUrl":"/images/characters/op-pedro.webp","haki":true,"bounty":382000000,"origin":"Zou","hakiTypes":["Observation"],"devilFruit":null},
{"id":"op-pekoms","name":"Pekoms","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-pekoms.webp","haki":true,"bounty":330000000,"origin":"Zou","hakiTypes":["Armament"],"devilFruit":"Kame Kame no Mi"},
{"id":"op-pell","name":"Pell","crew":"Arabasta","imageUrl":"/images/characters/op-pell.webp","haki":false,"bounty":null,"origin":"Alabasta","hakiTypes":[],"devilFruit":"Tori Tori no Mi Model Falcon"},
{"id":"op-perona","name":"Perona","crew":"Thriller Bark Pirates","imageUrl":"/images/characters/op-perona.webp","haki":false,"bounty":null,"origin":"Grand Line","hakiTypes":[],"devilFruit":"Horo Horo no Mi","features":["pink-hair"]},
{"id":"op-pudding","name":"Pudding","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-pudding.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":"Memo Memo no Mi"},
{"id":"op-queen","name":"Queen","crew":"Beast Pirates","imageUrl":"/images/characters/op-queen.webp","haki":true,"bounty":1320000000,"origin":"Grand Line","hakiTypes":["Armament","Observation"],"devilFruit":"Dragon-Dragon Fruit Model Brachiosaurus"},
{"id":"op-raizo","name":"Raizo","crew":"Wano","imageUrl":"/images/characters/op-raizo.webp","haki":false,"bounty":294000000,"origin":"Wano","hakiTypes":[],"devilFruit":null},
{"id":"op-rayleigh","name":"Rayleigh","crew":"Roger Pirates","imageUrl":"/images/characters/op-rayleigh.webp","haki":true,"bounty":null,"origin":"East Blue","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":null,"features":["glasses","mentor"]},
{"id":"op-rebecca","name":"Rebecca","crew":null,"imageUrl":"/images/characters/op-rebecca.webp","haki":false,"bounty":null,"origin":"Dressrosa","hakiTypes":[],"devilFruit":null,"features":["pink-hair"]},
{"id":"op-riku","name":"Riku Dold III","crew":null,"imageUrl":"/images/characters/op-riku.webp","haki":false,"bounty":null,"origin":"Dressrosa","hakiTypes":[],"devilFruit":null},
{"id":"op-robin","name":"Nico Robin","crew":"Straw Hat Pirates","imageUrl":"/images/characters/op-robin.webp","haki":false,"bounty":93000000,"origin":"Ohara","hakiTypes":[],"devilFruit":"Hana Hana no Mi","features":["black-hair","archaeologist"]},
{"id":"op-roger","name":"Gol D. Roger","crew":"Roger Pirates","imageUrl":"/images/characters/op-roger.webp","haki":true,"bounty":5564800000,"origin":"Loguetown","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":null,"features":["mustache","captain"]},
{"id":"op-ryokugyu","name":"Ryokugyu","crew":"Marines","imageUrl":"/images/characters/op-ryokugyu.webp","haki":true,"bounty":null,"origin":"North Blue","hakiTypes":["Armament","Observation"],"devilFruit":"Mori Mori no Mi"},
{"id":"op-ryuma","name":"Ryuma","crew":null,"imageUrl":"/images/characters/op-ryuma.webp","haki":false,"bounty":null,"origin":"Wano","hakiTypes":[],"devilFruit":null,"features":["samurai"]},
{"id":"op-sabo","name":"Sabo","crew":"Revolutionary Army","imageUrl":"/images/characters/op-sabo.webp","haki":true,"bounty":602000000,"origin":"Goa Kingdom","hakiTypes":["Armament","Observation"],"devilFruit":"Flame-Flame Fruit"},
{"id":"op-sanji","name":"Sanji","crew":"Straw Hat Pirates","imageUrl":"/images/characters/op-sanji.webp","haki":true,"bounty":1032000000,"origin":"North Blue","hakiTypes":["Armament","Observation"],"devilFruit":null,"features":["blonde","cook","suit"]},
{"id":"op-saturn","name":"Saturn","crew":"World Government","imageUrl":"/images/characters/op-saturn.webp","haki":true,"bounty":null,"origin":"Mary Geoise","hakiTypes":["Armament","Observation"],"devilFruit":null},
{"id":"op-sengoku","name":"Sengoku","crew":"Marines","imageUrl":"/images/characters/op-sengoku.webp","haki":true,"bounty":null,"origin":"Grand Line","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":"Hito Hito no Mi, Model: Daibutsu"},
{"id":"op-shanks","name":"Shanks","crew":"Red Hair Pirates","imageUrl":"/images/characters/op-shanks.webp","haki":true,"bounty":4048900000,"origin":"West Blue","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":null},
{"id":"op-shimotsuki","name":"Shimotsuki Yasuie","crew":"Wano","imageUrl":"/images/characters/op-shimotsuki.webp","haki":false,"bounty":null,"origin":"Wano","hakiTypes":[],"devilFruit":null},
{"id":"op-shirahoshi","name":"Shirahoshi","crew":"Ryugu","imageUrl":"/images/characters/op-shirahoshi.webp","haki":false,"bounty":null,"origin":"Fish-Man Island","hakiTypes":[],"devilFruit":null,"features":["mermaid","princess"]},
{"id":"op-shiryu","name":"Shiryu","crew":"Blackbeard Pirates","imageUrl":"/images/characters/op-shiryu.webp","haki":true,"bounty":null,"origin":"Impel Down","hakiTypes":["Armament","Observation"],"devilFruit":"Clear-Clear Fruit"},
{"id":"op-shushu","name":"Shushu","crew":null,"imageUrl":"/images/characters/op-shushu.webp","haki":false,"bounty":null,"origin":"East Blue","hakiTypes":[],"devilFruit":null,"features":["dog"]},
{"id":"op-smoker","name":"Smoker","crew":"Marines","imageUrl":"/images/characters/op-smoker.webp","haki":true,"bounty":null,"origin":"Grand Line","hakiTypes":["Armament","Observation"],"devilFruit":"Smoke-Smoke Fruit"},
{"id":"op-spandam","name":"Spandam","crew":"World Government","imageUrl":"/images/characters/op-spandam.webp","haki":false,"bounty":null,"origin":"Grand Line","hakiTypes":[],"devilFruit":null},
{"id":"op-sunny","name":"Thousand Sunny","crew":"Straw Hat Pirates","imageUrl":"/images/characters/op-sunny.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["ship"]},
{"id":"op-tama","name":"Tama","crew":"Wano","imageUrl":"/images/characters/op-tama.webp","haki":false,"bounty":null,"origin":"Wano","hakiTypes":[],"devilFruit":"Kibi Kibi no Mi"},
{"id":"op-tamago","name":"Tamago","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-tamago.webp","haki":true,"bounty":42900000,"origin":"Grand Line","hakiTypes":["Armament"],"devilFruit":"Egg-Egg Fruit"},
{"id":"op-tashigi","name":"Tashigi","crew":"Marines","imageUrl":"/images/characters/op-tashigi.webp","haki":true,"bounty":null,"origin":"East Blue","hakiTypes":["Armament"],"devilFruit":null,"features":["glasses","female-swordsman"]},
{"id":"op-tiger","name":"Fisher Tiger","crew":"Sun Pirates","imageUrl":"/images/characters/op-tiger.webp","haki":true,"bounty":230000000,"origin":"Fish-Man Island","hakiTypes":["Armament"],"devilFruit":null,"features":["fishman"]},
{"id":"op-toki","name":"Toki","crew":null,"imageUrl":"/images/characters/op-toki.webp","haki":false,"bounty":null,"origin":"Wano","hakiTypes":[],"devilFruit":"Time-Time Fruit","features":["black-haired"]},
{"id":"op-toko","name":"Toko","crew":null,"imageUrl":"/images/characters/op-toko.webp","haki":false,"bounty":null,"origin":"Wano","hakiTypes":[],"devilFruit":null,"features":["blue-haired"]},
{"id":"op-topman","name":"Topman Warcury","crew":"World Government","imageUrl":"/images/characters/op-topman.webp","haki":true,"bounty":null,"origin":"Unknown","hakiTypes":["Armament","Observation"],"devilFruit":null,"features":["grey-haired"]},
{"id":"op-ulti","name":"Ulti","crew":"Beast Pirates","imageUrl":"/images/characters/op-ulti.webp","haki":true,"bounty":400000000,"origin":"Unknown","hakiTypes":["Armament"],"devilFruit":"Dragon-Dragon Fruit, Pachycephalosaurus Model","features":["blue-haired"]},
{"id":"op-urouge","name":"Urouge","crew":"Fallen Monk Pirates","imageUrl":"/images/characters/op-urouge.webp","haki":true,"bounty":108000000,"origin":"Sky Island","hakiTypes":["Armament"],"devilFruit":null,"features":["monk","large"]},
{"id":"op-usopp","name":"Usopp","crew":"Straw Hat Pirates","imageUrl":"/images/characters/op-usopp.webp","haki":false,"bounty":500000000,"origin":"Syrup Village","hakiTypes":[],"devilFruit":null,"features":["sniper","black-haired","long-nose"]},
{"id":"op-uta","name":"Uta","crew":"Red Hair Pirates","imageUrl":"/images/characters/op-uta.webp","haki":false,"bounty":null,"origin":"Elegia","hakiTypes":[],"devilFruit":"Sing-Sing Fruit","features":["singer","red-haired"]},
{"id":"op-vergo","name":"Vergo","crew":"Donquixote Pirates","imageUrl":"/images/characters/op-vergo.webp","haki":true,"bounty":null,"origin":"North Blue","hakiTypes":["Armament"],"devilFruit":null,"features":["black-haired"]},
{"id":"op-viola","name":"Viola","crew":"Dressrosa","imageUrl":"/images/characters/op-viola.webp","haki":false,"bounty":null,"origin":"Dressrosa","hakiTypes":[],"devilFruit":"Glare-Glare Fruit","features":["dancer","brown-haired"]},
{"id":"op-vivi","name":"Vivi","crew":"Arabasta","imageUrl":"/images/characters/op-vivi.webp","haki":false,"bounty":null,"origin":"Arabasta","hakiTypes":[],"devilFruit":null,"features":["blue-haired"]},
{"id":"op-wapol","name":"Wapol","crew":null,"imageUrl":"/images/characters/op-wapol.webp","haki":false,"bounty":null,"origin":"Drum Island","hakiTypes":[],"devilFruit":"Munch-Munch Fruit","features":["king"]},
{"id":"op-whitebeard","name":"Edward Newgate","crew":"Whitebeard Pirates","imageUrl":"/images/characters/op-whitebeard.webp","haki":true,"bounty":5046000000,"origin":"Sphinx","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":"Tremor-Tremor Fruit","features":["captain","white-haired","large"]},
{"id":"op-wiper","name":"Wiper","crew":null,"imageUrl":"/images/characters/op-wiper.webp","haki":false,"bounty":null,"origin":"Skypiea","hakiTypes":[],"devilFruit":null,"features":["warrior","brown-haired"]},
{"id":"op-yamato","name":"Yamato","crew":"Wano","imageUrl":"/images/characters/op-yamato.webp","haki":true,"bounty":null,"origin":"Wano","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":"Dog-Dog Fruit, Model: Okuchi no Makami","features":["white-haired","horned"]},
{"id":"op-yassop","name":"Yasopp","crew":"Red Hair Pirates","imageUrl":"/images/characters/op-yassop.webp","haki":true,"bounty":null,"origin":"East Blue","hakiTypes":["Observation"],"devilFruit":null,"features":["sniper","blonde"]},
{"id":"op-yasuie","name":"Shimotsuki Yasuie","crew":null,"imageUrl":"/images/characters/op-yasuie.webp","haki":false,"bounty":null,"origin":"Wano","hakiTypes":[],"devilFruit":null,"features":["blue-haired"]},
{"id":"op-zeff","name":"Zeff","crew":null,"imageUrl":"/images/characters/op-zeff.webp","haki":false,"bounty":null,"origin":"South Blue","hakiTypes":[],"devilFruit":null,"features":["chef","blonde"]},
{"id":"op-zephyr","name":"Zephyr","crew":"Neo Marines","imageUrl":"/images/characters/op-zephyr.webp","haki":true,"bounty":null,"origin":"Unknown","hakiTypes":["Armament","Observation"],"devilFruit":null,"features":["black-haired"]},
{"id":"op-zoro","name":"Roronoa Zoro","crew":"Straw Hat Pirates","imageUrl":"/images/characters/op-zoro.webp","haki":true,"bounty":1111000000,"origin":"East Blue","hakiTypes":["Armament","Observation","Conqueror"],"devilFruit":null,"features":["swordsman","green-haired"]},
{"id":"op-zunesha","name":"Zunesha","crew":null,"imageUrl":"/images/characters/op-zunesha.webp","haki":false,"bounty":null,"origin":"Grand Line","hakiTypes":[],"devilFruit":null,"features":["elephant","giant"]},
{"id":"op-galette","name":"Charlotte Galette","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-galette.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":"Butter-Butter Fruit","features":["brown-haired"]},
{"id":"op-smoothie","name":"Charlotte Smoothie","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-smoothie.webp","haki":true,"bounty":932000000,"origin":"Totto Land","hakiTypes":["Armament"],"devilFruit":"Wring-Wring Fruit","features":["tall","blonde"]},
{"id":"op-custard","name":"Charlotte Custard","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-custard.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["pink-haired"]},
{"id":"op-myukuru","name":"Charlotte Myukuru","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-myukuru.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["pink-haired"]},
{"id":"op-newshi","name":"Charlotte Newshi","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-newshi.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blue-haired"]},
{"id":"op-snack","name":"Charlotte Snack","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-snack.webp","haki":false,"bounty":600000000,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["large","orange-haired"]},
{"id":"op-chiboust","name":"Charlotte Chiboust","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-chiboust.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blonde"]},
{"id":"op-jaconde","name":"Charlotte Jaconde","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-jaconde.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blonde"]},
{"id":"op-opera","name":"Charlotte Opera","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-opera.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":"Cream-Cream Fruit","features":["red-haired"]},
{"id":"op-yuen","name":"Charlotte Yuen","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-yuen.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["martial-artist"]},
{"id":"op-perospero","name":"Charlotte Perospero","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-perospero.webp","haki":false,"bounty":700000000,"origin":"Totto Land","hakiTypes":[],"devilFruit":"Candy-Candy Fruit","features":["long-tongue","cane"]},
{"id":"op-compote","name":"Charlotte Compote","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-compote.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["purple-haired"]},
{"id":"op-flampe","name":"Charlotte Flampe","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-flampe.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["green-haired"]},
{"id":"op-oven","name":"Charlotte Oven","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-oven.webp","haki":true,"bounty":300000000,"origin":"Totto Land","hakiTypes":["Armament"],"devilFruit":"Heat-Heat Fruit","features":["tall","red-haired"]},
{"id":"op-daifuku","name":"Charlotte Daifuku","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-daifuku.webp","haki":true,"bounty":300000000,"origin":"Totto Land","hakiTypes":["Armament"],"devilFruit":"Puff-Puff Fruit","features":["tall","blue-haired"]},
{"id":"op-mondee","name":"Charlotte Mondee","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-mondee.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blue-haired"]},
{"id":"op-amande","name":"Charlotte Amande","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-amande.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["swordsman","purple-haired"]},
{"id":"op-effilee","name":"Charlotte Effilee","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-effilee.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blonde"]},
{"id":"op-candenza","name":"Charlotte Candenza","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-candenza.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blue-haired"]},
{"id":"op-dosmarche","name":"Charlotte Dosmarche","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-dosmarche.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["purple-haired"]},
{"id":"op-counter","name":"Charlotte Counter","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-counter.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blue-haired"]},
{"id":"op-kato","name":"Charlotte Kato","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-kato.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-angel","name":"Charlotte Angel","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-angel.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blonde"]},
{"id":"op-willow","name":"Charlotte Willow","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-willow.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-wafers","name":"Charlotte Wafers","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-wafers.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-newgo","name":"Charlotte Newgo","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-newgo.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blue-haired"]},
{"id":"op-basans","name":"Charlotte Basans","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-basans.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-noisette","name":"Charlotte Noisette","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-noisette.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blonde"]},
{"id":"op-nusstorte","name":"Charlotte Nusstorte","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-nusstorte.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blonde"]},
{"id":"op-dolce","name":"Charlotte Dolce","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-dolce.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["twin"]},
{"id":"op-newsan","name":"Charlotte Newsan","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-newsan.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["twin"]},
{"id":"op-newichi","name":"Charlotte Newichi","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-newichi.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-newji","name":"Charlotte Newji","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-newji.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-allmeg","name":"Charlotte Allmeg","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-allmeg.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-harumeg","name":"Charlotte Harumeg","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-harumeg.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-akimeg","name":"Charlotte Akimeg","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-akimeg.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-nutmeg","name":"Charlotte Nutmeg","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-nutmeg.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-fuyumeg","name":"Charlotte Fuyumeg","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-fuyumeg.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-laurin","name":"Charlotte Laurin","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-laurin.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-broye","name":"Charlotte Broye","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-broye.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-raisin","name":"Charlotte Raisin","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-raisin.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["purple-haired"]},
{"id":"op-zuccotto","name":"Charlotte Zuccotto","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-zuccotto.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blonde"]},
{"id":"op-compo","name":"Charlotte Compo","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-compo.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blue-haired"]},
{"id":"op-montdor","name":"Charlotte Mont-d'Or","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-montdor.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":"Book-Book Fruit","features":["book","brown-haired"]},
{"id":"op-mozart","name":"Charlotte Mozart","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-mozart.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["pink-haired"]},
{"id":"op-basskarte","name":"Charlotte Basskarte","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-basskarte.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-moscato","name":"Charlotte Moscato","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-moscato.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blonde"]},
{"id":"op-poire","name":"Charlotte Poire","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-poire.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["purple-haired"]},
{"id":"op-brownie","name":"Charlotte Brownie","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-brownie.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-marble","name":"Charlotte Marble","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-marble.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blonde"]},
{"id":"op-mobile","name":"Charlotte Mobile","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-mobile.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["brown-haired"]},
{"id":"op-chiffon","name":"Charlotte Chiffon","crew":"Fire Tank Pirates","imageUrl":"/images/characters/op-chiffon.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blonde"]},
{"id":"op-lola","name":"Charlotte Lola","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-lola.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["pink-haired"]},
{"id":"op-prim","name":"Charlotte Prim","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-prim.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blonde"]},
{"id":"op-praline","name":"Charlotte Praline","crew":"Sun Pirates","imageUrl":"/images/characters/op-praline.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["mermaid","orange-haired"]},
{"id":"op-tablet","name":"Charlotte Tablet","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-tablet.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["purple-haired"]},
{"id":"op-streusen","name":"Streusen","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-streusen.webp","haki":false,"bounty":null,"origin":"Unknown","hakiTypes":[],"devilFruit":"Cook-Cook Fruit","features":["chef","grey-haired"]},
{"id":"op-bege","name":"Capone Bege","crew":"Fire Tank Pirates","imageUrl":"/images/characters/op-bege.webp","haki":true,"bounty":350000000,"origin":"West Blue","hakiTypes":["Armament"],"devilFruit":"Castle-Castle Fruit","features":["mafia","black-haired"]},
{"id":"op-dacquioise","name":"Charlotte Dacquioise","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-dacquioise.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blue-haired"]},
{"id":"op-citron","name":"Charlotte Citron","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-citron.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["pink-haired"]},
{"id":"op-saintmarc","name":"Charlotte Saint Marc","crew":"Big Mom Pirates","imageUrl":"/images/characters/op-saintmarc.webp","haki":false,"bounty":null,"origin":"Totto Land","hakiTypes":[],"devilFruit":null,"features":["blonde"]},
{"id":"op-gab","name":"Gab","crew":"Red Hair Pirates","imageUrl":"/images/characters/op-gab.webp","haki":false,"bounty":null,"origin":"Unknown","hakiTypes":[],"devilFruit":null,"features":["black-haired"]},
{"id":"op-limejuice","name":"Limejuice","crew":"Red Hair Pirates","imageUrl":"/images/characters/op-limejuice.webp","haki":false,"bounty":null,"origin":"Unknown","hakiTypes":[],"devilFruit":null,"features":["blonde"]},
{"id":"op-monster","name":"Monster","crew":"Red Hair Pirates","imageUrl":"/images/characters/op-monster.webp","haki":false,"bounty":null,"origin":"Unknown","hakiTypes":[],"devilFruit":null,"features":["animal","monkey"]},
{"id":"op-hongo","name":"Hongo","crew":"Red Hair Pirates","imageUrl":"/images/characters/op-hongo.webp","haki":false,"bounty":null,"origin":"Unknown","hakiTypes":[],"devilFruit":null,"features":["doctor","brown-haired"]},
{"id":"op-bonkpunch","name":"Bonk Punch","crew":"Red Hair Pirates","imageUrl":"/images/characters/op-bonkpunch.webp","haki":false,"bounty":null,"origin":"Unknown","hakiTypes":[],"devilFruit":null,"features":["large","white-haired"]},
{"id":"op-crocus","name":"Crocus","crew":null,"imageUrl":"/images/characters/op-crocus.webp","haki":true,"bounty":null,"origin":"Grand Line","hakiTypes":["Observation"],"devilFruit":null,"features":["doctor","former‑roger"]},
{"id":"op-nozdon","name":"Nozdon","crew":null,"imageUrl":"/images/characters/op-nozdon.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger","giant"]},
{"id":"op-petermoo","name":"Petermoo","crew":null,"imageUrl":"/images/characters/op-petermoo.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-sunbell","name":"Sunbell","crew":null,"imageUrl":"/images/characters/op-sunbell.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-taro","name":"Taro","crew":null,"imageUrl":"/images/characters/op-taro.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-douglasbullet","name":"Douglas Bullet","crew":null,"imageUrl":"/images/characters/op-douglasbullet.webp","haki":null,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-toki","name":"Toki","crew":null,"imageUrl":"/images/characters/op-toki.webp","haki":false,"bounty":null,"origin":"Wano","hakiTypes":[],"devilFruit":"Toki‑Toki Fruit","features":["former‑roger"]},
{"id":"op-milletpine","name":"Milletpine","crew":null,"imageUrl":"/images/characters/op-milletpine.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-doringo","name":"Doringo","crew":null,"imageUrl":"/images/characters/op-doringo.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-moonisaacjr","name":"Moon Isaac Jr","crew":null,"imageUrl":"/images/characters/op-moonisaacjr.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-spencer","name":"Spencer","crew":null,"imageUrl":"/images/characters/op-spencer.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-cbgallant","name":"CB Gallant","crew":null,"imageUrl":"/images/characters/op-cbgallant.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-erio","name":"Erio","crew":null,"imageUrl":"/images/characters/op-erio.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-donquino","name":"Donquino","crew":null,"imageUrl":"/images/characters/op-donquino.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-blumarine","name":"Blumarine","crew":"Roger Pirates","imageUrl":"/images/characters/op-blumarine.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-momora","name":"Momora","crew":"Roger Pirates","imageUrl":"/images/characters/op-momora.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-maxmarks","name":"Max Marks","crew":"Roger Pirates","imageUrl":"/images/characters/op-maxmarks.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-yui","name":"Yui","crew":"Roger Pirates","imageUrl":"/images/characters/op-yui.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-jacksonbanner","name":"Jackson Banner","crew":"Roger Pirates","imageUrl":"/images/characters/op-jacksonbanner.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger","musician"]},
{"id":"op-mugren","name":"Mugren","crew":"Roger Pirates","imageUrl":"/images/characters/op-mugren.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-bankuro","name":"Bankuro","crew":"Roger Pirates","imageUrl":"/images/characters/op-bankuro.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["former‑roger"]},
{"id":"op-tsuru","name":"Tsuru","crew":"World Government","imageUrl":"/images/characters/op-tsuru.webp","haki":true,"bounty":500000000,"origin":"North Blue","hakiTypes":["Observation"],"devilFruit":"Wash‑Wash Fruit","features":["marine","vice‑admiral"]},
{"id":"op-johngiant","name":"John Giant","crew":"World Government","imageUrl":"/images/characters/op-johngiant.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine","giant"]},
{"id":"op-comil","name":"Comil","crew":"World Government","imageUrl":"/images/characters/op-comil.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine"]},
{"id":"op-onigumo","name":"Onigumo","crew":"World Government","imageUrl":"/images/characters/op-onigumo.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine","giant"]},
{"id":"op-doberman","name":"Doberman","crew":"World Government","imageUrl":"/images/characters/op-doberman.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine"]},
{"id":"op-strawberry","name":"Strawberry","crew":"World Government","imageUrl":"/images/characters/op-strawberry.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine"]},
{"id":"op-yamakaji","name":"Yamakaji","crew":"World Government","imageUrl":"/images/characters/op-yamakaji.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine"]},
{"id":"op-lacroix","name":"Lacroix","crew":"World Government","imageUrl":"/images/characters/op-lacroix.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine"]},
{"id":"op-lonz","name":"Lonz","crew":"World Government","imageUrl":"/images/characters/op-lonz.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine"]},
{"id":"op-stainless","name":"Stainless","crew":"World Government","imageUrl":"/images/characters/op-stainless.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine"]},
{"id":"op-mozambia","name":"Mozambia","crew":"World Government","imageUrl":"/images/characters/op-mozambia.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine"]},
{"id":"op-dalmatian","name":"Dalmatian","crew":"World Government","imageUrl":"/images/characters/op-dalmatian.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine"]},
{"id":"op-bastille","name":"Bastille","crew":"World Government","imageUrl":"/images/characters/op-bastille.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine"]},
{"id":"op-maynard","name":"Maynard","crew":"World Government","imageUrl":"/images/characters/op-maynard.webp","haki":true,"bounty":500000000,"origin":null,"hakiTypes":["Armament","Observation"],"devilFruit":null,"features":["marine"]},
{"id":"op-chaton","name":"Chaton","crew":"World Government","imageUrl":"/images/characters/op-chaton.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine"]},
{"id":"op-momousagi","name":"Momousagi","crew":"World Government","imageUrl":"/images/characters/op-momousagi.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine"]},
{"id":"op-doll","name":"Doll","crew":"World Government","imageUrl":"/images/characters/op-doll.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine"]},
{"id":"op-tbone","name":"T Bone","crew":"World Government","imageUrl":"/images/characters/op-tbone.webp","haki":false,"bounty":null,"origin":null,"hakiTypes":[],"devilFruit":null,"features":["marine"]},

];

// Helper functions for character data
export const getAllCharacters = (): AnimeCharacter[] => {
  return ANIME_CHARACTERS;
};

export const getCharacterByName = (name: string): AnimeCharacter | undefined => {
  return ANIME_CHARACTERS.find(char =>
    char.name.toLowerCase().includes(name.toLowerCase())
  );
};

export const getCharactersByCrew = (crew: string): AnimeCharacter[] => {
  return ANIME_CHARACTERS.filter(char => 
    char.crew && char.crew.toLowerCase().includes(crew.toLowerCase())
  );
};

export const getAllCrews = (): string[] => {
  const crews = new Set(ANIME_CHARACTERS.map(char => char.crew).filter(Boolean));
  return Array.from(crews as Set<string>).sort();
};

export const getAllOrigins = (): string[] => {
  const origins = new Set(ANIME_CHARACTERS.map(char => char.origin).filter(Boolean));
  return Array.from(origins as Set<string>).sort();
};

export const getRandomCharacter = (): AnimeCharacter => {
  const randomIndex = Math.floor(Math.random() * ANIME_CHARACTERS.length);
  return ANIME_CHARACTERS[randomIndex];
};

export const getCharactersByHaki = (hasHaki: boolean): AnimeCharacter[] => {
  return ANIME_CHARACTERS.filter(char => char.haki === hasHaki);
};

export const getCharactersByBountyRange = (min: number, max: number): AnimeCharacter[] => {
  return ANIME_CHARACTERS.filter(char => 
    char.bounty !== null && char.bounty >= min && char.bounty <= max
  );
};

export const formatBounty = (bounty: number | null): string => {
  if (bounty === null || bounty === 0) return 'No bounty';
  if (bounty >= 1000000000) return `${(bounty / 1000000000).toFixed(1)}B ₿`;
  if (bounty >= 1000000) return `${(bounty / 1000000).toFixed(0)}M ₿`;
  if (bounty >= 1000) return `${(bounty / 1000).toFixed(0)}K ₿`;
  return `${bounty} ₿`;
};
