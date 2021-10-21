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

        //Get all groups for one user
        server.route({
          method: 'GET',
          path: '/groups/user/{userid}',
          handler: async function (request, h) {
            var includes={}
            var include = {}
            if(request.query.include){
              request.query.include.split(",").forEach(key=>{
                const nest = key.split('.')
                if(nest.length>1){
                  includes[nest[0]] = {include:{[nest[1]]:true}}
                }
                else includes[key]=true
              })
              include = {include:includes}
            }
            const user = await prisma.user.findFirst({
              where:{
                authId:request.params.userid
              }
            })
            const groups = await prisma.group.findMany({
              where:{
                members:{
                  has:user.id
                }
              },
              ...include              
            }).catch(console.error)
            return groups
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
            const user = await prisma.user.findFirst({
              where:{
                authId:payload.creatorid
              }
            })   
            res = await prisma.group.create({
              data:{
                ...payload,
                members:[user.id]
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