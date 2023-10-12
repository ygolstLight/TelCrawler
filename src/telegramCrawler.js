const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions')
const crypto = require('crypto')
const fs = require('fs')
const { Api } = require("telegram/tl");
const input = require('input');
const { message } = require('telegram/client');

const apiId = API ID
const apiHash = ''
const stringSession = new StringSession('');

const WAR_TIME = 1696626000;
const MEDIA_DIR = "media";
const OFFSET_LIMIT = 100;

async function bootstrap() {
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5
    });

    await client.start({
        phoneNumber: async () => await input.text('number ?'),
        password: async () => await input.text('password?'),
        phoneCode: async () => await input.text('Code ?'),
        onError: (err) => console.log(err),
    });
    
    console.log('You should now be connected.');
    console.log(client.session.save());

    return client;
}

async function downloadMedia(client, media) {
    const buffer = await client.downloadMedia(media, {
        workers: 3,
    });

    let ext = undefined;

    if(media.className == "MessageMediaDocument") {
        ext = "mp4";
    } 
    else if(media.className == "MessageMediaPhoto") {
        ext = "jpeg";
    }

    if(!ext) {
        console.log("Oh no!");
        return;
    }

    const fileName = `media/${crypto.randomBytes(32).toString('hex')}.${ext}`;

    console.log(fileName);

    fs.writeFileSync(fileName, buffer, {
        "flag": "w+"
    })

    console.log("Downloaded");
    
}

async function channelCrawler(client, channel, offset = 0) {
    
    const result = await client.invoke(
        new Api.messages.GetHistory({
            peer: channel,
            // offsetId: offset,
            // offsetDate: 43,
            addOffset: offset,
            limit: 100,
            // maxId: 0,
            minId: 0,
            hash: BigInt("-4156887774564"),
        })
    );

    if(!result.messages || !result.messages.length) {
        console.log("There's no relevant messages in this channel");
        return;
    }

    for(messageObj of result.messages) {
        if(messageObj.date <= WAR_TIME) {
            console.log("Stopping the flow in case of the limit date is smaller than the current message date");
            return;
        }

        if(!messageObj.media) {
            continue;
        }

        console.log(`Downloading video for message id; ${messageObj.id}`);
        // console.log(`Title: ${messageObj.message}`);
        downloadMedia(client, messageObj.media);
    }

    channelCrawler(client, channel, offset + OFFSET_LIMIT);
}

(async() => {
    const client = await bootstrap();
    channelCrawler(client, "N12Updates");
})();