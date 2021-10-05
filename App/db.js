const { PrismaClient } = require('@prisma/client')
const {List} = require('./db/List')

const prisma = new PrismaClient()

const CreateUser = async (name,email,phoneNumber) => {
  const user = await prisma.user.create({data:{
      name:name,
      email:email,
      phoneNumber:phoneNumber
  }})

  return user
}

const DeleteUser = async (userID) => {
  const user =  await prisma.user.delete({where:{id:userID}})
  return user
}

const GetUser = async (query) => await prisma.user.findFirst({where:{...query}})
const GetUsers = async () => await prisma.user.findMany()

const CreateGroup = async (name, owner) => {
  const group = await prisma.group.create({data:{
    name:name,
    members:[owner.id],
  }})
  return group
}
const GetGroup = async (query) => await prisma.group.findFirst({where:{...query}})
const GetGroups = async () => await prisma.group.findMany()

const DeleteGroup = async (groupID) => await prisma.group.delete({where:{id:groupID}})


const CreateList = async (group, name, items=[]) => {
  return await prisma.list.create({data:{
    name:name,
    items: {
      create:items
    },
    groupID:group.id
  }})
}

const DUMMYDATA = {
  Users:{
    john:{
      name:"John",
      email:"John27@gmail.com",
      phoneNumber:"0273330230"
    }
  },
  Lists:{
    "list1":{
      name:"list1",
      items:[
        {name:"Apple", checked:false},
        {name:"Bannana", checked:true},
        {name:"Pear", checked:false}
      ]
    }
  }
}
const Run = async ()=>{

  // const groups = await GetGroups()
  // groups.forEach(async (group)=>{
  //   DeleteGroup(group.id)
  // })

  // const users = await GetUsers()
  // users.forEach(async (user)=>{
  //   DeleteUser(user.id)
  // // })
  // var john = await GetUser({name:"john"})
  // // var john = await CreateUser("john", "jonhsEMAIL", "jonhsPHONE#")
  // // const johnsGroup = await CreateGroup("name", john)
  // // john = await prisma.user.update({where:{id:john.id}, data:{groups:[johnsGroup.id]}})
  // const group = await GetGroup({name:"name"})
  // const list = await CreateList(group, DUMMYDATA.Lists.list1.name, DUMMYDATA.Lists.list1.items)
  // const list = await prisma.list.findFirst({where:{name:DUMMYDATA.Lists.list1.name}, include:{items:true}})
  // console.log(List)
  const list = await List.Get({where:{name:DUMMYDATA.Lists.list1.name}})
  console.log(list)
  // console.log(group, list)
  // List.test()
}
Run()