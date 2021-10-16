'use strict';

const Hapi = require('@hapi/hapi');
const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: '0.0.0.0'
    });

    await server.register([
      require("./routes/lists"),
      require("./routes/users"),
      require("./routes/groups")
    ])

    await server.route({
      method:"GET",
      path:"/",
      handler: (request, h)=>'Server running on '+server.info.uri
    })

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();