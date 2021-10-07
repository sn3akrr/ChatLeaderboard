module.exports = {
	name: "beep",
	description: "Beep!",
	admin: false,
	execute(message) {
		message.channel.send("Boop.");
	},
};