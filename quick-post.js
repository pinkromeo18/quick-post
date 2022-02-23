
function rkana(l=8){
  var c = "bcdfghjklmnpqrstvwxyz",cl=c.length,b ="aiueo",bl=b.length,r=""
  ,mf=Math.floor,mr=Math.random
  ;for(var i=0;i<l;i++) r+=(i%2)? b[mf(mr()*bl)]:c[mf(mr()*cl)].toUpperCase();
  return r;
}
function base64Encode(...parts) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const offset = reader.result.indexOf(",") + 1;
      resolve(reader.result.slice(offset));
    };
    reader.readAsDataURL(new Blob(parts));
  });
}
function base64Decode(text, charset) {
  charset=charset||'utf-8';
  return fetch(`data:text/plain;charset=${charset};base64,` + text)
    .then(response => response.text());
}
function iscodepen(){
  return /cdpn\.io|codepen\.io/.test(location.href)
};

/*
async function sha1(str) {
   const buff = new Uint8Array([].map.call(str, (c) => c.charCodeAt(0))).buffer;
   const digest = await crypto.subtle.digest('SHA-1', buff);
   return [].map.call(new Uint8Array(digest), x => ('00' + x.toString(16)).slice(-2)).join('');
 }
 */

function getopt(token1,token2){
  token1=token1||'',token2=token2||'';
  
  var url= location.href.slice(0,-1*location.search.length);
  if(/\/$/.test(url)) url=url + 'index.html';
  if(iscodepen()) url="https://pinkromeo18.github.io/quick-post/index.html";
  var ary=url.split('/').filter(d=>d).slice(1)
  .map(d=>{return /\.github\.io/.test(d)? d.slice(0,-1*".github.io".length) :d })
  ;
  var type=".txt";
  var o={}
  o.orgurl =url.slice(0,-1*ary[2].length)
  o.auth = token1 + token2;
  o.owner = ary[0];
  o.repo = ary[1];
  o.path = ary[2] + type;
  o.imgpath = 'img/';
  return o;
}

var _opt =getopt("ghp_WjFtZHMWbe2u3v4","Dhr5ziHCR2ufMNi37mp3f");

import { Octokit } from "https://cdn.skypack.dev/@octokit/core";

async function setimg(content,filename){
  var type='.'+filename.split('.').slice(-1);
  var name = rkana(8);
  var path =_opt.imgpath + name + type;
  //console.log(path);
  return await setfile(content,path);
}

async function setfile(content,path){
  content =await base64Encode(content);
  var add={
    message:new Date(),
    content,
  }
  if(path){
    add.path = path;
  }else{
    //update need the sha
    var sha = await isfile();
    if(sha) add.sha=sha;
  } 
  var opt =Object.assign({},_opt,add);
  const octokit = new Octokit(opt);
  
  const result = 
        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}',opt)  
  //console.log(result);
  return result.data.content.download_url
}

async function isfile(){
  var opt =Object.assign({},_opt);
  const octokit = new Octokit(opt);
  var ret=
   await octokit.request('GET /repos/{owner}/{repo}/contents/{path}',opt)
    .then(d=>{return d.data.sha})
    .catch(e=>{return false;})
  return ret;
}

async function getfile(){
  var opt =Object.assign({},_opt);
  const octokit = new Octokit(opt);
  const result=
   await octokit.request('GET /repos/{owner}/{repo}/contents/{path}',opt);
  //console.log(result);
  return base64Decode(result.data.content);
}
