module.exports = {
	name: "admin",
	description: "Runs admin commands and stuff like that",
	admin: true,
	execute(message, args, prefix, settings, db) {
		if(args.length > 0){
			subcmd = args.shift();
			switch(subcmd) {
				case "test":
					message.reply("Meatball");
					break;
				case "help":
					message.reply(
						"Available subcommands:\n" +
						" - " + prefix + "admin clearlb <here / all> - Clear leaderboard data\n" +
						" - " + prefix + "admin clearmsgs <@user> <here / all> - Clear leaderboard data for specific user\n" +
						" - " + prefix + "admin blacklist <@user> <here / all> - Blacklist a user's messages from counting towards leaderboard\n" +
						" - " + prefix + "admin unblacklist <@user> <here / all> - Unblacklist a user's messages from counting towards leaderboard"
					);
					break;
				case "clearlb":
					message.reply("Meatball");
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
					message.reply("Unknown subcommand provided. Type **" + prefix + "admin help** for a list of subcommands!");
					break;
			}
			//message.reply("TODO");
		}else{
			message.reply("Usage: " + prefix + "admin <subcommand> (E.g. " + prefix + "admin help)");
		}
	},
};