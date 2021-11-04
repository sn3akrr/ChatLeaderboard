module.exports = {
	name: "admin",
	description: "Runs admin commands and stuff like that",
	admin: true,
	execute(message, args, settings, db) {
		if(args.length > 0){
			subcmd = args.shift();
			switch(subcmd) {
				case "test":
					message.reply("Meatball");
					break;
				case "help":
					message.reply(
						"Available subcommands:\n" +
						" - " + settings.prefix + "admin clearlb <here / all> - Clear leaderboard data\n" +
						" - " + settings.prefix + "admin clearmsgs <@user> <here / all> - Clear leaderboard data for specific user\n" +
						" - " + settings.prefix + "admin blacklist <@user> <here / all> - Blacklist a user's messages from counting towards leaderboard\n" +
						" - " + settings.prefix + "admin unblacklist <@user> <here / all> - Unblacklist a user's messages from counting towards leaderboard"
					);
					break;
				case "clearlb":
					subcmd = args.shift();
					switch(subcmd){
						case "here":
							channelId = message.channel.id;
							db.query("DELETE FROM messages WHERE channelId=" + channelId, (error, rows) => {
								if(error) throw error;

								message.reply("Successfully cleared all leaderboard stats for this channel!");
							});
							break;
						case "all":
							db.query("DELETE FROM messages WHERE channelId=" + channelId, (error, rows) => {
								if(error) throw error;

								message.reply("Successfully cleared all leaderboard stats for this server!");
							});
							break;
						default:
							message.reply("Usage: " + settings.prefix + "admin clearlb <here / all>");
							break;
					}
					break;
				case "clearmsgs":
					message.reply("Meatball");
					break;
				case "blacklist":
					message.reply("Meatball");
					break;
				case "unblacklist":
					message.reply("Meatball");
					break;
				default:
					message.reply("Unknown subcommand provided. Type **" + settings.prefix + "admin help** for a list of subcommands!");
					break;
			}
			//message.reply("TODO");
		}else{
			message.reply("Usage: " + settings.prefix + "admin <subcommand> (E.g. " + settings.prefix + "admin help)");
		}
	},
};