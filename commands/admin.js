module.exports = {
	name: "admin",
	description: "Runs admin commands and stuff like that",
	admin: true,
	execute(message, args, db) {
		typeof(args);
		if(args.length > 0){
			subcmd = args.shift();
			switch(subcmd) {
				case "test":
					message.reply("Meatball");
					break;
				default:
					message.reply("Unknown subcommand provided.");
					break;
			}
			//message.reply("TODO");
		}else{
			message.reply("Usage: ^admin <insert subcommand list>");
		}
	},
};