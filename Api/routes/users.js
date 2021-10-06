const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


exports.plugin = {
  name: 'users',
  version: '1.0.0',
  register: async function (server, options) {

    //Get all users
      server.route({
          method: 'GET',
          path: '/users',
          handler: async function (request, h) {
            try{
              return await prisma.user.findMany({})

            }catch(e){
              console.error(e)
              return e
            }
          }
      });

      //Get all users
      server.route({
          method: 'GET',
          path: '/users/{field}/{id}',
          handler: async function (request, h) {
            return await prisma.user.findMany({where:{[request.params.field]:request.params.id}})
          }
      });

      //Create User
      server.route({
        method:"POST",
        path:"/users/create",
        handler: async function (request, h) {
          const payload = request.payload;
          var res
          try{
            res = await prisma.user.create({data:{
              ...payload
            }})
          }
          catch(e){
            console.error(e)
          }
          return res
        }
      });

      //Create User
      server.route({
        method:"POST",
        path:"/users/{userid}/update",
        handler: async function (request, h) {
          const payload = request.payload;
          var res
          try{
            res = await prisma.user.update({
              where:{
                id:request.params.userid
              },
              data:{
              ...payload
            }})
          }
          catch(e){
            console.error(e)
          }
          return res
          }
        });

  }
};