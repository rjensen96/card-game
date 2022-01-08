function sendDrawDiscard(room, io) {
  try {
    const draw = room.drawPile.pop() || null;
    const discard = room.discardPile.pop() || null;

    // mask the values on draw so that people can't know what it is!
    draw.value = 0;
    draw.text = "?";
    draw.color = 100; // some huge value, clients will default to black.

    room.players.forEach((player) => {
      io.to(player.playerId).emit("drawDiscard", { draw, discard });
    });
  } catch (error) {
    console.error(error);
  }
}

function sendGameState(room, io) {
  try {
    const { drew, played, discarded, roundIsOver, gameIsOver } = room;

    const gameState = {
      playerUp: room.players[0].gamename,
      drew,
      played,
      discarded,
      roundIsOver,
      gameIsOver,
    };

    io.to(room.roomId).emit("gameState", gameState);
  } catch (error) {
    console.error(error);
  }
}

function sendPlayersOwnData(room, io) {
  room.players.forEach((player) => {
    io.to(player.playerId).emit("ownPlayerData", player);
  });
}

function sendPublicPlayerData(room, io) {
  const roomPlayerData = room.players.map((player) => {
    return {
      gamename: player.gamename,
      points: player.points,
      phase: player.phases[0],
      phaseNumber: 11 - player.phases.length,
    };
  });
  io.to(room.roomId).emit("roomPlayerData", roomPlayerData);
}

module.exports = {
  sendDrawDiscard,
  sendGameState,
  sendPlayersOwnData,
  sendPublicPlayerData,
};
