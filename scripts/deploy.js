const { exec } = require("child_process");

let cwd = "E:\\blog-press\\docs\\.vuepress\\dist"; // 执行文件目录(默认为公司电脑)
const env = global.process.argv.slice(2)[0].slice(2);
if (env === "home") {
  cwd = "D:\\study-file\\blog-press\\docs\\.vuepress\\dist"; // 切换为自己电脑里的文件目录
}
console.log("当前环境：", env);

const github = "https://github.com/wzp-coding/wzp-coding.github.com.git";
const gitee = "https://gitee.com/wu_monkey/wzp-coding.github.com.git";

function getNowTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return `${year}-${month}-${day} ${hour}:${minutes}`;
}

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
    const commitInfo = `deploy_at_${getNowTime()}`;
    return asyncExec(`git commit -m '${commitInfo}'`);
    // return asyncExec(`git commit -m 'deploy'`);
  })
  .then(() => {
    pushRemote(github, "github").then(() =>
      console.log("push github successfully")
    );
    pushRemote(gitee, "gitee").then(() =>
      console.log("push gitee successfully")
    );
  })
  .catch((err) => console.log(err));
  
// asyncExec("git remote add ${name} ${remote}");
// exec("git init", { cwd }, gitAdd);
// function gitAdd(err, stdout) {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(stdout);
//   exec("git add -A", { cwd }, gitCommit);
// }
// function gitCommit(err, stdout) {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(stdout);
//   exec("git commit -m 'deploy'", { cwd }, gitPushRemote);
// }

// function gitPushRemote(err, stdout) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log(stdout);
//   createGitRemote(github, "github");
//   createGitRemote(gitee, "gitee");
// }

// function createGitRemote(remote, name) {
//   return function(err, stdout) {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log(stdout);
//     exec(`git remote add ${name} ${remote}`, { cwd }, createGitPush(name));
//   };
// }

// function createGitPush(originName) {
//   return function(err, stdout) {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log(stdout);

//     exec(`git push --set-upstream ${originName} master -f`, { cwd }, finish);
//   };
// }

// function finish(err, stdout) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log(stdout);
//   console.log("deploy success");
// }
