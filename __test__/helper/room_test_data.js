function createRoom(email) {
  return {
    "owner": email,
    "color": "#25cc51",
    "description": "Testing",
    "avatar": "https://cdn.discordapp.com/attachments/1006718552386043934/1039236890978701442/image.png",
    "title": "Testing Room",
  }
}


module.exports = { createRoom };