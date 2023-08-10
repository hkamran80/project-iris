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

        if (stories.published !== "") {
            const compiledBlocks = compileMessages(redisMessage, stories);

            if (compiledBlocks.length > 0) {
                const storyMessageId = await redisClient.get(
                    `${redisMessage}.messageId`,
                );
                if (storyMessageId) {
                    const message = await storiesChannel.messages.fetch(
                        storyMessageId,
                    );
                    if (message) {
                        if (!message.hasThread) {
                            await message.startThread({
                                name: dateToString(redisMessage),
                                autoArchiveDuration: 1440,
                            });
                        }

                        await message.edit(compiledBlocks[0]);

                        if (message.hasThread && compiledBlocks.length > 1) {
                            const existingThreadMessages = (
                                await message.thread!.messages.fetch()
                            ).filter(
                                (m) => m.author.id === bot.user.id && !m.system,
                            );
                            const existingThreadMessagesIds =
                                existingThreadMessages.map((m) => m.id);
                            const existingThreadMessagesCount =
                                existingThreadMessages.size;

                            const threadCompiledBlocks =
                                compiledBlocks.slice(1);

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

                            if (
                                existingThreadMessagesCount >
                                threadCompiledBlocks.length
                            ) {
                                const messageLoading = await Promise.all(
                                    existingThreadMessagesIds
                                        .slice(threadCompiledBlocks.length - 1)
                                        .map((messageId) =>
                                            message.thread!.messages.fetch(
                                                messageId,
                                            ),
                                        ),
                                );

                                await Promise.all(
                                    messageLoading.map((message) =>
                                        message.delete(),
                                    ),
                                );
                            }
                        }

                        updatesChannel.send(
                            generateUpdateMessage(
                                redisMessage,
                                message.thread!.id,
                                true,
                            ),
                        );
                    }
                } else {
                    const message = await storiesChannel.send(
                        compiledBlocks[0],
                    );
                    await redisClient.set(
                        `${redisMessage}.discord`,
                        message.id,
                    );

                    const thread = await message.startThread({
                        name: dateToString(redisMessage),
                        autoArchiveDuration: 1440,
                    });
                    for (const block of compiledBlocks.slice(1)) {
                        thread.send(block);
                    }

                    updatesChannel.send(
                        generateUpdateMessage(redisMessage, thread.id, false),
                    );
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
