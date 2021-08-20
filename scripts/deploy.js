const { exec } = require("child_process");

let cwd = "E:\\blog-press\\docs\\.vuepress\\dist";// 执行文件目录(默认为公司电脑)
const env = global.process.argv.slice(2)[0].slice(2);
if (env === 'home') {
  cwd = "D:\\study-file\\blog-press\\docs\\.vuepress\\dist";// 切换为自己电脑里的文件目录
}
console.log('当前环境：', env);
exec("git init", { cwd }, gitAdd);
function gitAdd(err, stdout) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
  exec("git add -A", { cwd }, gitCommit);
}
function gitCommit(err, stdout) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
  exec("git commit -m 'deploy'", { cwd }, gitRemote);
}
function gitRemote(err, stdout) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
  exec(
    "git remote add origin https://github.com/wzp-coding/wzp-coding.github.com.git",
    { cwd },
    gitPush
  );
}
function gitPush(err, stdout, stderr) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);

  exec("git push origin master -f", { cwd }, finish);
}
function finish(err, stdout) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(stdout);
  console.log("deploy success");
}
