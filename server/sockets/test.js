const roomsList = [];

const getRandomRoomKey = () => {
  const minChar = "A".charCodeAt(0);
  const maxChar = "Z".charCodeAt(0);
  const charCodes = [];
  for (let i = 0; i < 4; i++) {
    charCodes.push(
      Math.floor(Math.random() * (maxChar - minChar + 1)) + minChar
    );
  }
  return String.fromCharCode(...charCodes);
};

for (let i = 0; i < 100; i++) {
  let newRoomKey = "";
  do {
    newRoomKey = getRandomRoomKey();
  } while (roomsList.includes(newRoomKey));

  roomsList.push(newRoomKey);
}

console.log("keys:", roomsList);
