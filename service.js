const http = require('http');
const path = require('path');
const fs = require('fs');
const conf = {
    hostname: '127.0.0.1',
    port:'8088',
    // process.cwd() 是当前Node.js进程执行时的文件夹地址——工作目录，保证了文件在不同的目录下执行时，路径始终不变
    // ps : __dirname 是被执行的js 文件的地址 ——文件所在目录
    root:process.cwd()
  }
const serve = http.createServer((req,res)=>{
    // 获取完整路径进行拼接
    // path.join  将个文件拼接成文件夹
    // req.url 请求体中的路径
    const filePath = path.join(conf.root,req.url)
    /*
    fs stat:虽然fs.exists方法可以检查文件是否存在，但是在新版本nodejs中，该方法已经标记为废弃的，不稳定的。官方给我们提供了另外一个方法来检测文件是够存在，那就是fs.stat(path,callback)方法。callback中有两个参数，分别为error & stats，其中，stats为fs.stat()返回的一个对象。
    stats对象中也给我提供了一下方法来判断给定的路径类型是否是文件类型还是目录类型。
     stats.isFile()：判断给定的path是否是文件类型。
     statsisDirectory()：判断给定的path是否是目录类型。
     isBlockDevice()：判断给定的path是否是块设备。
     isCharacterDevice()：判断给定的path是否是字符设备。
    isFIFO()：判断给定的path是否是FIFO。
     isSocket：判断给定的path是否是Socket 。
    */ 
    fs.stat(filePath,(err,stats)=>{
        // 判断文件是否存在
        if(err || !stats){
            res.statusCode = '400'
            res.setHeader('Content-Type', 'text/plain')
            res.end('this is no a files or directory')
            return;
        }
        // 判断是否是文件 是文件则返回文件
        if(stats.isFile()){
            console.log('filePath', filePath)
            if (filePath.includes('html')) {
                res.setHeader('Content-Type', 'text/html') // ; charset=utf-8
            } else if (filePath.includes('css')) {
            	res.setHeader('Content-Type', 'text/css')
            } else {
                res.setHeader('Content-Type', 'text/plain')
            }
            res.statusCode = '200'
        /* 
        1.fs.createReadStream 可读流 使用文件流进行文件复制,首先要创建一个可读流(Readable Stream),可读流可以让用户在源文件中分块读取文件中的数据,然后再从可读流中读取数据 创建可读流的语法如: fs.createReadStream(path[,options])
        2.fs.createWriteStream(path[,options]) 可写流(Writeable Stream)让用户可以写数据到目的地,像可读流一样,也是基于EventEmitter
        3.使用pipe()处理大文件:在使用大文件复制的案例中,通过可读流的chunk参数来传递数据,如果把数据比作是水,这个chunk就相当于盆,使用盆来完成水的传递.在可读流中还有一个函数叫pipe(),这个函数是一个很高效的文件处理方式,可以简化之前复制文件的操作,pipe翻译成中文是管子的意思,使用pipe()对文件进行复制就相当于把盆换成管子,通过管子完成数据的读取和写入
        */ 
            fs.createReadStream(filePath).pipe(res)
        }else if(stats.isDirectory()){ // 判断是否是目录 则返回目录下的目录
            // 读取文件readFile：第一个参数文件名，第二个参数可写可不写编码格式,第三个参数回调函数
            fs.readdir(filePath,(err,stats)=>{
                res.statusCode = '200'
                res.setHeader('Content-Type', 'text/plain')
                res.end(stats.join(','))
            })
        }
    })
    // res.statusCode = '200'
    // res.setHeader('Content-Type', 'text/html')
    // res.write('<html>')
    // res.write('<body>')
    // res.write('holle world!')
    // res.write('</body>')
    // res.write('</html>')
    // res.end()
})

serve.listen(conf.port,conf.hostname,()=>{
    console.log(`serve is run in http://${conf.hostname}:${conf.port}`);
})
