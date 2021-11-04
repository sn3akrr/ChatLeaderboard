module.exports = {
    name: "leaderboard",
    description: "Display leaderboards",
    admin: false,
    execute(message, args, settings, db) {
        channelId = message.channel.id;
        if(args.length > 0){
            subcmd = args.shift();
            switch(subcmd) {
                case "here":
                    page = args.shift();
                    if(page == undefined) page = 1;
                    db.query("SELECT * FROM messages WHERE channelId=" + channelId + " ORDER BY messageCount DESC", (error, rows) => {
                        if(error) throw err;
                        totalPages = Math.ceil(rows.length / settings.linesPerLeaderboard);
                        if(page <= 0){
                            page = 1;
                        }else if(page > totalPages) page = totalPages;
                        
                        msg = "Top messengers for this channel (Page " + page + "/" + totalPages + "):\n";
                        place = 1;
                        startAt = settings.linesPerLeaderboard * (page - 1);
                        rows.every((row, index) => {
                            if(index >= startAt){
                                console.log(index, row);
                                msg = msg + place + ". <@" + row.snowflake + ">: " + row.messageCount + " messages\n";
                                place += 1;
                                return place <= startAt + settings.linesPerLeaderboard;
                            }
                            place += 1;
                            return true;
                        });
                        message.channel.send("Loading leaderboard...").then(
                            mess => {
                                mess.edit(msg);
                            }
                        );
                    });
                    break;
                case "all":
                    page = args.shift();
                    if(page == undefined) page = 1;
                    db.query("SELECT snowflake, SUM(messageCount) AS messageCount FROM messages GROUP BY snowflake ORDER BY messageCount DESC", (error, rows) => {
                        if(error) throw error;
                        totalPages = Math.ceil(rows.length / settings.linesPerLeaderboard);
                        if(page <= 0){
                            page = 1;
                        }else if(page > totalPages) page = totalPages;

                        msg = "Top messengers for this Discord server (Page " + page + "/" + totalPages + "):\n";
                        place = 1;
                        startAt = settings.linesPerLeaderboard * (page - 1);
                        rows.every((row, index) => {
                            if(index >= startAt){
                                console.log(index, row);
                                msg = msg + place + ". <@" + row.snowflake + ">: " + row.messageCount + " messages\n";
                                place += 1;
                                return place <= startAt + settings.linesPerLeaderboard;
                            }
                            place += 1;
                            return true;
                        });
                        message.channel.send("Loading leaderboard...").then(
                            mess => {
                                mess.edit(msg);
                            }
                        );
                    });
                    break;
                default:
                    message.reply("Usage: " + settings.prefix + "leaderboard <here/all>");
                    break;
            }
        }else{
            message.reply("Usage: " + settings.prefix + "leaderboard <here/all>");
        }
    },
};