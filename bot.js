const env = require('./.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const axios = require('axios').default
const Composer = require('telegraf/composer')
const {enter, leave} = Stage


const bot = new Telegraf(env.token)

let dados = {}


bot.start(async ctx => {
    const from = ctx.update.message.from
    if (from.id != '1351450134') {
        ctx.reply(`Cai fora ${from.first_name} ${from.last_name}! Somente pessoal autorizado`)
    }
    else {
        ctx.reply(`Seja bem vindo meu Mestre! Senti sua falta!`)
    }
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo, ${name}!`)
    await ctx.reply('a')
    await ctx.reply('a')
    await ctx.reply('a')
    await ctx.reply('a')
    await ctx.reply('a')
    await ctx.reply('a')
    await ctx.replyWithHTML(` com html
    <a href="https://www.google.com">Google</a>`)
    await ctx.replyWithMarkdown('Com Markdown[Google](http://www.google.com)')
    
    await ctx.replyWithPhoto({source: `${__dirname}/doglink.jpg`})
    
    await ctx.replyWithLocation(37.9715285,23.7267166)
})



bot.on('location', ctx => {
    const loc = ctx.update.message.location
    console.log(loc)
    ctx.reply(`Entendido! Você está em: 
        Latitude: ${loc.latitude}, 
        Longitude: ${loc.longitude}`)    
})


bot.on('photo', ctx => {
    const foto = ctx.update.message.photo
    console.log(foto)
    console.log(foto.length)
    foto.forEach((ph, i) => {
        ctx.reply(`A ${i}a foto tem resolução de: ${ph.width} X ${ph.height} pixels`)        
    })
})

bot.on('contact', ctx => {
    const cont = ctx.update.message.contact
    console.log(cont)
    ctx.reply(`Legal! O telefone do ${cont.first_name} é ${cont.phone_number}`)

})

bot.on('sticker', ctx => {
    const stic = ctx.update.message.sticker
    console.log(stic)
    ctx.reply(`Você enviou o ${stic.emoji} do conjunto ${stic.set_name}`) 
})

bot.hears('oi',async ctx =>{
    await ctx.reply('oi')
})

bot.hears('pizza',async ctx => {
    await ctx.reply('Quero!')
})

const echoScene = new Scene('echo')
echoScene.enter(ctx => ctx.reply(`Entrando com o Echo scene`))
echoScene.leave(ctx => ctx.reply(`Saindo com o Echo scene`))
echoScene.command('sair', leave())
echoScene.on('text',ctx => ctx.reply(ctx.message.text))
echoScene.on('message',ctx =>  ctx.reply('Apenas menssagens de texto podem ser enviadas'))

let sum =0
const sumScene = new Scene('sum')
sumScene.enter(ctx => ctx.reply(`Entrando com o sum scene`))
sumScene.leave(ctx => ctx.reply(`Saindo com o sum scene`))
sumScene.use(async (ctx,next) => {
    await ctx.reply('Voce esta em Sum Scene. Escreva numeros para somar')
    await ctx.reply('Outros possiveis comandos /zerar /sair')
    next()
})

sumScene.command('zerar', ctx =>{
    sum = 0
    ctx.reply(`Valor: ${sum}`)
})

sumScene.command('sair', leave())
sumScene.hears(/(\d+)/, ctx => {
    sum += parseInt(ctx.match[1])
    ctx.reply(`Valor: ${sum}`)
})

sumScene.on('message',ctx => ctx.reply('Apenas numeros por favor!'))

const stage = new Stage([echoScene,sumScene])
bot.use(session())
bot.use(stage.middleware())
bot.command('sum', enter('sum'))
bot.command('echo', enter('echo'))

bot.startPolling()