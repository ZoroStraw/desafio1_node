const express = require('express')
const nunjucks = require('nunjucks')

const app = express()

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'njk')

let age = ''

const ageMiddleware = (req, res, next) => {
  age = req.query.age

  if (age.length === 0) return res.redirect('/')
  else return next()
}

app.get('/', (req, res) => {
  return res.render('index')
})

app.post('/check', (req, res) => {
  age = req.body.age
  let viewByAge = ''

  if (age >= 18) viewByAge = '/major'
  else viewByAge = '/minor'

  return res.redirect(`${viewByAge}?age=${age}`)
})

app.get('/minor', ageMiddleware, (req, res) => {
  let s = age > 1 ? 's' : ''

  return res.render('confirm', {
    msg: `Você é menor de idade e possui ${age} ano${s}`
  })
})

app.get('/major', ageMiddleware, (req, res) => {
  return res.render('confirm', {
    msg: `Você é maior de idade e possui ${age} anos`
  })
})

app.listen(2000)
