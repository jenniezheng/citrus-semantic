"use strict"

const fs = require("fs")
const dataPath = __dirname + "/../data/glove.6B.100d.nouns-only.txt"

class Combinator {

  constructor() {
    this.data = []

    var datapoints = fs.readFileSync(dataPath, "utf8").split("\n")
    for (var i = 0; i < datapoints.length; i++) {
      this.data[i] = datapoints[i].split(" ")
    }

    // console.log(this.data)
  }

}

module.exports = Combinator
