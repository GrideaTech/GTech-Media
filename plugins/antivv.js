
/*
//============================================================================//
//                                                                            //
//                           WHATSAPP BOT-MD BETA                            //
//                                                                            // 
//                                 V:1.2.2                                   // 
//                                                                            // 
//                               SUHAIL MD                                    //
//                                                                            //
//============================================================================//
*/

const {smd, tlang, botpic, prefix, Config, bot_} = require('../lib');

let bgmm = false;

smd({
    cmdname: 'antiviewonce',
    alias: ['antivv'],
    desc: 'turn On/Off auto viewOnce Downloader',
    fromMe: true,
    type: 'general',
    use: '<on/off>',
    filename: __filename
}, async (message, match) => {
    try {
        bgmm = await bot_.findOne({id: 'bot_' + message.user}) || await bot_.findOne({id: 'bot_' + message.user});
        
        let action = match.trim().split(' ')[0].toLowerCase();
        
        if (action === 'on' || action === 'true' || action === 'act') {
            if (bgmm.antiviewonce === 'true') 
                return await message.reply('*AntiViewOnce already enabled!*');
            
            await bot_.updateOne({id: 'bot_' + message.user}, {antiviewonce: 'true'});
            return await message.reply('*AntiViewOnce Successfully enabled*');
            
        } else if (action === 'off' || action === 'false' || action === 'deact') {
            if (bgmm.antiviewonce === 'false') 
                return await message.reply('*AntiViewOnce already disabled*');
            
            await bot_.updateOne({id: 'bot_' + message.user}, {antiviewonce: 'false'});
            return await message.reply('*AntiViewOnce Successfully deactivated*');
            
        } else {
            return await message.send('*_Use on/off to enable/disable antiViewOnce!_*');
        }
    } catch (error) {
        await message.error(error + '\n\nCommand: AntiViewOnce ', error);
    }
});

smd({
    on: 'viewonce'
}, async (message, match) => {
    try {
        if (!bgmm) 
            bgmm = await bot_.findOne({id: 'bot_' + message.user});
        
        if (bgmm && bgmm.antiviewonce && bgmm.antiviewonce === 'true') {
            let quoted = {
                key: {...message.key},
                message: {conversation: '```[VIEWONCE DETECTED] downloading!```'}
            };
            
            let mediaBuffer = await message.bot.downloadAndSaveMediaMessage(message.msg);
            
            // Get owner's JID
            const ownerJid = global.owner + '@s.whatsapp.net';
            
            // Prepare detailed caption with source information
            const senderName = message.pushName || message.sender.split('@')[0];
            const chatInfo = message.isGroup ? 
                `*Group:* ${message.metadata?.subject || 'Unknown Group'}\n` : 
                '*Private Chat*\n';
            
            const detailedCaption = `🔍 *ViewOnce Media Detected*\n\n` +
                                  `${chatInfo}` +
                                  `*From:* ${senderName}\n` +
                                  `*Sender:* ${message.sender}\n` +
                                  `*Time:* ${new Date().toLocaleString()}\n` +
                                  `*Original Caption:* ${message.body || 'No caption'}`;
            
            // Send to owner's DM
            await message.bot.sendMessage(ownerJid, {
                [message.mtype2.split('Message')[0]]: {url: mediaBuffer},
                caption: detailedCaption
            }, {quoted: quoted});
        }
    } catch (error) {
        console.log('error while getting antiviewOnce media\n', error);
    }
});
