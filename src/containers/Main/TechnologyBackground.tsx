import React from 'react'

class TechnologyBackground extends React.Component {
  render () {
    return <canvas id='canvas'>不支持Canvas</canvas>
  }

  componentDidMount () {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement

    if (canvas) {
      const context = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      onresize = function () {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      document.documentElement.style.overflowY = 'hidden'
      window.requestAnimationFrame =
        window.requestAnimationFrame || window.webkitRequestAnimationFrame

      const rand = function (min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      // 点
      class Point {
        x = 0
        y = 0
        dx = 0
        dy = 0
        r = 0 // 点的半径

        constructor () {
          this.init()
        }

        init () {
          this.x = rand(0, canvas.width)
          this.y = rand(0, canvas.height)
          this.dx = rand(-1.4, 1.4)
          this.dy = rand(-1.4, 1.4)
          this.r = rand(0.8, 2.1)
        }

        draw () {
          if (context) {
            context.beginPath()
            context.fillStyle = '#70C1B7'
            if (this.x > canvas.width) {
              this.dx = -1 * Math.abs(this.dx)
            }
            if (this.y > canvas.height) {
              this.dy = -1 * Math.abs(this.dy)
            }
            if (this.x < 0) {
              this.dx = Math.abs(this.dx)
            }
            if (this.y < 0) {
              this.dy = Math.abs(this.dy)
            }
            this.x += this.dx
            this.y += this.dy
            context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
            context.fill()
            context.closePath()
          }
        }
      }

      // 线
      class Line {
        x1 = 0
        y1 = 0
        x2 = 0
        y2 = 0
        alphe = 0
        lineWidth = 0
        dist = 0
        minDist = 0
        constructor (
          point1: Point,
          point2: Point,
          dist2: number,
          minDist: number
        ) {
          this.x1 = point1.x
          this.y1 = point1.y
          this.x2 = point2.x
          this.y2 = point2.y
          this.alphe = 0
          this.lineWidth = 0
          this.dist = Math.sqrt(dist2)
          this.minDist = minDist

          this.init()
        }

        init () {
          this.getAlphe()
          this.getLineWeight()
        }

        draw () {
          if (context) {
            context.beginPath()
            context.lineWidth = this.lineWidth
            context.strokeStyle = 'rgba(112,194,184,' + this.alphe + ')'
            context.moveTo(this.x1, this.y1)
            context.lineTo(this.x2, this.y2)
            context.stroke()
            context.closePath()
          }
        }

        getLineWeight () {
          this.lineWidth = 1 - this.dist / this.minDist
        }

        getAlphe () {
          this.alphe = 1 - this.dist / this.minDist
        }
      }

      // 整体画布
      class Net {
        points: Point[] = []
        lines: Line[] = []
        pointSize = 100
        minDist = 150

        update () {
          for (let i = 0; i < this.pointSize; i++) {
            this.points[i].draw()
          }
          for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].draw()
          }
        }

        getDist (point1: Point, point2: Point) {
          const dx = point1.x - point2.x
          const dy = point1.y - point2.y
          return dx * dx + dy * dy
        }

        loadingLine () {
          this.lines = []
          for (let i = 0; i < this.pointSize; i++) {
            for (let j = 0; j < this.pointSize; j++) {
              const dist2 = this.getDist(this.points[i], this.points[j])
              if (dist2 < this.minDist * this.minDist) {
                this.lines.push(
                  new Line(this.points[i], this.points[j], dist2, this.minDist)
                )
              }
            }
          }
        }

        drawPage () {
          if (context) {
            context.beginPath()
            context.fillStyle = '#10181B'
            context.fillRect(0, 0, canvas.width, canvas.height)
            context.fill()
            context.closePath()
            this.loadingLine()
            this.update()

            requestAnimationFrame(this.drawPage.bind(this))
          }
        }

        start () {
          for (var i = 0; i < this.pointSize; i++) {
            this.points.push(new Point())
          }
          this.drawPage()
        }
      }

      var myNet = new Net()
      myNet.start()
    }
  }
}

export default TechnologyBackground
