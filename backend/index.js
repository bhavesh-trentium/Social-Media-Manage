var cron = require('node-cron');
const {
    postImageFacebook,
    getfirebaseDatabase,
    postImageGenerate,
    postCaptionsGenerate,
    postImageInstagram,
    postImageTwitter,
    syncTwiiterToken } = require('./controllers/generatePost');

let i = 1
cron.schedule('0 7,11,15,19 * * *', async () => {
    console.log('running a task count', i++);
    await mainFunction()

});

const mainFunction = async () => {
    try {
        await syncTwiiterToken()
        const pageData = await getfirebaseDatabase();
        const responseImage = await postImageGenerate(pageData);
        const responseCaption = await postCaptionsGenerate(pageData);
        const originalCaption = responseCaption.replace(/[^\w\s]/gi, "");
        const data = { ...pageData, caption: originalCaption, img: responseImage }
        await postImageTwitter(data);
        await postImageFacebook(data)
        await postImageInstagram(data)
        console.log('Done ✅')
    } catch (error) {
        console.log(error)
    }
}
//    0 7,11,15,19 * * *    => 7am, 11pm, 3pm, 7pm
//   */5 * * * * *  => 5 sec
//   * * * * *  => every minutes
