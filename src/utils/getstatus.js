const Gamedig = require('gamedig');

async function getstatus(ip, port) {
  try {
    const state = await Gamedig.query({
      type: 'samp',
      host: ip,
      port: port
    });

    //console.log(state);

    return {
      name: state.name,
      players: state.raw.numplayers,
      maxPlayers: state.maxplayers,
      version: state.raw.rules.version,
      gamemode: state.raw.gamemode,
      allowed_clients: state.raw.rules.allowed_clients,
      language: state.raw.map
    };
  } catch (err) {
    //console.error('Server offline or unreachable:', err);
    return null;
  }
}

module.exports = getstatus;