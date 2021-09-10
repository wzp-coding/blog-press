const { exec } = require("child_process");

let cwd = "E:\\blog-press\\docs\\.vuepress\\dist"; // 执行文件目录(默认为公司电脑)
const env = global.process.argv.slice(2)[0].slice(2);
if (env === "home") {
  cwd = "D:\\study-file\\blog-press\\docs\\.vuepress\\dist"; // 切换为自己电脑里的文件目录
}
console.log("当前环境：", env);

const github = "https://github.com/wzp-coding/wzp-coding.github.com.git";
const gitee = "https://gitee.com/wu_monkey/wzp-coding.github.com.git";

function asyncExec(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd }, function(err, stdout) {
      if (err) {
        reject(err);
        return;
      }
      console.log(stdout);
      resolve();
    });
  });
}

function pushRemote(remote, name) {
  return asyncExec(`git remote add ${name} ${remote}`)
    .then(() => {
      return asyncExec(`git push --set-upstream ${name} master -f`);
    })
    .catch((err) => console.log(err));
}

asyncExec("git init")
  .then(() => {
    return asyncExec("git add .");
  })
  .then(() => {
    return asyncExec(`git commit -m 'deploy'`);
  })
  .then(() => {
    pushRemote(github, "github").then(() =>
      console.log("push github successfully")
    );
    // pushRemote(gitee, "gitee").then(() =>
    //   console.log("push gitee successfully")
    // );
  })
  .catch((err) => console.log(err));
  