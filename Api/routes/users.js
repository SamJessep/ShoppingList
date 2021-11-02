const { PrismaClient } = require('@prisma/client')
const { v4:uuidv4 } = require('uuid');
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
            try{
              return await prisma.user.findMany({where:{[request.params.field]:request.params.id}})
            }catch(e){
              console.error(e)
              return e
            }
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
            await prisma.group.create({
              data:{
                name:res.name+"'s group",
                members:[res.id],
                key:uuidv4()
              }
            })
          }
          catch(e){
            console.error(e)
          }
          return res
        }
      });

      //Update User
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