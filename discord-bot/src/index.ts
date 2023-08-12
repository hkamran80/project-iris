import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import { createClient } from "redis";
import { config } from "dotenv";
import { dateToString } from "./dates";
import { compileMessages, generateUpdateMessage } from "./messaging";
import type { StoriesDocument } from "./stories";

config({ path: "../.env" });

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
const redisClient = createClient({ url: process.env.REDIS_URL });

discordClient.once(Events.ClientReady, async (bot) => {
    console.log(`Ready! Logged in as ${bot.user.tag}.`);

    await redisClient.connect();
    console.log("Connected to Redis.");

    const storiesChannel = bot.channels.cache.get(
        process.env.DISCORD_STORIES_CHANNEL_ID as string,
    ) as TextChannel;
    const updatesChannel = bot.channels.cache.get(
        process.env.DISCORD_UPDATES_CHANNEL_ID as string,
    ) as TextChannel;

    const listener = async (redisMessage: string) => {
        const stories = (await redisClient.json.get(
            redisMessage,
        )) as StoriesDocument;
        const redisId = `${redisMessage}.messageId`;

        console.log(`Story update received for ${redisMessage}.`);

        if (stories.published !== "") {
            const compiledBlocks = compileMessages(redisMessage, stories);

            if (compiledBlocks.length > 0) {
                const storyMessageId = await redisClient.get(redisId);
                if (storyMessageId) {
                    console.log(`Story message exists.`);
                    const message = await storiesChannel.messages.fetch(
                        storyMessageId,
                    );
                    if (message) {
                        await message.edit(compiledBlocks[0]);

                        const existingThreadMessages = (
                            await message.thread!.messages.fetch()
                        ).filter(
                            (m) => m.author.id === bot.user.id && !m.system,
                        );
                        const existingThreadMessagesIds =
                            existingThreadMessages.map((m) => m.id);
                        const existingThreadMessagesCount =
                            existingThreadMessages.size;

                        const threadCompiledBlocks = compiledBlocks.slice(1);
                        if (compiledBlocks.length > 1) {
                            threadCompiledBlocks.forEach(
                                async (block, index) => {
                                    if (
                                        index + 1 <=
                                        existingThreadMessagesCount
                                    ) {
                                        const threadMessage =
                                            await message.thread!.messages.fetch(
                                                existingThreadMessagesIds.at(
                                                    index,
                                                ) as string,
                                            );
                                        if (threadMessage) {
                                            threadMessage.edit(block);
                                        }
                                    } else {
                                        await message.thread!.send(block);
                                    }
                                },
                            );
                            console.log("Thread messages sent.");
                        }

                        if (
                            existingThreadMessagesCount >
                            threadCompiledBlocks.length
                        ) {
                            const difference =
                                existingThreadMessagesCount -
                                threadCompiledBlocks.length;
                            console.log(
                                `Extraneous messages detected, removing ${difference} message${
                                    difference !== 1 ? "s" : ""
                                }.`,
                            );
                            existingThreadMessagesIds
                                .slice(threadCompiledBlocks.length - 1)
                                .map(async (messageId) => {
                                    const extraneousMessage =
                                        await message.thread!.messages.fetch(
                                            messageId,
                                        );

                                    extraneousMessage.delete();
                                });
                        }

                        updatesChannel.send(
                            generateUpdateMessage(
                                redisMessage,
                                message.thread!.id,
                                true,
                            ),
                        );
                        console.log("Update message sent.");
                    }
                } else {
                    console.log("No story message existing, creating...");
                    const message = await storiesChannel.send(
                        compiledBlocks[0],
                    );
                    await redisClient.set(redisId, message.id);

                    const thread = await message.startThread({
                        name: dateToString(redisMessage),
                        autoArchiveDuration: 1440,
                    });
                    for (const block of compiledBlocks.slice(1)) {
                        thread.send(block);
                    }
                    console.log("Messages sent.");

                    updatesChannel.send(
                        generateUpdateMessage(redisMessage, thread.id, false),
                    );
                    console.log("Update message sent.");
                }
            }
        }
    };

    const subscriber = redisClient.duplicate();
    subscriber.on("error", (err) => console.error(err));
    await subscriber.connect();
    await subscriber.subscribe("updates", listener);
});

discordClient.login(process.env.DISCORD_TOKEN);
