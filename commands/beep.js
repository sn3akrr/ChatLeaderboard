const fs = require("fs");

module.exports = {
	name: "beep",
	description: "Beep!",
	admin: false,
	execute(message) {
		fs.readFileSync("./blacklist.json", function(error, content){
			if(error) throw error;
			const blacklist = JSON.parse(content);
			blacklist[message.content] = {123345: 1};
			console.log(blacklist);
			var data = JSON.stringify(blacklist);
			fs.writeFile("./blacklist.json", data, "utf8", function(error, data){
				console.log("saved thing to blacklist");
			});
		});
		message.channel.send("Boop. " + message.author.id);
	},
};