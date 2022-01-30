/* validations for data that gets passed between sockets */
// game settings, chats.

function validateGameSettings(data) {
  const fields = Object.keys(data);

  // not all are required.
  const validFields = {
    playerId: true,
    phases: true,
    presetName: true,
  };

  const badFields = fields.filter((fieldName) => !validFields[fieldName]);
  if (badFields.length > 0) {
    return false;
  } else if (!fields.includes("phases")) {
    return false;
  }

  // ensure each phase is truly a phase.
  for (let i = 0; i < data.phases.length; i++) {
    if (!isValidPhase(data.phases[i])) {
      return false;
    }
  }

  return true;
}

function isValidPhase(phase) {
  // ensure total size <= 9
  const totalSize = phase.map((item) => item.size).reduce((a, b) => a + b);

  if (totalSize > 9) {
    return false;
  }

  // ensure each phase individually valid
  for (let i = 0; i < phase.length; i++) {
    if (!isValidPhaseItem(phase[i])) {
      return false;
    }
  }
  return true;
}

function isValidPhaseItem(item) {
  const fields = Object.keys(item);
  return (
    item.hasOwnProperty("size") &&
    item.hasOwnProperty("pattern") &&
    item.hasOwnProperty("cards") &&
    fields.length === 3
  );
}

module.exports = { validateGameSettings };
