import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import { createClient } from "redis";
import { config } from "dotenv";
import { createLogger, transports, format } from "winston";
import LokiTransport from "winston-loki";
import { dateToString } from "./dates";
import { compileMessages, generateUpdateMessage } from "./messaging";
import { checkChangedHash, checkHashes } from "./update";
import type { HashOutput, StoriesDocument } from "./types";

config({ path: "../.env" });

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
const redisClient = createClient({ url: process.env.REDIS_URL });
const logger = createLogger({
    format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
    transports: [
        new transports.Console(),
        new LokiTransport({
            host: process.env.LOKI_URL as string,
            labels: { job: "iris-discord" },
        }),
    ],
});

discordClient.once(Events.ClientReady, async (bot) => {
    logger.info(`Ready! Logged in as ${bot.user.tag}.`);

    await redisClient.connect();
    logger.info("Connected to Redis.");

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
        const redisHashesId = `${redisMessage}.hashes`;

        logger.info(`Story update received for ${redisMessage}.`);

        if (stories.published !== "") {
            const compiledBlocks = compileMessages(redisMessage, stories);

            if (compiledBlocks.length > 0) {
                const storyMessageId = await redisClient.get(redisId);
                if (storyMessageId) {
                    logger.info(`Story message exists.`);

                    const hashes = (await redisClient.hGetAll(
                        redisHashesId,
                    )) as HashOutput<string>;
                    const hashMatches = checkHashes(
                        stories,
                        hashes.stories,
                        hashes.description,
                    );
                    const hashChanges: HashOutput<boolean> = {
                        stories: checkChangedHash(hashMatches.stories),
                        description: checkChangedHash(hashMatches.description),
                    };

                    const message = await storiesChannel.messages.fetch(
                        storyMessageId,
                    );
                    if (message) {
                        if (hashChanges.stories || hashChanges.description) {
                            await message.edit(compiledBlocks[0]);

                            if (hashChanges.description) {
                                logger.info("Updated description.");
                                await redisClient.hSet(
                                    redisHashesId,
                                    "description",
                                    hashMatches.description as string,
                                );
                            }
                        }

                        if (hashChanges.stories) {
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
                                logger.info("Thread messages sent.");
                            }

                            if (
                                existingThreadMessagesCount >
                                threadCompiledBlocks.length
                            ) {
                                const difference =
                                    existingThreadMessagesCount -
                                    threadCompiledBlocks.length;
                                    logger.info(
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

                            logger.info("Updated stories.");
                            await redisClient.hSet(
                                redisHashesId,
                                "stories",
                                hashMatches.stories as string,
                            );

                            updatesChannel.send(
                                generateUpdateMessage(
                                    redisMessage,
                                    message.thread!.id,
                                    true,
                                ),
                            );
                            logger.info("Update message sent.");
                        }
                    }
                } else {
                    logger.info("No story message existing, creating...");
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
                    logger.info("Messages sent.");

                    updatesChannel.send(
                        generateUpdateMessage(redisMessage, thread.id, false),
                    );
                    logger.info("Update message sent.");

                    await redisClient.hSet(redisHashesId, {
                        stories: "",
                        description: "",
                    });
                }
            }
        }
    };

    const subscriber = redisClient.duplicate();
    subscriber.on("error", (err) => logger.error(err));
    await subscriber.connect();
    await subscriber.subscribe("updates", listener);
});

discordClient.login(process.env.DISCORD_TOKEN);
