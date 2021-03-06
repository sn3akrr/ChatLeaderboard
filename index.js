const fs = require("fs");
const Discord = require("discord.js");

const creds = fs.readFileSync("/home/data/mysqlcreds").toString().split("\n");

const mysql = require("mysql");
const db = mysql.createConnection({
	host: creds[0],
	user: creds[1],
	password: creds[2],
	database: "project"
});

const settings = {
	prefix: ".",
	linesPerLeaderboard: 5
};

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database!");
});

const client = new Discord.Client();

client.commands = new Discord.Collection();
const files = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for(const file of files){
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once("ready", () => {
	console.log("Ready!");
});

client.on("message", message => {
	//console.log(message.content);

	if(message.content.startsWith(settings.prefix) && message.content.length >= 4) {
		//command handling
		const args = message.content.slice(settings.prefix.length).split(/ +/);
		const command = args.shift().toLowerCase();

		try{
			let cmd = client.commands.get(command);
			let admin = cmd.admin;
			if(admin == false){
				cmd.execute(message, args, settings, db);
				//message.reply("Executed player command");
			}else{		
				let allowed = message.guild.roles.cache.find(role => role.name === "Admin");
				if((message.author.bot && "bot" in cmd) || message.member.roles.cache.has(allowed.id)){
					cmd.execute(message, args, settings, db);
					//message.reply("Executed admin command");
				}else{
					message.delete().then(
						() => message.reply("You must be a **Server Admin** to run this command!").then(
							msg => {
								try{
									msg.delete({timeout:3000})
								}catch(error){
									console.log(error);
								}
							}
						)
					);
				}
			}
		}catch(error){
			console.error(error);
			message.delete().then(
				() => message.reply("An unknown command was provided!").then(
					msg => {
						try{
							msg.delete({timeout:3000})
						}catch(error){
							console.log(error);
						}
					}
				)
			);
		}
	}else{
		//message logging
		if(!message.author.bot){
			let id = message.author.id;
			let channelId = message.channel.id;
			let time = Date.now();

			const blacklist = JSON.parse(fs.readFileSync('./blacklist.json').toString());
			if (blacklist[id] !== undefined) {
				if (blacklist[id][channelId] !== undefined) {
					console.log("user is blocked from this channel");
					return;
				}
			}

			db.query("INSERT INTO messages(snowflake, channelId, messageCount, lastMessageTime) VALUES(" + id + ", " + channelId + ", 1, " + time + ") ON DUPLICATE KEY UPDATE messageCount=messageCount+1, lastMessageTime=" + time, (error, rows) => {
				if (error) throw error;

				console.log("Message has been logged for user with snowflake " + id);
			});
		}
	}
});

client.login("ODk1NzU4NDA1NzkxMjc3MTIw.YV9OBg.21RpnWwEtYGGqFevEKNIS0Z6nSw");