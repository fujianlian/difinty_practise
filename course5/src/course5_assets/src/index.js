import { Principal } from "@dfinity/principal";
import { course5 } from "../../declarations/course5";

async function setName() {
  let set_button = document.getElementById("set");
  set_button.disabled = true;
  let textarea = document.getElementById("name");
  let name = textarea.value;
  await course5.set_name(name)
  set_button.disabled = false;
  alert('set successed')
}

async function getName() {
  let name = await course5.get_name();
  let get_name = document.getElementById('get_name')
  get_name.innerText = 'name：' + (name == "nil" ? "null" : name);
}

async function post() {
  let post_button = document.getElementById("post");
  let textarea = document.getElementById("message");
  let text = textarea.value;
  let otp = document.getElementById("otp");
  let text1 = otp.value;
  if (text.length > 0 && text1.length > 0) {
    post_button.disabled = true;
    try {
      await course5.post(text1, text)
    } catch (error) {
      alert(error)
    }
    post_button.disabled = false;
  }
}

var num_posts = 0;

async function load_posts() {
  let posts_section = document.getElementById('posts_section')
  let posts = await course5.posts(0);
  if(num_posts == posts.length) return;
  posts_section.replaceChildren([]);
  num_posts = posts.length;
  for (var i = 0; i < posts.length; i++) {
    let post = document.createElement('p');
    post.innerText = posts[i].text + "，" + formatDate(posts[i].time);
    posts_section.appendChild(post);
  }
}

async function follow() {
  let follow_button = document.getElementById("follow");
  follow_button.disabled = true;
  let textarea = document.getElementById("follow_text");
  let text = textarea.value;
  console.log(text)
  try {
    await course5.follow(Principal.fromText(text))
    alert('follow success')
  } catch (error) {
    console.log(error)
    alert('follow fail')
  }
  follow_button.disabled = false;
}

var num_follows = 0;

async function load_follows() {
  let follows_section = document.getElementById('follows_section')
  let follows = await course5.get_follow_infos();
  if(num_follows == follows.length) return;
  follows_section.replaceChildren([]);
  num_follows = follows.length;
  for (var i = 0; i < follows.length; i++) {
    let section = document.createElement('section');
    let follow = document.createElement('sapn');
    let names = follows[i].name[0];
    follow.innerText = "@" + follows[i].cid + '，author: ' + names;
    let btn = document.createElement('button');
    btn.innerText = names;
    btn.onclick = async ()=>{
      btn.disabled = true;
      let timeLines = await course5.timeline(0);
      console.log('timeLines', timeLines, names)

      for (var i = 0; i < timeLines.length; i++) {
        if (timeLines[i].author == names) {
          let y = document.createElement('p');
          y.innerText = "content: " + timeLines[i].text + "，author: " + names + "，date: " + formatDate(timeLines[i].time);
          section.appendChild(y)
        }
      }
      btn.disabled = false;
    };
    section.appendChild(follow)
    section.appendChild(btn)
    follows_section.appendChild(section);
  }
}

 

//时间戳转换方法yyyy-MM-dd HH:mm:ss(时间戳)
function formatDate(time) {
  let t = parseInt(time.toString().substring(0, 13))
  console.log(t)
  let date = new Date(t);
  let YY = date.getFullYear();
  let MM = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  let DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  // 这里修改返回时间的格式
  return YY + "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss;
}

async function loadData() {
  load_posts()
  load_follows()
}

async function load() {
  let post_button = document.getElementById("post");
  post_button.onclick = post;
  let set_button = document.getElementById("set");
  set_button.onclick = setName;
  let get_button = document.getElementById("get");
  get_button.onclick = getName;
  let follow_button = document.getElementById("follow");
  follow_button.onclick = follow;
  load_posts()
  load_follows()
  setInterval(loadData, 3000)
}

window.onload = load