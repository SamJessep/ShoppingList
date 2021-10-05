const {Base} = require("./Base.js")

class User extends Base{
  static table = "user"
}

module.exports={User:User}