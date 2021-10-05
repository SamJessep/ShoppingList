const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class Base{
  static table = "BASE"
  static test(){
    console.log(this.table)
  }

  static async Get(query){
    return await prisma[this.table].findFirst(query)
  }

  static async GetMany(query){
    return await prisma[this.table].findMany(query)
  }

  static async Create(group, name, items=[]){
    return await prisma[this.table].create({
      data:{
        name:name,
        items: {
          create:items
        },
        groupID:group.id
      }
    })
  }

  static async Delete(list){
    return await prisma[this.table].delete({where:{id:list.id}})
  }

  static async Update(newData){
    return await prisma[this.table].update({where:{id:newData.id}, data:newData})
  }
}

module.exports={Base:Base}