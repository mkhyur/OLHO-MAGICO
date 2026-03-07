// OLHO MAGICO EXTREME PRO
// Developed by mk
// Network Forensic Build

let fm = FileManager.local()
let folder = await DocumentPicker.openFolder()

let proxyLogs=[]
let bypassLogs=[]

let proxyDetected=false
let bypassDetected=false

let proxyManual=false
let proxyServer=null
let proxyPort=null

const relevantLogs=[
"log",
"system",
"network",
"configd",
"wifi",
"extension",
"cfnetwork",
"networkextension"
]

const bypassIgnore=[

/cache bypass/i,
/routing bypass/i,
/policy bypass/i,
/ats bypass/i,
/ssl bypass/i,
/sandbox bypass/i,
/proxy bypass decision/i

]

const bypassDetect=[

/luxebypass/i,
/fatality/i,
/luxe\s*bypass/i,
/ff\s*bypass/i,
/freefire\s*bypass/i,
/garena\s*bypass/i,
/cheat\s*bypass/i,
/inject\s*bypass/i

]

function getFiles(dir){

let out=[]
let list=fm.listContents(dir)

for(let f of list){

let p=fm.joinPath(dir,f)

if(fm.isDirectory(p)){
out=out.concat(getFiles(p))
}else{
out.push(p)
}

}

return out
}

let files=getFiles(folder)

files=files.filter(f=>{
for(let r of relevantLogs){
if(f.toLowerCase().includes(r)) return true
}
return false
})

files=files.slice(0,600)

function extractDate(line){

let m=line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)

if(m) return m[0]

return "sem data"
}

function extractProxyInfo(line){

let host=line.match(/(HTTPProxy|HTTPSProxy|SOCKSProxy)[^0-9]*(\d{1,3}(\.\d{1,3}){3})/i)

if(host){
proxyServer=host[2]
}

let port=line.match(/(HTTPPort|HTTPSPort|SOCKSPort)[^0-9]*(\d{2,5})/i)

if(port){
proxyPort=port[2]
}

}

function analyzeProxy(line,file){

let indicators=[

/HTTPProxy/i,
/HTTPSProxy/i,
/SOCKSProxy/i,
/SOCKSEnable/i,
/ProxyEnable\s*=\s*1/i,
/kCFNetworkProxiesHTTPProxy/i,
/kCFNetworkProxiesHTTPPort/i,
/kCFNetworkProxiesSOCKSProxy/i,
/kCFNetworkProxiesSOCKSPort/i

]

let hit=false

for(let r of indicators){

if(r.test(line)){
hit=true
break
}

}

if(hit){

proxyDetected=true

if(/HTTPProxy|SOCKSProxy/i.test(line)){
proxyManual=true
}

extractProxyInfo(line)

proxyLogs.push({

file:file,
date:extractDate(line),
reason:"configuração de proxy",
line:line.slice(0,300)

})

}

}

function analyzeBypass(line,file){

for(let r of bypassIgnore){
if(r.test(line)) return
}

for(let r of bypassDetect){

if(r.test(line)){

bypassDetected=true

bypassLogs.push({

file:file,
date:extractDate(line),
reason:"bypass suspeito",
line:line.slice(0,300)

})

break

}

}

}

function scan(path){

try{

let data=fm.read(path)

let text=""

try{
text=data.toRawString()
}catch(e){
return
}

text=String(text)

if(text.length<40) return

if(text.length>600000){
text=text.slice(0,300000)+text.slice(-300000)
}

let lines=text.split("\n")

for(let line of lines){

let file=path.split("/").pop()

analyzeProxy(line,file)
analyzeBypass(line,file)

}

}catch(e){}

}

for(let f of files){
scan(f)
}

function color(status){

if(status=="clean") return "#22c55e"
if(status=="alert") return "#ff3b3b"

return "#facc15"
}

let proxyStatus="clean"
let proxyText="🟢 LIMPO"

if(proxyDetected){
proxyStatus="alert"
proxyText="🔴 PROXY DETECTADO"
}

let bypassStatus="clean"
let bypassText="🟢 LIMPO"

if(bypassDetected){
bypassStatus="alert"
bypassText="🔴 BYPASS DETECTADO"
}

let proxyDetails=""
let bypassDetails=""

if(proxyDetected){

proxyDetails+="<div class='warn'>"+proxyText+"</div>"

if(proxyManual){
proxyDetails+="<div class='line'>tipo: manual</div>"
}else{
proxyDetails+="<div class='line'>tipo: automático/sistema</div>"
}

if(proxyServer){
proxyDetails+="<div class='line'>servidor: "+proxyServer+"</div>"
}

if(proxyPort){
proxyDetails+="<div class='line'>porta: "+proxyPort+"</div>"
}

}

if(bypassDetected){
bypassDetails+="<div class='warn'>"+bypassText+"</div>"
}

let html=`

<html>
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>

body{
background:#000000;
color:white;
font-family:-apple-system;
padding:20px
}

.title{
font-size:34px;
font-weight:bold;
color:#ff2b2b
}

.card{
background:#0f0f0f;
padding:16px;
border-radius:14px;
margin-bottom:14px;
box-shadow:0 6px 12px rgba(0,0,0,0.3)
}

.file{
font-size:12px;
color:#ff6b6b
}

.line{
font-size:12px;
margin-top:6px;
color:#e5e5e5
}

.reason{
font-size:12px;
margin-top:6px;
color:#ff4d4d
}

.warn{
color:red;
font-size:13px;
margin-top:6px
}

.clean{
color:#22c55e;
font-size:13px;
margin-top:6px
}

</style>

<body>

<div class="title">OLHO MAGICO</div>
<div>Developed by mk</div>

<h3>Diagnóstico de Proxy</h3>

<div class="card" style="border-left:6px solid ${color(proxyStatus)}">

${proxyDetected ? proxyDetails : "<div class='clean'>🟢 LIMPO!! Nenhum uso de proxy detectado.</div>"}

</div>

<h3>Diagnóstico de Bypass</h3>

<div class="card" style="border-left:6px solid ${color(bypassStatus)}">

${bypassDetected ? bypassDetails : "<div class='clean'>🟢 LIMPO!! Nenhum bypass detectado.</div>"}

</div>

`

if(proxyDetected || bypassDetected){

html+=`<h3>Resultados</h3>`

let results=[...proxyLogs,...bypassLogs]

for(let r of results){

html+=`

<div class="card">

<div class="file">arquivo: ${r.file}</div>
<div class="file">data: ${r.date}</div>

<div class="reason">motivo: ${r.reason}</div>

<div class="line">${r.line}</div>

</div>

`

}

}

html+=`

</body>
</html>
`

let web=new WebView()
await web.loadHTML(html)
await web.present()