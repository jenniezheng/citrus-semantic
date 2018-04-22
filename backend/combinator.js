"use strict"

const fs = require("fs")
const dataPath = __dirname + "/../data/glove.6B.100d.nouns-only.txt"
// const dataPath = __dirname + "/../data/glove.6B.100d.txt"
const createKDTree = require("static-kdtree")

class Combinator {

  constructor() {
    var words = []
    var points = []

    var data = fs.readFileSync(dataPath, "utf8").split("\n")
    for (var i = 0; i < data.length; i++) {
      var data_i = data[i].split(" ")
      words[i] = data_i.shift()
      points[i] = []
      for (var j = 0; j < data_i.length; j++) {
        points[i][j] = parseFloat(data_i[j])
      }
    }

    this.len = points.length
    this.dim = points[0].length
    this.words = words
    this.points = points
    this.kdt = createKDTree(points)
  }

  combine(w1, w2, k) {
    var i1 = this.words.indexOf(w1)
    var i2 = this.words.indexOf(w2)

    var point12 = []
    for (var i = 0; i < this.dim; i++) {
      point12[i] = this.points[i1][i] + this.points[i2][i]
    }

    var knn = this.kdt.knn(point12, k)

    var kwords = []
    for (var i = 0; i < k; i++) {
      kwords[i] = this.words[knn[i]]
    }
    return kwords
  }

}

module.exports = Combinator
