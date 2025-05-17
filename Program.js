var token = "YOUR_DISCORD_BOT_TOKEN";

const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');

const bot = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
});

const allowedChannelId = "1266655507737739296"; // 명령어를 사용할 수 있는 채널 ID
const logChannelId = "1267486568109707295"; // 로그를 기록할 채널 ID
const adminUserId = "1195881986317885470"; // 관리자 ID
const bannedUsers = new Set(); // 차단된 사용자 ID를 저장할 Set

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.username}!`);
});

bot.on('messageCreate', (message) => {
    // 봇 자신이나 관리자일 경우 명령어 사용 허용
    if (message.author.id === bot.user.id || message.author.id === adminUserId) {
        // 관리자와 봇은 모든 채널에서 명령어 사용 가능
    } else {
        // 차단된 사용자일 경우
        if (bannedUsers.has(message.author.id)) {
            return message.channel.send('차단된 사용자입니다. 더 이상 이 봇을 사용할 수 없습니다.');
        }
    }

    // d!ban 명령어 처리
    if (message.content.startsWith("d!ban")) {
        if (message.author.id !== adminUserId) {
            return message.channel.send('이 명령어는 관리자만 사용할 수 있습니다.');
        }

        const args = message.content.split(" ");
        if (args.length < 2) {
            return message.channel.send('사용법: d!ban [유저 id]');
        }

        const userIdToBan = args[1];
        bannedUsers.add(userIdToBan); // 차단 목록에 추가
        return message.channel.send(`유저 ${userIdToBan}이 차단되었습니다.`);
    }

    // d!unban 명령어 처리
    if (message.content.startsWith("d!unban")) {
        if (message.author.id !== adminUserId) {
            return message.channel.send('이 명령어는 관리자만 사용할 수 있습니다.');
        }

        const args = message.content.split(" ");
        if (args.length < 2) {
            return message.channel.send('사용법: d!unban [유저 id]');
        }

        const userIdToUnban = args[1];
        if (bannedUsers.has(userIdToUnban)) {
            bannedUsers.delete(userIdToUnban); // 차단 목록에서 제거
            return message.channel.send(`유저 ${userIdToUnban}의 차단이 해제되었습니다.`);
        } else {
            return message.channel.send(`유저 ${userIdToUnban}은 차단 목록에 없습니다.`);
        }
    }

    // 기존 명령어 처리
    if (message.channel.id !== allowedChannelId && message.content.startsWith(".spectate")) {
        const logChannel = bot.channels.cache.get(logChannelId);
        if (logChannel) {
            const timestamp = new Date().toLocaleString();
            logChannel.send(`사용자: ${message.author.username} (${message.author.id})가 ${timestamp}에 잘못된 채널에서 명령어를 사용했습니다.`);
        }
        return message.channel.send('지정된 채널에서 명령어를 사용해주세요.');
    }
    let msgArray = message.content.split(" ");
    let command = msgArray[0]; // Gets the first element of msgArray and removes the prefix
    let args = msgArray.slice(1); // Remove the first element of msgArray/command and this basically returns the arguments
    var wws = 0;

    if (command == ".도움말") {
        const e = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('도움말')
            .setDescription('명령어 설명')
            .addFields(
                { name: '.spectate', value: '입력한 플레이어 태그로 관전자를 보냅니다.\n사용 예시: .spectate #[태그] [관전의 수]\n한도: 최대 500명\n* <#1266655507737739296> 채널에서만 사용가능합니다.*'},
            )
            .setTimestamp();
        return message.channel.send({ embeds: [e] });
    }
    if (command == ".spectate") {
        if (!args[0]) return message.channel.send('잘못된 사용! \n 올바른 사용 예시: .spectate #[태그] [관전자의 수].');
        if (!args[0].startsWith("#")) return message.channel.send('잘못된 플레이어 태그! \n 올바른 사용 예시: .spectate #[태그] [관전자의 수].');
        if (!args[1]) return message.channel.send('관전자의 수를 정해주셔야 합니다.');
        if (args[1] > 501) return message.channel.send('한도는 최대 500명까지입니다.\n더 많은 관전자를 원하시면 VIP를 구매해주세요!');

        if (args[0].startsWith("#")) {
            var tag = new GetID(args[0]);
            var h = tag[0],
                l = tag[1];
            wws = 2;

            message.channel.send("브롤TV 관전자가 보내지는 중입니다.");
            message.channel.send('태그: ' + args[0]);
            message.channel.send('관전자수: ' + args[1]);
            message.channel.send("완료!");
            message.channel.send("클라이언트 버전: 57.378.1");
            if (args[1] < 501) {
                for (var i = 0; i <= args[1] - 1; i++) {
                    new Start(message, h, l, wws);
                }
            }
        }
    }
});

bot.login(token);

var net = require("net");
var { Queue, Messaging } = require("./Messaging/Messaging");

class Start {
    constructor(msg, h, l, wws) {
        var client = new net.Socket();

        var host = "game.brawlstarsgame.com";
        var port = 9339;

        client.connect(parseInt(port), host, () => {
            console.log(`Connected to the server: ${host}:${port}`);
            var queue = new Queue();
            var messaging = new Messaging(client, queue, h, l, wws);

            messaging.sendPepperAuthentication();

            client.on("data", data => {
                queue.add(data);
                while (messaging.pendingJob()) {
                    messaging.update();
                }
            });
            client.on("close", () => {
                console.log("Connection closed");
            });
        });

        client.on("error", error => {
            console.log(error);
        });
    }
}

const Long = require('long');

class GetID {
    constructor(tag) {
        var tagChars = '0289PYLQGRJCUV';
        tag = tag.slice(1);
        if (tag === undefined || typeof tag !== 'string') return false;

        let id = 0;
        let tagArray = tag.split('');
        for (let a = 0; a < tagArray.length; a++) {
            let i = tagChars.indexOf(tagArray[a]);
            id *= tagChars.length;
            id += i;
        }
        let high = id % 256;
        let low = Long.fromNumber((id - high)).shiftRight(8).low;

        var HighLow = [];
        HighLow.push(high);
        HighLow.push(low);

        return HighLow;
    }
}