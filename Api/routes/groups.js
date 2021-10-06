const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


exports.plugin = {
  name: 'groups',
  version: '1.0.0',
  register: async function (server, options) {

    //Get all groups for one user
      server.route({
          method: 'GET',
          path: '/groups/user/id/{userid}',
          handler: async function (request, h) {
            return await prisma.group.findMany({where:{
              members:{
                has:request.params.userid
              }
            }})
          }
      });

      //Create a group
      server.route({
        method:"POST",
        path:"/groups/create",
        handler: async (request, h)=>{
          const payload = request.payload;
          var res
          try {            
            res = await prisma.group.create({
              data:{
                name:payload.name,
                members:[payload.creatorid]
              }
            })
          } catch (error) {
            console.error(error)
          }
          return res
        }
      })

  }
};