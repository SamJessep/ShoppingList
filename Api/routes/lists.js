const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


exports.plugin = {
  name: 'lists',
  version: '1.0.0',
  register: async function (server, options) {

    //Get all lists for specific user
      server.route({
          method: 'GET',
          path: '/lists/user/{userid}',
          handler: async function (request, h) {
            var includes = {}
            request.query.include.split(",").forEach(key=>includes[key]=true)
            const user = await prisma.user.findFirst({
              where:{
                authId:request.params.userid
              }
            })
            return await prisma.list.findMany({
              where:{
                group:{
                  members:{
                    has:user.id
                  }
                }
              },
              include:{
                items:true,
                ...includes
              }
            })
          }
      });

        //Get all lists for specific group
        server.route({
          method: 'GET',
          path: '/lists/group/{groupid}',
          handler: async function (request, h) {
            return await prisma.list.findMany({
              where:{
                group:{
                  id:request.params.groupid
                }
              },
              include:{
                items:true
              }
            })
          }
        });

        //Get list by id
        server.route({
          method: 'GET',
          path: '/lists/id/{id}',
          handler: async function (request, h) {
            return await prisma.list.findFirst({
              where:{
                id:request.params.id
              },
              include:{
                items:true
              }
            })
          }
        });

      server.route({
        method: 'GET',
          path: '/lists/{userid}/{listid}',
          handler: async function (request, h) {
            return await prisma.item.findMany({where:{
              listID:request.params.listID
            }})
          }
      });

      //Create List
      server.route({
        method: 'POST',
          path: '/lists/create/{groupid}',
          handler: async function (request, h) {
            var includes = {}
            request.query.include.split(",").forEach(key=>includes[key]=true)
            const payload = request.payload;
            var res
            try{
              res = await prisma.list.create({
                data:{
                  partition:"PUBLIC",
                  ...payload,
                  group:{
                    connect:{
                      id:request.params.groupid
                    }
                  }
                },
                include:includes
              })
            }
            catch(e){
              console.error(e)
            }
            return res
          }
      });

      //Delete List by id
      server.route({
        method: 'DELETE',
          path: '/lists/{userid}/{listid}',
          handler: async function (request, h) {
            try{
              await prisma.list.delete({
                where:{
                  id:request.params.listid
                }
              })
              await prisma.item.deleteMany({
                where:{
                  listID:request.params.listid
                }
              })
              return await prisma.list.findMany({
                where:{
                  group:{
                    members:{
                      has:request.params.userid
                    }
                  }
                },
                include:{
                  items:true
                }
              })
            }catch(e){
              console.error(e)
            }
          }
      });

      //Add List item
      server.route({
        method: 'POST',
          path: '/lists/id/{listid}/add',
          handler: async function (request, h) {
            const payload = request.payload;
            payload.checked = JSON.parse(payload.checked)
            try{
              await prisma.item.create({
                data:{
                  ...payload,
                  list:{
                    connect:{
                      id:request.params.listid
                    }
                  }
                }
              })
              return await prisma.list.findMany({
                where:{id:request.params.listid},
                include:{items:true}
              })
            }catch(e){
              console.error(e)
            }
          }
      });

      
      //Update List item
      server.route({
        method: 'POST',
          path: '/lists/id/{listid}/update/{itemid}',
          handler: async function (request, h) {
            const payload = request.payload;
            payload.checked = JSON.parse(payload.checked)
            try{
              await prisma.item.update({
                where:{
                  id:request.params.itemid
                },
                data:{
                  ...payload,
                  list:{
                    connect:{
                      id:request.params.listid
                    }
                  }
                }
              })
              return await prisma.list.findMany({
                where:{id:request.params.listid},
                include:{items:true}
              })
            }catch(e){
              console.error(e)
            }
          }
      });

      //Delete List item
      server.route({
        method: 'DELETE',
          path: '/lists/id/{listid}/delete/{itemid}',
          handler: async function (request, h) {
            try{
              await prisma.item.delete({
                where:{
                  id:request.params.itemid
                }
              })
              return await prisma.list.findMany({
                where:{id:request.params.listid},
                include:{items:true}
              })
            }catch(e){
              console.error(e)
            }
          }
      });

  }
};