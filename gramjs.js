const { TelegramClient} = require('telegram');
const { StringSession } = require('telegram/sessions')
const fs = require('fs')
const {Api} = require("telegram/tl");
const input = require('input') // npm i input

const apiId = 26360478
const apiHash = '2631e8e2abd5fb192aff3f3267798b7a'
const stringSession = new StringSession('1BAAOMTQ5LjE1NC4xNjcuOTEAUJ7wChh2GXXGN347aFICReUsbYqEpcQ1RgzSaRilrwQv/uH9xgVFxwWAwp73ZpGxTAH+L8oJEVbec/qkE0/06u5UYsTOLXcVNZe7nXw+mmZckMpfwwtnNVdN0YSQSFYSwE/MvzQ3xM4+BmH3VKekm1D7SUWZq/Z8HyWgDER26wK/JYTqHb0gvfPbpb6FzZPLnQ6bpSMbdiR680RBXVXuuXBKaOMm2Ef84B/XFGa/KqSMrlQkZKwtil/wQmBdyq/LAM8p+3sDUi978DgCgrTC90rKHBec15LohAW0ORHQVIopJJu7Z3eFlXeZFg5xXZdQ99bIFiw3qv6cVZRPuhQKb4E='); // fill this later with the value from session.save()

async function bootstrap() {
    const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 })
    await client.start({
        phoneNumber: async () => await input.text('number ?'),
        password: async () => await input.text('password?'),
        phoneCode: async () => await input.text('Code ?'),
        onError: (err) => console.log(err),
    });

    console.log('You should now be connected.')
    console.log(client.session.save());
}

async function channelCrawler(channelName, offset) {
    const result = await client.invoke(
        new Api.channels.GetMessages({
            channel: channelName,
        })
    );    
}

(async () => {
    const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 })
    await client.start({
        phoneNumber: async () => await input.text('number ?'),
        password: async () => await input.text('password?'),
        phoneCode: async () => await input.text('Code ?'),
        onError: (err) => console.log(err),
    });
    console.log('You should now be connected.')
    console.log(client.session.save()) // Save this string to avoid logging in again
    await client.sendMessage('me', { message: 'Hello!' });

    const result = await client.invoke(
        new Api.channels.GetMessages({
          channel: "N12Updates",
        //   id: [194051],
        })
      );

    // const result = await client.invoke(
    //     new Api.messages.GetHistory({
    //         peer: "N12Updates",
    //         // offsetId: 43,
    //         // offsetDate: 43,
    //         // addOffset: 0,
    //         // limit: 100,
    //         maxId: 0,
    //         minId: 0,
    //         hash: BigInt("-4156887774564"),
    //     })
    // );  
    // console.dir(result.messages[0].media.document.fileReference, {depth: null}); // prints the result

    const media = result.messages[0].media;

    if (media) {
        console.log("Downloading buffer!");
        const buffer = await client.downloadMedia(media, {
            workers: 1,
        });

        fs.writeFileSync("myVideo.mp4", buffer, {
            "flag": "w+"
        })

        

        console.log("Done!!!");
    } else {
        console.error("No fucking media");
    }

    

    // const result = await client.invoke(new Api.channels.CheckUsername({
    //     username: "testing"
    // }));
    // console.log("Result is ",result);
})()