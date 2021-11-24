const fs = require("fs");

module.exports = {
	name: "admin",
	description: "Runs admin commands and stuff like that",
	admin: true,
	execute(message, args, settings, db) {
		if(args.length > 0){
			let target = message.mentions.members.first();
			subcmd = args.shift();
			switch(subcmd) {
				case "test":
					message.reply("Meatball");
					break;
				case "help":
					message.reply(
						"Available subcommands:\n" +
						" - " + settings.prefix + "admin clearlb <here / all> - Clear leaderboard data\n" +
						" - " + settings.prefix + "admin clearmsgs <here / all> <@user> - Clear leaderboard data for specific user\n" +
						" - " + settings.prefix + "admin blacklist <here / all> <@user> - Blacklist a user's messages from counting towards leaderboard\n" +
						" - " + settings.prefix + "admin unblacklist <here / all> <@user> - Unblacklist a user's messages from counting towards leaderboard"
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
					if(!target){
						message.reply("No user specified!");
						return;
					}
					id = target.id;
					subcmd = args.shift();
					switch(subcmd){
						case "here":
							channelId = message.channel.id;
							db.query("DELETE FROM messages WHERE snowflake=" + id + " and channelId=" + channelId, (error, rows) => {
								if(error) throw error;

								message.reply("Successfully cleared channel leaderboard stats for this user!");
							});
							break;
						case "all":
							db.query("DELETE FROM messages WHERE snowflake=" + snowflake, (error, rows) => {
								if(error) throw error;

								message.reply("Successfully cleared all leaderboard stats for this user!");
							});
							break;
						default:
							message.reply("Usage: " + settings.prefix + "admin clearmsgs <here / all> <@user>");
							break;
					}
					break;
				case "blacklist":
					var blacklist = JSON.parse(fs.readFileSync('./blacklist.json').toString());
					var channels = message.guild.channels.cache;
					for(const channel of channels.values()){
						console.log(channel.id);
					}
					if(!target){
						message.reply("No user specified!");
						return;
					}
					id = target.id;
					subcmd = args.shift();
					switch(subcmd){
						case "here":
							channelId = message.channel.id;
							if(blacklist[id] !== undefined && blacklist[id][channelId] !== undefined){
								message.reply("User is already blacklisted from this channel!");
								return;
							}
							if(blacklist[id] == undefined){
								blacklist[id] = {};
							}
							blacklist[id][channelId] = true;
							console.log(blacklist);
							fs.writeFile("./blacklist.json", JSON.stringify(blacklist), function(err){
								if(err) throw err;
							});
							message.reply("User has been blacklisted from this channel!");
							break;
						case "all":
							let blockedFromAll = true;
							if(blacklist[id] === undefined) {
								blockedFromAll = false;
								blacklist[id] = {};
							}
							for(const channel of channels.values()){
								if(blacklist[id][channelId] === undefined){
									blockedFromAll = false;
									blacklist[id][channelId] = true;
								}
							}

							if(blockedFromAll){
								message.reply("User is already blacklisted from all channels!");
								return;
							}
							fs.writeFile("./blacklist.json", JSON.stringify(blacklist), function(err){
								if(err) throw err;
							});
							message.reply("User has been blacklisted from all channels!");
							break;
						default:
							message.reply("Usage: " + settings.prefix + "admin blacklist <here / all> <@user>");
							break;
					}
					break;
				case "unblacklist":
					var blacklist = JSON.parse(fs.readFileSync('./blacklist.json').toString());
					var channels = message.guild.channels.cache;
					for(const channel of channels.values()){
						console.log(channel.id);
					}
					if(!target){
						message.reply("No user specified!");
						return;
					}
					id = target.id;
					subcmd = args.shift();
					switch(subcmd){
						case "here":
							channelId = message.channel.id;
							if(blacklist[id] === undefined || blacklist[id][channelId] === undefined){
								message.reply("User is not blacklisted from this channel!");
								return;
							}
							delete blacklist[id][channelId];
							fs.writeFile("./blacklist.json", JSON.stringify(blacklist), function(err){
								if(err) throw err;
							});
							message.reply("User has been unblacklisted from this channel!");
							break;
						case "all":
							let blockedFromAll = true;
							if(blacklist[id] === undefined) {
								message.reply("User is not blacklisted from any channels!");
								return;
							}
							delete blacklist[id];
							fs.writeFile("./blacklist.json", JSON.stringify(blacklist), function(err){
								if(err) throw err;
							});
							message.reply("User has been unblacklisted from all channels!");
							break;
						default:
							message.reply("Usage: " + settings.prefix + "admin unblacklist <here / all> <@user>");
							break;
					}
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