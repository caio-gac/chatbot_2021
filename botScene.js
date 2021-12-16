
const Scene = require('telegraf/scenes/base')

const echoScene = new Scene('echo')
echoScene.enter(ctx => ctx.reply(`Entrando com o Echo scene`))
echoScene.leave(ctx => ctx.reply(`Saindo com o Echo scene`))
echoScene.command('sair', leave())
echoScene.on('text',ctx => ctx.reply(ctx.message.text))
echoScene.on('message',ctx =>  ctx.reply('Apenas menssagens de texto podem ser enviadas'))

const locationScene = new Scene('location')
locationScene.enter(ctx => ctx.reply(`Entrando com o location scene`))
locationScene.leave(ctx => ctx.reply(`Saindo com o location scene`))
locationScene.command('sair', leave())
locationScene.on('text',ctx => ctx.reply(ctx.message.text))
locationScene.on('message',ctx =>  ctx.reply('Apenas menssagens de texto podem ser enviadas'))


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
bot.on('message',ctx =>  ctx.reply('entre com /echo ou /soma para inciar '))
