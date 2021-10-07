module.exports = {
	name: "admin",
	description: "Runs admin commands and stuff like that",
	admin: true,
	execute(message, args, db) {
		if(args.length > 1){
			message.reply("TODO");
		}else{
			message.delete().then(
				() => message.reply("Usage: ^admin <insert subcommand list>").then(
					msg => {
						try{
							msg.delete({timeout:5000})
						}catch(error){
							console.log(error);
						}
					}
				)
			);
		}
	},
};