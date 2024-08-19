import DataBase from "./DataBase"
export default {
  db: undefined,
  getDB: function () {
    if (!this.db) {
      this.db = new DataBase()
    }
    console.log(this.db)
    return this.db
  }
}